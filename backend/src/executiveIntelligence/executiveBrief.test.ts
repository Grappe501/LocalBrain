import test from "node:test";
import assert from "node:assert/strict";
import {
  EXECUTIVE_BRIEF_SECTION_ORDER,
  EXECUTIVE_BRIEF_VERSION,
} from "@localbrain/shared";
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

test("ENG-EI-002.2 decision citations carry multi-citation supporting refs", () => {
  bootstrapApp();
  try {
    const { episode, fact, citation } = seedBriefFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-brief-004",
      scope_label: "Brief fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
        decision_citation: [citation.citation_id],
      },
    });
    const brief = renderExecutiveBriefFromPackage(pkg);
    const decisionStatement = brief.sections
      .find((s) => s.section_id === "sec-decisions")
      ?.statements.find((s) =>
        s.citation_refs.includes(`decision_citation:${citation.citation_id}`),
      );

    assert.ok(decisionStatement);
    assert.ok(decisionStatement!.citation_refs.length >= 3);
    assert.ok(decisionStatement!.citation_refs.includes(`episode:${episode.episode_id}`));
    assert.ok(decisionStatement!.citation_refs.includes(`fact:${fact.fact_id}`));
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-002.2 citation groups link sections to assertion and evidence refs", () => {
  bootstrapApp();
  try {
    const { episode, fact } = seedBriefFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-brief-005",
      scope_label: "Brief fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
      },
    });
    const brief = renderExecutiveBriefFromPackage(pkg);

    assert.ok(brief.citation_groups.length >= 2);
    const factsGroup = brief.citation_groups.find((g) => g.section_id === "sec-facts");
    assert.ok(factsGroup);
    assert.ok(factsGroup!.statement_ids.length > 0);
    assert.deepEqual(factsGroup!.citation_refs, [`fact:${fact.fact_id}`]);
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-002.2 evidence boundaries distinguish reported absent and excluded", () => {
  bootstrapApp();
  try {
    const { episode } = seedBriefFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-brief-006",
      scope_label: "Brief fixture",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: ["fact-missing"],
      },
    });
    const brief = renderExecutiveBriefFromPackage(pkg);

    assert.ok(brief.evidence_boundaries.some((b) => b.kind === "reported"));
    assert.ok(brief.evidence_boundaries.some((b) => b.kind === "absent"));
    assert.ok(brief.evidence_boundaries.some((b) => b.kind === "withheld"));
    assert.ok(brief.omission_notes.some((n) => n.kind === "substrate_gap"));
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-002.2 sections follow deterministic constitutional ordering", () => {
  bootstrapApp();
  try {
    const { episode, fact, conversation, citation } = seedBriefFixture();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-brief-007",
      scope_label: "Brief fixture",
      substrate_refs: {
        decision_citation: [citation.citation_id],
        conversation: [conversation.conversation_id],
        fact: [fact.fact_id],
        episode: [episode.episode_id],
      },
    });
    const brief = renderExecutiveBriefFromPackage(pkg);
    const sectionIds = brief.sections.map((s) => s.section_id);
    const expected = EXECUTIVE_BRIEF_SECTION_ORDER.filter((id) => sectionIds.includes(id));
    assert.deepEqual(sectionIds, expected);
  } finally {
    shutdownApp();
  }
});
