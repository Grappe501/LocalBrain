import type { Conversation, ConversationTurn } from "@localbrain/shared";
import { ENG_MEM_ENGINE_ID, identityRefMatches } from "@localbrain/shared";
import { conversationTurnContentFingerprint } from "./conversationTurnStore.js";

export const INTERPRETATION_INDEPENDENCE_INVARIANT =
  "Interpretation survives disagreement." as const;

export const CONVERSATION_ATTRIBUTION_QUESTION =
  "Who expressed this interpretation?" as const;

export type ConversationAttributionMethod = "substrate_reconstruction";

export type ConversationAttributionTurn = {
  turn_id: string;
  sequence: number;
  speaker_ref: ConversationTurn["speaker_ref"];
  content: string;
  event_at: string;
};

export type ConversationAttributionIntegrity = {
  question: typeof CONVERSATION_ATTRIBUTION_QUESTION;
  conversation_id: string;
  engine_id: typeof ENG_MEM_ENGINE_ID;
  method: ConversationAttributionMethod;
  /** Per-turn attribution — preserved, not reconciled. */
  turns: ConversationAttributionTurn[];
  checks: {
    attribution_preserved: boolean;
    speaker_identity_preserved: boolean;
    turn_ownership_immutable: boolean;
    attribution_not_inferred: boolean;
    speakers_are_participants: boolean;
  };
  cited_field_paths: string[];
};

export class ConversationAttributionError extends Error {
  readonly conversation_id: string;

  constructor(conversationId: string, reason: string) {
    super(`Conversation ${conversationId} attribution integrity failed: ${reason}`);
    this.name = "ConversationAttributionError";
    this.conversation_id = conversationId;
  }
}

/**
 * A16 — deterministic attribution reconstruction from stored Conversation + ConversationTurn only.
 * Interpretation Independence: contradictory interpretations coexist — Conversation never reconciles.
 */
export function verifyConversationAttributionIntegrity(
  conversation: Conversation,
  storedTurns: ConversationTurn[],
): ConversationAttributionIntegrity {
  const forConversation = storedTurns.filter(
    (turn) => turn.conversation_id === conversation.conversation_id,
  );

  if (forConversation.length !== conversation.turn_refs.length) {
    throw new ConversationAttributionError(
      conversation.conversation_id,
      "turn set mismatch",
    );
  }

  const cited = new Set<string>(["conversation.participants"]);
  const turns: ConversationAttributionTurn[] = [];

  for (const ref of conversation.turn_refs) {
    const turn = forConversation.find((t) => t.turn_id === ref);
    if (!turn) {
      throw new ConversationAttributionError(
        conversation.conversation_id,
        `missing turn ${ref}`,
      );
    }

    if (!turn.speaker_ref?.identity_id?.trim() || !turn.speaker_ref?.identity_kind?.trim()) {
      throw new ConversationAttributionError(
        conversation.conversation_id,
        `turn ${ref} missing speaker attribution`,
      );
    }

    const speakerInParticipants = conversation.participants.some((participant) =>
      identityRefMatches(participant, turn.speaker_ref),
    );
    if (!speakerInParticipants) {
      throw new ConversationAttributionError(
        conversation.conversation_id,
        `turn ${ref} speaker not in participants — attribution must be explicit`,
      );
    }

    cited.add(`turn.${turn.turn_id}.speaker_ref`);
    cited.add(`turn.${turn.turn_id}.speaker_ref.identity_id`);
    cited.add(`turn.${turn.turn_id}.speaker_ref.identity_kind`);
    cited.add(`turn.${turn.turn_id}.content`);
    cited.add(`turn.${turn.turn_id}.conversation_id`);

    turns.push({
      turn_id: turn.turn_id,
      sequence: turn.sequence,
      speaker_ref: turn.speaker_ref,
      content: turn.content,
      event_at: turn.event_at,
    });
  }

  const ownershipImmutable = forConversation.every(
    (turn) => turn.conversation_id === conversation.conversation_id,
  );

  const speakerIdentityPreserved = forConversation.every(
    (turn) =>
      typeof turn.speaker_ref.identity_id === "string" &&
      typeof turn.speaker_ref.identity_kind === "string" &&
      conversationTurnContentFingerprint(turn).includes(turn.speaker_ref.identity_id),
  );

  return {
    question: CONVERSATION_ATTRIBUTION_QUESTION,
    conversation_id: conversation.conversation_id,
    engine_id: ENG_MEM_ENGINE_ID,
    method: "substrate_reconstruction",
    turns,
    checks: {
      attribution_preserved: true,
      speaker_identity_preserved: speakerIdentityPreserved,
      turn_ownership_immutable: ownershipImmutable,
      attribution_not_inferred: true,
      speakers_are_participants: true,
    },
    cited_field_paths: [...cited].sort(),
  };
}

export function isCompleteAttributionIntegrity(result: ConversationAttributionIntegrity): boolean {
  return Object.values(result.checks).every(Boolean) && result.turns.length > 0;
}
