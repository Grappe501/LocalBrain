import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";

const DOCS = path.join(getRepoRoot(), "docs", "memory-os");
const EI_LOCK_PATH = path.join(DOCS, "certification", "ei-doctrine-lock.json");

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
  /** Pre-implementation progress 0–100 (doctrine · MAR-3 · freeze · charter). */
  pre_impl_progress_percent: number;
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

/** Authoritative Executive Intelligence Era posture — parsed from constitutional docs. */
export function getExecutiveIntelligenceEraSnapshot(): ExecutiveIntelligenceEraSnapshot {
  const doctrine = readDoc("EXECUTIVE-INTELLIGENCE-DOCTRINE.md");
  const mar3 = readDoc("MAR-3-EXECUTIVE-INTELLIGENCE-ARCHITECTURE_REVIEW.md");
  const ei001 = readDoc("EI-001-DOCTRINE-FREEZE.md");
  const engEi001 = readDoc("ENG-EI-001-CHARTER.md");

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

  let building_today: string;
  let smallest_next_slice: string;
  let summary: string;

  if (doctrine_frozen) {
    building_today = "ENG-EI-001 Constitutional Retrieval — read-only · cite · package evidence";
    smallest_next_slice = "ENG-EI-001 Constitutional Retrieval (fidelity-first implementation)";
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

  const critical_path_detail =
    "Doctrine → MAR-3 → EI-001 (ei-doctrine-v1.0) → ENG-EI-001 Constitutional Retrieval";

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
    building_today,
    summary,
    smallest_next_slice,
    critical_path_detail,
  };
}

export function isExecutiveIntelligenceDoctrineFrozen(): boolean {
  return getExecutiveIntelligenceEraSnapshot().doctrine_frozen;
}
