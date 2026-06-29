import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { duplicateEvidenceProvider } from "./providers/duplicateEvidenceProvider.js";
import { versionEvidenceProvider } from "./providers/versionEvidenceProvider.js";
import { getConsolidationBriefing, getConsolidationCategory } from "./consolidationService.js";
import { runConsolidationSimulation } from "../simulation/simulationEngine.js";
import { findingToCard } from "../intelligence/cardComposer.js";
import type { ConsolidationContext, ConsolidationFinding } from "./types.js";

function mockCtx(assets: ConsolidationContext["assets"]): ConsolidationContext {
  return {
    assets,
    audit: null,
    dismissed_ids: new Set(),
    observed_at: new Date().toISOString(),
  };
}

test("duplicateEvidenceProvider groups identical name and size", () => {
  const findings = duplicateEvidenceProvider.collect(
    mockCtx([
      {
        asset_id: "a1",
        path: "H:\\proj\\a\\file.txt",
        name: "file.txt",
        kind: "document",
        is_directory: 0,
        hash: "abc123",
        size_bytes: 100,
        created_at: null,
        modified_at: "2026-01-01",
        last_referenced_at: null,
        workspace_id: "ws1",
        knowledge_source_id: "filesystem",
        owner: "steve",
        health_score: 80,
        lifecycle_stage: "active",
        duplicate_group_id: null,
        version_cluster_id: null,
        summary: "",
        tags_json: "[]",
        synced_at: "2026-01-01",
      },
      {
        asset_id: "a2",
        path: "H:\\proj\\b\\file.txt",
        name: "file.txt",
        kind: "document",
        is_directory: 0,
        hash: "abc123",
        size_bytes: 100,
        created_at: null,
        modified_at: "2026-01-02",
        last_referenced_at: null,
        workspace_id: "ws1",
        knowledge_source_id: "filesystem",
        owner: "steve",
        health_score: 80,
        lifecycle_stage: "active",
        duplicate_group_id: null,
        version_cluster_id: null,
        summary: "",
        tags_json: "[]",
        synced_at: "2026-01-01",
      },
    ] as ConsolidationContext["assets"]),
  );
  assert.ok(findings.length >= 1);
  assert.ok(findings[0].evidence_percent >= 85);
  assert.match(findings[0].decision_friction, /identical copies/i);
});

test("versionEvidenceProvider detects version chain", () => {
  const findings = versionEvidenceProvider.collect(
    mockCtx([
      {
        asset_id: "v1",
        path: "H:\\ContactListSOS\\Report.docx",
        name: "Report.docx",
        kind: "document",
        is_directory: 0,
        hash: null,
        size_bytes: 500,
        created_at: null,
        modified_at: "2026-06-01",
        last_referenced_at: null,
        workspace_id: null,
        knowledge_source_id: "filesystem",
        owner: "steve",
        health_score: 70,
        lifecycle_stage: "active",
        duplicate_group_id: null,
        version_cluster_id: null,
        summary: "",
        tags_json: "[]",
        synced_at: "2026-01-01",
      },
      {
        asset_id: "v2",
        path: "H:\\ContactListSOS\\Report_v2.docx",
        name: "Report_v2.docx",
        kind: "document",
        is_directory: 0,
        hash: null,
        size_bytes: 520,
        created_at: null,
        modified_at: "2026-06-02",
        last_referenced_at: null,
        workspace_id: null,
        knowledge_source_id: "filesystem",
        owner: "steve",
        health_score: 70,
        lifecycle_stage: "active",
        duplicate_group_id: null,
        version_cluster_id: null,
        summary: "",
        tags_json: "[]",
        synced_at: "2026-01-01",
      },
    ] as ConsolidationContext["assets"]),
  );
  assert.ok(findings.some((f) => f.category === "version_chain"));
});

test("ExecutiveIntelligenceCard includes universal scores and pipeline", () => {
  const finding: ConsolidationFinding = {
    finding_id: "test-1",
    category: "version_chain",
    title: "Test chain",
    priority: "high",
    evidence_percent: 98,
    evidence_signals: [{ signal: "hash", weight: "high" }],
    executive_impact: "Reduces friction",
    decision_friction: "Which file is current?",
    estimated_review_minutes: 3,
    estimated_benefit: "7 points",
    reclaimable_bytes: 0,
    decision_points_eliminated: 7,
    risk: "low",
    related_paths: ["H:\\a"],
    source: "test",
  };
  const card = findingToCard(finding, false);
  assert.equal(card.pipeline.recommendation, "complete");
  assert.equal(card.pipeline.simulation, "available");
  assert.equal(card.pipeline.proposal, "not_generated");
  assert.equal(card.read_only, true);
  assert.ok(card.scores.confidence === 98);
  assert.ok(typeof card.scores.importance === "number");
});

test("simulation is preview-only with zero deletes", () => {
  const result = runConsolidationSimulation({
    findings: [
      {
        finding_id: "s1",
        category: "duplicate_file",
        title: "dup",
        priority: "low",
        evidence_percent: 90,
        evidence_signals: [],
        executive_impact: "",
        decision_friction: "",
        estimated_review_minutes: 1,
        estimated_benefit: "",
        reclaimable_bytes: 1024,
        decision_points_eliminated: 2,
        risk: "low",
        related_paths: [],
        source: "",
      },
    ],
  });
  assert.equal(result.preview_only, true);
  assert.equal(result.nothing_changed, true);
  assert.equal(result.files_deleted, 0);
});

test("consolidation briefing API is read-only", () => {
  bootstrapApp();
  try {
    const briefing = getConsolidationBriefing();
    assert.equal(briefing.slice_id, "LB-OS-020");
    assert.equal(briefing.read_only, true);
    assert.equal(briefing.nothing_changed, true);
    assert.equal(briefing.safety_footer, "Nothing has been changed.");
    assert.ok(briefing.consolidation_score.score >= 0);
    assert.ok(briefing.consolidation_opportunity.executive_summary.includes("Nothing"));
    const programs = getConsolidationCategory("programs");
    assert.equal(programs.stub, true);
  } finally {
    shutdownApp();
  }
});
