import {
  ARTIFACT_FIELD_KEYS,
  ARTIFACT_SCHEMA_VERSION,
  type Artifact,
  type ArtifactFieldKey,
  isIso8601,
  isMemoryDomain,
  isTrustLevel,
  type LifecycleState,
} from "@localbrain/shared";

export class ArtifactValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.name = "ArtifactValidationError";
    this.field = field;
  }
}

const FORBIDDEN_KNOWLEDGE_FIELDS = [
  "statement",
  "confidence",
  "source_refs",
  "authority_refs",
  "subject_ref",
  "predicate",
  "object_ref",
  "supersedes",
  "superseded_by",
  "superseded_at",
  "supersession_reason",
  "valid_from",
  "valid_until",
] as const;

function assertObject(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ArtifactValidationError(field, "must be an object");
  }
  return value as Record<string, unknown>;
}

function validateIdentityRef(value: unknown, field: string): void {
  const obj = assertObject(value, field);
  if (typeof obj.identity_id !== "string" || !obj.identity_id.trim()) {
    throw new ArtifactValidationError(field, "identity_id is required");
  }
  if (typeof obj.identity_kind !== "string" || !obj.identity_kind.trim()) {
    throw new ArtifactValidationError(field, "identity_kind is required");
  }
}

function validateProvenance(value: unknown): void {
  const field = "provenance";
  const obj = assertObject(value, field);
  if (typeof obj.provenance_id !== "string" || !obj.provenance_id.trim()) {
    throw new ArtifactValidationError(field, "provenance_id is required");
  }
  validateIdentityRef(obj.captured_by, "provenance.captured_by");
  const method = obj.capture_method;
  if (method !== "direct" && method !== "import" && method !== "inference" && method !== "system") {
    throw new ArtifactValidationError(field, "invalid capture_method");
  }
  if (typeof obj.source_ref !== "string" || !obj.source_ref.trim()) {
    throw new ArtifactValidationError(field, "source_ref is required");
  }
  if (obj.consent_ref !== null && typeof obj.consent_ref !== "string") {
    throw new ArtifactValidationError(field, "consent_ref must be string or null");
  }
  if (typeof obj.convention_provenance_version !== "string") {
    throw new ArtifactValidationError(field, "convention_provenance_version is required");
  }
  const trust = assertObject(obj.trust, "provenance.trust");
  if (typeof trust.level !== "string" || !isTrustLevel(trust.level)) {
    throw new ArtifactValidationError("provenance.trust.level", "invalid trust level");
  }
  if (typeof trust.evaluated_at !== "string" || !isIso8601(trust.evaluated_at)) {
    throw new ArtifactValidationError("provenance.trust.evaluated_at", "invalid ISO-8601");
  }
  if (typeof obj.recorded_at !== "string" || !isIso8601(obj.recorded_at)) {
    throw new ArtifactValidationError(field, "recorded_at must be ISO-8601");
  }
}

function validateContentHash(value: unknown): void {
  if (typeof value !== "string" || !value.trim()) {
    throw new ArtifactValidationError("content_hash", "required non-empty string when present");
  }
}

function validateUriXorContentRef(obj: Record<string, unknown>): void {
  const hasUri = typeof obj.uri === "string" && obj.uri.trim().length > 0;
  const hasContentRef =
    typeof obj.content_ref === "string" && obj.content_ref.trim().length > 0;

  if (hasUri && hasContentRef) {
    throw new ArtifactValidationError(
      "uri",
      "exactly one of uri or content_ref — not both",
    );
  }
  if (!hasUri && !hasContentRef) {
    throw new ArtifactValidationError(
      "uri",
      "exactly one of uri or content_ref is required",
    );
  }
  if (obj.uri !== undefined && !hasUri) {
    throw new ArtifactValidationError("uri", "must be non-empty string when present");
  }
  if (obj.content_ref !== undefined && !hasContentRef) {
    throw new ArtifactValidationError("content_ref", "must be non-empty string when present");
  }
}

export function validateArtifactRecord(value: unknown): Artifact {
  const obj = assertObject(value, "artifact");

  for (const forbidden of FORBIDDEN_KNOWLEDGE_FIELDS) {
    if (forbidden in obj) {
      throw new ArtifactValidationError(
        forbidden,
        "forbidden field — artifacts preserve evidence, not conclusions",
      );
    }
  }

  const allowed = new Set<string>(ARTIFACT_FIELD_KEYS);
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      throw new ArtifactValidationError(key, "unknown field — reject unknown fields");
    }
  }

  for (const key of ARTIFACT_FIELD_KEYS) {
    if (
      key === "uri" ||
      key === "content_ref" ||
      key === "project_ref" ||
      key === "content_hash"
    ) {
      continue;
    }
    if (!(key in obj)) {
      throw new ArtifactValidationError(key, "required field missing");
    }
  }

  validateUriXorContentRef(obj);

  if (typeof obj.artifact_id !== "string" || !obj.artifact_id.trim()) {
    throw new ArtifactValidationError("artifact_id", "required");
  }
  if (typeof obj.schema_version !== "string" || !obj.schema_version.trim()) {
    throw new ArtifactValidationError("schema_version", "required");
  }
  if (typeof obj.domain !== "string" || !isMemoryDomain(obj.domain)) {
    throw new ArtifactValidationError("domain", "invalid domain enum");
  }
  if (typeof obj.mime_type !== "string" || !obj.mime_type.trim()) {
    throw new ArtifactValidationError("mime_type", "required");
  }
  if (obj.project_ref !== undefined) {
    if (typeof obj.project_ref !== "string" || !obj.project_ref.trim()) {
      throw new ArtifactValidationError("project_ref", "must be non-empty string when present");
    }
  }
  if (obj.content_hash !== undefined) {
    validateContentHash(obj.content_hash);
  }
  if (typeof obj.content_ref === "string" && obj.content_ref.trim()) {
    if (obj.content_hash === undefined) {
      throw new ArtifactValidationError(
        "content_hash",
        "required when content_ref is present — authenticity anchor for stored bytes",
      );
    }
    validateContentHash(obj.content_hash);
  }
  for (const timeField of ["event_at", "created_at"] as const) {
    if (typeof obj[timeField] !== "string" || !isIso8601(obj[timeField])) {
      throw new ArtifactValidationError(timeField, "invalid ISO-8601");
    }
  }
  if (typeof obj.lifecycle_state !== "string" || !obj.lifecycle_state.trim()) {
    throw new ArtifactValidationError("lifecycle_state", "required");
  }
  validateProvenance(obj.provenance);

  return obj as Artifact;
}

export function assertArtifactSchemaVersion(artifact: Artifact): void {
  if (artifact.schema_version !== ARTIFACT_SCHEMA_VERSION) {
    throw new ArtifactValidationError(
      "schema_version",
      `expected ${ARTIFACT_SCHEMA_VERSION}, got ${artifact.schema_version}`,
    );
  }
}

export type { ArtifactFieldKey, LifecycleState };
