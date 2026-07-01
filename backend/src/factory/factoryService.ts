import { randomUUID } from "node:crypto";
import {
  CANONICAL_EMPTY_DEPARTMENTS,
  CANONICAL_EMPTY_DISPLAY_NAME,
  FACTORY_ENGINE_ID,
  FACTORY_MANUFACTURING_EXCLUSIONS,
  PRODUCT_SLICE_FACTORY,
  type FactoryPackageProfileTemplate,
  type ManufactureResult,
} from "@localbrain/shared";
import {
  buildBirthCertificate,
  buildManifest,
  writeEmptyInstitutionState,
  readBirthCertificate,
} from "./factoryCore.js";
import { getBrainInstanceProfile, getOnboardingState } from "../settings/brainInstanceService.js";

export function getBirthCertificate() {
  return readBirthCertificate();
}

export function getEmptyInstitutionManifest() {
  return buildManifest();
}

const defaultProfileTemplate = (): FactoryPackageProfileTemplate => ({
  owner_type: "custom",
  display_name: CANONICAL_EMPTY_DISPLAY_NAME,
  role: "Executive",
  primary_mission: "",
  executive_office_type: "organization",
  departments_enabled: [...CANONICAL_EMPTY_DEPARTMENTS],
  default_privacy_tier: 1,
});

/** Manufacture a canonical empty executive institution — no personal data. */
export function manufactureEmptyInstitution(): ManufactureResult {
  const manufactureId = `MFG-${randomUUID()}`;
  const instanceId = randomUUID();
  const now = new Date().toISOString();

  writeEmptyInstitutionState(instanceId, defaultProfileTemplate(), now);

  return {
    manufacture_id: manufactureId,
    slice_id: PRODUCT_SLICE_FACTORY,
    engine_id: FACTORY_ENGINE_ID,
    birth_certificate: buildBirthCertificate(instanceId),
    manifest: buildManifest(),
    profile: getBrainInstanceProfile(),
    onboarding: getOnboardingState(),
    package_mode: "empty_brain",
    contract_version: "FAC-2026-07",
    observed_at: now,
  };
}

export function verifyManufacturedInstitution(result: ManufactureResult): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const cert = result.birth_certificate;
  const required = [
    "manufacturer",
    "constitution_version",
    "office_pack",
    "capability_pack",
    "factory_version",
    "migration_version",
    "identity",
    "authority",
    "passport",
    "license",
  ] as const;

  for (const field of required) {
    if (cert[field] == null || cert[field] === "") {
      violations.push(`missing_birth_certificate_field:${field}`);
    }
  }

  if (result.package_mode !== "empty_brain") violations.push("package_mode_not_empty_brain");
  if (result.onboarding.completed) violations.push("onboarding_must_not_be_completed_at_manufacture");
  if (result.profile.display_name !== CANONICAL_EMPTY_DISPLAY_NAME) violations.push("non_canonical_display_name");

  for (const excluded of FACTORY_MANUFACTURING_EXCLUSIONS) {
    if (result.manifest.structure_included.includes(excluded)) {
      violations.push(`excluded_content_included:${excluded}`);
    }
  }

  if (result.profile.owner_type === "steve" || result.profile.owner_type === "kelly" || result.profile.owner_type === "chris") {
    violations.push("person_specific_owner_type");
  }

  return { valid: violations.length === 0, violations };
}
