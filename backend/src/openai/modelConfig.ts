import { isProviderCredentialConfigured, isAnyProviderConfigured } from "../providers/credentials.js";

export type ModelConfig = {
  model: string;
  maxOutputTokens: number;
  temperature: number;
};

export function getModelConfig(): ModelConfig {
  return {
    model: process.env.LOCALBRAIN_DEFAULT_MODEL?.trim() || "gpt-4.1-mini",
    maxOutputTokens: Number(process.env.LOCALBRAIN_MAX_OUTPUT_TOKENS ?? 1024),
    temperature: Number(process.env.LOCALBRAIN_MODEL_TEMPERATURE ?? 0.4),
  };
}

export function isOpenAiKeyConfigured(): boolean {
  return isProviderCredentialConfigured("openai");
}

/** @deprecated Use provider vault — only openaiAdapter should resolve keys */
export function getOpenAiApiKey(): string | null {
  if (!isOpenAiKeyConfigured()) return null;
  return isAnyProviderConfigured() ? "***" : null;
}
