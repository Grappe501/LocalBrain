import { Router } from "express";
import { getMigrationPlannerOverview } from "../migration/migrationService.js";

export const migrationRouter = Router();

migrationRouter.get("/migration/planner", (_req, res) => {
  res.json(getMigrationPlannerOverview());
});
