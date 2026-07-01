import {
  CONVERSATION_TURN_FIELD_KEYS,
  CONVERSATION_TURN_SCHEMA_VERSION,
  type ConversationTurn,
  type ConversationTurnFieldKey,
  isConversationSubstrateRef,
  isIso8601,
  type LifecycleState,
} from "@localbrain/shared";

export class ConversationTurnValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.name = "ConversationTurnValidationError";
    this.field = field;
  }
}

const FORBIDDEN_FIELDS = [
  "summary",
  "normalized_content",
  "cleaned_content",
  "corrected_content",
  "sentiment",
  "interpretation",
  "statement",
  "confidence",
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
    throw new ConversationTurnValidationError(field, "must be an object");
  }
  return value as Record<string, unknown>;
}

function validateIdentityRef(value: unknown, field: string): void {
  const obj = assertObject(value, field);
  if (typeof obj.identity_id !== "string" || !obj.identity_id.trim()) {
    throw new ConversationTurnValidationError(field, "identity_id is required");
  }
  if (typeof obj.identity_kind !== "string" || !obj.identity_kind.trim()) {
    throw new ConversationTurnValidationError(field, "identity_kind is required");
  }
}

export function validateConversationTurnRecord(value: unknown): ConversationTurn {
  const obj = assertObject(value, "conversation_turn");

  for (const forbidden of FORBIDDEN_FIELDS) {
    if (forbidden in obj) {
      throw new ConversationTurnValidationError(
        forbidden,
        "forbidden field — original wording is canonical",
      );
    }
  }

  const allowed = new Set<string>(CONVERSATION_TURN_FIELD_KEYS);
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      throw new ConversationTurnValidationError(key, "unknown field — reject unknown fields");
    }
  }

  for (const key of CONVERSATION_TURN_FIELD_KEYS) {
    if (key === "substrate_refs") continue;
    if (!(key in obj)) {
      throw new ConversationTurnValidationError(key, "required field missing");
    }
  }

  if (typeof obj.turn_id !== "string" || !obj.turn_id.trim()) {
    throw new ConversationTurnValidationError("turn_id", "required");
  }
  if (typeof obj.schema_version !== "string" || !obj.schema_version.trim()) {
    throw new ConversationTurnValidationError("schema_version", "required");
  }
  if (typeof obj.conversation_id !== "string" || !obj.conversation_id.trim()) {
    throw new ConversationTurnValidationError("conversation_id", "required");
  }
  if (typeof obj.sequence !== "number" || !Number.isInteger(obj.sequence) || obj.sequence < 1) {
    throw new ConversationTurnValidationError("sequence", "must be integer >= 1");
  }
  validateIdentityRef(obj.speaker_ref, "speaker_ref");
  if (typeof obj.content !== "string" || !obj.content.trim()) {
    throw new ConversationTurnValidationError("content", "required — original wording is canonical");
  }
  if (obj.substrate_refs !== undefined) {
    if (!Array.isArray(obj.substrate_refs)) {
      throw new ConversationTurnValidationError("substrate_refs", "must be array when present");
    }
    for (let i = 0; i < obj.substrate_refs.length; i += 1) {
      const ref = obj.substrate_refs[i];
      if (typeof ref !== "string" || !isConversationSubstrateRef(ref)) {
        throw new ConversationTurnValidationError(
          `substrate_refs[${i}]`,
          "must reference episode, fact, or artifact only",
        );
      }
    }
  }
  for (const timeField of ["event_at", "created_at"] as const) {
    if (typeof obj[timeField] !== "string" || !isIso8601(obj[timeField])) {
      throw new ConversationTurnValidationError(timeField, "invalid ISO-8601");
    }
  }

  return obj as ConversationTurn;
}

export function assertConversationTurnSchemaVersion(turn: ConversationTurn): void {
  if (turn.schema_version !== CONVERSATION_TURN_SCHEMA_VERSION) {
    throw new ConversationTurnValidationError(
      "schema_version",
      `expected ${CONVERSATION_TURN_SCHEMA_VERSION}, got ${turn.schema_version}`,
    );
  }
}

export type { ConversationTurnFieldKey, LifecycleState };
