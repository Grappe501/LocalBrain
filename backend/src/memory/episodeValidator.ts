import {
  EPISODE_FIELD_KEYS,
  EPISODE_SCHEMA_VERSION,
  type Episode,
  type EpisodeFieldKey,
  isIso8601,
  isMemoryDomain,
  isTrustLevel,
  type LifecycleState,
} from "@localbrain/shared";

export class EpisodeValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.name = "EpisodeValidationError";
    this.field = field;
  }
}

function assertObject(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new EpisodeValidationError(field, "must be an object");
  }
  return value as Record<string, unknown>;
}

function validateIdentityRef(value: unknown, field: string): void {
  const obj = assertObject(value, field);
  if (typeof obj.identity_id !== "string" || !obj.identity_id.trim()) {
    throw new EpisodeValidationError(field, "identity_id is required");
  }
  if (typeof obj.identity_kind !== "string" || !obj.identity_kind.trim()) {
    throw new EpisodeValidationError(field, "identity_kind is required");
  }
}

function validateProvenance(value: unknown): void {
  const field = "provenance";
  const obj = assertObject(value, field);
  if (typeof obj.provenance_id !== "string" || !obj.provenance_id.trim()) {
    throw new EpisodeValidationError(field, "provenance_id is required");
  }
  validateIdentityRef(obj.captured_by, "provenance.captured_by");
  const method = obj.capture_method;
  if (method !== "direct" && method !== "import" && method !== "inference" && method !== "system") {
    throw new EpisodeValidationError(field, "invalid capture_method");
  }
  if (typeof obj.source_ref !== "string" || !obj.source_ref.trim()) {
    throw new EpisodeValidationError(field, "source_ref is required");
  }
  if (obj.consent_ref !== null && typeof obj.consent_ref !== "string") {
    throw new EpisodeValidationError(field, "consent_ref must be string or null");
  }
  if (typeof obj.convention_provenance_version !== "string") {
    throw new EpisodeValidationError(field, "convention_provenance_version is required");
  }
  const trust = assertObject(obj.trust, "provenance.trust");
  if (typeof trust.level !== "string" || !isTrustLevel(trust.level)) {
    throw new EpisodeValidationError("provenance.trust.level", "invalid trust level");
  }
  if (typeof trust.evaluated_at !== "string" || !isIso8601(trust.evaluated_at)) {
    throw new EpisodeValidationError("provenance.trust.evaluated_at", "invalid ISO-8601");
  }
  if (typeof obj.recorded_at !== "string" || !isIso8601(obj.recorded_at)) {
    throw new EpisodeValidationError(field, "recorded_at must be ISO-8601");
  }
}

export function validateEpisodeRecord(value: unknown): Episode {
  const obj = assertObject(value, "episode");
  const allowed = new Set<string>(EPISODE_FIELD_KEYS);
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      throw new EpisodeValidationError(key, "unknown field — reject unknown fields");
    }
  }

  for (const key of EPISODE_FIELD_KEYS) {
    if (key === "title" || key === "ended_at" || key === "participants") continue;
    if (!(key in obj)) {
      throw new EpisodeValidationError(key, "required field missing");
    }
  }

  if (typeof obj.episode_id !== "string" || !obj.episode_id.trim()) {
    throw new EpisodeValidationError("episode_id", "required");
  }
  if (typeof obj.schema_version !== "string" || !obj.schema_version.trim()) {
    throw new EpisodeValidationError("schema_version", "required");
  }
  if (typeof obj.domain !== "string" || !isMemoryDomain(obj.domain)) {
    throw new EpisodeValidationError("domain", "invalid domain enum");
  }
  if (obj.title !== undefined && typeof obj.title !== "string") {
    throw new EpisodeValidationError("title", "must be string when present");
  }
  for (const timeField of ["started_at", "event_at", "created_at"] as const) {
    if (typeof obj[timeField] !== "string" || !isIso8601(obj[timeField])) {
      throw new EpisodeValidationError(timeField, "invalid ISO-8601");
    }
  }
  if (obj.ended_at !== undefined) {
    if (typeof obj.ended_at !== "string" || !isIso8601(obj.ended_at)) {
      throw new EpisodeValidationError("ended_at", "invalid ISO-8601");
    }
  }
  if (obj.participants !== undefined) {
    if (!Array.isArray(obj.participants)) {
      throw new EpisodeValidationError("participants", "must be array when present");
    }
    for (let i = 0; i < obj.participants.length; i += 1) {
      validateIdentityRef(obj.participants[i], `participants[${i}]`);
    }
  }
  if (typeof obj.source_ref !== "string" || !obj.source_ref.trim()) {
    throw new EpisodeValidationError("source_ref", "required");
  }
  if (typeof obj.lifecycle_state !== "string" || !obj.lifecycle_state.trim()) {
    throw new EpisodeValidationError("lifecycle_state", "required");
  }
  validateProvenance(obj.provenance);

  return obj as Episode;
}

export function assertEpisodeSchemaVersion(episode: Episode): void {
  if (episode.schema_version !== EPISODE_SCHEMA_VERSION) {
    throw new EpisodeValidationError(
      "schema_version",
      `expected ${EPISODE_SCHEMA_VERSION}, got ${episode.schema_version}`,
    );
  }
}

export type { EpisodeFieldKey, LifecycleState };
