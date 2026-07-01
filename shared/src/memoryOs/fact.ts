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
  /** Newer fact that replaced this one (lineage — set on superseded record). */
  superseded_by?: string;
  /** When authority transferred to `superseded_by` (TIME_MODEL). */
  superseded_at?: string;
  /** Prior fact this record replaces (lineage — set on correcting record). */
  supersedes?: string;
  /** Required when `supersedes` is set — chain integrity (TIME_MODEL). */
  supersession_reason?: string;
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
  "superseded_by",
  "superseded_at",
  "supersedes",
  "supersession_reason",
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
