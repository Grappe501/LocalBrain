import { getDatabase } from "../db/database.js";
import type { AIProviderId } from "@localbrain/shared";

const PROVIDER_SEEDS: {
  id: AIProviderId;
  label: string;
  routing_priority: number;
  capabilities_json: string;
  default_model: string | null;
}[] = [
  {
    id: "openai",
    label: "OpenAI",
    routing_priority: 10,
    capabilities_json: JSON.stringify(["reasoning", "fast_summary", "code", "writing"]),
    default_model: "gpt-4.1-mini",
  },
  {
    id: "anthropic",
    label: "Claude (Anthropic)",
    routing_priority: 20,
    capabilities_json: JSON.stringify(["reasoning", "code", "writing"]),
    default_model: null,
  },
  {
    id: "google",
    label: "Google Gemini",
    routing_priority: 30,
    capabilities_json: JSON.stringify(["reasoning", "fast_summary"]),
    default_model: null,
  },
  {
    id: "xai",
    label: "Grok (xAI)",
    routing_priority: 40,
    capabilities_json: JSON.stringify(["reasoning"]),
    default_model: null,
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    routing_priority: 50,
    capabilities_json: JSON.stringify(["reasoning", "fast_summary", "code"]),
    default_model: null,
  },
  {
    id: "ollama",
    label: "Ollama (local)",
    routing_priority: 5,
    capabilities_json: JSON.stringify(["local_private", "embeddings", "fast_summary"]),
    default_model: null,
  },
  {
    id: "local_gpu",
    label: "Local GPU runtime",
    routing_priority: 6,
    capabilities_json: JSON.stringify(["local_private", "embeddings"]),
    default_model: null,
  },
];

export function migrateProviderTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS ai_providers (
      provider_id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 0,
      default_model TEXT,
      health TEXT NOT NULL DEFAULT 'not_configured',
      latency_p50_ms INTEGER,
      last_success_at TEXT,
      routing_priority INTEGER NOT NULL DEFAULT 100,
      capabilities_json TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ai_provider_credentials (
      provider_id TEXT PRIMARY KEY,
      credential_blob TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ai_flight_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT NOT NULL,
      capability TEXT NOT NULL,
      job_profile TEXT NOT NULL,
      routing_reason TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      model_id TEXT NOT NULL,
      prompt_tokens INTEGER,
      completion_tokens INTEGER,
      total_tokens INTEGER,
      estimated_cost_usd REAL,
      latency_ms INTEGER NOT NULL,
      success INTEGER NOT NULL,
      error_class TEXT,
      workspace_id TEXT,
      department_id TEXT,
      agent_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_ai_flight_log_created ON ai_flight_log(created_at);
    CREATE INDEX IF NOT EXISTS idx_ai_flight_log_provider ON ai_flight_log(provider_id);

    CREATE TABLE IF NOT EXISTS workspace_provider_overrides (
      workspace_id TEXT PRIMARY KEY,
      force_local INTEGER NOT NULL DEFAULT 0,
      preferred_provider_id TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const insert = getDatabase().prepare(
    `INSERT OR IGNORE INTO ai_providers
      (provider_id, label, enabled, default_model, routing_priority, capabilities_json)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );

  for (const seed of PROVIDER_SEEDS) {
    insert.run(
      seed.id,
      seed.label,
      seed.id === "openai" ? 1 : 0,
      seed.default_model,
      seed.routing_priority,
      seed.capabilities_json,
    );
  }
}
