import { Router } from "express";
import {
  explainFolder,
  getExecutiveInsights,
  whyAmISeeingThis,
} from "../knowledgeExplorer/explainService.js";
import { getRegistryStats } from "../digitalAssets/assetRegistry.js";
import {
  getLatestIndexRun,
  isIndexing,
  runBackgroundIndex,
} from "../knowledgeExplorer/indexer.js";
import { executeSearch } from "../knowledgeExplorer/searchService.js";
import { listTreeChildren } from "../knowledgeExplorer/treeService.js";
import { resolveWorkspaceForPath } from "../knowledgeExplorer/pathWorkspace.js";

export const knowledgeExplorerRouter = Router();

knowledgeExplorerRouter.get("/knowledge-explorer/tree", (req, res) => {
  const pathParam = typeof req.query.path === "string" ? req.query.path : undefined;
  const nodes = listTreeChildren(pathParam);
  res.json({ nodes, parent: pathParam ?? null });
});

knowledgeExplorerRouter.get("/knowledge-explorer/workspace-for-path", (req, res) => {
  const pathParam = typeof req.query.path === "string" ? req.query.path : "";
  const ws = resolveWorkspaceForPath(pathParam);
  if (!ws) {
    res.status(404).json({ error: "No workspace owns this path" });
    return;
  }
  res.json({ workspace: ws });
});

knowledgeExplorerRouter.get("/knowledge-explorer/explain", (req, res) => {
  const pathParam = typeof req.query.path === "string" ? req.query.path : "";
  const result = explainFolder(pathParam);
  if (!result) {
    res.status(404).json({ error: "Path not found or not permitted" });
    return;
  }
  res.json({ explain: result });
});

knowledgeExplorerRouter.get("/knowledge-explorer/why", (req, res) => {
  const pathParam = typeof req.query.path === "string" ? req.query.path : "";
  const context = typeof req.query.context === "string" ? req.query.context : undefined;
  const result = whyAmISeeingThis(pathParam, context);
  if (!result) {
    res.status(404).json({ error: "Path not found or not permitted" });
    return;
  }
  res.json({ why: result });
});

knowledgeExplorerRouter.get("/knowledge-explorer/executive", (req, res) => {
  const pathParam = typeof req.query.path === "string" ? req.query.path : undefined;
  res.json({ insights: getExecutiveInsights(pathParam) });
});

knowledgeExplorerRouter.get("/knowledge-explorer/search", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  res.json({ results: executeSearch(q) });
});

knowledgeExplorerRouter.get("/knowledge-explorer/index/status", (_req, res) => {
  res.json({
    indexing: isIndexing(),
    latest_run: getLatestIndexRun(),
    registry: getRegistryStats(),
  });
});

knowledgeExplorerRouter.post("/knowledge-explorer/index/run", (_req, res) => {
  if (isIndexing()) {
    res.json({ started: false, message: "Index already running" });
    return;
  }
  runBackgroundIndex();
  res.json({ started: true });
});

/** Legacy alias */
knowledgeExplorerRouter.get("/search", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  res.json({ results: executeSearch(q) });
});
