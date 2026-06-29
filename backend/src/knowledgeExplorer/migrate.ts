import { getDatabase } from "../db/database.js";

export function migrateKnowledgeExplorerTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS file_index (
      path TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      is_directory INTEGER NOT NULL DEFAULT 0,
      size_bytes INTEGER,
      mtime TEXT,
      workspace_id TEXT,
      excerpt TEXT NOT NULL DEFAULT '',
      indexed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS index_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL,
      paths_scanned INTEGER NOT NULL DEFAULT 0,
      message TEXT NOT NULL DEFAULT '',
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      finished_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_file_index_workspace ON file_index(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_file_index_mtime ON file_index(mtime);

    CREATE VIRTUAL TABLE IF NOT EXISTS file_index_fts USING fts5(
      path UNINDEXED,
      name,
      excerpt
    );
  `);
}

export type FileIndexRow = {
  path: string;
  name: string;
  is_directory: number;
  size_bytes: number | null;
  mtime: string | null;
  workspace_id: string | null;
  excerpt: string;
  indexed_at: string;
};

export type IndexRunRow = {
  id: number;
  status: string;
  paths_scanned: number;
  message: string;
  started_at: string;
  finished_at: string | null;
};
