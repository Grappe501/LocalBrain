import { getDatabase } from "../../db/database.js";

export function migrateFilesystemAuditTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS migration_audit_runs (
      run_id TEXT PRIMARY KEY,
      paths_scanned INTEGER NOT NULL DEFAULT 0,
      mapping_confidence REAL NOT NULL DEFAULT 0,
      report_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_migration_audit_runs_created
      ON migration_audit_runs(created_at);
  `);
}
