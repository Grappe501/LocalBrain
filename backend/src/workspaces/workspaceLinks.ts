import { getDatabase } from "../db/database.js";

export function getWorkspaceLinks(workspaceId: string) {
  const rows = getDatabase()
    .prepare(
      `SELECT id, from_workspace_id, to_entity_type, to_entity_id, relationship_type, metadata_json, created_at
       FROM workspace_links WHERE from_workspace_id = ? ORDER BY id`,
    )
    .all(workspaceId) as Array<{
    id: number;
    from_workspace_id: string;
    to_entity_type: string;
    to_entity_id: string;
    relationship_type: string | null;
    metadata_json: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    from_workspace_id: row.from_workspace_id,
    to_entity_type: row.to_entity_type,
    to_entity_id: row.to_entity_id,
    relationship_type: row.relationship_type,
    metadata: JSON.parse(row.metadata_json) as Record<string, unknown>,
    created_at: row.created_at,
  }));
}
