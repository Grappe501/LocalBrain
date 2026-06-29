import type { WritingSourceFile } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";
import { getWorkspace } from "../workspaces/workspaceRegistry.js";
import { buildFolderManifest } from "../files/folderManifest.js";
import path from "node:path";

const WRITING_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".markdown",
  ".docx",
  ".rtf",
]);

function isWritingFile(name: string): boolean {
  return WRITING_EXTENSIONS.has(path.extname(name).toLowerCase());
}

export function listWritingSources(workspaceId: string): WritingSourceFile[] {
  const ws = getWorkspace(workspaceId);
  if (!ws) return [];

  const roots =
    ws.filesystem_roots.length > 0
      ? ws.filesystem_roots
      : workspaceId === "localbrain"
        ? [getRepoRoot()]
        : [];

  const results: WritingSourceFile[] = [];
  const seen = new Set<string>();

  for (const root of roots) {
    const manifest = buildFolderManifest(root);
    for (const entry of manifest.entries) {
      if (!entry.name || !isWritingFile(entry.name)) continue;
      const fullPath = entry.path;
      if (seen.has(fullPath)) continue;
      seen.add(fullPath);
      results.push({
        path: fullPath,
        name: entry.name,
        kind: path.extname(entry.name).slice(1) || "file",
        size_bytes: entry.size_bytes ?? null,
        allowed: manifest.allowed,
      });
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}
