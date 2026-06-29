import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { parsePhaseChecklistSlices } from "./checklistParser.js";
import { explainBlocker } from "./blockerExplainer.js";
import { getEpoOverview, getEpoSliceDetail, listDocumentationLibrary } from "./epoService.js";

test("parsePhaseChecklistSlices reads V1 table", () => {
  const slices = parsePhaseChecklistSlices();
  assert.ok(slices.length >= 15);
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-011" && s.status === "complete"));
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-012.5"));
});

test("getEpoOverview is read-only with metrics", () => {
  bootstrapApp();
  const overview = getEpoOverview();
  assert.equal(overview.read_only, true);
  assert.ok(overview.metrics.overall_progress_percent >= 0);
  assert.ok(overview.phases.length >= 4);
  assert.ok(overview.slices.length > 0);
  assert.ok(overview.build_graph.length > 0);
});

test("blocker explanation for planned slice with deps", () => {
  bootstrapApp();
  const slices = parsePhaseChecklistSlices();
  const map = new Map(slices.map((s) => [s.slice_id, s]));
  const s16 = map.get("LB-OS-016");
  assert.ok(s16);
  const exp = explainBlocker(s16!, map);
  assert.ok(exp);
});

test("getEpoSliceDetail returns coverage and mission", () => {
  bootstrapApp();
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
