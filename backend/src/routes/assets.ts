import { Router } from "express";
import {
  getAssetById,
  getAssetByPath,
  getRegistryStatus,
  getRegistryStats,
  listAssets,
  rowToDigitalAsset,
} from "../digitalAssets/assetRegistry.js";
import {
  detectDuplicateCandidates,
  getAssetIntelligenceForPath,
  getCleanupRecommendations,
  getIntelligenceSummary,
  refreshIntelligence,
} from "../digitalAssets/intelligenceEngine.js";
import { isIndexing, runBackgroundIndex } from "../knowledgeExplorer/indexer.js";

export const assetsRouter = Router();

assetsRouter.get("/assets/intelligence/summary", (_req, res) => {
  res.json({ summary: getIntelligenceSummary() });
});

assetsRouter.get("/assets/intelligence/recommendations", (_req, res) => {
  res.json({ recommendations: getCleanupRecommendations() });
});

assetsRouter.get("/assets/intelligence/duplicates", (_req, res) => {
  res.json({ groups: detectDuplicateCandidates(), candidate_only: true });
});

assetsRouter.get("/assets/intelligence/path", (req, res) => {
  const pathQuery = typeof req.query.path === "string" ? req.query.path : "";
  if (!pathQuery) {
    res.status(400).json({ error: "path query required" });
    return;
  }
  const intel = getAssetIntelligenceForPath(pathQuery);
  if (!intel) {
    res.status(404).json({ error: "Asset not in registry" });
    return;
  }
  res.json({ intelligence: intel });
});

assetsRouter.post("/assets/intelligence/refresh", (_req, res) => {
  const result = refreshIntelligence();
  res.json({ refreshed: true, ...result, recommend_only: true });
});

assetsRouter.get("/assets/stats", (_req, res) => {
  res.json({ stats: getRegistryStats() });
});

assetsRouter.get("/assets/registry/status", (_req, res) => {
  res.json(getRegistryStatus());
});

assetsRouter.post("/assets/sync", (_req, res) => {
  if (isIndexing()) {
    res.json({ started: false, message: "Sync already running" });
    return;
  }
  runBackgroundIndex();
  res.json({ started: true, message: "Incremental asset sync started" });
});

assetsRouter.get("/assets/:id", (req, res) => {
  const id = decodeURIComponent(req.params.id);
  const row = getAssetById(id) ?? getAssetByPath(id);
  if (!row) {
    res.status(404).json({ error: "Asset not found in registry" });
    return;
  }
  res.json({ asset: rowToDigitalAsset(row) });
});

assetsRouter.get("/assets", (req, res) => {
  const workspace_id =
    typeof req.query.workspace_id === "string" ? req.query.workspace_id : undefined;
  const lifecycle_stage =
    typeof req.query.lifecycle_stage === "string" ? req.query.lifecycle_stage : undefined;
  const pathQuery = typeof req.query.path === "string" ? req.query.path : undefined;
  const limit = typeof req.query.limit === "string" ? Number(req.query.limit) : undefined;

  if (pathQuery) {
    const row = getAssetByPath(pathQuery);
    if (!row) {
      res.status(404).json({ error: "Asset not found in registry" });
      return;
    }
    res.json({ assets: [rowToDigitalAsset(row)] });
    return;
  }

  const rows = listAssets({ workspace_id, lifecycle_stage, limit });
  res.json({ assets: rows.map(rowToDigitalAsset) });
});
