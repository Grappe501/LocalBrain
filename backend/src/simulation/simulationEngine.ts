import type { ConsolidationSimulationResult } from "@localbrain/shared";
import type { ConsolidationFinding } from "../consolidation/types.js";

export interface SimulationInput {
  findings: ConsolidationFinding[];
  cardIds?: string[];
}

/** In-memory dry-run — zero filesystem mutations. */
export function runConsolidationSimulation(input: SimulationInput): ConsolidationSimulationResult {
  const selected =
    input.cardIds && input.cardIds.length > 0
      ? input.findings.filter((f) => input.cardIds!.includes(f.finding_id))
      : input.findings;

  let storage = 0;
  let dupRemoved = 0;
  let foldersMerged = 0;
  let workspacesCleaned = 0;
  let decisionPoints = 0;

  for (const f of selected) {
    storage += f.reclaimable_bytes;
    decisionPoints += f.decision_points_eliminated;
    if (f.category === "duplicate_file") dupRemoved += f.decision_points_eliminated;
    if (f.category === "folder_consolidation") foldersMerged += 1;
    if (f.category === "workspace_orphan") workspacesCleaned += 1;
  }

  return {
    read_only: true,
    preview_only: true,
    reversible: true,
    storage_recovered_bytes: storage,
    duplicate_files_removed: dupRemoved,
    folders_merged: foldersMerged,
    workspaces_cleaned: workspacesCleaned,
    files_deleted: 0,
    decision_points_eliminated: decisionPoints,
    cards_simulated: selected.length,
    summary: `If approved: ${formatBytes(storage)} recovered · ${decisionPoints} decision points eliminated · 0 files deleted without approval · everything reversible`,
    nothing_changed: true,
  };
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
