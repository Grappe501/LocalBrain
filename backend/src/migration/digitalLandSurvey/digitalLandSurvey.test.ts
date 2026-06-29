import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../../bootstrap.js";
import { getDigitalLandSurvey } from "./digitalLandSurveyService.js";

test("digital land survey is read-only LB-OS-022", () => {
  bootstrapApp();
  try {
    const report = getDigitalLandSurvey();
    assert.equal(report.slice_id, "LB-OS-022");
    assert.equal(report.engine_id, "ENG-DLS-001");
    assert.equal(report.read_only, true);
    assert.equal(report.core_rule, "Map the estate. Do not change the estate.");
    assert.ok(report.guardrails.some((g) => g.includes("No mkdir")));
    assert.ok(report.storage_topology.volumes.length >= 1);
    assert.ok(report.drive_utilization.length >= 1);
    assert.ok(report.workspace_coverage.length >= 1);
    assert.ok(report.migration_complexity.workspace_scores.length >= 1);
    assert.ok(report.projection_coverage.length >= 1);
    assert.ok(report.recommendations.length >= 1);
  } finally {
    shutdownApp();
  }
});

test("projection coverage includes Location fields", () => {
  bootstrapApp();
  try {
    const report = getDigitalLandSurvey();
    const lb = report.projection_coverage.find((p) => p.workspace_id === "localbrain");
    assert.ok(lb);
    if (lb.bound_locations.length > 0) {
      assert.ok(lb.bound_locations[0].location_label);
      assert.ok(lb.bound_locations[0].location_role);
    }
    assert.ok(Array.isArray(lb.missing_location_roles));
  } finally {
    shutdownApp();
  }
});

test("survey sections present even without prior audit run", () => {
  bootstrapApp();
  try {
    const report = getDigitalLandSurvey();
    assert.ok(Array.isArray(report.folder_ownership));
    assert.ok(Array.isArray(report.orphaned_data.unclaimed_folders));
    assert.ok(Array.isArray(report.duplicate_storage_regions));
    assert.ok(Array.isArray(report.empty_folder_chains));
    assert.ok(Array.isArray(report.oversized_media_collections));
    assert.ok(Array.isArray(report.archive_candidates));
    assert.ok(report.activity_signals.summary.length > 0);
  } finally {
    shutdownApp();
  }
});
