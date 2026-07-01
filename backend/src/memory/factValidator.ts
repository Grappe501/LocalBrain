import {
  FACT_FIELD_KEYS,
  FACT_SCHEMA_VERSION,
  type Fact,
  type FactFieldKey,
  isIso8601,
  isMemoryDomain,
  isTrustLevel,
  type LifecycleState,
} from "@localbrain/shared";

import { validateFactLineageFields } from "./factLineage.js";

export class FactValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.name = "FactValidationError";
    this.field = field;
  }
}

function assertObject(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new FactValidationError(field, "must be an object");
  }
  return value as Record<string, unknown>;
}

function validateIdentityRef(value: unknown, field: string): void {
  const obj = assertObject(value, field);
  if (typeof obj.identity_id !== "string" || !obj.identity_id.trim()) {
    throw new FactValidationError(field, "identity_id is required");
  }
  if (typeof obj.identity_kind !== "string" || !obj.identity_kind.trim()) {
    throw new FactValidationError(field, "identity_kind is required");
  }
}

function validateTrustEnvelope(value: unknown, field: string): void {
  const trust = assertObject(value, field);
  if (typeof trust.level !== "string" || !isTrustLevel(trust.level)) {
    throw new FactValidationError(`${field}.level`, "invalid trust level");
  }
  if (typeof trust.evaluated_at !== "string" || !isIso8601(trust.evaluated_at)) {
    throw new FactValidationError(`${field}.evaluated_at`, "invalid ISO-8601");
  }
}

function validateProvenance(value: unknown): void {
  const field = "provenance";
  const obj = assertObject(value, field);
  if (typeof obj.provenance_id !== "string" || !obj.provenance_id.trim()) {
    throw new FactValidationError(field, "provenance_id is required");
  }
  validateIdentityRef(obj.captured_by, "provenance.captured_by");
  const method = obj.capture_method;
  if (method !== "direct" && method !== "import" && method !== "inference" && method !== "system") {
    throw new FactValidationError(field, "invalid capture_method");
  }
  if (typeof obj.source_ref !== "string" || !obj.source_ref.trim()) {
    throw new FactValidationError(field, "source_ref is required");
  }
  if (obj.consent_ref !== null && typeof obj.consent_ref !== "string") {
    throw new FactValidationError(field, "consent_ref must be string or null");
  }
  if (typeof obj.convention_provenance_version !== "string") {
    throw new FactValidationError(field, "convention_provenance_version is required");
  }
  validateTrustEnvelope(obj.trust, "provenance.trust");
  if (typeof obj.recorded_at !== "string" || !isIso8601(obj.recorded_at)) {
    throw new FactValidationError(field, "recorded_at must be ISO-8601");
  }
}

function validateValidityInterval(validFrom: unknown, validUntil: unknown): void {
  if (validFrom === undefined && validUntil === undefined) return;
  if (validFrom !== undefined) {
    if (typeof validFrom !== "string" || !isIso8601(validFrom)) {
      throw new FactValidationError("valid_from", "invalid ISO-8601");
    }
  }
  if (validUntil !== undefined) {
    if (typeof validUntil !== "string" || !isIso8601(validUntil)) {
      throw new FactValidationError("valid_until", "invalid ISO-8601");
    }
  }
  if (
    typeof validFrom === "string" &&
    typeof validUntil === "string" &&
    Date.parse(validFrom) > Date.parse(validUntil)
  ) {
    throw new FactValidationError("valid_from", "must not be after valid_until");
  }
}

export function validateFactRecord(value: unknown): Fact {
  const obj = assertObject(value, "fact");
  const allowed = new Set<string>(FACT_FIELD_KEYS);
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      throw new FactValidationError(key, "unknown field — reject unknown fields");
    }
  }

  for (const key of FACT_FIELD_KEYS) {
    if (
      key === "object_ref" ||
      key === "valid_from" ||
      key === "valid_until" ||
      key === "superseded_by" ||
      key === "superseded_at" ||
      key === "supersedes" ||
      key === "supersession_reason"
    ) {
      continue;
    }
    if (!(key in obj)) {
      throw new FactValidationError(key, "required field missing");
    }
  }

  if (typeof obj.fact_id !== "string" || !obj.fact_id.trim()) {
    throw new FactValidationError("fact_id", "required");
  }
  if (typeof obj.schema_version !== "string" || !obj.schema_version.trim()) {
    throw new FactValidationError("schema_version", "required");
  }
  if (typeof obj.domain !== "string" || !isMemoryDomain(obj.domain)) {
    throw new FactValidationError("domain", "invalid domain enum");
  }
  if (typeof obj.statement !== "string" || !obj.statement.trim()) {
    throw new FactValidationError("statement", "required");
  }
  validateIdentityRef(obj.subject_ref, "subject_ref");
  if (typeof obj.predicate !== "string" || !obj.predicate.trim()) {
    throw new FactValidationError("predicate", "required");
  }
  if (obj.object_ref !== undefined) {
    if (typeof obj.object_ref !== "string" || !obj.object_ref.trim()) {
      throw new FactValidationError("object_ref", "must be non-empty string when present");
    }
  }
  validateTrustEnvelope(obj.confidence, "confidence");
  validateValidityInterval(obj.valid_from, obj.valid_until);
  validateFactLineageFields(obj);
  if (typeof obj.lifecycle_state !== "string" || !obj.lifecycle_state.trim()) {
    throw new FactValidationError("lifecycle_state", "required");
  }
  for (const timeField of ["event_at", "created_at"] as const) {
    if (typeof obj[timeField] !== "string" || !isIso8601(obj[timeField])) {
      throw new FactValidationError(timeField, "invalid ISO-8601");
    }
  }
  validateProvenance(obj.provenance);

  return obj as Fact;
}

export function assertFactSchemaVersion(fact: Fact): void {
  if (fact.schema_version !== FACT_SCHEMA_VERSION) {
    throw new FactValidationError(
      "schema_version",
      `expected ${FACT_SCHEMA_VERSION}, got ${fact.schema_version}`,
    );
  }
}

export type { FactFieldKey, LifecycleState };
