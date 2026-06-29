import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { getPlatformReadinessReport } from "./platformReadinessService.js";
import { computePlatformStability } from "./platformStabilityEngine.js";

test("platform readiness report is LB-OS-026.5", () => {
  bootstrapApp();
  try {
    const report = getPlatformReadinessReport();
    assert.equal(report.slice_id, "LB-OS-026.5");
    assert.equal(report.engine_id, "ENG-PRS-001");
    assert.ok(report.readiness_dashboard.length >= 10);
    assert.ok(report.platform_readiness_score.percent >= 0);
    assert.ok(report.platform_readiness_score.components.architecture_stability > 0);
    assert.ok(report.executive_questions_authoritative > 0);
    assert.ok(
      report.executive_questions_authoritative === report.executive_questions_total,
      `EQ authoritative ${report.executive_questions_authoritative} vs total ${report.executive_questions_total}`,
    );
    assert.ok(report.migration_pipeline_stages.length === 7);
    assert.ok(report.recommended_phase_2_sequence.some((s) => s.includes("LB-OS-027")));
    assert.ok(report.freeze_policy.includes("Architecture Frozen"));
  } finally {
    shutdownApp();
  }
});

test("route smoke includes migration lifecycle routes", () => {
  bootstrapApp();
  try {
    const report = getPlatformReadinessReport();
    const routes = report.route_smoke.results.map((r) => r.route);
    assert.ok(routes.includes("/migration/cutover"));
    assert.ok(routes.includes("/migration/proof"));
    assert.equal(report.route_smoke.failed, 0);
  } finally {
    shutdownApp();
  }
});

test("platform stability reflects migration arc completion", () => {
  bootstrapApp();
  try {
    const stability = computePlatformStability();
    assert.equal(stability.foundational_objects_locked, true);
    assert.ok(stability.certification_pipeline_complete);
    assert.ok(stability.stability_percent >= 80);
  } finally {
    shutdownApp();
  }
});
