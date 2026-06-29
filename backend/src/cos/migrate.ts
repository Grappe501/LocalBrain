import { getDatabase } from "../db/database.js";

export function migrateCosTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS cos_orchestration_log (
      orchestration_id TEXT PRIMARY KEY,
      intent TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      user_message TEXT NOT NULL,
      capabilities_json TEXT NOT NULL DEFAULT '[]',
      recommendations_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cos_outcomes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orchestration_id TEXT,
      recommendation_id TEXT NOT NULL,
      action_id TEXT,
      outcome TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_cos_outcomes_recommendation ON cos_outcomes(recommendation_id);
    CREATE INDEX IF NOT EXISTS idx_cos_outcomes_action ON cos_outcomes(action_id);
  `);

  const cols = getDatabase()
    .prepare("PRAGMA table_info(proposed_actions)")
    .all() as { name: string }[];
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("cos_recommendation_id")) {
    getDatabase().exec("ALTER TABLE proposed_actions ADD COLUMN cos_recommendation_id TEXT");
  }
  if (!names.has("orchestration_id")) {
    getDatabase().exec("ALTER TABLE proposed_actions ADD COLUMN orchestration_id TEXT");
  }
}
