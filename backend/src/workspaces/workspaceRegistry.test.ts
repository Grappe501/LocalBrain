import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp, refreshPermissionEngine } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { getRepoRoot } from "../db/repoRoot.js";
import { getWorkspace, listWorkspaces, createWorkspace } from "./workspaceRegistry.js";
import { getWorkspaceEvents } from "./workspaceEvents.js";
import { projectWorkspaceLive } from "../liveSurface/workspaceProjection.js";

test("localbrain seed has executive_context, focus, and success_definition", () => {
  bootstrapApp();
  const ws = projectWorkspaceLive(getWorkspace("localbrain")!);
  assert.ok(ws);
  assert.ok(ws.executive_context.length > 20);
  assert.ok(
    ws.current_focus.includes("ENG-EI-001") ||
      ws.current_focus.includes("Constitutional Retrieval") ||
      ws.current_focus.includes("Executive Intelligence"),
  );
  assert.ok(ws.success_definition.includes("Executive Operating System"));
  assert.equal(ws.workspace_avatar, "🧠");
  assert.equal(ws.flags.pinned, true);
});

test("localbrain has workspace event timeline", () => {
  bootstrapApp();
  const events = getWorkspaceEvents("localbrain");
  assert.ok(events.length >= 5);
  assert.ok(events.some((e) => e.event_type === "workspace_created"));
  assert.ok(events.some((e) => e.event_type === "slice_completed"));
});

test("forbidden filesystem root rejected on create", () => {
  bootstrapApp();
  refreshPermissionEngine();
  const result = createWorkspace({
    workspace_id: "bad-root-test",
    workspace_type: "personal",
    title: "Bad Root",
    filesystem_roots: ["C:/Windows"],
  });
  assert.ok("error" in result);
});

test("repo root allowed for workspace filesystem root", () => {
  bootstrapApp();
  refreshPermissionEngine();
  const root = getRepoRoot();
  const ws = getWorkspace("localbrain");
  assert.ok(ws?.filesystem_roots.some((r) => r.toLowerCase() === root.toLowerCase()));
});

test("hidden workspaces filtered from list", () => {
  bootstrapApp();
  const all = listWorkspaces();
  assert.ok(all.some((w) => w.workspace_id === "localbrain"));
  assert.ok(!all.some((w) => w.workspace_id === "acu"));
});

test.after(() => {
  closeDatabase();
});
