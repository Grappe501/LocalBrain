import fs from "node:fs";
import path from "node:path";
import { getAllowedFoldersFromDb } from "../../db/database.js";
import { getPermissionEngine } from "../../safety/permissionEngine.js";
import { hasIgnoredSegment, matchesSecretName } from "../../safety/ignoreRules.js";
import { normalizeAndResolve } from "../../safety/pathValidator.js";
import { listWorkspaces } from "../../workspaces/workspaceRegistry.js";
import type { HFolderMapNode } from "@localbrain/shared";
import { getDriveLetter } from "../driveDoctrine.js";

const MAX_CHILDREN_PER_DIR = 200;
const MAX_SCAN_DEPTH = 2;

export type ScanResult = {
  scanned_roots: string[];
  paths_scanned: number;
  nodes: HFolderMapNode[];
};

function canListPath(resolved: string): boolean {
  if (getDriveLetter(resolved) === "C") return false;
  if (hasIgnoredSegment(resolved) || matchesSecretName(resolved)) return false;
  const check = getPermissionEngine().checkPath({ path: resolved, action: "list" });
  return check.allowed;
}

export function collectHScanRoots(): string[] {
  const roots = new Set<string>();

  for (const folder of getAllowedFoldersFromDb()) {
    if (getDriveLetter(folder.path) !== "H") continue;
    try {
      roots.add(normalizeAndResolve(folder.path));
    } catch {
      /* skip */
    }
  }

  for (const ws of listWorkspaces()) {
    for (const root of ws.filesystem_roots) {
      if (getDriveLetter(root) !== "H") continue;
      try {
        roots.add(normalizeAndResolve(root));
      } catch {
        /* skip */
      }
    }
  }

  return [...roots].sort((a, b) => a.length - b.length);
}

function listDirectoryMetadata(
  dirPath: string,
  depth: number,
  nodes: HFolderMapNode[],
  counters: { scanned: number },
): void {
  if (depth > MAX_SCAN_DEPTH) return;
  if (!canListPath(dirPath)) {
    nodes.push({
      path: dirPath,
      name: path.basename(dirPath),
      depth,
      is_directory: true,
      size_bytes: null,
      child_count: 0,
      permission_allowed: false,
    });
    return;
  }

  let stats: fs.Stats;
  try {
    stats = fs.statSync(dirPath);
  } catch {
    return;
  }

  counters.scanned += 1;

  let childCount = 0;
  if (stats.isDirectory()) {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      childCount = entries.length;
      const slice = entries.slice(0, MAX_CHILDREN_PER_DIR);
      for (const ent of slice) {
        const full = path.join(dirPath, ent.name);
        let resolved: string;
        try {
          resolved = normalizeAndResolve(full);
        } catch {
          continue;
        }
        if (getDriveLetter(resolved) !== "H") continue;

        let childStats: fs.Stats;
        try {
          childStats = fs.statSync(resolved);
        } catch {
          continue;
        }

        nodes.push({
          path: resolved,
          name: ent.name,
          depth: depth + 1,
          is_directory: childStats.isDirectory(),
          size_bytes: childStats.isFile() ? childStats.size : null,
          child_count: 0,
          permission_allowed: true,
        });
        counters.scanned += 1;

        if (ent.isDirectory()) {
          listDirectoryMetadata(resolved, depth + 1, nodes, counters);
        }
      }
    } catch {
      /* permission or IO */
    }
  }

  nodes.push({
    path: dirPath,
    name: path.basename(dirPath),
    depth,
    is_directory: stats.isDirectory(),
    size_bytes: stats.isFile() ? stats.size : null,
    child_count: childCount,
    permission_allowed: true,
  });
}

/** Permission-gated H:/ metadata scan — no file content reads, no C:/ traversal. */
export function runHFilesystemScan(): ScanResult {
  const roots = collectHScanRoots();
  const nodes: HFolderMapNode[] = [];
  const counters = { scanned: 0 };

  const hRoot = "H:\\";
  if (canListPath(hRoot)) {
    try {
      const topEntries = fs.readdirSync(hRoot, { withFileTypes: true }).slice(0, MAX_CHILDREN_PER_DIR);
      for (const ent of topEntries) {
        const full = path.join(hRoot, ent.name);
        let resolved: string;
        try {
          resolved = normalizeAndResolve(full);
        } catch {
          continue;
        }
        listDirectoryMetadata(resolved, 0, nodes, counters);
      }
      counters.scanned += 1;
    } catch {
      /* H:\ not listable */
    }
  }

  for (const root of roots) {
    if (!nodes.some((n) => n.path.toLowerCase() === root.toLowerCase())) {
      listDirectoryMetadata(root, 0, nodes, counters);
    }
  }

  const uniqueNodes = [...new Map(nodes.map((n) => [n.path.toLowerCase(), n])).values()];

  return {
    scanned_roots: roots,
    paths_scanned: counters.scanned,
    nodes: uniqueNodes.sort((a, b) => a.path.localeCompare(b.path)),
  };
}
