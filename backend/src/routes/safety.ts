import { Router } from "express";
import {
  getAllowedFoldersFromDb,
  isDatabaseConnected,
  logPermissionCheck,
} from "../db/database.js";
import {
  getForbiddenRuleCount,
  getPermissionEngine,
} from "../safety/permissionEngine.js";
import { listForbiddenRules } from "../safety/forbiddenPaths.js";
import type { PermissionAction } from "../safety/types.js";

export const safetyRouter = Router();

safetyRouter.get("/safety/status", (_req, res) => {
  const dbConnected = isDatabaseConnected();
  let allowedFolderCount = 0;

  if (dbConnected) {
    try {
      allowedFolderCount = getAllowedFoldersFromDb().length;
    } catch {
      /* keep 0 */
    }
  }

  res.json({
    engine: "v2",
    active: dbConnected,
    allowedFolderCount,
    forbiddenRuleCount: getForbiddenRuleCount(),
    dbConnected,
    fileToolsEnabled: true,
    writeToolsEnabled: true,
    message:
      "Permission engine active (LB-OS-003). Read tools (009). Write/move/quarantine require approval (010).",
  });
});

safetyRouter.get("/safety/allowed", (_req, res) => {
  if (!isDatabaseConnected()) {
    res.status(503).json({ error: "Database not connected" });
    return;
  }

  res.json({ folders: getAllowedFoldersFromDb() });
});

safetyRouter.get("/safety/forbidden", (_req, res) => {
  res.json(listForbiddenRules());
});

safetyRouter.post("/safety/test-path", (req, res) => {
  const pathInput = typeof req.body?.path === "string" ? req.body.path : "";
  const actionRaw = req.body?.action;
  const action: PermissionAction =
    actionRaw === "list" || actionRaw === "write" || actionRaw === "delete"
      ? actionRaw
      : "read";

  if (!pathInput.trim()) {
    res.status(400).json({ error: "path is required" });
    return;
  }

  try {
    const engine = getPermissionEngine();
    const result = engine.checkPath({ path: pathInput, action });

    if (isDatabaseConnected()) {
      logPermissionCheck(pathInput, action, result.allowed, result.reason);
    }

    res.json(result);
  } catch (error) {
    res.status(503).json({
      error: error instanceof Error ? error.message : "Permission engine unavailable",
    });
  }
});
