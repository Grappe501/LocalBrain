import { Router } from "express";
import type { ConsolidationSimulateRequest } from "@localbrain/shared";
import {
  dismissConsolidationCard,
  getConsolidationBriefing,
  getConsolidationCategory,
  getFindingsForSimulation,
} from "../consolidation/consolidationService.js";
import { runConsolidationSimulation } from "../simulation/simulationEngine.js";

export const consolidationRouter = Router();

const VALID_CATEGORIES = new Set([
  "duplicates",
  "versions",
  "folders",
  "programs",
  "knowledge",
  "ignored",
]);

consolidationRouter.get("/consolidation/briefing", (_req, res) => {
  res.json(getConsolidationBriefing());
});

consolidationRouter.get("/consolidation/opportunity", (_req, res) => {
  const briefing = getConsolidationBriefing();
  res.json(briefing.consolidation_opportunity);
});

consolidationRouter.get("/consolidation/:category", (req, res) => {
  const category = req.params.category;
  if (!VALID_CATEGORIES.has(category)) {
    res.status(404).json({ error: `Unknown category: ${category}` });
    return;
  }
  res.json(getConsolidationCategory(category as Parameters<typeof getConsolidationCategory>[0]));
});

consolidationRouter.post("/consolidation/simulate", (req, res) => {
  const body = (req.body ?? {}) as ConsolidationSimulateRequest;
  const { findings, cardIds } = getFindingsForSimulation(body.card_ids);
  const result = runConsolidationSimulation({ findings, cardIds: body.card_ids });
  res.json(result);
});

consolidationRouter.post("/consolidation/dismiss", (req, res) => {
  const cardId = typeof req.body?.card_id === "string" ? req.body.card_id : "";
  if (!cardId) {
    res.status(400).json({ error: "card_id required" });
    return;
  }
  dismissConsolidationCard(cardId);
  res.json({ ok: true, read_only: true, nothing_changed: true });
});
