import { randomUUID } from "node:crypto";
import path from "node:path";
import type {
  DigitalLandSurveyReport,
  FilesystemMappingAudit,
  LandSurveyConfidenceLabel,
  LivingWorkspace,
  WorkspaceBlueprint,
} from "@localbrain/shared";
import {
  STANDARD_WORKSPACE_LOCATION_ROLES,
  PRIMARY_LOCATION_LABEL,
} from "@localbrain/shared";
import type { DiskVolumeHealth } from "@localbrain/shared";
import { getDatabase } from "../../db/database.js";
import { buildWorkspaceDNA } from "../workspaceArchitecture/blueprintEngine.js";

const GUARDRAILS = [
  "Read-only survey",
  "Map the estate — do not change the estate",
  "No mkdir · moves · deletes · cleanup execution",
  "No StorageProvider runtime",
  "No cloud sync",
  "Metadata-only index reads",
];

const MEDIA_KINDS = new Set(["photo", "video", "podcast"]);
const ACTIVE_DAYS = 30;

type MediaRow = {
  path: string;
  size_bytes: number | null;
  workspace_id: string | null;
  kind: string;
  modified_at: string | null;
};

function confidenceLabel(percent: number): LandSurveyConfidenceLabel {
  if (percent >= 90) return "excellent";
  if (percent >= 75) return "high";
  if (percent >= 50) return "medium";
  return "low";
}

function headroomLabel(usedPercent: number | null): "critical" | "low" | "comfortable" | "unknown" {
  if (usedPercent === null) return "unknown";
  if (usedPercent >= 90) return "critical";
  if (usedPercent >= 75) return "low";
  return "comfortable";
}

function loadIndexedAssetsByDrive(drive: "C" | "H") {
  const prefix = drive === "C" ? "C:%" : "H:%";
  return getDatabase()
    .prepare(
      `SELECT path, size_bytes, workspace_id, kind, modified_at, is_directory
       FROM digital_assets
       WHERE path LIKE ?`,
    )
    .all(prefix) as {
    path: string;
    size_bytes: number | null;
    workspace_id: string | null;
    kind: string;
    modified_at: string | null;
    is_directory: number;
  }[];
}

function buildStorageTopology(
  disks: DiskVolumeHealth[],
  audit: FilesystemMappingAudit | null,
): DigitalLandSurveyReport["storage_topology"] {
  const volumes = disks.map((d) => {
    const isH = d.label.toUpperCase().startsWith("H");
    return {
      label: d.label,
      mount: d.mount,
      provider_id: isH ? "primary" : d.label === "C:" ? "c_system" : d.label.toLowerCase().replace(":", ""),
      role: isH ? ("primary" as const) : ("system" as const),
      health: d.available ? ("healthy" as const) : ("offline" as const),
      available: d.available,
    };
  });

  const scanned = audit?.scanned_roots ?? [];
  const hTop = audit?.top_level_inventory.length ?? 0;

  return {
    volumes,
    scanned_roots: scanned,
    h_top_level_count: hTop,
    summary: `${volumes.filter((v) => v.available).length} volume(s) online · ${hTop} H: top-level namespace(s) · ${scanned.length} scanned root(s)`,
  };
}

function buildDriveUtilization(
  disks: DiskVolumeHealth[],
  audit: FilesystemMappingAudit | null,
): DigitalLandSurveyReport["drive_utilization"] {
  return disks.map((d) => {
    const letter = d.label.charAt(0).toUpperCase();
    const driveKey = letter === "C" || letter === "H" ? letter : "OTHER";
    const assets =
      driveKey === "C" || driveKey === "H"
        ? loadIndexedAssetsByDrive(driveKey)
        : [];
    const indexed_bytes = assets.reduce((sum, a) => sum + (a.size_bytes ?? 0), 0);

    return {
      drive: d.label,
      label: d.label.replace(":", ""),
      used_percent: d.used_percent,
      total_bytes: d.total_bytes,
      free_bytes: d.free_bytes,
      indexed_asset_count: assets.length,
      indexed_bytes,
      headroom_label: headroomLabel(d.used_percent),
    };
  });
}

function resolveWorkspaceForPath(
  folderPath: string,
  workspaces: LivingWorkspace[],
): { id: string | null; title: string | null } {
  const normalized = path.normalize(folderPath).toLowerCase();
  for (const ws of workspaces) {
    for (const root of ws.filesystem_roots) {
      const rootNorm = path.normalize(root).toLowerCase();
      if (normalized === rootNorm || normalized.startsWith(rootNorm + path.sep)) {
        return { id: ws.workspace_id, title: ws.title };
      }
      if (rootNorm.startsWith(normalized + path.sep)) {
        return { id: ws.workspace_id, title: ws.title };
      }
    }
  }
  return { id: null, title: null };
}

function buildFolderOwnership(
  audit: FilesystemMappingAudit | null,
  workspaces: LivingWorkspace[],
): DigitalLandSurveyReport["folder_ownership"] {
  if (!audit) return [];

  const entries = [
    ...audit.top_level_inventory.map((t) => ({
      path: t.path,
      asset_count: t.asset_count,
      size_bytes: t.size_bytes,
      workspace_id: t.claiming_workspace_id,
      claimed: t.workspace_claimed,
    })),
    ...audit.folder_stats.slice(0, 25).map((f) => {
      const claim = resolveWorkspaceForPath(f.folder_path, workspaces);
      return {
        path: f.folder_path,
        asset_count: f.asset_count,
        size_bytes: f.size_bytes,
        workspace_id: claim.id,
        claimed: claim.id !== null,
      };
    }),
  ];

  const seen = new Set<string>();
  return entries
    .filter((e) => {
      const key = e.path.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((e) => {
      const ws = e.workspace_id
        ? workspaces.find((w) => w.workspace_id === e.workspace_id)
        : null;
      const percent = e.claimed ? (e.asset_count > 0 ? 88 : 65) : 25;
      return {
        path: e.path,
        workspace_id: e.workspace_id,
        workspace_title: ws?.title ?? null,
        confidence_percent: percent,
        confidence_label: confidenceLabel(percent),
        asset_count: e.asset_count,
        size_bytes: e.size_bytes,
        reason: e.claimed
          ? "Folder claimed by Living Workspace projection"
          : "No workspace root claims this folder",
      };
    })
    .sort((a, b) => b.size_bytes - a.size_bytes)
    .slice(0, 40);
}

function buildWorkspaceCoverage(
  audit: FilesystemMappingAudit | null,
  blueprints: WorkspaceBlueprint[],
): DigitalLandSurveyReport["workspace_coverage"] {
  const blueprintMap = new Map(blueprints.map((b) => [b.workspace_id, b]));

  if (!audit) {
    return blueprints.map((b) => ({
      workspace_id: b.workspace_id,
      title: b.title,
      roots_registered: b.current_projections.length,
      indexed_asset_count: 0,
      indexed_bytes: 0,
      blueprint_confidence_percent: b.confidence_percent,
      coverage_note: "Run LB-OS-019 audit for indexed coverage",
    }));
  }

  return audit.workspace_coverage.map((c) => {
    const bp = blueprintMap.get(c.workspace_id);
    return {
      workspace_id: c.workspace_id,
      title: c.title,
      roots_registered: c.roots.length,
      indexed_asset_count: c.indexed_asset_count,
      indexed_bytes: c.indexed_bytes,
      blueprint_confidence_percent: bp?.confidence_percent ?? null,
      coverage_note: c.coverage_note,
    };
  });
}

function buildOrphanedData(
  audit: FilesystemMappingAudit | null,
  workspaces: LivingWorkspace[],
): DigitalLandSurveyReport["orphaned_data"] {
  const unclaimed =
    audit?.unclaimed_folders.map((u) => ({
      path: u.path,
      asset_count: u.asset_count,
      size_bytes: u.size_bytes,
      reason: u.reason,
    })) ?? [];

  const orphan_workspaces = workspaces
    .filter((ws) => !ws.flags.hidden && ws.filesystem_roots.length === 0 && ws.status !== "archived")
    .map((ws) => ({
      workspace_id: ws.workspace_id,
      title: ws.title,
      summary: `Living Workspace has no filesystem projection (Location: ${PRIMARY_LOCATION_LABEL} unbound)`,
    }));

  const c_drive_misplaced =
    audit?.c_misplaced_candidates.map((c) => ({
      path: c.path,
      classification: c.classification,
      risk: c.risk,
      reason: c.reason,
    })) ?? [];

  const total_orphan_bytes =
    unclaimed.reduce((s, u) => s + u.size_bytes, 0) +
    c_drive_misplaced.reduce((s, _c) => s + 0, 0);

  return { unclaimed_folders: unclaimed, orphan_workspaces, c_drive_misplaced, total_orphan_bytes };
}

function buildDuplicateRegions(
  audit: FilesystemMappingAudit | null,
): DigitalLandSurveyReport["duplicate_storage_regions"] {
  if (!audit) return [];
  return audit.duplicate_workspace_candidates.map((d) => ({
    region_id: randomUUID(),
    workspace_ids: d.workspace_ids,
    overlapping_paths: d.overlapping_paths,
    reason: d.reason,
  }));
}

function buildEmptyFolderChains(
  audit: FilesystemMappingAudit | null,
): DigitalLandSurveyReport["empty_folder_chains"] {
  if (!audit) return [];

  const chains: DigitalLandSurveyReport["empty_folder_chains"] = [];

  for (const t of audit.top_level_inventory) {
    if (t.asset_count === 0) {
      chains.push({
        path: t.path,
        chain_depth: 1,
        parent_path: "H:\\",
        workspace_id: t.claiming_workspace_id,
        summary: "Empty top-level H: namespace — expansion capacity",
      });
    }
  }

  for (const f of audit.folder_stats) {
    if (f.file_count === 0 && f.directory_count > 0 && f.asset_count <= f.directory_count) {
      chains.push({
        path: f.folder_path,
        chain_depth: f.folder_path.split(path.sep).length,
        parent_path: path.dirname(f.folder_path),
        workspace_id: null,
        summary: "Folder chain with subdirectories but no indexed files",
      });
    }
  }

  return chains.slice(0, 30);
}

function buildOversizedMedia(
  workspaces: LivingWorkspace[],
): DigitalLandSurveyReport["oversized_media_collections"] {
  const rows = getDatabase()
    .prepare(
      `SELECT path, size_bytes, workspace_id, kind
       FROM digital_assets
       WHERE is_directory = 0 AND (path LIKE 'H:%' OR path LIKE 'H:/%')`,
    )
    .all() as MediaRow[];

  const folderMap = new Map<
    string,
    {
      folder_path: string;
      media_count: number;
      total_bytes: number;
      kinds: Map<string, number>;
      workspace_id: string | null;
    }
  >();

  for (const row of rows) {
    if (!MEDIA_KINDS.has(row.kind)) continue;
    const folder_path = path.dirname(path.normalize(row.path));
    const key = folder_path.toLowerCase();
    const entry = folderMap.get(key) ?? {
      folder_path,
      media_count: 0,
      total_bytes: 0,
      kinds: new Map<string, number>(),
      workspace_id: row.workspace_id,
    };
    entry.media_count += 1;
    entry.total_bytes += row.size_bytes ?? 0;
    entry.kinds.set(row.kind, (entry.kinds.get(row.kind) ?? 0) + 1);
    if (!entry.workspace_id && row.workspace_id) entry.workspace_id = row.workspace_id;
    folderMap.set(key, entry);
  }

  return [...folderMap.values()]
    .map((stats) => {
      const dominant = [...stats.kinds.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "media";
      const claim = resolveWorkspaceForPath(stats.folder_path, workspaces);
      return {
        folder_path: stats.folder_path,
        media_file_count: stats.media_count,
        total_bytes: stats.total_bytes,
        dominant_kind: dominant,
        workspace_id: claim.id ?? stats.workspace_id,
        summary: `${stats.media_count} media file(s) · ${dominant} dominant`,
      };
    })
    .filter((m) => m.media_file_count >= 3)
    .sort((a, b) => b.total_bytes - a.total_bytes)
    .slice(0, 20);
}

function buildArchiveCandidates(
  audit: FilesystemMappingAudit | null,
  workspaces: LivingWorkspace[],
): DigitalLandSurveyReport["archive_candidates"] {
  if (!audit) return [];
  return audit.stale_candidates.map((s) => {
    const claim = resolveWorkspaceForPath(s.folder_path, workspaces);
    return {
      folder_path: s.folder_path,
      days_since_activity: s.days_since_activity,
      size_bytes: s.size_bytes,
      asset_count: s.asset_count,
      reason: s.reason,
      workspace_id: claim.id,
    };
  });
}

function buildActivitySignals(
  audit: FilesystemMappingAudit | null,
): DigitalLandSurveyReport["activity_signals"] {
  if (!audit) {
    return {
      active_folders_30d: 0,
      stale_folders_90d: 0,
      recently_modified_top_level: [],
      dormant_top_level: [],
      trend_label: "unknown",
      summary: "Run LB-OS-019 audit for activity signals",
    };
  }

  const cutoffActive = Date.now() - ACTIVE_DAYS * 24 * 60 * 60 * 1000;
  let active = 0;
  let stale = audit.stale_candidates.length;

  for (const f of audit.folder_stats) {
    if (f.last_modified_at && new Date(f.last_modified_at).getTime() >= cutoffActive) {
      active += 1;
    }
  }

  const recently_modified_top_level = audit.top_level_inventory
    .filter((t) => t.last_modified_at)
    .sort((a, b) => (b.last_modified_at ?? "").localeCompare(a.last_modified_at ?? ""))
    .slice(0, 5)
    .map((t) => t.path);

  const dormant_top_level = audit.top_level_inventory
    .filter((t) => t.asset_count > 0 && (!t.last_modified_at || stale > 0))
    .slice(0, 5)
    .map((t) => t.path);

  let trend_label: "growing" | "stable" | "dormant" | "unknown" = "stable";
  if (active > stale * 2) trend_label = "growing";
  else if (stale > active * 2) trend_label = "dormant";

  return {
    active_folders_30d: active,
    stale_folders_90d: stale,
    recently_modified_top_level,
    dormant_top_level,
    trend_label,
    summary: `${active} active folder(s) in 30d · ${stale} stale candidate(s) · trend: ${trend_label}`,
  };
}

function buildMigrationComplexity(
  blueprints: WorkspaceBlueprint[],
): DigitalLandSurveyReport["migration_complexity"] {
  const workspace_scores = blueprints.map((b) => {
    const impact = b.migration_impact;
    const complexity_score = Math.min(
      100,
      Math.round(
        (100 - b.confidence_percent) * 0.5 +
          impact.folder_count * 0.3 +
          impact.file_count * 0.01 +
          impact.broken_workspace_refs * 15,
      ),
    );
    const label =
      complexity_score >= 75 ? "critical" : complexity_score >= 50 ? "high" : complexity_score >= 25 ? "moderate" : "low";
    return {
      workspace_id: b.workspace_id,
      title: b.title,
      complexity_score,
      complexity_label: label,
      folder_count: impact.folder_count,
      file_count: impact.file_count,
      blueprint_confidence_percent: b.confidence_percent,
    };
  });

  const overall =
    workspace_scores.length > 0
      ? Math.round(workspace_scores.reduce((s, w) => s + w.complexity_score, 0) / workspace_scores.length)
      : 0;

  const overall_label =
    overall >= 75 ? "critical" : overall >= 50 ? "high" : overall >= 25 ? "moderate" : "low";

  return {
    overall_score: overall,
    overall_label,
    workspace_scores: workspace_scores.sort((a, b) => b.complexity_score - a.complexity_score),
    summary: `Overall migration complexity: ${overall}/100 (${overall_label}) across ${workspace_scores.length} workspace(s)`,
  };
}

function buildProjectionCoverage(
  workspaces: LivingWorkspace[],
): DigitalLandSurveyReport["projection_coverage"] {
  return workspaces
    .filter((ws) => !ws.flags.hidden)
    .map((ws) => {
      const dna = buildWorkspaceDNA(ws);
      const boundRoles = new Set(dna.projections.map((p) => p.location_role));
      const missing = STANDARD_WORKSPACE_LOCATION_ROLES.filter((r) => !boundRoles.has(r));

      const boundCount = STANDARD_WORKSPACE_LOCATION_ROLES.length - missing.length;
      const coverage_percent = Math.round((boundCount / STANDARD_WORKSPACE_LOCATION_ROLES.length) * 100);

      return {
        workspace_id: ws.workspace_id,
        title: ws.title,
        bound_locations: dna.projections.map((p) => ({
          location_id: p.location_id,
          location_label: p.location_label,
          location_role: p.location_role,
          physical_ref: p.physical_ref,
          status: p.status,
        })),
        missing_location_roles: missing,
        coverage_percent,
      };
    });
}

function buildRecommendations(report: Partial<DigitalLandSurveyReport>): string[] {
  const recs = ["Map the estate. Do not change the estate. — survey only until LB-OS-023 simulation"];

  if ((report.orphaned_data?.unclaimed_folders.length ?? 0) > 0) {
    recs.push("Assign unclaimed H: folders to Living Workspaces before migration simulation");
  }
  if ((report.duplicate_storage_regions?.length ?? 0) > 0) {
    recs.push("Resolve duplicate storage regions before proposal builder (024)");
  }
  if ((report.migration_complexity?.overall_label ?? "low") === "high" ||
      (report.migration_complexity?.overall_label ?? "low") === "critical") {
    recs.push("High migration complexity — run LB-OS-023 dry-run before any cutover planning");
  }
  if ((report.projection_coverage ?? []).some((p) => p.coverage_percent < 20)) {
    recs.push("Low projection coverage — bind Primary Development locations via workspace architecture blueprints");
  }
  recs.push("Next: LB-OS-023 Migration Simulation (projection translation dry-run)");
  return recs;
}

export function buildDigitalLandSurvey(input: {
  disks: DiskVolumeHealth[];
  audit: FilesystemMappingAudit | null;
  workspaces: LivingWorkspace[];
  blueprints: WorkspaceBlueprint[];
}): DigitalLandSurveyReport {
  const { disks, audit, workspaces, blueprints } = input;
  const observed_at = new Date().toISOString();

  const storage_topology = buildStorageTopology(disks, audit);
  const drive_utilization = buildDriveUtilization(disks, audit);
  const folder_ownership = buildFolderOwnership(audit, workspaces);
  const workspace_coverage = buildWorkspaceCoverage(audit, blueprints);
  const orphaned_data = buildOrphanedData(audit, workspaces);
  const duplicate_storage_regions = buildDuplicateRegions(audit);
  const empty_folder_chains = buildEmptyFolderChains(audit);
  const oversized_media_collections = buildOversizedMedia(workspaces);
  const archive_candidates = buildArchiveCandidates(audit, workspaces);
  const activity_signals = buildActivitySignals(audit);
  const migration_complexity = buildMigrationComplexity(blueprints);
  const projection_coverage = buildProjectionCoverage(workspaces);

  const partial = {
    orphaned_data,
    duplicate_storage_regions,
    migration_complexity,
    projection_coverage,
  };

  return {
    slice_id: "LB-OS-022",
    engine_id: "ENG-DLS-001",
    read_only: true,
    core_rule: "Map the estate. Do not change the estate.",
    guardrails: GUARDRAILS,
    audit_run_id: audit?.run_id ?? null,
    mapping_confidence_percent: audit?.mapping_confidence ?? 0,
    mapping_confidence_label: audit?.mapping_confidence_label ?? "low",
    storage_topology,
    drive_utilization,
    folder_ownership,
    workspace_coverage,
    orphaned_data,
    duplicate_storage_regions,
    empty_folder_chains,
    oversized_media_collections,
    archive_candidates,
    activity_signals,
    migration_complexity,
    projection_coverage,
    recommendations: buildRecommendations(partial),
    observed_at,
  };
}
