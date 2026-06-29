import type { AIProviderId } from "@localbrain/shared";
import { getProviderCredential, hasVaultCredential } from "./vault.js";

/** Credential resolution — vault first, then env bootstrap for OpenAI only. */
export function getOpenAiApiKeyForAdapter(): string | null {
  const fromVault = getProviderCredential("openai");
  if (fromVault) return fromVault;
  const env = process.env.OPENAI_API_KEY?.trim();
  return env || null;
}

export function isProviderCredentialConfigured(providerId: AIProviderId): boolean {
  if (hasVaultCredential(providerId)) return true;
  if (providerId === "openai") {
    return Boolean(process.env.OPENAI_API_KEY?.trim());
  }
  return false;
}

export function isAnyProviderConfigured(): boolean {
  return isProviderCredentialConfigured("openai");
}
