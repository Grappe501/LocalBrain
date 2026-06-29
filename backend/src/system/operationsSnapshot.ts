import { getDatabase } from "../db/database.js";
import { getRegistryStats } from "../digitalAssets/assetRegistry.js";
import { isIndexing, getLatestIndexRun } from "../knowledgeExplorer/indexer.js";
import type { DiskVolumeHealth, StorageHealthPanel } from "@localbrain/shared";
import { getMachineMetrics } from "./healthMonitor.js";

function indexFreshness(
  latestRun: ReturnType<typeof getLatestIndexRun>,
  indexing: boolean,
): StorageHealthPanel["index_freshness"] {
  if (indexing) return "indexing";
  if (!latestRun?.finished_at) return "unknown";
  const finished = new Date(latestRun.finished_at).getTime();
  const ageHours = (Date.now() - finished) / (1000 * 60 * 60);
  return ageHours > 24 ? "stale" : "fresh";
}

export function getStoragePanel(volumes: DiskVolumeHealth[]): StorageHealthPanel {
  const latest = getLatestIndexRun();
  const indexing = isIndexing();
  const stats = getRegistryStats();

  return {
    volumes,
    registry_asset_count: stats.total_assets,
    index_freshness: indexFreshness(latest, indexing),
    latest_index_at: latest?.finished_at ?? latest?.started_at ?? null,
  };
}

export function getOperationsPanel(): {
  indexing_active: boolean;
  latest_index_status: string | null;
  pending_approvals: number;
  approved_pending_execution: number;
  failed_actions: number;
  backup_count: number;
} {
  const db = getDatabase();

  const pending = (
    db.prepare("SELECT COUNT(*) AS c FROM proposed_actions WHERE status = 'pending'").get() as {
      c: number;
    }
  ).c;

  const approved = (
    db
      .prepare("SELECT COUNT(*) AS c FROM proposed_actions WHERE status = 'approved'")
      .get() as { c: number }
  ).c;

  const failed = (
    db.prepare("SELECT COUNT(*) AS c FROM proposed_actions WHERE status = 'failed'").get() as {
      c: number;
    }
  ).c;

  const backups = (
    db.prepare("SELECT COUNT(*) AS c FROM backup_records").get() as { c: number }
  ).c;

  const latest = getLatestIndexRun();

  return {
    indexing_active: isIndexing(),
    latest_index_status: latest?.status ?? null,
    pending_approvals: pending,
    approved_pending_execution: approved,
    failed_actions: failed,
    backup_count: backups,
  };
}

export function getMachinePanel() {
  return getMachineMetrics();
}
