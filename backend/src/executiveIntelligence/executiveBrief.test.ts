import test from "node:test";
import assert from "node:assert/strict";
import { EXECUTIVE_BRIEF_VERSION } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import {
  writeConversation,
  writeDecisionCitation,
  writeEpisode,
  writeFact,
} from "../memory/writePipeline.js";
import { assembleConstitutionalEvidencePackage } from "./constitutionalRetrievalService.js";
import { renderExecutiveBriefFromPackage } from "./executiveBriefRenderer.js";

const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" };

function seedBriefFixture() {
  const { episode } = writeEpisode({
    domain: "executive",
    started_at: "2026-07-01T09:00:00.000Z",
    source_ref: "source:brief-fixture/kickoff",
    event_at: "2026-07-01T09:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    title: "Initiative briefing kickoff",
  });
  const { fact } = writeFact({
    domain: "executive",
    statement: "Initiative briefing is authorized.",
    subject_ref: { identity_id: "ID-initiative-brief", identity_kind: "organization" },
    predicate: "authorization_status",
    object_ref: "status:authorized",
    event_at: "2026-07-01T10:00:00.000Z",
    valid_from: "2026-07-01T10:00:00.000Z",
    source_ref: "source:brief-fixture/charter",
    captured_by: EXEC,
    capture_method: "direct",
    confidence_level: "observed",
  });
  const { conversation } = writeConversation({
    domain: "executive",
    channel: "meeting",
    participants: [EXEC],
    started_at: "2026-07-01T12:00:00.000Z",
    event_at: "2026-07-01T12:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    source_ref: "source:brief-fixture/planning",
    turns: [
      {
        sequence: 1,
        speaker_ref: EXEC,
        content: "Prepare the constitutional brief record.",
        event_at: "2026-07-01T12:00:00.000Z",
      },
    ],
  });
  const { citation } = writeDecisionCitation({
    decision_id: "decision:brief-fixture-001",
    question: "Authorize briefing?",
    outcome_summary: "Authorized.",
    decided_at: "2026-07-01T13:00:00.000Z",
    decider_ref: EXEC,
    supporting_memory_refs: [`episode:${episode.episode_id}`, `fact:${fact.fact_id}`],
    ledger_ref: "ledger:brief-fixture-001",
    event_at: "2026-07-01T13:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
  });
  return { episode, fact, conversation, citation };
}

test("ENG-EI-002.1 renders traceable brief from complete evidence package", () => {
  bootstrapApp();
  try {
    const { episode, fact, conversation, citation } = seedBriefFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-brief-001",
      scope_label: "Brief fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
        conversation: [conversation.conversation_id],
        decision_citation: [citation.citation_id],
      },
    });
    const brief = renderExecutiveBriefFromPackage(pkg);

    assert.equal(brief.brief_version, EXECUTIVE_BRIEF_VERSION);
    assert.equal(brief.package_id, pkg.package_id);
    assert.equal(brief.source_package_fingerprint, pkg.retrieval_audit.package_fingerprint);
    assert.ok(brief.sections.length >= 3);
    assert.equal(brief.source_mapping.length, 4);

    const allStatements = brief.sections.flatMap((s) => s.statements);
    assert.ok(allStatements.every((s) => s.citation_refs.length > 0));
    for (const statement of allStatements) {
      for (const ref of statement.citation_refs) {
        assert.ok(brief.source_mapping.some((m) => m.citation_ref === ref));
      }
    }

    const factStatement = brief.sections
      .find((s) => s.section_id === "sec-facts")
      ?.statements.find((s) => s.citation_refs.includes(`fact:${fact.fact_id}`));
    assert.ok(factStatement?.uncertainty_note?.includes("observed"));
    assert.ok(!("recommendation" in (brief as object)));
    assert.ok(!("options" in (brief as object)));
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-002.1 withheld package surfaces omission notes without fabricated assertions", () => {
  bootstrapApp();
  try {
    const { episode } = seedBriefFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-brief-002",
      scope_label: "Brief fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: ["fact-missing"],
      },
    });
    const brief = renderExecutiveBriefFromPackage(pkg);

    assert.equal(brief.source_package_status, "withheld");
    assert.ok(brief.omission_notes.some((n) => n.kind === "package_withheld"));
    assert.ok(brief.omission_notes.some((n) => n.kind === "excluded_record"));
    const statusSection = brief.sections.find((s) => s.section_id === "sec-status");
    assert.ok(statusSection);
    assert.equal(statusSection!.statements[0]!.citation_refs.length, 0);
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-002.1 render is deterministic for identical package input", () => {
  bootstrapApp();
  try {
    const { episode, fact } = seedBriefFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-brief-003",
      scope_label: "Brief fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
      },
    });
    const a = renderExecutiveBriefFromPackage(pkg);
    const b = renderExecutiveBriefFromPackage(pkg);
    assert.equal(a.brief_id, b.brief_id);
    assert.deepEqual(
      a.sections.map((s) => s.statements.map((st) => st.citation_refs)),
      b.sections.map((s) => s.statements.map((st) => st.citation_refs)),
    );
  } finally {
    shutdownApp();
  }
});
