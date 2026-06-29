import { Router } from "express";
import { getLiveSurfaceAudit, runLiveSurfaceSmoke } from "../liveSurface/liveSurfaceService.js";

export const liveSurfaceRouter = Router();

liveSurfaceRouter.get("/surfaces/audit", (_req, res) => {
  res.json(getLiveSurfaceAudit());
});

liveSurfaceRouter.get("/surfaces/smoke", (_req, res) => {
  res.json(runLiveSurfaceSmoke());
});
