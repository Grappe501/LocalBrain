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

    CREATE TABLE IF NOT EXISTS memory_facts (
      fact_id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      lifecycle_state TEXT NOT NULL,
      schema_version TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      lifecycle_updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_memory_facts_domain ON memory_facts(domain);
    CREATE INDEX IF NOT EXISTS idx_memory_facts_lifecycle ON memory_facts(lifecycle_state);

    CREATE TABLE IF NOT EXISTS memory_artifacts (
      artifact_id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      lifecycle_state TEXT NOT NULL,
      schema_version TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      lifecycle_updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_memory_artifacts_domain ON memory_artifacts(domain);
    CREATE INDEX IF NOT EXISTS idx_memory_artifacts_lifecycle ON memory_artifacts(lifecycle_state);

    CREATE TABLE IF NOT EXISTS memory_conversations (
      conversation_id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      lifecycle_state TEXT NOT NULL,
      schema_version TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      lifecycle_updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_memory_conversations_domain ON memory_conversations(domain);
    CREATE INDEX IF NOT EXISTS idx_memory_conversations_lifecycle ON memory_conversations(lifecycle_state);

    CREATE TABLE IF NOT EXISTS memory_conversation_turns (
      turn_id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sequence INTEGER NOT NULL,
      payload_json TEXT NOT NULL,
      event_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_memory_conversation_turns_conversation
      ON memory_conversation_turns(conversation_id, sequence);

    CREATE TABLE IF NOT EXISTS memory_decision_citations (
      citation_id TEXT PRIMARY KEY,
      decision_id TEXT NOT NULL,
      lifecycle_state TEXT NOT NULL,
      schema_version TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      lifecycle_updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_memory_decision_citations_decision
      ON memory_decision_citations(decision_id);
    CREATE INDEX IF NOT EXISTS idx_memory_decision_citations_lifecycle
      ON memory_decision_citations(lifecycle_state);

    CREATE TABLE IF NOT EXISTS memory_artifact_custody_events (
      custody_event_id TEXT PRIMARY KEY,
      artifact_id TEXT NOT NULL,
      custody_event TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      event_at TEXT NOT NULL,
      recorded_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_memory_artifact_custody_artifact
      ON memory_artifact_custody_events(artifact_id, event_at);

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
