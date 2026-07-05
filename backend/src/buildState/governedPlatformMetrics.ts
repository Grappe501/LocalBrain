import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";
import { getContactManagementSnapshot } from "./contactManagementMetrics.js";

const EXECUTION_CHARTER_PATH = path.join(
  getRepoRoot(),
  "docs",
  "contact-management",
  "slices",
  "CONTACT-V3-EXECUTION-CHARTER.md",
);
const UCIE_README_PATH = path.join(getRepoRoot(), "docs", "ucie", "UCIE-README.md");
const CPAT_PATH = path.join(
  getRepoRoot(),
  "docs",
  "operator-readiness",
  "CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md",
);
const EDD_PATH = path.join(getRepoRoot(), "docs", "operator-readiness", "EVIDENCE-DRIVEN-DEVELOPMENT.md");
const WALKTHROUGH_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "operatorWalkthrough",
  "walkthrough001.test.ts",
);

const CONTACT_V3_TEST_GLOBS = [
  "backend/src/contacts/contactContext.test.ts",
  "backend/src/contacts/contactStewardship.test.ts",
  "backend/src/contacts/contactHousehold.test.ts",
  "backend/src/contacts/contactOrganization.test.ts",
  "backend/src/contacts/contactAction.test.ts",
  "backend/src/contacts/contactBrief.test.ts",
  "backend/src/contacts/relationshipAnalytics.test.ts",
  "backend/src/ucie/ucie.test.ts",
  "backend/src/operatorWalkthrough/walkthrough001.test.ts",
] as const;

export type GovernedPlatformSnapshot = {
  era_active: boolean;
  platform_readiness_level: "PRL-3" | "PRL-4" | null;
  phase_label: string;
  contact_v3_certified: boolean;
  ucie_certified: boolean;
  cpat_accepted: boolean;
  walkthrough_test_present: boolean;
  governed_tests_count: number;
  building_today: string;
  smallest_next_slice: string;
  summary: string;
  critical_path_detail: string;
  operator_walkthrough_id: string;
};

function readDoc(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function countTestsInGlobs(relativePaths: readonly string[]): number {
  const root = getRepoRoot();
  let total = 0;
  for (const rel of relativePaths) {
    const full = path.join(root, rel.replace(/\//g, path.sep));
    if (!fs.existsSync(full)) continue;
    const text = fs.readFileSync(full, "utf8");
    total += (text.match(/\btest\s*\(/g) ?? []).length;
  }
  return total;
}

function detectContactV3Certified(): boolean {
  const text = readDoc(EXECUTION_CHARTER_PATH);
  return (
    text.includes("Implementation Phase 1") &&
    /Implementation Phase 1[\s\S]{0,120}Complete/i.test(text) &&
    text.includes("Evidence-Driven Development")
  );
}

function detectUcieCertified(): boolean {
  const text = readDoc(UCIE_README_PATH);
  return /Reference Pattern Certified/i.test(text);
}

function detectEddDeclared(): boolean {
  const text = readDoc(EDD_PATH);
  return /\*\*Declared\*\*/i.test(text) || /YOU ARE HERE/i.test(text);
}

function detectCpatAccepted(): boolean {
  const text = readDoc(CPAT_PATH);
  return /\*\*ACCEPTED\*\*/i.test(text);
}

/** Governed constituent platform era — Contact v3 + UCIE + EDD active. */
export function isGovernedPlatformEraActive(): boolean {
  const contact = getContactManagementSnapshot();
  return (
    contact.module_complete &&
    detectContactV3Certified() &&
    detectUcieCertified() &&
    detectEddDeclared()
  );
}

export function getGovernedPlatformSnapshot(): GovernedPlatformSnapshot {
  const era_active = isGovernedPlatformEraActive();
  const governed_tests_count = countTestsInGlobs(CONTACT_V3_TEST_GLOBS);
  const walkthrough_test_present = fs.existsSync(WALKTHROUGH_TEST_PATH);

  if (!era_active) {
    return {
      era_active: false,
      platform_readiness_level: null,
      phase_label: "Implementation",
      contact_v3_certified: detectContactV3Certified(),
      ucie_certified: detectUcieCertified(),
      cpat_accepted: detectCpatAccepted(),
      walkthrough_test_present,
      governed_tests_count,
      building_today: getContactManagementSnapshot().building_today,
      smallest_next_slice: getContactManagementSnapshot().smallest_next_slice,
      summary: getContactManagementSnapshot().summary,
      critical_path_detail: getContactManagementSnapshot().critical_path_detail,
      operator_walkthrough_id: "OPERATOR-WALKTHROUGH-001",
    };
  }

  const cpat = detectCpatAccepted();
  const building_today = cpat
    ? `Protect the evidence · EDD · PRL-3 · CPAT v1.0 · PRL-4 operator sessions next`
    : `Protect the evidence · EDD · Contact v3 + UCIE certified · CPAT acceptance pending`;

  return {
    era_active: true,
    platform_readiness_level: "PRL-3",
    phase_label: "Evidence-Driven Development",
    contact_v3_certified: true,
    ucie_certified: true,
    cpat_accepted: cpat,
    walkthrough_test_present,
    governed_tests_count,
    building_today,
    smallest_next_slice: "PRL-4 — Internal Operator Validated (OPERATOR-WALKTHROUGH-001)",
    summary:
      "Governed platform certified · Contact v3 + UCIE reference patterns · operator evidence drives iteration",
    critical_path_detail: "PRL-3 automated acceptance → PRL-4 operator validation → Commercial Beta",
    operator_walkthrough_id: "OPERATOR-WALKTHROUGH-001",
  };
}

export function getGovernedPlatformModuleProgress(): number {
  if (!isGovernedPlatformEraActive()) return 0;
  return 100;
}

export function getOperatorValidationProgress(): number {
  if (!isGovernedPlatformEraActive()) return 0;
  return 25;
}
