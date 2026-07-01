import {
  assertLifecycleTransitionAllowed,
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
import {
  assertFactBodyUnchanged,
  assertSupersessionPair,
  isLifecycleEligibleForSupersession,
} from "./factLineage.js";
import {
  FactNotFoundError,
  getFactById,
  insertFact,
  persistFactRecord,
  updateFactLifecycleState,
} from "./factStore.js";
import { assertFactSchemaVersion, FactValidationError, validateFactRecord } from "./factValidator.js";
import { assertFactVerificationAuthority } from "./factProvenance.js";
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
  /** Supporting evidence anchors — defaults to [source_ref]. */
  source_refs?: string[];
  /** Who attested / accepted this knowledge — defaults to [captured_by]. */
  authority_refs?: IdentityRef[];
};

export type SupersedeFactInput = {
  prior_fact_id: string;
  reason: string;
  actor: IdentityRef;
  correction: CreateFactInput;
};

function closeValidUntil(existing: string | undefined, supersededAt: string): string {
  if (!existing) return supersededAt;
  return Date.parse(existing) < Date.parse(supersededAt) ? existing : supersededAt;
}

function buildFactDraft(
  input: CreateFactInput,
  lineage?: { supersedes: string; supersession_reason: string },
): Fact {
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
  const sourceRefs = input.source_refs ?? [input.source_ref];
  const authorityRefs = input.authority_refs ?? [input.captured_by];

  return {
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
    supersedes: lineage?.supersedes,
    supersession_reason: lineage?.supersession_reason,
    source_refs: sourceRefs,
    authority_refs: authorityRefs,
    lifecycle_state: FACT_INITIAL_LIFECYCLE,
    provenance,
    event_at: input.event_at,
    created_at: createdAt,
  };
}

export function createFact(input: CreateFactInput): Fact {
  const draft = buildFactDraft(input);
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
  const current = getFactById(factId);
  if (!current) throw new FactNotFoundError(factId);
  assertFactVerificationAuthority(current, actor);
  return transitionFactLifecycle(factId, "Verified", actor, "memory.verify");
}

/**
 * Correct institutional knowledge by lineage — never in-place body mutation.
 * Fact A → superseded_by → Fact B
 */
export function supersedeFact(input: SupersedeFactInput): { prior: Fact; successor: Fact } {
  const prior = getFactById(input.prior_fact_id);
  if (!prior) throw new FactNotFoundError(input.prior_fact_id);

  if (!isLifecycleEligibleForSupersession(prior.lifecycle_state)) {
    throw new FactValidationError(
      "lifecycle_state",
      `fact ${prior.fact_id} must be Verified before supersession`,
    );
  }
  if (prior.superseded_by || prior.lifecycle_state === "Superseded") {
    throw new FactValidationError("superseded_by", "fact already superseded");
  }

  const reason = input.reason.trim();
  if (!reason) {
    throw new FactValidationError("supersession_reason", "required");
  }

  const successorDraft = buildFactDraft(input.correction, {
    supersedes: prior.fact_id,
    supersession_reason: reason,
  });
  const successor = validateFactRecord(successorDraft);
  assertFactSchemaVersion(successor);

  const supersededAt = successor.created_at;

  assertLifecycleTransitionAllowed(prior.lifecycle_state, "Superseded");

  const priorSuperseded: Fact = {
    ...prior,
    lifecycle_state: "Superseded",
    superseded_by: successor.fact_id,
    superseded_at: supersededAt,
    valid_until: closeValidUntil(prior.valid_until, supersededAt),
  };

  assertFactBodyUnchanged(prior, priorSuperseded);
  validateFactRecord(priorSuperseded);
  assertSupersessionPair(priorSuperseded, successor, reason);

  insertFact(successor);
  persistFactRecord(priorSuperseded);

  appendMemoryAuditEvent({
    event_type: "memory.superseded",
    object_type: MEMORY_AUDIT_OBJECT_FACT,
    object_id: prior.fact_id,
    from_state: prior.lifecycle_state,
    to_state: "Superseded",
    actor_identity_id: input.actor.identity_id,
    detail: {
      old_id: prior.fact_id,
      new_id: successor.fact_id,
      reason,
      engine: "ENG-MEM-001",
    },
  });

  appendMemoryAuditEvent({
    event_type: "memory.supersede",
    object_type: MEMORY_AUDIT_OBJECT_FACT,
    object_id: successor.fact_id,
    to_state: successor.lifecycle_state,
    actor_identity_id: input.actor.identity_id,
    detail: {
      supersedes: prior.fact_id,
      reason,
      engine: "ENG-MEM-001",
    },
  });

  return { prior: priorSuperseded, successor };
}
