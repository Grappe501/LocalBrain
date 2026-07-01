import {
  buildExecutiveOfficeProjection,
  CAPABILITY_REGISTRY,
  EXECUTIVE_OFFICE_ENGINE_ID,
  CONVENTION_CONTRACT_BUNDLE,
  FACTORY_CERT_DIMENSION_LABELS,
  type FactoryCertDimensionId,
  type FactoryCertDimensionStatus,
  type FactoryCertDimensionRow,
  type FactoryCertificationReport,
} from "@localbrain/shared";
import { runGraphIntegrityCertification } from "../integration/executiveExperienceAudit.js";
import {
  exportBrainInstanceConfig,
  getOnboardingState,
  getBrainInstanceProfile,
} from "../settings/brainInstanceService.js";
import {
  buildFactoryPackage,
  installFactoryPackage,
  verifyPackageIntegrity,
} from "./factoryPackageService.js";
import {
  CANONICAL_EMPTY_DISPLAY_NAME,
  CONSTITUTION_VERSION,
  readBirthCertificate,
} from "./factoryCore.js";

function dim(
  id: FactoryCertDimensionId,
  status: FactoryCertDimensionStatus,
  evidence: string | null,
): FactoryCertDimensionRow {
  return { dimension_id: id, label: FACTORY_CERT_DIMENSION_LABELS[id], status, evidence };
}

const PERSONAL_NAMES = ["steve", "kelly", "chris"] as const;

function scanForPersonalData(): { clean: boolean; hits: string[] } {
  const hits: string[] = [];
  const profile = getBrainInstanceProfile();
  const exportSer = JSON.stringify(exportBrainInstanceConfig()).toLowerCase();

  if (PERSONAL_NAMES.includes(profile.owner_type as (typeof PERSONAL_NAMES)[number])) {
    hits.push(`owner_type:${profile.owner_type}`);
  }

  const displayLower = profile.display_name.toLowerCase();
  for (const name of PERSONAL_NAMES) {
    if (displayLower.includes(name)) hits.push(`display_name:${profile.display_name}`);
    if (exportSer.includes(name)) hits.push(`export:${name}`);
  }

  return { clean: hits.length === 0, hits: [...new Set(hits)] };
}

/** PMO Factory certification — nine gates. */
export function certifyFactory(): FactoryCertificationReport {
  const birthCertificate = readBirthCertificate();
  const profile = getBrainInstanceProfile();
  const onboarding = getOnboardingState();
  const office = buildExecutiveOfficeProjection();
  const graph = runGraphIntegrityCertification();
  const personal = scanForPersonalData();

  let repeatabilityPass = false;
  let repeatabilityEvidence = "Not evaluated";
  try {
    const a = buildFactoryPackage();
    const b = buildFactoryPackage();
    repeatabilityPass = a.structural_hash === b.structural_hash;
    repeatabilityEvidence = repeatabilityPass
      ? `Deterministic structural_hash ${a.structural_hash.slice(0, 12)}…`
      : "Structural hash differed between builds";
  } catch (e) {
    repeatabilityEvidence = e instanceof Error ? e.message : "Repeatability check failed";
  }

  let integrityPass = false;
  let integrityEvidence = "Not evaluated";
  try {
    const pkg = buildFactoryPackage();
    const check = verifyPackageIntegrity(pkg);
    integrityPass = check.valid;
    integrityEvidence = integrityPass ? `integrity_hash ${pkg.integrity_hash.slice(0, 12)}…` : check.violations.join(", ");
  } catch (e) {
    integrityEvidence = e instanceof Error ? e.message : "Integrity check failed";
  }

  const conventionOk =
    birthCertificate != null &&
    birthCertificate.convention_contracts.ontology === CONVENTION_CONTRACT_BUNDLE.ontology &&
    birthCertificate.convention_contracts.lifecycle === CONVENTION_CONTRACT_BUNDLE.lifecycle &&
    birthCertificate.convention_contracts.recall === CONVENTION_CONTRACT_BUNDLE.recall &&
    birthCertificate.convention_contracts.provenance === CONVENTION_CONTRACT_BUNDLE.provenance &&
    birthCertificate.convention_contracts.ethics === CONVENTION_CONTRACT_BUNDLE.ethics;

  const dimensions: FactoryCertDimensionRow[] = [
    dim(
      "constitution",
      birthCertificate?.constitution_version === CONSTITUTION_VERSION ? "pass" : "needs_work",
      birthCertificate ? `Constitution ${birthCertificate.constitution_version}` : "No birth certificate",
    ),
    dim(
      "convention",
      conventionOk ? "pass" : "needs_work",
      conventionOk ? "All five Convention contracts embedded" : "Convention bundle incomplete",
    ),
    dim(
      "executive_office",
      office.executive_departments.length >= 8 ? "pass" : "needs_work",
      `${office.executive_departments.length} departments · ${EXECUTIVE_OFFICE_ENGINE_ID}`,
    ),
    dim(
      "capability_graph",
      graph.certified && CAPABILITY_REGISTRY.length > 0 ? "pass" : "needs_work",
      graph.certified
        ? `${CAPABILITY_REGISTRY.length} capabilities · graph certified`
        : graph.violations.slice(0, 2).map((v) => v.message).join("; ") || "Graph not certified",
    ),
    dim(
      "birth_certificate",
      birthCertificate != null ? "pass" : "needs_work",
      birthCertificate ? `Passport ${birthCertificate.passport.passport_id.slice(0, 8)}…` : "Missing",
    ),
    dim(
      "empty_profile",
      profile.display_name === CANONICAL_EMPTY_DISPLAY_NAME && !onboarding.completed ? "pass" : "needs_work",
      `${profile.display_name} · onboarding ${onboarding.completed ? "complete" : "pending"}`,
    ),
    dim("personal_data", personal.clean ? "pass" : "needs_work", personal.clean ? "No personal seeds" : personal.hits.join(", ")),
    dim("installer_repeatability", repeatabilityPass ? "pass" : "needs_work", repeatabilityEvidence),
    dim("package_integrity", integrityPass ? "pass" : "needs_work", integrityEvidence),
  ];

  const certified = dimensions.every((d) => d.status === "pass");

  return {
    module_id: "factory",
    module_name: "Empty Brain Factory",
    slice_id: "LB-OS-PROD-010",
    engine_id: "ENG-FAC-001",
    acceptance_criteria:
      "Download → Install → Launch → receive empty institution with birth certificate and Convention contracts — nothing personal.",
    dimensions,
    certified,
    launch_status: certified ? "certified" : "needs_work",
    review_verdict: certified ? "PASS" : "NEEDS WORK",
    observed_at: new Date().toISOString(),
  };
}

/** Run full acceptance test: build → install → verify certification gates. */
export function runFactoryAcceptanceTest(): {
  passed: boolean;
  structural_hash: string;
  certification: FactoryCertificationReport;
  install_id: string;
} {
  const pkg = buildFactoryPackage();
  const install = installFactoryPackage(pkg);
  const certification = certifyFactory();
  return {
    passed: certification.certified,
    structural_hash: pkg.structural_hash,
    certification,
    install_id: install.install_id,
  };
}
