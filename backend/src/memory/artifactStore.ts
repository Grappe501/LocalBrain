import {
  assertLifecycleTransitionAllowed,
  deserializeArtifact,
  type Artifact,
  serializeArtifact,
  type LifecycleState,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export class ArtifactNotFoundError extends Error {
  constructor(artifactId: string) {
    super(`Artifact not found: ${artifactId}`);
    this.name = "ArtifactNotFoundError";
  }
}

export class ArtifactImmutableFieldError extends Error {
  constructor(field: string) {
    super(`Artifact authoritative field is immutable: ${field}`);
    this.name = "ArtifactImmutableFieldError";
  }
}

export function insertArtifact(artifact: Artifact): void {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO memory_artifacts (
      artifact_id, domain, lifecycle_state, schema_version,
      payload_json, created_at, lifecycle_updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    artifact.artifact_id,
    artifact.domain,
    artifact.lifecycle_state,
    artifact.schema_version,
    serializeArtifact(artifact),
    artifact.created_at,
    artifact.created_at,
  );
}

export function getArtifactById(artifactId: string): Artifact | null {
  const row = getDatabase()
    .prepare(`SELECT payload_json FROM memory_artifacts WHERE artifact_id = ?`)
    .get(artifactId) as { payload_json: string } | undefined;
  if (!row) return null;
  return deserializeArtifact(row.payload_json);
}

export function updateArtifactLifecycleState(
  artifactId: string,
  nextState: LifecycleState,
  lifecycleUpdatedAt: string,
): Artifact {
  const current = getArtifactById(artifactId);
  if (!current) throw new ArtifactNotFoundError(artifactId);

  assertLifecycleTransitionAllowed(current.lifecycle_state, nextState);

  const updated: Artifact = {
    ...current,
    lifecycle_state: nextState,
  };

  getDatabase()
    .prepare(
      `UPDATE memory_artifacts
       SET lifecycle_state = ?, payload_json = ?, lifecycle_updated_at = ?
       WHERE artifact_id = ?`,
    )
    .run(nextState, serializeArtifact(updated), lifecycleUpdatedAt, artifactId);

  return updated;
}

/** Payload body is append-only — only lifecycle_state may change after insert. */
export function artifactContentFingerprint(artifact: Artifact): string {
  const { lifecycle_state: _state, ...content } = artifact;
  return JSON.stringify(content);
}

export function assertArtifactContentUnchanged(before: Artifact, after: Artifact): void {
  if (artifactContentFingerprint(before) !== artifactContentFingerprint(after)) {
    throw new ArtifactImmutableFieldError("payload");
  }
}

export function getArtifactPayloadRevisionCount(artifactId: string): number {
  const row = getDatabase()
    .prepare(`SELECT COUNT(*) AS count FROM memory_artifacts WHERE artifact_id = ?`)
    .get(artifactId) as { count: number };
  return row.count;
}
