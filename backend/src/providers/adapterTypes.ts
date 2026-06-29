import type { AIProviderId, AICapability } from "@localbrain/shared";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AdapterChatResult = {
  content: string;
  model: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

export type AdapterHealthResult = {
  health: "healthy" | "degraded" | "rate_limited" | "offline" | "not_configured";
  message: string;
  latency_ms: number | null;
};

export interface AIProviderAdapter {
  id: AIProviderId;
  label: string;
  capabilities: AICapability[];
  isConfigured(): boolean;
  chat(messages: ChatMessage[], modelOverride?: string | null): Promise<AdapterChatResult>;
  verifyConnection(): Promise<AdapterHealthResult>;
}

export class ProviderAdapterError extends Error {
  constructor(
    message: string,
    readonly providerId: AIProviderId,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ProviderAdapterError";
  }
}
