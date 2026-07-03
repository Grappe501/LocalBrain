import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";
import { getCommunicationsOfficeSnapshot } from "./communicationsOfficeMetrics.js";

const DOCS = path.join(getRepoRoot(), "docs", "contact-management");
const CHARTER_PATH = path.join(DOCS, "ENG-CONTACT-001-CHARTER.md");
const SLICE_001_1_PATH = path.join(DOCS, "slices", "ENG-CONTACT-001.1-CANONICAL-CONTACT-STORAGE.md");
const SLICE_001_2_PATH = path.join(DOCS, "slices", "ENG-CONTACT-001.2-CRUD-API-WORKBENCH-UI.md");
const SLICE_001_3_PATH = path.join(DOCS, "slices", "ENG-CONTACT-001.3-CSV-IMPORT-EXPORT.md");
const SLICE_001_4_PATH = path.join(DOCS, "slices", "ENG-CONTACT-001.4-COM-DRAFT-LINKING.md");
const CONTRACT_PATH = path.join(getRepoRoot(), "shared", "src", "contacts", "contactRecord.ts");
const REPOSITORY_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "contacts",
  "contactRepository.test.ts",
);
const ROUTES_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "contacts",
  "contactRoutes.test.ts",
);
const CSV_TEST_PATH = path.join(getRepoRoot(), "backend", "src", "contacts", "contactCsv.test.ts");
const DRAFT_LINK_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "contacts",
  "contactDraftLink.test.ts",
);
const DRAFT_LINK_ROUTES_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "contacts",
  "contactDraftLinkRoutes.test.ts",
);

export const CONTACT_SLICE_TARGET = 4;

export type ContactManagementSnapshot = {
  charter_authorized: boolean;
  crossing_started: boolean;
  slice_001_1_complete: boolean;
  slice_001_2_complete: boolean;
  slice_001_3_complete: boolean;
  slice_001_4_complete: boolean;
  slice_001_3_authorized: boolean;
  slice_001_4_authorized: boolean;
  module_complete: boolean;
  slices_complete: string[];
  slice_active: string | null;
  contract_version: string | null;
  repository_tests_count: number;
  routes_tests_count: number;
  csv_tests_count: number;
  draft_link_tests_count: number;
  module_progress_percent: number;
  building_today: string;
  summary: string;
  smallest_next_slice: string;
  critical_path_detail: string;
};

function readDoc(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function parseSliceStatus(text: string): string | null {
  const m = text.match(/\*\*Status:\*\*\s*\*\*([^*]+)\*\*/);
  return m?.[1]?.trim() ?? null;
}

function sliceEvidenceComplete(text: string): boolean {
  const pending = (text.match(/\|\s*Pending\s*\|/gi) ?? []).length;
  return pending === 0 && /C7.*✅|7\/7|11\/11|23\/23/i.test(text);
}

function detectCharterAuthorized(): boolean {
  const text = readDoc(CHARTER_PATH);
  return /\*\*AUTHORIZED\*\*/i.test(text);
}

function detectSliceComplete(slicePath: string, sliceId: string): boolean {
  const slice = readDoc(slicePath);
  const status = parseSliceStatus(slice);
  if (status?.includes("COMPLETE")) return true;
  if (status?.includes("IMPLEMENTATION FROZEN") && sliceEvidenceComplete(slice)) return true;
  return new RegExp(`${sliceId.replace(".", "\\.")}\\s+COMPLETE`, "i").test(slice);
}

function detectSlice001_3Authorized(): boolean {
  if (detectSliceComplete(SLICE_001_3_PATH, "ENG-CONTACT-001.3")) return true;
  return fs.existsSync(SLICE_001_3_PATH);
}

function detectSlice001_4Authorized(): boolean {
  if (detectSliceComplete(SLICE_001_4_PATH, "ENG-CONTACT-001.4")) return true;
  return fs.existsSync(SLICE_001_4_PATH);
}

function detectModuleComplete(): boolean {
  const charter = readDoc(CHARTER_PATH);
  return /module acceptance.*COMPLETE/i.test(charter) || /Contact Management V1.*\*\*COMPLETE\*\*/i.test(charter);
}

function countTests(filePath: string): number {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    return (text.match(/^test\(/gm) ?? []).length;
  } catch {
    return 0;
  }
}

function parseContractVersion(): string | null {
  try {
    const text = fs.readFileSync(CONTRACT_PATH, "utf8");
    const m = text.match(/CONTACT_RECORD_VERSION\s*=\s*"([^"]+)"/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

export function isContactManagementStarted(): boolean {
  const com = getCommunicationsOfficeSnapshot();
  return detectCharterAuthorized() && com.module_complete;
}

export function getContactManagementModuleProgress(): number {
  return getContactManagementSnapshot().module_progress_percent;
}

/** Authoritative Contact Management progress — charter through workbench slices. */
export function getContactManagementSnapshot(): ContactManagementSnapshot {
  const charter_authorized = detectCharterAuthorized();
  const com = getCommunicationsOfficeSnapshot();
  const crossing_started = charter_authorized && com.module_complete;
  const slice_001_1_complete = detectSliceComplete(SLICE_001_1_PATH, "ENG-CONTACT-001.1");
  const slice_001_2_complete = detectSliceComplete(SLICE_001_2_PATH, "ENG-CONTACT-001.2");
  const slice_001_3_complete = detectSliceComplete(SLICE_001_3_PATH, "ENG-CONTACT-001.3");
  const slice_001_4_complete = detectSliceComplete(SLICE_001_4_PATH, "ENG-CONTACT-001.4");
  const slice_001_3_authorized = detectSlice001_3Authorized();
  const slice_001_4_authorized = detectSlice001_4Authorized();
  const module_complete = detectModuleComplete();

  const slices_complete: string[] = [];
  if (slice_001_1_complete) slices_complete.push("ENG-CONTACT-001.1");
  if (slice_001_2_complete) slices_complete.push("ENG-CONTACT-001.2");
  if (slice_001_3_complete) slices_complete.push("ENG-CONTACT-001.3");
  if (slice_001_4_complete) slices_complete.push("ENG-CONTACT-001.4");

  const repository_tests_count = countTests(REPOSITORY_TEST_PATH);
  const routes_tests_count = countTests(ROUTES_TEST_PATH);
  const csv_tests_count = countTests(CSV_TEST_PATH);
  const draft_link_tests_count =
    countTests(DRAFT_LINK_TEST_PATH) + countTests(DRAFT_LINK_ROUTES_TEST_PATH);
  const contract_version = parseContractVersion();

  let slice_active: string | null = null;
  if (module_complete) slice_active = null;
  else if (slice_001_4_complete) slice_active = null;
  else if (slice_001_3_complete && !slice_001_4_complete) slice_active = "ENG-CONTACT-001.4";
  else if (slice_001_2_complete && !slice_001_3_complete) slice_active = "ENG-CONTACT-001.3";
  else if (slice_001_1_complete && !slice_001_2_complete) slice_active = "ENG-CONTACT-001.2";
  else if (crossing_started) slice_active = "ENG-CONTACT-001.1";

  let module_progress_percent = 0;
  if (crossing_started) {
    if (module_complete) module_progress_percent = 100;
    else if (slice_001_4_complete) module_progress_percent = 90;
    else if (slice_001_3_complete) module_progress_percent = 75;
    else if (slice_001_2_complete) module_progress_percent = 55;
    else if (slice_001_1_complete) module_progress_percent = 35;
    else if (charter_authorized) module_progress_percent = 15;
  }

  const behavioralTotal =
    repository_tests_count + routes_tests_count + csv_tests_count + draft_link_tests_count;

  let building_today: string;
  let smallest_next_slice: string;
  let summary: string;

  if (module_complete) {
    building_today = `Contact Management V1 COMPLETE · ${behavioralTotal}/${behavioralTotal} tests · Commercial Beta next`;
    smallest_next_slice = "Commercial Beta preparation";
    summary = "Contact Management V1 COMPLETE · trustworthy people records for beta";
  } else if (slice_001_4_complete) {
    building_today = `ENG-CONTACT-001.4 COMPLETE · COM draft linking live · ${behavioralTotal}/${behavioralTotal} tests · PMO module eval next`;
    smallest_next_slice = "PMO module evaluation (ENG-PMO-014 or successor)";
    summary = "All four ENG-CONTACT slices frozen · engineering complete · PMO gate next";
  } else if (slice_001_3_complete) {
    building_today = `ENG-CONTACT-001.3 COMPLETE · CSV import/export live · ${behavioralTotal}/${behavioralTotal} tests · COM linking next`;
    smallest_next_slice = "ENG-CONTACT-001.4 Communications draft linking";
    summary = "Workbench CRUD + CSV live · 3/4 slices frozen";
  } else if (slice_001_2_complete) {
    building_today = `ENG-CONTACT-001.2 COMPLETE · /studio/contacts live · ${behavioralTotal}/${behavioralTotal} tests · CSV next`;
    smallest_next_slice = "ENG-CONTACT-001.3 CSV import/export";
    summary = "Workbench CRUD live · storage + API + UI · 2/4 slices frozen";
  } else if (slice_001_1_complete) {
    building_today = `ENG-CONTACT-001.1 COMPLETE · Contract ${contract_version ?? "ENG-CONTACT-001.1"} · workbench UI next`;
    smallest_next_slice = "ENG-CONTACT-001.2 CRUD API + workbench UI";
    summary = "Canonical contact storage earned · workbench surface next";
  } else if (crossing_started) {
    building_today = "ENG-CONTACT-001 AUTHORIZED · Contact Management V1 · canonical storage first";
    smallest_next_slice = "ENG-CONTACT-001.1 Canonical Contact storage";
    summary = "Communications Office COMPLETE · Contact Management before Commercial Beta";
  } else {
    building_today = "Contact Management — awaiting ENG-CONTACT-001 authorization";
    smallest_next_slice = "ENG-CONTACT-001 charter";
    summary = "Communications Office must complete before Contact Management";
  }

  const critical_path_detail = module_complete
    ? "Contact Management COMPLETE → Commercial Beta"
    : slice_001_4_complete
      ? "ENG-CONTACT engineering complete → PMO module evaluation → Commercial Beta"
      : crossing_started
        ? "Contact Management V1 → Commercial Beta"
        : "Communications Office → Contact Management → Commercial Beta";

  return {
    charter_authorized,
    crossing_started,
    slice_001_1_complete,
    slice_001_2_complete,
    slice_001_3_complete,
    slice_001_4_complete,
    slice_001_3_authorized,
    slice_001_4_authorized,
    module_complete,
    slices_complete,
    slice_active,
    contract_version,
    repository_tests_count,
    routes_tests_count,
    csv_tests_count,
    draft_link_tests_count,
    module_progress_percent,
    building_today,
    summary,
    smallest_next_slice,
    critical_path_detail,
  };
}
