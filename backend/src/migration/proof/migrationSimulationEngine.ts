import { randomUUID } from "node:crypto";
import type { MigrationSimulation, MigrationSimulationBatch, WorkspaceBlueprint } from "@localbrain/shared";
import { PRIMARY_LOCATION_LABEL } from "@localbrain/shared";
import type { LivingWorkspace } from "@localbrain/shared";

export function buildMigrationSimulationBatches(
  workspaces: LivingWorkspace[],
  blueprints: WorkspaceBlueprint[],
): MigrationSimulationBatch[] {
  const blueprintMap = new Map(blueprints.map((b) => [b.workspace_id, b]));

  return workspaces
    .filter((ws) => !ws.flags.hidden)
    .map((ws) => {
      const bp = blueprintMap.get(ws.workspace_id);
      const current = bp?.current_projections[0]?.physical_ref ?? ws.filesystem_roots[0] ?? null;
      const recommended =
        bp?.recommended_projections[0]?.physical_ref ?? current ?? "H:\\Projects\\Unassigned";

      return {
        batch_id: randomUUID(),
        workspace_id: ws.workspace_id,
        title: ws.title,
        current_projection: current,
        recommended_projection: recommended,
        location_label: PRIMARY_LOCATION_LABEL,
        action_type: "projection_translation" as const,
        folder_count: bp?.migration_impact.folder_count ?? 0,
        file_count: bp?.migration_impact.file_count ?? 0,
      };
    })
    .filter((b) => b.current_projection !== b.recommended_projection || b.file_count > 0);
}

export function buildRollbackPreview(batches: MigrationSimulationBatch[]): string[] {
  return batches.map((b) => {
    if (b.current_projection) {
      return `Rollback ${b.title}: restore projection ${b.current_projection} (Location: ${b.location_label})`;
    }
    return `Rollback ${b.title}: remove planned projection ${b.recommended_projection}`;
  });
}

export function buildMigrationSimulation(
  simulationId: string,
  batches: MigrationSimulationBatch[],
): MigrationSimulation {
  return {
    simulation_id: simulationId,
    read_only: true,
    preview_only: true,
    nothing_changed: true,
    created_at: new Date().toISOString(),
    workspace_ids: [...new Set(batches.map((b) => b.workspace_id))],
    batches,
    rollback_preview: buildRollbackPreview(batches),
    impact_summary: {
      folders_affected: batches.reduce((s, b) => s + b.folder_count, 0),
      files_affected: batches.reduce((s, b) => s + b.file_count, 0),
      projections_changed: batches.filter((b) => b.current_projection !== b.recommended_projection)
        .length,
    },
    certificate_id: null,
  };
}
