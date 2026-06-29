import type { AssetHealthSignals, AssetLifecycleStage } from "@localbrain/shared";
import type { DigitalAssetRow } from "./assetRegistry.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";

const ACTIVE_DAYS = 7;
const STALE_DAYS = 90;

export function computeHealthSignals(row: DigitalAssetRow): AssetHealthSignals {
  const mtime = row.modified_at ? new Date(row.modified_at).getTime() : null;
  const ageDays = mtime ? (Date.now() - mtime) / 86400000 : null;

  const ws = row.workspace_id
    ? listWorkspaces().find((w) => w.workspace_id === row.workspace_id)
    : null;

  const lifecycle = row.lifecycle_stage as AssetLifecycleStage;

  return {
    fresh: ageDays !== null && ageDays <= ACTIVE_DAYS,
    referenced_recently: lifecycle === "active" || lifecycle === "referenced",
    active_workspace: Boolean(ws?.current_focus && row.workspace_id),
    has_backup: false,
    no_duplicates: !row.duplicate_group_id,
    indexed: true,
    tagged: JSON.parse(row.tags_json || "[]").length > 0,
    understood: Boolean(row.summary && row.summary !== "directory"),
  };
}

export function computeHealthScore(row: DigitalAssetRow, signals?: AssetHealthSignals): number {
  const s = signals ?? computeHealthSignals(row);
  let score = 55;

  if (s.fresh) score += 12;
  if (s.referenced_recently) score += 10;
  if (s.active_workspace) score += 12;
  if (s.no_duplicates) score += 8;
  if (s.indexed) score += 5;
  if (s.tagged) score += 4;
  if (s.understood) score += 4;

  if (!s.no_duplicates) score -= 18;

  switch (row.lifecycle_stage) {
    case "active":
      score += 5;
      break;
    case "dormant":
      score -= 15;
      break;
    case "archive_candidate":
      score -= 20;
      break;
    case "archived":
      score -= 25;
      break;
    default:
      break;
  }

  if (!row.workspace_id) score -= 8;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function isStaleAsset(row: DigitalAssetRow): boolean {
  if (row.lifecycle_stage === "dormant" || row.lifecycle_stage === "archive_candidate") {
    return true;
  }
  if (!row.modified_at) return false;
  const ageDays = (Date.now() - new Date(row.modified_at).getTime()) / 86400000;
  return ageDays >= STALE_DAYS;
}

export const LARGE_BYTES = 10 * 1024 * 1024;

export function isLargeAsset(row: DigitalAssetRow): boolean {
  return row.is_directory === 0 && (row.size_bytes ?? 0) >= LARGE_BYTES;
}
