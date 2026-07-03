import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";

const DOCS = path.join(getRepoRoot(), "docs", "memory-os");
const SLICES_DIR = path.join(DOCS, "slices");
const EI_LOCK_PATH = path.join(DOCS, "certification", "ei-doctrine-lock.json");
const RETRIEVAL_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "executiveIntelligence",
  "constitutionalRetrieval.test.ts",
);
const RETRIEVAL_SERVICE_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "executiveIntelligence",
  "constitutionalRetrievalService.ts",
);
const CITATION_INTEGRITY_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "executiveIntelligence",
  "citationIntegrity.ts",
);
const RETRIEVAL_AUDIT_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "executiveIntelligence",
  "retrievalAudit.ts",
);
const CONTRACT_VERSION_PATH = path.join(
  getRepoRoot(),
  "shared",
  "src",
  "memoryOs",
  "constitutionalRetrieval.ts",
);

const PMO_008_PATH = path.join(DOCS, "ENG-PMO-008-CONSTITUTIONAL-RETRIEVAL-ACCEPTANCE.md");
const PMO_009_PATH = path.join(DOCS, "ENG-PMO-009-EXECUTIVE-BRIEF-ACCEPTANCE.md");
const DOC_003_PATH = path.join(DOCS, "ENG-EI-DOC-003-CONSTITUTIONAL-RETRIEVAL-COMPLETE.md");
const EXECUTIVE_BRIEF_RENDERER_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "executiveIntelligence",
  "executiveBriefRenderer.ts",
);
const EXECUTIVE_BRIEF_CONTRACT_PATH = path.join(
  getRepoRoot(),
  "shared",
  "src",
  "memoryOs",
  "executiveBrief.ts",
);
const EXECUTIVE_BRIEF_TEST_PATH = path.join(
  getRepoRoot(),
  "backend",
  "src",
  "executiveIntelligence",
  "executiveBrief.test.ts",
);

/** Planned ENG-EI-001 implementation slices — all shipped before PMO-008. */
export const ENG_EI_001_IMPL_SLICE_TARGET = 3;

/** Planned ENG-EI-002 implementation slices — both shipped before PMO-009. */
export const ENG_EI_002_IMPL_SLICE_TARGET = 2;

export type ExecutiveIntelligenceImplementationPhase =
  | "pre_implementation"
  | "correctness"
  | "quality"
  | "retrieval_complete"
  | "work_product"
  | "performance";

function readDoc(name: string): string {
  try {
    return fs.readFileSync(path.join(DOCS, name), "utf8");
  } catch {
    return "";
  }
}

function parseStatus(text: string): string | null {
  const m = text.match(/\*\*Status:\*\*\s*\*\*([^*]+)\*\*/);
  return m?.[1]?.trim() ?? null;
}

function countMar3Pending(text: string): number {
  const pending = text.match(/\|\s*Q\d+\s*\|[^|\n]*\|[^|\n]*\|\s*\*\*PENDING\*\*/g);
  return pending?.length ?? 0;
}

function countArticles(text: string): number {
  const articles = text.match(/^### Article [IVX]+ —/gm);
  return articles?.length ?? 0;
}

function fileExists(relPath: string): boolean {
  return fs.existsSync(path.join(getRepoRoot(), relPath));
}

function parseBriefContractVersion(): string | null {
  try {
    const text = fs.readFileSync(EXECUTIVE_BRIEF_CONTRACT_PATH, "utf8");
    const m = text.match(/EXECUTIVE_BRIEF_VERSION\s*=\s*"([^"]+)"/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function countBriefTests(): number {
  try {
    const text = fs.readFileSync(EXECUTIVE_BRIEF_TEST_PATH, "utf8");
    return (text.match(/^test\(/gm) ?? []).length;
  } catch {
    return 0;
  }
}

function detectWorkProductComplete(): boolean {
  if (fs.existsSync(PMO_009_PATH)) return true;
  const charter = readDoc("ENG-EI-002-CHARTER.md");
  return /\*\*COMPLETE\*\*/i.test(charter) && /ENG-PMO-009/i.test(charter);
}

function detectWorkProductSlicesComplete(): string[] {
  const complete: string[] = [];
  if (
    fs.existsSync(EXECUTIVE_BRIEF_RENDERER_PATH) &&
    fs.existsSync(EXECUTIVE_BRIEF_CONTRACT_PATH)
  ) {
    complete.push("ENG-EI-002.1");
    if (parseBriefContractVersion() === "ENG-EI-002.2") {
      complete.push("ENG-EI-002.2");
    }
  }
  return complete;
}

function workProductProgressPercent(
  slicesComplete: string[],
  workProductComplete: boolean,
): number {
  if (workProductComplete) return 100;
  if (slicesComplete.length === 0) return 0;
  return Math.min(
    99,
    Math.round((slicesComplete.length / ENG_EI_002_IMPL_SLICE_TARGET) * 100),
  );
}

function parseContractVersion(): string | null {
  try {
    const text = fs.readFileSync(CONTRACT_VERSION_PATH, "utf8");
    const m = text.match(/CONSTITUTIONAL_RETRIEVAL_VERSION\s*=\s*"([^"]+)"/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function countRetrievalTests(): number {
  try {
    const text = fs.readFileSync(RETRIEVAL_TEST_PATH, "utf8");
    return (text.match(/^test\(/gm) ?? []).length;
  } catch {
    return 0;
  }
}

function detectImplSlicesComplete(): string[] {
  const complete: string[] = [];
  if (fs.existsSync(RETRIEVAL_SERVICE_PATH)) {
    complete.push("ENG-EI-001.1");
  }
  if (fs.existsSync(CITATION_INTEGRITY_PATH) && fileExists("shared/src/memoryOs/retrievalRules.ts")) {
    complete.push("ENG-EI-001.2");
  }
  if (fs.existsSync(RETRIEVAL_AUDIT_PATH) && fileExists("backend/src/executiveIntelligence/retrievalOrdering.ts")) {
    complete.push("ENG-EI-001.3");
  }
  return complete;
}

function implProgressPercent(slicesComplete: string[]): number {
  if (slicesComplete.length === 0) return 0;
  return Math.min(
    99,
    Math.round((slicesComplete.length / ENG_EI_001_IMPL_SLICE_TARGET) * 100),
  );
}

function isRetrievalCharterComplete(charterText: string): boolean {
  return /\*\*COMPLETE\*\*/i.test(charterText) && /ENG-PMO-008/i.test(charterText);
}

function detectRetrievalComplete(engEi001Charter: string): boolean {
  if (isRetrievalCharterComplete(engEi001Charter)) return true;
  return fs.existsSync(PMO_008_PATH);
}

function resolveImplementationPhase(
  slicesComplete: string[],
  retrievalComplete: boolean,
): ExecutiveIntelligenceImplementationPhase {
  if (retrievalComplete) return "work_product";
  if (slicesComplete.length === 0) return "pre_implementation";
  if (slicesComplete.includes("ENG-EI-001.2")) return "quality";
  if (slicesComplete.includes("ENG-EI-001.1")) return "correctness";
  return "pre_implementation";
}

export type ExecutiveIntelligenceEraSnapshot = {
  /** Institutional Cognition Foundation closed — Executive Intelligence Era active. */
  era_authorized: boolean;
  doctrine_status: string;
  doctrine_articles: number;
  mar3_status: string;
  mar3_questions_pending: number;
  mar3_complete: boolean;
  ei001_status: string;
  doctrine_frozen: boolean;
  eng_ei001_status: string;
  /** Governance pre-implementation progress 0–100 (doctrine · MAR-3 · freeze · charter). */
  pre_impl_progress_percent: number;
  implementation_started: boolean;
  implementation_phase: ExecutiveIntelligenceImplementationPhase;
  impl_slices_complete: string[];
  impl_progress_percent: number;
  retrieval_contract_version: string | null;
  retrieval_tests_count: number;
  retrieval_complete: boolean;
  work_product_started: boolean;
  work_product_complete: boolean;
  work_product_slices_complete: string[];
  work_product_progress_percent: number;
  work_product_contract_version: string | null;
  reference_consumer_id: string | null;
  brief_tests_count: number;
  building_today: string;
  summary: string;
  smallest_next_slice: string;
  critical_path_detail: string;
};

function preImplProgress(input: {
  doctrine_ready: boolean;
  mar3_complete: boolean;
  doctrine_frozen: boolean;
  charter_reserved: boolean;
}): number {
  let p = 0;
  if (input.doctrine_ready) p += 35;
  if (input.mar3_complete) p += 30;
  if (input.doctrine_frozen) p += 25;
  if (input.charter_reserved) p += 10;
  return Math.min(100, p);
}

/** Authoritative Executive Intelligence Era posture — parsed from constitutional docs + implementation. */
export function getExecutiveIntelligenceEraSnapshot(): ExecutiveIntelligenceEraSnapshot {
  const doctrine = readDoc("EXECUTIVE-INTELLIGENCE-DOCTRINE.md");
  const mar3 = readDoc("MAR-3-EXECUTIVE-INTELLIGENCE-ARCHITECTURE_REVIEW.md");
  const ei001 = readDoc("EI-001-DOCTRINE-FREEZE.md");
  const engEi001 = readDoc("ENG-EI-001-CHARTER.md");
  const engEi002 = readDoc("ENG-EI-002-CHARTER.md");

  const doctrine_status = parseStatus(doctrine) ?? "UNKNOWN";
  const mar3_status = parseStatus(mar3) ?? "UNKNOWN";
  const ei001_status = parseStatus(ei001) ?? "UNKNOWN";
  const eng_ei001_status = parseStatus(engEi001) ?? "UNKNOWN";

  const doctrine_articles = countArticles(doctrine);
  const mar3_questions_pending = countMar3Pending(mar3);
  const mar3_complete = /COMPLETE/i.test(mar3_status) && mar3_questions_pending === 0;
  let doctrine_frozen = false;
  try {
    if (fs.existsSync(EI_LOCK_PATH)) {
      const lock = JSON.parse(fs.readFileSync(EI_LOCK_PATH, "utf8")) as { doctrine_frozen?: boolean };
      if (lock.doctrine_frozen === true) doctrine_frozen = true;
    }
  } catch {
    /* fall through */
  }
  if (!doctrine_frozen) {
    doctrine_frozen =
      /DECLARED FROZEN|FROZEN/i.test(ei001_status) && !/^RESERVED/i.test(ei001_status.trim());
  }
  const doctrine_live =
    /AUTHORIZED|FROZEN/i.test(doctrine_status) || doctrine_frozen;
  const era_authorized = doctrine.length > 0 && doctrine_live;
  const doctrine_ready = doctrine_articles >= 9 && doctrine_live;

  const pre_impl_progress_percent = preImplProgress({
    doctrine_ready,
    mar3_complete,
    doctrine_frozen,
    charter_reserved: engEi001.length > 0,
  });

  const impl_slices_complete = detectImplSlicesComplete();
  const retrieval_complete = detectRetrievalComplete(engEi001);
  const implementation_started = impl_slices_complete.length > 0 || retrieval_complete;
  const implementation_phase = resolveImplementationPhase(impl_slices_complete, retrieval_complete);
  const impl_progress_percent = retrieval_complete
    ? 100
    : implProgressPercent(impl_slices_complete);
  const retrieval_contract_version = parseContractVersion();
  const retrieval_tests_count = countRetrievalTests();
  const work_product_slices_complete = detectWorkProductSlicesComplete();
  const work_product_complete = detectWorkProductComplete();
  const work_product_started =
    work_product_slices_complete.length > 0 || work_product_complete;
  const work_product_progress_percent = workProductProgressPercent(
    work_product_slices_complete,
    work_product_complete,
  );
  const work_product_contract_version = parseBriefContractVersion();
  const brief_tests_count = countBriefTests();
  const reference_consumer_id = work_product_complete ? "Reference Consumer 001" : null;

  let building_today: string;
  let smallest_next_slice: string;
  let summary: string;

  if (doctrine_frozen && retrieval_complete && work_product_complete) {
    const briefContract = work_product_contract_version ?? "ENG-EI-002.2";
    const briefTestLabel =
      brief_tests_count > 0 ? `${brief_tests_count}/${brief_tests_count} brief tests` : "brief tests";
    building_today = `ENG-EI-002 COMPLETE · Reference Consumer 001 · Work Product Contract ${briefContract} · deterministic pipeline closed · ${briefTestLabel}`;
    smallest_next_slice =
      "Probabilistic reasoning must inhabit deterministic interfaces — Communications Office";
    summary = `ENG-EI-002 COMPLETE · ENG-PMO-009 · Reference Consumer 001 · Lane 2 · deterministic executive pipeline closed`;
  } else if (doctrine_frozen && retrieval_complete && work_product_started) {
    const wpLabel = work_product_slices_complete.join(" · ");
    const briefContract = work_product_contract_version ?? "ENG-EI-002";
    const briefTestLabel =
      brief_tests_count > 0 ? `${brief_tests_count}/${brief_tests_count} brief tests` : "brief tests";
    const retrievalContract = retrieval_contract_version ?? "ENG-EI-001.3";
    building_today = `ENG-EI-002 quality phase — ${wpLabel} COMPLETE · Work Product Contract ${briefContract} · ${briefTestLabel}`;
    smallest_next_slice = work_product_slices_complete.includes("ENG-EI-002.2")
      ? "ENG-EI-002 charter acceptance (B1–B9) — Reference Consumer 001"
      : "ENG-EI-002.2 behavioral fidelity — citation grouping · omissions · without making it smarter";
    summary = `ENG-EI-002 IN PROGRESS · ${wpLabel} · Lane 2 · Evidence Package ${retrievalContract} · Doctrine Fidelity`;
  } else if (doctrine_frozen && retrieval_complete) {
    const contractLabel = retrieval_contract_version ?? "ENG-EI-001.3";
    const testLabel =
      retrieval_tests_count > 0 ? `${retrieval_tests_count}/${retrieval_tests_count} retrieval tests` : "retrieval tests";
    building_today = `ENG-EI-002 Executive Brief — first Evidence Package consumer · Lane 2 · Contract ${contractLabel}`;
    smallest_next_slice = "ENG-EI-002 Executive Brief (Reference Consumer 001)";
    summary = `ENG-EI-001 COMPLETE · ENG-PMO-008 · Evidence Package Contract ${contractLabel} · ${testLabel}`;
  } else if (doctrine_frozen && implementation_started) {
    const sliceLabel = impl_slices_complete.join(" · ");
    const contractLabel = retrieval_contract_version ?? "ENG-EI-001";
    const testLabel =
      retrieval_tests_count > 0 ? `${retrieval_tests_count}/${retrieval_tests_count} retrieval tests` : "retrieval tests";
    building_today = `ENG-EI-001 quality phase — ${sliceLabel} COMPLETE · Evidence Package Contract ${contractLabel} · ${testLabel}`;
    smallest_next_slice = "ENG-EI-001 charter acceptance (A1–A9) · remaining quality work without making it smarter";
    summary = `ei-doctrine-v1.0 FROZEN · ENG-EI-001 IN PROGRESS · ${sliceLabel} · ${implementation_phase} phase · Doctrine Fidelity`;
  } else if (doctrine_frozen) {
    building_today = "ENG-EI-001 Constitutional Retrieval — read-only · cite · package evidence";
    smallest_next_slice = "ENG-EI-001.1 Constitutional Retrieval (fidelity-first implementation)";
    summary = "ei-doctrine-v1.0 FROZEN · ENG-EI-001 AUTHORIZED · fidelity-first engineering";
  } else if (mar3_complete) {
    building_today = "EI-001 Doctrine Freeze ceremony — ei-doctrine-v1.0";
    smallest_next_slice = "EI-001 Executive Intelligence Doctrine Freeze";
    summary = "MAR-3 COMPLETE · EI-001 freeze pending · Articles I–IX";
  } else if (doctrine_ready) {
    building_today = `Executive Intelligence Era — MAR-3 architecture review (${mar3_questions_pending} questions PENDING)`;
    smallest_next_slice = "MAR-3 Executive Intelligence Architecture Review walkthrough";
    summary = `Doctrine AUTHORIZED · ${doctrine_articles} articles · MAR-3 pre-freeze · EI-001 RESERVED`;
  } else {
    building_today = "Executive Intelligence Doctrine — constitutional charter drafting";
    smallest_next_slice = "Executive Intelligence Doctrine completion";
    summary = "Executive Intelligence Era authorized · doctrine in progress";
  }

  const critical_path_detail = work_product_complete
    ? "Deterministic executive pipeline COMPLETE → Communications → Commercial Beta"
    : retrieval_complete
      ? work_product_started
        ? "ENG-EI-001 COMPLETE → ENG-EI-002 IN PROGRESS → Communications → Commercial Beta"
        : "ENG-EI-001 COMPLETE → ENG-EI-002 Executive Brief → Communications → Commercial Beta"
      : "Doctrine → MAR-3 → EI-001 (ei-doctrine-v1.0) → ENG-EI-001 Constitutional Retrieval → Communications";

  return {
    era_authorized,
    doctrine_status,
    doctrine_articles,
    mar3_status,
    mar3_questions_pending,
    mar3_complete,
    ei001_status,
    doctrine_frozen,
    eng_ei001_status,
    pre_impl_progress_percent,
    implementation_started,
    implementation_phase,
    impl_slices_complete,
    impl_progress_percent,
    retrieval_contract_version,
    retrieval_tests_count,
    retrieval_complete,
    work_product_started,
    work_product_complete,
    work_product_slices_complete,
    work_product_progress_percent,
    work_product_contract_version,
    reference_consumer_id,
    brief_tests_count,
    building_today,
    summary,
    smallest_next_slice,
    critical_path_detail,
  };
}

export function isExecutiveIntelligenceDoctrineFrozen(): boolean {
  return getExecutiveIntelligenceEraSnapshot().doctrine_frozen;
}

export function isExecutiveIntelligenceImplementationStarted(): boolean {
  return getExecutiveIntelligenceEraSnapshot().implementation_started;
}

export function isConstitutionalRetrievalComplete(): boolean {
  return getExecutiveIntelligenceEraSnapshot().retrieval_complete;
}

export function isWorkProductImplementationStarted(): boolean {
  return getExecutiveIntelligenceEraSnapshot().work_product_started;
}

export function isWorkProductComplete(): boolean {
  return getExecutiveIntelligenceEraSnapshot().work_product_complete;
}
