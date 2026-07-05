import type {
  ColumnMapping,
  SchemaDiscoveryResult,
  UcieCanonicalField,
  UcieMappingConfidence,
} from "@localbrain/shared";
import crypto from "node:crypto";
import { getDatabase } from "../db/database.js";
import { sha256 } from "./ucieSessionRepository.js";

const FIELD_HINTS: Record<UcieCanonicalField, RegExp[]> = {
  display_name: [/^(full\s*)?name$/i, /^display/i, /^contact/i],
  first_name: [/first/i, /^fname$/i],
  last_name: [/last/i, /^lname$/i, /surname/i],
  phone: [/phone/i, /^tel$/i, /telephone/i],
  mobile: [/mobile/i, /cell/i],
  email: [/e-?mail/i],
  address_line1: [/address/i, /street/i, /^addr/i],
  city: [/city/i, /town/i],
  county: [/county/i],
  state: [/state/i, /^st$/i],
  postal_code: [/zip/i, /postal/i],
  employer: [/employer/i, /company/i],
  organization: [/org/i, /affiliation/i],
  notes: [/note/i, /comment/i],
  tags: [/tag/i],
  date_of_birth: [/dob/i, /birth/i],
};

function confidenceForMatch(header: string, pattern: RegExp): UcieMappingConfidence {
  const normalized = header.trim();
  if (pattern.test(normalized)) {
    return normalized.toLowerCase() === header.toLowerCase().replace(/\s+/g, "_") ? "high" : "medium";
  }
  return "unknown";
}

export function fingerprintHeaders(headers: readonly string[]): string {
  return sha256(headers.map((h) => h.trim().toLowerCase()).join("|"));
}

export function discoverSchemaMappings(headers: readonly string[]): SchemaDiscoveryResult {
  const mappings: ColumnMapping[] = [];
  const mappedHeaders = new Set<string>();

  for (const header of headers) {
    let best: { field: UcieCanonicalField; confidence: UcieMappingConfidence } | null = null;
    for (const [field, patterns] of Object.entries(FIELD_HINTS) as [UcieCanonicalField, RegExp[]][]) {
      for (const pattern of patterns) {
        if (!pattern.test(header.trim())) continue;
        const confidence = confidenceForMatch(header, pattern);
        if (!best || rankConfidence(confidence) > rankConfidence(best.confidence)) {
          best = { field, confidence };
        }
      }
    }
    if (best && best.confidence !== "unknown") {
      mappings.push({
        source_column: header,
        canonical_field: best.field,
        confidence: best.confidence,
        approved: best.confidence === "high",
      });
      mappedHeaders.add(header);
    }
  }

  const unmapped = headers.filter((h) => !mappedHeaders.has(h));
  const requires_approval = mappings.some((m) => !m.approved) || unmapped.length > 0;

  return {
    session_id: "",
    header_fingerprint: fingerprintHeaders(headers),
    mappings,
    unmapped_columns: unmapped,
    requires_approval,
  };
}

function rankConfidence(c: UcieMappingConfidence): number {
  return c === "high" ? 3 : c === "medium" ? 2 : c === "low" ? 1 : 0;
}

export function loadSavedSchemaMapping(
  workspaceId: string,
  sourceType: string,
  headerFingerprint: string,
): ColumnMapping[] | null {
  const row = getDatabase()
    .prepare(
      `SELECT mappings_json FROM ucie_schema_mappings
       WHERE workspace_id = ? AND source_type = ? AND header_fingerprint = ?
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(workspaceId, sourceType, headerFingerprint) as { mappings_json: string } | undefined;
  if (!row) return null;
  return JSON.parse(row.mappings_json) as ColumnMapping[];
}

export function saveSchemaMapping(input: {
  workspace_id: string;
  source_type: string;
  header_fingerprint: string;
  mappings: readonly ColumnMapping[];
  approved_by_user_id: string;
}): void {
  const mapping_id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_schema_mappings (
        mapping_id, workspace_id, source_type, header_fingerprint, mappings_json, approved_by_user_id, created_at
      ) VALUES (
        @mapping_id, @workspace_id, @source_type, @header_fingerprint, @mappings_json, @approved_by_user_id, @created_at
      )`,
    )
    .run({
      mapping_id,
      workspace_id: input.workspace_id,
      source_type: input.source_type,
      header_fingerprint: input.header_fingerprint,
      mappings_json: JSON.stringify(input.mappings),
      approved_by_user_id: input.approved_by_user_id,
      created_at,
    });
}

export function normalizeRowWithMappings(
  raw: Record<string, string>,
  mappings: readonly ColumnMapping[],
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const mapping of mappings) {
    if (!mapping.approved) continue;
    const value = raw[mapping.source_column]?.trim();
    if (value) normalized[mapping.canonical_field] = value;
  }
  if (!normalized.display_name && (normalized.first_name || normalized.last_name)) {
    normalized.display_name = [normalized.first_name, normalized.last_name].filter(Boolean).join(" ").trim();
  }
  return normalized;
}
