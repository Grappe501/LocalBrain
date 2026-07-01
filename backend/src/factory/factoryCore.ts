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
  type FactoryPackageProfileTemplate,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getBrainInstanceProfile, resetOnboarding } from "../settings/brainInstanceService.js";

export const BIRTH_CERTIFICATE_KEY = "brain_birth_certificate";
export const FACTORY_VERSION = "FAC-1.0.0";
export const MIGRATION_VERSION = "MIG-1.0.0";
export const CONSTITUTION_VERSION = "1.0";
export const OFFICE_PACK = "executive_office_v1";
export const CAPABILITY_PACK = "capability_graph_v1";

function writeSetting(key: string, value: string): void {
  getDatabase()
    .prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .run(key, value);
}

export function buildManifest(): EmptyInstitutionManifest {
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

export function buildBirthCertificate(instanceId: string): BrainBirthCertificate {
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

export function writeEmptyInstitutionState(
  instanceId: string,
  profileTemplate: FactoryPackageProfileTemplate,
  now: string,
): void {
  resetOnboarding();

  const profile = {
    instance_id: instanceId,
    ...profileTemplate,
    created_at: now,
    updated_at: now,
  };
  writeSetting("brain_instance_profile", JSON.stringify(profile));

  const birthCertificate = buildBirthCertificate(instanceId);
  writeSetting(BIRTH_CERTIFICATE_KEY, JSON.stringify(birthCertificate));
}

export function readBirthCertificate(): BrainBirthCertificate | null {
  const row = getDatabase()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(BIRTH_CERTIFICATE_KEY) as { value: string } | undefined;
  if (!row?.value) return null;
  return JSON.parse(row.value) as BrainBirthCertificate;
}

export { CANONICAL_EMPTY_DISPLAY_NAME };
