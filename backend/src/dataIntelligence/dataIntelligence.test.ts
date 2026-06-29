import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { buildKnowledgeSourceCatalog } from "./knowledgeSourceCatalog.js";
import { computeDataHealthScore } from "./dataHealthScore.js";
import { previewQueryPlan } from "./queryStudio.js";
import { explainLineage } from "./lineage.js";
import { getDataIntelligenceOverview } from "./dataIntelligenceService.js";
import { buildDataRelationshipGraph } from "./relationshipGraph.js";

test("knowledge source catalog includes live and planned sources", () => {
  bootstrapApp();
  const sources = buildKnowledgeSourceCatalog();
  assert.ok(sources.length >= 10);
  assert.ok(sources.some((s) => s.source_id === "localbrain_db" && s.status === "active"));
  assert.ok(sources.some((s) => s.source_id === "voter_registration" && s.status === "planned"));
});

test("computeDataHealthScore returns eight factors", () => {
  bootstrapApp();
  const score = computeDataHealthScore();
  assert.equal(score.factors.length, 8);
  assert.ok(score.score >= 0 && score.score <= 100);
});

test("previewQueryPlan blocks execution", () => {
  const plan = previewQueryPlan("Show workspaces");
  assert.equal(plan.execution_blocked, true);
  assert.equal(plan.read_only, true);
  assert.ok(plan.suggested_sql);
});

test("explainLineage traces source to result", () => {
  const lineage = explainLineage({ query: "test", source_id: "localbrain_db" });
  assert.equal(lineage.read_only, true);
  assert.equal(lineage.steps.length, 5);
  assert.equal(lineage.steps[0].stage, "source");
});

test("relationship graph links workspaces and sources", () => {
  bootstrapApp();
  const graph = buildDataRelationshipGraph();
  assert.ok(graph.nodes.some((n) => n.kind === "knowledge_source"));
  assert.ok(graph.edges.length > 5);
});

test("getDataIntelligenceOverview is read-only", () => {
  bootstrapApp();
  const ov = getDataIntelligenceOverview();
  assert.equal(ov.read_only, true);
  assert.ok(ov.guardrails.length >= 3);
});

test.after(() => {
  closeDatabase();
});
