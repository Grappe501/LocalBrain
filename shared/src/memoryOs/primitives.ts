import type { MemoryDomain } from "../foundation.js";

export type { MemoryDomain };

export const MEMORY_DOMAINS: readonly MemoryDomain[] = [
  "personal",
  "workspace",
  "system",
  "relationship",
  "learning",
  "executive",
] as const;

export type IdentityRef = {
  identity_id: string;
  identity_kind: string;
};

export type TrustLevel =
  | "system"
  | "verified"
  | "user_confirmed"
  | "observed"
  | "imported"
  | "derived"
  | "hypothesis";

export type TrustEnvelope = {
  level: TrustLevel;
  evaluated_at: string;
};

export type CaptureMethod = "direct" | "import" | "inference" | "system";

/** Memory-object provenance envelope — TRUST + S4 contract version. */
export type MemoryProvenanceEnvelope = {
  provenance_id: string;
  captured_by: IdentityRef;
  capture_method: CaptureMethod;
  source_ref: string;
  consent_ref: string | null;
  convention_provenance_version: string;
  trust: TrustEnvelope;
  recorded_at: string;
};

export function isMemoryDomain(value: string): value is MemoryDomain {
  return (MEMORY_DOMAINS as readonly string[]).includes(value);
}

export function isTrustLevel(value: string): value is TrustLevel {
  return (
    value === "system" ||
    value === "verified" ||
    value === "user_confirmed" ||
    value === "observed" ||
    value === "imported" ||
    value === "derived" ||
    value === "hypothesis"
  );
}

export function isIso8601(value: string): boolean {
  const ms = Date.parse(value);
  return Number.isFinite(ms);
}
