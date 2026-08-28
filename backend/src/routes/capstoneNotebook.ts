import { Router } from "express";
import {
  ensureCapstoneNotebook,
  getCapstoneNotebook,
  getCapstoneNotebookByEnrollment,
  getCapstoneNotebookDashboard,
  listCapstoneRevisions,
  markStageCheckpointReady,
  reviewStageCheckpoint,
  updateCapstoneIdentity,
  updateCapstoneSection,
} from "../companyFoundry/capstoneNotebook.js";
import { getEnrollment } from "../companyFoundry/learnerProgress.js";

export const capstoneNotebookRouter = Router();

capstoneNotebookRouter.post("/foundry/academy/enrollments/:enrollmentId/capstone-notebook", (req, res) => {
  const enrollment = getEnrollment(req.params.enrollmentId);
  if (!enrollment) return res.status(404).json({ error: "academy_enrollment_not_found" });
  const notebook = ensureCapstoneNotebook({ enrollmentId: enrollment.id, builderId: enrollment.builder_id });
  return res.status(201).json({ notebook, dashboard: getCapstoneNotebookDashboard(notebook.id) });
});

capstoneNotebookRouter.get("/foundry/academy/enrollments/:enrollmentId/capstone-notebook", (req, res) => {
  const notebook = getCapstoneNotebookByEnrollment(req.params.enrollmentId);
  if (!notebook) return res.status(404).json({ error: "capstone_notebook_not_found" });
  return res.json(getCapstoneNotebookDashboard(notebook.id));
});

capstoneNotebookRouter.get("/foundry/capstone-notebooks/:notebookId", (req, res) => {
  const dashboard = getCapstoneNotebookDashboard(req.params.notebookId);
  if (!dashboard) return res.status(404).json({ error: "capstone_notebook_not_found" });
  return res.json(dashboard);
});

capstoneNotebookRouter.patch("/foundry/capstone-notebooks/:notebookId", (req, res) => {
  const actorId = String(req.body?.actorId ?? "").trim();
  if (!actorId) return res.status(400).json({ error: "actor_required" });
  const notebook = updateCapstoneIdentity({
    notebookId: req.params.notebookId,
    actorId,
    title: req.body?.title,
    workingThesis: req.body?.workingThesis,
  });
  if (!notebook) return res.status(404).json({ error: "capstone_notebook_not_found" });
  return res.json({ notebook });
});

capstoneNotebookRouter.put("/foundry/capstone-notebooks/:notebookId/sections/:sectionKey", (req, res) => {
  const actorId = String(req.body?.actorId ?? "").trim();
  if (!actorId) return res.status(400).json({ error: "actor_required" });
  const section = updateCapstoneSection({
    notebookId: req.params.notebookId,
    sectionKey: req.params.sectionKey,
    actorId,
    content: req.body?.content ?? {},
    note: req.body?.note,
  });
  if (!section) return res.status(404).json({ error: "capstone_section_not_found" });
  return res.json({ section, dashboard: getCapstoneNotebookDashboard(req.params.notebookId) });
});

capstoneNotebookRouter.post("/foundry/capstone-notebooks/:notebookId/stages/:stageId/ready", (req, res) => {
  const actorId = String(req.body?.actorId ?? "").trim();
  if (!actorId) return res.status(400).json({ error: "actor_required" });
  const result = markStageCheckpointReady({ notebookId: req.params.notebookId, stageId: req.params.stageId, actorId });
  if (!result.ok) return res.status(409).json(result);
  return res.json({ ...result, dashboard: getCapstoneNotebookDashboard(req.params.notebookId) });
});

capstoneNotebookRouter.post("/foundry/capstone-notebooks/:notebookId/stages/:stageId/review", (req, res) => {
  const reviewerId = String(req.body?.reviewerId ?? "").trim();
  const rationale = String(req.body?.rationale ?? "").trim();
  const decision = req.body?.decision;
  if (!reviewerId || !rationale || !["accepted", "rework"].includes(decision)) return res.status(400).json({ error: "invalid_checkpoint_review" });
  const notebook = getCapstoneNotebook(req.params.notebookId);
  if (!notebook) return res.status(404).json({ error: "capstone_notebook_not_found" });
  if (notebook.builder_id === reviewerId) return res.status(403).json({ error: "self_review_forbidden" });
  const result = reviewStageCheckpoint({ notebookId: notebook.id, stageId: req.params.stageId, reviewerId, decision, rationale });
  if (!result.ok) return res.status(409).json(result);
  return res.status(201).json({ ...result, dashboard: getCapstoneNotebookDashboard(notebook.id) });
});

capstoneNotebookRouter.get("/foundry/capstone-notebooks/:notebookId/revisions", (req, res) => {
  const limit = Number(req.query.limit ?? 100);
  return res.json({ revisions: listCapstoneRevisions(req.params.notebookId, Number.isFinite(limit) ? limit : 100) });
});
