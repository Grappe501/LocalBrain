import { Router } from "express";
import {
  getDepartmentModules,
  getModuleById,
  getModuleLoadOrder,
  getRegisteredModules,
} from "../core/moduleLoader.js";

export const modulesRouter = Router();

modulesRouter.get("/modules", (_req, res) => {
  res.json({
    modules: getRegisteredModules(),
    department_modules: getDepartmentModules(),
    load_order: getModuleLoadOrder(),
  });
});

modulesRouter.get("/modules/:moduleId", (req, res) => {
  const module = getModuleById(req.params.moduleId);
  if (!module) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json({ module });
});
