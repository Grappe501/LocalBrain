import {
  ARTIFACT_CUSTODY_EVENT_TYPES,
  ARTIFACT_CUSTODY_FIELD_KEYS,
  type ArtifactCustodyEvent,
  type ArtifactCustodyEventType,
  type ArtifactCustodyFieldKey,
  identityRefMatches,
  isIso8601,
} from "@localbrain/shared";
import type { IdentityRef } from "@localbrain/shared";

export class ArtifactCustodyValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.name = "ArtifactCustodyValidationError";
    this.field = field;
  }
}

function assertObject(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ArtifactCustodyValidationError(field, "must be an object");
  }
  return value as Record<string, unknown>;
}

function validateIdentityRef(value: unknown, field: string): IdentityRef {
  const obj = assertObject(value, field);
  if (typeof obj.identity_id !== "string" || !obj.identity_id.trim()) {
    throw new ArtifactCustodyValidationError(field, "identity_id is required");
  }
  if (typeof obj.identity_kind !== "string" || !obj.identity_kind.trim()) {
    throw new ArtifactCustodyValidationError(field, "identity_kind is required");
  }
  return obj as IdentityRef;
}

function validateNullableIdentityRef(value: unknown, field: string): IdentityRef | null {
  if (value === null) return null;
  return validateIdentityRef(value, field);
}

function isCustodyEventType(value: string): value is ArtifactCustodyEventType {
  return (ARTIFACT_CUSTODY_EVENT_TYPES as readonly string[]).includes(value);
}

export function validateArtifactCustodyEvent(value: unknown): ArtifactCustodyEvent {
  const obj = assertObject(value, "custody_event");
  const allowed = new Set<string>(ARTIFACT_CUSTODY_FIELD_KEYS);
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      throw new ArtifactCustodyValidationError(key, "unknown field — reject unknown fields");
    }
  }

  for (const key of ARTIFACT_CUSTODY_FIELD_KEYS) {
    if (key === "reason" || key === "previous_custodian" || key === "new_custodian") continue;
    if (!(key in obj)) {
      throw new ArtifactCustodyValidationError(key, "required field missing");
    }
  }

  if (typeof obj.custody_event_id !== "string" || !obj.custody_event_id.trim()) {
    throw new ArtifactCustodyValidationError("custody_event_id", "required");
  }
  if (typeof obj.artifact_id !== "string" || !obj.artifact_id.trim()) {
    throw new ArtifactCustodyValidationError("artifact_id", "required");
  }
  if (typeof obj.custody_event !== "string" || !isCustodyEventType(obj.custody_event)) {
    throw new ArtifactCustodyValidationError("custody_event", "invalid custody event type");
  }

  const actor = validateIdentityRef(obj.actor, "actor");
  const previous_custodian = validateNullableIdentityRef(
    obj.previous_custodian ?? null,
    "previous_custodian",
  );
  const new_custodian = validateNullableIdentityRef(obj.new_custodian ?? null, "new_custodian");

  for (const timeField of ["event_at", "recorded_at"] as const) {
    if (typeof obj[timeField] !== "string" || !isIso8601(obj[timeField])) {
      throw new ArtifactCustodyValidationError(timeField, "invalid ISO-8601");
    }
  }

  if (obj.reason !== undefined) {
    if (typeof obj.reason !== "string" || !obj.reason.trim()) {
      throw new ArtifactCustodyValidationError("reason", "must be non-empty string when present");
    }
  }

  const eventType = obj.custody_event as ArtifactCustodyEventType;

  if (eventType === "initial_custody") {
    if (previous_custodian !== null) {
      throw new ArtifactCustodyValidationError(
        "previous_custodian",
        "must be null for initial_custody",
      );
    }
    if (new_custodian === null) {
      throw new ArtifactCustodyValidationError("new_custodian", "required for initial_custody");
    }
  }

  if (eventType === "transfer") {
    if (previous_custodian === null || new_custodian === null) {
      throw new ArtifactCustodyValidationError(
        "custody_event",
        "transfer requires previous_custodian and new_custodian",
      );
    }
    if (identityRefMatches(previous_custodian, new_custodian)) {
      throw new ArtifactCustodyValidationError(
        "new_custodian",
        "must differ from previous_custodian on transfer",
      );
    }
  }

  if (eventType === "release") {
    if (previous_custodian === null) {
      throw new ArtifactCustodyValidationError(
        "previous_custodian",
        "required for release",
      );
    }
    if (new_custodian !== null) {
      throw new ArtifactCustodyValidationError("new_custodian", "must be null for release");
    }
  }

  return {
    custody_event_id: obj.custody_event_id,
    artifact_id: obj.artifact_id,
    custody_event: eventType,
    actor,
    event_at: String(obj.event_at),
    recorded_at: String(obj.recorded_at),
    previous_custodian,
    new_custodian,
    reason: obj.reason as string | undefined,
  };
}

export type { ArtifactCustodyFieldKey };
