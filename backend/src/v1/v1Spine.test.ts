import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { runV1Acceptance } from "./v1SpineVerifier.js";

test("runV1Acceptance validates Executive OS V1 spine", () => {
  bootstrapApp();
  const report = runV1Acceptance();
  assert.equal(report.slice_id, "LB-OS-016");
  assert.equal(report.read_only, true);
  assert.ok(report.checks.length >= 15);
  assert.ok(report.can_do.length >= 8);
  assert.ok(report.cannot_do.length >= 5);
  assert.ok(report.operational_loop.length === 8);
  assert.ok(report.passed_count > 0);
});

test.after(() => {
  closeDatabase();
});
