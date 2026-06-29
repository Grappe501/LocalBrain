import fs from "node:fs";
import path from "node:path";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { getWorkspaceEvents } from "../workspaces/workspaceEvents.js";
import { normalizeAndResolve } from "../safety/pathValidator.js";
import type { AssetHealthSignals, CleanupRecommendation } from "@localbrain/shared";
import { getAssetByPath, getRegistryStats } from "../digitalAssets/assetRegistry.js";
import {
  getAssetIntelligenceForPath,
  getCleanupRecommendations,
  getIntelligenceSummary,
} from "../digitalAssets/intelligenceEngine.js";
import { listPopulatedCollections } from "../digitalAssets/collectionsEngine.js";
import { getIndexedPath, getLatestIndexRun } from "./indexer.js";
import { resolveWorkspaceForPath } from "./pathWorkspace.js";
import { listTreeChildren } from "./treeService.js";

export type ExplainFolderResult = {
  path: string;
  name: string;
  purpose: string;
  workspace: {
    workspace_id: string;
    title: string;
    executive_context: string;
    current_focus: string;
    health_score: number | null;
    success_definition: string;
  } | null;
  important_files: { name: string; path: string; size_bytes: number | null }[];
  recent_activity: { title: string; detail: string; created_at: string }[];
  recommendations: string[];
  duplicate_risks: string[];
  stale_hint: string | null;
  index_status: string;
  asset: {
    asset_id: string;
    kind: string;
    lifecycle_stage: string;
    health_score: number | null;
    hash: string | null;
    size_bytes: number | null;
    created_at: string | null;
    modified_at: string | null;
    workspace_id: string | null;
    in_registry: boolean;
  } | null;
  collections: { collection_id: string; title: string; asset_count: number | null }[];
  intelligence: {
    health_signals: AssetHealthSignals;
    health_score: number;
    duplicate_candidates: {
      group_id: string;
      match_reason: string;
      candidate_only: true;
      assets: { path: string; name: string }[];
    }[];
    recommendations: CleanupRecommendation[];
  } | null;
};

export type ExecutiveInsight = {
  id: string;
  severity: "info" | "warn" | "priority";
  message: string;
  path?: string;
  workspace_id?: string;
  why: string;
  recommend_only?: boolean;
  risk?: "low" | "medium" | "high";
  title?: string;
  asset_count?: number;
  bytes_estimate?: number;
};

export type WhySeeingThisResult = {
  path: string;
  surfaced_because: string[];
  workspace: ExplainFolderResult["workspace"];
  what_changed: string[];
  decision_facing: string | null;
};

function resolvePath(raw: string): string | null {
  try {
    return normalizeAndResolve(raw);
  } catch {
    return null;
  }
}

export function explainFolder(rawPath: string): ExplainFolderResult | null {
  const resolved = resolvePath(rawPath);
  if (!resolved) return null;

  let stats: fs.Stats;
  try {
    stats = fs.statSync(resolved);
  } catch {
    return null;
  }

  const ws = resolveWorkspaceForPath(resolved);
  const cached = getIndexedPath(resolved);
  const children = stats.isDirectory() ? listTreeChildren(resolved) : [];
  const important = children
    .filter((c) => !c.is_directory)
    .slice(0, 8)
    .map((c) => ({ name: c.name, path: c.path, size_bytes: c.size_bytes }));

  const recommendations: string[] = [];
  if (ws?.profile.recommended_next_action) {
    recommendations.push(ws.profile.recommended_next_action);
  }
  if (cached && cached.mtime) {
    const ageDays = (Date.now() - new Date(cached.mtime).getTime()) / 86400000;
    if (ageDays > 90) recommendations.push("Folder appears dormant — consider archive review.");
  }

  const events = ws ? getWorkspaceEvents(ws.workspace_id).slice(-3).reverse() : [];
  const run = getLatestIndexRun();
  const registry = getRegistryStats();
  const assetRow = getAssetByPath(resolved);

  let stale_hint: string | null = null;
  if (cached?.mtime) {
    const ageDays = (Date.now() - new Date(cached.mtime).getTime()) / 86400000;
    if (ageDays > 90) stale_hint = `Last activity ${Math.floor(ageDays)} days ago`;
  }

  const duplicate_risks: string[] = [];
  const intel = getAssetIntelligenceForPath(resolved);
  if (intel?.duplicate_candidates.length) {
    for (const group of intel.duplicate_candidates) {
      duplicate_risks.push(
        `Duplicate candidate: ${group.assets.length} assets with ${group.match_reason.toLowerCase()}`,
      );
    }
  } else if (!stats.isDirectory() && cached) {
    duplicate_risks.push("Search duplicate: prefix to find name+size candidates in registry.");
  }

  const populatedCollections = listPopulatedCollections();
  const assetCollections = assetRow
    ? populatedCollections.filter((c) =>
        intel?.related_collections.some((r) => r.collection_id === c.collection_id),
      )
    : populatedCollections.slice(0, 4);

  return {
    path: resolved,
    name: path.basename(resolved),
    purpose: ws?.description || ws?.executive_context || "No workspace mapping yet.",
    workspace: ws
      ? {
          workspace_id: ws.workspace_id,
          title: ws.title,
          executive_context: ws.executive_context,
          current_focus: ws.current_focus,
          health_score: ws.health_score,
          success_definition: ws.success_definition,
        }
      : null,
    important_files: important,
    recent_activity: events.map((e) => ({
      title: e.title,
      detail: e.detail,
      created_at: e.created_at,
    })),
    recommendations,
    duplicate_risks,
    stale_hint,
    index_status: run
      ? `${run.status} · ${run.paths_scanned} paths · registry ${registry.total_assets} assets`
      : `registry ${registry.total_assets} assets`,
    asset: assetRow
      ? {
          asset_id: assetRow.asset_id,
          kind: assetRow.kind,
          lifecycle_stage: assetRow.lifecycle_stage,
          health_score: intel?.health_score ?? assetRow.health_score,
          hash: assetRow.hash,
          size_bytes: assetRow.size_bytes,
          created_at: assetRow.created_at,
          modified_at: assetRow.modified_at,
          workspace_id: assetRow.workspace_id,
          in_registry: true,
        }
      : null,
    collections: assetCollections.map((c) => ({
      collection_id: c.collection_id,
      title: c.title,
      asset_count: c.asset_count,
    })),
    intelligence: intel,
  };
}

export function getExecutiveInsights(rootPath?: string): ExecutiveInsight[] {
  const insights: ExecutiveInsight[] = [];
  const summary = getIntelligenceSummary();

  if (summary.dormant.count > 0) {
    const gb = (summary.dormant.bytes / (1024 * 1024 * 1024)).toFixed(1);
    insights.push({
      id: "intel-dormant-summary",
      severity: summary.dormant.bytes > 1024 * 1024 * 1024 ? "warn" : "info",
      title: "Dormant assets",
      message: `${summary.dormant.count.toLocaleString()} dormant assets · ${gb} GB — review recommended.`,
      why: "Digital Asset Registry lifecycle analysis · recommend only · no auto-cleanup.",
      recommend_only: true,
      risk: summary.dormant.bytes > 1024 * 1024 * 1024 ? "medium" : "low",
      asset_count: summary.dormant.count,
      bytes_estimate: summary.dormant.bytes,
    });
  }

  if (summary.duplicate_groups > 0) {
    insights.push({
      id: "intel-duplicate-summary",
      severity: "info",
      title: "Duplicate candidates",
      message: `${summary.duplicate_groups} duplicate groups detected in registry.`,
      why: "Matched by filename + size · candidates only · no dedupe actions.",
      recommend_only: true,
      risk: "low",
    });
  }

  for (const rec of getCleanupRecommendations()) {
    if (rec.id.startsWith("rec-ws-")) continue;
    insights.push({
      id: rec.id,
      severity: rec.risk === "medium" ? "warn" : "info",
      title: rec.title,
      message: rec.message,
      workspace_id: rec.workspace_id,
      why: rec.why.join(" "),
      recommend_only: true,
      risk: rec.risk,
      asset_count: rec.asset_count,
      bytes_estimate: rec.bytes_estimate,
      path: rec.paths_sample?.[0],
    });
  }

  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);

  for (const ws of workspaces.sort((a, b) => b.priority - a.priority)) {
    if (ws.current_focus) {
      insights.push({
        id: `focus-${ws.workspace_id}`,
        severity: "priority",
        message: `${ws.title} — ${ws.current_focus}`,
        workspace_id: ws.workspace_id,
        path: ws.filesystem_roots[0],
        why: "Workspace has an active current_focus set.",
      });
    }
    if (ws.health_score !== null && ws.health_score >= 85) {
      insights.push({
        id: `healthy-${ws.workspace_id}`,
        severity: "info",
        message: `${ws.title} supports a high-priority workspace (health ${ws.health_score}).`,
        workspace_id: ws.workspace_id,
        why: "Health score indicates strong workspace status.",
      });
    }
    if (ws.health_score !== null && ws.health_score < 50) {
      insights.push({
        id: `inactive-${ws.workspace_id}`,
        severity: "warn",
        message: `${ws.title} may be inactive or at risk.`,
        workspace_id: ws.workspace_id,
        why: "Health score below 50.",
      });
    }
    if (ws.flags.needs_attention) {
      insights.push({
        id: `attention-${ws.workspace_id}`,
        severity: "warn",
        message: `${ws.title} flagged needs_attention.`,
        workspace_id: ws.workspace_id,
        why: "Workspace flag needs_attention is set.",
      });
    }
  }

  if (rootPath) {
    const ex = explainFolder(rootPath);
    if (ex?.stale_hint) {
      insights.push({
        id: "stale-path",
        severity: "warn",
        message: `This folder hasn't been referenced recently.`,
        path: ex.path,
        why: ex.stale_hint,
      });
    }
  }

  return insights.slice(0, 20);
}

export function whyAmISeeingThis(rawPath: string, context?: string): WhySeeingThisResult | null {
  const ex = explainFolder(rawPath);
  if (!ex) return null;

  const surfaced_because: string[] = [];
  if (context === "executive") surfaced_because.push("Surfaced in Executive Mode insight list.");
  if (context === "search") surfaced_because.push("Matched your search query.");
  if (ex.workspace?.current_focus) {
    surfaced_because.push("Owning workspace has active current_focus.");
  }
  if (ex.workspace && ex.workspace.health_score !== null && ex.workspace.health_score >= 80) {
    surfaced_because.push("Workspace health is strong — likely priority.");
  }
  if (ex.stale_hint) surfaced_because.push(ex.stale_hint);
  if (ex.intelligence?.duplicate_candidates.length) {
    surfaced_because.push("Asset flagged as duplicate candidate in registry.");
  }
  if (ex.intelligence?.recommendations.length) {
    surfaced_because.push(...ex.intelligence.recommendations.map((r) => r.message));
  }
  if (surfaced_because.length === 0) surfaced_because.push("Path is under an approved workspace root.");

  const what_changed = ex.recent_activity.map((a) => `${a.title} (${a.created_at})`);
  const decision_facing =
    ex.recommendations[0] ??
    (ex.stale_hint ? "Consider archive or cleanup review." : null);

  return {
    path: ex.path,
    surfaced_because,
    workspace: ex.workspace,
    what_changed,
    decision_facing,
  };
}
