import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { computeEngineeringScore } from "./engineeringScore.js";
import { buildEngineeringKnowledgeGraph } from "./knowledgeGraph.js";
import { analyzeImpact } from "./impactAnalysis.js";
import { explainProject } from "./explainProject.js";
import { getEngineeringOverview, previewBurtPacket } from "./engineeringService.js";

test("buildEngineeringKnowledgeGraph connects engines and modules", () => {
  const graph = buildEngineeringKnowledgeGraph();
  assert.equal(graph.read_only, true);
  assert.ok(graph.nodes.length > 20);
  assert.ok(graph.edges.length > 20);
  assert.ok(graph.node_counts.engine >= 5);
  assert.ok(graph.nodes.some((n) => n.id === "ENG-PM-001"));
});

test("computeEngineeringScore returns eight factors", () => {
  bootstrapApp();
  const score = computeEngineeringScore();
  assert.ok(score.score >= 0 && score.score <= 100);
  assert.equal(score.factors.length, 8);
});

test("analyzeImpact finds permission engine dependents", () => {
  const result = analyzeImpact("ENG-PM-001");
  assert.ok(result.matched_nodes.length >= 1);
  assert.equal(result.read_only, true);
});

test("explainProject returns envelope for localbrain", () => {
  bootstrapApp();
  const exp = explainProject("localbrain");
  assert.ok(exp);
  assert.equal(exp!.read_only, true);
  assert.ok(exp!.mission.length > 0);
  assert.ok(exp!.recommended_next_step.what);
});

test("getEngineeringOverview is read-only intelligence", () => {
  bootstrapApp();
  const ov = getEngineeringOverview();
  assert.equal(ov.read_only, true);
  assert.ok(ov.engineering_score.score > 0);
  assert.ok(ov.graph_summary.nodes.length > 0);
  assert.ok(ov.specialists.length >= 10);
});

test("previewBurtPacket does not write files", () => {
  const preview = previewBurtPacket({ slice_id: "LB-OS-TEST-999", title: "Test" });
  assert.equal(preview.read_only, true);
  assert.ok(preview.markdown.includes("LB-OS-TEST-999"));
});

test.after(() => {
  closeDatabase();
});
