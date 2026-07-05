import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { getLiveSurfaceAudit, runLiveSurfaceSmoke } from "./liveSurfaceService.js";
import { projectWorkspaceLive } from "./workspaceProjection.js";
import { computeBuildState } from "../buildState/buildStateEngine.js";
import { getWorkspace } from "../workspaces/workspaceRegistry.js";
import { SURFACE_REGISTRY } from "./surfaceRegistry.js";

test("surface registry covers priority routes", () => {
  assert.ok(SURFACE_REGISTRY.length >= 12);
  assert.ok(SURFACE_REGISTRY.some((s) => s.route.includes("/workspace")));
  assert.ok(SURFACE_REGISTRY.some((s) => s.route === "/actions"));
  assert.ok(SURFACE_REGISTRY.some((s) => s.route === "/" && s.question_id === "EQ-001"));
  assert.ok(SURFACE_REGISTRY.some((s) => s.route === "/migration/audit" && s.question_id === "EQ-015"));
});

test("projectWorkspaceLive syncs localbrain from build state", () => {
  bootstrapApp();
  const ws = getWorkspace("localbrain");
  assert.ok(ws);
  const state = computeBuildState();
  const projected = projectWorkspaceLive(ws!);
  assert.ok(state.current_slice_id);
  assert.ok(
    projected.current_focus.includes("Evidence-Driven Development") ||
      projected.current_focus.includes("PRL-3") ||
      projected.current_focus.includes("PRL-4"),
  );
  assert.ok(projected.profile.current_phase?.includes("Evidence-Driven Development"));
  assert.ok(
    projected.profile.next_slices?.some(
      (s) => s.includes("PRL-4") || s.includes("OPERATOR-WALKTHROUGH"),
    ),
  );
});

test.after(() => {
  closeDatabase();
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
  const ws = audit.experience_maturity.find((r) => r.route.includes("workspace"));
  assert.ok(ws);
  assert.equal(ws?.capability_id, "CAP-WS-001");
  assert.ok(ws.maturity_level >= 1);
});
