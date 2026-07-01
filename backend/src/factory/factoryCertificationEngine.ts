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
import { isModuleCertificationLocked, lockModuleCertification } from "../buildState/v1CertificationRegistry.js";
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
import {
  completeFirstLaunch,
  generateInstallerArtifact,
  installFromArtifact,
  readPersistedBirthCertificate,
  runDeterministicRebuildValidation,
  uninstallInstallation,
  verifyInstallerArtifact,
  verifyInstallation,
} from "./factoryInstallerService.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { getRepoRoot } from "../db/repoRoot.js";

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

export type FactoryCertifyOptions = {
  /** Run full installer filesystem flow (slice 3). */
  include_installer_flow?: boolean;
  /** Lock Factory module when all gates pass. */
  lock_on_pass?: boolean;
};

/** PMO Factory certification — ten gates (slice 3). */
export function certifyFactory(options: FactoryCertifyOptions = {}): FactoryCertificationReport {
  const includeInstaller = options.include_installer_flow ?? true;
  const birthCertificate = readBirthCertificate();
  const profile = getBrainInstanceProfile();
  const onboarding = getOnboardingState();
  const office = buildExecutiveOfficeProjection();
  const graph = runGraphIntegrityCertification();
  const personal = scanForPersonalData();

  let manufacturingPass = false;
  let manufacturingEvidence = "Not evaluated";
  try {
    const pkg = buildFactoryPackage();
    manufacturingPass = verifyPackageIntegrity(pkg).valid;
    manufacturingEvidence = manufacturingPass
      ? `Package ${pkg.package_id.slice(0, 12)}… · constitution ${pkg.constitution_version}`
      : "Package build failed integrity";
  } catch (e) {
    manufacturingEvidence = e instanceof Error ? e.message : "Manufacturing failed";
  }

  let installationPass = false;
  let installationEvidence = "Skipped — no installer flow";
  let persistedBirthPass = false;
  let persistedBirthEvidence = "Skipped — no installer flow";
  let packageVerificationPass = false;
  let packageVerificationEvidence = "Skipped — no installer flow";
  let installId: string | null = null;

  if (includeInstaller) {
    try {
      const testRoot = path.join(getRepoRoot(), "local_data", "factory-test", randomUUID());
      const { artifact_dir } = generateInstallerArtifact(testRoot);
      const artifactCheck = verifyInstallerArtifact(artifact_dir);
      packageVerificationPass = artifactCheck.valid;
      packageVerificationEvidence = packageVerificationPass
        ? `INSTALL.sha256 verified · ${artifact_dir}`
        : artifactCheck.violations.join(", ");

      const record = installFromArtifact(artifact_dir);
      installId = record.install_id;
      const installCheck = verifyInstallation(record.install_id);
      installationPass = installCheck.valid;
      installationEvidence = installationPass
        ? `Installed ${record.install_id} · path persisted`
        : installCheck.violations.join(", ");

      const persisted = readPersistedBirthCertificate(record.install_id);
      persistedBirthPass = persisted != null && persisted.identity.instance_id === record.profile_instance_id;
      persistedBirthEvidence = persistedBirthPass
        ? `Persisted at install · passport ${persisted!.passport.passport_id.slice(0, 8)}…`
        : "Birth certificate not persisted on disk";

      completeFirstLaunch(record.install_id);
      uninstallInstallation(record.install_id);
      fs.rmSync(testRoot, { recursive: true, force: true });
    } catch (e) {
      installationEvidence = e instanceof Error ? e.message : "Installation flow failed";
      packageVerificationEvidence = installationEvidence;
      persistedBirthEvidence = installationEvidence;
    }
  } else if (birthCertificate) {
    persistedBirthPass = true;
    persistedBirthEvidence = "In-memory birth certificate present";
    installationPass = true;
    installationEvidence = "API install only (slice 2 mode)";
    packageVerificationPass = true;
    packageVerificationEvidence = "API package integrity (slice 2 mode)";
  }

  let repeatabilityPass = false;
  let repeatabilityEvidence = "Not evaluated";
  try {
    const rebuild = runDeterministicRebuildValidation();
    repeatabilityPass = rebuild.pass;
    repeatabilityEvidence = repeatabilityPass
      ? `Deterministic structural_hash ${rebuild.structural_hash.slice(0, 12)}…`
      : "Rebuild hash differed";
  } catch (e) {
    repeatabilityEvidence = e instanceof Error ? e.message : "Repeatability check failed";
  }

  let integrityPass = false;
  let integrityEvidence = "Not evaluated";
  try {
    const pkg = buildFactoryPackage();
    integrityPass = verifyPackageIntegrity(pkg).valid;
    integrityEvidence = integrityPass ? `integrity_hash ${pkg.integrity_hash.slice(0, 12)}…` : "Integrity failed";
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

  const emptyBrainPass =
    profile.display_name === CANONICAL_EMPTY_DISPLAY_NAME &&
    !onboarding.completed &&
    personal.clean;

  const dimensions: FactoryCertDimensionRow[] = [
    dim("manufacturing", manufacturingPass ? "pass" : "needs_work", manufacturingEvidence),
    dim("installation", installationPass ? "pass" : "needs_work", installationEvidence),
    dim("integrity", integrityPass ? "pass" : "needs_work", integrityEvidence),
    dim("repeatability", repeatabilityPass ? "pass" : "needs_work", repeatabilityEvidence),
    dim(
      "empty_brain",
      emptyBrainPass ? "pass" : "needs_work",
      emptyBrainPass ? "Empty profile · no personal seeds" : personal.hits.join(", ") || "Profile not empty",
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
      (includeInstaller ? persistedBirthPass : birthCertificate != null) ? "pass" : "needs_work",
      includeInstaller ? persistedBirthEvidence : birthCertificate ? "In-memory certificate" : "Missing",
    ),
    dim("package_verification", packageVerificationPass ? "pass" : "needs_work", packageVerificationEvidence),
  ];

  const certified = dimensions.every((d) => d.status === "pass");
  const alreadyLocked = isModuleCertificationLocked("factory");

  if (certified && options.lock_on_pass && !alreadyLocked) {
    lockModuleCertification("factory");
  }

  return {
    module_id: "factory",
    module_name: "Empty Brain Factory",
    slice_id: "LB-OS-PROD-010",
    engine_id: "ENG-FAC-001",
    acceptance_criteria:
      "Download → Install → Launch → receive certified empty institution — birth certificate persisted — nothing personal.",
    dimensions,
    certified,
    launch_status: certified ? "certified" : "needs_work",
    review_verdict: certified ? "PASS" : "NEEDS WORK",
    observed_at: new Date().toISOString(),
    certification_locked: alreadyLocked || (certified && options.lock_on_pass === true),
    install_id: installId,
  };
}

/** Run full acceptance test: artifact → install → certify → optional lock. */
export function runFactoryAcceptanceTest(lockOnPass = false): {
  passed: boolean;
  structural_hash: string;
  certification: FactoryCertificationReport;
  install_id: string | null;
} {
  const pkg = buildFactoryPackage();
  installFactoryPackage(pkg);
  const certification = certifyFactory({ include_installer_flow: true, lock_on_pass: lockOnPass });
  return {
    passed: certification.certified,
    structural_hash: pkg.structural_hash,
    certification,
    install_id: certification.install_id ?? null,
  };
}
