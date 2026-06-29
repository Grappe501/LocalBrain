import path from "node:path";
import { getDatabase } from "../../db/database.js";
import type {
  CMisplacedWorkCandidate,
  DuplicateWorkspaceCandidate,
  FilesystemMappingAudit,
  FolderInventoryStat,
  MappingConfidenceLabel,
  StaleFolderCandidate,
  TopLevelDirectoryEntry,
  UnclaimedFolderCandidate,
  WorkspaceRootCoverage,
} from "@localbrain/shared";
import { listWorkspaces } from "../../workspaces/workspaceRegistry.js";
import { getDriveLetter } from "../driveDoctrine.js";
import { runPlacementAudit } from "../placementAudit.js";
import type { ScanResult } from "./scanner.js";
import { collectHScanRoots } from "./scanner.js";

const STALE_DAYS = 90;
const GUARDRAILS = [
  "Read-only inventory",
  "Permission-gated H:/ mapping",
  "No file content reads (metadata only)",
  "No moves",
  "No deletes",
  "No cleanup execution",
  "No cloud sync",
  "No bulk actions",
  "No whole C:/ scan",
];

type AssetRow = {
  path: string;
  is_directory: number;
  size_bytes: number | null;
  modified_at: string | null;
  workspace_id: string | null;
};

function loadHAssets(): AssetRow[] {
  return getDatabase()
    .prepare(
      `SELECT path, is_directory, size_bytes, modified_at, workspace_id
       FROM digital_assets
       WHERE path LIKE 'H:%' OR path LIKE 'H:/%'`,
    )
    .all() as AssetRow[];
}

function topLevelPath(resolved: string): string | null {
  const normalized = path.normalize(resolved);
  const match = /^H:[\\/]([^\\/]+)/i.exec(normalized);
  if (!match) return null;
  return `H:\\${match[1]}`;
}

function resolveWorkspaceForRoot(folderPath: string): { id: string | null; claimed: boolean } {
  const workspaces = listWorkspaces();
  const normalized = path.normalize(folderPath).toLowerCase();

  for (const ws of workspaces) {
    for (const root of ws.filesystem_roots) {
      const rootNorm = path.normalize(root).toLowerCase();
      if (normalized === rootNorm || normalized.startsWith(rootNorm + path.sep)) {
        return { id: ws.workspace_id, claimed: true };
      }
      if (rootNorm.startsWith(normalized + path.sep) || rootNorm === normalized) {
        return { id: ws.workspace_id, claimed: true };
      }
    }
  }
  return { id: null, claimed: false };
}

function buildTopLevelInventory(assets: AssetRow[]): TopLevelDirectoryEntry[] {
  const map = new Map<
    string,
    {
      asset_count: number;
      file_count: number;
      directory_count: number;
      size_bytes: number;
      last_modified_at: string | null;
    }
  >();

  for (const asset of assets) {
    const top = topLevelPath(asset.path);
    if (!top) continue;
    const entry = map.get(top) ?? {
      asset_count: 0,
      file_count: 0,
      directory_count: 0,
      size_bytes: 0,
      last_modified_at: null,
    };
    entry.asset_count += 1;
    if (asset.is_directory) entry.directory_count += 1;
    else entry.file_count += 1;
    entry.size_bytes += asset.size_bytes ?? 0;
    if (asset.modified_at && (!entry.last_modified_at || asset.modified_at > entry.last_modified_at)) {
      entry.last_modified_at = asset.modified_at;
    }
    map.set(top, entry);
  }

  for (const root of collectHScanRoots()) {
    const top = topLevelPath(root);
    if (top && !map.has(top)) {
      map.set(top, {
        asset_count: 0,
        file_count: 0,
        directory_count: 0,
        size_bytes: 0,
        last_modified_at: null,
      });
    }
  }

  return [...map.entries()]
    .map(([topPath, stats]) => {
      const claim = resolveWorkspaceForRoot(topPath);
      return {
        path: topPath,
        name: path.basename(topPath),
        ...stats,
        workspace_claimed: claim.claimed,
        claiming_workspace_id: claim.id,
      };
    })
    .sort((a, b) => b.size_bytes - a.size_bytes);
}

function buildWorkspaceCoverage(assets: AssetRow[]): WorkspaceRootCoverage[] {
  return listWorkspaces().map((ws) => {
    const roots = ws.filesystem_roots.filter((r) => getDriveLetter(r) === "H");
    let count = 0;
    let bytes = 0;
    for (const asset of assets) {
      if (asset.workspace_id === ws.workspace_id) {
        count += 1;
        bytes += asset.size_bytes ?? 0;
      }
    }
    const note =
      roots.length === 0
        ? "No H: filesystem roots registered"
        : count > 0
          ? `${count} indexed assets under workspace`
          : "Roots registered but no indexed assets yet — run Knowledge Explorer index";

    return {
      workspace_id: ws.workspace_id,
      title: ws.title,
      roots,
      indexed_asset_count: count,
      indexed_bytes: bytes,
      coverage_note: note,
    };
  });
}

function buildFolderStats(assets: AssetRow[]): FolderInventoryStat[] {
  const map = new Map<
    string,
    FolderInventoryStat
  >();

  for (const asset of assets) {
    const folder = asset.is_directory
      ? path.normalize(asset.path)
      : path.dirname(path.normalize(asset.path));
    const key = folder.toLowerCase();
    const entry = map.get(key) ?? {
      folder_path: folder,
      asset_count: 0,
      file_count: 0,
      directory_count: 0,
      size_bytes: 0,
      last_modified_at: null,
    };
    entry.asset_count += 1;
    if (asset.is_directory) entry.directory_count += 1;
    else entry.file_count += 1;
    entry.size_bytes += asset.size_bytes ?? 0;
    if (asset.modified_at && (!entry.last_modified_at || asset.modified_at > entry.last_modified_at)) {
      entry.last_modified_at = asset.modified_at;
    }
    map.set(key, entry);
  }

  return [...map.values()].sort((a, b) => b.size_bytes - a.size_bytes).slice(0, 80);
}

function buildStaleCandidates(folderStats: FolderInventoryStat[]): StaleFolderCandidate[] {
  const cutoff = Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000;
  return folderStats
    .filter((f) => {
      if (!f.last_modified_at) return f.asset_count > 0;
      return new Date(f.last_modified_at).getTime() < cutoff;
    })
    .map((f) => {
      const days = f.last_modified_at
        ? Math.floor((Date.now() - new Date(f.last_modified_at).getTime()) / (24 * 60 * 60 * 1000))
        : STALE_DAYS + 1;
      return {
        folder_path: f.folder_path,
        days_since_activity: days,
        asset_count: f.asset_count,
        size_bytes: f.size_bytes,
        reason: `No indexed activity in ${days}+ days — review for archive (no auto cleanup)`,
      };
    })
    .slice(0, 30);
}

function buildUnclaimed(topLevel: TopLevelDirectoryEntry[]): UnclaimedFolderCandidate[] {
  return topLevel
    .filter((t) => !t.workspace_claimed)
    .map((t) => ({
      path: t.path,
      asset_count: t.asset_count,
      size_bytes: t.size_bytes,
      reason: "Top-level H: folder not claimed by any LivingWorkspace root",
    }));
}

function buildDuplicateWorkspaces(): DuplicateWorkspaceCandidate[] {
  const workspaces = listWorkspaces();
  const candidates: DuplicateWorkspaceCandidate[] = [];

  for (let i = 0; i < workspaces.length; i++) {
    for (let j = i + 1; j < workspaces.length; j++) {
      const a = workspaces[i];
      const b = workspaces[j];
      const overlaps: string[] = [];
      for (const ra of a.filesystem_roots) {
        for (const rb of b.filesystem_roots) {
          const na = path.normalize(ra).toLowerCase();
          const nb = path.normalize(rb).toLowerCase();
          if (na === nb || na.startsWith(nb + path.sep) || nb.startsWith(na + path.sep)) {
            overlaps.push(`${ra} ↔ ${rb}`);
          }
        }
      }
      if (overlaps.length > 0) {
        candidates.push({
          workspace_ids: [a.workspace_id, b.workspace_id],
          overlapping_paths: overlaps,
          reason: "Overlapping or nested workspace roots — consolidate in filing plan (LB-OS-021)",
        });
      }
    }
  }
  return candidates;
}

function buildCMisplaced(): CMisplacedWorkCandidate[] {
  const audit = runPlacementAudit();
  return audit.candidates
    .filter((c) => c.drive === "C")
    .map((c) => ({
      path: c.path,
      classification: c.classification,
      risk: c.risk,
      reason: c.reason,
    }))
    .slice(0, 40);
}

function computeConfidence(
  topLevel: TopLevelDirectoryEntry[],
  assets: AssetRow[],
  pathsScanned: number,
): { score: number; label: MappingConfidenceLabel } {
  const total = topLevel.length || 1;
  const claimed = topLevel.filter((t) => t.workspace_claimed).length;
  const claimedRatio = claimed / total;
  const indexRatio = Math.min(1, assets.length / Math.max(pathsScanned, 1));
  const score = Math.round(40 + claimedRatio * 35 + indexRatio * 25);
  const label: MappingConfidenceLabel = score >= 75 ? "high" : score >= 50 ? "medium" : "low";
  return { score: Math.min(100, score), label };
}

function buildRecommendations(input: {
  confidence: number;
  unclaimed: UnclaimedFolderCandidate[];
  stale: StaleFolderCandidate[];
  duplicates: DuplicateWorkspaceCandidate[];
  cMisplaced: CMisplacedWorkCandidate[];
}): string[] {
  const recs: string[] = ["Map first. Move later. — no execution until approval checklist (LB-OS-018)"];

  if (input.unclaimed.length > 0) {
    recs.push(
      `Assign ${input.unclaimed.length} unclaimed top-level H: folder(s) to LivingWorkspaces before filing (LB-OS-021)`,
    );
  }
  if (input.stale.length > 0) {
    recs.push(`Review ${input.stale.length} stale/dormant folder candidate(s) for archive strategy — dry-run only`);
  }
  if (input.duplicates.length > 0) {
    recs.push("Resolve overlapping workspace roots before reorganization assistant (LB-OS-024)");
  }
  if (input.cMisplaced.length > 0) {
    recs.push(
      `${input.cMisplaced.length} C: misplaced work-data candidate(s) from index — relocate plans only, no C: bulk scan`,
    );
  }
  if (input.confidence < 60) {
    recs.push("Run Knowledge Explorer background index to improve mapping confidence");
  }
  recs.push("Next: LB-OS-020 duplicate/version cleanup planner (dry-run reports)");
  return recs;
}

export function buildFilesystemMappingAudit(scan: ScanResult, runId: string): FilesystemMappingAudit {
  const assets = loadHAssets();
  const top_level_inventory = buildTopLevelInventory(assets);
  const folder_stats = buildFolderStats(assets);
  const stale_candidates = buildStaleCandidates(folder_stats);
  const unclaimed_folders = buildUnclaimed(top_level_inventory);
  const duplicate_workspace_candidates = buildDuplicateWorkspaces();
  const c_misplaced_candidates = buildCMisplaced();
  const { score, label } = computeConfidence(top_level_inventory, assets, scan.paths_scanned);

  return {
    slice_id: "LB-OS-019",
    read_only: true,
    principle: "Map first. Move later.",
    guardrails: GUARDRAILS,
    scanned_roots: scan.scanned_roots,
    paths_scanned: scan.paths_scanned,
    h_drive_map: scan.nodes,
    top_level_inventory,
    workspace_coverage: buildWorkspaceCoverage(assets),
    folder_stats,
    stale_candidates,
    unclaimed_folders,
    duplicate_workspace_candidates,
    c_misplaced_candidates,
    mapping_confidence: score,
    mapping_confidence_label: label,
    recommendations: buildRecommendations({
      confidence: score,
      unclaimed: unclaimed_folders,
      stale: stale_candidates,
      duplicates: duplicate_workspace_candidates,
      cMisplaced: c_misplaced_candidates,
    }),
    inventory_complete: true,
    observed_at: new Date().toISOString(),
    run_id: runId,
  };
}
