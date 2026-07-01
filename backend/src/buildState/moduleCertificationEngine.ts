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
  getMemoryOsProgressSnapshot,
  parseEngMemWave1Slices,
} from "./memoryOsSpecMetrics.js";
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
        ? "All ten Factory PMO gates PASS — manufacturing layer locked"
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

function certifyMemoryOsModule(): V1ModuleCertificationCard {
  const snap = getMemoryOsProgressSnapshot();
  const wave1 = parseEngMemWave1Slices();
  const episodeTests = countTests(["backend/src/memory/episode.test.ts"]);
  const factTests = countTests(["backend/src/memory/fact.test.ts"]);
  const artifactTests = countTests(["backend/src/memory/artifact.test.ts"]);
  const conversationTests = countTests(["backend/src/memory/conversation.test.ts"]);
  const decisionCitationTests = countTests(["backend/src/memory/decisionCitation.test.ts"]);
  const memoryTests = {
    files:
      episodeTests.files +
      factTests.files +
      artifactTests.files +
      conversationTests.files +
      decisionCitationTests.files,
    cases:
      episodeTests.cases +
      factTests.cases +
      artifactTests.cases +
      conversationTests.cases +
      decisionCitationTests.cases,
  };

  const specPass = snap.spec_frozen;
  const refSliceNote =
    snap.wave1_complete_count >= 5
      ? "Reference Slices 001–005 complete · ENG-PMO-005"
      : snap.wave1_complete_count >= 4
        ? "Reference Slices 001–004 complete"
        : snap.wave1_complete_count >= 3
          ? "Reference Slice 003 (Artifact) complete"
          : snap.wave1_complete_count >= 2
            ? "Reference Slice 002 (Fact) complete · Episode Reference Slice 001"
            : snap.wave1_complete_count >= 1
              ? "Reference Slice 001 (Episode)"
              : null;

  const dimensions: V1CertDimensionRow[] = [
    dim(
      "navigation",
      specPass ? "pass" : "pending",
      specPass
        ? `MEM-008 frozen · ${snap.mem008.passed}/${snap.mem008.total} PASS · ${snap.spec_tag ?? "memory-spec-v1.0"}`
        : `${snap.mem008.summary} — specification in progress`,
    ),
    dim(
      "experience",
      snap.wave1_complete_count > 0 ? "pass" : specPass ? "pending" : "pending",
      snap.wave1_complete_count > 0
        ? snap.wave1_complete_count >= 5
          ? `Institutional Cognition Foundation COMPLETE — Wave 1 5/5 · ${refSliceNote ?? "ENG-PMO-005"}`
          : `Institutional Evidence System — Wave 1 ${snap.wave1_complete_count}/${wave1.length || 5} · ${refSliceNote ?? "in progress"} · active ${snap.wave1_active_slice?.slice_code ?? "—"} ${snap.wave1_active_slice?.object ?? ""}`
        : "MEM-009 Wave 1 storage slices not yet started",
    ),
    dim(
      "tests",
      memoryTests.cases >= 6 ? "pass" : "pending",
      memoryTests.cases >= 6
        ? `${memoryTests.cases} memory storage tests (${episodeTests.cases} episode · ${factTests.cases} fact · ${artifactTests.cases} artifact · ${conversationTests.cases} conversation · ${decisionCitationTests.cases} decisionCitation)`
        : "Episode · Fact · Artifact · Conversation · DecisionCitation acceptance tests pending",
    ),
    dim(
      "security",
      specPass ? "pass" : "pending",
      specPass
        ? "Provenance envelope · audit log · lifecycle gates per Vol 1–7"
        : "Security model defined in spec — implementation pending",
    ),
    dim("kelly_sandbox", "not_applicable", "Kelly Sandbox golden test is post–Wave 1 certification"),
    dim(
      "launch",
      "pending",
      snap.wave1_complete_count >= 5
        ? "ENG-PMO-005 COMPLETE · Wave 1 5/5 · Executive Intelligence Era authorized"
        : snap.wave1_active_slice
          ? `Active: ${snap.wave1_active_slice.slice_code} ${snap.wave1_active_slice.object}`
          : "MEM-009 implementation in progress",
    ),
  ];

  const launch_status = specPass
    ? snap.wave1_complete_count >= 5
      ? launchStatusFromDimensions(dimensions)
      : "in_progress"
    : "not_started";

  return finalizeCertificationCard({
    module_id: "memory_os",
    module_name: "Memory OS",
    purpose: "Executive memory substrate — first living cognitive component.",
    acceptance_criteria:
      "MEM-008 spec frozen · ENG-MEM-001 Wave 1 all slices PASS · Kelly Sandbox golden test.",
    dimensions,
    launch_status,
    review_verdict: verdictFromLaunch(launch_status),
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
  memory_os: certifyMemoryOsModule,
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
