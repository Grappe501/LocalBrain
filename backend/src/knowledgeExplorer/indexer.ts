import fs from "node:fs";
import path from "node:path";
import { upsertDigitalAsset } from "../digitalAssets/assetRegistry.js";
import { getDatabase } from "../db/database.js";
import { getPermissionEngine } from "../safety/permissionEngine.js";
import { hasIgnoredSegment, matchesSecretName } from "../safety/ignoreRules.js";
import { normalizeAndResolve } from "../safety/pathValidator.js";
import { getExplorerRootPaths, resolveWorkspaceForPath } from "./pathWorkspace.js";
import type { FileIndexRow, IndexRunRow } from "./migrate.js";

let indexing = false;

export function isIndexing(): boolean {
  return indexing;
}

export function getLatestIndexRun(): IndexRunRow | null {
  const row = getDatabase()
    .prepare("SELECT * FROM index_runs ORDER BY id DESC LIMIT 1")
    .get() as IndexRunRow | undefined;
  return row ?? null;
}

function shouldSkipPath(resolved: string): boolean {
  if (hasIgnoredSegment(resolved)) return true;
  if (matchesSecretName(resolved)) return true;
  const engine = getPermissionEngine();
  const check = engine.checkPath({ path: resolved, action: "read" });
  return !check.allowed;
}

function indexPath(resolved: string, stats: fs.Stats): void {
  const ws = resolveWorkspaceForPath(resolved);
  upsertDigitalAsset({
    path: resolved,
    name: path.basename(resolved),
    is_directory: stats.isDirectory(),
    size_bytes: stats.isFile() ? stats.size : null,
    mtime: stats.mtime.toISOString(),
    workspace_id: ws?.workspace_id ?? null,
  });
}

function walkDirectory(root: string, maxDepth: number, counters: { count: number }): void {
  if (maxDepth < 0) return;

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return;
  }

  for (const ent of entries) {
    const full = path.join(root, ent.name);
    let resolved: string;
    try {
      resolved = normalizeAndResolve(full);
    } catch {
      continue;
    }
    if (shouldSkipPath(resolved)) continue;

    let stats: fs.Stats;
    try {
      stats = fs.statSync(resolved);
    } catch {
      continue;
    }

    indexPath(resolved, stats);
    counters.count += 1;

    if (ent.isDirectory()) {
      walkDirectory(resolved, maxDepth - 1, counters);
    }
  }
}

/** Incremental background index — shallow first pass; never blocks startup UI. */
export function runBackgroundIndex(options?: { maxDepth?: number; roots?: string[] }): void {
  if (indexing) return;
  indexing = true;

  const maxDepth = options?.maxDepth ?? 4;
  const roots = options?.roots ?? getExplorerRootPaths();

  const db = getDatabase();
  const run = db
    .prepare(
      "INSERT INTO index_runs (status, paths_scanned, message) VALUES ('running', 0, 'background incremental')",
    )
    .run();
  const runId = Number(run.lastInsertRowid);

  setImmediate(() => {
    const counters = { count: 0 };
    try {
      for (const root of roots) {
        if (shouldSkipPath(root)) continue;
        let stats: fs.Stats;
        try {
          stats = fs.statSync(root);
          indexPath(root, stats);
          counters.count += 1;
        } catch {
          continue;
        }
        if (stats.isDirectory()) {
          walkDirectory(root, maxDepth, counters);
        }
      }
      db.prepare(
        "UPDATE index_runs SET status = 'complete', paths_scanned = ?, finished_at = datetime('now') WHERE id = ?",
      ).run(counters.count, runId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "index failed";
      db.prepare(
        "UPDATE index_runs SET status = 'error', message = ?, finished_at = datetime('now') WHERE id = ?",
      ).run(msg, runId);
    } finally {
      indexing = false;
    }
  });
}

export function getIndexedPath(pathStr: string): FileIndexRow | null {
  let resolved: string;
  try {
    resolved = normalizeAndResolve(pathStr);
  } catch {
    return null;
  }
  return (
    (getDatabase().prepare("SELECT * FROM file_index WHERE path = ?").get(resolved) as
      | FileIndexRow
      | undefined) ?? null
  );
}
