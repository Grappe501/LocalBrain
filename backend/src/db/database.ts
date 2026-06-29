import Database from "better-sqlite3";
import { getDefaultDbPath, getRepoRoot } from "./repoRoot.js";

let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(getDefaultDbPath());
    dbInstance.pragma("journal_mode = WAL");
  }
  return dbInstance;
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export function isDatabaseConnected(): boolean {
  try {
    getDatabase().prepare("SELECT 1").get();
    return true;
  } catch {
    return false;
  }
}

export type AllowedFolderRow = {
  id: number;
  path: string;
  label: string;
  created_at: string;
};

export function getAllowedFoldersFromDb(): AllowedFolderRow[] {
  return getDatabase()
    .prepare("SELECT id, path, label, created_at FROM allowed_folders ORDER BY id")
    .all() as AllowedFolderRow[];
}

export function logPermissionCheck(
  targetPath: string,
  action: string,
  allowed: boolean,
  reason: string,
): void {
  getDatabase()
    .prepare(
      "INSERT INTO permission_log (path, action, allowed, reason, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
    )
    .run(targetPath, action, allowed ? 1 : 0, reason);
}

export function runMigrations(): void {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS allowed_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS permission_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      action TEXT NOT NULL,
      allowed INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const repoRoot = getRepoRoot();
  const insert = db.prepare(
    "INSERT OR IGNORE INTO allowed_folders (path, label) VALUES (?, ?)",
  );
  insert.run(repoRoot, "LocalBrain repo (seed)");

  db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
  ).run("permission_engine_version", "v2");
}
