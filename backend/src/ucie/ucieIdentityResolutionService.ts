import crypto from "node:crypto";
import type { IdentityMatchEvidence, IdentityMatchResult, UcieMatchOutcome } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { listContacts } from "../contacts/contactRepository.js";
import { normalizeEmail } from "../contacts/contactSerde.js";
import { getImportRow, updateImportRowState } from "./ucieSessionRepository.js";
import { createWorkItem } from "./ucieWorkService.js";

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function resolveIdentityForRow(rowId: string): IdentityMatchResult | null {
  const row = getImportRow(rowId);
  if (!row) return null;

  const normalized = row.normalized_json
    ? (JSON.parse(row.normalized_json) as Record<string, string>)
    : (JSON.parse(row.raw_json) as Record<string, string>);

  const evidence: IdentityMatchEvidence[] = [];
  let matchedContactId: string | undefined;
  let outcome: UcieMatchOutcome = "new_identity";
  let confidenceScore = 0;

  const email = normalized.email?.trim();
  const phone = normalized.phone?.trim() || normalized.mobile?.trim();

  if (email) {
    const contacts = listContacts({ workspace_id: row.workspace_id });
    const target = normalizeEmail(email);
    for (const contact of contacts) {
      for (const entry of contact.emails) {
        if (normalizeEmail(entry.email) === target) {
          matchedContactId = contact.contact_id;
          evidence.push({
            evidence_id: crypto.randomUUID(),
            evidence_type: "email",
            label: "Exact email match",
            detail: entry.email,
            contact_id: contact.contact_id,
            weight: 1,
          });
          outcome = "exact_match";
          confidenceScore = 1;
          break;
        }
      }
      if (matchedContactId) break;
    }
  }

  if (!matchedContactId && phone) {
    const targetPhone = normalizePhone(phone);
    const contacts = listContacts({ workspace_id: row.workspace_id });
    for (const contact of contacts) {
      for (const entry of contact.phones) {
        if (normalizePhone(entry.phone) === targetPhone) {
          matchedContactId = contact.contact_id;
          evidence.push({
            evidence_id: crypto.randomUUID(),
            evidence_type: "phone",
            label: "Exact phone match",
            detail: entry.phone,
            contact_id: contact.contact_id,
            weight: 0.95,
          });
          outcome = "exact_match";
          confidenceScore = 0.95;
          break;
        }
      }
      if (matchedContactId) break;
    }
  }

  if (!matchedContactId && normalized.display_name) {
    const target = normalized.display_name.trim().toLowerCase();
    const contacts = listContacts({ workspace_id: row.workspace_id });
    for (const contact of contacts) {
      if (contact.display_name.trim().toLowerCase() === target) {
        matchedContactId = contact.contact_id;
        evidence.push({
          evidence_id: crypto.randomUUID(),
          evidence_type: "name",
          label: "Exact display name match",
          detail: contact.display_name,
          contact_id: contact.contact_id,
          weight: 0.7,
        });
        outcome = "high_confidence";
        confidenceScore = 0.7;
        break;
      }
    }
  }

  if (!matchedContactId) {
    if (email || phone) {
      outcome = "new_identity";
      confidenceScore = 0.85;
      evidence.push({
        evidence_id: crypto.randomUUID(),
        evidence_type: "email",
        label: "No canonical match for provided identifiers",
        detail: [email, phone].filter(Boolean).join(" · "),
        weight: 0.85,
      });
    } else if (normalized.display_name) {
      outcome = "review_required";
      confidenceScore = 0.4;
      evidence.push({
        evidence_id: crypto.randomUUID(),
        evidence_type: "name",
        label: "Name-only signal — review required",
        detail: normalized.display_name,
        weight: 0.4,
      });
    } else {
      outcome = "new_identity";
      confidenceScore = 0.2;
    }
  }

  const autoMergeAllowed = outcome === "exact_match";
  const rationale =
    outcome === "exact_match"
      ? "Exact evidence match — auto-link permitted."
      : outcome === "high_confidence"
        ? "Strong name match — human review recommended before merge."
        : outcome === "review_required"
          ? "Ambiguous identity signals — review required."
          : "No matching canonical identity — new identity path.";

  const match_id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_match_results (
        match_id, row_id, session_id, outcome, confidence_score, matched_contact_id,
        evidence_json, rationale, auto_merge_allowed, created_at
      ) VALUES (
        @match_id, @row_id, @session_id, @outcome, @confidence_score, @matched_contact_id,
        @evidence_json, @rationale, @auto_merge_allowed, @created_at
      )
      ON CONFLICT(row_id) DO UPDATE SET
        outcome = excluded.outcome,
        confidence_score = excluded.confidence_score,
        matched_contact_id = excluded.matched_contact_id,
        evidence_json = excluded.evidence_json,
        rationale = excluded.rationale,
        auto_merge_allowed = excluded.auto_merge_allowed`,
    )
    .run({
      match_id,
      row_id: rowId,
      session_id: row.session_id,
      outcome,
      confidence_score: confidenceScore,
      matched_contact_id: matchedContactId ?? null,
      evidence_json: JSON.stringify(evidence),
      rationale,
      auto_merge_allowed: autoMergeAllowed ? 1 : 0,
      created_at,
    });

  updateImportRowState(rowId, outcome === "review_required" ? "review_required" : "matched", {
    match_outcome: outcome,
  });

  if (outcome === "review_required") {
    createWorkItem({
      workspace_id: row.workspace_id,
      session_id: row.session_id,
      row_id: rowId,
      item_type: "identity_review",
      title: `Identity review: ${normalized.display_name ?? email ?? "unknown"}`,
      detail: rationale,
    });
  }

  return {
    row_id: rowId,
    session_id: row.session_id,
    outcome,
    confidence_score: confidenceScore,
    matched_contact_id: matchedContactId,
    evidence,
    rationale,
    auto_merge_allowed: autoMergeAllowed,
  };
}

export function getMatchResult(rowId: string): IdentityMatchResult | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM ucie_match_results WHERE row_id = ?`)
    .get(rowId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    row_id: row.row_id as string,
    session_id: row.session_id as string,
    outcome: row.outcome as UcieMatchOutcome,
    confidence_score: row.confidence_score as number,
    matched_contact_id: (row.matched_contact_id as string) ?? undefined,
    evidence: JSON.parse(row.evidence_json as string) as IdentityMatchEvidence[],
    rationale: row.rationale as string,
    auto_merge_allowed: row.auto_merge_allowed === 1,
  };
}
