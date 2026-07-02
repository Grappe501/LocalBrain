import test from "node:test";
import assert from "node:assert/strict";
import { CONSTITUTIONAL_RETRIEVAL_ORDERING_SPEC, CONSTITUTIONAL_RETRIEVAL_VERSION, RETRIEVAL_RULE_IDS } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import {
  writeArtifact,
  writeConversation,
  writeDecisionCitation,
  writeEpisode,
  writeFact,
} from "../memory/writePipeline.js";
import {
  assembleConstitutionalEvidencePackage,
  CONSTITUTIONAL_RETRIEVAL_ENGINE_ID,
} from "./constitutionalRetrievalService.js";
import { buildRequestFingerprint } from "./retrievalAudit.js";
import { substrateOrdinal } from "./retrievalOrdering.js";

const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" };

const SAMPLE_HASH =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

function seedInitiativeXRecords() {
  const { episode } = writeEpisode({
    domain: "executive",
    started_at: "2026-07-01T09:00:00.000Z",
    source_ref: "source:initiative-x/kickoff",
    event_at: "2026-07-01T09:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    title: "Initiative X kickoff",
  });
  const { fact } = writeFact({
    domain: "executive",
    statement: "Initiative X is authorized.",
    subject_ref: { identity_id: "ID-initiative-x", identity_kind: "organization" },
    predicate: "authorization_status",
    object_ref: "status:authorized",
    event_at: "2026-07-01T10:00:00.000Z",
    valid_from: "2026-07-01T10:00:00.000Z",
    source_ref: "source:initiative-x/charter",
    captured_by: EXEC,
    capture_method: "direct",
    confidence_level: "user_confirmed",
  });
  const { artifact } = writeArtifact({
    domain: "executive",
    content_ref: "content://initiative-x/brief",
    content_hash: SAMPLE_HASH,
    mime_type: "application/pdf",
    event_at: "2026-07-01T11:00:00.000Z",
    captured_by: EXEC,
    capture_method: "import",
    source_ref: "source:initiative-x/brief",
  });
  const { conversation } = writeConversation({
    domain: "executive",
    channel: "meeting",
    participants: [EXEC],
    started_at: "2026-07-01T12:00:00.000Z",
    event_at: "2026-07-01T12:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
    source_ref: "source:initiative-x/planning",
    turns: [
      {
        sequence: 1,
        speaker_ref: EXEC,
        content: "Prepare the constitutional record for Initiative X.",
        event_at: "2026-07-01T12:00:00.000Z",
      },
    ],
  });
  const { citation } = writeDecisionCitation({
    decision_id: "decision:initiative-x-001",
    question: "Authorize Initiative X?",
    outcome_summary: "Authorized.",
    decided_at: "2026-07-01T13:00:00.000Z",
    decider_ref: EXEC,
    supporting_memory_refs: [
      `episode:${episode.episode_id}`,
      `fact:${fact.fact_id}`,
    ],
    ledger_ref: "ledger:initiative-x-001",
    event_at: "2026-07-01T13:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct",
  });
  return { episode, fact, artifact, conversation, citation };
}

test("ENG-EI-001.1 domain scan assembles complete evidence package with coverage report", () => {
  bootstrapApp();
  try {
    seedInitiativeXRecords();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-initiative-x-001",
      scope_label: "Initiative X",
      domain: "executive",
    });
    assert.equal(pkg.status, "complete");
    assert.equal(pkg.retrieval_version, CONSTITUTIONAL_RETRIEVAL_VERSION);
    assert.ok(pkg.episodes.length >= 1);
    assert.ok(pkg.facts.length >= 1);
    assert.ok(pkg.artifacts.length >= 1);
    assert.ok(pkg.conversations.length >= 1);
    assert.equal(pkg.decision_citations.length, 0);
    assert.equal(pkg.coverage_report.substrates_searched.length, 4);
    assert.equal(pkg.citations.length, pkg.coverage_report.citation_count);
    assert.ok(pkg.coverage_report.retrieval_timestamp);
    assert.equal(pkg.coverage_report.retrieval_version, CONSTITUTIONAL_RETRIEVAL_VERSION);
    assert.equal(CONSTITUTIONAL_RETRIEVAL_ENGINE_ID, "ENG-EI-001");
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.1 explicit refs assemble cited package — no reasoning fields", () => {
  bootstrapApp();
  try {
    const { episode, fact, artifact, conversation, citation } = seedInitiativeXRecords();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-initiative-x-002",
      scope_label: "Initiative X",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
        artifact: [artifact.artifact_id],
        conversation: [conversation.conversation_id],
        decision_citation: [citation.citation_id],
      },
    });
    assert.equal(pkg.status, "complete");
    assert.equal(pkg.episodes.length, 1);
    assert.equal(pkg.facts.length, 1);
    assert.equal(pkg.artifacts.length, 1);
    assert.equal(pkg.conversations.length, 1);
    assert.equal(pkg.conversations[0]!.turns.length, 1);
    assert.equal(pkg.decision_citations.length, 1);
    assert.equal(pkg.citations.length, 5);
    assert.ok(pkg.citations.every((c) => c.citation_ref.includes(":")));
    assert.ok(!("recommendation" in (pkg as object)));
    assert.ok(!("summary" in (pkg as object)));
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.1 missing ref withholds package and records exclusion in coverage", () => {
  bootstrapApp();
  try {
    const { episode } = seedInitiativeXRecords();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-initiative-x-003",
      scope_label: "Initiative X",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: ["fact-does-not-exist"],
      },
    });
    assert.equal(pkg.status, "withheld");
    assert.ok(pkg.status_reason?.includes("withheld"));
    assert.equal(pkg.coverage_report.records_excluded.length, 1);
    assert.equal(pkg.coverage_report.records_excluded[0]?.reason, "not_found");
    assert.equal(pkg.coverage_report.records_excluded[0]?.rule_id, RETRIEVAL_RULE_IDS.REF_NOT_FOUND);
    assert.ok(pkg.coverage_report.records_excluded[0]?.rule_description);
    assert.equal(pkg.episodes.length, 1);
    assert.equal(pkg.facts.length, 0);
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.1 empty domain scan reports insufficient evidence without fabrication", () => {
  bootstrapApp();
  try {
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-empty-001",
      scope_label: "Empty scope",
      domain: "learning",
    });
    assert.equal(pkg.status, "insufficient_evidence");
    assert.equal(pkg.citations.length, 0);
    assert.ok(pkg.status_reason?.includes("insufficient evidence"));
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.2 domain scan documents inclusion rules and completeness", () => {
  bootstrapApp();
  try {
    seedInitiativeXRecords();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-initiative-x-004",
      scope_label: "Initiative X",
      domain: "executive",
    });
    assert.equal(pkg.retrieval_version, CONSTITUTIONAL_RETRIEVAL_VERSION);
    assert.ok(pkg.coverage_report.inclusion_rules_applied.length >= 2);
    assert.ok(
      pkg.coverage_report.inclusion_rules_applied.some(
        (r) => r.rule_id === RETRIEVAL_RULE_IDS.DOMAIN_SCAN,
      ),
    );
    assert.ok(
      pkg.coverage_report.inclusion_rules_applied.some(
        (r) => r.rule_id === RETRIEVAL_RULE_IDS.DOMAIN_SKIP_DECISION_CITATION,
      ),
    );
    assert.equal(pkg.coverage_report.completeness.mode, "domain_scan");
    assert.ok(pkg.coverage_report.completeness.all_required_resolved);
    assert.ok(pkg.coverage_report.completeness.substrates_with_results.length >= 4);
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.2 explicit refs record requested counts in completeness report", () => {
  bootstrapApp();
  try {
    const { episode, fact } = seedInitiativeXRecords();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-initiative-x-005",
      scope_label: "Initiative X",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
      },
    });
    assert.equal(pkg.coverage_report.completeness.mode, "explicit_refs");
    assert.equal(pkg.coverage_report.completeness.records_requested.episode, 1);
    assert.equal(pkg.coverage_report.completeness.records_requested.fact, 1);
    assert.equal(pkg.coverage_report.completeness.all_required_resolved, true);
    assert.ok(
      pkg.coverage_report.inclusion_rules_applied.some(
        (r) => r.rule_id === RETRIEVAL_RULE_IDS.EXPLICIT_REF,
      ),
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.2 domain mismatch exclusion cites RULE-DOMAIN-FILTER", () => {
  bootstrapApp();
  try {
    const { episode } = seedInitiativeXRecords();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-domain-mismatch",
      scope_label: "Initiative X",
      domain: "learning",
      substrate_refs: { episode: [episode.episode_id] },
    });
    assert.equal(pkg.status, "withheld");
    assert.equal(pkg.coverage_report.records_excluded[0]?.reason, "domain_mismatch");
    assert.equal(pkg.coverage_report.records_excluded[0]?.rule_id, RETRIEVAL_RULE_IDS.DOMAIN_FILTER);
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.1 assembly is deterministic for identical requests", () => {
  bootstrapApp();
  try {
    const { episode, fact } = seedInitiativeXRecords();
    const request = {
      request_id: "req-deterministic-001",
      scope_label: "Initiative X",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
      },
    } as const;
    const a = assembleConstitutionalEvidencePackage(request);
    const b = assembleConstitutionalEvidencePackage(request);
    assert.deepEqual(
      a.citations.map((c) => c.citation_ref),
      b.citations.map((c) => c.citation_ref),
    );
    assert.equal(a.coverage_report.citation_count, b.coverage_report.citation_count);
    assert.equal(a.retrieval_audit.package_fingerprint, b.retrieval_audit.package_fingerprint);
    assert.equal(a.package_id, b.package_id);
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.3 package carries retrieval audit with version and ordering spec", () => {
  bootstrapApp();
  try {
    const { episode, fact } = seedInitiativeXRecords();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-audit-001",
      scope_label: "Initiative X",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
      },
    });
    assert.equal(pkg.retrieval_version, CONSTITUTIONAL_RETRIEVAL_VERSION);
    assert.equal(pkg.retrieval_audit.retrieval_version, CONSTITUTIONAL_RETRIEVAL_VERSION);
    assert.equal(pkg.retrieval_audit.ordering_spec, CONSTITUTIONAL_RETRIEVAL_ORDERING_SPEC);
    assert.ok(pkg.retrieval_audit.request_fingerprint.length === 64);
    assert.ok(pkg.retrieval_audit.package_fingerprint.length === 64);
    assert.equal(pkg.package_id, `pkg-${pkg.retrieval_audit.package_fingerprint.slice(0, 32)}`);
    assert.deepEqual(
      pkg.retrieval_audit.citation_order,
      pkg.citations.map((c) => c.citation_ref),
    );
    assert.deepEqual(
      pkg.retrieval_audit.substrates_searched,
      pkg.coverage_report.substrates_searched,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.3 request fingerprint is stable regardless of substrate_refs list order", () => {
  bootstrapApp();
  try {
    const { episode, fact, artifact } = seedInitiativeXRecords();
    const forward = {
      request_id: "req-fingerprint-001",
      scope_label: "Initiative X",
      substrate_refs: {
        episode: [episode.episode_id],
        fact: [fact.fact_id],
        artifact: [artifact.artifact_id],
      },
    };
    const reversed = {
      ...forward,
      substrate_refs: {
        episode: [...forward.substrate_refs.episode!].reverse(),
        fact: [...forward.substrate_refs.fact!].reverse(),
        artifact: [...forward.substrate_refs.artifact!].reverse(),
      },
    };
    assert.equal(buildRequestFingerprint(forward), buildRequestFingerprint(reversed));
    const a = assembleConstitutionalEvidencePackage(forward);
    const b = assembleConstitutionalEvidencePackage(reversed);
    assert.equal(a.retrieval_audit.request_fingerprint, b.retrieval_audit.request_fingerprint);
    assert.equal(a.retrieval_audit.package_fingerprint, b.retrieval_audit.package_fingerprint);
    assert.deepEqual(a.citations.map((c) => c.citation_ref), b.citations.map((c) => c.citation_ref));
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.3 citations and substrate records use stable constitutional ordering", () => {
  bootstrapApp();
  try {
    const { episode, fact, artifact, conversation, citation } = seedInitiativeXRecords();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-order-001",
      scope_label: "Initiative X",
      substrate_refs: {
        decision_citation: [citation.citation_id],
        conversation: [conversation.conversation_id],
        artifact: [artifact.artifact_id],
        fact: [fact.fact_id],
        episode: [episode.episode_id],
      },
    });
    const citationRefs = pkg.citations.map((c) => c.citation_ref);
    const sortedRefs = [...pkg.citations]
      .sort(
        (a, b) =>
          a.ordering_key.localeCompare(b.ordering_key) ||
          substrateOrdinal(a.substrate) - substrateOrdinal(b.substrate) ||
          a.record_id.localeCompare(b.record_id),
      )
      .map((c) => c.citation_ref);
    assert.deepEqual(citationRefs, sortedRefs);
    for (let i = 1; i < pkg.citations.length; i++) {
      assert.ok(pkg.citations[i - 1]!.ordering_key <= pkg.citations[i]!.ordering_key);
    }
    assert.deepEqual(pkg.coverage_report.substrates_searched, [
      "episode",
      "fact",
      "artifact",
      "conversation",
      "decision_citation",
    ]);
    const episodeTimes = pkg.episodes.map((e) => e.event_at);
    assert.deepEqual(episodeTimes, [...episodeTimes].sort());
    const factTimes = pkg.facts.map((f) => f.event_at);
    assert.deepEqual(factTimes, [...factTimes].sort());
  } finally {
    shutdownApp();
  }
});

test("ENG-EI-001.3 repeat assembly produces identical audit trail fingerprints", () => {
  bootstrapApp();
  try {
    seedInitiativeXRecords();
    const request = {
      request_id: "req-repeat-001",
      scope_label: "Initiative X",
      domain: "executive" as const,
    };
    const first = assembleConstitutionalEvidencePackage(request);
    const second = assembleConstitutionalEvidencePackage(request);
    assert.equal(first.retrieval_audit.package_fingerprint, second.retrieval_audit.package_fingerprint);
    assert.equal(first.retrieval_audit.request_fingerprint, second.retrieval_audit.request_fingerprint);
    assert.deepEqual(first.retrieval_audit.citation_order, second.retrieval_audit.citation_order);
    assert.equal(first.package_id, second.package_id);
    assert.notEqual(first.assembled_at, second.assembled_at);
    assert.notEqual(
      first.coverage_report.retrieval_timestamp,
      second.coverage_report.retrieval_timestamp,
    );
  } finally {
    shutdownApp();
  }
});
