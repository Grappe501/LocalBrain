import type { LivingWorkspace } from "@localbrain/shared";
import path from "node:path";
import { normalizeAndResolve } from "../safety/pathValidator.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";

export function resolveWorkspaceForPath(rawPath: string): LivingWorkspace | null {
  let resolved: string;
  try {
    resolved = normalizeAndResolve(rawPath);
  } catch {
    return null;
  }

  const workspaces = listWorkspaces();
  let best: LivingWorkspace | null = null;
  let bestLen = -1;

  for (const ws of workspaces) {
    for (const root of ws.filesystem_roots) {
      let rootResolved: string;
      try {
        rootResolved = normalizeAndResolve(root);
      } catch {
        continue;
      }
      const rel = path.relative(rootResolved, resolved);
      if (rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel))) {
        if (rootResolved.length > bestLen) {
          bestLen = rootResolved.length;
          best = ws;
        }
      }
    }
  }

  return best;
}

export function getExplorerRootPaths(): string[] {
  const roots = new Set<string>();
  for (const ws of listWorkspaces()) {
    for (const r of ws.filesystem_roots) {
      try {
        roots.add(normalizeAndResolve(r));
      } catch {
        /* skip invalid */
      }
    }
  }
  return [...roots].sort();
}
