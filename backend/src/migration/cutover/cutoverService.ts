import type {
  CutoverPreflightResult,
  MigrationApprovalPackage,
  MigrationCutoverOverview,
  MigrationCutoverRun,
  PersonalOsLaunchChecklistItem,
  Phase1LaunchReport,
} from "@localbrain/shared";
import {
  MIGRATION_CUTOVER_CORE_RULE,
  MIGRATION_CUTOVER_ENGINE_ID,
  MIGRATION_CUTOVER_VERIFICATION_RULE,
} from "@localbrain/shared";
import {
  appendActionLog,
  getProposedAction,
  updateProposedStatus,
} from "../../actions/proposalStore.js";
import { getDatabase } from "../../db/database.js";
import type { MigrationPlan, MigrationSimulation } from "@localbrain/shared";
import { getApprovalById } from "../approval/migrate.js";
import { getPlanById } from "../planning/migrate.js";
import {
  allocateCutoverId,
  countCutoverByStatus,
  getCutoverRunById,
  listRecentCutoverRuns,
  saveCutoverRun,
  updateCutoverRun,
} from "./migrate.js";
import { runCutoverPreflight } from "./preflightChecker.js";
import { executeCutoverPhysicalSteps, createStagingBackups } from "./cutoverExecutor.js";
import { runPostExecutionVerification } from "./verificationEngine.js";
import { applyProjectionUpdatesAfterVerification } from "./projectionUpdater.js";
import { executeCutoverRollback } from "./rollbackExecutor.js";

const GUARDRAILS = [
  "Execute only approved migration_cutover actions",
  "Require ready_for_cutover approval package",
  "No ad-hoc file actions · no uncertified plans",
  "No execution without rollback package on plan",
  "No permanent deletes · no shell commands · no cloud sync",
  "Stop on first critical failure",
  "Projection updates only after verification passes",
];

function getSimulationById(simulationId: string): MigrationSimulation | null {
  const row = getDatabase()
    .prepare(`SELECT report_json FROM migration_proof_simulations WHERE simulation_id = ?`)
    .get(simulationId) as { report_json: string } | undefined;
  if (!row?.report_json) return null;
  return JSON.parse(row.report_json) as MigrationSimulation;
}

function loadApprovalAndPlan(approvalId: string): {
  approval: MigrationApprovalPackage;
  plan: MigrationPlan;
} {
  const approval = getApprovalById(approvalId);
  if (!approval) throw new Error(`Approval not found: ${approvalId}`);
  const plan = getPlanById(approval.plan_id);
  if (!plan) throw new Error(`Plan not found: ${approval.plan_id}`);
  return { approval, plan };
}

function buildLaunchChecklist(run: MigrationCutoverRun): PersonalOsLaunchChecklistItem[] {
  return [
    {
      item_id: "proof-chain",
      label: "Proof → Plan → Approval provenance intact",
      required: true,
      complete: Boolean(run.provenance.certificate_id && run.provenance.plan_id),
    },
    {
      item_id: "approval-signed",
      label: "Executive approval signed with ready_for_cutover",
      required: true,
      complete: run.status === "completed" || run.status === "rolled_back",
    },
    {
      item_id: "physical-executed",
      label: "Physical cutover steps executed in staging",
      required: true,
      complete: run.execution_log.some((s) => s.status === "completed"),
    },
    {
      item_id: "verification-passed",
      label: "Post-execution verification passed",
      required: true,
      complete: run.verification_checks.every((c) => c.status !== "fail"),
    },
    {
      item_id: "projections-updated",
      label: "Logical projections updated after verification",
      required: true,
      complete: run.projections_updated,
    },
    {
      item_id: "no-critical-failure",
      label: "No unresolved critical failure",
      required: true,
      complete: !run.critical_failure && run.status === "completed",
    },
    {
      item_id: "phase-1-arc",
      label: "Phase 1 migration arc (019–026) complete",
      required: true,
      complete: run.status === "completed" && run.projections_updated,
    },
  ];
}

function buildPhase1LaunchReport(run: MigrationCutoverRun): Phase1LaunchReport {
  const checklist = buildLaunchChecklist(run);
  const personalOsReady = checklist.filter((c) => c.required).every((c) => c.complete);

  return {
    cutover_id: run.cutover_id,
    phase: "Phase 1 — Personal OS launch gate",
    personal_os_ready: personalOsReady,
    operations_completed: run.execution_log.filter((s) => s.status === "completed").length,
    operations_failed: run.execution_log.filter((s) => s.status === "failed").length,
    projections_updated: run.projection_updates.length,
    verification_passed: run.verification_checks.every((c) => c.status !== "fail"),
    failure_recovery_status: run.failure_recovery_status,
    provenance: run.provenance,
    summary: personalOsReady
      ? "Personal OS launch gate passed — verified cutover complete"
      : "Cutover incomplete — review failure recovery status",
    generated_at: new Date().toISOString(),
  };
}

function finalizeRun(
  run: MigrationCutoverRun,
  status: MigrationCutoverRun["status"],
  recovery: MigrationCutoverRun["failure_recovery_status"],
): MigrationCutoverRun {
  const finalized: MigrationCutoverRun = {
    ...run,
    status,
    failure_recovery_status: recovery,
    completed_at: new Date().toISOString(),
    personal_os_launch_checklist: [],
    phase_1_launch_report: null,
  };
  finalized.personal_os_launch_checklist = buildLaunchChecklist(finalized);
  finalized.phase_1_launch_report = buildPhase1LaunchReport(finalized);
  return finalized;
}

function buildInitialRun(
  approval: MigrationApprovalPackage,
  plan: MigrationPlan,
  cutoverId: string,
): MigrationCutoverRun {
  const now = new Date().toISOString();
  return {
    cutover_id: cutoverId,
    slice_id: "LB-OS-026",
    engine_id: MIGRATION_CUTOVER_ENGINE_ID,
    read_only: true,
    status: "running",
    approval_id: approval.approval_id,
    plan_id: plan.plan_id,
    action_id: approval.action_id ?? "",
    certificate_id: plan.certificate_id,
    workspace_ids: plan.workspace_ids,
    provenance: {
      audit_ref: approval.provenance.audit_ref,
      survey_ref: approval.provenance.survey_ref,
      certificate_id: approval.provenance.certificate_id,
      simulation_id: approval.provenance.simulation_id,
      plan_id: plan.plan_id,
      approval_id: approval.approval_id,
      cutover_id: cutoverId,
    },
    plan_summary: {
      variant_label: plan.variant_label,
      risk_label: plan.plan_quality.risk_label,
      total_operations: plan.total_operations,
      rollback_steps: plan.rollback_plan.length,
    },
    staging_root: `local_data/cutover_runs/${cutoverId}/physical`,
    execution_log: [],
    verification_checks: [],
    rollback_package: [],
    projections_updated: false,
    projection_updates: [],
    failure_recovery_status: "none",
    phase_1_launch_report: null,
    personal_os_launch_checklist: [],
    critical_failure: null,
    started_at: now,
    completed_at: null,
    created_at: now,
  };
}

export function getMigrationCutoverOverview(): MigrationCutoverOverview {
  return {
    slice_id: "LB-OS-026",
    engine_id: MIGRATION_CUTOVER_ENGINE_ID,
    read_only: true,
    core_rule: MIGRATION_CUTOVER_CORE_RULE,
    verification_rule: MIGRATION_CUTOVER_VERIFICATION_RULE,
    guardrails: GUARDRAILS,
    recent_runs: listRecentCutoverRuns(12),
    completed_count: countCutoverByStatus("completed"),
    observed_at: new Date().toISOString(),
  };
}

export function runMigrationCutoverPreflight(approvalId: string): CutoverPreflightResult {
  const { approval, plan } = loadApprovalAndPlan(approvalId);
  return runCutoverPreflight(approval, plan);
}

export function runMigrationCutover(approvalId: string): MigrationCutoverRun {
  const { approval, plan } = loadApprovalAndPlan(approvalId);
  const preflight = runCutoverPreflight(approval, plan);
  if (!preflight.ready) {
    const failed = preflight.checks.filter((c) => c.status === "fail").map((c) => c.check_id);
    throw new Error(`Preflight failed: ${failed.join(", ")}`);
  }

  if (!approval.action_id) {
    throw new Error("Approval missing linked migration_cutover action");
  }

  const action = getProposedAction(approval.action_id);
  if (!action || action.action_type !== "migration_cutover" || action.status !== "approved") {
    throw new Error("Linked action is not an approved migration_cutover");
  }

  const simulation = getSimulationById(plan.simulation_id);
  if (!simulation) {
    throw new Error(`Simulation not found: ${plan.simulation_id}`);
  }

  const cutoverId = allocateCutoverId();
  let run = buildInitialRun(approval, plan, cutoverId);
  saveCutoverRun(run);

  createStagingBackups(cutoverId, plan);
  run = executeCutoverPhysicalSteps(run, plan, simulation.batches);

  if (run.critical_failure) {
    run = finalizeRun(run, "failed", "rollback_available");
    updateCutoverRun(run);
    return run;
  }

  run = { ...run, status: "verifying" };
  updateCutoverRun(run);

  const verification = runPostExecutionVerification(run, plan, simulation.batches);
  run = {
    ...run,
    verification_checks: verification.checks,
  };

  if (!verification.passed) {
    run = finalizeRun(run, "failed", "rollback_available");
    updateCutoverRun(run);
    return run;
  }

  run = applyProjectionUpdatesAfterVerification(run, plan, simulation.batches);
  run = finalizeRun(run, "completed", "none");

  updateProposedStatus(approval.action_id, "executed", {
    execution_detail: `Cutover ${cutoverId} completed — projections updated after verification`,
  });
  appendActionLog(
    approval.action_id,
    "executed",
    `Migration cutover ${cutoverId} completed via LB-OS-026`,
  );

  updateCutoverRun(run);
  return run;
}

export function rollbackMigrationCutover(cutoverId: string, reason?: string): MigrationCutoverRun {
  const run = getCutoverRunById(cutoverId);
  if (!run) throw new Error(`Cutover run not found: ${cutoverId}`);

  if (run.status === "completed" && run.projections_updated) {
    throw new Error("Completed cutover with projection updates requires manual recovery planning");
  }

  const plan = getPlanById(run.plan_id);
  if (!plan) throw new Error(`Plan not found: ${run.plan_id}`);

  let rolled = executeCutoverRollback(
    { ...run, failure_recovery_status: "rollback_in_progress" },
    plan,
    reason,
  );
  rolled = finalizeRun(rolled, "rolled_back", "rollback_complete");
  updateCutoverRun(rolled);
  return rolled;
}

export function getMigrationCutoverById(cutoverId: string): MigrationCutoverRun | null {
  return getCutoverRunById(cutoverId);
}
