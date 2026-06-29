import { Router } from "express";
import {
  getQuestionsForRoute,
  getRelatedLinks,
  runIntegrationAudit,
} from "../integration/integrationAudit.js";
import { PHASE_1_EXECUTIVE_QUESTIONS } from "@localbrain/shared";

export const integrationRouter = Router();

integrationRouter.get("/integration/audit", (_req, res) => {
  res.json(runIntegrationAudit());
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
