import type { WorkspaceEventType } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { rowToEvent, type WorkspaceEventRow } from "./workspaceMappers.js";

export function appendWorkspaceEvent(input: {
  workspace_id: string;
  event_type: WorkspaceEventType;
  title: string;
  detail?: string;
  metadata?: Record<string, unknown>;
}): WorkspaceEventRow {
  const db = getDatabase();
  const result = db
    .prepare(
      `INSERT INTO workspace_events (workspace_id, event_type, title, detail, metadata_json, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    )
    .run(
      input.workspace_id,
      input.event_type,
      input.title,
      input.detail ?? "",
      JSON.stringify(input.metadata ?? {}),
    );

  return db
    .prepare("SELECT * FROM workspace_events WHERE id = ?")
    .get(result.lastInsertRowid) as WorkspaceEventRow;
}

export function getWorkspaceEvents(workspaceId: string, limit = 50) {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM workspace_events WHERE workspace_id = ? ORDER BY id DESC LIMIT ?`,
    )
    .all(workspaceId, limit) as WorkspaceEventRow[];

  return rows.map(rowToEvent).reverse();
}
