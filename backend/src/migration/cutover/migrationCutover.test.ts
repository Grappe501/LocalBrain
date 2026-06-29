import test from "node:test";
import assert from "node:assert/strict";
import type { MigrationApprovalPackage, ProofCertificate } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../../bootstrap.js";
import { generateMigrationPlans } from "../planning/migrationPlanService.js";
import { runMigrationProofSimulation } from "../proof/migrationProofService.js";
import { listRecentCertificates } from "../proof/migrate.js";
import {
  createApprovalFromPlan,
  signMigrationApproval,
} from "../approval/executiveApprovalService.js";
import { listRecentApprovals } from "../approval/migrate.js";
import {
  getMigrationCutoverOverview,
  runMigrationCutover,
  runMigrationCutoverPreflight,
  rollbackMigrationCutover,
} from "./cutoverService.js";
import { getProposedAction } from "../../actions/proposalStore.js";
import { executeApprovedAction } from "../../actions/executorService.js";

function findCertifiedCertificate(): ProofCertificate {
  for (const json of listRecentCertificates(50)) {
    const cert = JSON.parse(json) as ProofCertificate;
    if (cert.result === "certified" && cert.plan_eligible) return cert;
  }
  const { certificate } = runMigrationProofSimulation();
  if (certificate.result === "certified" && certificate.plan_eligible) return certificate;
  throw new Error("No certified certificate available for cutover test");
}

function signNewApprovalFromCert(certificate: ProofCertificate): MigrationApprovalPackage {
  const { plans } = generateMigrationPlans({ certificate_id: certificate.certificate_id });
  const plan = plans.find((p) => p.ready_for_proposal) ?? plans[0];
  const { approval } = createApprovalFromPlan({ plan_id: plan.plan_id });
  return signMigrationApproval(approval.approval_id, {
    signed_by: "steve",
    checklist: approval.checklist.map((item) => ({ item_id: item.item_id, checked: true })),
    risk_acknowledged: true,
    rollback_acknowledged: true,
  });
}

function findUnusedSignedApproval(): MigrationApprovalPackage | null {
  for (const approval of listRecentApprovals(40)) {
    if (!approval.ready_for_cutover || approval.status !== "signed" || !approval.action_id) {
      continue;
    }
    const action = getProposedAction(approval.action_id);
    if (action?.action_type === "migration_cutover" && action.status === "approved") {
      return approval;
    }
  }
  return null;
}

function obtainSignedApproval(): MigrationApprovalPackage {
  const existing = findUnusedSignedApproval();
  if (existing) return existing;
  return signNewApprovalFromCert(findCertifiedCertificate());
}

test("cutover overview is LB-OS-026 read-only", () => {
  bootstrapApp();
  try {
    const overview = getMigrationCutoverOverview();
    assert.equal(overview.slice_id, "LB-OS-026");
    assert.equal(overview.engine_id, "ENG-CUT-001");
    assert.ok(overview.guardrails.some((g) => g.includes("migration_cutover")));
    assert.ok(overview.verification_rule.includes("Verification"));
  } finally {
    shutdownApp();
  }
});

test("full cutover flow executes verifies and updates projections", () => {
  bootstrapApp();
  try {
    const signed = obtainSignedApproval();

    const preflight = runMigrationCutoverPreflight(signed.approval_id);
    if (!preflight.ready) {
      const failed = preflight.checks.filter((c) => c.status === "fail");
      assert.fail(`Preflight failed: ${failed.map((c) => c.check_id).join(", ")}`);
    }

    const run = runMigrationCutover(signed.approval_id);
    assert.match(run.cutover_id, /^CUT-\d{6}$/);
    assert.equal(run.status, "completed");
    assert.ok(run.execution_log.length > 0);
    assert.ok(run.verification_checks.every((c) => c.status !== "fail"));
    assert.equal(run.projections_updated, true);
    assert.ok(run.phase_1_launch_report?.personal_os_ready);
    assert.ok(run.personal_os_launch_checklist.some((c) => c.item_id === "phase-1-arc"));

    const action = getProposedAction(signed.action_id!);
    assert.equal(action?.status, "executed");

    const directExec = executeApprovedAction(signed.action_id!);
    assert.equal(directExec.success, false);
  } finally {
    shutdownApp();
  }
});

test("rollback on failed cutover restores recovery status", () => {
  bootstrapApp();
  try {
    const signed = obtainSignedApproval();
    const run = runMigrationCutover(signed.approval_id);
    if (run.status === "failed") {
      const rolled = rollbackMigrationCutover(run.cutover_id, "test rollback");
      assert.equal(rolled.status, "rolled_back");
      assert.equal(rolled.failure_recovery_status, "rollback_complete");
    } else {
      assert.equal(run.status, "completed");
    }
  } finally {
    shutdownApp();
  }
});
