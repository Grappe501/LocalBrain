import { Router } from "express";
import {
  getRelationshipNetworkOverview,
  computeRelationshipHealthScore,
  buildNetworkGraph,
  getTimelineForPerson,
  getPerson,
  generateEngagementRecommendations,
} from "../relationshipNetwork/relationshipNetworkService.js";

export const relationshipNetworkRouter = Router();

relationshipNetworkRouter.get("/relationship-network/overview", (_req, res) => {
  res.json(getRelationshipNetworkOverview());
});

relationshipNetworkRouter.get("/relationship-network/score", (_req, res) => {
  res.json(computeRelationshipHealthScore());
});

relationshipNetworkRouter.get("/relationship-network/graph", (_req, res) => {
  res.json(buildNetworkGraph());
});

relationshipNetworkRouter.get("/relationship-network/engagement", (_req, res) => {
  res.json({
    recommendations: generateEngagementRecommendations(),
    automation_blocked: true,
    read_only: true,
  });
});

relationshipNetworkRouter.get("/relationship-network/people/:id", (req, res) => {
  const person = getPerson(req.params.id);
  if (!person) {
    res.status(404).json({ error: "Person not found" });
    return;
  }
  res.json({
    person,
    timeline: getTimelineForPerson(req.params.id),
    read_only: true,
  });
});

relationshipNetworkRouter.get("/relationship-network/timeline/:id", (req, res) => {
  const timeline = getTimelineForPerson(req.params.id);
  res.json({ person_id: req.params.id, timeline, read_only: true });
});
