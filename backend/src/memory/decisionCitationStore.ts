import {
  assertLifecycleTransitionAllowed,
  deserializeDecisionCitation,
  type DecisionCitation,
  serializeDecisionCitation,
  type LifecycleState,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export class DecisionCitationNotFoundError extends Error {
  constructor(citationId: string) {
    super(`DecisionCitation not found: ${citationId}`);
    this.name = "DecisionCitationNotFoundError";
  }
}

export class DecisionCitationImmutableFieldError extends Error {
  constructor(field: string) {
    super(`DecisionCitation authoritative field is immutable: ${field}`);
    this.name = "DecisionCitationImmutableFieldError";
  }
}

export function insertDecisionCitation(citation: DecisionCitation): void {
  getDatabase()
    .prepare(
      `INSERT INTO memory_decision_citations (
      citation_id, decision_id, lifecycle_state, schema_version,
      payload_json, created_at, lifecycle_updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      citation.citation_id,
      citation.decision_id,
      citation.lifecycle_state,
      citation.schema_version,
      serializeDecisionCitation(citation),
      citation.created_at,
      citation.created_at,
    );
}

export function getDecisionCitationById(citationId: string): DecisionCitation | null {
  const row = getDatabase()
    .prepare(`SELECT payload_json FROM memory_decision_citations WHERE citation_id = ?`)
    .get(citationId) as { payload_json: string } | undefined;
  if (!row) return null;
  return deserializeDecisionCitation(row.payload_json);
}

export function updateDecisionCitationLifecycleState(
  citationId: string,
  nextState: LifecycleState,
  lifecycleUpdatedAt: string,
): DecisionCitation {
  const current = getDecisionCitationById(citationId);
  if (!current) throw new DecisionCitationNotFoundError(citationId);

  assertLifecycleTransitionAllowed(current.lifecycle_state, nextState);

  const updated: DecisionCitation = {
    ...current,
    lifecycle_state: nextState,
  };

  getDatabase()
    .prepare(
      `UPDATE memory_decision_citations
       SET lifecycle_state = ?, payload_json = ?, lifecycle_updated_at = ?
       WHERE citation_id = ?`,
    )
    .run(nextState, serializeDecisionCitation(updated), lifecycleUpdatedAt, citationId);

  return updated;
}

export function decisionCitationContentFingerprint(citation: DecisionCitation): string {
  const { lifecycle_state: _state, ...content } = citation;
  return JSON.stringify(content);
}

export function assertDecisionCitationContentUnchanged(
  before: DecisionCitation,
  after: DecisionCitation,
): void {
  if (decisionCitationContentFingerprint(before) !== decisionCitationContentFingerprint(after)) {
    throw new DecisionCitationImmutableFieldError("payload");
  }
}
