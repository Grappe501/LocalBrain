/**
 * ENG-FAC-001 — Empty Brain Factory manufacturing types (FAC contract)
 */

import type { BrainInstanceProfile, OnboardingState } from "./brainInstance.js";
import {
  EMPTY_BRAIN_BIRTH_CONTENT,
  EMPTY_BRAIN_BIRTH_EXCLUSIONS,
  FACTORY_ENGINE_ID,
  PRODUCT_SLICE_FACTORY,
} from "./productFactory.js";

export const FACTORY_CONTRACT_VERSION = "FAC-2026-07";

export const MANUFACTURING_PRINCIPLE =
  "Factory manufactures institutions. Memory OS personalizes institutions. Communications activates institutions.";

export const CONVENTION_CONTRACT_BUNDLE = {
  ontology: "CON-S1-2026-07",
  lifecycle: "CON-S2-2026-07",
  recall: "CON-S3-2026-07",
  provenance: "CON-S4-2026-07",
  ethics: "CON-S5-2026-07",
} as const;

export type ConventionContractBundle = typeof CONVENTION_CONTRACT_BUNDLE;

/** PMO exclusions beyond EMPTY_BRAIN_BIRTH_EXCLUSIONS — not manufactured by Factory. */
export const FACTORY_MANUFACTURING_EXCLUSIONS = [
  ...EMPTY_BRAIN_BIRTH_EXCLUSIONS,
  "memory_ingestion",
  "google",
  "gmail",
  "connector_activation",
] as const;

export interface BrainBirthCertificate {
  manufacturer: string;
  constitution_version: string;
  office_pack: string;
  capability_pack: string;
  factory_version: string;
  migration_version: string;
  identity: { instance_id: string; passport_id: string };
  authority: { status: "pre_activation"; authority_stack: string };
  passport: { passport_id: string; status: "issued_empty" };
  license: { status: "pre_activation"; license_id: string };
  manufactured_at: string;
  convention_contracts: ConventionContractBundle;
  contract_version: typeof FACTORY_CONTRACT_VERSION;
}

export interface EmptyInstitutionManifest {
  structure_included: readonly string[];
  structure_excluded: readonly string[];
  constitution_version: string;
  office_pack: string;
  capability_pack: string;
  departments_template: readonly string[];
  package_mode: "empty_brain";
  convention_contracts: ConventionContractBundle;
}

export interface ManufactureResult {
  manufacture_id: string;
  slice_id: typeof PRODUCT_SLICE_FACTORY;
  engine_id: typeof FACTORY_ENGINE_ID;
  birth_certificate: BrainBirthCertificate;
  manifest: EmptyInstitutionManifest;
  profile: BrainInstanceProfile;
  onboarding: OnboardingState;
  package_mode: "empty_brain";
  contract_version: typeof FACTORY_CONTRACT_VERSION;
  observed_at: string;
}

export const CANONICAL_EMPTY_DEPARTMENTS = [
  "Chief of Staff",
  "Communications",
  "Engineering",
  "Knowledge Explorer",
] as const;

export const CANONICAL_EMPTY_DISPLAY_NAME = "Executive Institution";

/** Compare institutional structure — instance ids may differ. */
export function institutionStructureMatches(
  a: EmptyInstitutionManifest,
  b: EmptyInstitutionManifest,
): boolean {
  const eq = (x: readonly string[], y: readonly string[]) =>
    x.length === y.length && x.every((v, i) => v === y[i]);

  return (
    a.constitution_version === b.constitution_version &&
    a.office_pack === b.office_pack &&
    a.capability_pack === b.capability_pack &&
    a.package_mode === b.package_mode &&
    a.convention_contracts.ontology === b.convention_contracts.ontology &&
    a.convention_contracts.lifecycle === b.convention_contracts.lifecycle &&
    a.convention_contracts.recall === b.convention_contracts.recall &&
    a.convention_contracts.provenance === b.convention_contracts.provenance &&
    a.convention_contracts.ethics === b.convention_contracts.ethics &&
    eq(a.structure_included, b.structure_included) &&
    eq(a.structure_excluded, b.structure_excluded) &&
    eq(a.departments_template, b.departments_template)
  );
}

export const FACTORY_STRUCTURE_INCLUDED = EMPTY_BRAIN_BIRTH_CONTENT;

export const FACTORY_PACKAGE_VERSION = 1;

export interface FactoryPackageProfileTemplate {
  owner_type: BrainInstanceProfile["owner_type"];
  display_name: string;
  role: string;
  primary_mission: string;
  executive_office_type: BrainInstanceProfile["executive_office_type"];
  departments_enabled: string[];
  default_privacy_tier: BrainInstanceProfile["default_privacy_tier"];
}

export interface FactoryPackage {
  package_version: typeof FACTORY_PACKAGE_VERSION;
  package_id: string;
  built_at: string;
  factory_contract_version: typeof FACTORY_CONTRACT_VERSION;
  slice_id: typeof PRODUCT_SLICE_FACTORY;
  engine_id: typeof FACTORY_ENGINE_ID;
  manifest: EmptyInstitutionManifest;
  profile_template: FactoryPackageProfileTemplate;
  convention_contracts: ConventionContractBundle;
  constitution_version: string;
  executive_office: {
    engine_id: string;
    slice_id: string;
    department_count: number;
    domain_count: number;
    synthesis_department_id: string;
  };
  capability_graph: {
    capability_count: number;
    graph_certified: boolean;
  };
  structural_hash: string;
  integrity_hash: string;
}

export const FACTORY_CERT_DIMENSION_LABELS = {
  manufacturing: "Manufacturing",
  installation: "Installation",
  integrity: "Integrity",
  repeatability: "Repeatability",
  empty_brain: "Empty Brain",
  convention: "Convention",
  executive_office: "Executive Office",
  capability_graph: "Capability Graph",
  birth_certificate: "Birth Certificate",
  package_verification: "Package Verification",
} as const;

/** @deprecated Slice 2 aliases — use PMO gate ids above */
export const LEGACY_FACTORY_CERT_ALIASES = {
  constitution: "manufacturing",
  personal_data: "empty_brain",
  installer_repeatability: "repeatability",
  package_integrity: "integrity",
  empty_profile: "empty_brain",
} as const;

export type FactoryCertDimensionId = keyof typeof FACTORY_CERT_DIMENSION_LABELS;
export type FactoryCertDimensionStatus = "pass" | "needs_work" | "pending";

export interface FactoryCertDimensionRow {
  dimension_id: FactoryCertDimensionId;
  label: string;
  status: FactoryCertDimensionStatus;
  evidence: string | null;
}

export interface FactoryInstallerManifest {
  installer_version: string;
  factory_contract_version: typeof FACTORY_CONTRACT_VERSION;
  package_id: string;
  structural_hash: string;
  integrity_hash: string;
  generated_at: string;
  artifact_files: {
    package: string;
    checksum: string;
    installer_manifest: string;
  };
}

export interface FactoryInstallRecord {
  install_id: string;
  install_path: string;
  package_id: string;
  structural_hash: string;
  profile_instance_id: string;
  installed_at: string;
  upgraded_at: string | null;
  uninstalled_at: string | null;
  first_launch_completed: boolean;
  first_launch_at: string | null;
}

export interface FactoryFirstLaunchState {
  completed: boolean;
  completed_at: string | null;
  install_id: string;
}

export const FACTORY_INSTALLER_VERSION = "INS-1.0.0";

export const FACTORY_ARTIFACT_FILES = {
  package: "institution.package.json",
  checksum: "INSTALL.sha256",
  installer_manifest: "installer-manifest.json",
  birth_certificate: "birth-certificate.json",
  install_record: "install-record.json",
  first_launch: "first-launch.json",
} as const;

export interface FactoryCertificationReport {
  module_id: "factory";
  module_name: string;
  slice_id: typeof PRODUCT_SLICE_FACTORY;
  engine_id: typeof FACTORY_ENGINE_ID;
  acceptance_criteria: string;
  dimensions: FactoryCertDimensionRow[];
  certified: boolean;
  launch_status: "certified" | "needs_work";
  review_verdict: "PASS" | "NEEDS WORK";
  observed_at: string;
  certification_locked?: boolean;
  install_id?: string | null;
}
