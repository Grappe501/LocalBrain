import { Router } from "express";
import {
  analyzeImpact,
  explainProject,
  getEngineeringOverview,
  getEngineeringScore,
  buildEngineeringKnowledgeGraph,
  previewBurtPacket,
  listBurtPacketHistory,
} from "../engineering/engineeringService.js";
import { routeSpecialist } from "../engineering/specialistRegistry.js";

export const engineeringRouter = Router();

engineeringRouter.get("/engineering/overview", (_req, res) => {
  res.json(getEngineeringOverview());
});

engineeringRouter.get("/engineering/score", (_req, res) => {
  res.json(getEngineeringScore());
});

engineeringRouter.get("/engineering/graph", (_req, res) => {
  res.json(buildEngineeringKnowledgeGraph());
});

engineeringRouter.get("/engineering/impact", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  res.json(analyzeImpact(q));
});

engineeringRouter.get("/engineering/explain", (req, res) => {
  const workspaceId =
    typeof req.query.workspace_id === "string" ? req.query.workspace_id : "localbrain";
  const result = explainProject(workspaceId);
  if (!result) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  res.json(result);
});

engineeringRouter.get("/engineering/burt/history", (_req, res) => {
  res.json({ packets: listBurtPacketHistory() });
});

engineeringRouter.post("/engineering/burt/preview", (req, res) => {
  const body = req.body as { slice_id?: string; title?: string };
  res.json(previewBurtPacket(body ?? {}));
});

engineeringRouter.post("/engineering/route", (req, res) => {
  const intent = typeof req.body?.intent === "string" ? req.body.intent : "";
  res.json({
    specialist_id: routeSpecialist(intent),
    read_only: true,
  });
});
