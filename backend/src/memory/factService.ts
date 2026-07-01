import {
  FACT_INITIAL_LIFECYCLE,
  FACT_KIND,
  FACT_SCHEMA_VERSION,
  type CaptureMethod,
  type Fact,
  type IdentityRef,
  type LifecycleState,
  type MemoryDomain,
  type TrustLevel,
} from "@localbrain/shared";
import { appendMemoryAuditEvent } from "./auditLog.js";
import { getFactById, insertFact, updateFactLifecycleState } from "./factStore.js";
import { assertFactSchemaVersion, validateFactRecord } from "./factValidator.js";
import { buildMemoryProvenanceEnvelope, MEMORY_AUDIT_OBJECT_FACT } from "./provenanceEnvelope.js";

export type CreateFactInput = {
  domain: MemoryDomain;
  statement: string;
  subject_ref: IdentityRef;
  predicate: string;
  object_ref?: string;
  event_at: string;
  captured_by: IdentityRef;
  capture_method: CaptureMethod;
  source_ref: string;
  consent_ref?: string | null;
  trust_level?: TrustLevel;
  confidence_level?: TrustLevel;
  valid_from?: string;
  valid_until?: string;
};

export function createFact(input: CreateFactInput): Fact {
  const createdAt = new Date().toISOString();
  const provenance = buildMemoryProvenanceEnvelope({
    captured_by: input.captured_by,
    capture_method: input.capture_method,
    source_ref: input.source_ref,
    consent_ref: input.consent_ref,
    trust_level: input.trust_level,
    recorded_at: createdAt,
  });

  const confidenceLevel = input.confidence_level ?? input.trust_level ?? "observed";

  const draft: Fact = {
    fact_id: crypto.randomUUID(),
    schema_version: FACT_SCHEMA_VERSION,
    domain: input.domain,
    statement: input.statement,
    subject_ref: input.subject_ref,
    predicate: input.predicate,
    object_ref: input.object_ref,
    confidence: {
      level: confidenceLevel,
      evaluated_at: createdAt,
    },
    valid_from: input.valid_from,
    valid_until: input.valid_until,
    lifecycle_state: FACT_INITIAL_LIFECYCLE,
    provenance,
    event_at: input.event_at,
    created_at: createdAt,
  };

  const fact = validateFactRecord(draft);
  assertFactSchemaVersion(fact);
  insertFact(fact);

  appendMemoryAuditEvent({
    event_type: "memory.capture",
    object_type: MEMORY_AUDIT_OBJECT_FACT,
    object_id: fact.fact_id,
    to_state: fact.lifecycle_state,
    actor_identity_id: input.captured_by.identity_id,
    detail: { domain: fact.domain, engine: "ENG-MEM-001" },
  });

  return fact;
}

export function transitionFactLifecycle(
  factId: string,
  nextState: LifecycleState,
  actor: IdentityRef,
  eventType: string,
): Fact {
  const before = getFactById(factId);
  if (!before) {
    throw new Error(`Fact not found: ${factId}`);
  }

  const updated = updateFactLifecycleState(factId, nextState, new Date().toISOString());
  validateFactRecord(updated);

  appendMemoryAuditEvent({
    event_type: eventType,
    object_type: FACT_KIND,
    object_id: factId,
    from_state: before.lifecycle_state,
    to_state: nextState,
    actor_identity_id: actor.identity_id,
  });

  return updated;
}

export function verifyFact(factId: string, actor: IdentityRef): Fact {
  return transitionFactLifecycle(factId, "Verified", actor, "memory.verify");
}
