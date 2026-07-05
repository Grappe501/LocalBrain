import crypto from "node:crypto";
import type { FieldProvenance, UcieProvenanceChain } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export function recordFieldProvenance(input: {
  contact_id: string;
  field_name: string;
  field_value: string;
  source_type: string;
  source_label: string;
  uploaded_by_user_id?: string;
  confirmed_by_user_id?: string;
  session_id?: string;
  row_id?: string;
}): FieldProvenance {
  const provenance_id = crypto.randomUUID();
  const verified_at = input.confirmed_by_user_id ? new Date().toISOString() : undefined;
  const created_at = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_field_provenance (
        provenance_id, contact_id, field_name, field_value, source_type, source_label,
        uploaded_by_user_id, confirmed_by_user_id, session_id, row_id, verified_at, created_at
      ) VALUES (
        @provenance_id, @contact_id, @field_name, @field_value, @source_type, @source_label,
        @uploaded_by_user_id, @confirmed_by_user_id, @session_id, @row_id, @verified_at, @created_at
      )`,
    )
    .run({
      provenance_id,
      ...input,
      uploaded_by_user_id: input.uploaded_by_user_id ?? null,
      confirmed_by_user_id: input.confirmed_by_user_id ?? null,
      session_id: input.session_id ?? null,
      row_id: input.row_id ?? null,
      verified_at: verified_at ?? null,
      created_at,
    });
  return { provenance_id, ...input, verified_at, created_at };
}

export function listProvenanceForContact(contactId: string, fieldName?: string): UcieProvenanceChain[] {
  let sql = `SELECT * FROM ucie_field_provenance WHERE contact_id = ?`;
  const params: string[] = [contactId];
  if (fieldName) {
    sql += ` AND field_name = ?`;
    params.push(fieldName);
  }
  sql += ` ORDER BY field_name ASC, created_at ASC`;
  const rows = getDatabase().prepare(sql).all(...params) as FieldProvenance[];
  const byField = new Map<string, FieldProvenance[]>();
  for (const row of rows) {
    const bucket = byField.get(row.field_name) ?? [];
    bucket.push(row);
    byField.set(row.field_name, bucket);
  }
  return [...byField.entries()].map(([field_name, entries]) => ({ contact_id: contactId, field_name, entries }));
}
