import assert from "node:assert/strict";
import test from "node:test";
import {
  buildExperienceMaturityMatrix,
  capabilityToExperienceMaturity,
} from "@localbrain/shared";
import { SURFACE_REGISTRY } from "../liveSurface/surfaceRegistry.js";
import { getExperienceMaturityMatrix } from "../liveSurface/liveSurfaceService.js";

test("experience maturity syncs from ENG-CAP-001", () => {
  const matrix = getExperienceMaturityMatrix();
  const home = matrix.find((r) => r.route === "/");
  assert.ok(home);
  assert.equal(home?.capability_id, "CAP-EO-001");
  assert.equal(home?.next_upgrade_slice, "LB-OS-026.7");
  assert.ok(home?.next_upgrade_summary.includes("Executive Office"));
  assert.equal(home?.last_verified_slice, "LB-OS-026.67");

  const epo = matrix.find((r) => r.route === "/program-office");
  assert.ok(epo);
  assert.equal(epo?.capability_id, "CAP-EPO-001");
  assert.equal(epo?.maturity_level, 3);
  assert.equal(epo?.next_upgrade_slice, "LB-OS-026.7");

  const cutover = matrix.find((r) => r.route === "/migration/cutover");
  assert.ok(cutover);
  assert.equal(cutover?.maturity_level, 4);
});

test("migration surfaces point forward to Executive Office not stale slices", () => {
  const matrix = buildExperienceMaturityMatrix(SURFACE_REGISTRY);
  const consolidation = matrix.find((r) => r.route === "/migration/consolidation");
  assert.ok(consolidation);
  assert.equal(consolidation?.next_upgrade_slice, "LB-OS-026.7");
  assert.notEqual(consolidation?.next_upgrade_slice, "LB-OS-021");
});

test("capability completion maps to L0-L4 bands", () => {
  assert.equal(
    capabilityToExperienceMaturity({
      completion_status: "production",
      maturity: { completion_percent: 95, health: "healthy", last_verified_slice: "x", dependency_capability_ids: [] },
    } as never),
    4,
  );
  assert.equal(
    capabilityToExperienceMaturity({
      completion_status: "production",
      maturity: { completion_percent: 92, health: "healthy", last_verified_slice: "x", dependency_capability_ids: [] },
    } as never),
    3,
  );
});
