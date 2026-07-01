import { getDatabase } from "../db/database.js";

export function migrateMemoryTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS memory_episodes (
      episode_id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      lifecycle_state TEXT NOT NULL,
      schema_version TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      lifecycle_updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_memory_episodes_domain ON memory_episodes(domain);
    CREATE INDEX IF NOT EXISTS idx_memory_episodes_lifecycle ON memory_episodes(lifecycle_state);

    CREATE TABLE IF NOT EXISTS memory_audit_events (
      audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      object_type TEXT NOT NULL,
      object_id TEXT NOT NULL,
      from_state TEXT,
      to_state TEXT,
      actor_identity_id TEXT,
      detail_json TEXT NOT NULL DEFAULT '{}',
      recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_memory_audit_object ON memory_audit_events(object_type, object_id);
  `);
}
