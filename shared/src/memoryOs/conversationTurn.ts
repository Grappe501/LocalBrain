import type { IdentityRef } from "./primitives.js";
import { CONVERSATION_TURN_SCHEMA_VERSION } from "./constants.js";
import type { MemoryObjectRef } from "./memoryRef.js";

/** ConversationTurn — child of Conversation (not a graph node). */
export type ConversationTurn = {
  turn_id: string;
  schema_version: typeof CONVERSATION_TURN_SCHEMA_VERSION | string;
  conversation_id: string;
  sequence: number;
  speaker_ref: IdentityRef;
  /** Original wording — canonical and immutable after capture. */
  content: string;
  /** Optional references to Episode · Artifact · Fact — reference only, never ownership. */
  substrate_refs?: MemoryObjectRef[];
  event_at: string;
  created_at: string;
};

export const CONVERSATION_TURN_FIELD_KEYS = [
  "turn_id",
  "schema_version",
  "conversation_id",
  "sequence",
  "speaker_ref",
  "content",
  "substrate_refs",
  "event_at",
  "created_at",
] as const;

export type ConversationTurnFieldKey = (typeof CONVERSATION_TURN_FIELD_KEYS)[number];

export function serializeConversationTurn(turn: ConversationTurn): string {
  return JSON.stringify(turn);
}

export function deserializeConversationTurn(json: string): ConversationTurn {
  return JSON.parse(json) as ConversationTurn;
}

export function conversationTurnsEquivalent(a: ConversationTurn, b: ConversationTurn): boolean {
  return serializeConversationTurn(a) === serializeConversationTurn(b);
}
