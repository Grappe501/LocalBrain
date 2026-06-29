import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../../bootstrap.js";
import { PROOF_PROVIDERS, aggregateProofScore } from "./proofEngine.js";
import {
  getMigrationProofOverview,
  runMigrationProofSimulation,
} from "./migrationProofService.js";

test("proof providers are deterministic LB-OS-023", () => {
  assert.equal(PROOF_PROVIDERS.length, 6);
  const ids = PROOF_PROVIDERS.map((p) => p.id);
  assert.ok(ids.includes("policy"));
  assert.ok(ids.includes("structural"));
});

test("migration proof overview is read-only", () => {
  bootstrapApp();
  try {
    const overview = getMigrationProofOverview();
    assert.equal(overview.slice_id, "LB-OS-023");
    assert.equal(overview.engine_id, "ENG-PRF-001");
    assert.equal(overview.read_only, true);
    assert.ok(overview.proof_dimensions.length === 6);
    assert.ok(overview.guardrails.some((g) => g.includes("LLM")));
  } finally {
    shutdownApp();
  }
});

test("simulate produces SIM and CERT ids with proof score", () => {
  bootstrapApp();
  try {
    const { simulation, certificate } = runMigrationProofSimulation();
    assert.match(simulation.simulation_id, /^SIM-\d{6}$/);
    assert.match(certificate.certificate_id, /^CERT-\d{6}$/);
    assert.equal(simulation.read_only, true);
    assert.equal(simulation.nothing_changed, true);
    assert.equal(certificate.read_only, true);
    assert.ok(certificate.proof_score.percent >= 0);
    assert.ok(certificate.proof_score.dimension_results.length === 6);
    assert.equal(certificate.proposal_eligible, certificate.result === "certified");
    assert.equal(certificate.plan_eligible, certificate.result === "certified");
    assert.ok(certificate.evidence.survey_observed_at);
  } finally {
    shutdownApp();
  }
});

test("aggregateProofScore is deterministic for same context", () => {
  const ctx = {
    workspace_ids: ["localbrain"],
    simulation_batches: [
      {
        batch_id: "b1",
        workspace_id: "localbrain",
        title: "LocalBrain",
        current_projection: "H:\\localAgent",
        recommended_projection: "H:\\Projects\\Business\\LocalBrain",
        location_label: "Primary Development",
        action_type: "projection_translation" as const,
        folder_count: 1,
        file_count: 10,
      },
    ],
    audit_run_id: "audit-1",
    mapping_confidence_percent: 80,
    survey_observed_at: new Date().toISOString(),
    architecture_observed_at: new Date().toISOString(),
    evidence_confidence_percent: 75,
    migration_complexity_overall: 40,
    duplicate_region_count: 0,
    orphan_workspace_count: 0,
    drive_headroom_label: "comfortable",
  };

  const a = aggregateProofScore(ctx);
  const b = aggregateProofScore(ctx);
  assert.equal(a.percent, b.percent);
  assert.equal(a.total_points, b.total_points);
});
