import type { CommitImportRowResult } from "@localbrain/shared";
import { createContact } from "../contacts/contactRepository.js";
import { getMatchResult } from "./ucieIdentityResolutionService.js";
import { recordFieldProvenance } from "./ucieProvenanceService.js";
import {
  getImportRow,
  getImportSession,
  incrementSessionCounts,
  updateImportRowState,
} from "./ucieSessionRepository.js";
import { UcieValidationError } from "./ucieValidator.js";

export function commitImportRow(input: {
  row_id: string;
  committed_by_user_id: string;
  force_create?: boolean;
}): CommitImportRowResult | null {
  const row = getImportRow(input.row_id);
  if (!row) return null;
  const session = getImportSession(row.session_id);
  if (!session) return null;

  const match = getMatchResult(row.row_id);
  const normalized = row.normalized_json
    ? (JSON.parse(row.normalized_json) as Record<string, string>)
    : (JSON.parse(row.raw_json) as Record<string, string>);

  if (match?.outcome === "review_required" && !input.force_create) {
    throw new UcieValidationError("review_required", "Identity review required before commit");
  }

  let contactId = match?.matched_contact_id;
  let action: "created" | "linked" = "linked";

  if (!contactId || match?.outcome === "new_identity") {
    const contact = createContact({
      workspace_id: row.workspace_id,
      display_name: normalized.display_name ?? "Unknown",
      first_name: normalized.first_name,
      last_name: normalized.last_name,
      emails: normalized.email ? [{ email: normalized.email, primary: true }] : [],
      phones:
        normalized.phone || normalized.mobile
          ? [{ phone: normalized.phone ?? normalized.mobile!, primary: true }]
          : [],
      tags: normalized.tags
        ? normalized.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      notes: normalized.notes ?? "",
    });
    contactId = contact.contact_id;
    action = "created";
  }

  const provenanceFields: Array<[string, string | undefined]> = [
    ["display_name", normalized.display_name],
    ["email", normalized.email],
    ["phone", normalized.phone ?? normalized.mobile],
    ["first_name", normalized.first_name],
    ["last_name", normalized.last_name],
  ];

  let provenance_count = 0;
  for (const [field_name, field_value] of provenanceFields) {
    if (!field_value) continue;
    recordFieldProvenance({
      contact_id: contactId,
      field_name,
      field_value,
      source_type: session.source_type,
      source_label: session.source_label,
      uploaded_by_user_id: row.uploaded_by_user_id,
      confirmed_by_user_id: input.committed_by_user_id,
      session_id: row.session_id,
      row_id: row.row_id,
    });
    provenance_count++;
  }

  updateImportRowState(row.row_id, "committed", {
    committed_contact_id: contactId,
    match_outcome: match?.outcome ?? "new_identity",
  });
  incrementSessionCounts(row.session_id, { committed_count: 1 });

  return { row_id: row.row_id, contact_id: contactId, action, provenance_count };
}
