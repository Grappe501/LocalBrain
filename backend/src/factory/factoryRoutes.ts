import { Router } from "express";
import type { FactoryPackage } from "@localbrain/shared";
import { certifyFactory, runFactoryAcceptanceTest } from "./factoryCertificationEngine.js";
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

/** Build sealed appliance package (Download). */
factoryRouter.post("/factory/package/build", (_req, res) => {
  const pkg = buildFactoryPackage();
  const integrity = verifyPackageIntegrity(pkg);
  res.status(201).json({ package: pkg, integrity, observed_at: new Date().toISOString() });
});

/** Download latest package — same as build for v1 single-instance factory line. */
factoryRouter.get("/factory/package/download", (_req, res) => {
  const pkg = buildFactoryPackage();
  res.setHeader("Content-Disposition", `attachment; filename="localbrain-empty-institution-${pkg.structural_hash.slice(0, 8)}.json"`);
  res.json(pkg);
});

/** Install sealed package (Install → Launch). */
factoryRouter.post("/factory/package/install", (req, res) => {
  try {
    const pkg = req.body as FactoryPackage;
    const integrity = verifyPackageIntegrity(pkg);
    if (!integrity.valid) {
      res.status(400).json({ error: "Package integrity failed", violations: integrity.violations });
      return;
    }
    const install = installFactoryPackage(pkg);
    const certification = certifyFactory();
    res.status(201).json({ install, certification, observed_at: new Date().toISOString() });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Install failed" });
  }
});

/** PMO Factory certification — nine gates. */
factoryRouter.get("/factory/certification", (_req, res) => {
  res.json(certifyFactory());
});

/** Full acceptance test: build → install → certify. */
factoryRouter.post("/factory/acceptance-test", (_req, res) => {
  const result = runFactoryAcceptanceTest();
  res.status(result.passed ? 200 : 422).json(result);
});
