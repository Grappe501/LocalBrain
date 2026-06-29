import test from "node:test";
import assert from "node:assert/strict";
import { buildCrossRouteLinks, matchQuestionForRoute } from "@localbrain/shared";
import { runIntegrationAudit } from "./integrationAudit.js";

test("cross-route link matrix meets 90+ target", () => {
  const links = buildCrossRouteLinks();
  assert.ok(links.length >= 90, `expected >= 90 links, got ${links.length}`);
});

test("matchQuestionForRoute resolves primary routes", () => {
  assert.equal(matchQuestionForRoute("/program-office")?.question_id, "EQ-002");
  assert.equal(matchQuestionForRoute("/migration/consolidation")?.question_id, "EQ-005");
  assert.equal(matchQuestionForRoute("/workspace/localbrain")?.question_id, "EQ-007");
});

test("integration audit gate metrics", () => {
  const audit = runIntegrationAudit();
  assert.equal(audit.slice_id, "LB-OS-020.5");
  assert.equal(audit.read_only, true);
  assert.ok(audit.metrics.cross_route_links >= 90);
  assert.equal(audit.metrics.duplicate_executive_summaries, 0);
  assert.equal(audit.metrics.orphan_pages, 0);
  assert.ok(audit.targets_met);
  assert.ok(audit.gate_open_for_021);
});
