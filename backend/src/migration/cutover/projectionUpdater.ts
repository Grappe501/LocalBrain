import fs from "node:fs";
import path from "node:path";
import type { MigrationCutoverRun, MigrationPlan, MigrationSimulationBatch } from "@localbrain/shared";
import { getAllowedFoldersFromDb } from "../../db/database.js";
import { initPermissionEngine } from "../../safety/permissionEngine.js";
import {
  getWorkspace,
  updateWorkspaceFilesystemRoots,
} from "../../workspaces/workspaceRegistry.js";
import {
  currentProjectionForWorkspace,
  recommendedProjectionForWorkspace,
  resolveWorkspaceStagingPath,
} from "./pathResolver.js";

function refreshPermissionEngine(): void {
  initPermissionEngine(getAllowedFoldersFromDb().map((f) => f.path));
}

export function applyProjectionUpdatesAfterVerification(
  run: MigrationCutoverRun,
  plan: MigrationPlan,
  batches: MigrationSimulationBatch[],
): MigrationCutoverRun {
  const updates: MigrationCutoverRun["projection_updates"] = [];

  for (const wsId of plan.workspace_ids) {
    const ws = getWorkspace(wsId);
    const recommended = recommendedProjectionForWorkspace(plan, batches, wsId);
    const current = currentProjectionForWorkspace(batches, wsId);
    const fromRoot = ws?.filesystem_roots[0] ?? current;

    let targetRoot = recommended;
    if (recommended) {
      const result = updateWorkspaceFilesystemRoots(wsId, [recommended]);
      if ("error" in result) {
        const staging = resolveWorkspaceStagingPath(run.cutover_id, wsId);
        if (staging) {
          const fallbackResult = updateWorkspaceFilesystemRoots(wsId, [staging]);
          if (!("error" in fallbackResult)) {
            targetRoot = staging;
          }
        }
      }
    }

    if (targetRoot) {
      updates.push({
        workspace_id: wsId,
        from_root: fromRoot ?? null,
        to_root: targetRoot,
      });

      const stagingPath = resolveWorkspaceStagingPath(run.cutover_id, wsId);
      const projectionFile = stagingPath
        ? path.join(stagingPath, "projection-target.json")
        : null;
      if (projectionFile) {
        fs.mkdirSync(path.dirname(projectionFile), { recursive: true });
        fs.writeFileSync(
          projectionFile,
          JSON.stringify({
            workspace_id: wsId,
            from: fromRoot,
            to: targetRoot,
            applied_at: new Date().toISOString(),
            cutover_id: run.cutover_id,
          }),
          "utf8",
        );
      }
    }
  }

  refreshPermissionEngine();

  const deferredSteps = run.execution_log.map((step) =>
    step.status === "deferred" && step.kind === "update_projection"
      ? {
          ...step,
          status: "completed" as const,
          detail: "Projection updated in Logical World after verification",
          completed_at: new Date().toISOString(),
        }
      : step,
  );

  return {
    ...run,
    execution_log: deferredSteps,
    projections_updated: updates.length > 0,
    projection_updates: updates,
  };
}
