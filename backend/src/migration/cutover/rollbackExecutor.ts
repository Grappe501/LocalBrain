import fs from "node:fs";
import path from "node:path";
import type { MigrationCutoverRun, MigrationPlan } from "@localbrain/shared";
import { getAllowedFoldersFromDb } from "../../db/database.js";
import { initPermissionEngine } from "../../safety/permissionEngine.js";
import { updateWorkspaceFilesystemRoots } from "../../workspaces/workspaceRegistry.js";
import { getCutoverStagingRoot } from "./pathResolver.js";

function refreshPermissionEngine(): void {
  initPermissionEngine(getAllowedFoldersFromDb().map((f) => f.path));
}

export function executeCutoverRollback(
  run: MigrationCutoverRun,
  plan: MigrationPlan,
  reason?: string,
): MigrationCutoverRun {
  const staging = getCutoverStagingRoot(run.cutover_id);
  const rollbackSteps = [...run.rollback_package];

  for (let i = rollbackSteps.length - 1; i >= 0; i--) {
    const step = rollbackSteps[i];
    const planStep = plan.rollback_plan.find((r) => r.step_id === step.step_id);
    try {
      if (fs.existsSync(staging)) {
        const wsDirs = fs.readdirSync(staging);
        for (const wsId of wsDirs) {
          const moved = path.join(staging, wsId, "source", "payload.moved");
          const original = path.join(staging, wsId, "source", "payload.bin");
          if (fs.existsSync(moved) && !fs.existsSync(original)) {
            fs.renameSync(moved, original);
          }
        }
      }
      rollbackSteps[i] = {
        ...step,
        status: "completed",
        detail: planStep?.label ?? step.label,
      };
    } catch (e) {
      rollbackSteps[i] = {
        ...step,
        status: "failed",
        detail: e instanceof Error ? e.message : "Rollback step failed",
      };
    }
  }

  for (const update of run.projection_updates) {
    if (update.from_root) {
      updateWorkspaceFilesystemRoots(update.workspace_id, [update.from_root]);
    }
  }
  refreshPermissionEngine();

  return {
    ...run,
    status: "rolled_back",
    rollback_package: rollbackSteps,
    projections_updated: false,
    projection_updates: [],
    failure_recovery_status: "rollback_complete",
    critical_failure: reason ?? run.critical_failure,
    completed_at: new Date().toISOString(),
  };
}
