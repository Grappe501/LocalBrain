import {
  deserializeConversationTurn,
  type ConversationTurn,
  serializeConversationTurn,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export class ConversationTurnNotFoundError extends Error {
  constructor(turnId: string) {
    super(`ConversationTurn not found: ${turnId}`);
    this.name = "ConversationTurnNotFoundError";
  }
}

export class ConversationTurnImmutableFieldError extends Error {
  constructor(field: string) {
    super(`ConversationTurn authoritative field is immutable: ${field}`);
    this.name = "ConversationTurnImmutableFieldError";
  }
}

export function insertConversationTurn(turn: ConversationTurn): void {
  getDatabase()
    .prepare(
      `INSERT INTO memory_conversation_turns (
        turn_id, conversation_id, sequence, payload_json, event_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      turn.turn_id,
      turn.conversation_id,
      turn.sequence,
      serializeConversationTurn(turn),
      turn.event_at,
      turn.created_at,
    );
}

export function getConversationTurnById(turnId: string): ConversationTurn | null {
  const row = getDatabase()
    .prepare(`SELECT payload_json FROM memory_conversation_turns WHERE turn_id = ?`)
    .get(turnId) as { payload_json: string } | undefined;
  if (!row) return null;
  return deserializeConversationTurn(row.payload_json);
}

export function getConversationTurnsByConversationId(conversationId: string): ConversationTurn[] {
  const rows = getDatabase()
    .prepare(
      `SELECT payload_json FROM memory_conversation_turns
       WHERE conversation_id = ?
       ORDER BY sequence ASC, event_at ASC`,
    )
    .all(conversationId) as { payload_json: string }[];

  return rows.map((row) => deserializeConversationTurn(row.payload_json));
}

export function conversationTurnContentFingerprint(turn: ConversationTurn): string {
  return JSON.stringify({
    turn_id: turn.turn_id,
    conversation_id: turn.conversation_id,
    sequence: turn.sequence,
    speaker_ref: turn.speaker_ref,
    content: turn.content,
    substrate_refs: turn.substrate_refs ?? null,
    event_at: turn.event_at,
    created_at: turn.created_at,
    schema_version: turn.schema_version,
  });
}

export function assertConversationTurnContentUnchanged(
  before: ConversationTurn,
  after: ConversationTurn,
): void {
  if (conversationTurnContentFingerprint(before) !== conversationTurnContentFingerprint(after)) {
    throw new ConversationTurnImmutableFieldError("content");
  }
}
