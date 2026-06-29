import assert from "node:assert/strict";
import test from "node:test";
import { getLiveSurfaceAudit, runLiveSurfaceSmoke } from "./liveSurfaceService.js";
import { projectWorkspaceLive } from "./workspaceProjection.js";
import { getWorkspace } from "../workspaces/workspaceRegistry.js";
import { SURFACE_REGISTRY } from "./surfaceRegistry.js";

test("surface registry covers priority routes", () => {
  assert.ok(SURFACE_REGISTRY.length >= 10);
  assert.ok(SURFACE_REGISTRY.some((s) => s.route.includes("/workspace")));
  assert.ok(SURFACE_REGISTRY.some((s) => s.route === "/actions"));
});

test("projectWorkspaceLive syncs localbrain from build state", () => {
  const ws = getWorkspace("localbrain");
  assert.ok(ws);
  const projected = projectWorkspaceLive(ws!);
  assert.ok(projected.current_focus.includes("LB-OS-020"));
  assert.ok((projected.profile.completed_slices ?? []).includes("LB-OS-019"));
});

test("live surface smoke passes for all priority pages", () => {
  const report = runLiveSurfaceSmoke();
  assert.equal(report.failed, 0, report.results.filter((r) => !r.ok).map((r) => r.error).join("; "));
  assert.ok(report.passed >= 10);
});

test("getLiveSurfaceAudit returns engine id", () => {
  const audit = getLiveSurfaceAudit();
  assert.equal(audit.engine_id, "ENG-SRF-001");
  assert.equal(audit.experience_maturity_engine_id, "ENG-EXP-001");
  assert.ok(audit.surfaces.length >= 10);
  assert.ok(audit.experience_maturity.length >= 10);
  assert.equal(audit.experience_maturity.find((r) => r.route.includes("workspace"))?.maturity_level, 1);
});
