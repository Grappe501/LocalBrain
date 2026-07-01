import {
  DECISION_CITATION_INITIAL_LIFECYCLE,
  DECISION_CITATION_KIND,
  DECISION_CITATION_SCHEMA_VERSION,
  type CaptureMethod,
  type DecisionCitation,
  type IdentityRef,
  type LifecycleState,
  type TrustLevel,
} from "@localbrain/shared";
import { appendMemoryAuditEvent } from "./auditLog.js";
import {
  getDecisionCitationById,
  insertDecisionCitation,
  updateDecisionCitationLifecycleState,
} from "./decisionCitationStore.js";
import {
  assertDecisionCitationSchemaVersion,
  validateDecisionCitationRecord,
} from "./decisionCitationValidator.js";
import {
  buildMemoryProvenanceEnvelope,
  MEMORY_AUDIT_OBJECT_DECISION_CITATION,
} from "./provenanceEnvelope.js";
import { verifyDecisionCitationGovernanceGuarantees } from "./decisionCitationGovernanceGuarantees.js";

export type CreateDecisionCitationInput = {
  decision_id: string;
  question: string;
  outcome_summary: string;
  decided_at: string;
  decider_ref: IdentityRef;
  supporting_memory_refs: string[];
  ledger_ref: string;
  event_at: string;
  captured_by: IdentityRef;
  capture_method: CaptureMethod;
  consent_ref?: string | null;
  trust_level?: TrustLevel;
};

export function createDecisionCitation(input: CreateDecisionCitationInput): DecisionCitation {
  const createdAt = new Date().toISOString();
  const provenance = buildMemoryProvenanceEnvelope({
    captured_by: input.captured_by,
    capture_method: input.capture_method,
    source_ref: input.ledger_ref,
    consent_ref: input.consent_ref,
    trust_level: input.trust_level,
    recorded_at: createdAt,
  });

  const draft: DecisionCitation = {
    citation_id: crypto.randomUUID(),
    schema_version: DECISION_CITATION_SCHEMA_VERSION,
    decision_id: input.decision_id,
    question: input.question,
    outcome_summary: input.outcome_summary,
    decided_at: input.decided_at,
    decider_ref: input.decider_ref,
    supporting_memory_refs: input.supporting_memory_refs,
    ledger_ref: input.ledger_ref,
    lifecycle_state: DECISION_CITATION_INITIAL_LIFECYCLE,
    provenance,
    event_at: input.event_at,
    created_at: createdAt,
  };

  const citation = validateDecisionCitationRecord(draft);
  assertDecisionCitationSchemaVersion(citation);
  verifyDecisionCitationGovernanceGuarantees(citation);
  insertDecisionCitation(citation);

  appendMemoryAuditEvent({
    event_type: "memory.capture",
    object_type: MEMORY_AUDIT_OBJECT_DECISION_CITATION,
    object_id: citation.citation_id,
    to_state: citation.lifecycle_state,
    actor_identity_id: input.captured_by.identity_id,
    detail: {
      decision_id: citation.decision_id,
      ledger_ref: citation.ledger_ref,
      supporting_ref_count: citation.supporting_memory_refs.length,
      engine: "ENG-MEM-001",
    },
  });

  return citation;
}

export function transitionDecisionCitationLifecycle(
  citationId: string,
  nextState: LifecycleState,
  actor: IdentityRef,
  eventType: string,
): DecisionCitation {
  const before = getDecisionCitationById(citationId);
  if (!before) {
    throw new Error(`DecisionCitation not found: ${citationId}`);
  }

  const updated = updateDecisionCitationLifecycleState(citationId, nextState, new Date().toISOString());
  validateDecisionCitationRecord(updated);
  verifyDecisionCitationGovernanceGuarantees(updated);

  appendMemoryAuditEvent({
    event_type: eventType,
    object_type: DECISION_CITATION_KIND,
    object_id: citationId,
    from_state: before.lifecycle_state,
    to_state: nextState,
    actor_identity_id: actor.identity_id,
  });

  return updated;
}

export function verifyDecisionCitation(citationId: string, actor: IdentityRef): DecisionCitation {
  return transitionDecisionCitationLifecycle(citationId, "Verified", actor, "memory.verify");
}
