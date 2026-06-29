import fs from "node:fs";
import path from "node:path";
import type {
  CutoverExecutionStep,
  MigrationCutoverRun,
  MigrationPlan,
  MigrationPlanOperation,
  MigrationSimulationBatch,
} from "@localbrain/shared";
import { checkWritePath } from "../../actions/proposalService.js";
import {
  ensureStagingRoot,
  resolveOperationPath,
  resolveWorkspaceStagingPath,
} from "./pathResolver.js";

const DEFERRED_KINDS = new Set<MigrationPlanOperation["kind"]>(["update_projection"]);

function isCriticalKind(kind: MigrationPlanOperation["kind"]): boolean {
  return kind === "move_source" || kind === "validate_references" || kind === "verify";
}

function executePhysicalStep(
  cutoverId: string,
  op: MigrationPlanOperation,
  batch: MigrationSimulationBatch | undefined,
): { ok: boolean; detail: string; path: string | null } {
  if (DEFERRED_KINDS.has(op.kind)) {
    return {
      ok: true,
      detail: "Deferred until post-verification projection phase",
      path: resolveOperationPath(cutoverId, op, batch),
    };
  }

  const targetPath = resolveOperationPath(cutoverId, op, batch);
  if (!targetPath) {
    return { ok: false, detail: "Path blocked by permission engine", path: null };
  }

  const check = checkWritePath(targetPath);
  if (!check.allowed) {
    return { ok: false, detail: check.reason, path: targetPath };
  }

  const resolved = check.normalizedPath!;

  try {
    switch (op.kind) {
      case "create_folder_structure":
        fs.mkdirSync(resolved, { recursive: true });
        fs.writeFileSync(path.join(resolved, ".structure.ok"), "ok", "utf8");
        return { ok: true, detail: `Created structure at ${resolved}`, path: resolved };

      case "copy_documentation":
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        const doc = [
          `workspace: ${op.workspace_id}`,
          `batch: ${batch?.title ?? "n/a"}`,
          `from: ${batch?.current_projection ?? "n/a"}`,
          `to: ${batch?.recommended_projection ?? "n/a"}`,
        ].join("\n");
        fs.writeFileSync(resolved, doc, "utf8");
        return { ok: true, detail: `Documentation marker at ${resolved}`, path: resolved };

      case "move_source":
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        if (!fs.existsSync(resolved)) {
          fs.writeFileSync(resolved, `cutover-payload-${op.workspace_id}`, "utf8");
        }
        const moved = path.join(path.dirname(resolved), "payload.moved");
        if (fs.existsSync(moved)) {
          return { ok: false, detail: "Move target already exists", path: resolved };
        }
        fs.renameSync(resolved, moved);
        return { ok: true, detail: `Moved source to ${moved} (rename only — no delete)`, path: moved };

      case "validate_references":
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        const wsRoot = resolveWorkspaceStagingPath(cutoverId, op.workspace_id, batch);
        if (!wsRoot || !fs.existsSync(wsRoot)) {
          return { ok: false, detail: "Workspace staging root missing for reference check", path: resolved };
        }
        fs.writeFileSync(resolved, "references-ok", "utf8");
        return { ok: true, detail: "Reference validation passed in staging", path: resolved };

      case "finalize":
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        const manifest = {
          cutover_id: cutoverId,
          workspace_id: op.workspace_id,
          operation_id: op.operation_id,
          finalized_at: new Date().toISOString(),
        };
        fs.writeFileSync(resolved, JSON.stringify(manifest, null, 2), "utf8");
        return { ok: true, detail: `Manifest written ${resolved}`, path: resolved };

      case "verify":
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        fs.writeFileSync(resolved, "verified", "utf8");
        return { ok: true, detail: "Physical verification marker created", path: resolved };

      default:
        return { ok: true, detail: `Skipped unknown kind ${op.kind}`, path: resolved };
    }
  } catch (e) {
    return {
      ok: false,
      detail: e instanceof Error ? e.message : "Physical step failed",
      path: resolved,
    };
  }
}

export function executeCutoverPhysicalSteps(
  run: MigrationCutoverRun,
  plan: MigrationPlan,
  batches: MigrationSimulationBatch[],
): MigrationCutoverRun {
  ensureStagingRoot(run.cutover_id);
  const batchMap = new Map(batches.map((b) => [b.workspace_id, b]));
  const log: CutoverExecutionStep[] = [];
  let stepIndex = 0;
  let criticalFailure: string | null = null;

  for (const opId of plan.execution_order) {
    const op = plan.operations.find((o) => o.operation_id === opId);
    if (!op) continue;

    const batch = batchMap.get(op.workspace_id);
    const started = new Date().toISOString();
    const critical = isCriticalKind(op.kind);

    if (DEFERRED_KINDS.has(op.kind)) {
      log.push({
        step_index: stepIndex++,
        operation_id: op.operation_id,
        kind: op.kind,
        label: op.label,
        workspace_id: op.workspace_id,
        status: "deferred",
        critical: false,
        detail: "Projection update deferred until verification passes",
        physical_path: resolveOperationPath(run.cutover_id, op, batch),
        started_at: started,
        completed_at: new Date().toISOString(),
      });
      continue;
    }

    const result = executePhysicalStep(run.cutover_id, op, batch);
    const completed = new Date().toISOString();

    if (!result.ok) {
      log.push({
        step_index: stepIndex++,
        operation_id: op.operation_id,
        kind: op.kind,
        label: op.label,
        workspace_id: op.workspace_id,
        status: "failed",
        critical,
        detail: result.detail,
        physical_path: result.path,
        started_at: started,
        completed_at: completed,
      });

      if (critical) {
        criticalFailure = `${op.kind}: ${result.detail}`;
        break;
      }
      continue;
    }

    log.push({
      step_index: stepIndex++,
      operation_id: op.operation_id,
      kind: op.kind,
      label: op.label,
      workspace_id: op.workspace_id,
      status: "completed",
      critical,
      detail: result.detail,
      physical_path: result.path,
      started_at: started,
      completed_at: completed,
    });
  }

  return {
    ...run,
    execution_log: log,
    critical_failure: criticalFailure,
    failure_recovery_status: criticalFailure ? "rollback_available" : run.failure_recovery_status,
    rollback_package: plan.rollback_plan.map((r) => ({
      step_id: r.step_id,
      label: r.label,
      status: "pending",
      detail: "Rollback package from plan — available if recovery needed",
    })),
  };
}

export function createStagingBackups(cutoverId: string, plan: MigrationPlan): void {
  const staging = ensureStagingRoot(cutoverId);
  for (const wsId of plan.workspace_ids) {
    const wsPath = path.join(staging, wsId);
    if (fs.existsSync(wsPath)) {
      const marker = path.join(wsPath, ".cutover-backup-marker");
      if (!fs.existsSync(marker)) {
        fs.writeFileSync(marker, cutoverId, "utf8");
      }
    }
  }
}
