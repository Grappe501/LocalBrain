import {
  CONVERSATION_INITIAL_LIFECYCLE,
  CONVERSATION_KIND,
  CONVERSATION_SCHEMA_VERSION,
  CONVERSATION_TURN_SCHEMA_VERSION,
  type CaptureMethod,
  type Conversation,
  type ConversationChannel,
  type ConversationTurn,
  type IdentityRef,
  identityRefMatches,
  type LifecycleState,
  type MemoryDomain,
  type TrustLevel,
} from "@localbrain/shared";
import { appendMemoryAuditEvent } from "./auditLog.js";
import {
  getConversationById,
  insertConversation,
  updateConversationLifecycleState,
} from "./conversationStore.js";
import { insertConversationTurn } from "./conversationTurnStore.js";
import {
  assertConversationSchemaVersion,
  validateConversationRecord,
} from "./conversationValidator.js";
import {
  assertConversationTurnSchemaVersion,
  validateConversationTurnRecord,
} from "./conversationTurnValidator.js";
import {
  buildMemoryProvenanceEnvelope,
  MEMORY_AUDIT_OBJECT_CONVERSATION,
} from "./provenanceEnvelope.js";
import { assertContiguousTurnSequence } from "./conversationSequenceIntegrity.js";

export type CreateConversationTurnInput = {
  sequence: number;
  speaker_ref: IdentityRef;
  content: string;
  event_at: string;
  substrate_refs?: string[];
};

export type CreateConversationInput = {
  domain: MemoryDomain;
  channel: ConversationChannel;
  participants: IdentityRef[];
  started_at: string;
  event_at: string;
  captured_by: IdentityRef;
  capture_method: CaptureMethod;
  source_ref: string;
  turns: CreateConversationTurnInput[];
  summary_ref?: string;
  consent_ref?: string | null;
  trust_level?: TrustLevel;
};

export function createConversation(input: CreateConversationInput): {
  conversation: Conversation;
  turns: ConversationTurn[];
} {
  if (!input.turns.length) {
    throw new Error("Conversation requires at least one turn");
  }

  assertContiguousTurnSequence(
    input.turns.map((turn) => ({ sequence: turn.sequence })),
  );

  const orderedInputs = [...input.turns].sort((a, b) => {
    if (a.sequence !== b.sequence) return a.sequence - b.sequence;
    return a.event_at.localeCompare(b.event_at);
  });

  const createdAt = new Date().toISOString();
  const conversationId = crypto.randomUUID();
  const provenance = buildMemoryProvenanceEnvelope({
    captured_by: input.captured_by,
    capture_method: input.capture_method,
    source_ref: input.source_ref,
    consent_ref: input.consent_ref,
    trust_level: input.trust_level,
    recorded_at: createdAt,
  });

  const turns: ConversationTurn[] = orderedInputs.map((turnInput) => {
    const speakerKnown = input.participants.some((participant) =>
      identityRefMatches(participant, turnInput.speaker_ref),
    );
    if (!speakerKnown) {
      throw new Error(
        `Turn sequence ${turnInput.sequence}: speaker must be a declared participant — attribution must be explicit, not inferred`,
      );
    }

    const turn: ConversationTurn = {
      turn_id: crypto.randomUUID(),
      schema_version: CONVERSATION_TURN_SCHEMA_VERSION,
      conversation_id: conversationId,
      sequence: turnInput.sequence,
      speaker_ref: turnInput.speaker_ref,
      content: turnInput.content,
      substrate_refs: turnInput.substrate_refs,
      event_at: turnInput.event_at,
      created_at: createdAt,
    };
    const validated = validateConversationTurnRecord(turn);
    assertConversationTurnSchemaVersion(validated);
    insertConversationTurn(validated);
    return validated;
  });

  const draft: Conversation = {
    conversation_id: conversationId,
    schema_version: CONVERSATION_SCHEMA_VERSION,
    domain: input.domain,
    channel: input.channel,
    participants: input.participants,
    started_at: input.started_at,
    turn_refs: turns.map((turn) => turn.turn_id),
    summary_ref: input.summary_ref,
    lifecycle_state: CONVERSATION_INITIAL_LIFECYCLE,
    provenance,
    event_at: input.event_at,
    created_at: createdAt,
  };

  const conversation = validateConversationRecord(draft);
  assertConversationSchemaVersion(conversation);
  insertConversation(conversation);

  appendMemoryAuditEvent({
    event_type: "memory.capture",
    object_type: MEMORY_AUDIT_OBJECT_CONVERSATION,
    object_id: conversation.conversation_id,
    to_state: conversation.lifecycle_state,
    actor_identity_id: input.captured_by.identity_id,
    detail: {
      domain: conversation.domain,
      channel: conversation.channel,
      turn_count: turns.length,
      engine: "ENG-MEM-001",
    },
  });

  return { conversation, turns };
}

export function transitionConversationLifecycle(
  conversationId: string,
  nextState: LifecycleState,
  actor: IdentityRef,
  eventType: string,
): Conversation {
  const before = getConversationById(conversationId);
  if (!before) {
    throw new Error(`Conversation not found: ${conversationId}`);
  }

  const updated = updateConversationLifecycleState(conversationId, nextState, new Date().toISOString());
  validateConversationRecord(updated);

  appendMemoryAuditEvent({
    event_type: eventType,
    object_type: CONVERSATION_KIND,
    object_id: conversationId,
    from_state: before.lifecycle_state,
    to_state: nextState,
    actor_identity_id: actor.identity_id,
  });

  return updated;
}

export function verifyConversation(conversationId: string, actor: IdentityRef): Conversation {
  return transitionConversationLifecycle(conversationId, "Verified", actor, "memory.verify");
}
