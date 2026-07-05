import type {
  ApproveSchemaMappingInput,
  ColumnMapping,
  ConnectorDefinition,
  ConnectorSession,
  ImportSession,
  SchemaDiscoveryResult,
  StartConnectorSessionInput,
  UcieImportSourceType,
  UcieQualityDashboard,
  VoterRecord,
  VoterSearchFilter,
} from "@localbrain/shared";
import { UCIE_CONNECTOR_TYPES, UCIE_VERSION } from "@localbrain/shared";
import crypto from "node:crypto";
import { parseCsvRecords } from "../contacts/contactCsv.js";
import { resolveIdentityForRow } from "./ucieIdentityResolutionService.js";
import {
  discoverSchemaMappings,
  fingerprintHeaders,
  loadSavedSchemaMapping,
  normalizeRowWithMappings,
  saveSchemaMapping,
} from "./ucieSchemaDiscoveryService.js";
import {
  createImportArtifact,
  createImportBatch,
  createImportFile,
  createImportSession,
  getImportRow,
  incrementSessionCounts,
  insertImportRow,
  listImportRows,
  sha256,
  updateImportRowState,
  updateSessionStatus,
} from "./ucieSessionRepository.js";
import type { UcieAccessContext } from "./ucieValidator.js";
import { assertUcieCapable, canIntakeUcie } from "./ucieValidator.js";
import { createWorkItem } from "./ucieWorkService.js";
import { getDatabase } from "../db/database.js";

export function startImportSession(
  input: {
    workspace_id: string;
    source_type: UcieImportSourceType;
    source_label?: string;
  },
  ctx: UcieAccessContext,
): ImportSession {
  assertUcieCapable(canIntakeUcie(ctx), "forbidden", "Insufficient permissions for UCIE intake");
  const session = createImportSession({
    workspace_id: input.workspace_id,
    source_type: input.source_type,
    source_label: input.source_label ?? input.source_type,
    created_by_user_id: ctx.user_id,
  });
  updateSessionStatus(session.session_id, "intake");
  return session;
}

export function intakeCsvToSession(input: {
  session_id: string;
  filename: string;
  csv_text: string;
  uploaded_by_user_id: string;
}): { file_id: string; row_count: number; schema: SchemaDiscoveryResult } {
  const session = getDatabase()
    .prepare(`SELECT * FROM ucie_import_sessions WHERE session_id = ?`)
    .get(input.session_id) as { workspace_id: string; source_type: string } | undefined;
  if (!session) throw new Error("session_not_found");

  const checksum = sha256(input.csv_text);
  createImportFile({
    session_id: input.session_id,
    workspace_id: session.workspace_id,
    filename: input.filename,
    mime_type: "text/csv",
    byte_size: Buffer.byteLength(input.csv_text, "utf8"),
    checksum,
    uploaded_by_user_id: input.uploaded_by_user_id,
  });

  const records = parseCsvRecords(input.csv_text);
  if (records.length === 0) {
    return {
      file_id: input.filename,
      row_count: 0,
      schema: { session_id: input.session_id, header_fingerprint: "", mappings: [], unmapped_columns: [], requires_approval: false },
    };
  }

  const headers = records[0]!.map((h) => h.trim());
  const saved = loadSavedSchemaMapping(session.workspace_id, session.source_type, fingerprintHeaders(headers));
  const discovered = discoverSchemaMappings(headers);
  discovered.session_id = input.session_id;
  if (saved) {
    discovered.mappings = saved.map((m) => ({ ...m, approved: true }));
    discovered.requires_approval = false;
  }

  const batch = createImportBatch(input.session_id, session.workspace_id, 0);
  let rowIndex = 0;
  for (const cells of records.slice(1)) {
    const raw: Record<string, string> = {};
    headers.forEach((header, idx) => {
      raw[header] = cells[idx]?.trim() ?? "";
    });
    if (!Object.values(raw).some(Boolean)) continue;
    insertImportRow({
      session_id: input.session_id,
      batch_id: batch.batch_id,
      workspace_id: session.workspace_id,
      row_index: rowIndex++,
      raw,
      source_type: session.source_type as UcieImportSourceType,
      uploaded_by_user_id: input.uploaded_by_user_id,
    });
  }

  updateSessionStatus(input.session_id, "schema_discovery");
  return { file_id: input.filename, row_count: rowIndex, schema: discovered };
}

export function approveSchemaForSession(input: ApproveSchemaMappingInput): SchemaDiscoveryResult {
  const session = getDatabase()
    .prepare(`SELECT workspace_id, source_type FROM ucie_import_sessions WHERE session_id = ?`)
    .get(input.session_id) as { workspace_id: string; source_type: string } | undefined;
  if (!session) throw new Error("session_not_found");

  if (input.remember_for_future && input.mappings.length > 0) {
    saveSchemaMapping({
      workspace_id: session.workspace_id,
      source_type: session.source_type,
      header_fingerprint: fingerprintHeaders(input.mappings.map((m) => m.source_column)),
      mappings: input.mappings,
      approved_by_user_id: input.approved_by_user_id,
    });
  }

  const rows = listImportRows(input.session_id);
  for (const row of rows) {
    const raw = JSON.parse(row.raw_json) as Record<string, string>;
    const normalized = normalizeRowWithMappings(raw, input.mappings);
    updateImportRowState(row.row_id, "normalized", { normalized_json: JSON.stringify(normalized) });
  }

  updateSessionStatus(input.session_id, "matching");
  for (const row of rows) {
    resolveIdentityForRow(row.row_id);
  }
  updateSessionStatus(input.session_id, "review");

  return {
    session_id: input.session_id,
    header_fingerprint: fingerprintHeaders(input.mappings.map((m) => m.source_column)),
    mappings: input.mappings,
    unmapped_columns: [],
    requires_approval: false,
  };
}

export function intakeManualRow(input: {
  session_id: string;
  fields: Record<string, string>;
  uploaded_by_user_id: string;
}): string {
  const session = getDatabase()
    .prepare(`SELECT workspace_id, source_type FROM ucie_import_sessions WHERE session_id = ?`)
    .get(input.session_id) as { workspace_id: string; source_type: string } | undefined;
  if (!session) throw new Error("session_not_found");

  const batch = createImportBatch(input.session_id, session.workspace_id, 0);
  const row = insertImportRow({
    session_id: input.session_id,
    batch_id: batch.batch_id,
    workspace_id: session.workspace_id,
    row_index: 0,
    raw: input.fields,
    source_type: "manual_entry",
    uploaded_by_user_id: input.uploaded_by_user_id,
  });
  updateImportRowState(row.row_id, "normalized", { normalized_json: JSON.stringify(input.fields) });
  resolveIdentityForRow(row.row_id);
  return row.row_id;
}

export function intakeOcrArtifact(input: {
  session_id: string;
  filename: string;
  storage_ref: string;
  extracted_fields: Record<string, string>;
  uploaded_by_user_id: string;
}): string {
  const session = getDatabase()
    .prepare(`SELECT workspace_id FROM ucie_import_sessions WHERE session_id = ?`)
    .get(input.session_id) as { workspace_id: string } | undefined;
  if (!session) throw new Error("session_not_found");

  const checksum = sha256(input.storage_ref + JSON.stringify(input.extracted_fields));
  createImportArtifact({
    session_id: input.session_id,
    workspace_id: session.workspace_id,
    artifact_type: "ocr_image",
    storage_ref: input.storage_ref,
    checksum,
    metadata_json: JSON.stringify({ filename: input.filename }),
  });

  const batch = createImportBatch(input.session_id, session.workspace_id, 0);
  const row = insertImportRow({
    session_id: input.session_id,
    batch_id: batch.batch_id,
    workspace_id: session.workspace_id,
    row_index: 0,
    raw: input.extracted_fields,
    source_type: "ocr_image",
    uploaded_by_user_id: input.uploaded_by_user_id,
  });
  updateImportRowState(row.row_id, "normalized", { normalized_json: JSON.stringify(input.extracted_fields) });
  createWorkItem({
    workspace_id: session.workspace_id,
    session_id: input.session_id,
    row_id: row.row_id,
    item_type: "ocr_review",
    title: `OCR review: ${input.extracted_fields.display_name ?? input.filename}`,
    detail: "One-at-a-time OCR confirmation required before commit.",
  });
  incrementSessionCounts(input.session_id, { review_count: 1 });
  resolveIdentityForRow(row.row_id);
  return row.row_id;
}

export function seedVoterRecord(record: Omit<VoterRecord, "voter_id"> & { voter_id?: string }): VoterRecord {
  const voter_id = record.voter_id ?? crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT OR REPLACE INTO ucie_voter_records (
        voter_id, workspace_id, county, last_name, first_name, middle_name,
        address_line1, city, state, postal_code, date_of_birth
      ) VALUES (
        @voter_id, @workspace_id, @county, @last_name, @first_name, @middle_name,
        @address_line1, @city, @state, @postal_code, @date_of_birth
      )`,
    )
    .run({
      voter_id,
      workspace_id: record.workspace_id,
      county: record.county,
      last_name: record.last_name,
      first_name: record.first_name,
      middle_name: record.middle_name ?? null,
      address_line1: record.address_line1 ?? null,
      city: record.city ?? null,
      state: record.state ?? null,
      postal_code: record.postal_code ?? null,
      date_of_birth: record.date_of_birth ?? null,
    });
  return { ...record, voter_id };
}

export function searchVoters(filter: VoterSearchFilter): VoterRecord[] {
  let sql = `SELECT * FROM ucie_voter_records WHERE workspace_id = @workspace_id AND county = @county`;
  const params: Record<string, string> = {
    workspace_id: filter.workspace_id,
    county: filter.county,
  };
  if (filter.last_name) {
    sql += ` AND lower(last_name) LIKE lower(@last_name)`;
    params.last_name = `${filter.last_name}%`;
  }
  if (filter.first_name) {
    sql += ` AND lower(first_name) LIKE lower(@first_name)`;
    params.first_name = `${filter.first_name}%`;
  }
  if (filter.address) {
    sql += ` AND lower(address_line1) LIKE lower(@address)`;
    params.address = `%${filter.address}%`;
  }
  if (filter.date_of_birth) {
    sql += ` AND date_of_birth = @date_of_birth`;
    params.date_of_birth = filter.date_of_birth;
  }
  sql += ` ORDER BY last_name ASC, first_name ASC LIMIT 50`;
  return getDatabase().prepare(sql).all(params) as VoterRecord[];
}

export function attachVoterToRow(input: {
  row_id: string;
  voter_id: string;
  verified_by_user_id: string;
}): void {
  const row = getImportRow(input.row_id);
  if (!row) throw new Error("row_not_found");
  const voter = getDatabase()
    .prepare(`SELECT * FROM ucie_voter_records WHERE voter_id = ?`)
    .get(input.voter_id) as VoterRecord | undefined;
  if (!voter) throw new Error("voter_not_found");

  const normalized = row.normalized_json
    ? (JSON.parse(row.normalized_json) as Record<string, string>)
    : {};
  normalized.display_name = `${voter.first_name} ${voter.last_name}`.trim();
  normalized.first_name = voter.first_name;
  normalized.last_name = voter.last_name;
  normalized.address_line1 = voter.address_line1 ?? normalized.address_line1;
  normalized.county = voter.county;
  normalized.date_of_birth = voter.date_of_birth ?? normalized.date_of_birth;
  updateImportRowState(row.row_id, "normalized", { normalized_json: JSON.stringify(normalized) });
  resolveIdentityForRow(row.row_id);
}

export function createVoterVerificationWorkItem(input: {
  workspace_id: string;
  row_id: string;
  detail: string;
}): void {
  createWorkItem({
    workspace_id: input.workspace_id,
    row_id: input.row_id,
    item_type: "voter_verification",
    title: "Voter verification required",
    detail: input.detail,
  });
}

const CONNECTOR_DEFS: ConnectorDefinition[] = UCIE_CONNECTOR_TYPES.map((connector_type) => ({
  connector_type,
  label: connector_type.replace(/_/g, " "),
  description: "Temporary import connection — disconnect after import (v1.0).",
  supports_temporary_import: true,
  supports_permanent_sync: false,
}));

export function listConnectorDefinitions(): ConnectorDefinition[] {
  return CONNECTOR_DEFS;
}

export function startConnectorSession(
  input: StartConnectorSessionInput,
  ctx: UcieAccessContext,
): ConnectorSession {
  assertUcieCapable(canIntakeUcie(ctx), "forbidden", "Insufficient permissions for connectors");
  const connector_session_id = crypto.randomUUID();
  const connected_at = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_connector_sessions (
        connector_session_id, workspace_id, connector_type, status, connected_by_user_id, connected_at
      ) VALUES (
        @connector_session_id, @workspace_id, @connector_type, 'connected', @connected_by_user_id, @connected_at
      )`,
    )
    .run({
      connector_session_id,
      workspace_id: input.workspace_id,
      connector_type: input.connector_type,
      connected_by_user_id: input.connected_by_user_id,
      connected_at,
    });
  return {
    connector_session_id,
    workspace_id: input.workspace_id,
    connector_type: input.connector_type,
    status: "connected",
    connected_by_user_id: input.connected_by_user_id,
    connected_at,
  };
}

export function disconnectConnectorSession(connectorSessionId: string): void {
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE ucie_connector_sessions SET status = 'disconnected', disconnected_at = @now WHERE connector_session_id = @id`,
    )
    .run({ id: connectorSessionId, now });
}

export function buildQualityDashboard(workspaceId: string): UcieQualityDashboard {
  const sessions = getDatabase()
    .prepare(`SELECT COUNT(*) AS c FROM ucie_import_sessions WHERE workspace_id = ?`)
    .get(workspaceId) as { c: number };
  const rows = getDatabase()
    .prepare(`SELECT COUNT(*) AS c FROM ucie_import_rows WHERE workspace_id = ?`)
    .get(workspaceId) as { c: number };
  const committed = getDatabase()
    .prepare(`SELECT COUNT(*) AS c FROM ucie_import_rows WHERE workspace_id = ? AND processing_state = 'committed'`)
    .get(workspaceId) as { c: number };
  const matchRows = getDatabase()
    .prepare(
      `SELECT outcome, COUNT(*) AS c FROM ucie_match_results m
       JOIN ucie_import_rows r ON r.row_id = m.row_id
       WHERE r.workspace_id = ? GROUP BY outcome`,
    )
    .all(workspaceId) as { outcome: string; c: number }[];
  const distribution = {
    exact_match: 0,
    high_confidence: 0,
    review_required: 0,
    new_identity: 0,
  };
  for (const row of matchRows) {
    if (row.outcome in distribution) {
      distribution[row.outcome as keyof typeof distribution] = row.c;
    }
  }
  const ocr_backlog = getDatabase()
    .prepare(
      `SELECT COUNT(*) AS c FROM ucie_work_items WHERE workspace_id = ? AND item_type = 'ocr_review' AND status IN ('open','claimed')`,
    )
    .get(workspaceId) as { c: number };
  const open_work = getDatabase()
    .prepare(`SELECT COUNT(*) AS c FROM ucie_work_items WHERE workspace_id = ? AND status IN ('open','claimed')`)
    .get(workspaceId) as { c: number };
  const claims = getDatabase()
    .prepare(`SELECT COUNT(*) AS c FROM ucie_work_claims c JOIN ucie_work_items w ON w.work_item_id = c.work_item_id WHERE w.workspace_id = ?`)
    .get(workspaceId) as { c: number };
  const voterVerificationCount = getDatabase()
    .prepare(
      `SELECT COUNT(*) AS c FROM ucie_work_items WHERE workspace_id = ? AND item_type = 'voter_verification' AND status IN ('open','claimed')`,
    )
    .get(workspaceId) as { c: number };

  const totalRows = rows.c || 0;
  const committedCount = committed.c || 0;

  return {
    engine_id: UCIE_VERSION,
    workspace_id: workspaceId,
    computed_at: new Date().toISOString(),
    import_success_rate_percent: totalRows === 0 ? 0 : Math.round((committedCount / totalRows) * 100),
    duplicate_rate_percent:
      totalRows === 0
        ? 0
        : Math.round(((distribution.exact_match + distribution.high_confidence) / totalRows) * 100),
    match_confidence_distribution: distribution,
    ocr_backlog: ocr_backlog.c,
    volunteer_claim_rate_percent: open_work.c === 0 ? 0 : Math.round((claims.c / open_work.c) * 100),
    verification_turnaround_hours: 0,
    county_verification_backlog: { all: voterVerificationCount.c },
    connector_usage: {},
    open_work_items: open_work.c,
    total_sessions: sessions.c,
    total_rows_staged: totalRows,
    total_rows_committed: committedCount,
  };
}
