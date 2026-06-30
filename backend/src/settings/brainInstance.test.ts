import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import {
  completeOnboarding,
  exportBrainInstanceConfig,
  getBrainInstanceOverview,
  getBrainInstanceProfile,
  importBrainInstanceConfig,
  resetOnboarding,
  updateBrainInstanceProfile,
} from "../settings/brainInstanceService.js";
import { getConnectorReadinessReport } from "../settings/connectorReadinessService.js";

test("brain instance defaults to empty brain package mode", () => {
  bootstrapApp();
  try {
    resetOnboarding();
    updateBrainInstanceProfile({
      display_name: "New Executive Office",
      owner_type: "custom",
    });
    const overview = getBrainInstanceOverview();
    assert.equal(overview.package_mode, "empty_brain");
    assert.equal(overview.onboarding.completed, false);
    assert.ok(overview.product_rule.includes("empty installable brain"));
  } finally {
    shutdownApp();
  }
});

test("export bundle never includes instance secrets shape", () => {
  bootstrapApp();
  try {
    const bundle = exportBrainInstanceConfig();
    assert.equal(bundle.export_version, 1);
    assert.ok(!("instance_id" in bundle.profile));
    const serialized = JSON.stringify(bundle);
    assert.ok(!serialized.includes("api_key"));
    assert.ok(!serialized.includes("credential"));
    assert.ok(Array.isArray(bundle.provider_flags));
  } finally {
    shutdownApp();
  }
});

test("import updates profile without changing instance_id", () => {
  bootstrapApp();
  try {
    const before = getBrainInstanceProfile();
    const bundle = exportBrainInstanceConfig();
    bundle.profile.display_name = "Kelly's Executive Office";
    bundle.profile.owner_type = "kelly";
    importBrainInstanceConfig(bundle);
    const after = getBrainInstanceProfile();
    assert.equal(after.instance_id, before.instance_id);
    assert.equal(after.display_name, "Kelly's Executive Office");
    assert.equal(after.owner_type, "kelly");
  } finally {
    shutdownApp();
  }
});

test("onboarding complete marks state", () => {
  bootstrapApp();
  try {
    resetOnboarding();
    const state = completeOnboarding({ display_name: "Chris's Executive Office", owner_type: "chris" });
    assert.equal(state.completed, true);
    assert.ok(state.completed_at);
    const profile = getBrainInstanceProfile();
    assert.equal(profile.owner_type, "chris");
  } finally {
    shutdownApp();
  }
});

test("connector readiness includes ai and reserved connectors", () => {
  bootstrapApp();
  try {
    const report = getConnectorReadinessReport();
    assert.equal(report.slice_id, "LB-OS-PROD-001");
    assert.ok(report.connectors.some((c) => c.category === "ai"));
    assert.ok(report.connectors.some((c) => c.status === "reserved" && c.connector_id === "google_workspace"));
    assert.ok(report.reserved_count >= 1);
  } finally {
    shutdownApp();
  }
});
