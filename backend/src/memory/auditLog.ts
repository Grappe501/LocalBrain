import { getDatabase } from "../db/database.js";

export type MemoryAuditEventInput = {
  event_type: string;
  object_type: string;
  object_id: string;
  from_state?: string | null;
  to_state?: string | null;
  actor_identity_id?: string | null;
  detail?: Record<string, unknown>;
};

export function appendMemoryAuditEvent(input: MemoryAuditEventInput): number {
  const db = getDatabase();
  const result = db
    .prepare(
      `INSERT INTO memory_audit_events (
        event_type, object_type, object_id, from_state, to_state,
        actor_identity_id, detail_json, recorded_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    )
    .run(
      input.event_type,
      input.object_type,
      input.object_id,
      input.from_state ?? null,
      input.to_state ?? null,
      input.actor_identity_id ?? null,
      JSON.stringify(input.detail ?? {}),
    );
  return Number(result.lastInsertRowid);
}

export function countAuditEventsForObject(objectType: string, objectId: string): number {
  const row = getDatabase()
    .prepare(
      `SELECT COUNT(*) AS count FROM memory_audit_events
       WHERE object_type = ? AND object_id = ?`,
    )
    .get(objectType, objectId) as { count: number };
  return row.count;
}
