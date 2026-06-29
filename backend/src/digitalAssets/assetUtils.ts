import type { AssetLifecycleStage, DigitalAssetKind } from "@localbrain/shared";
import path from "node:path";

const EXT_KIND: Record<string, DigitalAssetKind> = {
  ".md": "document",
  ".txt": "document",
  ".doc": "document",
  ".docx": "document",
  ".json": "document",
  ".ts": "source_code",
  ".tsx": "source_code",
  ".js": "source_code",
  ".jsx": "source_code",
  ".py": "source_code",
  ".rs": "source_code",
  ".go": "source_code",
  ".sql": "database",
  ".db": "database",
  ".sqlite": "database",
  ".jpg": "photo",
  ".jpeg": "photo",
  ".png": "photo",
  ".gif": "photo",
  ".webp": "photo",
  ".mp3": "podcast",
  ".wav": "podcast",
  ".mp4": "video",
  ".mov": "video",
  ".xlsx": "spreadsheet",
  ".xls": "spreadsheet",
  ".csv": "spreadsheet",
  ".zip": "zip_archive",
  ".pdf": "pdf",
  ".ttf": "font",
  ".otf": "font",
};

export function detectAssetKind(name: string, isDirectory: boolean): DigitalAssetKind {
  if (isDirectory) {
    if (name === ".git" || name.endsWith(".git")) return "git_repository";
    return "directory";
  }
  const ext = path.extname(name).toLowerCase();
  return EXT_KIND[ext] ?? "unknown";
}

const STALE_DAYS = 90;
const ACTIVE_DAYS = 7;
const REFERENCED_DAYS = 30;

export function inferLifecycleStage(
  mtime: string | null,
  isDirectory: boolean,
): AssetLifecycleStage {
  if (!mtime) return "created";
  const ageDays = (Date.now() - new Date(mtime).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= ACTIVE_DAYS) return "active";
  if (ageDays <= REFERENCED_DAYS) return "referenced";
  if (ageDays >= STALE_DAYS) return isDirectory ? "archive_candidate" : "dormant";
  return "referenced";
}

/** Stub health score for LB-OS-006 — refined in LB-OS-007 */
export function stubHealthScore(
  lifecycle: AssetLifecycleStage,
  workspaceId: string | null,
): number | null {
  if (!workspaceId) return lifecycle === "dormant" ? 35 : 50;
  switch (lifecycle) {
    case "active":
      return 88;
    case "referenced":
      return 72;
    case "dormant":
      return 45;
    case "archive_candidate":
      return 38;
    case "created":
      return 60;
    default:
      return 55;
  }
}

export function pathToAssetId(resolvedPath: string): string {
  return resolvedPath;
}
