import type {
  AssetIntelligenceForPath,
  AssetIntelligenceSummary,
  CleanupRecommendation,
  DuplicateCandidateGroup,
  WorkspaceStorageSummary,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import type { DigitalAssetRow } from "./assetRegistry.js";
import { computeHealthScore, computeHealthSignals, isLargeAsset, LARGE_BYTES } from "./assetHealth.js";
import {
  COLLECTION_DEFS,
  getCollectionIdsForAsset,
  listPopulatedCollections,
  refreshCollectionMembers,
  seedIntelligenceCollections,
} from "./collectionsEngine.js";

function allAssets(): DigitalAssetRow[] {
  return getDatabase().prepare("SELECT * FROM digital_assets").all() as DigitalAssetRow[];
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

/** Detect duplicate candidates by name + size — candidates only, no dedupe actions. */
export function detectDuplicateCandidates(assets?: DigitalAssetRow[]): DuplicateCandidateGroup[] {
  const rows =
    assets ?? allAssets().filter((a) => a.is_directory === 0 && a.size_bytes !== null);

  const buckets = new Map<string, DigitalAssetRow[]>();
  for (const row of rows) {
    const key = `${row.name.toLowerCase()}::${row.size_bytes}`;
    const list = buckets.get(key) ?? [];
    list.push(row);
    buckets.set(key, list);
  }

  const groups: DuplicateCandidateGroup[] = [];
  for (const [, members] of buckets) {
    if (members.length < 2) continue;
    const groupId = `dup-${members[0].name.toLowerCase()}-${members[0].size_bytes}`;
    groups.push({
      group_id: groupId,
      match_reason: "Same filename and size in registry",
      candidate_only: true,
      assets: members.map((m) => ({
        asset_id: m.asset_id,
        path: m.path,
        name: m.name,
        size_bytes: m.size_bytes,
      })),
    });
  }

  return groups.sort((a, b) => b.assets.length - a.assets.length);
}

function persistDuplicateGroups(groups: DuplicateCandidateGroup[]): void {
  const db = getDatabase();
  db.prepare("UPDATE digital_assets SET duplicate_group_id = NULL").run();
  const update = db.prepare(
    "UPDATE digital_assets SET duplicate_group_id = ? WHERE asset_id = ?",
  );
  for (const group of groups) {
    for (const asset of group.assets) {
      update.run(group.group_id, asset.asset_id);
    }
  }
}

function persistHealthScores(assets: DigitalAssetRow[]): void {
  const update = getDatabase().prepare(
    "UPDATE digital_assets SET health_score = ? WHERE asset_id = ?",
  );
  for (const row of assets) {
    const score = computeHealthScore(row);
    update.run(score, row.asset_id);
  }
}

/** Full intelligence refresh — registry metadata only, no filesystem writes. */
export function refreshIntelligence(): {
  assets_analyzed: number;
  duplicate_groups: number;
  collections_refreshed: number;
} {
  seedIntelligenceCollections();
  const assets = allAssets();
  persistHealthScores(assets);
  const dupGroups = detectDuplicateCandidates(assets);
  persistDuplicateGroups(dupGroups);
  refreshCollectionMembers(assets);
  return {
    assets_analyzed: assets.length,
    duplicate_groups: dupGroups.length,
    collections_refreshed: COLLECTION_DEFS.length,
  };
}

export function getDuplicateCandidatesForAsset(assetId: string): DuplicateCandidateGroup[] {
  const row = getDatabase()
    .prepare("SELECT duplicate_group_id FROM digital_assets WHERE asset_id = ?")
    .get(assetId) as { duplicate_group_id: string | null } | undefined;
  if (!row?.duplicate_group_id) return [];

  const members = getDatabase()
    .prepare("SELECT * FROM digital_assets WHERE duplicate_group_id = ?")
    .all(row.duplicate_group_id) as DigitalAssetRow[];

  if (members.length < 2) return [];
  return [
    {
      group_id: row.duplicate_group_id,
      match_reason: "Same filename and size in registry",
      candidate_only: true,
      assets: members.map((m) => ({
        asset_id: m.asset_id,
        path: m.path,
        name: m.name,
        size_bytes: m.size_bytes,
      })),
    },
  ];
}

export function getWorkspaceStorageSummaries(): WorkspaceStorageSummary[] {
  const db = getDatabase();
  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);
  const summaries: WorkspaceStorageSummary[] = [];

  for (const ws of workspaces) {
    const rows = db
      .prepare("SELECT * FROM digital_assets WHERE workspace_id = ?")
      .all(ws.workspace_id) as DigitalAssetRow[];

    const files = rows.filter((r) => r.is_directory === 0);
    const dormant = files.filter(
      (r) => r.lifecycle_stage === "dormant" || r.lifecycle_stage === "archive_candidate",
    );

    summaries.push({
      workspace_id: ws.workspace_id,
      title: ws.title,
      asset_count: rows.length,
      file_count: files.length,
      bytes_total: files.reduce((s, r) => s + (r.size_bytes ?? 0), 0),
      dormant_count: dormant.length,
      dormant_bytes: dormant.reduce((s, r) => s + (r.size_bytes ?? 0), 0),
    });
  }

  return summaries.sort((a, b) => b.bytes_total - a.bytes_total);
}

export function getCleanupRecommendations(): CleanupRecommendation[] {
  const db = getDatabase();
  const recs: CleanupRecommendation[] = [];

  const dormant = db
    .prepare(
      `SELECT COUNT(*) AS c, COALESCE(SUM(size_bytes), 0) AS bytes FROM digital_assets
       WHERE lifecycle_stage = 'dormant' AND is_directory = 0`,
    )
    .get() as { c: number; bytes: number };

  if (dormant.c > 0) {
    recs.push({
      id: "rec-dormant-assets",
      title: "Dormant assets",
      message: `${dormant.c.toLocaleString()} dormant assets · ${formatBytes(dormant.bytes)} — review before any archive.`,
      risk: dormant.bytes > 1024 * 1024 * 1024 ? "medium" : "low",
      recommend_only: true,
      why: [
        "Lifecycle stage dormant from Digital Asset Registry",
        "Recommendation only — no files moved or deleted in LB-OS-007",
      ],
      asset_count: dormant.c,
      bytes_estimate: dormant.bytes,
    });
  }

  const archive = db
    .prepare(
      `SELECT COUNT(*) AS c, COALESCE(SUM(size_bytes), 0) AS bytes FROM digital_assets
       WHERE lifecycle_stage = 'archive_candidate' AND is_directory = 0`,
    )
    .get() as { c: number; bytes: number };

  if (archive.c > 0) {
    recs.push({
      id: "rec-archive-candidates",
      title: "Archive candidates",
      message: `${archive.c.toLocaleString()} assets flagged archive_candidate · ${formatBytes(archive.bytes)}.`,
      risk: "medium",
      recommend_only: true,
      why: [
        "Directories stale 90+ days or assets matching archive heuristics",
        "Suggest review — approval-gated archive comes in LB-OS-010+",
      ],
      asset_count: archive.c,
      bytes_estimate: archive.bytes,
    });
  }

  const dupGroups = detectDuplicateCandidates();
  if (dupGroups.length > 0) {
    const totalDupAssets = dupGroups.reduce((s, g) => s + g.assets.length, 0);
    recs.push({
      id: "rec-duplicate-candidates",
      title: "Duplicate candidates",
      message: `${dupGroups.length} duplicate groups · ${totalDupAssets} assets with matching name + size.`,
      risk: "low",
      recommend_only: true,
      why: [
        "Matched by filename and size in registry — candidates only",
        "No dedupe or delete actions available in this slice",
      ],
      asset_count: totalDupAssets,
      paths_sample: dupGroups[0]?.assets.slice(0, 3).map((a) => a.path),
    });
  }

  const large = db
    .prepare(
      `SELECT COUNT(*) AS c, COALESCE(SUM(size_bytes), 0) AS bytes FROM digital_assets
       WHERE is_directory = 0 AND size_bytes >= ?`,
    )
    .get(LARGE_BYTES) as { c: number; bytes: number };

  if (large.c > 0) {
    recs.push({
      id: "rec-large-assets",
      title: "Large asset groups",
      message: `${large.c.toLocaleString()} files ≥ 10 MB · ${formatBytes(large.bytes)} total.`,
      risk: "low",
      recommend_only: true,
      why: [
        "Size threshold from registry metadata",
        "Use Understand mode to inspect individual assets",
      ],
      asset_count: large.c,
      bytes_estimate: large.bytes,
    });
  }

  for (const ws of getWorkspaceStorageSummaries()) {
    if (ws.dormant_count === 0) continue;
    recs.push({
      id: `rec-ws-dormant-${ws.workspace_id}`,
      title: `${ws.title} storage`,
      message: `${ws.dormant_count} dormant files · ${formatBytes(ws.dormant_bytes)} in ${ws.title}.`,
      risk: ws.dormant_bytes > 500 * 1024 * 1024 ? "medium" : "low",
      recommend_only: true,
      why: [
        `Workspace ${ws.workspace_id} storage summary from registry`,
        `${ws.file_count} indexed files · ${formatBytes(ws.bytes_total)} total`,
      ],
      workspace_id: ws.workspace_id,
      asset_count: ws.dormant_count,
      bytes_estimate: ws.dormant_bytes,
    });
  }

  return recs;
}

export function getIntelligenceSummary(): AssetIntelligenceSummary {
  const db = getDatabase();
  const total = (db.prepare("SELECT COUNT(*) AS c FROM digital_assets").get() as { c: number }).c;

  const dormant = db
    .prepare(
      `SELECT COUNT(*) AS c, COALESCE(SUM(size_bytes), 0) AS bytes FROM digital_assets
       WHERE lifecycle_stage = 'dormant' AND is_directory = 0`,
    )
    .get() as { c: number; bytes: number };

  const archive = db
    .prepare(
      `SELECT COUNT(*) AS c, COALESCE(SUM(size_bytes), 0) AS bytes FROM digital_assets
       WHERE lifecycle_stage = 'archive_candidate' AND is_directory = 0`,
    )
    .get() as { c: number; bytes: number };

  const large = db
    .prepare(
      `SELECT COUNT(*) AS c, COALESCE(SUM(size_bytes), 0) AS bytes FROM digital_assets
       WHERE is_directory = 0 AND size_bytes >= ?`,
    )
    .get(LARGE_BYTES) as { c: number; bytes: number };

  return {
    total_assets: total,
    dormant: { count: dormant.c, bytes: dormant.bytes },
    archive_candidates: { count: archive.c, bytes: archive.bytes },
    duplicate_groups: detectDuplicateCandidates().length,
    large_assets: { count: large.c, bytes: large.bytes },
    by_workspace: getWorkspaceStorageSummaries(),
    collections: listPopulatedCollections(),
  };
}

export function getAssetIntelligenceForPath(pathStr: string): AssetIntelligenceForPath | null {
  const row = getDatabase()
    .prepare("SELECT * FROM digital_assets WHERE path = ?")
    .get(pathStr) as DigitalAssetRow | undefined;
  if (!row) return null;

  const signals = computeHealthSignals(row);
  const health_score = computeHealthScore(row, signals);
  const collectionIds = getCollectionIdsForAsset(row.asset_id);
  const allCols = listPopulatedCollections();
  const related_collections = allCols.filter((c) => collectionIds.includes(c.collection_id));

  const recommendations: CleanupRecommendation[] = [];

  if (row.duplicate_group_id) {
    recommendations.push({
      id: `rec-dup-${row.asset_id}`,
      title: "Duplicate candidate",
      message: `"${row.name}" matches other registry assets by name and size.`,
      risk: "low",
      recommend_only: true,
      why: [
        "Duplicate group assigned during intelligence analysis",
        "Candidate only — no merge or delete in LB-OS-007",
      ],
      paths_sample: getDuplicateCandidatesForAsset(row.asset_id)[0]?.assets.map((a) => a.path),
    });
  }

  if (row.lifecycle_stage === "dormant" || row.lifecycle_stage === "archive_candidate") {
    recommendations.push({
      id: `rec-stale-${row.asset_id}`,
      title: "Stale / dormant asset",
      message: `Lifecycle ${row.lifecycle_stage} — consider archive review when ready.`,
      risk: row.lifecycle_stage === "archive_candidate" ? "medium" : "low",
      recommend_only: true,
      why: [
        `Modified ${row.modified_at ?? "unknown"}`,
        "Archive requires approval in LB-OS-010+",
      ],
    });
  }

  if (isLargeAsset(row)) {
    recommendations.push({
      id: `rec-large-${row.asset_id}`,
      title: "Large asset",
      message: `${formatBytes(row.size_bytes ?? 0)} — among largest indexed files.`,
      risk: "low",
      recommend_only: true,
      why: ["Size from registry fingerprint", "No file operations triggered"],
    });
  }

  return {
    health_signals: signals,
    health_score,
    duplicate_candidates: getDuplicateCandidatesForAsset(row.asset_id),
    related_collections,
    recommendations,
  };
}
