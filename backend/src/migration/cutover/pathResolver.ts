import fs from "node:fs";
import path from "node:path";
import type { MigrationPlan, MigrationPlanOperation, MigrationSimulationBatch } from "@localbrain/shared";
import { getCutoverRunsDir } from "../../actions/actionPaths.js";
import { checkWritePath } from "../../actions/proposalService.js";

export function getCutoverStagingRoot(cutoverId: string): string {
  return path.join(getCutoverRunsDir(), cutoverId, "physical");
}

export function ensureStagingRoot(cutoverId: string): string {
  const root = getCutoverStagingRoot(cutoverId);
  fs.mkdirSync(root, { recursive: true });
  return root;
}

export function resolveWorkspaceStagingPath(
  cutoverId: string,
  workspaceId: string,
  batch?: MigrationSimulationBatch,
): string | null {
  const base = path.join(getCutoverStagingRoot(cutoverId), workspaceId);
  const check = checkWritePath(base);
  if (!check.allowed) return null;
  return check.normalizedPath!;
}

export function resolveOperationPath(
  cutoverId: string,
  op: MigrationPlanOperation,
  batch?: MigrationSimulationBatch,
): string | null {
  const wsPath = resolveWorkspaceStagingPath(cutoverId, op.workspace_id, batch);
  if (!wsPath) return null;

  switch (op.kind) {
    case "create_folder_structure":
      return path.join(wsPath, "structure");
    case "copy_documentation":
      return path.join(wsPath, "docs", "cutover-manifest.txt");
    case "move_source":
      return path.join(wsPath, "source", "payload.bin");
    case "update_projection":
      return path.join(wsPath, "projection-target.json");
    case "validate_references":
      return path.join(wsPath, "refs", "validation.marker");
    case "finalize":
      return path.join(wsPath, "CUT_OVER_MANIFEST.json");
    case "verify":
      return path.join(wsPath, "VERIFY_OK.marker");
    default:
      return wsPath;
  }
}

export function recommendedProjectionForWorkspace(
  plan: MigrationPlan,
  batches: MigrationSimulationBatch[],
  workspaceId: string,
): string | null {
  const batch = batches.find((b) => b.workspace_id === workspaceId);
  return batch?.recommended_projection ?? null;
}

export function currentProjectionForWorkspace(
  batches: MigrationSimulationBatch[],
  workspaceId: string,
): string | null {
  const batch = batches.find((b) => b.workspace_id === workspaceId);
  return batch?.current_projection ?? null;
}
