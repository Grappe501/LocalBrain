import { Router } from "express";
import type { PlanVariantStrategy } from "@localbrain/shared";
import { getMigrationPlannerOverview } from "../migration/migrationService.js";
import {
  exportFilesystemAuditJson,
  getLatestFilesystemAudit,
  runFilesystemMappingAudit,
} from "../migration/fsAudit/auditService.js";
import { getExecutiveWorkspaceArchitecture } from "../migration/workspaceArchitecture/workspaceArchitectureService.js";
import { getDigitalLandSurvey } from "../migration/digitalLandSurvey/digitalLandSurveyService.js";
import {
  getMigrationProofOverview,
  runMigrationProofSimulation,
} from "../migration/proof/migrationProofService.js";
import {
  generateMigrationPlans,
  getMigrationPlanById,
  getMigrationPlansOverview,
} from "../migration/planning/migrationPlanService.js";

export const migrationRouter = Router();

migrationRouter.get("/migration/planner", (_req, res) => {
  res.json(getMigrationPlannerOverview());
});

migrationRouter.get("/migration/audit", (req, res) => {
  const force = req.query.refresh === "1" || req.query.force === "1";
  res.json(runFilesystemMappingAudit({ force }));
});

migrationRouter.get("/migration/audit/latest", (_req, res) => {
  const latest = getLatestFilesystemAudit();
  if (!latest) {
    res.status(404).json({ error: "No audit run yet — GET /api/migration/audit" });
    return;
  }
  res.json(latest);
});

migrationRouter.get("/migration/audit/export", (req, res) => {
  const force = req.query.refresh === "1";
  const json = force
    ? JSON.stringify(runFilesystemMappingAudit({ force: true }), null, 2)
    : exportFilesystemAuditJson();
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="migration_inventory.json"',
  );
  res.send(json);
});

migrationRouter.get("/migration/workspace-architecture", (_req, res) => {
  res.json(getExecutiveWorkspaceArchitecture());
});

migrationRouter.get("/migration/digital-land-survey", (req, res) => {
  const refresh = req.query.refresh === "1";
  res.json(getDigitalLandSurvey({ refreshAudit: refresh }));
});

migrationRouter.get("/migration/proof", (_req, res) => {
  res.json(getMigrationProofOverview());
});

migrationRouter.post("/migration/proof/simulate", (req, res) => {
  const body = (req.body ?? {}) as { workspace_ids?: string[] };
  res.json(runMigrationProofSimulation({ workspace_ids: body.workspace_ids }));
});

migrationRouter.get("/migration/plans", (_req, res) => {
  res.json(getMigrationPlansOverview());
});

migrationRouter.post("/migration/plans/generate", (req, res) => {
  try {
    const body = (req.body ?? {}) as { certificate_id?: string; variants?: string[] };
    if (!body.certificate_id) {
      res.status(400).json({ error: "certificate_id required" });
      return;
    }
    res.json(
      generateMigrationPlans({
        certificate_id: body.certificate_id,
        variants: body.variants as PlanVariantStrategy[] | undefined,
      }),
    );
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Plan generation failed" });
  }
});

migrationRouter.get("/migration/plans/:planId", (req, res) => {
  const plan = getMigrationPlanById(req.params.planId);
  if (!plan) {
    res.status(404).json({ error: "Plan not found" });
    return;
  }
  res.json(plan);
});
