import { chatCompletion } from "../../openai/openaiClient.js";
import { getModelConfig } from "../../openai/modelConfig.js";
import type { AIProviderId } from "@localbrain/shared";
import type { AIProviderAdapter, AdapterChatResult, AdapterHealthResult, ChatMessage } from "../adapterTypes.js";
import { getOpenAiApiKeyForAdapter } from "../credentials.js";

export function createOpenAiAdapter(): AIProviderAdapter {
  return {
    id: "openai",
    label: "OpenAI",
    capabilities: ["reasoning", "fast_summary", "code", "writing"],
    isConfigured() {
      return Boolean(getOpenAiApiKeyForAdapter());
    },
    async chat(messages: ChatMessage[], modelOverride?: string | null): Promise<AdapterChatResult> {
      const key = getOpenAiApiKeyForAdapter();
      if (!key) {
        throw new Error("OpenAI credential not configured");
      }
      const config = getModelConfig();
      const result = await chatCompletion(messages, {
        apiKey: key,
        model: modelOverride ?? config.model,
        maxOutputTokens: config.maxOutputTokens,
        temperature: config.temperature,
      });
      return {
        content: result.content,
        model: result.model,
        usage: result.usage,
      };
    },
    async verifyConnection(): Promise<AdapterHealthResult> {
      const started = Date.now();
      if (!this.isConfigured()) {
        return {
          health: "not_configured",
          message: "No credential configured",
          latency_ms: null,
        };
      }
      try {
        await this.chat([{ role: "user", content: "ping" }], getModelConfig().model);
        return {
          health: "healthy",
          message: "Connection verified",
          latency_ms: Date.now() - started,
        };
      } catch (e) {
        return {
          health: "offline",
          message: e instanceof Error ? e.message : "Verification failed",
          latency_ms: Date.now() - started,
        };
      }
    },
  };
}

export function createPlaceholderAdapter(
  id: Exclude<AIProviderId, "openai">,
  label: string,
  capabilities: AIProviderAdapter["capabilities"],
): AIProviderAdapter {
  return {
    id,
    label,
    capabilities,
    isConfigured() {
      return false;
    },
    async chat(): Promise<AdapterChatResult> {
      throw new Error(`${label} adapter not configured (LB-OS-017 placeholder)`);
    },
    async verifyConnection(): Promise<AdapterHealthResult> {
      return {
        health: "not_configured",
        message: `${label} — configure credential to enable`,
        latency_ms: null,
      };
    },
  };
}
