import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";
import { isWorkProductComplete } from "./executiveIntelligenceEraMetrics.js";

const DOCS = path.join(getRepoRoot(), "docs", "communications-office");
const CHARTER_PATH = path.join(DOCS, "ENG-COM-001-CHARTER.md");
const PMO_010_PATH = path.join(DOCS, "ENG-PMO-010-TRACEABLE-DRAFT-ACCEPTANCE.md");
const PMO_011_PATH = path.join(DOCS, "ENG-PMO-011-UNCERTAINTY-PRESERVATION-ACCEPTANCE.md");
const PMO_012_PATH = path.join(DOCS, "ENG-PMO-012-ADVISORY-RESTRAINT-ACCEPTANCE.md");
const PMO_013_PATH = path.join(DOCS, "ENG-PMO-013-COMMUNICATIONS-OFFICE-MODULE-EVALUATION.md");
const SLICE_001_1_PATH = path.join(DOCS, "slices", "ENG-COM-001.1-TRACEABLE-DRAFT-GENERATION.md");
const SLICE_001_2_PATH = path.join(DOCS, "slices", "ENG-COM-001.2-UNCERTAINTY-PRESERVATION.md");
const SLICE_001_3_PATH = path.join(DOCS, "slices", "ENG-COM-001.3-ADVISORY-RESTRAINT.md");
const CONTRACT_PATH = path.join(getRepoRoot(), "shared", "src", "memoryOs", "communicationsDraft.ts");
const TRACEABILITY_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "communicationsOffice",
  "communicationsDraft.test.ts",
);
const UNCERTAINTY_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "communicationsOffice",
  "communicationsDraftUncertainty.test.ts",
);
const ADVISORY_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "communicationsOffice",
  "communicationsDraftAdvisoryRestraint.test.ts",
);

/** Planned behavioral slices for the ENG-COM-001 crossing. */
export const COM_SLICE_TARGET = 3;

export type CommunicationsOfficeSnapshot = {
  charter_authorized: boolean;
  office_started: boolean;
  slice_001_1_complete: boolean;
  slice_001_2_complete: boolean;
  slice_001_3_authorized: boolean;
  slice_001_3_complete: boolean;
  slice_001_3_implementation_frozen: boolean;
  slice_001_3_pmo_pending: boolean;
  module_evaluation_pending: boolean;
  module_complete: boolean;
  slice_001_2_implementation_frozen: boolean;
  slice_001_2_pmo_pending: boolean;
  baseline_stable: boolean;
  slices_complete: string[];
  slice_active: string | null;
  contract_version: string | null;
  traceability_tests_count: number;
  uncertainty_tests_count: number;
  advisory_tests_count: number;
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

function parsePmoComplete(text: string): boolean {
  return /\*\*Status:\*\*\s*\*\*COMPLETE\*\*/i.test(text);
}

function parsePmoPending(text: string): boolean {
  return /\*\*Status:\*\*\s*\*\*PENDING\*\*/i.test(text);
}

function detectCharterAuthorized(): boolean {
  const text = readDoc(CHARTER_PATH);
  return /\*\*AUTHORIZED\*\*/i.test(text);
}

function detectSlice001_1Complete(): boolean {
  if (fs.existsSync(PMO_010_PATH) && parsePmoComplete(readDoc(PMO_010_PATH))) return true;
  const slice = readDoc(SLICE_001_1_PATH);
  return /ENG-COM-001\.1\s+COMPLETE/i.test(slice) || /ENG-PMO-010.*ACCEPTED/i.test(slice);
}

function parseSliceStatus(text: string): string | null {
  const m = text.match(/\*\*Status:\*\*\s*\*\*([^*]+)\*\*/);
  return m?.[1]?.trim() ?? null;
}

function detectSlice001_2Complete(): boolean {
  if (fs.existsSync(PMO_011_PATH) && parsePmoComplete(readDoc(PMO_011_PATH))) return true;
  const status = parseSliceStatus(readDoc(SLICE_001_2_PATH));
  return status?.includes("COMPLETE") ?? false;
}

function detectSlice001_3Authorized(): boolean {
  const status = parseSliceStatus(readDoc(SLICE_001_3_PATH));
  if (status?.includes("COMPLETE")) return true;
  if (status?.includes("FROZEN")) return true;
  return status?.includes("AUTHORIZED") ?? false;
}

function detectSlice001_3Complete(): boolean {
  if (fs.existsSync(PMO_012_PATH) && parsePmoComplete(readDoc(PMO_012_PATH))) return true;
  const status = parseSliceStatus(readDoc(SLICE_001_3_PATH));
  return status?.includes("COMPLETE") ?? false;
}

function detectSlice001_3Frozen(): boolean {
  if (detectSlice001_3Complete()) return false;
  const slice = readDoc(SLICE_001_3_PATH);
  return /IMPLEMENTATION FROZEN/i.test(slice);
}

function detectSlice001_3PmoPending(): boolean {
  if (detectSlice001_3Complete()) return false;
  if (!detectSlice001_3Frozen()) return false;
  if (fs.existsSync(PMO_012_PATH)) return parsePmoPending(readDoc(PMO_012_PATH));
  return true;
}

function detectModuleEvaluationComplete(): boolean {
  if (fs.existsSync(PMO_013_PATH) && parsePmoComplete(readDoc(PMO_013_PATH))) return true;
  const charter = readDoc(CHARTER_PATH);
  return /Communications Office.*\*\*COMPLETE\*\*/i.test(charter) || /module evaluation.*COMPLETE/i.test(charter);
}

function detectModuleEvaluationPending(): boolean {
  if (detectModuleEvaluationComplete()) return false;
  if (!detectSlice001_3Complete()) return false;
  if (fs.existsSync(PMO_013_PATH)) return parsePmoPending(readDoc(PMO_013_PATH));
  return true;
}

function detectSlice001_2Frozen(): boolean {
  if (detectSlice001_2Complete()) return false;
  const slice = readDoc(SLICE_001_2_PATH);
  return /IMPLEMENTATION FROZEN/i.test(slice);
}

function detectSlice001_2PmoPending(): boolean {
  if (detectSlice001_2Complete()) return false;
  if (!fs.existsSync(PMO_011_PATH)) return detectSlice001_2Frozen();
  return parsePmoPending(readDoc(PMO_011_PATH));
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
    const m = text.match(/COMMUNICATIONS_DRAFT_VERSION\s*=\s*"([^"]+)"/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

export function isCommunicationsOfficeStarted(): boolean {
  return detectCharterAuthorized() && isWorkProductComplete();
}

export function getCommunicationsOfficeModuleProgress(): number {
  return getCommunicationsOfficeSnapshot().module_progress_percent;
}

/** Authoritative Communications Office progress — charter through behavioral slices. */
export function getCommunicationsOfficeSnapshot(): CommunicationsOfficeSnapshot {
  const charter_authorized = detectCharterAuthorized();
  const slice_001_1_complete = detectSlice001_1Complete();
  const slice_001_2_complete = detectSlice001_2Complete();
  const slice_001_3_authorized = detectSlice001_3Authorized();
  const slice_001_3_complete = detectSlice001_3Complete();
  const slice_001_3_implementation_frozen = detectSlice001_3Frozen();
  const slice_001_3_pmo_pending =
    slice_001_3_implementation_frozen && detectSlice001_3PmoPending();
  const module_complete = detectModuleEvaluationComplete();
  const module_evaluation_pending = detectModuleEvaluationPending();
  const slice_001_2_implementation_frozen = detectSlice001_2Frozen();
  const slice_001_2_pmo_pending =
    slice_001_2_implementation_frozen && detectSlice001_2PmoPending();

  const slices_complete: string[] = [];
  if (slice_001_1_complete) slices_complete.push("ENG-COM-001.1");
  if (slice_001_2_complete) slices_complete.push("ENG-COM-001.2");
  if (slice_001_3_complete) slices_complete.push("ENG-COM-001.3");

  const office_started = charter_authorized && isWorkProductComplete();
  const slice_active = module_evaluation_pending
    ? "ENG-PMO-013"
    : slice_001_3_complete
      ? null
      : slice_001_3_authorized
      ? "ENG-COM-001.3"
      : slice_001_2_complete
        ? null
        : slice_001_2_implementation_frozen
          ? "ENG-COM-001.2"
          : slice_001_1_complete
            ? "ENG-COM-001.2"
            : charter_authorized
              ? "ENG-COM-001.1"
              : null;

  const baseline_stable =
    slice_001_2_complete && slice_001_1_complete && !slice_001_3_authorized && !slice_001_3_complete;

  const traceability_tests_count = countTests(TRACEABILITY_TEST_PATH);
  const uncertainty_tests_count = countTests(UNCERTAINTY_TEST_PATH);
  const advisory_tests_count = countTests(ADVISORY_TEST_PATH);
  const contract_version = parseContractVersion();

  let module_progress_percent = 0;
  if (office_started) {
    if (module_complete) module_progress_percent = 100;
    else if (module_evaluation_pending) module_progress_percent = 90;
    else if (slice_001_3_complete) module_progress_percent = 90;
    else if (slice_001_3_implementation_frozen) module_progress_percent = 88;
    else if (slice_001_3_authorized) module_progress_percent = 86;
    else if (slice_001_2_complete) module_progress_percent = 85;
    else if (slice_001_2_implementation_frozen) module_progress_percent = 75;
    else if (slice_001_1_complete) module_progress_percent = 50;
    else if (charter_authorized) module_progress_percent = 20;
  }

  let building_today: string;
  let smallest_next_slice: string;
  let summary: string;

  if (module_complete) {
    const behavioralTotal =
      traceability_tests_count + uncertainty_tests_count + advisory_tests_count;
    building_today = `Communications Office COMPLETE · ENG-PMO-013 · Contract ${contract_version ?? "ENG-COM-001.3"} · ${behavioralTotal}/${behavioralTotal} behavioral tests`;
    smallest_next_slice = "Commercial Beta preparation";
    summary =
      "Communications Office V1 subsystem COMPLETE · inherited traceability + uncertainty + advisory restraint";
  } else if (module_evaluation_pending) {
    const behavioralTotal =
      traceability_tests_count + uncertainty_tests_count + advisory_tests_count;
    building_today = `ENG-PMO-013 PENDING · Communications Office module evaluation · ${behavioralTotal}/${behavioralTotal} behavioral tests · inherited baseline committed`;
    smallest_next_slice = "ENG-PMO-013 Communications Office module evaluation (E1–E6 · scope · integration · readiness)";
    summary =
      "Behavioral slices COMPLETE · inherited baseline · module-level gate active · engineering closed";
  } else if (slice_001_3_complete) {
    const behavioralTotal =
      traceability_tests_count + uncertainty_tests_count + advisory_tests_count;
    const advisoryLabel = `${advisory_tests_count}/${advisory_tests_count} advisory`;
    building_today = `ENG-COM-001.3 COMPLETE · ENG-PMO-012 · Contract ${contract_version ?? "ENG-COM-001.3"} · ${advisoryLabel} · inherited advisory restraint`;
    smallest_next_slice = "Communications Office module evaluation";
    summary = `All behavioral slices COMPLETE · ${behavioralTotal}/${behavioralTotal} behavioral tests · traceability + uncertainty + advisory restraint inherited`;
  } else if (slice_001_3_implementation_frozen && !slice_001_3_complete) {
    const advisoryLabel = `${advisory_tests_count}/${advisory_tests_count} advisory`;
    building_today = `ENG-COM-001.3 IMPLEMENTATION FROZEN · Contract ${contract_version ?? "ENG-COM-001.3"} · ${advisoryLabel} · ENG-PMO-012 PENDING`;
    smallest_next_slice = "ENG-PMO-012 Advisory Restraint acceptance (A1–A5)";
    summary = `ENG-COM-001.3 FROZEN · A1–A5 evidence submitted · ${traceability_tests_count + uncertainty_tests_count + advisory_tests_count} behavioral tests`;
  } else if (slice_001_3_authorized && !slice_001_3_complete) {
    building_today =
      "ENG-COM-001.3 Advisory Restraint AUTHORIZED · active crossing · can the inhabitant remain advisory under ambiguity?";
    smallest_next_slice = "ENG-COM-001.3 implementation — A1–A5 behavioral evidence";
    summary =
      "ENG-COM-001.3 AUTHORIZED · inherited traceability + uncertainty · one behavioral question active";
  } else if (slice_001_2_complete && baseline_stable) {
    const testLabel = `${uncertainty_tests_count + traceability_tests_count}/${uncertainty_tests_count + traceability_tests_count} behavioral tests`;
    building_today = `Stable baseline · ENG-COM-001.2 COMPLETE · ENG-PMO-011 · Contract ${contract_version ?? "ENG-COM-001.2"} · ${testLabel}`;
    smallest_next_slice =
      "ENG-COM-001.3 Advisory Restraint — reserved · authorization required";
    summary =
      "Stable baseline · inherited traceability + uncertainty · no active architectural uncertainty";
  } else if (slice_001_2_implementation_frozen) {
    const testLabel = `${uncertainty_tests_count}/${uncertainty_tests_count} uncertainty · ${traceability_tests_count}/${traceability_tests_count} traceability`;
    building_today = `ENG-COM-001.2 IMPLEMENTATION FROZEN · Contract ${contract_version ?? "ENG-COM-001.2"} · ${testLabel} · ENG-PMO-011 PENDING`;
    smallest_next_slice = "ENG-PMO-011 Uncertainty Preservation acceptance (U1–U5)";
    summary = `ENG-COM-001.1 COMPLETE · ENG-PMO-010 · ENG-COM-001.2 FROZEN · ${testLabel} · PMO review pending`;
  } else if (slice_001_1_complete) {
    building_today = `ENG-COM-001.1 COMPLETE · ENG-PMO-010 · Contract ENG-COM-001.1 · ${traceability_tests_count}/${traceability_tests_count} traceability tests`;
    smallest_next_slice =
      "ENG-COM-001.2 Uncertainty Preservation — can uncertainty survive probabilistic rewriting?";
    summary = "ENG-COM-001.1 COMPLETE · ENG-PMO-010 · traceability earned · next: uncertainty preservation";
  } else if (charter_authorized && office_started) {
    building_today =
      "ENG-COM-001 Communications Office · charter AUTHORIZED · bounded probabilistic language generation";
    smallest_next_slice = "ENG-COM-001.1 Traceable Draft Generation";
    summary = "ENG-COM-001 AUTHORIZED · one architectural question · deterministic pipeline closed";
  } else {
    building_today = "Communications Office — awaiting ENG-COM-001 authorization";
    smallest_next_slice = "ENG-COM-001 Communications Office charter";
    summary = "Deterministic executive pipeline closed · Communications Office next";
  }

  const critical_path_detail = module_complete
    ? "Communications Office COMPLETE → Commercial Beta preparation"
    : module_evaluation_pending
      ? "ENG-PMO-013 module evaluation → Commercial Beta"
      : slice_001_3_complete
    ? "ENG-COM-001.3 COMPLETE → Communications Office module evaluation → Commercial Beta"
    : slice_001_3_implementation_frozen && !slice_001_3_complete
    ? "ENG-COM-001.3 FROZEN → ENG-PMO-012 → module evaluation → Commercial Beta"
    : slice_001_3_authorized && !slice_001_3_complete
    ? "ENG-COM-001.3 AUTHORIZED → crossing lifecycle → module evaluation → Commercial Beta"
    : slice_001_2_complete && baseline_stable
      ? "Stable baseline → ENG-COM-001.3 reserved → Commercial Beta"
      : slice_001_2_implementation_frozen
      ? "ENG-COM-001.1 COMPLETE → ENG-COM-001.2 PMO-011 PENDING → Commercial Beta"
      : slice_001_1_complete
        ? "ENG-COM-001.1 COMPLETE → ENG-COM-001.2 Uncertainty Preservation → Commercial Beta"
        : "Deterministic pipeline COMPLETE → Communications Office → Commercial Beta";

  return {
    charter_authorized,
    office_started,
    slice_001_1_complete,
    slice_001_2_complete,
    slice_001_3_authorized,
    slice_001_3_complete,
    slice_001_3_implementation_frozen,
    slice_001_3_pmo_pending,
    module_evaluation_pending,
    module_complete,
    slice_001_2_implementation_frozen,
    slice_001_2_pmo_pending,
    baseline_stable,
    slices_complete,
    slice_active,
    contract_version,
    traceability_tests_count,
    uncertainty_tests_count,
    advisory_tests_count,
    module_progress_percent,
    building_today,
    summary,
    smallest_next_slice,
    critical_path_detail,
  };
}
