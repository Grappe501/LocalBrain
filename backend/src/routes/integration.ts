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
  buildCapabilityStateSnapshots,
  buildDependencyHealthGraph,
  buildExecutiveIntentGraph,
  buildExecutiveQuestionGraph,
  buildNavigationGraph,
  buildRecommendationGraph,
  buildRouteGraph,
  buildWorkflowGraph,
  getWorkflowNavigation,
  resolveExecutiveIntent,
  resolveExecutiveIntentChain,
} from "@localbrain/shared";
import { collectCapabilityHealthSignals } from "../integration/capabilityHealthSignals.js";
import {
  generateExecutiveCapabilityAtlasFile,
  getExecutiveCapabilityAtlas,
} from "../integration/capabilityAtlasService.js";
import { getExecutiveOfficeProjection } from "../integration/executiveOfficeService.js";
import { getExecutiveOfficeExperience } from "../integration/executiveBriefingService.js";

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

integrationRouter.get("/integration/capabilities", (_req, res) => {
  res.json({
    engine_id: "ENG-CAP-001",
    read_only: true,
    capabilities: CAPABILITY_REGISTRY,
  });
});

integrationRouter.get("/integration/intent-graph", (_req, res) => {
  res.json(buildExecutiveIntentGraph());
});

integrationRouter.get("/integration/capability-states", (_req, res) => {
  const signals = collectCapabilityHealthSignals();
  res.json({
    engine_id: "ENG-COP-001",
    signals,
    snapshots: buildCapabilityStateSnapshots(signals),
    dependency_health: buildDependencyHealthGraph(signals),
    recommendations: buildRecommendationGraph(signals),
    read_only: true,
    observed_at: new Date().toISOString(),
  });
});

integrationRouter.get("/integration/atlas", (_req, res) => {
  const { atlas, markdown } = getExecutiveCapabilityAtlas();
  res.json({ atlas, markdown, read_only: true });
});

integrationRouter.post("/integration/atlas/generate", (_req, res) => {
  const result = generateExecutiveCapabilityAtlasFile();
  res.json({ ok: true, ...result });
});

integrationRouter.get("/integration/office", (_req, res) => {
  const { projection, markdown } = getExecutiveOfficeProjection();
  res.json({ office: projection, markdown, read_only: true });
});

integrationRouter.get("/integration/office/experience", (_req, res) => {
  const { experience, markdown } = getExecutiveOfficeExperience();
  res.json({ experience, markdown, read_only: true });
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
  const chain = resolveExecutiveIntentChain(q);
  if (chain) {
    res.json({ chain, legacy: resolveExecutiveIntent(q) });
    return;
  }
  const resolution = resolveExecutiveIntent(q);
  if (!resolution) {
    res.status(404).json({ error: "No capability match for intent", query: q });
    return;
  }
  res.json({ legacy: resolution });
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
