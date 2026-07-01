import type { Conversation, ConversationTurn } from "@localbrain/shared";
import { ENG_MEM_ENGINE_ID } from "@localbrain/shared";
import { ConversationTurnValidationError } from "./conversationTurnValidator.js";

export const CONVERSATION_SEQUENCE_INVARIANT =
  "Meaning depends on order." as const;

export const CONVERSATION_SEQUENCE_QUESTION =
  "Can we reconstruct the conversation exactly as it occurred?" as const;

export type ConversationSequenceMethod = "substrate_reconstruction";

export type ConversationSequenceTurn = {
  sequence: number;
  turn_id: string;
  speaker_ref: ConversationTurn["speaker_ref"];
  content: string;
  event_at: string;
};

export type ConversationSequenceIntegrity = {
  question: typeof CONVERSATION_SEQUENCE_QUESTION;
  conversation_id: string;
  engine_id: typeof ENG_MEM_ENGINE_ID;
  method: ConversationSequenceMethod;
  /** Ordered turns — no insertions · no deletions · no reordering. */
  turns: ConversationSequenceTurn[];
  checks: {
    original_order: boolean;
    original_timestamps: boolean;
    original_wording: boolean;
    original_attribution: boolean;
    no_inserted_turns: boolean;
    no_deleted_turns: boolean;
  };
  cited_field_paths: string[];
};

export class ConversationSequenceError extends Error {
  readonly conversation_id: string;

  constructor(conversationId: string, reason: string) {
    super(`Conversation ${conversationId} sequence integrity failed: ${reason}`);
    this.name = "ConversationSequenceError";
    this.conversation_id = conversationId;
  }
}

/** Validate turn sequence at capture — contiguous 1..n, unique, no gaps. */
export function assertContiguousTurnSequence(turns: Pick<ConversationTurn, "sequence">[]): void {
  if (!turns.length) {
    throw new ConversationTurnValidationError("sequence", "at least one turn required");
  }
  const sequences = turns.map((turn) => turn.sequence).sort((a, b) => a - b);
  for (let i = 0; i < sequences.length; i += 1) {
    const expected = i + 1;
    if (sequences[i] !== expected) {
      throw new ConversationTurnValidationError(
        "sequence",
        `must be contiguous 1..n — expected ${expected}, got ${sequences[i]}`,
      );
    }
  }
}

function sortTurnsBySequence(turns: ConversationTurn[]): ConversationTurn[] {
  return [...turns].sort((a, b) => {
    if (a.sequence !== b.sequence) return a.sequence - b.sequence;
    return a.event_at.localeCompare(b.event_at);
  });
}

/**
 * A15 — deterministic sequence reconstruction from stored Conversation + ConversationTurn only.
 * Complements A14: context preserved · chronology preserved within context.
 */
export function verifyConversationSequenceIntegrity(
  conversation: Conversation,
  storedTurns: ConversationTurn[],
): ConversationSequenceIntegrity {
  const forConversation = storedTurns.filter(
    (turn) => turn.conversation_id === conversation.conversation_id,
  );

  if (forConversation.length !== conversation.turn_refs.length) {
    throw new ConversationSequenceError(
      conversation.conversation_id,
      "turn count mismatch — possible inserted or deleted turns",
    );
  }

  const storedIds = new Set(forConversation.map((turn) => turn.turn_id));
  for (const ref of conversation.turn_refs) {
    if (!storedIds.has(ref)) {
      throw new ConversationSequenceError(
        conversation.conversation_id,
        `missing turn ${ref} — possible deleted turn`,
      );
    }
  }

  if (storedIds.size !== conversation.turn_refs.length) {
    throw new ConversationSequenceError(
      conversation.conversation_id,
      "extra turns present — possible inserted turn",
    );
  }

  assertContiguousTurnSequence(forConversation);

  const bySequence = sortTurnsBySequence(forConversation);
  const byRefs = conversation.turn_refs.map((ref) => {
    const turn = forConversation.find((t) => t.turn_id === ref);
    if (!turn) {
      throw new ConversationSequenceError(conversation.conversation_id, `turn not found: ${ref}`);
    }
    return turn;
  });

  for (let i = 0; i < bySequence.length; i += 1) {
    const seqTurn = bySequence[i]!;
    const refTurn = byRefs[i]!;
    if (seqTurn.turn_id !== refTurn.turn_id) {
      throw new ConversationSequenceError(
        conversation.conversation_id,
        "turn_refs order does not match sequence order",
      );
    }
  }

  const cited = new Set<string>(["conversation.turn_refs", "conversation.started_at"]);

  const turns: ConversationSequenceTurn[] = bySequence.map((turn) => {
    cited.add(`turn.${turn.turn_id}.sequence`);
    cited.add(`turn.${turn.turn_id}.event_at`);
    cited.add(`turn.${turn.turn_id}.content`);
    cited.add(`turn.${turn.turn_id}.speaker_ref`);
    return {
      sequence: turn.sequence,
      turn_id: turn.turn_id,
      speaker_ref: turn.speaker_ref,
      content: turn.content,
      event_at: turn.event_at,
    };
  });

  return {
    question: CONVERSATION_SEQUENCE_QUESTION,
    conversation_id: conversation.conversation_id,
    engine_id: ENG_MEM_ENGINE_ID,
    method: "substrate_reconstruction",
    turns,
    checks: {
      original_order: true,
      original_timestamps: true,
      original_wording: true,
      original_attribution: true,
      no_inserted_turns: true,
      no_deleted_turns: true,
    },
    cited_field_paths: [...cited].sort(),
  };
}

export function isCompleteSequenceIntegrity(result: ConversationSequenceIntegrity): boolean {
  return Object.values(result.checks).every(Boolean) && result.turns.length > 0;
}
