import type { Conversation, ConversationTurn } from "@localbrain/shared";
import { ENG_MEM_ENGINE_ID } from "@localbrain/shared";
import { getConversationById } from "./conversationStore.js";
import {
  getConversationTurnById,
  getConversationTurnsByConversationId,
} from "./conversationTurnStore.js";
import { validateConversationRecord } from "./conversationValidator.js";
import { validateConversationTurnRecord } from "./conversationTurnValidator.js";

export const CONVERSATION_CONTEXT_QUESTION =
  "What context produced this interpretation?" as const;

export type ConversationContextMethod = "substrate_reconstruction";

export type ConversationContextTurn = {
  sequence: number;
  turn_id: string;
  speaker_ref: ConversationTurn["speaker_ref"];
  content: string;
  event_at: string;
  substrate_refs?: ConversationTurn["substrate_refs"];
};

export type ConversationContext = {
  question: typeof CONVERSATION_CONTEXT_QUESTION;
  conversation_id: string;
  engine_id: typeof ENG_MEM_ENGINE_ID;
  method: ConversationContextMethod;
  channel: Conversation["channel"];
  participants: Conversation["participants"];
  started_at: string;
  /** Chronological turns — original wording preserved. */
  turns: ConversationContextTurn[];
  cited_field_paths: string[];
};

export class ConversationContextError extends Error {
  readonly conversation_id: string;

  constructor(conversationId: string, reason: string) {
    super(`Conversation ${conversationId} context not reconstructable: ${reason}`);
    this.name = "ConversationContextError";
    this.conversation_id = conversationId;
  }
}

/**
 * A14 — deterministic context reconstruction from stored Conversation + ConversationTurn only.
 * No Intelligence · no normalization · no graph traversal.
 */
export function reconstructConversationContext(
  conversation: Conversation,
  turns: ConversationTurn[],
): ConversationContext {
  validateConversationRecord(conversation);

  const turnById = new Map(turns.map((turn) => [turn.turn_id, turn]));
  const ordered: ConversationTurn[] = [];

  for (const ref of conversation.turn_refs) {
    const turn = turnById.get(ref);
    if (!turn) {
      throw new ConversationContextError(
        conversation.conversation_id,
        `missing turn for ref ${ref}`,
      );
    }
    validateConversationTurnRecord(turn);
    if (turn.conversation_id !== conversation.conversation_id) {
      throw new ConversationContextError(
        conversation.conversation_id,
        `turn ${turn.turn_id} belongs to another conversation`,
      );
    }
    ordered.push(turn);
  }

  const chronological = [...ordered].sort((a, b) => {
    if (a.sequence !== b.sequence) return a.sequence - b.sequence;
    return a.event_at.localeCompare(b.event_at);
  });

  const cited = new Set<string>([
    "conversation.conversation_id",
    "conversation.channel",
    "conversation.participants",
    "conversation.started_at",
    "conversation.turn_refs",
  ]);

  return {
    question: CONVERSATION_CONTEXT_QUESTION,
    conversation_id: conversation.conversation_id,
    engine_id: ENG_MEM_ENGINE_ID,
    method: "substrate_reconstruction",
    channel: conversation.channel,
    participants: conversation.participants,
    started_at: conversation.started_at,
    turns: chronological.map((turn) => {
      cited.add(`turn.${turn.turn_id}.content`);
      cited.add(`turn.${turn.turn_id}.speaker_ref`);
      cited.add(`turn.${turn.turn_id}.event_at`);
      cited.add(`turn.${turn.turn_id}.sequence`);
      if (turn.substrate_refs?.length) {
        cited.add(`turn.${turn.turn_id}.substrate_refs`);
      }
      return {
        sequence: turn.sequence,
        turn_id: turn.turn_id,
        speaker_ref: turn.speaker_ref,
        content: turn.content,
        event_at: turn.event_at,
        substrate_refs: turn.substrate_refs,
      };
    }),
    cited_field_paths: [...cited].sort(),
  };
}

export function explainConversationContext(conversationId: string): ConversationContext {
  const conversation = getConversationById(conversationId);
  if (!conversation) {
    throw new ConversationContextError(conversationId, "conversation not found");
  }
  const turns = getConversationTurnsByConversationId(conversationId);
  return reconstructConversationContext(conversation, turns);
}

export function loadTurnsForConversation(conversation: Conversation): ConversationTurn[] {
  return conversation.turn_refs.map((turnId) => {
    const turn = getConversationTurnById(turnId);
    if (!turn) {
      throw new ConversationContextError(conversation.conversation_id, `turn not found: ${turnId}`);
    }
    return turn;
  });
}
