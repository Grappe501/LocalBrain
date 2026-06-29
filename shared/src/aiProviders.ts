/** AI Provider Management contracts — LB-OS-017 */

export type AIProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "openrouter"
  | "ollama"
  | "local_gpu";

export type AICapability =
  | "reasoning"
  | "fast_summary"
  | "code"
  | "writing"
  | "embeddings"
  | "local_private";

export type AIProviderHealthStatus =
  | "healthy"
  | "degraded"
  | "rate_limited"
  | "offline"
  | "not_configured";

export type AICredentialStatus = "configured" | "missing" | "invalid" | "expired";

export interface AIProviderPublic {
  id: AIProviderId;
  label: string;
  enabled: boolean;
  credential_status: AICredentialStatus;
  default_model: string | null;
  health: AIProviderHealthStatus;
  latency_p50_ms: number | null;
  last_success_at: string | null;
  monthly_spend_usd: number;
  capabilities: string[];
  routing_priority: number;
}

export interface AIProvidersOverview {
  providers: AIProviderPublic[];
  primary_provider_id: AIProviderId | null;
  any_configured: boolean;
  read_only: false;
  observed_at: string;
}

export interface AIProviderVerifyResult {
  provider_id: AIProviderId;
  ok: boolean;
  health: AIProviderHealthStatus;
  message: string;
  latency_ms: number | null;
}

export interface AIFlightRecordPublic {
  id: number;
  request_id: string;
  capability: AICapability;
  job_profile: string;
  routing_reason: string;
  provider_id: AIProviderId;
  model_id: string;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
  estimated_cost_usd: number | null;
  latency_ms: number;
  success: boolean;
  workspace_id: string | null;
  department_id: string | null;
  created_at: string;
}

export interface AIProvidersDockSummary {
  primary_provider_id: AIProviderId | null;
  primary_provider_label: string;
  api_status: "online" | "offline" | "not_configured";
  tokens_today: number;
  estimated_cost_usd_today: number;
  command_count_today: number;
  model: string | null;
}

export interface UpdateAIProviderRequest {
  enabled?: boolean;
  default_model?: string | null;
}

export interface SaveAIProviderCredentialRequest {
  api_key: string;
}

export interface WorkspaceProviderOverride {
  workspace_id: string;
  force_local: boolean;
  preferred_provider_id: AIProviderId | null;
}
