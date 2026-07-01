import type { MemoryDomain } from "./primitives.js";
import type { IdentityRef, MemoryProvenanceEnvelope, TrustEnvelope } from "./primitives.js";
import type { LifecycleState } from "./lifecycle.js";
import { FACT_SCHEMA_VERSION } from "./constants.js";

/** Canonical Fact — Volume 2 § Facts (memory-spec-v1.0). */
export type Fact = {
  fact_id: string;
  schema_version: typeof FACT_SCHEMA_VERSION | string;
  domain: MemoryDomain;
  statement: string;
  subject_ref: IdentityRef;
  predicate: string;
  object_ref?: string;
  confidence: TrustEnvelope;
  valid_from?: string;
  valid_until?: string;
  lifecycle_state: LifecycleState;
  provenance: MemoryProvenanceEnvelope;
  event_at: string;
  created_at: string;
};

export const FACT_FIELD_KEYS = [
  "fact_id",
  "schema_version",
  "domain",
  "statement",
  "subject_ref",
  "predicate",
  "object_ref",
  "confidence",
  "valid_from",
  "valid_until",
  "lifecycle_state",
  "provenance",
  "event_at",
  "created_at",
] as const;

export type FactFieldKey = (typeof FACT_FIELD_KEYS)[number];

export function serializeFact(fact: Fact): string {
  return JSON.stringify(fact);
}

export function deserializeFact(json: string): Fact {
  return JSON.parse(json) as Fact;
}

export function factsEquivalent(a: Fact, b: Fact): boolean {
  return serializeFact(a) === serializeFact(b);
}
