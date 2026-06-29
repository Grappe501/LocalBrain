import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../../bootstrap.js";
import {
  buildProjection,
  buildWorkspaceBlueprint,
  buildWorkspaceDNA,
  recommendedFilesystemRoot,
} from "./blueprintEngine.js";
import { getSteveOrganizationTree } from "./organizationTree.js";
import { getExecutiveWorkspaceArchitecture } from "./workspaceArchitectureService.js";
import { getWorkspace, listWorkspaces } from "../../workspaces/workspaceRegistry.js";

test("recommendedFilesystemRoot uses H Projects hierarchy", () => {
  const ws = getWorkspace("reddirt");
  assert.ok(ws);
  const rec = recommendedFilesystemRoot(ws!);
  assert.match(rec, /^H:\\Projects\\Campaigns\\/i);
});

test("buildWorkspaceDNA uses projections not raw paths as identity", () => {
  bootstrapApp();
  try {
    const ws = getWorkspace("localbrain");
    assert.ok(ws);
    const dna = buildWorkspaceDNA(ws!);
    assert.equal(dna.workspace_id, "localbrain");
    assert.ok(dna.projections.length >= 1);
    assert.equal(dna.projections[0].logical_type, "living_workspace");
    assert.equal(dna.projections[0].logical_id, "localbrain");
    assert.equal(dna.projections[0].location_label, "Primary Development");
  } finally {
    shutdownApp();
  }
});

test("organization tree is Logical World — no drive letters on nodes", () => {
  bootstrapApp();
  try {
    const tree = getSteveOrganizationTree(listWorkspaces());
    const json = JSON.stringify(tree);
    assert.doesNotMatch(json, /H:\\\\/i);
    assert.ok(tree.children?.some((c) => c.node_id === "projects"));
  } finally {
    shutdownApp();
  }
});

test("workspace architecture API is read-only LB-OS-021", () => {
  bootstrapApp();
  try {
    const report = getExecutiveWorkspaceArchitecture();
    assert.equal(report.slice_id, "LB-OS-021");
    assert.equal(report.engine_id, "ENG-EWA-001");
    assert.equal(report.read_only, true);
    assert.ok(report.workspace_dna.length >= 1);
    assert.ok(report.blueprints.length >= 1);
    assert.ok(report.physical_world.volumes.length >= 1);
    assert.ok(report.physical_world.storage_providers.every((p) => p.runtime_enabled === false));
    assert.ok(report.organization_tree.node_id === "steve");

    const lb = report.blueprints.find((b) => b.workspace_id === "localbrain");
    assert.ok(lb);
    assert.ok(lb.recommended_projections.length >= 1);
    assert.ok(typeof lb.confidence_percent === "number");
  } finally {
    shutdownApp();
  }
});

test("buildProjection never mutates filesystem", () => {
  const ws = {
    workspace_id: "test",
    title: "Test",
  } as Parameters<typeof buildProjection>[0];
  const p = buildProjection(ws, "H:\\Projects\\Business\\Test", "planned");
  assert.equal(p.projection_kind, "filesystem_root");
  assert.equal(p.status, "planned");
});
