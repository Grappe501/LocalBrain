import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { computeArchitectureVolatility } from "./architectureVolatilityEngine.js";
import { getPlatformReadinessReport } from "./platformReadinessService.js";
import { computePlatformStability } from "./platformStabilityEngine.js";
import { computeExecutiveMaturity } from "./executiveMaturityEngine.js";

test("platform readiness report is LB-OS-026.5 with four distinct metrics", () => {
  bootstrapApp();
  try {
    const report = getPlatformReadinessReport();
    assert.equal(report.slice_id, "LB-OS-026.5");
    assert.equal(report.engine_id, "ENG-PRS-001");
    assert.equal(report.maturity_engine_id, "ENG-EMT-001");
    assert.equal(report.volatility_engine_id, "ENG-AV-001");
    assert.equal(report.platform_metric_headlines.length, 4);
    assert.ok(report.readiness_dashboard.length >= 10);
    assert.ok(report.platform_readiness_score.percent >= 0);
    assert.ok(report.platform_readiness_score.components.live_surface_completion > 0);
    assert.ok(report.platform_stability.components.four_systems_compliance > 0);
    assert.equal(report.executive_maturity.overall_percent, 29);
    assert.ok(report.architecture_volatility.volatility_percent <= 10);
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
    assert.ok(stability.stability_percent >= 90);
    assert.ok(stability.stability_percent <= 97);
    assert.ok(stability.components.migration_lifecycle_complete === 100);
  } finally {
    shutdownApp();
  }
});

test("executive maturity and architecture volatility engines", () => {
  bootstrapApp();
  try {
    const maturity = computeExecutiveMaturity();
    assert.equal(maturity.engine_id, "ENG-EMT-001");
    assert.equal(maturity.domains.length, 4);
    assert.equal(maturity.domains[0].percent, 100);

    const volatility = computeArchitectureVolatility();
    assert.equal(volatility.engine_id, "ENG-AV-001");
    assert.ok(volatility.volatility_percent >= 0);
    assert.ok(volatility.volatility_percent <= 10);
  } finally {
    shutdownApp();
  }
});
