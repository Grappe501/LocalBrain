import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../../bootstrap.js";
import {
  createApprovalFromPlan,
  getMigrationApprovalsOverview,
  getMigrationApprovalById,
  rejectMigrationApproval,
  signMigrationApproval,
} from "./executiveApprovalService.js";
import { generateMigrationPlans } from "../planning/migrationPlanService.js";
import { runMigrationProofSimulation } from "../proof/migrationProofService.js";
import { executeApprovedAction } from "../../actions/executorService.js";
import { getProposedAction } from "../../actions/proposalStore.js";

test("migration approvals overview is read-only LB-OS-025", () => {
  bootstrapApp();
  try {
    const overview = getMigrationApprovalsOverview();
    assert.equal(overview.slice_id, "LB-OS-025");
    assert.equal(overview.engine_id, "ENG-APR-001");
    assert.equal(overview.read_only, true);
    assert.ok(overview.guardrails.some((g) => g.includes("execution")));
    assert.ok(overview.guardrails.some((g) => g.includes("LB-OS-010")));
  } finally {
    shutdownApp();
  }
});

test("create approval from ready plan and sign enables cutover gate", () => {
  bootstrapApp();
  try {
    const { certificate } = runMigrationProofSimulation();
    const { plans } = generateMigrationPlans({ certificate_id: certificate.certificate_id });
    const plan = plans.find((p) => p.ready_for_proposal) ?? plans[0];
    assert.ok(plan);

    const { approval } = createApprovalFromPlan({ plan_id: plan.plan_id });
    assert.match(approval.approval_id, /^APPR-\d{6}$/);
    assert.equal(approval.status, "pending");
    assert.equal(approval.ready_for_cutover, false);
    assert.equal(approval.plan_id, plan.plan_id);
    assert.equal(approval.provenance.certificate_id, plan.certificate_id);
    assert.ok(approval.provenance.audit_ref?.startsWith("AUD-") || approval.provenance.audit_ref === null);
    assert.ok(approval.action_id);
    assert.equal(approval.checklist.length, 5);

    const signed = signMigrationApproval(approval.approval_id, {
      signed_by: "steve",
      checklist: approval.checklist.map((item) => ({ item_id: item.item_id, checked: true })),
      risk_acknowledged: true,
      rollback_acknowledged: true,
    });

    assert.equal(signed.status, "signed");
    assert.equal(signed.ready_for_cutover, true);
    assert.ok(signed.signed_at);
    assert.equal(signed.risk_acknowledgement.acknowledged, true);
    assert.equal(signed.rollback_acknowledgement.acknowledged, true);

    const linked = getProposedAction(signed.action_id!);
    assert.equal(linked?.status, "approved");

    const stored = getMigrationApprovalById(approval.approval_id);
    assert.equal(stored?.ready_for_cutover, true);
  } finally {
    shutdownApp();
  }
});

test("reject approval rejects linked action", () => {
  bootstrapApp();
  try {
    const { certificate } = runMigrationProofSimulation();
    const { plans } = generateMigrationPlans({ certificate_id: certificate.certificate_id });
    const plan = plans[0];
    const { approval } = createApprovalFromPlan({ plan_id: plan.plan_id });

    const rejected = rejectMigrationApproval(approval.approval_id, {
      reason: "Not ready for cutover",
      rejected_by: "steve",
    });
    assert.equal(rejected.status, "rejected");
    assert.equal(rejected.ready_for_cutover, false);

    const linked = getProposedAction(approval.action_id!);
    assert.equal(linked?.status, "rejected");
  } finally {
    shutdownApp();
  }
});

test("create rejects plan not ready for proposal", () => {
  bootstrapApp();
  try {
    const { certificate } = runMigrationProofSimulation();
    const { plans } = generateMigrationPlans({ certificate_id: certificate.certificate_id });
    const notReady = plans.find((p) => !p.ready_for_proposal);
    if (!notReady) return;

    assert.throws(
      () => createApprovalFromPlan({ plan_id: notReady.plan_id }),
      /not ready for proposal/,
    );
  } finally {
    shutdownApp();
  }
});

test("migration_cutover action cannot execute in LB-OS-025", () => {
  bootstrapApp();
  try {
    const { certificate } = runMigrationProofSimulation();
    const { plans } = generateMigrationPlans({ certificate_id: certificate.certificate_id });
    const { approval } = createApprovalFromPlan({ plan_id: plans[0].plan_id });
    const signed = signMigrationApproval(approval.approval_id, {
      signed_by: "steve",
      checklist: approval.checklist.map((item) => ({ item_id: item.item_id, checked: true })),
      risk_acknowledged: true,
      rollback_acknowledged: true,
    });

    const result = executeApprovedAction(signed.action_id!);
    assert.equal(result.success, false);
    assert.ok(result.message.includes("LB-OS-026"));
  } finally {
    shutdownApp();
  }
});
