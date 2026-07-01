import type { MemoryDomain } from "./primitives.js";
import type { IdentityRef, MemoryProvenanceEnvelope } from "./primitives.js";
import type { LifecycleState } from "./lifecycle.js";
import { CONVERSATION_SCHEMA_VERSION } from "./constants.js";

/** Vol 2 § Conversations — channel enum (memory-spec-v1.0). */
export type ConversationChannel =
  | "email"
  | "chat"
  | "meeting"
  | "phone"
  | "sms"
  | "internal"
  | "other";

export const CONVERSATION_CHANNELS: readonly ConversationChannel[] = [
  "email",
  "chat",
  "meeting",
  "phone",
  "sms",
  "internal",
  "other",
] as const;

export function isConversationChannel(value: string): value is ConversationChannel {
  return (CONVERSATION_CHANNELS as readonly string[]).includes(value);
}

/** Canonical Conversation — Volume 2 § Conversations (memory-spec-v1.0). */
export type Conversation = {
  conversation_id: string;
  schema_version: typeof CONVERSATION_SCHEMA_VERSION | string;
  domain: MemoryDomain;
  channel: ConversationChannel;
  participants: IdentityRef[];
  started_at: string;
  turn_refs: string[];
  summary_ref?: string;
  lifecycle_state: LifecycleState;
  provenance: MemoryProvenanceEnvelope;
  event_at: string;
  created_at: string;
};

export const CONVERSATION_FIELD_KEYS = [
  "conversation_id",
  "schema_version",
  "domain",
  "channel",
  "participants",
  "started_at",
  "turn_refs",
  "summary_ref",
  "lifecycle_state",
  "provenance",
  "event_at",
  "created_at",
] as const;

export type ConversationFieldKey = (typeof CONVERSATION_FIELD_KEYS)[number];

export function serializeConversation(conversation: Conversation): string {
  return JSON.stringify(conversation);
}

export function deserializeConversation(json: string): Conversation {
  return JSON.parse(json) as Conversation;
}

export function conversationsEquivalent(a: Conversation, b: Conversation): boolean {
  return serializeConversation(a) === serializeConversation(b);
}
