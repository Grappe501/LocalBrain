import type {
  V1CertDimensionRow,
  V1CertDimensionStatus,
  V1ModuleCertificationCard,
  V1ModuleLaunchStatus,
  V1ModuleReviewVerdict,
} from "@localbrain/shared";
import {
  V1_CERT_DIMENSION_LABELS,
  V1_MODULE_REVIEW_REQUEST,
  V1_NO_REGRESSION_RULE,
} from "@localbrain/shared";
import fs from "node:fs";
import path from "node:path";
import { runExecutiveExperienceAudit, runGraphIntegrityCertification } from "../integration/executiveExperienceAudit.js";
import { runIntegrationAudit } from "../integration/integrationAudit.js";
import { isVaultConfigured, isVaultUsingDevDefault } from "../providers/vault.js";
import { getRepoRoot } from "../db/repoRoot.js";
import { certifyFactory } from "../factory/factoryCertificationEngine.js";
import {
  hasRegression,
  isModuleCertificationLocked,
  lockModuleCertification,
} from "./v1CertificationRegistry.js";

const EXECUTIVE_OFFICE_TESTS = [
  "backend/src/certification/executiveBriefing.test.ts",
  "backend/src/certification/executiveOffice.test.ts",
  "backend/src/certification/executiveExperience.test.ts",
];

function dim(
  id: keyof typeof V1_CERT_DIMENSION_LABELS,
  status: V1CertDimensionStatus,
  evidence: string | null,
): V1CertDimensionRow {
  return { dimension_id: id, label: V1_CERT_DIMENSION_LABELS[id], status, evidence };
}

function countTests(relativePaths: string[]): { files: number; cases: number } {
  const root = getRepoRoot();
  let files = 0;
  let cases = 0;
  for (const rel of relativePaths) {
    const full = path.join(root, rel.replace(/\//g, path.sep));
    if (!fs.existsSync(full)) continue;
    files += 1;
    cases += (fs.readFileSync(full, "utf8").match(/\b(?:test|it)\s*\(/g) ?? []).length;
  }
  return { files, cases };
}

function launchStatusFromDimensions(rows: V1CertDimensionRow[]): V1ModuleLaunchStatus {
  if (rows.every((r) => r.status === "pass" || r.status === "not_applicable")) return "certified";
  if (rows.some((r) => r.status === "needs_work")) return "needs_work";
  if (rows.some((r) => r.status === "pending")) return "in_progress";
  return "not_started";
}

function verdictFromLaunch(status: V1ModuleLaunchStatus): V1ModuleReviewVerdict | null {
  if (status === "certified") return "PASS";
  if (status === "needs_work" || status === "regression") return "NEEDS WORK";
  return null;
}

function finalizeCertificationCard(card: V1ModuleCertificationCard): V1ModuleCertificationCard {
  const locked = isModuleCertificationLocked(card.module_id);
  let launch_status = card.launch_status;

  if (locked && launch_status !== "certified") {
    launch_status = "regression";
  } else if (!locked && launch_status === "certified") {
    lockModuleCertification(card.module_id);
  }

  const certification_locked = locked || launch_status === "certified";
  const regression_detected = hasRegression(card.module_id, launch_status);

  return {
    ...card,
    launch_status,
    certification_locked,
    regression_detected,
    review_verdict: verdictFromLaunch(launch_status),
  };
}

function certifyExecutiveOffice(): V1ModuleCertificationCard {
  const integration = runIntegrationAudit();
  const experience = runExecutiveExperienceAudit();
  const graph = runGraphIntegrityCertification();
  const tests = countTests(EXECUTIVE_OFFICE_TESTS);

  const navPass =
    integration.targets_met &&
    graph.certified &&
    experience.navigation_pass &&
    integration.metrics.orphan_pages === 0;

  const expPass =
    experience.certified &&
    experience.workflow_continuity_pass &&
    experience.cross_link_integrity_pass;

  const testsPass = tests.files >= 3 && tests.cases >= 10;

  const securityPass = isVaultConfigured() || isVaultUsingDevDefault();

  const dimensions: V1CertDimensionRow[] = [
    dim(
      "navigation",
      navPass ? "pass" : "needs_work",
      navPass
        ? `Integration targets met · graph ${graph.checks_passed}/${graph.checks_total} · no orphan routes`
        : `Orphans: ${integration.metrics.orphan_pages} · graph: ${graph.checks_passed}/${graph.checks_total}`,
    ),
    dim(
      "experience",
      expPass ? "pass" : "needs_work",
      expPass
        ? `Experience ${experience.executive_experience_label} (${experience.executive_experience_score})`
        : experience.executive_experience_label,
    ),
    dim(
      "tests",
      testsPass ? "pass" : "needs_work",
      `${tests.cases} cases in ${tests.files} files`,
    ),
    dim(
      "security",
      securityPass ? "pass" : "needs_work",
      securityPass
        ? isVaultConfigured()
          ? "Provider vault configured (production secret)"
          : "Provider vault implemented — dev default active"
        : "Vault unavailable",
    ),
    dim(
      "kelly_sandbox",
      "not_applicable",
      "Factory gate — Kelly Sandbox not required for Executive Office V1 certification",
    ),
  ];

  const coreReady = dimensions.every(
    (d) => d.status === "pass" || d.status === "not_applicable",
  );
  dimensions.push(
    dim(
      "launch",
      coreReady ? "pass" : "pending",
      coreReady
        ? "Executive Office V1 certification criteria met"
        : "Complete core dimensions first",
    ),
  );

  const launch_status = launchStatusFromDimensions(dimensions);

  return finalizeCertificationCard({
    module_id: "executive_office",
    module_name: "Executive Office",
    purpose: "Sovereign executive operating environment — narrative briefing, workspace, office, operations.",
    acceptance_criteria:
      "Navigation coherent · experience certified · test suite green · vault ready · V1 scope only.",
    dimensions,
    launch_status,
    review_verdict: verdictFromLaunch(launch_status),
    certification_locked: false,
    regression_detected: false,
  });
}

const FACTORY_TESTS = [
  "backend/src/factory/factoryService.test.ts",
  "backend/src/factory/factoryPackage.test.ts",
  "backend/src/factory/factoryInstaller.test.ts",
];

function certifyFactoryModule(): V1ModuleCertificationCard {
  const report = certifyFactory();
  const tests = countTests(FACTORY_TESTS);

  const mapStatus = (s: "pass" | "needs_work" | "pending"): V1CertDimensionStatus =>
    s === "pass" ? "pass" : s === "pending" ? "pending" : "needs_work";

  const get = (id: string) => report.dimensions.find((d) => d.dimension_id === id);

  const dimensions: V1CertDimensionRow[] = [
    dim(
      "navigation",
      mapStatus(get("executive_office")?.status ?? "needs_work"),
      get("executive_office")?.evidence ?? null,
    ),
    dim(
      "experience",
      mapStatus(get("installation")?.status ?? "needs_work"),
      get("installation")?.evidence ?? null,
    ),
    dim(
      "tests",
      tests.files >= 2 && tests.cases >= 6 ? "pass" : "needs_work",
      `${tests.cases} factory cases in ${tests.files} files`,
    ),
    dim(
      "security",
      mapStatus(get("empty_brain")?.status ?? "needs_work"),
      get("empty_brain")?.evidence ?? null,
    ),
    dim("kelly_sandbox", "not_applicable", "Factory — manufacturing gate; Kelly Sandbox is post-Memory OS"),
    dim(
      "launch",
      report.certified ? "pass" : "needs_work",
      report.certified
        ? "All nine Factory gates PASS"
        : report.dimensions.filter((d) => d.status !== "pass").map((d) => d.dimension_id).join(", "),
    ),
  ];

  const launch_status = report.certified ? "certified" : launchStatusFromDimensions(dimensions);

  return finalizeCertificationCard({
    module_id: "factory",
    module_name: "Empty Brain Factory",
    purpose: "Manufacture certified empty executive institutions — sealed appliance, nothing personal.",
    acceptance_criteria: report.acceptance_criteria,
    dimensions,
    launch_status,
    review_verdict: report.review_verdict,
    certification_locked: false,
    regression_detected: false,
  });
}

function placeholderCertification(
  module_id: string,
  module_name: string,
  purpose: string,
): V1ModuleCertificationCard {
  const dimensions: V1CertDimensionRow[] = (
    Object.keys(V1_CERT_DIMENSION_LABELS) as (keyof typeof V1_CERT_DIMENSION_LABELS)[]
  ).map((id) =>
    dim(id, id === "kelly_sandbox" ? "not_applicable" : "pending", "Not started — prior roadmap step incomplete"),
  );

  return {
    module_id,
    module_name,
    purpose,
    acceptance_criteria: "Complete when all dimensions PASS and Kelly Sandbox golden test passes.",
    dimensions,
    launch_status: "not_started",
    review_verdict: null,
    certification_locked: false,
    regression_detected: false,
  };
}

const MODULE_CERTIFIERS: Record<string, () => V1ModuleCertificationCard> = {
  executive_office: certifyExecutiveOffice,
  factory: certifyFactoryModule,
};

const MODULE_META: Record<string, { name: string; purpose: string }> = {
  executive_office: {
    name: "Executive Office",
    purpose: "Primary executive operating environment for daily judgment and attention.",
  },
  theory_convention: {
    name: "Theory & Convention",
    purpose: "Peer review, theory freeze, and epistemology convention gates before Memory OS.",
  },
  factory: {
    name: "Empty Brain Factory",
    purpose: "Manufacture empty installable brains with birth certificate and authority stack.",
  },
  memory_os: {
    name: "Memory OS",
    purpose: "Executive memory substrate — first living cognitive component.",
  },
  communications: {
    name: "Communications Office",
    purpose: "Email, SMS, calendar, relationships, CoS briefing integrations.",
  },
  documentation_beta: {
    name: "Documentation & Beta",
    purpose: "Commercial beta with Kelly, Chris, and trusted customers.",
  },
};

/** Certification card for the module currently on the critical path. */
export function certifyCurrentModule(moduleId: string | null): V1ModuleCertificationCard | null {
  if (!moduleId) return null;
  const certifier = MODULE_CERTIFIERS[moduleId];
  if (certifier) return certifier();
  const meta = MODULE_META[moduleId];
  if (!meta) return null;
  return placeholderCertification(moduleId, meta.name, meta.purpose);
}

export function getModuleReviewRequest() {
  return V1_MODULE_REVIEW_REQUEST;
}

export { V1_NO_REGRESSION_RULE };
