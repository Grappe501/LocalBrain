import { Router } from "express";
import {
  assertVopCapable,
  canClaimVopWork,
  canCreateVopWork,
  canSuperviseVop,
  resolveVopAccessContext,
  VopValidationError,
} from "../vop/vopValidator.js";
import {
  getVolunteerProfileByUser,
  listVolunteerProfiles,
  upsertVolunteerProfile,
} from "../vop/vopProfileService.js";
import {
  claimVopWorkItem,
  completeVopWorkItem,
  createVopWorkItem,
  flagVopWorkQuality,
  getVopWorkItem,
  listClaimedVopWorkItems,
  listOpenVopWorkItems,
  releaseVopWorkItem,
  resolveProfileForUser,
} from "../vop/vopWorkService.js";
import {
  buildSupervisorDashboard,
  listSupervisorActiveWork,
} from "../vop/vopSupervisorService.js";
import { listOpenWorkItems } from "../ucie/ucieWorkService.js";

export const vopRouter = Router();

const ENGINE_ID = "VOP-001";

function accessFromRequest(req: import("express").Request) {
  return resolveVopAccessContext({
    user_id: req.header("x-contact-user-id") ?? req.query.user_id,
    role: req.header("x-contact-user-role") ?? req.query.user_role,
  });
}

function handleError(res: import("express").Response, err: unknown): void {
  if (err instanceof VopValidationError) {
    res.status(403).json({ error: err.code, message: err.message });
    return;
  }
  console.error("[vop]", err);
  res.status(500).json({
    error: err instanceof Error ? err.message : "VOP request failed",
    engine_id: ENGINE_ID,
  });
}

vopRouter.get("/vop/profiles", (req, res) => {
  const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  res.json({ engine_id: ENGINE_ID, profiles: listVolunteerProfiles(workspace_id) });
});

vopRouter.get("/vop/profiles/me", (req, res) => {
  const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  const ctx = accessFromRequest(req);
  const profile = getVolunteerProfileByUser(workspace_id, ctx.user_id);
  res.json({ engine_id: ENGINE_ID, profile });
});

vopRouter.put("/vop/profiles/me", (req, res) => {
  try {
    const ctx = accessFromRequest(req);
    const workspace_id = req.body.workspace_id as string;
    if (!workspace_id) {
      res.status(400).json({ error: "workspace_id is required" });
      return;
    }
    const profile = upsertVolunteerProfile({
      workspace_id,
      user_id: ctx.user_id,
      contact_id: req.body.contact_id,
      display_name: req.body.display_name ?? ctx.user_id,
      county: req.body.county,
      roles: req.body.roles,
      skills: req.body.skills,
      availability_note: req.body.availability_note,
      training_completed: req.body.training_completed,
      permissions: req.body.permissions,
    });
    res.json({ engine_id: ENGINE_ID, profile });
  } catch (err) {
    handleError(res, err);
  }
});

vopRouter.get("/vop/work/open", (req, res) => {
  const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  const ctx = accessFromRequest(req);
  const profile = resolveProfileForUser(workspace_id, ctx.user_id);
  res.json({
    engine_id: ENGINE_ID,
    items: listOpenVopWorkItems(workspace_id, profile),
    ucie_items: listOpenWorkItems(workspace_id).filter((i) => i.status === "open"),
  });
});

vopRouter.get("/vop/work/mine", (req, res) => {
  const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
  if (!workspace_id) {
    res.status(400).json({ error: "workspace_id is required" });
    return;
  }
  const ctx = accessFromRequest(req);
  res.json({
    engine_id: ENGINE_ID,
    items: listClaimedVopWorkItems(workspace_id, ctx.user_id),
  });
});

vopRouter.post("/vop/work", (req, res) => {
  try {
    const ctx = accessFromRequest(req);
    assertVopCapable(canCreateVopWork(ctx), "forbidden", "Cannot create work items");
    const item = createVopWorkItem({
      workspace_id: req.body.workspace_id,
      item_type: req.body.item_type,
      title: req.body.title,
      detail: req.body.detail,
      county: req.body.county,
      required_skills: req.body.required_skills,
      urgency: req.body.urgency,
      source_system: req.body.source_system,
      source_ref_id: req.body.source_ref_id,
      contact_id: req.body.contact_id,
    });
    res.status(201).json({ engine_id: ENGINE_ID, item });
  } catch (err) {
    handleError(res, err);
  }
});

vopRouter.get("/vop/work/:id", (req, res) => {
  const item = getVopWorkItem(req.params.id);
  if (!item) {
    res.status(404).json({ error: "work_item_not_found" });
    return;
  }
  res.json({ engine_id: ENGINE_ID, item });
});

vopRouter.post("/vop/work/:id/claim", (req, res) => {
  try {
    const ctx = accessFromRequest(req);
    assertVopCapable(canClaimVopWork(ctx), "forbidden", "Cannot claim work");
    const item = claimVopWorkItem({ work_item_id: req.params.id, user_id: ctx.user_id });
    if (!item) {
      res.status(404).json({ error: "work_item_not_available" });
      return;
    }
    res.json({ engine_id: ENGINE_ID, item });
  } catch (err) {
    handleError(res, err);
  }
});

vopRouter.post("/vop/work/:id/release", (req, res) => {
  try {
    const ctx = accessFromRequest(req);
    const item = releaseVopWorkItem({ work_item_id: req.params.id, user_id: ctx.user_id });
    if (!item) {
      res.status(404).json({ error: "work_item_not_claimed" });
      return;
    }
    res.json({ engine_id: ENGINE_ID, item });
  } catch (err) {
    handleError(res, err);
  }
});

vopRouter.post("/vop/work/:id/complete", (req, res) => {
  try {
    const ctx = accessFromRequest(req);
    const item = completeVopWorkItem({
      work_item_id: req.params.id,
      user_id: ctx.user_id,
      resolution_note: req.body.resolution_note,
    });
    if (!item) {
      res.status(404).json({ error: "work_item_not_claimed" });
      return;
    }
    res.json({ engine_id: ENGINE_ID, item });
  } catch (err) {
    handleError(res, err);
  }
});

vopRouter.post("/vop/work/:id/flag", (req, res) => {
  try {
    const ctx = accessFromRequest(req);
    assertVopCapable(canSuperviseVop(ctx), "forbidden", "Cannot flag quality");
    const item = flagVopWorkQuality({
      work_item_id: req.params.id,
      flagged_by_user_id: ctx.user_id,
      flag_type: req.body.flag_type,
      note: req.body.note,
    });
    if (!item) {
      res.status(404).json({ error: "work_item_not_found" });
      return;
    }
    res.json({ engine_id: ENGINE_ID, item });
  } catch (err) {
    handleError(res, err);
  }
});

vopRouter.get("/vop/supervisor/dashboard", (req, res) => {
  try {
    const ctx = accessFromRequest(req);
    assertVopCapable(canSuperviseVop(ctx), "forbidden", "Supervisor access required");
    const workspace_id = typeof req.query.workspace_id === "string" ? req.query.workspace_id : null;
    if (!workspace_id) {
      res.status(400).json({ error: "workspace_id is required" });
      return;
    }
    res.json({
      engine_id: ENGINE_ID,
      dashboard: buildSupervisorDashboard(workspace_id),
      active_work: listSupervisorActiveWork(workspace_id),
    });
  } catch (err) {
    handleError(res, err);
  }
});
