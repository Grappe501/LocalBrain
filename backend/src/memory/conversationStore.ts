import {
  assertLifecycleTransitionAllowed,
  deserializeConversation,
  type Conversation,
  serializeConversation,
  type LifecycleState,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export class ConversationNotFoundError extends Error {
  constructor(conversationId: string) {
    super(`Conversation not found: ${conversationId}`);
    this.name = "ConversationNotFoundError";
  }
}

export class ConversationImmutableFieldError extends Error {
  constructor(field: string) {
    super(`Conversation authoritative field is immutable: ${field}`);
    this.name = "ConversationImmutableFieldError";
  }
}

export function insertConversation(conversation: Conversation): void {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO memory_conversations (
      conversation_id, domain, lifecycle_state, schema_version,
      payload_json, created_at, lifecycle_updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    conversation.conversation_id,
    conversation.domain,
    conversation.lifecycle_state,
    conversation.schema_version,
    serializeConversation(conversation),
    conversation.created_at,
    conversation.created_at,
  );
}

export function getConversationById(conversationId: string): Conversation | null {
  const row = getDatabase()
    .prepare(`SELECT payload_json FROM memory_conversations WHERE conversation_id = ?`)
    .get(conversationId) as { payload_json: string } | undefined;
  if (!row) return null;
  return deserializeConversation(row.payload_json);
}

export function updateConversationLifecycleState(
  conversationId: string,
  nextState: LifecycleState,
  lifecycleUpdatedAt: string,
): Conversation {
  const current = getConversationById(conversationId);
  if (!current) throw new ConversationNotFoundError(conversationId);

  assertLifecycleTransitionAllowed(current.lifecycle_state, nextState);

  const updated: Conversation = {
    ...current,
    lifecycle_state: nextState,
  };

  getDatabase()
    .prepare(
      `UPDATE memory_conversations
       SET lifecycle_state = ?, payload_json = ?, lifecycle_updated_at = ?
       WHERE conversation_id = ?`,
    )
    .run(nextState, serializeConversation(updated), lifecycleUpdatedAt, conversationId);

  return updated;
}

export function conversationContentFingerprint(conversation: Conversation): string {
  const { lifecycle_state: _state, ...content } = conversation;
  return JSON.stringify(content);
}

export function assertConversationContentUnchanged(before: Conversation, after: Conversation): void {
  if (conversationContentFingerprint(before) !== conversationContentFingerprint(after)) {
    throw new ConversationImmutableFieldError("payload");
  }
}
