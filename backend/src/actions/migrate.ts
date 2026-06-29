import { getDatabase } from "../db/database.js";

export function migrateActionTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS proposed_actions (
      action_id TEXT PRIMARY KEY,
      action_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      source_path TEXT,
      target_path TEXT,
      proposed_content TEXT,
      original_content TEXT,
      diff_preview TEXT,
      backup_id TEXT,
      requested_by TEXT NOT NULL DEFAULT 'steve',
      execution_detail TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      approved_at TEXT,
      executed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS action_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS backup_records (
      backup_id TEXT PRIMARY KEY,
      action_id TEXT,
      source_path TEXT NOT NULL,
      backup_path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_proposed_actions_status ON proposed_actions(status);
    CREATE INDEX IF NOT EXISTS idx_action_log_action ON action_log(action_id);
  `);
}
