import fs from "node:fs";
import path from "node:path";
import type {
  CutoverVerificationCheck,
  MigrationCutoverRun,
  MigrationPlan,
  MigrationSimulationBatch,
} from "@localbrain/shared";
import { getCutoverStagingRoot } from "./pathResolver.js";

export function runPostExecutionVerification(
  run: MigrationCutoverRun,
  plan: MigrationPlan,
  batches: MigrationSimulationBatch[],
): { checks: CutoverVerificationCheck[]; passed: boolean } {
  const checks: CutoverVerificationCheck[] = [];
  const staging = getCutoverStagingRoot(run.cutover_id);

  checks.push({
    check_id: "staging-root",
    label: "Physical staging root exists",
    status: fs.existsSync(staging) ? "pass" : "fail",
    detail: staging,
  });

  const failedSteps = run.execution_log.filter((s) => s.status === "failed");
  checks.push({
    check_id: "no-critical-failures",
    label: "No critical execution failures",
    status: failedSteps.length === 0 && !run.critical_failure ? "pass" : "fail",
    detail:
      failedSteps.length > 0
        ? `${failedSteps.length} failed steps`
        : run.critical_failure ?? "All steps ok",
  });

  const completedOps = run.execution_log.filter((s) => s.status === "completed").length;
  checks.push({
    check_id: "operations-completed",
    label: "Physical operations completed",
    status: completedOps > 0 ? "pass" : "fail",
    detail: `${completedOps} completed of ${plan.total_operations} planned`,
  });

  let manifestOk = 0;
  for (const wsId of plan.workspace_ids) {
    const manifest = path.join(staging, wsId, "CUT_OVER_MANIFEST.json");
    if (fs.existsSync(manifest)) manifestOk++;
  }
  checks.push({
    check_id: "finalize-manifests",
    label: "Finalize manifests present",
    status: manifestOk > 0 ? "pass" : "warn",
    detail: `${manifestOk} workspace manifests`,
  });

  const projectionChanges = batches.filter(
    (b) => b.current_projection !== b.recommended_projection,
  ).length;
  checks.push({
    check_id: "projection-integrity",
    label: "Projection translation targets identified",
    status: projectionChanges > 0 ? "pass" : "warn",
    detail: `${projectionChanges} workspaces with projection changes pending logical update`,
  });

  checks.push({
    check_id: "rollback-package",
    label: "Rollback package available on plan",
    status: plan.rollback_plan.length > 0 ? "pass" : "fail",
    detail: `${plan.rollback_plan.length} rollback steps`,
  });

  const passed = checks.every((c) => c.status !== "fail");
  return { checks, passed };
}
