import { Router } from "express";
import {
  assembleMasterPlanBuild,
  ensureMasterPlanBuild,
  exportMasterPlan,
  getMasterPlanBuild,
  getMasterPlanBuildByNotebook,
  getMasterPlanDashboard,
  listMasterPlanPhases,
  redTeamMasterPlan,
  upsertMasterPlanPhase,
} from "../companyFoundry/masterPlanBuilder.js";

export const companyFoundryMasterPlanRouter = Router();

companyFoundryMasterPlanRouter.post("/foundry/master-plan-builder/notebooks/:notebookId/ensure", (req, res) => {
  const build = ensureMasterPlanBuild(req.params.notebookId);
  if (!build) return res.status(404).json({ error: "capstone_notebook_not_found" });
  return res.status(201).json({ build, dashboard: getMasterPlanDashboard(build.id) });
});

companyFoundryMasterPlanRouter.get("/foundry/master-plan-builder/notebooks/:notebookId", (req, res) => {
  const build = getMasterPlanBuildByNotebook(req.params.notebookId);
  if (!build) return res.status(404).json({ error: "master_plan_not_found" });
  return res.json(getMasterPlanDashboard(build.id));
});

companyFoundryMasterPlanRouter.get("/foundry/master-plan-builder/:buildId", (req, res) => {
  const dashboard = getMasterPlanDashboard(req.params.buildId);
  if (!dashboard) return res.status(404).json({ error: "master_plan_not_found" });
  return res.json(dashboard);
});

companyFoundryMasterPlanRouter.post("/foundry/master-plan-builder/:buildId/assemble", (req, res) => {
  const build = assembleMasterPlanBuild(req.params.buildId);
  if (!build) return res.status(404).json({ error: "master_plan_not_found" });
  return res.json({ build, dashboard: getMasterPlanDashboard(build.id) });
});

companyFoundryMasterPlanRouter.post("/foundry/master-plan-builder/:buildId/phases", (req, res) => {
  const phaseKey = String(req.body?.phaseKey ?? "").trim();
  const title = String(req.body?.title ?? "").trim();
  const sequenceNo = Number(req.body?.sequenceNo);
  if (!phaseKey || !title || !Number.isInteger(sequenceNo) || sequenceNo < 1) return res.status(400).json({ error: "invalid_master_plan_phase" });
  const result = upsertMasterPlanPhase({
    buildId: req.params.buildId,
    phaseKey,
    title,
    sequenceNo,
    dependencies: Array.isArray(req.body?.dependencies) ? req.body.dependencies.map(String) : [],
    acceptance: Array.isArray(req.body?.acceptance) ? req.body.acceptance.map(String) : [],
    pvs: req.body?.pvs === undefined ? 0 : Number(req.body.pvs),
    budgetUsd: req.body?.budgetUsd === undefined ? 0 : Number(req.body.budgetUsd),
    staffing: Array.isArray(req.body?.staffing) ? req.body.staffing : [],
  });
  if (!result.ok) return res.status(409).json(result);
  return res.status(201).json({ phases: listMasterPlanPhases(req.params.buildId), dashboard: getMasterPlanDashboard(req.params.buildId) });
});

companyFoundryMasterPlanRouter.post("/foundry/master-plan-builder/:buildId/red-team", (req, res) => {
  const reviewerId = String(req.body?.reviewerId ?? "").trim();
  const rationale = String(req.body?.rationale ?? "").trim();
  const score = Number(req.body?.score);
  const decision = req.body?.decision;
  if (!reviewerId || !rationale || !Number.isFinite(score) || !["pass", "conditional", "rework"].includes(decision)) return res.status(400).json({ error: "invalid_red_team_review" });
  const result = redTeamMasterPlan({
    buildId: req.params.buildId,
    reviewerId,
    score,
    findings: Array.isArray(req.body?.findings) ? req.body.findings : [],
    decision,
    rationale,
  });
  if (!result.ok) return res.status(409).json(result);
  return res.status(201).json({ result, dashboard: getMasterPlanDashboard(req.params.buildId) });
});

companyFoundryMasterPlanRouter.get("/foundry/master-plan-builder/:buildId/export", (req, res) => {
  const plan = exportMasterPlan(req.params.buildId);
  if (!plan) return res.status(404).json({ error: "master_plan_not_found" });
  return res.json(plan);
});
