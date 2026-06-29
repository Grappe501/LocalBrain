import { Router } from "express";
import { formatDockLine, getSystemHealth, getSystemUsage } from "../system/systemService.js";

export const systemRouter = Router();

systemRouter.get("/system/health", (_req, res) => {
  res.json(getSystemHealth());
});

systemRouter.get("/system/usage", (_req, res) => {
  const usage = getSystemUsage();
  res.json({ ...usage, dock_line: formatDockLine(usage) });
});
