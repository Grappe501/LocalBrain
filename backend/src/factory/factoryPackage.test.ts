import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { exportBrainInstanceConfig } from "../settings/brainInstanceService.js";
import { certifyFactory, runFactoryAcceptanceTest } from "./factoryCertificationEngine.js";
import {
  buildFactoryPackage,
  installFactoryPackage,
  verifyPackageIntegrity,
} from "./factoryPackageService.js";
import { getBirthCertificate } from "./factoryService.js";

test("package builds with deterministic structural hash", () => {
  bootstrapApp();
  try {
    const a = buildFactoryPackage();
    const b = buildFactoryPackage();
    assert.equal(a.structural_hash, b.structural_hash);
    assert.notEqual(a.package_id, b.package_id);
    assert.equal(verifyPackageIntegrity(a).valid, true);
    assert.equal(verifyPackageIntegrity(b).valid, true);
    assert.ok(a.executive_office.department_count >= 8);
    assert.ok(a.capability_graph.capability_count > 0);
    assert.equal(a.convention_contracts.ethics, "CON-S5-2026-07");
  } finally {
    shutdownApp();
  }
});

test("install from package produces empty institution — no Steve", () => {
  bootstrapApp();
  try {
    const pkg = buildFactoryPackage();
    const install = installFactoryPackage(pkg);
    assert.ok(install.install_id.startsWith("INS-"));

    const cert = getBirthCertificate();
    assert.ok(cert);
    assert.equal(cert?.constitution_version, "1.0");

    const exportSer = JSON.stringify(exportBrainInstanceConfig()).toLowerCase();
    assert.ok(!exportSer.includes("steve"));
    assert.ok(!exportSer.includes("kelly"));
    assert.ok(!exportSer.includes("chris"));
  } finally {
    shutdownApp();
  }
});

test("factory acceptance test passes all nine certification gates", () => {
  bootstrapApp();
  try {
    const result = runFactoryAcceptanceTest();
    assert.equal(result.passed, true, JSON.stringify(result.certification.dimensions, null, 2));
    assert.equal(result.certification.certified, true);
    assert.equal(result.certification.review_verdict, "PASS");
    assert.equal(result.certification.dimensions.length, 9);
    assert.ok(result.certification.dimensions.every((d) => d.status === "pass"));
  } finally {
    shutdownApp();
  }
});

test("tampered package fails integrity verification", () => {
  bootstrapApp();
  try {
    const pkg = buildFactoryPackage();
    pkg.profile_template.display_name = "Steve's Brain";
    const check = verifyPackageIntegrity(pkg);
    assert.equal(check.valid, false);
    assert.ok(check.violations.length > 0);
  } finally {
    shutdownApp();
  }
});

test("certifyFactory returns nine PMO gates", () => {
  bootstrapApp();
  try {
    runFactoryAcceptanceTest();
    const report = certifyFactory();
    assert.equal(report.module_id, "factory");
    assert.ok(report.dimensions.some((d) => d.dimension_id === "personal_data"));
    assert.ok(report.dimensions.some((d) => d.dimension_id === "installer_repeatability"));
  } finally {
    shutdownApp();
  }
});
