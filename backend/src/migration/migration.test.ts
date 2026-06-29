import test from "node:test";
import assert from "node:assert/strict";
import {
  assessMisplacement,
  classifyDataAsset,
  getDriveLetter,
  isCDriveProjectRoot,
} from "./driveDoctrine.js";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { getPermissionEngine, initPermissionEngine } from "../safety/permissionEngine.js";
import { getMigrationPlannerOverview } from "./migrationService.js";

test("getDriveLetter classifies C and H paths", () => {
  assert.equal(getDriveLetter("C:\\Program Files\\App"), "C");
  assert.equal(getDriveLetter("H:\\localAgent"), "H");
  assert.equal(getDriveLetter("/tmp/foo"), "OTHER");
});

test("classifyDataAsset detects work code vs program paths", () => {
  assert.equal(
    classifyDataAsset({ path: "C:\\Program Files\\Vendor\\app.exe" }),
    "program",
  );
  assert.equal(
    classifyDataAsset({ path: "H:\\localAgent\\backend\\src\\index.ts", kind: "code" }),
    "work_code",
  );
});

test("assessMisplacement flags work data on C:", () => {
  const result = assessMisplacement({
    path: "C:\\Users\\Steve\\Projects\\repo",
    classification: "work_code",
    drive: "C",
  });
  assert.equal(result.misplaced, true);
  assert.equal(result.risk, "high");
});

test("migration planner overview is read-only planning", () => {
  bootstrapApp();
  try {
    const overview = getMigrationPlannerOverview();
    assert.equal(overview.read_only, true);
    assert.equal(overview.planning_only, true);
    assert.equal(overview.slice_id, "LB-OS-018");
    assert.ok(overview.doctrine.rules.length > 0);
    assert.ok(overview.migration_arc.length >= 8);
    assert.ok(overview.approval_checklist.length > 0);
    assert.ok(overview.guardrails.includes("No file moves"));
    assert.equal(overview.inventory_gate, false);
  } finally {
    shutdownApp();
  }
});

test("validateNewFilesystemRoot blocks C: project root without override", () => {
  initPermissionEngine(["H:\\localAgent"]);
  const engine = getPermissionEngine();
  assert.equal(isCDriveProjectRoot("C:\\Users\\Steve\\Projects"), true);

  const prev = process.env.LOCALBRAIN_ALLOW_C_PROJECT_ROOT;
  delete process.env.LOCALBRAIN_ALLOW_C_PROJECT_ROOT;

  const blocked = engine.validateNewFilesystemRoot("C:\\Users\\Steve\\Projects");
  assert.equal(blocked.allowed, false);
  assert.match(blocked.reason ?? "", /C:/);

  if (prev) process.env.LOCALBRAIN_ALLOW_C_PROJECT_ROOT = prev;
});
