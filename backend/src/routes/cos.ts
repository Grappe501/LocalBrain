import { Router } from "express";
import { createProposalsForOrchestration } from "../cos/orchestrationPipeline.js";
import { listCosOutcomes } from "../cos/outcomeStore.js";
import { loadOrchestration } from "../cos/proposalGenerator.js";

export const cosRouter = Router();

cosRouter.get("/cos/orchestration/:id", (req, res) => {
  const orchestration = loadOrchestration(req.params.id);
  if (!orchestration) {
    res.status(404).json({ error: "Orchestration not found" });
    return;
  }
  res.json({ orchestration });
});

cosRouter.post("/cos/proposals", (req, res) => {
  const orchestration_id =
    typeof req.body?.orchestration_id === "string" ? req.body.orchestration_id : "";
  if (!orchestration_id) {
    res.status(400).json({ error: "orchestration_id required" });
    return;
  }

  const recommendation_ids = Array.isArray(req.body?.recommendation_ids)
    ? (req.body.recommendation_ids as string[])
    : undefined;

  const result = createProposalsForOrchestration({ orchestration_id, recommendation_ids });
  res.status(201).json({
    action_ids: result.action_ids,
    skipped: result.skipped,
    actions_queue_path: result.action_ids.length > 0 ? "/actions" : null,
  });
});

cosRouter.get("/cos/outcomes", (_req, res) => {
  res.json({ outcomes: listCosOutcomes(100) });
});
