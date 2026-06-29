import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../../bootstrap.js";
import {
  generateMigrationPlans,
  getMigrationPlansOverview,
  getMigrationPlanById,
} from "./migrationPlanService.js";
import { runMigrationProofSimulation } from "../proof/migrationProofService.js";

test("migration plans overview is read-only LB-OS-024", () => {
  bootstrapApp();
  try {
    const overview = getMigrationPlansOverview();
    assert.equal(overview.slice_id, "LB-OS-024");
    assert.equal(overview.engine_id, "ENG-MPL-001");
    assert.equal(overview.planning_engine_id, "ENG-PLN-001");
    assert.equal(overview.read_only, true);
    assert.ok(overview.variant_strategies.length === 3);
    assert.ok(overview.guardrails.some((g) => g.includes("LLM")));
  } finally {
    shutdownApp();
  }
});

test("generate plans from certified certificate produces PLAN ids and variants", () => {
  bootstrapApp();
  try {
    const { certificate } = runMigrationProofSimulation();
    const result = generateMigrationPlans({ certificate_id: certificate.certificate_id });
    assert.ok(result.plans.length === 3);
    assert.ok(result.recommended_plan_id);

    for (const plan of result.plans) {
      assert.match(plan.plan_id, /^PLAN-\d{6}$/);
      assert.equal(plan.read_only, true);
      assert.equal(plan.immutable, true);
      assert.ok(plan.constraints.length >= 8);
      assert.ok(plan.objectives.length >= 4);
      assert.ok(plan.plan_quality.percent >= 0);
      assert.ok(plan.provenance.certificate_id === certificate.certificate_id);
      assert.ok(plan.provenance.audit_ref?.startsWith("AUD-") || plan.provenance.audit_ref === null);
      assert.ok(plan.operations.length > 0);
      assert.ok(plan.rollback_plan.length > 0);
    }

    const stored = getMigrationPlanById(result.plans[0].plan_id);
    assert.ok(stored);
    assert.equal(stored!.plan_id, result.plans[0].plan_id);

    const balanced = result.plans.find((p) => p.variant_strategy === "balanced");
    assert.ok(balanced);
    if (balanced!.ready_for_proposal) {
      assert.ok(balanced!.constraints.every((c) => c.status !== "fail"));
    }
  } finally {
    shutdownApp();
  }
});

test("generate rejects non-certified certificate", () => {
  bootstrapApp();
  try {
    assert.throws(
      () => generateMigrationPlans({ certificate_id: "CERT-999999" }),
      /not found|not plan-eligible/,
    );
  } finally {
    shutdownApp();
  }
});
