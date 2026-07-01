import {
  DECISION_CITATION_FIELD_KEYS,
  DECISION_CITATION_SCHEMA_VERSION,
  type DecisionCitation,
  type DecisionCitationFieldKey,
  isDecisionCitationSubstrateRef,
  isIso8601,
  isMemoryObjectRef,
  isTrustLevel,
  type LifecycleState,
} from "@localbrain/shared";
import {
  assertDecisionCitationLedgerBoundary,
  assertDecisionCitationRecordingPrinciple,
  assertDecisionCitationSupportingRefsOutwardOnly,
  DECISION_CITATION_FORBIDDEN_FIELDS,
} from "./decisionCitationGovernanceGuarantees.js";

export class DecisionCitationValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.name = "DecisionCitationValidationError";
    this.field = field;
  }
}

const FORBIDDEN_FIELDS = DECISION_CITATION_FORBIDDEN_FIELDS;
function assertObject(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new DecisionCitationValidationError(field, "must be an object");
  }
  return value as Record<string, unknown>;
}

function validateIdentityRef(value: unknown, field: string): void {
  const obj = assertObject(value, field);
  if (typeof obj.identity_id !== "string" || !obj.identity_id.trim()) {
    throw new DecisionCitationValidationError(field, "identity_id is required");
  }
  if (typeof obj.identity_kind !== "string" || !obj.identity_kind.trim()) {
    throw new DecisionCitationValidationError(field, "identity_kind is required");
  }
}

function validateProvenance(value: unknown): void {
  const field = "provenance";
  const obj = assertObject(value, field);
  if (typeof obj.provenance_id !== "string" || !obj.provenance_id.trim()) {
    throw new DecisionCitationValidationError(field, "provenance_id is required");
  }
  validateIdentityRef(obj.captured_by, "provenance.captured_by");
  const method = obj.capture_method;
  if (method !== "direct" && method !== "import" && method !== "inference" && method !== "system") {
    throw new DecisionCitationValidationError(field, "invalid capture_method");
  }
  if (typeof obj.source_ref !== "string" || !obj.source_ref.trim()) {
    throw new DecisionCitationValidationError(field, "source_ref is required");
  }
  if (obj.consent_ref !== null && typeof obj.consent_ref !== "string") {
    throw new DecisionCitationValidationError(field, "consent_ref must be string or null");
  }
  if (typeof obj.convention_provenance_version !== "string") {
    throw new DecisionCitationValidationError(field, "convention_provenance_version is required");
  }
  const trust = assertObject(obj.trust, "provenance.trust");
  if (typeof trust.level !== "string" || !isTrustLevel(trust.level)) {
    throw new DecisionCitationValidationError("provenance.trust.level", "invalid trust level");
  }
  if (typeof trust.evaluated_at !== "string" || !isIso8601(trust.evaluated_at)) {
    throw new DecisionCitationValidationError("provenance.trust.evaluated_at", "invalid ISO-8601");
  }
  if (typeof obj.recorded_at !== "string" || !isIso8601(obj.recorded_at)) {
    throw new DecisionCitationValidationError(field, "recorded_at must be ISO-8601");
  }
}

function validateLedgerPointer(value: unknown, field: string): void {
  if (typeof value !== "string" || !value.trim()) {
    throw new DecisionCitationValidationError(field, "required non-empty ledger pointer");
  }
  if (!isMemoryObjectRef(value)) {
    throw new DecisionCitationValidationError(
      field,
      "must be a prefixed memory or ledger ref (decision:, ledger:, …)",
    );
  }
}

function validateSupportingMemoryRefs(value: unknown): void {
  const field = "supporting_memory_refs";
  if (!Array.isArray(value) || value.length === 0) {
    throw new DecisionCitationValidationError(field, "at least one supporting memory ref required");
  }
  for (let i = 0; i < value.length; i += 1) {
    const item = value[i];
    if (typeof item !== "string" || !isDecisionCitationSubstrateRef(item)) {
      throw new DecisionCitationValidationError(
        `${field}[${i}]`,
        "must reference Episode · Artifact · Fact · Conversation substrate only",
      );
    }
  }
}

export function validateDecisionCitationRecord(value: unknown): DecisionCitation {
  const obj = assertObject(value, "decisionCitation");

  for (const forbidden of FORBIDDEN_FIELDS) {
    if (forbidden in obj) {
      throw new DecisionCitationValidationError(
        forbidden,
        "forbidden field — DecisionCitation records authority, it does not perform authority",
      );
    }
  }

  const allowed = new Set<string>(DECISION_CITATION_FIELD_KEYS);
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      throw new DecisionCitationValidationError(key, "unknown field — reject unknown fields");
    }
  }

  for (const key of DECISION_CITATION_FIELD_KEYS) {
    if (!(key in obj)) {
      throw new DecisionCitationValidationError(key, "required field missing");
    }
  }

  if (typeof obj.citation_id !== "string" || !obj.citation_id.trim()) {
    throw new DecisionCitationValidationError("citation_id", "required");
  }
  if (typeof obj.schema_version !== "string" || !obj.schema_version.trim()) {
    throw new DecisionCitationValidationError("schema_version", "required");
  }
  validateLedgerPointer(obj.decision_id, "decision_id");
  if (typeof obj.question !== "string" || !obj.question.trim()) {
    throw new DecisionCitationValidationError("question", "required");
  }
  if (typeof obj.outcome_summary !== "string" || !obj.outcome_summary.trim()) {
    throw new DecisionCitationValidationError("outcome_summary", "required");
  }
  for (const timeField of ["decided_at", "event_at", "created_at"] as const) {
    if (typeof obj[timeField] !== "string" || !isIso8601(obj[timeField])) {
      throw new DecisionCitationValidationError(timeField, "invalid ISO-8601");
    }
  }
  validateIdentityRef(obj.decider_ref, "decider_ref");
  validateSupportingMemoryRefs(obj.supporting_memory_refs);
  validateLedgerPointer(obj.ledger_ref, "ledger_ref");
  if (typeof obj.lifecycle_state !== "string" || !obj.lifecycle_state.trim()) {
    throw new DecisionCitationValidationError("lifecycle_state", "required");
  }
  validateProvenance(obj.provenance);

  const citation = obj as DecisionCitation;
  assertDecisionCitationLedgerBoundary(citation);
  assertDecisionCitationRecordingPrinciple(citation);
  assertDecisionCitationSupportingRefsOutwardOnly(citation);

  return citation;
}

export function assertDecisionCitationSchemaVersion(citation: DecisionCitation): void {
  if (citation.schema_version !== DECISION_CITATION_SCHEMA_VERSION) {
    throw new DecisionCitationValidationError(
      "schema_version",
      `expected ${DECISION_CITATION_SCHEMA_VERSION}, got ${citation.schema_version}`,
    );
  }
}

export { type DecisionCitationFieldKey, type LifecycleState };
