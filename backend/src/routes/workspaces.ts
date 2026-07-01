import { Router } from "express";
import type { WorkspaceType } from "@localbrain/shared";
import { refreshPermissionEngine } from "../bootstrap.js";
import { getWorkspaceLiveEnvelope } from "../liveSurface/liveSurfaceService.js";
import { projectWorkspaceLive } from "../liveSurface/workspaceProjection.js";
import { getWorkspaceEvents } from "../workspaces/workspaceEvents.js";
import { getWorkspaceLinks } from "../workspaces/workspaceLinks.js";
import {
  createWorkspace,
  getActiveWorkspaceId,
  getWorkspace,
  listWorkspaces,
  setActiveWorkspaceId,
} from "../workspaces/workspaceRegistry.js";

export const workspacesRouter = Router();

workspacesRouter.get("/workspaces", (req, res) => {
  const flag = typeof req.query.flag === "string" ? req.query.flag : undefined;
  res.json({ workspaces: listWorkspaces(flag) });
});

workspacesRouter.get("/workspaces/active", (_req, res) => {
  const id = getActiveWorkspaceId();
  const workspace = getWorkspace(id);
  if (!workspace) {
    res.status(404).json({ error: "Active workspace not found" });
    return;
  }
  res.json({
    workspace_id: id,
    workspace: projectWorkspaceLive(workspace),
    live_projection: id === "localbrain",
    observed_at: new Date().toISOString(),
  });
});

workspacesRouter.get("/workspaces/:id", (req, res) => {
  const workspace = getWorkspace(req.params.id);
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  res.json({
    workspace: projectWorkspaceLive(workspace),
    live_projection: req.params.id === "localbrain",
    observed_at: new Date().toISOString(),
  });
});

workspacesRouter.get("/workspaces/:id/live", (req, res) => {
  const envelope = getWorkspaceLiveEnvelope(req.params.id);
  if (!envelope) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  res.json(envelope);
});

workspacesRouter.get("/workspaces/:id/events", (req, res) => {
  const workspace = getWorkspace(req.params.id);
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  res.json({ events: getWorkspaceEvents(req.params.id) });
});

workspacesRouter.get("/workspaces/:id/links", (req, res) => {
  const workspace = getWorkspace(req.params.id);
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  res.json({ links: getWorkspaceLinks(req.params.id) });
});

workspacesRouter.post("/workspaces/:id/select", (req, res) => {
  const workspace = setActiveWorkspaceId(req.params.id);
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  res.json({
    workspace_id: workspace.workspace_id,
    workspace: projectWorkspaceLive(workspace),
    live_projection: workspace.workspace_id === "localbrain",
    observed_at: new Date().toISOString(),
  });
});

workspacesRouter.post("/workspaces", (req, res) => {
  const body = req.body ?? {};
  const workspace_id = typeof body.workspace_id === "string" ? body.workspace_id.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const workspace_type = body.workspace_type as WorkspaceType;

  if (!workspace_id || !title || !workspace_type) {
    res.status(400).json({ error: "workspace_id, title, and workspace_type are required" });
    return;
  }

  const filesystem_roots = Array.isArray(body.filesystem_roots)
    ? body.filesystem_roots.filter((r: unknown) => typeof r === "string")
    : [];

  const result = createWorkspace({
    workspace_id,
    workspace_type,
    title,
    filesystem_roots,
    description: typeof body.description === "string" ? body.description : undefined,
    executive_context: typeof body.executive_context === "string" ? body.executive_context : undefined,
    current_focus: typeof body.current_focus === "string" ? body.current_focus : undefined,
    success_definition:
      typeof body.success_definition === "string" ? body.success_definition : undefined,
  });

  if ("error" in result) {
    res.status(400).json({ error: result.error });
    return;
  }

  refreshPermissionEngine();
  res.status(201).json({ workspace: result });
});
