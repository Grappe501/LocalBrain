import { Router } from "express";
import { getMigrationPlannerOverview } from "../migration/migrationService.js";
import {
  exportFilesystemAuditJson,
  getLatestFilesystemAudit,
  runFilesystemMappingAudit,
} from "../migration/fsAudit/auditService.js";
import { getExecutiveWorkspaceArchitecture } from "../migration/workspaceArchitecture/workspaceArchitectureService.js";

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
