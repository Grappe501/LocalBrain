import { Router } from "express";
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
    res.status(404).json({ error: "No birth certificate — manufacture first" });
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
