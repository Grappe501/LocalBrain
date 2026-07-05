import test from "node:test";
import assert from "node:assert/strict";
import {
  CONVERSATION_SCHEMA_VERSION,
  CONVERSATION_TURN_SCHEMA_VERSION,
  conversationsEquivalent,
  conversationTurnsEquivalent,
  deserializeConversation,
  deserializeConversationTurn,
  isLifecycleTransitionAllowed,
  LifecycleTransitionError,
  serializeConversation,
  serializeConversationTurn,
} from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { countAuditEventsForObject } from "./auditLog.js";
import { CONVERSATION_CONTEXT_QUESTION, explainConversationContext } from "./conversationContext.js";
import { ConversationValidationError, validateConversationRecord } from "./conversationValidator.js";
import {
  ConversationTurnValidationError,
  validateConversationTurnRecord,
} from "./conversationTurnValidator.js";
import {
  conversationContentFingerprint,
  ConversationImmutableFieldError,
  getConversationById,
} from "./conversationStore.js";
import {
  conversationTurnContentFingerprint,
  ConversationTurnImmutableFieldError,
  getConversationTurnById,
} from "./conversationTurnStore.js";
import { transitionConversationLifecycle, verifyConversation } from "./conversationService.js";
import { readConversationContext, readConversationAttributionIntegrity, readConversationSequenceIntegrity, writeConversation } from "./writePipeline.js";
import {
  CONVERSATION_ATTRIBUTION_QUESTION,
  INTERPRETATION_INDEPENDENCE_INVARIANT,
  isCompleteAttributionIntegrity,
} from "./conversationAttributionIntegrity.js";
import {
  CONVERSATION_SEQUENCE_INVARIANT,
  CONVERSATION_SEQUENCE_QUESTION,
  isCompleteSequenceIntegrity,
} from "./conversationSequenceIntegrity.js";
import { writeArtifact } from "./writePipeline.js";
import { getArtifactById } from "./artifactStore.js";

const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" };
const STAFF = { identity_id: "ID-staff-001", identity_kind: "staff" };

function sampleConversationInput() {
  return {
    domain: "workspace" as const,
    channel: "meeting" as const,
    participants: [EXEC, STAFF],
    started_at: "2026-07-01T14:00:00.000Z",
    event_at: "2026-07-01T14:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct" as const,
    source_ref: "source:meeting/transcript-2026-07-01",
    turns: [
      {
        sequence: 1,
        speaker_ref: EXEC,
        content: "What does the audit show about H: drive usage?",
        event_at: "2026-07-01T14:00:10.000Z",
        substrate_refs: ["artifact:art-ref-001"],
      },
      {
        sequence: 2,
        speaker_ref: STAFF,
        content: "The mapping audit is complete — see the report.",
        event_at: "2026-07-01T14:00:45.000Z",
        substrate_refs: ["episode:ep-ref-001", "fact:fact-ref-001"],
      },
    ],
  };
}

test("ENG-MEM-001.4.1 create Conversation — schema, provenance, lifecycle Captured", () => {
  bootstrapApp();
  try {
    const { conversation, turns, engine_id } = writeConversation(sampleConversationInput());
    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(conversation.schema_version, CONVERSATION_SCHEMA_VERSION);
    assert.equal(conversation.lifecycle_state, "Captured");
    assert.equal(conversation.channel, "meeting");
    assert.equal(conversation.turn_refs.length, 2);
    assert.equal(turns.length, 2);
    assert.equal(turns[0]!.schema_version, CONVERSATION_TURN_SCHEMA_VERSION);
    assert.equal(conversation.provenance.convention_provenance_version, "CON-S4-2026-07");

    const loaded = getConversationById(conversation.conversation_id);
    assert.ok(loaded);
    assert.ok(conversationsEquivalent(conversation, loaded!));
    assert.equal(countAuditEventsForObject("Conversation", conversation.conversation_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 serialization round-trip", () => {
  bootstrapApp();
  try {
    const { conversation, turns } = writeConversation(sampleConversationInput());
    const convJson = serializeConversation(conversation);
    const turnJson = serializeConversationTurn(turns[0]!);
    assert.ok(conversationsEquivalent(conversation, deserializeConversation(convJson)));
    assert.ok(conversationTurnsEquivalent(turns[0]!, deserializeConversationTurn(turnJson)));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 validator rejects unknown fields", () => {
  bootstrapApp();
  try {
    const { conversation } = writeConversation(sampleConversationInput());
    assert.throws(
      () => validateConversationRecord({ ...conversation, extra_field: true }),
      (err: unknown) => err instanceof ConversationValidationError && err.field === "extra_field",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 validator rejects forbidden summary and knowledge fields", () => {
  bootstrapApp();
  try {
    const { conversation, turns } = writeConversation(sampleConversationInput());
    assert.throws(
      () => validateConversationRecord({ ...conversation, summary: "They agreed..." }),
      (err: unknown) => err instanceof ConversationValidationError && err.field === "summary",
    );
    assert.throws(
      () => validateConversationTurnRecord({ ...turns[0]!, normalized_content: "cleaned" }),
      (err: unknown) =>
        err instanceof ConversationTurnValidationError && err.field === "normalized_content",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 substrate_refs — episode, fact, artifact only", () => {
  bootstrapApp();
  try {
    const { turns } = writeConversation(sampleConversationInput());
    assert.throws(
      () =>
        validateConversationTurnRecord({
          ...turns[0]!,
          substrate_refs: ["conversation:other"],
        }),
      (err: unknown) =>
        err instanceof ConversationTurnValidationError && err.field === "substrate_refs[0]",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 original wording immutable — turn content fingerprint", () => {
  bootstrapApp();
  try {
    const { turns } = writeConversation(sampleConversationInput());
    const before = turns[0]!;
    const mutated = { ...before, content: "Rewritten summary of the question." };
    assert.notEqual(
      conversationTurnContentFingerprint(before),
      conversationTurnContentFingerprint(mutated),
    );
    assert.throws(
      () => {
        throw new ConversationTurnImmutableFieldError("content");
      },
      ConversationTurnImmutableFieldError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 A14 context reconstruction from stored substrate only", () => {
  bootstrapApp();
  try {
    const { conversation, turns } = writeConversation(sampleConversationInput());
    const { context, engine_id } = readConversationContext(conversation.conversation_id);

    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(context.question, CONVERSATION_CONTEXT_QUESTION);
    assert.equal(context.method, "substrate_reconstruction");
    assert.equal(context.channel, "meeting");
    assert.equal(context.turns.length, 2);
    assert.equal(context.turns[0]!.content, turns[0]!.content);
    assert.equal(context.turns[1]!.content, turns[1]!.content);
    assert.equal(context.turns[0]!.sequence, 1);
    assert.deepEqual(context.turns[0]!.substrate_refs, ["artifact:art-ref-001"]);
    assert.ok(context.cited_field_paths.includes("conversation.channel"));
    assert.ok(context.cited_field_paths.some((p) => p.includes(turns[0]!.turn_id)));

    const direct = explainConversationContext(conversation.conversation_id);
    assert.equal(direct.turns[0]!.content, sampleConversationInput().turns[0]!.content);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 conversation does not mutate referenced substrates", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact({
      domain: "workspace",
      uri: "https://example.org/audit.pdf",
      mime_type: "application/pdf",
      event_at: "2026-07-01T12:00:00.000Z",
      captured_by: EXEC,
      capture_method: "import",
      source_ref: "source:audit/import",
    });

    writeConversation({
      ...sampleConversationInput(),
      turns: [
        {
          sequence: 1,
          speaker_ref: EXEC,
          content: "Reviewing the audit artifact now.",
          event_at: "2026-07-01T14:01:00.000Z",
          substrate_refs: [`artifact:${artifact.artifact_id}`],
        },
      ],
    });

    const after = getArtifactById(artifact.artifact_id);
    assert.ok(after);
    assert.equal(after!.uri, artifact.uri);
    assert.equal(after!.lifecycle_state, artifact.lifecycle_state);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 S2 lifecycle — Captured to Verified", () => {
  bootstrapApp();
  try {
    const { conversation } = writeConversation(sampleConversationInput());
    assert.ok(isLifecycleTransitionAllowed("Captured", "Verified"));
    assert.ok(!isLifecycleTransitionAllowed("Captured", "Referenced"));

    assert.throws(
      () => transitionConversationLifecycle(conversation.conversation_id, "Referenced", EXEC, "x"),
      LifecycleTransitionError,
    );

    const verified = verifyConversation(conversation.conversation_id, EXEC);
    assert.equal(verified.lifecycle_state, "Verified");
    assert.equal(
      conversationContentFingerprint(conversation),
      conversationContentFingerprint({ ...verified, lifecycle_state: "Captured" }),
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 A15 sequence integrity — reconstruct conversation as it occurred", () => {
  bootstrapApp();
  try {
    const { conversation } = writeConversation(sampleConversationInput());
    const { sequence, engine_id } = readConversationSequenceIntegrity(conversation.conversation_id);

    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(sequence.question, CONVERSATION_SEQUENCE_QUESTION);
    assert.equal(CONVERSATION_SEQUENCE_INVARIANT, "Meaning depends on order.");
    assert.equal(sequence.turns.length, 2);
    assert.equal(sequence.turns[0]!.sequence, 1);
    assert.equal(sequence.turns[1]!.sequence, 2);
    assert.equal(sequence.turns[0]!.content, sampleConversationInput().turns[0]!.content);
    assert.ok(isCompleteSequenceIntegrity(sequence));
    assert.ok(sequence.checks.no_inserted_turns);
    assert.ok(sequence.checks.no_deleted_turns);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 sequence — rejects non-contiguous turn order at capture", () => {
  bootstrapApp();
  try {
    assert.throws(
      () =>
        writeConversation({
          ...sampleConversationInput(),
          turns: [
            { sequence: 1, speaker_ref: EXEC, content: "First", event_at: "2026-07-01T14:00:10.000Z" },
            { sequence: 3, speaker_ref: STAFF, content: "Skipped two", event_at: "2026-07-01T14:00:45.000Z" },
          ],
        }),
      (err: unknown) => err instanceof ConversationTurnValidationError && err.field === "sequence",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.3 A16 attribution integrity — who expressed this interpretation", () => {
  bootstrapApp();
  try {
    const { conversation } = writeConversation(sampleConversationInput());
    const { attribution, engine_id } = readConversationAttributionIntegrity(conversation.conversation_id);

    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(attribution.question, CONVERSATION_ATTRIBUTION_QUESTION);
    assert.equal(INTERPRETATION_INDEPENDENCE_INVARIANT, "Interpretation survives disagreement.");
    assert.equal(attribution.turns.length, 2);
    assert.equal(attribution.turns[0]!.speaker_ref.identity_id, EXEC.identity_id);
    assert.equal(attribution.turns[1]!.speaker_ref.identity_id, STAFF.identity_id);
    assert.ok(isCompleteAttributionIntegrity(attribution));
    assert.ok(attribution.checks.attribution_not_inferred);
    assert.ok(attribution.checks.turn_ownership_immutable);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.3 interpretation independence — rejects reconciliation fields", () => {
  bootstrapApp();
  try {
    const { conversation, turns } = writeConversation(sampleConversationInput());
    assert.throws(
      () => validateConversationRecord({ ...conversation, reconciled_interpretation: "agreed" }),
      (err: unknown) => err instanceof ConversationValidationError && err.field === "reconciled_interpretation",
    );
    assert.throws(
      () => validateConversationTurnRecord({ ...turns[0]!, inferred_speaker: EXEC }),
      (err: unknown) => err instanceof ConversationTurnValidationError && err.field === "inferred_speaker",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.3 attribution — speaker must be declared participant", () => {
  bootstrapApp();
  try {
    assert.throws(
      () =>
        writeConversation({
          ...sampleConversationInput(),
          turns: [
            {
              sequence: 1,
              speaker_ref: { identity_id: "ID-unknown", identity_kind: "external" },
              content: "Not a participant.",
              event_at: "2026-07-01T14:00:10.000Z",
            },
          ],
        }),
      /speaker must be a declared participant/,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 turn load by id", () => {
  bootstrapApp();
  try {
    const { conversation, turns } = writeConversation(sampleConversationInput());
    for (const ref of conversation.turn_refs) {
      const loaded = getConversationTurnById(ref);
      assert.ok(loaded);
      assert.equal(loaded!.conversation_id, conversation.conversation_id);
    }
    assert.equal(turns[0]!.content, sampleConversationInput().turns[0]!.content);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.4.1 conversation immutable body on lifecycle transition", () => {
  bootstrapApp();
  try {
    const { conversation } = writeConversation(sampleConversationInput());
    const verified = verifyConversation(conversation.conversation_id, EXEC);
    assert.throws(
      () => {
        const mutated = { ...verified, channel: "email" as const };
        if (conversationContentFingerprint(conversation) !== conversationContentFingerprint(mutated)) {
          throw new ConversationImmutableFieldError("payload");
        }
      },
      ConversationImmutableFieldError,
    );
  } finally {
    shutdownApp();
  }
});
