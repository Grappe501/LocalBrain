import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  FACTORY_ARTIFACT_FILES,
} from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { isModuleCertificationLocked } from "../buildState/v1CertificationRegistry.js";
import { exportBrainInstanceConfig } from "../settings/brainInstanceService.js";
import { getRepoRoot } from "../db/repoRoot.js";
import { certifyFactory } from "./factoryCertificationEngine.js";
import {
  completeFirstLaunch,
  generateInstallerArtifact,
  installFromArtifact,
  runDeterministicRebuildValidation,
  uninstallInstallation,
  upgradeInstallation,
  verifyInstallerArtifact,
  verifyInstallation,
} from "./factoryInstallerService.js";

test("generateInstallerArtifact writes verifiable INSTALL.sha256", () => {
  bootstrapApp();
  try {
    const testDir = path.join(getRepoRoot(), "local_data", "factory-test", randomUUID());
    const { artifact_dir, manifest } = generateInstallerArtifact(testDir);
    assert.ok(fs.existsSync(path.join(artifact_dir, "INSTALL.sha256")));
    assert.ok(fs.existsSync(path.join(artifact_dir, "institution.package.json")));
    assert.ok(fs.existsSync(path.join(artifact_dir, "README.txt")));

    const check = verifyInstallerArtifact(artifact_dir);
    assert.equal(check.valid, true, check.violations.join(", "));
    assert.equal(manifest.structural_hash, check.package?.structural_hash);

    fs.rmSync(testDir, { recursive: true, force: true });
  } finally {
    shutdownApp();
  }
});

test("install from artifact persists birth certificate — no Steve", () => {
  bootstrapApp();
  try {
    const testDir = path.join(getRepoRoot(), "local_data", "factory-test", randomUUID());
    const { artifact_dir } = generateInstallerArtifact(testDir);
    const record = installFromArtifact(artifact_dir);

    const verify = verifyInstallation(record.install_id);
    assert.equal(verify.valid, true, verify.violations.join(", "));

    const exportSer = JSON.stringify(exportBrainInstanceConfig()).toLowerCase();
    assert.ok(!exportSer.includes("steve"));

    const firstLaunch = completeFirstLaunch(record.install_id);
    assert.equal(firstLaunch.completed, true);

    uninstallInstallation(record.install_id);
    fs.rmSync(testDir, { recursive: true, force: true });
  } finally {
    shutdownApp();
  }
});

test("upgrade rejects structural_hash change", () => {
  bootstrapApp();
  try {
    const testDir = path.join(getRepoRoot(), "local_data", "factory-test", randomUUID());
    const { artifact_dir } = generateInstallerArtifact(testDir);
    const record = installFromArtifact(artifact_dir);

    const recordPath = path.join(record.install_path, FACTORY_ARTIFACT_FILES.install_record);
    const stored = JSON.parse(fs.readFileSync(recordPath, "utf8")) as typeof record;
    stored.structural_hash = "deadbeef".repeat(8);
    fs.writeFileSync(recordPath, JSON.stringify(stored, null, 2));

    assert.throws(() => upgradeInstallation(record.install_id, artifact_dir), /structural_hash/);

    uninstallInstallation(record.install_id);
    fs.rmSync(testDir, { recursive: true, force: true });
  } finally {
    shutdownApp();
  }
});

test("deterministic rebuild validation passes", () => {
  bootstrapApp();
  try {
    const result = runDeterministicRebuildValidation();
    assert.equal(result.pass, true);
    assert.equal(result.structural_hash, result.rebuild_hash);
  } finally {
    shutdownApp();
  }
});

test("PMO ten-gate certification passes with installer flow", () => {
  bootstrapApp();
  try {
    const report = certifyFactory({ include_installer_flow: true, lock_on_pass: false });
    assert.equal(report.dimensions.length, 10);
    assert.equal(report.certified, true, JSON.stringify(report.dimensions, null, 2));
    assert.ok(report.dimensions.some((d) => d.dimension_id === "package_verification"));
    assert.ok(report.dimensions.some((d) => d.dimension_id === "installation"));
  } finally {
    shutdownApp();
  }
});

test("PMO certification reports locked factory after ceremony", () => {
  bootstrapApp();
  try {
    const report = certifyFactory({ include_installer_flow: true, lock_on_pass: false });
    assert.equal(report.certified, true);
    assert.equal(isModuleCertificationLocked("factory"), true);
    assert.equal(report.certification_locked, true);
  } finally {
    shutdownApp();
  }
});
