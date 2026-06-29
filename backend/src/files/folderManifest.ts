import fs from "node:fs";
import path from "node:path";
import type { FolderManifestEntry, FolderManifestResult } from "@localbrain/shared";
import { getAssetByPath } from "../digitalAssets/assetRegistry.js";
import { getDatabase } from "../db/database.js";
import { getPermissionEngine } from "../safety/permissionEngine.js";
import { getFolderManifestLimit } from "./fileLimits.js";
import { logFileAccess } from "./fileReadLog.js";

function deniedManifest(rawPath: string, normalized: string, reason: string): FolderManifestResult {
  logFileAccess({
    path: rawPath,
    normalized_path: normalized,
    action: "folder_manifest",
    allowed: false,
    reason,
  });
  return {
    path: rawPath,
    normalized_path: normalized,
    allowed: false,
    reason,
    entries: [],
    total_in_registry: 0,
    manifest_only: true,
    logged: true,
  };
}

/** One-level folder manifest from registry + directory listing — no file content reads. */
export function buildFolderManifest(dirPath: string): FolderManifestResult {
  const rawPath = dirPath.trim();
  const check = getPermissionEngine().checkPath({ path: rawPath, action: "list" });
  const normalized = check.normalizedPath ?? rawPath;

  if (!check.allowed) {
    return deniedManifest(rawPath, normalized, check.reason);
  }

  let stats: fs.Stats;
  try {
    stats = fs.statSync(normalized);
  } catch {
    return deniedManifest(rawPath, normalized, "Directory not found");
  }

  if (!stats.isDirectory()) {
    return deniedManifest(rawPath, normalized, "Path is not a directory");
  }

  const limit = getFolderManifestLimit();
  const prefix = normalized.endsWith(path.sep) ? normalized : normalized + path.sep;

  const registryRows = getDatabase()
    .prepare(
      `SELECT path, name, is_directory, size_bytes, modified_at, kind, lifecycle_stage
       FROM digital_assets
       WHERE path = ? OR path LIKE ?
       ORDER BY is_directory DESC, name ASC
       LIMIT ?`,
    )
    .all(normalized, prefix + "%", limit * 2) as {
    path: string;
    name: string;
    is_directory: number;
    size_bytes: number | null;
    modified_at: string | null;
    kind: string;
    lifecycle_stage: string;
  }[];

  const immediateRegistry = registryRows.filter((row) => {
    if (row.path === normalized) return false;
    const rel = path.relative(normalized, row.path);
    return rel && !rel.startsWith("..") && !path.isAbsolute(rel) && !rel.includes(path.sep);
  });

  const entriesMap = new Map<string, FolderManifestEntry>();

  for (const row of immediateRegistry.slice(0, limit)) {
    entriesMap.set(row.path, {
      path: row.path,
      name: row.name,
      is_directory: row.is_directory === 1,
      size_bytes: row.size_bytes,
      modified_at: row.modified_at,
      kind: row.kind,
      lifecycle_stage: row.lifecycle_stage,
      in_registry: true,
    });
  }

  try {
    const dirents = fs.readdirSync(normalized, { withFileTypes: true });
    for (const ent of dirents) {
      if (entriesMap.size >= limit) break;
      const full = path.join(normalized, ent.name);
      const childCheck = getPermissionEngine().checkPath({ path: full, action: "list" });
      if (!childCheck.allowed) continue;
      const resolved = childCheck.normalizedPath ?? full;
      if (entriesMap.has(resolved)) continue;

      let childStats: fs.Stats;
      try {
        childStats = fs.statSync(resolved);
      } catch {
        continue;
      }

      const asset = getAssetByPath(resolved);
      entriesMap.set(resolved, {
        path: resolved,
        name: ent.name,
        is_directory: childStats.isDirectory(),
        size_bytes: childStats.isFile() ? childStats.size : null,
        modified_at: childStats.mtime.toISOString(),
        kind: asset?.kind ?? null,
        lifecycle_stage: asset?.lifecycle_stage ?? null,
        in_registry: asset !== null,
      });
    }
  } catch {
    /* empty manifest ok if readdir fails */
  }

  const entries = [...entriesMap.values()].sort((a, b) => {
    if (a.is_directory !== b.is_directory) return a.is_directory ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  logFileAccess({
    path: rawPath,
    normalized_path: normalized,
    action: "folder_manifest",
    allowed: true,
    chars_returned: entries.length,
    reason: `manifest_${entries.length}_entries`,
  });

  return {
    path: rawPath,
    normalized_path: normalized,
    allowed: true,
    reason: "manifest_ok",
    entries,
    total_in_registry: registryRows.length,
    manifest_only: true,
    logged: true,
  };
}

export function manifestToText(manifest: FolderManifestResult): string {
  if (!manifest.allowed) return `Folder manifest denied: ${manifest.reason}`;
  const lines = manifest.entries.map(
    (e) =>
      `- ${e.is_directory ? "[dir]" : "[file]"} ${e.name} · ${e.size_bytes ?? "—"} bytes · registry=${e.in_registry} · ${e.lifecycle_stage ?? "—"}`,
  );
  return [
    `Folder manifest (metadata only): ${manifest.normalized_path}`,
    `${manifest.entries.length} immediate children · ${manifest.total_in_registry} assets in registry under tree`,
    ...lines,
  ].join("\n");
}
