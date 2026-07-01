import { randomUUID } from "node:crypto";
import {
  CANONICAL_EMPTY_DEPARTMENTS,
  CANONICAL_EMPTY_DISPLAY_NAME,
  CONVENTION_CONTRACT_BUNDLE,
  FACTORY_CONTRACT_VERSION,
  FACTORY_MANUFACTURING_EXCLUSIONS,
  FACTORY_STRUCTURE_INCLUDED,
  type BrainBirthCertificate,
  type EmptyInstitutionManifest,
  type ManufactureResult,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import {
  getBrainInstanceProfile,
  getOnboardingState,
  resetOnboarding,
  updateBrainInstanceProfile,
} from "../settings/brainInstanceService.js";

const BIRTH_CERTIFICATE_KEY = "brain_birth_certificate";
const FACTORY_VERSION = "FAC-1.0.0";
const MIGRATION_VERSION = "MIG-1.0.0";
const CONSTITUTION_VERSION = "1.0";
const OFFICE_PACK = "executive_office_v1";
const CAPABILITY_PACK = "capability_graph_v1";

function readSetting(key: string): string | null {
  const row = getDatabase()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

function writeSetting(key: string, value: string): void {
  getDatabase()
    .prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .run(key, value);
}

function buildManifest(): EmptyInstitutionManifest {
  return {
    structure_included: [...FACTORY_STRUCTURE_INCLUDED],
    structure_excluded: [...FACTORY_MANUFACTURING_EXCLUSIONS],
    constitution_version: CONSTITUTION_VERSION,
    office_pack: OFFICE_PACK,
    capability_pack: CAPABILITY_PACK,
    departments_template: [...CANONICAL_EMPTY_DEPARTMENTS],
    package_mode: "empty_brain",
    convention_contracts: { ...CONVENTION_CONTRACT_BUNDLE },
  };
}

function buildBirthCertificate(instanceId: string): BrainBirthCertificate {
  const passportId = randomUUID();
  const licenseId = randomUUID();
  return {
    manufacturer: "LocalBrain Factory",
    constitution_version: CONSTITUTION_VERSION,
    office_pack: OFFICE_PACK,
    capability_pack: CAPABILITY_PACK,
    factory_version: FACTORY_VERSION,
    migration_version: MIGRATION_VERSION,
    identity: { instance_id: instanceId, passport_id: passportId },
    authority: { status: "pre_activation", authority_stack: "authority_v1" },
    passport: { passport_id: passportId, status: "issued_empty" },
    license: { status: "pre_activation", license_id: licenseId },
    manufactured_at: new Date().toISOString(),
    convention_contracts: { ...CONVENTION_CONTRACT_BUNDLE },
    contract_version: FACTORY_CONTRACT_VERSION,
  };
}

export function getBirthCertificate(): BrainBirthCertificate | null {
  const raw = readSetting(BIRTH_CERTIFICATE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as BrainBirthCertificate;
}

export function getEmptyInstitutionManifest(): EmptyInstitutionManifest {
  return buildManifest();
}

/** Manufacture a canonical empty executive institution — no personal data. */
export function manufactureEmptyInstitution(): ManufactureResult {
  const manufactureId = `MFG-${randomUUID()}`;
  const instanceId = randomUUID();
  const now = new Date().toISOString();

  resetOnboarding();

  const profile = updateBrainInstanceProfile({
    owner_type: "custom",
    display_name: CANONICAL_EMPTY_DISPLAY_NAME,
    role: "Executive",
    primary_mission: "",
    executive_office_type: "organization",
    departments_enabled: [...CANONICAL_EMPTY_DEPARTMENTS],
    default_privacy_tier: 1,
  });

  // Fresh instance id on each manufacture
  const freshProfile = {
    ...profile,
    instance_id: instanceId,
    created_at: now,
    updated_at: now,
  };
  writeSetting("brain_instance_profile", JSON.stringify(freshProfile));

  const birthCertificate = buildBirthCertificate(instanceId);
  writeSetting(BIRTH_CERTIFICATE_KEY, JSON.stringify(birthCertificate));

  const manifest = buildManifest();
  const onboarding = getOnboardingState();

  return {
    manufacture_id: manufactureId,
    slice_id: "LB-OS-PROD-010",
    engine_id: "ENG-FAC-001",
    birth_certificate: birthCertificate,
    manifest,
    profile: getBrainInstanceProfile(),
    onboarding,
    package_mode: "empty_brain",
    contract_version: FACTORY_CONTRACT_VERSION,
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

  if (result.package_mode !== "empty_brain") {
    violations.push("package_mode_not_empty_brain");
  }

  if (result.onboarding.completed) {
    violations.push("onboarding_must_not_be_completed_at_manufacture");
  }

  if (result.profile.display_name !== CANONICAL_EMPTY_DISPLAY_NAME) {
    violations.push("non_canonical_display_name");
  }

  for (const excluded of FACTORY_MANUFACTURING_EXCLUSIONS) {
    if (result.manifest.structure_included.includes(excluded)) {
      violations.push(`excluded_content_included:${excluded}`);
    }
  }

  const owner = result.profile.owner_type;
  if (owner === "steve" || owner === "kelly" || owner === "chris") {
    violations.push("person_specific_owner_type");
  }

  return { valid: violations.length === 0, violations };
}
