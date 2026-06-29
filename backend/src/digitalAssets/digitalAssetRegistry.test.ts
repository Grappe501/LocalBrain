import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { getRepoRoot } from "../db/repoRoot.js";
import {
  detectAssetKind,
  inferLifecycleStage,
  stubHealthScore,
} from "../digitalAssets/assetUtils.js";
import {
  getAssetByPath,
  getRegistryStats,
  listCollections,
  upsertDigitalAsset,
} from "../digitalAssets/assetRegistry.js";
import { listTreeChildren } from "../knowledgeExplorer/treeService.js";

test("detectAssetKind maps extensions and directories", () => {
  assert.equal(detectAssetKind("readme.md", false), "document");
  assert.equal(detectAssetKind("app.ts", false), "source_code");
  assert.equal(detectAssetKind("node_modules", true), "directory");
});

test("inferLifecycleStage uses mtime heuristics", () => {
  const recent = new Date().toISOString();
  const old = new Date(Date.now() - 120 * 86400000).toISOString();
  assert.equal(inferLifecycleStage(recent, false), "active");
  assert.equal(inferLifecycleStage(old, false), "dormant");
});

test("stubHealthScore returns numeric score", () => {
  const score = stubHealthScore("active", "localbrain");
  assert.ok(score !== null && score > 0);
});

test("upsertDigitalAsset writes registry row with lifecycle and health", () => {
  bootstrapApp();
  const root = getRepoRoot();
  const row = upsertDigitalAsset({
    path: root,
    name: "localAgent",
    is_directory: true,
    size_bytes: null,
    mtime: new Date().toISOString(),
    workspace_id: "localbrain",
  });
  assert.equal(row.workspace_id, "localbrain");
  assert.ok(row.lifecycle_stage);
  assert.ok(row.health_score !== null);

  const fetched = getAssetByPath(root);
  assert.ok(fetched);
  assert.equal(fetched?.asset_id, row.asset_id);
});

test("getRegistryStats includes lifecycle breakdown", () => {
  bootstrapApp();
  const stats = getRegistryStats();
  assert.ok(stats.total_assets >= 1);
  assert.ok(typeof stats.by_lifecycle === "object");
  assert.equal(stats.collections_count, 4);
});

test("listCollections returns intelligence collections", () => {
  bootstrapApp();
  const cols = listCollections();
  assert.equal(cols.length, 4);
});

test("tree nodes include registry metadata when indexed", () => {
  bootstrapApp();
  const root = getRepoRoot();
  upsertDigitalAsset({
    path: root,
    name: "localAgent",
    is_directory: true,
    size_bytes: null,
    mtime: new Date().toISOString(),
    workspace_id: "localbrain",
  });
  const roots = listTreeChildren();
  const node = roots.find((n) => n.path.toLowerCase() === root.toLowerCase());
  assert.ok(node);
  assert.equal(node?.in_registry, true);
  assert.ok(node?.lifecycle_stage);
  assert.ok(node?.health_score !== null);
});

test.after(() => {
  closeDatabase();
});
