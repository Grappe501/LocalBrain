import type { MemoryDomain } from "./primitives.js";
import type { MemoryProvenanceEnvelope } from "./primitives.js";
import type { LifecycleState } from "./lifecycle.js";
import { ARTIFACT_SCHEMA_VERSION } from "./constants.js";

/** Canonical Artifact — Volume 2 § Artifacts (memory-spec-v1.0). */
export type Artifact = {
  artifact_id: string;
  schema_version: typeof ARTIFACT_SCHEMA_VERSION | string;
  domain: MemoryDomain;
  uri?: string;
  content_ref?: string;
  mime_type: string;
  project_ref?: string;
  content_hash?: string;
  lifecycle_state: LifecycleState;
  provenance: MemoryProvenanceEnvelope;
  event_at: string;
  created_at: string;
};

export const ARTIFACT_FIELD_KEYS = [
  "artifact_id",
  "schema_version",
  "domain",
  "uri",
  "content_ref",
  "mime_type",
  "project_ref",
  "content_hash",
  "lifecycle_state",
  "provenance",
  "event_at",
  "created_at",
] as const;

export type ArtifactFieldKey = (typeof ARTIFACT_FIELD_KEYS)[number];

export function serializeArtifact(artifact: Artifact): string {
  return JSON.stringify(artifact);
}

export function deserializeArtifact(json: string): Artifact {
  return JSON.parse(json) as Artifact;
}

export function artifactsEquivalent(a: Artifact, b: Artifact): boolean {
  return serializeArtifact(a) === serializeArtifact(b);
}
