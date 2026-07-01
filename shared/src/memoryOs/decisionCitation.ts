import type { IdentityRef, MemoryProvenanceEnvelope } from "./primitives.js";
import type { MemoryObjectRef } from "./memoryRef.js";
import type { LifecycleState } from "./lifecycle.js";
import { DECISION_CITATION_SCHEMA_VERSION } from "./constants.js";

/** Canonical DecisionCitation — Volume 2 § DecisionCitation (memory-spec-v1.0). */
export type DecisionCitation = {
  citation_id: string;
  schema_version: typeof DECISION_CITATION_SCHEMA_VERSION | string;
  decision_id: string;
  question: string;
  outcome_summary: string;
  decided_at: string;
  decider_ref: IdentityRef;
  supporting_memory_refs: MemoryObjectRef[];
  ledger_ref: string;
  lifecycle_state: LifecycleState;
  provenance: MemoryProvenanceEnvelope;
  event_at: string;
  created_at: string;
};

export const DECISION_CITATION_FIELD_KEYS = [
  "citation_id",
  "schema_version",
  "decision_id",
  "question",
  "outcome_summary",
  "decided_at",
  "decider_ref",
  "supporting_memory_refs",
  "ledger_ref",
  "lifecycle_state",
  "provenance",
  "event_at",
  "created_at",
] as const;

export type DecisionCitationFieldKey = (typeof DECISION_CITATION_FIELD_KEYS)[number];

export function serializeDecisionCitation(citation: DecisionCitation): string {
  return JSON.stringify(citation);
}

export function deserializeDecisionCitation(json: string): DecisionCitation {
  return JSON.parse(json) as DecisionCitation;
}

export function decisionCitationsEquivalent(a: DecisionCitation, b: DecisionCitation): boolean {
  return serializeDecisionCitation(a) === serializeDecisionCitation(b);
}
