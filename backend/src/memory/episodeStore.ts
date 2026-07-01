import {
  assertLifecycleTransitionAllowed,
  deserializeEpisode,
  type Episode,
  serializeEpisode,
  type LifecycleState,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export class EpisodeNotFoundError extends Error {
  constructor(episodeId: string) {
    super(`Episode not found: ${episodeId}`);
    this.name = "EpisodeNotFoundError";
  }
}

export class EpisodeImmutableFieldError extends Error {
  constructor(field: string) {
    super(`Episode authoritative field is immutable: ${field}`);
    this.name = "EpisodeImmutableFieldError";
  }
}

export function insertEpisode(episode: Episode): void {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO memory_episodes (
      episode_id, domain, lifecycle_state, schema_version,
      payload_json, created_at, lifecycle_updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    episode.episode_id,
    episode.domain,
    episode.lifecycle_state,
    episode.schema_version,
    serializeEpisode(episode),
    episode.created_at,
    episode.created_at,
  );
}

export function getEpisodeById(episodeId: string): Episode | null {
  const row = getDatabase()
    .prepare(
      `SELECT payload_json FROM memory_episodes WHERE episode_id = ?`,
    )
    .get(episodeId) as { payload_json: string } | undefined;
  if (!row) return null;
  return deserializeEpisode(row.payload_json);
}

export function updateEpisodeLifecycleState(
  episodeId: string,
  nextState: LifecycleState,
  lifecycleUpdatedAt: string,
): Episode {
  const current = getEpisodeById(episodeId);
  if (!current) throw new EpisodeNotFoundError(episodeId);

  assertLifecycleTransitionAllowed(current.lifecycle_state, nextState);

  const updated: Episode = {
    ...current,
    lifecycle_state: nextState,
  };

  getDatabase()
    .prepare(
      `UPDATE memory_episodes
       SET lifecycle_state = ?, lifecycle_updated_at = ?
       WHERE episode_id = ?`,
    )
    .run(nextState, lifecycleUpdatedAt, episodeId);

  return updated;
}

/** Payload body is append-only — only lifecycle_state may change after insert. */
export function episodeContentFingerprint(episode: Episode): string {
  const { lifecycle_state: _state, ...content } = episode;
  return JSON.stringify(content);
}

export function assertEpisodeContentUnchanged(before: Episode, after: Episode): void {
  if (episodeContentFingerprint(before) !== episodeContentFingerprint(after)) {
    throw new EpisodeImmutableFieldError("payload");
  }
}

export function getEpisodePayloadRevisionCount(episodeId: string): number {
  const row = getDatabase()
    .prepare(`SELECT COUNT(*) AS count FROM memory_episodes WHERE episode_id = ?`)
    .get(episodeId) as { count: number };
  return row.count;
}
