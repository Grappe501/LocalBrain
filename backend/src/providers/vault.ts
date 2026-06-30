import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { getDatabase } from "../db/database.js";
import type { AIProviderId } from "@localbrain/shared";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;

function vaultKey(): Buffer {
  const secret = process.env.LOCALBRAIN_VAULT_SECRET?.trim() || "localbrain-dev-vault-v1";
  return scryptSync(secret, "localbrain-ai-vault", 32);
}

function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, vaultKey(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

function decrypt(blob: string): string {
  const buf = Buffer.from(blob, "base64");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + 16);
  const data = buf.subarray(IV_LEN + 16);
  const decipher = createDecipheriv(ALGO, vaultKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

export function saveProviderCredential(providerId: AIProviderId, apiKey: string): void {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    throw new Error("API key cannot be empty");
  }
  const blob = encrypt(trimmed);
  getDatabase()
    .prepare(
      `INSERT INTO ai_provider_credentials (provider_id, credential_blob, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(provider_id) DO UPDATE SET
         credential_blob = excluded.credential_blob,
         updated_at = datetime('now')`,
    )
    .run(providerId, blob);
}

export function getProviderCredential(providerId: AIProviderId): string | null {
  const row = getDatabase()
    .prepare("SELECT credential_blob FROM ai_provider_credentials WHERE provider_id = ?")
    .get(providerId) as { credential_blob: string } | undefined;
  if (!row?.credential_blob) return null;
  try {
    return decrypt(row.credential_blob);
  } catch {
    return null;
  }
}

export function clearProviderCredential(providerId: AIProviderId): void {
  getDatabase().prepare("DELETE FROM ai_provider_credentials WHERE provider_id = ?").run(providerId);
}

export function hasVaultCredential(providerId: AIProviderId): boolean {
  return getProviderCredential(providerId) !== null;
}

/** True when LOCALBRAIN_VAULT_SECRET is set (production posture). Dev uses embedded default. */
export function isVaultConfigured(): boolean {
  return Boolean(process.env.LOCALBRAIN_VAULT_SECRET?.trim());
}

export function isVaultUsingDevDefault(): boolean {
  return !process.env.LOCALBRAIN_VAULT_SECRET?.trim();
}

/** Never log or return credential values outside this module. */
export function redactSecret(value: string): string {
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 3)}••••${value.slice(-2)}`;
}
