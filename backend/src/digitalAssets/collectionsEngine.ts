import { getDatabase } from "../db/database.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import type { DigitalAssetRow } from "./assetRegistry.js";
import { isLargeAsset, isStaleAsset } from "./assetHealth.js";

export type CollectionDef = {
  collection_id: string;
  title: string;
  description: string;
  query: string;
};

export const COLLECTION_DEFS: CollectionDef[] = [
  {
    collection_id: "col-focus-workspace",
    title: "Active workspace focus",
    description: "Assets under workspaces with a current_focus set",
    query: "focus:",
  },
  {
    collection_id: "col-touched-week",
    title: "Touched this week",
    description: "Modified within the last 7 days",
    query: "recent:",
  },
  {
    collection_id: "col-stale-dormant",
    title: "Stale & dormant",
    description: "Dormant or archive_candidate lifecycle stages",
    query: "stale:",
  },
  {
    collection_id: "col-large-assets",
    title: "Large assets (10MB+)",
    description: "Individual files at or above 10 MB",
    query: "large:",
  },
];

export function seedIntelligenceCollections(): void {
  const db = getDatabase();
  db.prepare(
    "DELETE FROM asset_collections WHERE collection_id IN ('col-stub-focus', 'col-stub-week')",
  ).run();
  db.prepare(
    "DELETE FROM asset_collection_members WHERE collection_id IN ('col-stub-focus', 'col-stub-week')",
  ).run();
  const insert = db.prepare(
    `INSERT OR REPLACE INTO asset_collections (collection_id, title, description, query, asset_count)
     VALUES (@collection_id, @title, @description, @query, NULL)`,
  );
  for (const col of COLLECTION_DEFS) {
    insert.run(col);
  }
}

function assetsForCollection(collectionId: string, allAssets: DigitalAssetRow[]): string[] {
  const weekCutoff = new Date(Date.now() - 7 * 86400000).toISOString();
  const focusWorkspaceIds = new Set(
    listWorkspaces()
      .filter((w) => w.current_focus && !w.flags.hidden)
      .map((w) => w.workspace_id),
  );

  switch (collectionId) {
    case "col-focus-workspace":
      return allAssets
        .filter((a) => a.workspace_id && focusWorkspaceIds.has(a.workspace_id))
        .map((a) => a.asset_id);
    case "col-touched-week":
      return allAssets
        .filter((a) => a.modified_at && a.modified_at >= weekCutoff)
        .map((a) => a.asset_id);
    case "col-stale-dormant":
      return allAssets.filter((a) => isStaleAsset(a)).map((a) => a.asset_id);
    case "col-large-assets":
      return allAssets.filter((a) => isLargeAsset(a)).map((a) => a.asset_id);
    default:
      return [];
  }
}

/** Refresh dynamic collection membership from registry — analyze only, no file ops. */
export function refreshCollectionMembers(allAssets?: DigitalAssetRow[]): void {
  const db = getDatabase();
  const assets =
    allAssets ??
    (db.prepare("SELECT * FROM digital_assets").all() as DigitalAssetRow[]);

  const deleteMembers = db.prepare("DELETE FROM asset_collection_members WHERE collection_id = ?");
  const insertMember = db.prepare(
    "INSERT OR IGNORE INTO asset_collection_members (collection_id, asset_id) VALUES (?, ?)",
  );
  const updateCount = db.prepare(
    "UPDATE asset_collections SET asset_count = ? WHERE collection_id = ?",
  );

  for (const col of COLLECTION_DEFS) {
    const memberIds = assetsForCollection(col.collection_id, assets);
    deleteMembers.run(col.collection_id);
    for (const assetId of memberIds) {
      insertMember.run(col.collection_id, assetId);
    }
    updateCount.run(memberIds.length, col.collection_id);
  }
}

export function getCollectionIdsForAsset(assetId: string): string[] {
  const rows = getDatabase()
    .prepare("SELECT collection_id FROM asset_collection_members WHERE asset_id = ?")
    .all(assetId) as { collection_id: string }[];
  return rows.map((r) => r.collection_id);
}

export function listPopulatedCollections(): {
  collection_id: string;
  title: string;
  description: string;
  query: string;
  asset_count: number | null;
}[] {
  return getDatabase()
    .prepare("SELECT * FROM asset_collections ORDER BY title")
    .all() as {
    collection_id: string;
    title: string;
    description: string;
    query: string;
    asset_count: number | null;
  }[];
}

export function getCollectionMembers(
  collectionId: string,
  limit = 25,
): DigitalAssetRow[] {
  return getDatabase()
    .prepare(
      `SELECT a.* FROM digital_assets a
       JOIN asset_collection_members m ON m.asset_id = a.asset_id
       WHERE m.collection_id = ?
       ORDER BY a.modified_at DESC LIMIT ?`,
    )
    .all(collectionId, limit) as DigitalAssetRow[];
}
