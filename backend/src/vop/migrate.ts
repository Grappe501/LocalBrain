import { getDatabase } from "../db/database.js";

export function migrateVopTables(): void {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS vop_volunteer_profiles (
      profile_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      contact_id TEXT,
      display_name TEXT NOT NULL,
      county TEXT,
      roles_json TEXT NOT NULL DEFAULT '[]',
      skills_json TEXT NOT NULL DEFAULT '[]',
      availability_note TEXT,
      training_completed_json TEXT NOT NULL DEFAULT '[]',
      permissions_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(workspace_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS vop_work_items (
      work_item_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      title TEXT NOT NULL,
      detail TEXT NOT NULL,
      county TEXT,
      required_skills_json TEXT NOT NULL DEFAULT '[]',
      urgency TEXT NOT NULL DEFAULT 'normal',
      source_system TEXT NOT NULL DEFAULT 'manual',
      source_ref_id TEXT,
      contact_id TEXT,
      quality_flag TEXT NOT NULL DEFAULT 'none',
      claimed_by_user_id TEXT,
      claimed_at TEXT,
      completed_by_user_id TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vop_work_claims (
      claim_id TEXT PRIMARY KEY,
      work_item_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      claimed_at TEXT NOT NULL,
      released_at TEXT
    );

    CREATE TABLE IF NOT EXISTS vop_quality_events (
      event_id TEXT PRIMARY KEY,
      work_item_id TEXT NOT NULL,
      flagged_by_user_id TEXT NOT NULL,
      flag_type TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_vop_work_open ON vop_work_items(workspace_id, status);
    CREATE INDEX IF NOT EXISTS idx_vop_profiles_user ON vop_volunteer_profiles(workspace_id, user_id);
  `);
}
