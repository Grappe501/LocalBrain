import assert from "node:assert/strict";
import test from "node:test";
import { runPlatformStateAudit } from "./platformStateAuditEngine.js";
import { isGovernedPlatformEraActive } from "../buildState/governedPlatformMetrics.js";
import {
  PSA_AUDIT_ID,
  PSA_ENGINE_ID,
  PSA_CERTIFIED_INVENTORY,
  formatPlatformStateReportMarkdown,
} from "@localbrain/shared";

test("PSA-001 platform state audit produces four-section report", () => {
  const report = runPlatformStateAudit();

  assert.equal(report.audit_id, PSA_AUDIT_ID);
  assert.equal(report.engine_id, PSA_ENGINE_ID);
  assert.ok(report.observed_at);
  assert.ok(report.canonical_state.current_phase.length > 0);
  assert.ok(report.capability_progress.length >= 5);
  assert.ok(report.next_horizon.length >= 5);
  assert.equal(report.layers.length, 7);
  assert.equal(report.capability_inventory.length, PSA_CERTIFIED_INVENTORY.length);
  assert.ok(report.platform_coherence.checks_total >= 5);
  assert.ok(report.platform_coherence.score_percent >= 0);

  const md = formatPlatformStateReportMarkdown(report);
  assert.ok(md.includes("## 1. Canonical State"));
  assert.ok(md.includes("## 2. Drift Report"));
  assert.ok(md.includes("## 3. Capability Progress"));
  assert.ok(md.includes("## 4. Next Horizon"));
  assert.ok(md.includes("Platform Coherence"));
});

test("PSA-001 governed era canonical state reflects PRL-4 gate", () => {
  if (!isGovernedPlatformEraActive()) {
    return;
  }

  const report = runPlatformStateAudit();
  assert.equal(report.canonical_state.prl_level, "PRL-3");
  assert.equal(report.canonical_state.prime_directive, "Protect the evidence.");
  assert.ok(report.canonical_state.current_phase.includes("Evidence-Driven Development"));
  assert.ok(report.canonical_state.next_operator_action.includes("PRL-4"));
  assert.equal(report.canonical_state.active_walkthrough_id, "OPERATOR-WALKTHROUGH-001");
});
