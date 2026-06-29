import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../../bootstrap.js";
import { getDriveLetter } from "../driveDoctrine.js";
import { collectHScanRoots } from "./scanner.js";
import { runFilesystemMappingAudit } from "./auditService.js";

test("collectHScanRoots only includes H: paths", () => {
  bootstrapApp();
  try {
    const roots = collectHScanRoots();
    for (const root of roots) {
      assert.equal(getDriveLetter(root), "H");
    }
  } finally {
    shutdownApp();
  }
});

test("filesystem mapping audit is read-only with inventory flag", () => {
  bootstrapApp();
  try {
    const audit = runFilesystemMappingAudit({ force: true });
    assert.equal(audit.slice_id, "LB-OS-019");
    assert.equal(audit.read_only, true);
    assert.equal(audit.principle, "Map first. Move later.");
    assert.equal(audit.inventory_complete, true);
    assert.ok(audit.guardrails.includes("No whole C:/ scan"));
    assert.ok(audit.mapping_confidence >= 0 && audit.mapping_confidence <= 100);
    assert.ok(Array.isArray(audit.recommendations));
    assert.ok(Array.isArray(audit.top_level_inventory));
    assert.ok(Array.isArray(audit.workspace_coverage));
  } finally {
    shutdownApp();
  }
});

test("audit does not include whole C: scan in scanned roots", () => {
  bootstrapApp();
  try {
    const audit = runFilesystemMappingAudit({ force: true });
    for (const root of audit.scanned_roots) {
      assert.equal(getDriveLetter(root), "H");
    }
    assert.ok(!audit.scanned_roots.some((r) => r.toUpperCase() === "C:\\"));
  } finally {
    shutdownApp();
  }
});
