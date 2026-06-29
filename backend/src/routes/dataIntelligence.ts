import { Router } from "express";
import {
  getDataIntelligenceOverview,
  computeDataHealthScore,
  buildKnowledgeSourceCatalog,
  buildDataRelationshipGraph,
  previewQueryPlan,
  explainLineage,
  generateDataInsights,
} from "../dataIntelligence/dataIntelligenceService.js";

export const dataIntelligenceRouter = Router();

dataIntelligenceRouter.get("/data-intelligence/overview", (_req, res) => {
  res.json(getDataIntelligenceOverview());
});

dataIntelligenceRouter.get("/data-intelligence/score", (_req, res) => {
  res.json(computeDataHealthScore());
});

dataIntelligenceRouter.get("/data-intelligence/sources", (_req, res) => {
  res.json({ sources: buildKnowledgeSourceCatalog(), read_only: true });
});

dataIntelligenceRouter.get("/data-intelligence/graph", (_req, res) => {
  res.json(buildDataRelationshipGraph());
});

dataIntelligenceRouter.get("/data-intelligence/insights", (_req, res) => {
  res.json({ insights: generateDataInsights(), read_only: true });
});

dataIntelligenceRouter.get("/data-intelligence/lineage", (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q : undefined;
  const sourceId = typeof req.query.source_id === "string" ? req.query.source_id : undefined;
  res.json(explainLineage({ query, source_id: sourceId }));
});

dataIntelligenceRouter.post("/data-intelligence/query/preview", (req, res) => {
  const question = typeof req.body?.question === "string" ? req.body.question : "";
  res.json(previewQueryPlan(question));
});
