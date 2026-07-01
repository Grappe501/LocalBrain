import { Router } from "express";
import type { FactoryPackage } from "@localbrain/shared";
import { isModuleCertificationLocked } from "../buildState/v1CertificationRegistry.js";
import { certifyFactory, runFactoryAcceptanceTest } from "./factoryCertificationEngine.js";
import {
  completeFirstLaunch,
  generateInstallerArtifact,
  getFactoryDistDir,
  installFromArtifact,
  loadPackageFromArtifact,
  uninstallInstallation,
  upgradeInstallation,
  verifyInstallation,
  verifyInstallerArtifact,
} from "./factoryInstallerService.js";
import {
  buildFactoryPackage,
  installFactoryPackage,
  verifyPackageIntegrity,
} from "./factoryPackageService.js";
import {
  getBirthCertificate,
  getEmptyInstitutionManifest,
  manufactureEmptyInstitution,
  verifyManufacturedInstitution,
} from "./factoryService.js";

export const factoryRouter = Router();

factoryRouter.post("/factory/manufacture", (_req, res) => {
  const result = manufactureEmptyInstitution();
  const verification = verifyManufacturedInstitution(result);
  if (!verification.valid) {
    res.status(500).json({ error: "Manufacture verification failed", violations: verification.violations });
    return;
  }
  res.status(201).json({ ...result, verification });
});

factoryRouter.get("/factory/birth-certificate", (_req, res) => {
  const birth_certificate = getBirthCertificate();
  if (!birth_certificate) {
    res.status(404).json({ error: "No birth certificate — manufacture or install first" });
    return;
  }
  res.json({ birth_certificate, observed_at: new Date().toISOString() });
});

factoryRouter.get("/factory/manifest", (_req, res) => {
  res.json({
    manifest: getEmptyInstitutionManifest(),
    birth_certificate: getBirthCertificate(),
    contract_version: "FAC-2026-07",
    observed_at: new Date().toISOString(),
  });
});

factoryRouter.post("/factory/package/build", (_req, res) => {
  const pkg = buildFactoryPackage();
  const integrity = verifyPackageIntegrity(pkg);
  res.status(201).json({ package: pkg, integrity, observed_at: new Date().toISOString() });
});

factoryRouter.get("/factory/package/download", (_req, res) => {
  const pkg = buildFactoryPackage();
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="localbrain-empty-institution-${pkg.structural_hash.slice(0, 8)}.json"`,
  );
  res.json(pkg);
});

factoryRouter.post("/factory/package/install", (req, res) => {
  try {
    const pkg = req.body as FactoryPackage;
    const integrity = verifyPackageIntegrity(pkg);
    if (!integrity.valid) {
      res.status(400).json({ error: "Package integrity failed", violations: integrity.violations });
      return;
    }
    const install = installFactoryPackage(pkg);
    const certification = certifyFactory({ include_installer_flow: false });
    res.status(201).json({ install, certification, observed_at: new Date().toISOString() });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Install failed" });
  }
});

/** Slice 3 — generate native installer artifact on disk. */
factoryRouter.post("/factory/installer/generate", (_req, res) => {
  const result = generateInstallerArtifact();
  const verification = verifyInstallerArtifact(result.artifact_dir);
  res.status(201).json({
    ...result,
    dist_root: getFactoryDistDir(),
    verification,
    observed_at: new Date().toISOString(),
  });
});

/** Slice 3 — install from artifact directory path. */
factoryRouter.post("/factory/installer/install", (req, res) => {
  try {
    const artifactDir = String(req.body?.artifact_dir ?? "");
    if (!artifactDir) {
      res.status(400).json({ error: "artifact_dir required" });
      return;
    }
    const record = installFromArtifact(artifactDir);
    const verification = verifyInstallation(record.install_id);
    res.status(201).json({ record, verification, observed_at: new Date().toISOString() });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Install failed" });
  }
});

factoryRouter.get("/factory/installer/verify/:installId", (req, res) => {
  res.json(verifyInstallation(req.params.installId));
});

factoryRouter.post("/factory/installer/upgrade", (req, res) => {
  try {
    const installId = String(req.body?.install_id ?? "");
    const artifactDir = String(req.body?.artifact_dir ?? "");
    const record = upgradeInstallation(installId, artifactDir);
    res.json({ record, observed_at: new Date().toISOString() });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Upgrade failed" });
  }
});

factoryRouter.post("/factory/installer/uninstall", (req, res) => {
  const installId = String(req.body?.install_id ?? "");
  res.json(uninstallInstallation(installId));
});

factoryRouter.post("/factory/installer/first-launch", (req, res) => {
  try {
    const installId = String(req.body?.install_id ?? "");
    const state = completeFirstLaunch(installId);
    res.json({ state, observed_at: new Date().toISOString() });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "First launch failed" });
  }
});

/** PMO ten-gate Factory certification. */
factoryRouter.get("/factory/certification", (_req, res) => {
  res.json(certifyFactory({ include_installer_flow: true }));
});

factoryRouter.post("/factory/pmo-certification", (req, res) => {
  const lock = req.body?.lock === true;
  const report = certifyFactory({ include_installer_flow: true, lock_on_pass: lock });
  res.status(report.certified ? 200 : 422).json({
    ...report,
    factory_locked: isModuleCertificationLocked("factory"),
  });
});

factoryRouter.post("/factory/acceptance-test", (req, res) => {
  const lock = req.body?.lock === true;
  const result = runFactoryAcceptanceTest(lock);
  res.status(result.passed ? 200 : 422).json({
    ...result,
    factory_locked: isModuleCertificationLocked("factory"),
  });
});

/** Load package from generated artifact (for CLI / verification). */
factoryRouter.get("/factory/installer/verify-artifact", (req, res) => {
  const artifactDir = String(req.query.path ?? "");
  if (!artifactDir) {
    res.status(400).json({ error: "path query required" });
    return;
  }
  try {
    const pkg = loadPackageFromArtifact(artifactDir);
    res.json({ valid: true, package_id: pkg.package_id, structural_hash: pkg.structural_hash });
  } catch (e) {
    res.status(400).json({ valid: false, error: e instanceof Error ? e.message : "Invalid" });
  }
});
