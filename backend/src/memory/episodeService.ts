import {
  EPISODE_INITIAL_LIFECYCLE,
  EPISODE_KIND,
  EPISODE_SCHEMA_VERSION,
  type CaptureMethod,
  type Episode,
  type IdentityRef,
  type LifecycleState,
  type MemoryDomain,
  type TrustLevel,
} from "@localbrain/shared";
import { appendMemoryAuditEvent } from "./auditLog.js";
import {
  getEpisodeById,
  insertEpisode,
  updateEpisodeLifecycleState,
} from "./episodeStore.js";
import { assertEpisodeSchemaVersion, validateEpisodeRecord } from "./episodeValidator.js";
import { buildMemoryProvenanceEnvelope, MEMORY_AUDIT_OBJECT_EPISODE } from "./provenanceEnvelope.js";

export type CreateEpisodeInput = {
  domain: MemoryDomain;
  started_at: string;
  source_ref: string;
  event_at: string;
  captured_by: IdentityRef;
  capture_method: CaptureMethod;
  title?: string;
  ended_at?: string;
  participants?: IdentityRef[];
  consent_ref?: string | null;
  trust_level?: TrustLevel;
};

export function createEpisode(input: CreateEpisodeInput): Episode {
  const createdAt = new Date().toISOString();
  const provenance = buildMemoryProvenanceEnvelope({
    captured_by: input.captured_by,
    capture_method: input.capture_method,
    source_ref: input.source_ref,
    consent_ref: input.consent_ref,
    trust_level: input.trust_level,
    recorded_at: createdAt,
  });

  const draft: Episode = {
    episode_id: crypto.randomUUID(),
    schema_version: EPISODE_SCHEMA_VERSION,
    domain: input.domain,
    title: input.title,
    started_at: input.started_at,
    ended_at: input.ended_at,
    participants: input.participants,
    source_ref: input.source_ref,
    lifecycle_state: EPISODE_INITIAL_LIFECYCLE,
    provenance,
    event_at: input.event_at,
    created_at: createdAt,
  };

  const episode = validateEpisodeRecord(draft);
  assertEpisodeSchemaVersion(episode);
  insertEpisode(episode);

  appendMemoryAuditEvent({
    event_type: "memory.capture",
    object_type: MEMORY_AUDIT_OBJECT_EPISODE,
    object_id: episode.episode_id,
    to_state: episode.lifecycle_state,
    actor_identity_id: input.captured_by.identity_id,
    detail: { domain: episode.domain, engine: "ENG-MEM-001" },
  });

  return episode;
}

export function transitionEpisodeLifecycle(
  episodeId: string,
  nextState: LifecycleState,
  actor: IdentityRef,
  eventType: string,
): Episode {
  const before = getEpisodeById(episodeId);
  if (!before) {
    throw new Error(`Episode not found: ${episodeId}`);
  }

  const updated = updateEpisodeLifecycleState(episodeId, nextState, new Date().toISOString());
  validateEpisodeRecord(updated);

  appendMemoryAuditEvent({
    event_type: eventType,
    object_type: EPISODE_KIND,
    object_id: episodeId,
    from_state: before.lifecycle_state,
    to_state: nextState,
    actor_identity_id: actor.identity_id,
  });

  return updated;
}

export function verifyEpisode(episodeId: string, actor: IdentityRef): Episode {
  return transitionEpisodeLifecycle(episodeId, "Verified", actor, "memory.verify");
}
