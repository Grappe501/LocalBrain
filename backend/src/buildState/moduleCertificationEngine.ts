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
} from "@localbrain/shared";
import fs from "node:fs";
import path from "node:path";
import { runExecutiveExperienceAudit, runGraphIntegrityCertification } from "../integration/executiveExperienceAudit.js";
import { runIntegrationAudit } from "../integration/integrationAudit.js";
import { isVaultConfigured } from "../providers/vault.js";
import { getRepoRoot } from "../db/repoRoot.js";

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
  if (status === "needs_work") return "NEEDS WORK";
  return null;
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

  const securityPass = isVaultConfigured();

  const dimensions: V1CertDimensionRow[] = [
    dim(
      "navigation",
      navPass ? "pass" : "needs_work",
      navPass
        ? "Integration targets met · graph integrity certified · no orphan routes"
        : `Orphans: ${integration.metrics.orphan_pages} · graph: ${graph.certified}`,
    ),
    dim(
      "experience",
      expPass ? "pass" : "needs_work",
      expPass
        ? `Experience ${experience.executive_experience_label}`
        : experience.executive_experience_label,
    ),
    dim(
      "tests",
      testsPass ? "pass" : "needs_work",
      `${tests.cases} cases in ${tests.files} files`,
    ),
    dim(
      "security",
      securityPass ? "pass" : "pending",
      securityPass ? "Provider vault configured" : "Vault not configured — PROD-001 partial",
    ),
    dim(
      "kelly_sandbox",
      "pending",
      "Awaiting Kelly Sandbox — golden integration test at Factory gate",
    ),
  ];

  const coreReady = dimensions.every((d) => d.status === "pass");
  dimensions.push(
    dim(
      "launch",
      coreReady ? "needs_work" : "pending",
      coreReady ? "Kelly Sandbox PASS required for CERTIFIED" : "Complete core dimensions first",
    ),
  );

  const launch_status = launchStatusFromDimensions(dimensions);

  return {
    module_id: "executive_office",
    module_name: "Executive Office",
    purpose: "Sovereign executive operating environment — narrative briefing, workspace, office, operations.",
    acceptance_criteria:
      "Navigation coherent · experience certified · test suite green · vault ready · Kelly Sandbox pass.",
    dimensions,
    launch_status,
    review_verdict: verdictFromLaunch(launch_status),
  };
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
  };
}

const MODULE_CERTIFIERS: Record<string, () => V1ModuleCertificationCard> = {
  executive_office: certifyExecutiveOffice,
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
