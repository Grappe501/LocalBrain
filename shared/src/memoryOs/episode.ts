import type { MemoryDomain } from "./primitives.js";
import type { IdentityRef, MemoryProvenanceEnvelope } from "./primitives.js";
import type { LifecycleState } from "./lifecycle.js";
import { EPISODE_SCHEMA_VERSION } from "./constants.js";

/** Canonical Episode — Volume 2 § Episodes (memory-spec-v1.0). */
export type Episode = {
  episode_id: string;
  schema_version: typeof EPISODE_SCHEMA_VERSION | string;
  domain: MemoryDomain;
  title?: string;
  started_at: string;
  ended_at?: string;
  participants?: IdentityRef[];
  source_ref: string;
  lifecycle_state: LifecycleState;
  provenance: MemoryProvenanceEnvelope;
  event_at: string;
  created_at: string;
};

export const EPISODE_FIELD_KEYS = [
  "episode_id",
  "schema_version",
  "domain",
  "title",
  "started_at",
  "ended_at",
  "participants",
  "source_ref",
  "lifecycle_state",
  "provenance",
  "event_at",
  "created_at",
] as const;

export type EpisodeFieldKey = (typeof EPISODE_FIELD_KEYS)[number];

export function serializeEpisode(episode: Episode): string {
  return JSON.stringify(episode);
}

export function deserializeEpisode(json: string): Episode {
  return JSON.parse(json) as Episode;
}

export function episodesEquivalent(a: Episode, b: Episode): boolean {
  return serializeEpisode(a) === serializeEpisode(b);
}
