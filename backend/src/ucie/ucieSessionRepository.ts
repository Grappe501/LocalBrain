import crypto from "node:crypto";
import type {
  ImportBatch,
  ImportFile,
  ImportRow,
  ImportSession,
  UcieImportSourceType,
  UcieRowProcessingState,
  UcieSessionStatus,
} from "@localbrain/shared";
import { UCIE_VERSION } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

type SessionRow = {
  session_id: string;
  workspace_id: string;
  source_type: string;
  source_label: string;
  status: string;
  created_by_user_id: string;
  row_count: number;
  committed_count: number;
  review_count: number;
  checksum: string | null;
  created_at: string;
  updated_at: string;
};

function rowToSession(row: SessionRow): ImportSession {
  return {
    engine_id: UCIE_VERSION,
    session_id: row.session_id,
    workspace_id: row.workspace_id,
    source_type: row.source_type as UcieImportSourceType,
    source_label: row.source_label,
    status: row.status as UcieSessionStatus,
    created_by_user_id: row.created_by_user_id,
    row_count: row.row_count,
    committed_count: row.committed_count,
    review_count: row.review_count,
    checksum: row.checksum ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function createImportSession(input: {
  workspace_id: string;
  source_type: UcieImportSourceType;
  source_label: string;
  created_by_user_id: string;
}): ImportSession {
  const now = new Date().toISOString();
  const session_id = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_import_sessions (
        session_id, workspace_id, source_type, source_label, status,
        created_by_user_id, row_count, committed_count, review_count, created_at, updated_at
      ) VALUES (
        @session_id, @workspace_id, @source_type, @source_label, 'draft',
        @created_by_user_id, 0, 0, 0, @now, @now
      )`,
    )
    .run({
      session_id,
      workspace_id: input.workspace_id,
      source_type: input.source_type,
      source_label: input.source_label,
      created_by_user_id: input.created_by_user_id,
      now,
    });
  return getImportSession(session_id)!;
}

export function getImportSession(sessionId: string): ImportSession | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM ucie_import_sessions WHERE session_id = ?`)
    .get(sessionId) as SessionRow | undefined;
  return row ? rowToSession(row) : null;
}

export function listImportSessions(workspaceId: string): ImportSession[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM ucie_import_sessions WHERE workspace_id = ? ORDER BY created_at DESC`,
    )
    .all(workspaceId) as SessionRow[];
  return rows.map(rowToSession);
}

export function updateSessionStatus(sessionId: string, status: UcieSessionStatus): void {
  const now = new Date().toISOString();
  getDatabase()
    .prepare(`UPDATE ucie_import_sessions SET status = @status, updated_at = @now WHERE session_id = @session_id`)
    .run({ session_id: sessionId, status, now });
}

export function incrementSessionCounts(
  sessionId: string,
  delta: { row_count?: number; committed_count?: number; review_count?: number },
): void {
  const session = getImportSession(sessionId);
  if (!session) return;
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE ucie_import_sessions SET
        row_count = @row_count,
        committed_count = @committed_count,
        review_count = @review_count,
        updated_at = @now
       WHERE session_id = @session_id`,
    )
    .run({
      session_id: sessionId,
      row_count: session.row_count + (delta.row_count ?? 0),
      committed_count: session.committed_count + (delta.committed_count ?? 0),
      review_count: session.review_count + (delta.review_count ?? 0),
      now,
    });
}

export function createImportBatch(sessionId: string, workspaceId: string, batchIndex: number): ImportBatch {
  const batch_id = crypto.randomUUID();
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_import_batches (batch_id, session_id, workspace_id, batch_index, row_count, created_at)
       VALUES (@batch_id, @session_id, @workspace_id, @batch_index, 0, @now)`,
    )
    .run({ batch_id, session_id: sessionId, workspace_id: workspaceId, batch_index: batchIndex, now });
  return { batch_id, session_id: sessionId, workspace_id: workspaceId, batch_index: batchIndex, row_count: 0, created_at: now };
}

export function createImportFile(input: {
  session_id: string;
  workspace_id: string;
  filename: string;
  mime_type?: string;
  byte_size: number;
  checksum: string;
  uploaded_by_user_id: string;
}): ImportFile {
  const file_id = crypto.randomUUID();
  const uploaded_at = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_import_files (
        file_id, session_id, workspace_id, filename, mime_type, byte_size, checksum, uploaded_by_user_id, uploaded_at
      ) VALUES (
        @file_id, @session_id, @workspace_id, @filename, @mime_type, @byte_size, @checksum, @uploaded_by_user_id, @uploaded_at
      )`,
    )
    .run({ file_id, ...input, mime_type: input.mime_type ?? null, uploaded_at });
  return { file_id, ...input, uploaded_at };
}

export function insertImportRow(input: {
  session_id: string;
  batch_id: string;
  workspace_id: string;
  row_index: number;
  raw: Record<string, unknown>;
  source_type: UcieImportSourceType;
  uploaded_by_user_id: string;
}): ImportRow {
  const row_id = crypto.randomUUID();
  const now = new Date().toISOString();
  const raw_json = JSON.stringify(input.raw);
  const checksum = sha256(raw_json);
  getDatabase()
    .prepare(
      `INSERT INTO ucie_import_rows (
        row_id, session_id, batch_id, workspace_id, row_index, processing_state,
        raw_json, source_type, uploaded_by_user_id, checksum, created_at, updated_at
      ) VALUES (
        @row_id, @session_id, @batch_id, @workspace_id, @row_index, 'pending',
        @raw_json, @source_type, @uploaded_by_user_id, @checksum, @now, @now
      )`,
    )
    .run({
      row_id,
      session_id: input.session_id,
      batch_id: input.batch_id,
      workspace_id: input.workspace_id,
      row_index: input.row_index,
      raw_json,
      source_type: input.source_type,
      uploaded_by_user_id: input.uploaded_by_user_id,
      checksum,
      now,
    });
  incrementSessionCounts(input.session_id, { row_count: 1 });
  return getImportRow(row_id)!;
}

export function getImportRow(rowId: string): ImportRow | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM ucie_import_rows WHERE row_id = ?`)
    .get(rowId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    row_id: row.row_id as string,
    session_id: row.session_id as string,
    batch_id: row.batch_id as string,
    workspace_id: row.workspace_id as string,
    row_index: row.row_index as number,
    processing_state: row.processing_state as UcieRowProcessingState,
    raw_json: row.raw_json as string,
    normalized_json: (row.normalized_json as string) ?? undefined,
    source_type: row.source_type as UcieImportSourceType,
    uploaded_by_user_id: row.uploaded_by_user_id as string,
    checksum: row.checksum as string,
    match_outcome: (row.match_outcome as string) ?? undefined,
    committed_contact_id: (row.committed_contact_id as string) ?? undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function listImportRows(sessionId: string): ImportRow[] {
  const rows = getDatabase()
    .prepare(`SELECT * FROM ucie_import_rows WHERE session_id = ? ORDER BY row_index ASC`)
    .all(sessionId) as Record<string, unknown>[];
  return rows.map((row) => getImportRow(row.row_id as string)!);
}

export function updateImportRowState(
  rowId: string,
  state: UcieRowProcessingState,
  patch: { normalized_json?: string; match_outcome?: string; committed_contact_id?: string } = {},
): void {
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE ucie_import_rows SET
        processing_state = @state,
        normalized_json = COALESCE(@normalized_json, normalized_json),
        match_outcome = COALESCE(@match_outcome, match_outcome),
        committed_contact_id = COALESCE(@committed_contact_id, committed_contact_id),
        updated_at = @now
       WHERE row_id = @row_id`,
    )
    .run({
      row_id: rowId,
      state,
      normalized_json: patch.normalized_json ?? null,
      match_outcome: patch.match_outcome ?? null,
      committed_contact_id: patch.committed_contact_id ?? null,
      now,
    });
}

export function createImportArtifact(input: {
  session_id: string;
  workspace_id: string;
  artifact_type: "ocr_image" | "pdf" | "raw_export" | "other";
  storage_ref: string;
  checksum: string;
  metadata_json?: string;
}): void {
  const artifact_id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_import_artifacts (
        artifact_id, session_id, workspace_id, artifact_type, storage_ref, checksum, metadata_json, created_at
      ) VALUES (
        @artifact_id, @session_id, @workspace_id, @artifact_type, @storage_ref, @checksum, @metadata_json, @created_at
      )`,
    )
    .run({ artifact_id, ...input, metadata_json: input.metadata_json ?? null, created_at });
}
