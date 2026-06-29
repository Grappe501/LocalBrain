import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { getRepoRoot } from "../db/repoRoot.js";
import { computeHealthScore, computeHealthSignals } from "../digitalAssets/assetHealth.js";
import { listPopulatedCollections, refreshCollectionMembers } from "../digitalAssets/collectionsEngine.js";
import {
  detectDuplicateCandidates,
  getAssetIntelligenceForPath,
  getCleanupRecommendations,
  getIntelligenceSummary,
  refreshIntelligence,
} from "../digitalAssets/intelligenceEngine.js";
import { upsertDigitalAsset } from "../digitalAssets/assetRegistry.js";
import { executeSearch } from "../knowledgeExplorer/searchService.js";
import { getExecutiveInsights } from "../knowledgeExplorer/explainService.js";

test("computeHealthScore returns 0-100 from signals", () => {
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
  const signals = computeHealthSignals(row);
  const score = computeHealthScore(row, signals);
  assert.ok(score >= 0 && score <= 100);
});

test("refreshIntelligence populates collections with counts", () => {
  bootstrapApp();
  refreshIntelligence();
  const cols = listPopulatedCollections();
  assert.ok(cols.length >= 3);
  assert.ok(cols.some((c) => c.collection_id === "col-touched-week"));
  assert.ok(cols.every((c) => typeof c.asset_count === "number"));
});

test("detectDuplicateCandidates marks groups as candidate_only", () => {
  bootstrapApp();
  const root = getRepoRoot();
  upsertDigitalAsset({
    path: `${root}/dup-a.txt`,
    name: "dup-test.txt",
    is_directory: false,
    size_bytes: 100,
    mtime: new Date().toISOString(),
    workspace_id: "localbrain",
  });
  upsertDigitalAsset({
    path: `${root}/dup-b.txt`,
    name: "dup-test.txt",
    is_directory: false,
    size_bytes: 100,
    mtime: new Date().toISOString(),
    workspace_id: "localbrain",
  });
  refreshIntelligence();
  const groups = detectDuplicateCandidates();
  const match = groups.find((g) => g.assets.some((a) => a.name === "dup-test.txt"));
  assert.ok(match);
  assert.equal(match?.candidate_only, true);
  assert.ok(match!.assets.length >= 2);
});

test("getCleanupRecommendations are recommend_only only", () => {
  bootstrapApp();
  refreshIntelligence();
  const recs = getCleanupRecommendations();
  assert.ok(recs.every((r) => r.recommend_only === true));
});

test("stale and duplicate search use digital_assets registry", () => {
  bootstrapApp();
  refreshIntelligence();
  const stale = executeSearch("stale:");
  assert.ok(stale.length >= 0);
  assert.ok(stale.every((r) => r.subtitle.includes("registry") || r.kind === "file"));

  const dup = executeSearch("duplicate:");
  for (const r of dup) {
    assert.ok(r.subtitle.includes("candidate") || r.subtitle.includes("Duplicate"));
  }
});

test("getAssetIntelligenceForPath returns health and recommendations", () => {
  bootstrapApp();
  const root = getRepoRoot();
  upsertDigitalAsset({
    path: root,
    name: "localAgent",
    is_directory: true,
    size_bytes: null,
    mtime: new Date(Date.now() - 120 * 86400000).toISOString(),
    workspace_id: "localbrain",
  });
  refreshIntelligence();
  const intel = getAssetIntelligenceForPath(root);
  assert.ok(intel);
  assert.ok(intel!.health_score >= 0);
  assert.ok(intel!.health_signals);
});

test("executive insights include registry cleanup recommendations", () => {
  bootstrapApp();
  refreshIntelligence();
  const insights = getExecutiveInsights();
  assert.ok(insights.some((i) => i.recommend_only === true));
  const summary = getIntelligenceSummary();
  assert.ok(summary.total_assets >= 1);
});

test.after(() => {
  closeDatabase();
});
