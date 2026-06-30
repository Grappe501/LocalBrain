import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { parsePhaseChecklistSlices, parsePhaseSections } from "../epo/checklistParser.js";
import { explainBlocker } from "../epo/blockerExplainer.js";
import { getEpoOverview, getEpoSliceDetail, listDocumentationLibrary } from "../epo/epoService.js";
import { BUILD_STATE_ENGINE_ID, computeBuildState } from "./buildStateEngine.js";
import { parseSliceRegistry } from "./sliceRegistry.js";

test("parsePhaseChecklistSlices reads all phase tables", () => {
  const slices = parsePhaseChecklistSlices();
  assert.ok(slices.length >= 25);
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-017" && s.status === "complete"));
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-019" && s.status === "complete"));
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-020" && s.status === "complete"));
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-020.5" && s.status === "complete"));
});

test("parseSliceRegistry loads dependencies from queue", () => {
  const { order, dependencies } = parseSliceRegistry();
  assert.ok(order.includes("LB-OS-020"));
  assert.ok(dependencies["LB-OS-020"]?.includes("LB-OS-019"));
  assert.ok(dependencies["LB-OS-016"]?.includes("LB-OS-015"));
});

test("parsePhaseSections derives phases from checklist", () => {
  const phases = parsePhaseSections();
  assert.ok(phases.length >= 3);
  const migration = phases.find((p) => p.label.toLowerCase().includes("migration"));
  assert.ok(migration);
  assert.ok(migration!.slice_ids.includes("LB-OS-020"));
});

test("computeBuildState projects current sprint and velocity", () => {
  const state = computeBuildState();
  assert.equal(state.current_slice_id, "MILESTONE-PR-S4");
  assert.equal(state.current_phase_label, "Platform Consolidation (pre–Session 4)");
  assert.ok(
    state.build_graph.some((n) => n.slice_id === "LB-OS-020" && n.status === "released"),
  );
  assert.ok(
    state.build_graph.some((n) => n.slice_id === "LB-OS-020.5" && n.status === "released"),
  );
  assert.ok(state.build_velocity.commits_count >= 0);
  assert.ok(state.build_graph.some((n) => n.slice_id === "LB-OS-019" && n.status === "released"));
  assert.notEqual(state.current_slice_id, "LB-OS-027");
});

test("getEpoOverview exposes build state engine fields", () => {
  const overview = getEpoOverview();
  assert.equal(overview.read_only, true);
  assert.equal(overview.build_state_engine_id, BUILD_STATE_ENGINE_ID);
  assert.equal(overview.current_slice_id, "MILESTONE-PR-S4");
  assert.equal(overview.current_phase_label, "Platform Consolidation (pre–Session 4)");
  assert.ok(overview.phases.length >= 4);
  assert.ok(overview.commit_timeline.length > 0);
  assert.ok(overview.experience_maturity.length >= 10);
  assert.equal(overview.experience_maturity_engine_id, "ENG-EXP-001");
});

test("blocker explanation for planned slice with deps", () => {
  const slices = parsePhaseChecklistSlices();
  const map = new Map(slices.map((s) => [s.slice_id, s]));
  const { dependencies } = parseSliceRegistry();
  const planned = map.get("LB-OS-028");
  assert.ok(planned);
  assert.equal(planned!.status, "planned");
  const exp = explainBlocker(planned!, map, dependencies);
  assert.ok(exp);
});

test("getEpoSliceDetail returns coverage and mission", () => {
  try {
    bootstrapApp();
  } catch {
    /* db may be busy in parallel test runs */
  }
  const detail = getEpoSliceDetail("LB-OS-011");
  assert.ok(detail);
  assert.equal(detail!.slice_id, "LB-OS-011");
  assert.ok(detail!.coverage.implementation >= 90);
});

test("docs library is searchable", () => {
  const docs = listDocumentationLibrary();
  assert.ok(docs.length > 10);
  const filtered = listDocumentationLibrary("Engineering");
  assert.ok(filtered.length >= 1);
});

test.after(() => {
  closeDatabase();
});
