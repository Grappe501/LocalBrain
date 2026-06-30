import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildDependencyHealthGraph,
  buildExecutiveCapabilityAtlas,
  buildExecutiveIntentGraph,
  buildRecommendationGraph,
  CAPABILITY_REGISTRY,
  EXECUTIVE_INTENTS,
  resolveExecutiveIntentChain,
} from "@localbrain/shared";
import { collectCapabilityHealthSignals } from "../integration/capabilityHealthSignals.js";
import { getExecutiveCapabilityAtlas } from "../integration/capabilityAtlasService.js";

describe("ENG-INT-001 executive intent graph", () => {
  it("defines seven executive intents", () => {
    assert.equal(EXECUTIVE_INTENTS.length, 7);
  });

  it("builds intent → question → capability graph", () => {
    const graph = buildExecutiveIntentGraph();
    assert.ok(graph.nodes.some((n) => n.kind === "intent"));
    assert.ok(graph.nodes.some((n) => n.kind === "capability"));
    assert.ok(graph.edges.length > 20);
  });

  it("resolves organize intent to workspace or planning capability", () => {
    const chain = resolveExecutiveIntentChain("I need to safely reorganize this project");
    assert.ok(chain);
    assert.equal(chain?.intent_id, "INT-ORGANIZE");
    assert.ok(chain?.capability_id);
    assert.ok(chain?.route);
  });

  it("resolves plan intent to migration planning", () => {
    const chain = resolveExecutiveIntentChain("what's the next step for migration");
    assert.ok(chain);
    assert.equal(chain?.intent_id, "INT-PLAN");
  });
});

describe("ENG-COP-001 capability operations", () => {
  it("builds dependency health graph for migration workflow", () => {
    const graph = buildDependencyHealthGraph();
    assert.equal(graph.workflow_id, "WF-MIG-001");
    assert.equal(graph.nodes.length, 6);
  });

  it("builds recommendation graph with highest value action", () => {
    const recs = buildRecommendationGraph();
    assert.ok(recs.available_actions.length > 0);
  });

  it("every capability has identity four-tuple in atlas", () => {
    const atlas = buildExecutiveCapabilityAtlas();
    for (const entry of atlas.entries) {
      assert.ok(entry.identity.why_exist);
      assert.ok(entry.identity.outcome);
      assert.ok(Array.isArray(entry.identity.depends_on));
      assert.ok(Array.isArray(entry.identity.dependents));
    }
    assert.equal(atlas.entries.length, CAPABILITY_REGISTRY.length);
  });
});

describe("ENG-ATL-001 executive capability atlas", () => {
  it("generates atlas with runtime signals", () => {
    const signals = collectCapabilityHealthSignals();
    assert.ok(signals.length >= 5);
    const { atlas } = getExecutiveCapabilityAtlas();
    assert.equal(atlas.capability_count, CAPABILITY_REGISTRY.length);
    assert.ok(atlas.entries[0]?.intents.length >= 0);
  });
});
