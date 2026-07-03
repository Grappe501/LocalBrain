import test from "node:test";
import assert from "node:assert/strict";
import {
  COMMUNICATIONS_DRAFT_ADVISORY_NOTICE,
  COMMUNICATIONS_DRAFT_VERSION,
} from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import {
  writeConversation,
  writeDecisionCitation,
  writeEpisode,
  writeFact,
} from "../memory/writePipeline.js";
import { assembleConstitutionalEvidencePackage } from "../executiveIntelligence/constitutionalRetrievalService.js";
import { assembleTraceableCommunicationsDraft } from "./communicationsDraftAssembler.js";
import { CommunicationsDraftTraceabilityError } from "./communicationsDraftValidator.js";
import { proposeFixtureTraceableDraft } from "./fixtureTraceableDraftAdapter.js";
import { generateTraceableCommunicationsDraft } from "./traceableDraftGenerator.js";

const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" };

function seedDraftFixture() {
  const { episode } = writeEpisode({
    domain: "executive",
    started_at: "2026-07-01T09:00:00.000Z",
    source_ref: "source:com-fixture/kickoff",
    event_at: "2026-07-01T09:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    title: "Stakeholder update kickoff",
  });
  const { fact } = writeFact({
    domain: "executive",
    statement: "Q3 initiative remains on track.",
    subject_ref: { identity_id: "ID-initiative-com", identity_kind: "organization" },
    predicate: "status",
    object_ref: "status:on_track",
    event_at: "2026-07-01T10:00:00.000Z",
    valid_from: "2026-07-01T10:00:00.000Z",
    source_ref: "source:com-fixture/status",
    captured_by: EXEC,
    capture_method: "direct",
    confidence_level: "observed",
  });
  const { conversation } = writeConversation({
    domain: "executive",
    channel: "email",
    participants: [EXEC],
    started_at: "2026-07-01T12:00:00.000Z",
    event_at: "2026-07-01T12:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    source_ref: "source:com-fixture/thread",
    turns: [
      {
        sequence: 1,
        speaker_ref: EXEC,
        content: "Please prepare a factual stakeholder update.",
        event_at: "2026-07-01T12:00:00.000Z",
      },
    ],
  });
  const { citation } = writeDecisionCitation({
    decision_id: "decision:com-fixture-001",
    question: "Proceed with stakeholder update?",
    outcome_summary: "Approved for draft preparation.",
    decided_at: "2026-07-01T13:00:00.000Z",
    decider_ref: EXEC,
    supporting_memory_refs: [`episode:${episode.episode_id}`, `fact:${fact.fact_id}`],
    ledger_ref: "ledger:com-fixture-001",
    event_at: "2026-07-01T13:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
  });
  return { episode, fact, conversation, citation };
}

const COM_REQUEST = {
  request_id: "com-req-001",
  intent_label: "Stakeholder status update",
  audience_label: "Board observers",
};

test("ENG-COM-001.1 generates traceable draft with independent citation mapping", async () => {
  bootstrapApp();
  try {
    const { episode, fact, conversation, citation } = seedDraftFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-001",
      scope_label: "COM fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
        conversation: [conversation.conversation_id],
        decision_citation: [citation.citation_id],
      },
    });

    const result = await generateTraceableCommunicationsDraft(pkg, COM_REQUEST, {
      adapter: proposeFixtureTraceableDraft,
    });

    assert.equal(result.draft.draft_version, COMMUNICATIONS_DRAFT_VERSION);
    assert.equal(result.draft.package_id, pkg.package_id);
    assert.equal(result.draft.advisory_notice, COMMUNICATIONS_DRAFT_ADVISORY_NOTICE);
    assert.ok(result.draft.statements.length >= 4);
    assert.ok(result.draft.body_text.length > 0);

    for (const statement of result.draft.statements) {
      assert.ok(statement.citation_refs.length > 0, statement.statement_id);
      for (const ref of statement.citation_refs) {
        assert.ok(pkg.citations.some((c) => c.citation_ref === ref));
      }
    }

    assert.equal(result.citation_mapping.draft_id, result.draft.draft_id);
    assert.equal(result.citation_mapping.package_id, pkg.package_id);
    assert.equal(result.citation_mapping.unmapped_statement_ids.length, 0);
    assert.ok(result.citation_mapping.entries.length >= 4);

    for (const entry of result.citation_mapping.entries) {
      assert.ok(entry.statement_ids.length > 0);
      assert.ok(entry.summary.length > 0);
      assert.ok(
        result.draft.statements.some((s) => entry.statement_ids.includes(s.statement_id)),
      );
    }

    assert.notEqual(result.citation_mapping, result.draft);
    assert.ok(!("entries" in (result.draft as object)));
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.1 withheld package surfaces withheld items without fabricated statements", async () => {
  bootstrapApp();
  try {
    const { episode } = seedDraftFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-002",
      scope_label: "COM fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: ["fact-missing"],
      },
    });

    const result = await generateTraceableCommunicationsDraft(pkg, COM_REQUEST, {
      adapter: proposeFixtureTraceableDraft,
    });

    assert.equal(result.draft.source_package_status, "withheld");
    assert.equal(result.draft.statements.length, 0);
    assert.ok(result.draft.withheld.some((w) => w.kind === "insufficient_evidence"));
    assert.equal(result.citation_mapping.entries.length, 0);
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.1 rejects a single unsupported substantive statement", () => {
  bootstrapApp();
  try {
    const { episode, fact } = seedDraftFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-003",
      scope_label: "COM fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
      },
    });

    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(pkg, COM_REQUEST, {
          statements: [
            {
              text: "Unsupported claim with no evidence.",
              citation_refs: [],
              epistemic_level: "established",
            },
          ],
          withheld: [],
        }),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftTraceabilityError);
        assert.equal(err.code, "C2_UNSUPPORTED_STATEMENT");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.1 rejects citation refs outside the Evidence Package", () => {
  bootstrapApp();
  try {
    const { fact } = seedDraftFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-004",
      scope_label: "COM fixture",
      substrate_refs: {
        fact: [fact.fact_id],
      },
    });

    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(pkg, COM_REQUEST, {
          statements: [
            {
              text: "Claim citing invented evidence.",
              citation_refs: ["fact:invented"],
              epistemic_level: "established",
            },
          ],
          withheld: [],
        }),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftTraceabilityError);
        assert.equal(err.code, "C4_NON_PACKAGE_CITATION");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.1 citation mapping accounts for every substantive statement", async () => {
  bootstrapApp();
  try {
    const { episode, fact } = seedDraftFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-005",
      scope_label: "COM fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
      },
    });

    const result = await generateTraceableCommunicationsDraft(pkg, COM_REQUEST, {
      adapter: proposeFixtureTraceableDraft,
    });

    const substantive = result.draft.statements.filter((s) => s.text.trim().length > 0);
    const mappedIds = new Set(result.citation_mapping.entries.flatMap((e) => e.statement_ids));
    for (const statement of substantive) {
      assert.ok(mappedIds.has(statement.statement_id), statement.statement_id);
    }
  } finally {
    shutdownApp();
  }
});
