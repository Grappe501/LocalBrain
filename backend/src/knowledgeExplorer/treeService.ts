import fs from "node:fs";
import path from "node:path";
import type { LivingWorkspace } from "@localbrain/shared";
import { getPermissionEngine } from "../safety/permissionEngine.js";
import { hasIgnoredSegment, matchesSecretName } from "../safety/ignoreRules.js";
import { normalizeAndResolve } from "../safety/pathValidator.js";
import { getAssetByPath } from "../digitalAssets/assetRegistry.js";
import type { DigitalAssetRow } from "../digitalAssets/assetRegistry.js";
import { getIndexedPath } from "./indexer.js";
import { getExplorerRootPaths, resolveWorkspaceForPath } from "./pathWorkspace.js";

export type ExplorerOverlayBadge = {
  kind: "health" | "focus" | "flag" | "activity";
  label: string;
  tone: "good" | "warn" | "muted";
};

export type ExplorerTreeNode = {
  path: string;
  name: string;
  is_directory: boolean;
  size_bytes: number | null;
  mtime: string | null;
  workspace_id: string | null;
  workspace_title: string | null;
  overlay: ExplorerOverlayBadge[];
  asset_id: string | null;
  kind: string | null;
  lifecycle_stage: string | null;
  health_score: number | null;
  in_registry: boolean;
};

function healthLabel(score: number | null): ExplorerOverlayBadge | null {
  if (score === null) return null;
  if (score >= 80) return { kind: "health", label: "Healthy", tone: "good" };
  if (score >= 50) return { kind: "health", label: "Fair", tone: "warn" };
  return { kind: "health", label: "At risk", tone: "warn" };
}

function buildOverlay(
  ws: LivingWorkspace | null,
  mtime: string | null,
  asset: DigitalAssetRow | null,
): ExplorerOverlayBadge[] {
  const badges: ExplorerOverlayBadge[] = [];
  if (asset?.health_score != null) {
    const h = healthLabel(asset.health_score);
    if (h) badges.push(h);
  } else if (ws) {
    const h = healthLabel(ws.health_score);
    if (h) badges.push(h);
  }
  if (asset?.lifecycle_stage) {
    const stage = asset.lifecycle_stage;
    if (stage === "active") badges.push({ kind: "activity", label: "Active", tone: "good" });
    else if (stage === "dormant" || stage === "archive_candidate") {
      badges.push({ kind: "activity", label: stage === "dormant" ? "Dormant" : "Archive candidate", tone: "muted" });
    }
  }
  if (!ws) return badges;
  if (ws.current_focus) {
    badges.push({ kind: "focus", label: "Active focus", tone: "good" });
  }
  if (ws.flags.pinned) badges.push({ kind: "flag", label: "Pinned", tone: "good" });
  if (ws.flags.archived) badges.push({ kind: "flag", label: "Archived", tone: "muted" });
  if (ws.flags.needs_attention) {
    badges.push({ kind: "flag", label: "Needs attention", tone: "warn" });
  }
  if (!asset?.lifecycle_stage && mtime) {
    const ageDays = (Date.now() - new Date(mtime).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 90) badges.push({ kind: "activity", label: "Dormant", tone: "muted" });
    else if (ageDays < 7) badges.push({ kind: "activity", label: "Active", tone: "good" });
  }
  if (ws.health_score !== null && ws.health_score < 50 && !ws.flags.archived) {
    badges.push({ kind: "activity", label: "Archive candidate", tone: "warn" });
  }
  return badges;
}

function canRead(resolved: string): boolean {
  if (hasIgnoredSegment(resolved) || matchesSecretName(resolved)) return false;
  return getPermissionEngine().checkPath({ path: resolved, action: "read" }).allowed;
}

function nodeFromPath(resolved: string, stats: fs.Stats): ExplorerTreeNode {
  const ws = resolveWorkspaceForPath(resolved);
  const asset = getAssetByPath(resolved);
  const cached = getIndexedPath(resolved);
  const mtime = asset?.modified_at ?? cached?.mtime ?? stats.mtime.toISOString();
  return {
    path: resolved,
    name: path.basename(resolved),
    is_directory: stats.isDirectory(),
    size_bytes: asset?.size_bytes ?? (stats.isFile() ? stats.size : cached?.size_bytes ?? null),
    mtime,
    workspace_id: ws?.workspace_id ?? asset?.workspace_id ?? cached?.workspace_id ?? null,
    workspace_title: ws?.title ?? null,
    overlay: buildOverlay(ws, mtime, asset),
    asset_id: asset?.asset_id ?? null,
    kind: asset?.kind ?? null,
    lifecycle_stage: asset?.lifecycle_stage ?? null,
    health_score: asset?.health_score ?? null,
    in_registry: asset !== null,
  };
}

export function listTreeChildren(dirPath?: string): ExplorerTreeNode[] {
  const roots = getExplorerRootPaths();
  if (!dirPath) {
    return roots.filter(canRead).map((r) => nodeFromPath(r, fs.statSync(r)));
  }

  let resolved: string;
  try {
    resolved = normalizeAndResolve(dirPath);
  } catch {
    return [];
  }
  if (!canRead(resolved)) return [];

  const allowed = roots.some((root) => {
    const rel = path.relative(root, resolved);
    return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
  });
  if (!allowed) return [];

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(resolved, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: ExplorerTreeNode[] = [];
  for (const ent of entries) {
    const full = path.join(resolved, ent.name);
    let childResolved: string;
    try {
      childResolved = normalizeAndResolve(full);
    } catch {
      continue;
    }
    if (!canRead(childResolved)) continue;
    try {
      nodes.push(nodeFromPath(childResolved, fs.statSync(childResolved)));
    } catch {
      /* skip */
    }
  }

  return nodes.sort((a, b) => {
    if (a.is_directory !== b.is_directory) return a.is_directory ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
