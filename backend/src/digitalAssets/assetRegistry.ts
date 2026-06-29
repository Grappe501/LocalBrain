import path from "node:path";
import type { AssetLifecycleStage, DigitalAssetKind } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import type { FileIndexRow } from "../knowledgeExplorer/migrate.js";
import {
  detectAssetKind,
  inferLifecycleStage,
  pathToAssetId,
} from "./assetUtils.js";
import { computeHealthScore } from "./assetHealth.js";
import { getCollectionIdsForAsset } from "./collectionsEngine.js";
import { seedIntelligenceCollections } from "./collectionsEngine.js";

export type DigitalAssetRow = {
  asset_id: string;
  path: string;
  name: string;
  kind: string;
  is_directory: number;
  hash: string | null;
  size_bytes: number | null;
  created_at: string | null;
  modified_at: string | null;
  last_referenced_at: string | null;
  workspace_id: string | null;
  knowledge_source_id: string;
  owner: string;
  health_score: number | null;
  lifecycle_stage: string;
  duplicate_group_id: string | null;
  version_cluster_id: string | null;
  summary: string;
  tags_json: string;
  synced_at: string;
};

export function migrateDigitalAssetTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS digital_assets (
      asset_id TEXT PRIMARY KEY,
      path TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'unknown',
      is_directory INTEGER NOT NULL DEFAULT 0,
      hash TEXT,
      size_bytes INTEGER,
      created_at TEXT,
      modified_at TEXT,
      last_referenced_at TEXT,
      workspace_id TEXT,
      knowledge_source_id TEXT NOT NULL DEFAULT 'filesystem',
      owner TEXT NOT NULL DEFAULT 'steve',
      health_score REAL,
      lifecycle_stage TEXT NOT NULL DEFAULT 'created',
      duplicate_group_id TEXT,
      version_cluster_id TEXT,
      summary TEXT NOT NULL DEFAULT '',
      tags_json TEXT NOT NULL DEFAULT '[]',
      synced_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS asset_collections (
      collection_id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      query TEXT NOT NULL DEFAULT '',
      asset_count INTEGER
    );

    CREATE TABLE IF NOT EXISTS asset_collection_members (
      collection_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      PRIMARY KEY (collection_id, asset_id)
    );

    CREATE TABLE IF NOT EXISTS asset_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_digital_assets_workspace ON digital_assets(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_digital_assets_lifecycle ON digital_assets(lifecycle_stage);
    CREATE INDEX IF NOT EXISTS idx_digital_assets_mtime ON digital_assets(modified_at);
  `);

  seedIntelligenceCollections();
  migrateFileIndexRowsToDigitalAssets();
}

/** One-time migration: LB-OS-005 file_index → digital_assets (006). */
export function migrateFileIndexRowsToDigitalAssets(): void {
  const db = getDatabase();
  const rows = db.prepare("SELECT * FROM file_index").all() as FileIndexRow[];
  for (const row of rows) {
    upsertDigitalAssetFromIndexRow(row);
  }
}

function syncFileIndexFromAsset(row: DigitalAssetRow): void {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO file_index (path, name, is_directory, size_bytes, mtime, workspace_id, excerpt, indexed_at)
     VALUES (@path, @name, @is_directory, @size_bytes, @modified_at, @workspace_id, @summary, datetime('now'))
     ON CONFLICT(path) DO UPDATE SET
       name = excluded.name,
       is_directory = excluded.is_directory,
       size_bytes = excluded.size_bytes,
       mtime = excluded.mtime,
       workspace_id = excluded.workspace_id,
       excerpt = excluded.excerpt,
       indexed_at = datetime('now')`,
  ).run({
    path: row.path,
    name: row.name,
    is_directory: row.is_directory,
    size_bytes: row.size_bytes,
    modified_at: row.modified_at,
    workspace_id: row.workspace_id,
    summary: row.summary || (row.is_directory ? "directory" : ""),
  });

  db.prepare("DELETE FROM file_index_fts WHERE path = ?").run(row.path);
  db.prepare("INSERT INTO file_index_fts (path, name, excerpt) VALUES (?, ?, ?)").run(
    row.path,
    row.name,
    row.summary || (row.is_directory ? "directory" : ""),
  );
}

export type UpsertAssetInput = {
  path: string;
  name: string;
  is_directory: boolean;
  size_bytes: number | null;
  mtime: string | null;
  created_at?: string | null;
  workspace_id: string | null;
  hash?: string | null;
};

export function upsertDigitalAsset(input: UpsertAssetInput): DigitalAssetRow {
  const kind = detectAssetKind(input.name, input.is_directory);
  const lifecycle = inferLifecycleStage(input.mtime, input.is_directory);
  const assetId = pathToAssetId(input.path);

  const draftRow = {
    asset_id: assetId,
    path: input.path,
    name: input.name,
    kind,
    is_directory: input.is_directory ? 1 : 0,
    hash: input.hash ?? null,
    size_bytes: input.size_bytes,
    created_at: input.created_at ?? input.mtime,
    modified_at: input.mtime,
    last_referenced_at: null as string | null,
    workspace_id: input.workspace_id,
    knowledge_source_id: "filesystem",
    owner: "steve",
    health_score: null as number | null,
    lifecycle_stage: lifecycle,
    duplicate_group_id: null as string | null,
    version_cluster_id: null as string | null,
    summary: input.is_directory ? "directory" : "",
    tags_json: "[]",
    synced_at: "",
  };
  draftRow.health_score = computeHealthScore(draftRow as DigitalAssetRow);

  const row = draftRow;

  getDatabase()
    .prepare(
      `INSERT INTO digital_assets (
        asset_id, path, name, kind, is_directory, hash, size_bytes,
        created_at, modified_at, last_referenced_at, workspace_id, knowledge_source_id,
        owner, health_score, lifecycle_stage, duplicate_group_id, version_cluster_id,
        summary, tags_json, synced_at
      ) VALUES (
        @asset_id, @path, @name, @kind, @is_directory, @hash, @size_bytes,
        @created_at, @modified_at, @last_referenced_at, @workspace_id, @knowledge_source_id,
        @owner, @health_score, @lifecycle_stage, @duplicate_group_id, @version_cluster_id,
        @summary, @tags_json, datetime('now')
      )
      ON CONFLICT(path) DO UPDATE SET
        name = excluded.name,
        kind = excluded.kind,
        is_directory = excluded.is_directory,
        size_bytes = excluded.size_bytes,
        modified_at = excluded.modified_at,
        workspace_id = excluded.workspace_id,
        health_score = excluded.health_score,
        lifecycle_stage = excluded.lifecycle_stage,
        summary = excluded.summary,
        synced_at = datetime('now')`,
    )
    .run(row);

  const saved = getAssetByPath(input.path)!;
  syncFileIndexFromAsset(saved);
  return saved;
}

function upsertDigitalAssetFromIndexRow(row: FileIndexRow): void {
  upsertDigitalAsset({
    path: row.path,
    name: row.name,
    is_directory: row.is_directory === 1,
    size_bytes: row.size_bytes,
    mtime: row.mtime,
    workspace_id: row.workspace_id,
  });
}

export function getAssetByPath(pathStr: string): DigitalAssetRow | null {
  return (
    (getDatabase().prepare("SELECT * FROM digital_assets WHERE path = ?").get(pathStr) as
      | DigitalAssetRow
      | undefined) ?? null
  );
}

export function getAssetById(assetId: string): DigitalAssetRow | null {
  return (
    (getDatabase().prepare("SELECT * FROM digital_assets WHERE asset_id = ?").get(assetId) as
      | DigitalAssetRow
      | undefined) ?? null
  );
}

export function listAssets(options?: {
  workspace_id?: string;
  lifecycle_stage?: string;
  limit?: number;
}): DigitalAssetRow[] {
  const limit = options?.limit ?? 100;
  const db = getDatabase();
  if (options?.workspace_id) {
    return db
      .prepare(
        "SELECT * FROM digital_assets WHERE workspace_id = ? ORDER BY modified_at DESC LIMIT ?",
      )
      .all(options.workspace_id, limit) as DigitalAssetRow[];
  }
  if (options?.lifecycle_stage) {
    return db
      .prepare(
        "SELECT * FROM digital_assets WHERE lifecycle_stage = ? ORDER BY modified_at DESC LIMIT ?",
      )
      .all(options.lifecycle_stage, limit) as DigitalAssetRow[];
  }
  return db
    .prepare("SELECT * FROM digital_assets ORDER BY modified_at DESC LIMIT ?")
    .all(limit) as DigitalAssetRow[];
}

export function listCollections(): {
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

export function getRegistryStats(): {
  total_assets: number;
  by_lifecycle: Record<string, number>;
  dormant_bytes_estimate: number;
  collections_count: number;
} {
  const db = getDatabase();
  const total = (db.prepare("SELECT COUNT(*) AS c FROM digital_assets").get() as { c: number }).c;
  const lifecycleRows = db
    .prepare("SELECT lifecycle_stage, COUNT(*) AS c FROM digital_assets GROUP BY lifecycle_stage")
    .all() as { lifecycle_stage: string; c: number }[];
  const by_lifecycle: Record<string, number> = {};
  for (const r of lifecycleRows) by_lifecycle[r.lifecycle_stage] = r.c;

  const dormant = db
    .prepare(
      `SELECT COALESCE(SUM(size_bytes), 0) AS bytes FROM digital_assets
       WHERE lifecycle_stage IN ('dormant', 'archive_candidate') AND is_directory = 0`,
    )
    .get() as { bytes: number };

  const collections_count = (
    db.prepare("SELECT COUNT(*) AS c FROM asset_collections").get() as { c: number }
  ).c;

  return {
    total_assets: total,
    by_lifecycle,
    dormant_bytes_estimate: dormant.bytes,
    collections_count,
  };
}

export function rowToDigitalAsset(row: DigitalAssetRow) {
  return {
    asset_id: row.asset_id,
    path: row.path,
    name: row.name,
    kind: row.kind as DigitalAssetKind,
    is_directory: row.is_directory === 1,
    fingerprint: {
      hash: row.hash,
      size_bytes: row.size_bytes,
      created_at: row.created_at,
      modified_at: row.modified_at,
      last_referenced_at: row.last_referenced_at,
      workspace_id: row.workspace_id,
      knowledge_source_id: row.knowledge_source_id,
      owner: row.owner,
      health_score: row.health_score,
      lifecycle_stage: row.lifecycle_stage as AssetLifecycleStage,
      duplicate_group_id: row.duplicate_group_id,
      version_cluster_id: row.version_cluster_id,
      summary: row.summary || null,
    },
    collection_ids: getCollectionIdsForAsset(row.asset_id),
    relationship_ids: [] as string[],
    tags: JSON.parse(row.tags_json) as string[],
  };
}

export function getRegistryStatus() {
  return {
    registry: "digital_assets",
    stats: getRegistryStats(),
    collections: listCollections(),
  };
}
