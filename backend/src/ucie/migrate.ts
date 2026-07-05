import { getDatabase } from "../db/database.js";

export function migrateUcieTables(): void {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS ucie_import_sessions (
      session_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_label TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      created_by_user_id TEXT NOT NULL,
      row_count INTEGER NOT NULL DEFAULT 0,
      committed_count INTEGER NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      checksum TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_import_batches (
      batch_id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      batch_index INTEGER NOT NULL,
      row_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_import_files (
      file_id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      mime_type TEXT,
      byte_size INTEGER NOT NULL DEFAULT 0,
      checksum TEXT NOT NULL,
      uploaded_by_user_id TEXT NOT NULL,
      uploaded_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_import_artifacts (
      artifact_id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      artifact_type TEXT NOT NULL,
      storage_ref TEXT NOT NULL,
      checksum TEXT NOT NULL,
      metadata_json TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_import_rows (
      row_id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      batch_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      row_index INTEGER NOT NULL,
      processing_state TEXT NOT NULL DEFAULT 'pending',
      raw_json TEXT NOT NULL,
      normalized_json TEXT,
      source_type TEXT NOT NULL,
      uploaded_by_user_id TEXT NOT NULL,
      checksum TEXT NOT NULL,
      match_outcome TEXT,
      committed_contact_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_schema_mappings (
      mapping_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      source_type TEXT NOT NULL,
      header_fingerprint TEXT NOT NULL,
      mappings_json TEXT NOT NULL,
      approved_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_match_results (
      match_id TEXT PRIMARY KEY,
      row_id TEXT NOT NULL UNIQUE,
      session_id TEXT NOT NULL,
      outcome TEXT NOT NULL,
      confidence_score REAL NOT NULL,
      matched_contact_id TEXT,
      evidence_json TEXT NOT NULL,
      rationale TEXT NOT NULL,
      auto_merge_allowed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_work_items (
      work_item_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      session_id TEXT,
      row_id TEXT,
      item_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      title TEXT NOT NULL,
      detail TEXT NOT NULL,
      claimed_by_user_id TEXT,
      claimed_at TEXT,
      completed_by_user_id TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_work_claims (
      claim_id TEXT PRIMARY KEY,
      work_item_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      claimed_at TEXT NOT NULL,
      released_at TEXT
    );

    CREATE TABLE IF NOT EXISTS ucie_field_provenance (
      provenance_id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      field_name TEXT NOT NULL,
      field_value TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_label TEXT NOT NULL,
      uploaded_by_user_id TEXT,
      confirmed_by_user_id TEXT,
      session_id TEXT,
      row_id TEXT,
      verified_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ucie_connector_sessions (
      connector_session_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      connector_type TEXT NOT NULL,
      status TEXT NOT NULL,
      import_session_id TEXT,
      connected_by_user_id TEXT NOT NULL,
      connected_at TEXT NOT NULL,
      disconnected_at TEXT
    );

    CREATE TABLE IF NOT EXISTS ucie_voter_records (
      voter_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      county TEXT NOT NULL,
      last_name TEXT NOT NULL,
      first_name TEXT NOT NULL,
      middle_name TEXT,
      address_line1 TEXT,
      city TEXT,
      state TEXT,
      postal_code TEXT,
      date_of_birth TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_ucie_sessions_workspace ON ucie_import_sessions(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_ucie_rows_session ON ucie_import_rows(session_id);
    CREATE INDEX IF NOT EXISTS idx_ucie_work_open ON ucie_work_items(workspace_id, status);
    CREATE INDEX IF NOT EXISTS idx_ucie_voter_county ON ucie_voter_records(workspace_id, county, last_name);
    CREATE INDEX IF NOT EXISTS idx_ucie_provenance_contact ON ucie_field_provenance(contact_id, field_name);
  `);
}
