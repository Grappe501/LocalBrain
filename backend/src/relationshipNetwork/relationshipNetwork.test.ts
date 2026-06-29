import assert from "node:assert/strict";
import test from "node:test";
import { computeRelationshipHealthScore } from "./relationshipHealthScore.js";
import { buildNetworkGraph } from "./networkGraph.js";
import { generateEngagementRecommendations } from "./engagementRecommendations.js";
import { getRelationshipNetworkOverview, getTimelineForPerson } from "./relationshipNetworkService.js";

test("computeRelationshipHealthScore has eight factors", () => {
  const score = computeRelationshipHealthScore();
  assert.equal(score.factors.length, 8);
  assert.ok(score.score >= 0 && score.score <= 100);
});

test("network graph connects Steve to people and orgs", () => {
  const graph = buildNetworkGraph();
  assert.ok(graph.nodes.some((n) => n.label === "Kelly"));
  assert.ok(graph.nodes.some((n) => n.kind === "organization"));
  assert.ok(graph.edges.length > 10);
});

test("engagement recommendations block automation", () => {
  const recs = generateEngagementRecommendations();
  assert.ok(recs.length >= 3);
  assert.ok(recs.every((r) => r.automation_blocked === true));
});

test("relationship timeline orders events for person", () => {
  const timeline = getTimelineForPerson("person_chris_m");
  assert.ok(timeline.length >= 3);
  assert.ok(timeline.some((e) => e.event_type === "met"));
});

test("overview is read-only social knowledge", () => {
  const ov = getRelationshipNetworkOverview();
  assert.equal(ov.read_only, true);
  assert.ok(ov.philosophy.includes("relationship"));
  assert.ok(ov.people.length >= 5);
});
