import { getDatabase } from "../db/database.js";

export function migrateFileReadLogTable(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS file_read_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      normalized_path TEXT NOT NULL,
      action TEXT NOT NULL,
      allowed INTEGER NOT NULL,
      bytes_read INTEGER,
      chars_returned INTEGER,
      truncated INTEGER NOT NULL DEFAULT 0,
      reason TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_file_read_log_path ON file_read_log(normalized_path);
  `);
}

export function logFileAccess(entry: {
  path: string;
  normalized_path: string;
  action: "read" | "summarize" | "folder_manifest";
  allowed: boolean;
  bytes_read?: number | null;
  chars_returned?: number | null;
  truncated?: boolean;
  reason?: string;
}): void {
  getDatabase()
    .prepare(
      `INSERT INTO file_read_log (
        path, normalized_path, action, allowed, bytes_read, chars_returned, truncated, reason
      ) VALUES (
        @path, @normalized_path, @action, @allowed, @bytes_read, @chars_returned, @truncated, @reason
      )`,
    )
    .run({
      path: entry.path,
      normalized_path: entry.normalized_path,
      action: entry.action,
      allowed: entry.allowed ? 1 : 0,
      bytes_read: entry.bytes_read ?? null,
      chars_returned: entry.chars_returned ?? null,
      truncated: entry.truncated ? 1 : 0,
      reason: entry.reason ?? "",
    });

  console.info(
    `[file-read] action=${entry.action} allowed=${entry.allowed ? "yes" : "no"} path=${entry.normalized_path}`,
  );
}
