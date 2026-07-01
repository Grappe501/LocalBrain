import {
  CONVERSATION_FIELD_KEYS,
  CONVERSATION_SCHEMA_VERSION,
  CONVERSATION_CHANNELS,
  type Conversation,
  type ConversationFieldKey,
  isConversationChannel,
  isIso8601,
  isMemoryDomain,
  isMemoryObjectRef,
  isTrustLevel,
  type LifecycleState,
} from "@localbrain/shared";

export class ConversationValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.name = "ConversationValidationError";
    this.field = field;
  }
}

const FORBIDDEN_FIELDS = [
  "statement",
  "confidence",
  "summary",
  "normalized_content",
  "sentiment",
  "interpretation",
  "conclusion",
  "subject_ref",
  "predicate",
  "object_ref",
  "supersedes",
  "superseded_by",
  "reconciled_interpretation",
  "consensus_summary",
  "inferred_speaker",
  "speaker_inference",
  "normalized_attribution",
  "reconciliation",
  "agreed_interpretation",
] as const;

function assertObject(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ConversationValidationError(field, "must be an object");
  }
  return value as Record<string, unknown>;
}

function validateIdentityRef(value: unknown, field: string): void {
  const obj = assertObject(value, field);
  if (typeof obj.identity_id !== "string" || !obj.identity_id.trim()) {
    throw new ConversationValidationError(field, "identity_id is required");
  }
  if (typeof obj.identity_kind !== "string" || !obj.identity_kind.trim()) {
    throw new ConversationValidationError(field, "identity_kind is required");
  }
}

function validateProvenance(value: unknown): void {
  const field = "provenance";
  const obj = assertObject(value, field);
  if (typeof obj.provenance_id !== "string" || !obj.provenance_id.trim()) {
    throw new ConversationValidationError(field, "provenance_id is required");
  }
  validateIdentityRef(obj.captured_by, "provenance.captured_by");
  const method = obj.capture_method;
  if (method !== "direct" && method !== "import" && method !== "inference" && method !== "system") {
    throw new ConversationValidationError(field, "invalid capture_method");
  }
  if (typeof obj.source_ref !== "string" || !obj.source_ref.trim()) {
    throw new ConversationValidationError(field, "source_ref is required");
  }
  if (obj.consent_ref !== null && typeof obj.consent_ref !== "string") {
    throw new ConversationValidationError(field, "consent_ref must be string or null");
  }
  if (typeof obj.convention_provenance_version !== "string") {
    throw new ConversationValidationError(field, "convention_provenance_version is required");
  }
  const trust = assertObject(obj.trust, "provenance.trust");
  if (typeof trust.level !== "string" || !isTrustLevel(trust.level)) {
    throw new ConversationValidationError("provenance.trust.level", "invalid trust level");
  }
  if (typeof trust.evaluated_at !== "string" || !isIso8601(trust.evaluated_at)) {
    throw new ConversationValidationError("provenance.trust.evaluated_at", "invalid ISO-8601");
  }
  if (typeof obj.recorded_at !== "string" || !isIso8601(obj.recorded_at)) {
    throw new ConversationValidationError(field, "recorded_at must be ISO-8601");
  }
}

export function validateConversationRecord(value: unknown): Conversation {
  const obj = assertObject(value, "conversation");

  for (const forbidden of FORBIDDEN_FIELDS) {
    if (forbidden in obj) {
      throw new ConversationValidationError(
        forbidden,
        "forbidden field — conversations preserve context, not knowledge or summaries",
      );
    }
  }

  const allowed = new Set<string>(CONVERSATION_FIELD_KEYS);
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      throw new ConversationValidationError(key, "unknown field — reject unknown fields");
    }
  }

  for (const key of CONVERSATION_FIELD_KEYS) {
    if (key === "summary_ref") continue;
    if (!(key in obj)) {
      throw new ConversationValidationError(key, "required field missing");
    }
  }

  if (typeof obj.conversation_id !== "string" || !obj.conversation_id.trim()) {
    throw new ConversationValidationError("conversation_id", "required");
  }
  if (typeof obj.schema_version !== "string" || !obj.schema_version.trim()) {
    throw new ConversationValidationError("schema_version", "required");
  }
  if (typeof obj.domain !== "string" || !isMemoryDomain(obj.domain)) {
    throw new ConversationValidationError("domain", "invalid domain enum");
  }
  if (typeof obj.channel !== "string" || !isConversationChannel(obj.channel)) {
    throw new ConversationValidationError("channel", "invalid channel enum");
  }
  if (!Array.isArray(obj.participants) || obj.participants.length === 0) {
    throw new ConversationValidationError("participants", "at least one participant required");
  }
  for (let i = 0; i < obj.participants.length; i += 1) {
    validateIdentityRef(obj.participants[i], `participants[${i}]`);
  }
  for (const timeField of ["started_at", "event_at", "created_at"] as const) {
    if (typeof obj[timeField] !== "string" || !isIso8601(obj[timeField])) {
      throw new ConversationValidationError(timeField, "invalid ISO-8601");
    }
  }
  if (!Array.isArray(obj.turn_refs) || obj.turn_refs.length === 0) {
    throw new ConversationValidationError("turn_refs", "at least one turn_ref required");
  }
  for (let i = 0; i < obj.turn_refs.length; i += 1) {
    const ref = obj.turn_refs[i];
    if (typeof ref !== "string" || !ref.trim()) {
      throw new ConversationValidationError(`turn_refs[${i}]`, "must be non-empty string");
    }
  }
  if (obj.summary_ref !== undefined) {
    if (typeof obj.summary_ref !== "string" || !obj.summary_ref.trim()) {
      throw new ConversationValidationError("summary_ref", "must be non-empty string when present");
    }
    if (!isMemoryObjectRef(obj.summary_ref)) {
      throw new ConversationValidationError(
        "summary_ref",
        "must reference a separate memory object — never inline summary content",
      );
    }
  }
  if (typeof obj.lifecycle_state !== "string" || !obj.lifecycle_state.trim()) {
    throw new ConversationValidationError("lifecycle_state", "required");
  }
  validateProvenance(obj.provenance);

  return obj as Conversation;
}

export function assertConversationSchemaVersion(conversation: Conversation): void {
  if (conversation.schema_version !== CONVERSATION_SCHEMA_VERSION) {
    throw new ConversationValidationError(
      "schema_version",
      `expected ${CONVERSATION_SCHEMA_VERSION}, got ${conversation.schema_version}`,
    );
  }
}

export { CONVERSATION_CHANNELS, type ConversationFieldKey, type LifecycleState };
