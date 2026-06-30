import { Router } from "express";
import {
  getQuestionsForRoute,
  getRelatedLinks,
  runIntegrationAudit,
} from "../integration/integrationAudit.js";
import {
  runExecutiveExperienceAudit,
  runGraphIntegrityCertification,
} from "../integration/executiveExperienceAudit.js";
import {
  CAPABILITY_REGISTRY,
  PHASE_1_EXECUTIVE_QUESTIONS,
  buildCapabilityDependencyGraph,
  buildExecutiveQuestionGraph,
  buildNavigationGraph,
  buildRouteGraph,
  buildWorkflowGraph,
  getWorkflowNavigation,
  resolveExecutiveIntent,
} from "@localbrain/shared";
export const integrationRouter = Router();

integrationRouter.get("/integration/audit", (_req, res) => {
  res.json(runIntegrationAudit());
});

integrationRouter.get("/integration/experience-audit", (_req, res) => {
  res.json(runExecutiveExperienceAudit());
});

integrationRouter.get("/integration/graph-integrity", (_req, res) => {
  res.json(runGraphIntegrityCertification());
});

integrationRouter.get("/integration/capabilities", (_req, res) => {  res.json({
    engine_id: "ENG-CAP-001",
    read_only: true,
    capabilities: CAPABILITY_REGISTRY,
  });
});

integrationRouter.get("/integration/capability-graph", (_req, res) => {
  res.json({
    dependency: buildCapabilityDependencyGraph(),
    workflow: buildWorkflowGraph(),
    executive_questions: buildExecutiveQuestionGraph(),
    routes: buildRouteGraph(),
    navigation: buildNavigationGraph(),
    read_only: true,
  });
});

integrationRouter.get("/integration/intent", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  if (!q.trim()) {
    res.status(400).json({ error: "Query parameter q is required" });
    return;
  }
  const resolution = resolveExecutiveIntent(q);
  if (!resolution) {
    res.status(404).json({ error: "No capability match for intent", query: q });
    return;
  }
  res.json(resolution);
});

integrationRouter.get("/integration/navigation", (req, res) => {
  const route = typeof req.query.route === "string" ? req.query.route : "/";
  res.json(getWorkflowNavigation(route));
});

integrationRouter.get("/integration/questions", (_req, res) => {
  res.json({ questions: PHASE_1_EXECUTIVE_QUESTIONS, read_only: true });
});

integrationRouter.get("/integration/questions/route", (req, res) => {
  const route = typeof req.query.route === "string" ? req.query.route : "/";
  const question = getQuestionsForRoute(route);
  if (!question) {
    res.status(404).json({ error: "No executive question for route", route });
    return;
  }
  res.json({
    question,
    related_links: getRelatedLinks(question.question_id),
    read_only: true,
  });
});
