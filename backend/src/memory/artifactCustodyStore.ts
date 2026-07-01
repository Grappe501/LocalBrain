import {
  deserializeArtifactCustodyEvent,
  type ArtifactCustodyEvent,
  serializeArtifactCustodyEvent,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export function insertArtifactCustodyEvent(event: ArtifactCustodyEvent): void {
  getDatabase()
    .prepare(
      `INSERT INTO memory_artifact_custody_events (
        custody_event_id, artifact_id, custody_event, payload_json, event_at, recorded_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      event.custody_event_id,
      event.artifact_id,
      event.custody_event,
      serializeArtifactCustodyEvent(event),
      event.event_at,
      event.recorded_at,
    );
}

export function getArtifactCustodyEventById(
  custodyEventId: string,
): ArtifactCustodyEvent | null {
  const row = getDatabase()
    .prepare(
      `SELECT payload_json FROM memory_artifact_custody_events WHERE custody_event_id = ?`,
    )
    .get(custodyEventId) as { payload_json: string } | undefined;
  if (!row) return null;
  return deserializeArtifactCustodyEvent(row.payload_json);
}

export function listArtifactCustodyEvents(artifactId: string): ArtifactCustodyEvent[] {
  const rows = getDatabase()
    .prepare(
      `SELECT payload_json FROM memory_artifact_custody_events
       WHERE artifact_id = ?
       ORDER BY event_at ASC, recorded_at ASC`,
    )
    .all(artifactId) as { payload_json: string }[];
  return rows.map((row) => deserializeArtifactCustodyEvent(row.payload_json));
}

export function countArtifactCustodyEvents(artifactId: string): number {
  const row = getDatabase()
    .prepare(
      `SELECT COUNT(*) AS count FROM memory_artifact_custody_events WHERE artifact_id = ?`,
    )
    .get(artifactId) as { count: number };
  return row.count;
}
