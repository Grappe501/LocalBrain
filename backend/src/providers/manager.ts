import { getDatabase } from "../db/database.js";
import type {
  AIProviderId,
  AIProviderPublic,
  AIProvidersOverview,
  AICredentialStatus,
  UpdateAIProviderRequest,
  WorkspaceProviderOverride,
} from "@localbrain/shared";
import {
  createOpenAiAdapter,
  createPlaceholderAdapter,
} from "./adapters/openaiAdapter.js";
import type { AIProviderAdapter } from "./adapterTypes.js";
import { isProviderCredentialConfigured } from "./credentials.js";
import { getMonthlySpend } from "./flightRecorder.js";
import { clearProviderCredential, saveProviderCredential } from "./vault.js";

type ProviderRow = {
  provider_id: AIProviderId;
  label: string;
  enabled: number;
  default_model: string | null;
  health: string;
  latency_p50_ms: number | null;
  last_success_at: string | null;
  routing_priority: number;
  capabilities_json: string;
};

function credentialStatus(id: AIProviderId): AICredentialStatus {
  if (!isProviderCredentialConfigured(id)) return "missing";
  return "configured";
}

function rowToPublic(row: ProviderRow): AIProviderPublic {
  return {
    id: row.provider_id,
    label: row.label,
    enabled: row.enabled === 1,
    credential_status: credentialStatus(row.provider_id),
    default_model: row.default_model,
    health: row.health as AIProviderPublic["health"],
    latency_p50_ms: row.latency_p50_ms,
    last_success_at: row.last_success_at,
    monthly_spend_usd: Math.round(getMonthlySpend(row.provider_id) * 100) / 100,
    capabilities: JSON.parse(row.capabilities_json || "[]") as string[],
    routing_priority: row.routing_priority,
  };
}

function listRows(): ProviderRow[] {
  return getDatabase()
    .prepare(
      `SELECT provider_id, label, enabled, default_model, health, latency_p50_ms,
              last_success_at, routing_priority, capabilities_json
       FROM ai_providers
       ORDER BY routing_priority ASC, label ASC`,
    )
    .all() as ProviderRow[];
}

export function getProvidersOverview(): AIProvidersOverview {
  const providers = listRows().map(rowToPublic);
  const primary =
    providers.find((p) => p.enabled && p.credential_status === "configured") ?? null;
  return {
    providers,
    primary_provider_id: primary?.id ?? null,
    any_configured: providers.some((p) => p.credential_status === "configured"),
    read_only: false,
    observed_at: new Date().toISOString(),
  };
}

export function getProviderAdapter(id: AIProviderId): AIProviderAdapter {
  switch (id) {
    case "openai":
      return createOpenAiAdapter();
    case "anthropic":
      return createPlaceholderAdapter("anthropic", "Claude (Anthropic)", [
        "reasoning",
        "code",
        "writing",
      ]);
    case "google":
      return createPlaceholderAdapter("google", "Google Gemini", ["reasoning", "fast_summary"]);
    case "xai":
      return createPlaceholderAdapter("xai", "Grok (xAI)", ["reasoning"]);
    case "openrouter":
      return createPlaceholderAdapter("openrouter", "OpenRouter", [
        "reasoning",
        "fast_summary",
        "code",
      ]);
    case "ollama":
      return createPlaceholderAdapter("ollama", "Ollama (local)", [
        "local_private",
        "embeddings",
        "fast_summary",
      ]);
    case "local_gpu":
      return createPlaceholderAdapter("local_gpu", "Local GPU runtime", [
        "local_private",
        "embeddings",
      ]);
    default:
      return createPlaceholderAdapter("openrouter", "Unknown", ["reasoning"]);
  }
}

export function updateProvider(id: AIProviderId, patch: UpdateAIProviderRequest): AIProviderPublic {
  const row = listRows().find((r) => r.provider_id === id);
  if (!row) throw new Error(`Unknown provider: ${id}`);

  const enabled = patch.enabled !== undefined ? (patch.enabled ? 1 : 0) : row.enabled;
  const defaultModel =
    patch.default_model !== undefined ? patch.default_model : row.default_model;

  getDatabase()
    .prepare(
      `UPDATE ai_providers SET enabled = ?, default_model = ?, updated_at = datetime('now')
       WHERE provider_id = ?`,
    )
    .run(enabled, defaultModel, id);

  return rowToPublic({ ...row, enabled, default_model: defaultModel });
}

export function storeProviderCredential(id: AIProviderId, apiKey: string): void {
  saveProviderCredential(id, apiKey);
  getDatabase()
    .prepare(
      `UPDATE ai_providers SET health = 'not_configured', updated_at = datetime('now')
       WHERE provider_id = ?`,
    )
    .run(id);
}

export function revokeProviderCredential(id: AIProviderId): void {
  clearProviderCredential(id);
  getDatabase()
    .prepare(
      `UPDATE ai_providers SET health = 'not_configured', updated_at = datetime('now')
       WHERE provider_id = ?`,
    )
    .run(id);
}

export function getWorkspaceProviderOverride(
  workspaceId: string,
): WorkspaceProviderOverride | null {
  const row = getDatabase()
    .prepare(
      `SELECT workspace_id, force_local, preferred_provider_id
       FROM workspace_provider_overrides WHERE workspace_id = ?`,
    )
    .get(workspaceId) as
    | { workspace_id: string; force_local: number; preferred_provider_id: AIProviderId | null }
    | undefined;
  if (!row) return null;
  return {
    workspace_id: row.workspace_id,
    force_local: row.force_local === 1,
    preferred_provider_id: row.preferred_provider_id,
  };
}

export function setWorkspaceProviderOverride(
  override: WorkspaceProviderOverride,
): WorkspaceProviderOverride {
  getDatabase()
    .prepare(
      `INSERT INTO workspace_provider_overrides (workspace_id, force_local, preferred_provider_id, updated_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(workspace_id) DO UPDATE SET
         force_local = excluded.force_local,
         preferred_provider_id = excluded.preferred_provider_id,
         updated_at = datetime('now')`,
    )
    .run(
      override.workspace_id,
      override.force_local ? 1 : 0,
      override.preferred_provider_id,
    );
  return override;
}

export function listEnabledRoutableProviders(): AIProviderPublic[] {
  return listRows()
    .map(rowToPublic)
    .filter((p) => p.enabled && p.credential_status === "configured");
}
