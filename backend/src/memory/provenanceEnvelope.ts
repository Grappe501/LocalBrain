import {
  CON_S4_VERSION,
  EPISODE_KIND,
  FACT_KIND,
  type CaptureMethod,
  type IdentityRef,
  type MemoryProvenanceEnvelope,
  type TrustLevel,
} from "@localbrain/shared";

export type BuildProvenanceInput = {
  captured_by: IdentityRef;
  capture_method: CaptureMethod;
  source_ref: string;
  consent_ref?: string | null;
  trust_level?: TrustLevel;
  recorded_at: string;
};

export function buildMemoryProvenanceEnvelope(
  input: BuildProvenanceInput,
): MemoryProvenanceEnvelope {
  return {
    provenance_id: `PRV-${crypto.randomUUID()}`,
    captured_by: input.captured_by,
    capture_method: input.capture_method,
    source_ref: input.source_ref,
    consent_ref: input.consent_ref ?? null,
    convention_provenance_version: CON_S4_VERSION,
    trust: {
      level: input.trust_level ?? "observed",
      evaluated_at: input.recorded_at,
    },
    recorded_at: input.recorded_at,
  };
}

export const MEMORY_AUDIT_OBJECT_EPISODE = EPISODE_KIND;
export const MEMORY_AUDIT_OBJECT_FACT = FACT_KIND;
