import { getDatabase } from "../db/database.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { parseSearchQuery, type ParsedSearchQuery } from "./searchParser.js";
import type { FileIndexRow } from "./migrate.js";

export type SearchResultItem = {
  kind: "file" | "workspace" | "insight";
  title: string;
  subtitle: string;
  path?: string;
  workspace_id?: string;
};

const STALE_DAYS = 90;
const LARGE_BYTES = 10 * 1024 * 1024;

function searchFiles(term: string, limit: number): SearchResultItem[] {
  const db = getDatabase();
  if (!term) {
    const rows = db
      .prepare(
        "SELECT path, name FROM file_index WHERE is_directory = 0 ORDER BY mtime DESC LIMIT ?",
      )
      .all(limit) as { path: string; name: string }[];
    return rows.map((r) => ({
      kind: "file" as const,
      title: r.name,
      subtitle: r.path,
      path: r.path,
    }));
  }

  try {
    const rows = db
      .prepare(
        `SELECT f.path, f.name FROM file_index_fts fts
         JOIN file_index f ON f.path = fts.path
         WHERE file_index_fts MATCH ?
         LIMIT ?`,
      )
      .all(term.replace(/[^\w\s.-]/g, " "), limit) as { path: string; name: string }[];

    if (rows.length > 0) {
      return rows.map((r) => ({
        kind: "file" as const,
        title: r.name,
        subtitle: r.path,
        path: r.path,
      }));
    }
  } catch {
    /* FTS empty or syntax — fall through to LIKE */
  }

  const like = `%${term}%`;
  const fallback = db
    .prepare(
      "SELECT path, name FROM file_index WHERE name LIKE ? OR path LIKE ? LIMIT ?",
    )
    .all(like, like, limit) as { path: string; name: string }[];
  return fallback.map((r) => ({
    kind: "file" as const,
    title: r.name,
    subtitle: r.path,
    path: r.path,
  }));
}

function searchWorkspaces(term: string): SearchResultItem[] {
  const q = term.toLowerCase();
  return listWorkspaces()
    .filter(
      (w) =>
        !q ||
        w.workspace_id.toLowerCase().includes(q) ||
        w.title.toLowerCase().includes(q),
    )
    .map((w) => ({
      kind: "workspace" as const,
      title: w.title,
      subtitle: w.current_focus || w.executive_context.slice(0, 80),
      workspace_id: w.workspace_id,
      path: w.filesystem_roots[0],
    }));
}

function searchFocus(): SearchResultItem[] {
  return listWorkspaces()
    .filter((w) => w.current_focus && !w.flags.hidden)
    .map((w) => ({
      kind: "workspace" as const,
      title: w.title,
      subtitle: w.current_focus,
      workspace_id: w.workspace_id,
    }));
}

function searchHealth(): SearchResultItem[] {
  return listWorkspaces()
    .filter((w) => w.health_score !== null && !w.flags.hidden)
    .sort((a, b) => (b.health_score ?? 0) - (a.health_score ?? 0))
    .map((w) => ({
      kind: "workspace" as const,
      title: w.title,
      subtitle: `Health ${w.health_score}`,
      workspace_id: w.workspace_id,
    }));
}

function searchArchive(): SearchResultItem[] {
  return listWorkspaces()
    .filter((w) => w.flags.archived || (w.health_score !== null && w.health_score < 50))
    .map((w) => ({
      kind: "insight" as const,
      title: w.title,
      subtitle: w.flags.archived ? "Archived workspace" : "Archive candidate",
      workspace_id: w.workspace_id,
    }));
}

function searchStale(limit: number): SearchResultItem[] {
  const cutoff = new Date(Date.now() - STALE_DAYS * 86400000).toISOString();
  const rows = getDatabase()
    .prepare(
      `SELECT path, name, mtime FROM file_index
       WHERE is_directory = 0 AND mtime < ?
       ORDER BY mtime ASC LIMIT ?`,
    )
    .all(cutoff, limit) as FileIndexRow[];
  return rows.map((r) => ({
    kind: "file" as const,
    title: r.name,
    subtitle: `Stale · ${r.mtime ?? "unknown"}`,
    path: r.path,
  }));
}

function searchLarge(limit: number): SearchResultItem[] {
  const rows = getDatabase()
    .prepare(
      `SELECT path, name, size_bytes FROM file_index
       WHERE is_directory = 0 AND size_bytes >= ?
       ORDER BY size_bytes DESC LIMIT ?`,
    )
    .all(LARGE_BYTES, limit) as FileIndexRow[];
  return rows.map((r) => ({
    kind: "file" as const,
    title: r.name,
    subtitle: `${Math.round((r.size_bytes ?? 0) / (1024 * 1024))} MB`,
    path: r.path,
  }));
}

function searchDuplicate(limit: number): SearchResultItem[] {
  const rows = getDatabase()
    .prepare(
      `SELECT name, COUNT(*) AS c, GROUP_CONCAT(path, ' | ') AS paths
       FROM file_index WHERE is_directory = 0
       GROUP BY LOWER(name) HAVING c > 1
       LIMIT ?`,
    )
    .all(limit) as { name: string; paths: string }[];
  return rows.map((r) => ({
    kind: "insight" as const,
    title: r.name,
    subtitle: `Duplicate name · ${r.paths}`,
    path: r.paths.split(" | ")[0],
  }));
}

function searchRecent(limit: number): SearchResultItem[] {
  const rows = getDatabase()
    .prepare(
      "SELECT path, name, mtime FROM file_index ORDER BY mtime DESC LIMIT ?",
    )
    .all(limit) as FileIndexRow[];
  return rows.map((r) => ({
    kind: "file" as const,
    title: r.name,
    subtitle: r.mtime ?? "",
    path: r.path,
  }));
}

function searchDecision(term: string): SearchResultItem[] {
  if (!term) {
    return [
      {
        kind: "insight",
        title: "LivingWorkspace replaces Project Registry",
        subtitle: "DEC-WR-001 · binding · see Decision Ledger",
      },
      {
        kind: "insight",
        title: "Knowledge Explorer replaces Explorer",
        subtitle: "DEC-KE-001 · binding",
      },
    ];
  }
  const lower = term.toLowerCase();
  const all = [
    { title: "LivingWorkspace replaces Project Registry", id: "DEC-WR-001" },
    { title: "Knowledge Explorer replaces Explorer", id: "DEC-KE-001" },
  ];
  return all
    .filter((d) => d.title.toLowerCase().includes(lower) || d.id.toLowerCase().includes(lower))
    .map((d) => ({
      kind: "insight" as const,
      title: d.title,
      subtitle: d.id,
    }));
}

export function executeSearch(raw: string, limit = 25): SearchResultItem[] {
  const parsed = parseSearchQuery(raw);
  return executeParsedSearch(parsed, limit);
}

export function executeParsedSearch(parsed: ParsedSearchQuery, limit = 25): SearchResultItem[] {
  switch (parsed.type) {
    case "file":
      return searchFiles(parsed.term, limit);
    case "workspace":
      return searchWorkspaces(parsed.term);
    case "focus":
      return searchFocus();
    case "health":
      return searchHealth();
    case "archive":
      return searchArchive();
    case "stale":
      return searchStale(limit);
    case "large":
      return searchLarge(limit);
    case "duplicate":
      return searchDuplicate(limit);
    case "recent":
      return searchRecent(limit);
    case "decision":
      return searchDecision(parsed.term);
    case "plain":
      return [...searchFiles(parsed.term, limit), ...searchWorkspaces(parsed.term)].slice(0, limit);
    default:
      return [];
  }
}
