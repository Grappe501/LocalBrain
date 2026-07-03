import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";
import { getCommunicationsOfficeSnapshot, isCommunicationsOfficeStarted } from "./communicationsOfficeMetrics.js";
import { getExecutiveIntelligenceEraSnapshot, isWorkProductComplete } from "./executiveIntelligenceEraMetrics.js";

export const MEM008_TOTAL_TESTS = 107;
export const WAVE1_SLICE_COUNT = 5;
/** Spec freeze is ~half the Memory OS module journey; Wave 1 impl is the other half. */
export const MEMORY_SPEC_MODULE_WEIGHT = 50;
export const MEMORY_IMPL_MODULE_WEIGHT = 50;

const MATRIX_PATH = path.join(
  getRepoRoot(),
  "docs",
  "memory-os",
  "MEM-008-SUCCESS_TEST_MATRIX.md",
);
const SPEC_LOCK_PATH = path.join(
  getRepoRoot(),
  "docs",
  "memory-os",
  "certification",
  "memory-spec-lock.json",
);
const SLICES_README_PATH = path.join(getRepoRoot(), "docs", "memory-os", "slices", "README.md");
const ARTIFACT_CHARTER_PATH = path.join(
  getRepoRoot(),
  "docs",
  "memory-os",
  "slices",
  "ENG-MEM-001.3-ARTIFACT.md",
);

export type Mem008Walkthrough = {
  passed: number;
  total: number;
  progress_percent: number;
  current_gate: string | null;
  summary: string;
};

export type EngMemWave1Slice = {
  slice_code: string;
  object: string;
  status: "complete" | "authorized" | "blocked";
};

export type MemoryOsProgressSnapshot = {
  spec_frozen: boolean;
  spec_tag: string | null;
  mem008: Mem008Walkthrough;
  wave1_slices: EngMemWave1Slice[];
  wave1_complete_count: number;
  wave1_active_slice: EngMemWave1Slice | null;
  spec_progress_percent: number;
  impl_progress_percent: number;
  module_progress_percent: number;
  building_today: string;
  summary: string;
};

/** Count individual test rows with PMO-confirmed PASS in MEM-008 matrix. */
export function getMem008Walkthrough(): Mem008Walkthrough {
  try {
    if (!fs.existsSync(MATRIX_PATH)) {
      return {
        passed: 0,
        total: MEM008_TOTAL_TESTS,
        progress_percent: 0,
        current_gate: null,
        summary: "MEM-008 matrix not found",
      };
    }

    const text = fs.readFileSync(MATRIX_PATH, "utf8");
    const passed = (
      text.match(/\|\s*T\d+\.\d+\s*\|[^|\n]*\|[^|\n]*\|[^|\n]*\|\s*\*\*PASS\*\*\s*\|/g) ??
      []
    ).length;
    const progress_percent = Math.round((passed / MEM008_TOTAL_TESTS) * 100);

    const pendingGate = text.match(
      /^\|\s*T(\d+)\s*\|[^|\n]*\|[^|\n]*\|[^|\n]*\|\s*Pending\s*\|/m,
    );
    const current_gate = pendingGate ? `T${pendingGate[1]}` : null;

    return {
      passed,
      total: MEM008_TOTAL_TESTS,
      progress_percent,
      current_gate,
      summary: `${passed}/${MEM008_TOTAL_TESTS} MEM-008 tests PASS`,
    };
  } catch {
    return {
      passed: 0,
      total: MEM008_TOTAL_TESTS,
      progress_percent: 0,
      current_gate: null,
      summary: "MEM-008 parse error",
    };
  }
}

/** True when memory-spec-lock.json declares freeze or matrix is 107/107 with no pending gate. */
export function isMemorySpecFrozen(): boolean {
  try {
    if (fs.existsSync(SPEC_LOCK_PATH)) {
      const lock = JSON.parse(fs.readFileSync(SPEC_LOCK_PATH, "utf8")) as {
        spec_frozen?: boolean;
      };
      if (lock.spec_frozen === true) return true;
    }
  } catch {
    /* fall through to matrix */
  }
  const mem008 = getMem008Walkthrough();
  return mem008.passed >= MEM008_TOTAL_TESTS && mem008.current_gate === null;
}

export function getMemorySpecReleaseTag(): string | null {
  try {
    if (!fs.existsSync(SPEC_LOCK_PATH)) return null;
    const lock = JSON.parse(fs.readFileSync(SPEC_LOCK_PATH, "utf8")) as {
      release_tag?: string;
    };
    return lock.release_tag ?? null;
  } catch {
    return null;
  }
}

/** Parse ENG-MEM-001 Wave 1 slice table from slices/README.md. */
export function parseEngMemWave1Slices(): EngMemWave1Slice[] {
  try {
    if (!fs.existsSync(SLICES_README_PATH)) return [];
    const text = fs.readFileSync(SLICES_README_PATH, "utf8");
    const rows =
      text.match(
        /^\|\s*\d+\s*\|\s*\[?(ENG-MEM-[\d.]+)[^\|]*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm,
      ) ?? [];

    return rows.map((row) => {
      const m = row.match(
        /^\|\s*\d+\s*\|\s*\[?(ENG-MEM-[\d.]+)[^\|]*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/,
      );
      const slice_code = m?.[1] ?? "ENG-MEM-???";
      const object = (m?.[2] ?? "").trim();
      const statusCell = (m?.[3] ?? "").toUpperCase();
      let status: EngMemWave1Slice["status"] = "blocked";
      if (/COMPLETE/.test(statusCell)) status = "complete";
      else if (/AUTHORIZED/.test(statusCell)) status = "authorized";
      return { slice_code, object, status };
    });
  } catch {
    return [];
  }
}

/** Design-package floor — MAR-1 artifacts on disk before walkthrough completes. */
export function getMemoryOsSpecArtifactPercent(): number {
  const root = getRepoRoot();
  const manifest = path.join(root, "docs", "memory-os", "MEMORY_OS_CONVENTION_MANIFEST.json");
  if (!fs.existsSync(manifest)) return 0;

  let volumes = 0;
  const dir = path.join(root, "docs", "memory-os");
  for (let i = 1; i <= 7; i += 1) {
    if (fs.readdirSync(dir).some((f) => f.startsWith(`VOLUME-${i}-`))) volumes += 1;
  }

  if (volumes >= 7 && fs.existsSync(manifest)) return 25;
  return 0;
}

function wave1ImplPercent(completeCount: number): number {
  return Math.round((completeCount / WAVE1_SLICE_COUNT) * 100);
}

function moduleProgressPercent(
  specFrozen: boolean,
  specProgress: number,
  implProgress: number,
): number {
  if (specFrozen) {
    const specShare = MEMORY_SPEC_MODULE_WEIGHT;
    const implShare = Math.round((implProgress / 100) * MEMORY_IMPL_MODULE_WEIGHT);
    if (implProgress >= 100) return 100;
    return Math.min(99, specShare + implShare);
  }
  const preFreeze = Math.max(getMemoryOsSpecArtifactPercent(), Math.round(specProgress * 0.45));
  return Math.min(49, preFreeze);
}

function buildSummary(
  specFrozen: boolean,
  mem008: Mem008Walkthrough,
  completeCount: number,
  active: EngMemWave1Slice | null,
  tag: string | null,
): string {
  if (specFrozen && completeCount >= WAVE1_SLICE_COUNT) {
    const tagLabel = tag ? ` · ${tag}` : "";
    return `Institutional Cognition Foundation COMPLETE${tagLabel} · Wave 1 5/5 · Deterministic Foundation CLOSED · ENG-PMO-005`;
  }
  if (specFrozen) {
    const tagLabel = tag ? ` · ${tag}` : "";
    const activeLabel = active ? ` · active ${active.slice_code} ${active.object}` : "";
    return `Spec frozen${tagLabel} · Wave 1 ${completeCount}/${WAVE1_SLICE_COUNT} slices complete${activeLabel}`;
  }
  return mem008.summary;
}

function buildBuildingToday(
  specFrozen: boolean,
  mem008: Mem008Walkthrough,
  active: EngMemWave1Slice | null,
  completeCount: number,
): string {
  if (specFrozen && completeCount >= WAVE1_SLICE_COUNT) {
    if (isWorkProductComplete() && isCommunicationsOfficeStarted()) {
      return getCommunicationsOfficeSnapshot().building_today;
    }
    return getExecutiveIntelligenceEraSnapshot().building_today;
  }
  if (specFrozen && active) {
    const sub = activeSubMilestone(active, completeCount);
    return `${active.slice_code} ${active.object} — ${sub}`;
  }
  if (specFrozen) {
    return `ENG-MEM-001 Wave 1 — ${completeCount}/${WAVE1_SLICE_COUNT} storage slices`;
  }
  const gate = mem008.current_gate ? ` · next ${mem008.current_gate}` : "";
  return `MEM-008 specification walkthrough — ${mem008.summary}${gate}`;
}

/** Active engineering sub-milestone — parsed from slice charter when available. */
function activeSubMilestone(active: EngMemWave1Slice, completeCount: number): string {
  const waveLabel = `MEM-009 Wave 1 · ${completeCount}/${WAVE1_SLICE_COUNT} slices`;

  if (active.slice_code === "ENG-MEM-001.1") {
    return `Reference Slice 001 · ${waveLabel}`;
  }
  if (active.slice_code === "ENG-MEM-001.2") {
    return `Reference Slice 002 · ${waveLabel}`;
  }
  if (active.slice_code === "ENG-MEM-001.3") {
    try {
      if (fs.existsSync(ARTIFACT_CHARTER_PATH)) {
        const text = fs.readFileSync(ARTIFACT_CHARTER_PATH, "utf8");
        const statusMatch = text.match(/\*\*Status:\*\* \*\*([^*]+)\*\*/);
        if (statusMatch?.[1]?.includes("001.3.2")) {
          return `001.3.2 chain of custody · ${waveLabel}`;
        }
        if (statusMatch?.[1]?.includes("001.3.1")) {
          return `001.3.1 canonical storage · ${waveLabel}`;
        }
      }
    } catch {
      /* fall through */
    }
    return `001.3.2 chain of custody · ${waveLabel}`;
  }

  if (active.slice_code === "ENG-MEM-001.4") {
    return `Reference Slice 004 · ${waveLabel}`;
  }
  if (active.slice_code === "ENG-MEM-001.5") {
    return `Reference Slice 005 · Authority Principle · ${waveLabel}`;
  }

  return waveLabel;
}

/** Authoritative Memory OS progress — spec freeze vs ENG-MEM-001 implementation. */
export function getMemoryOsProgressSnapshot(): MemoryOsProgressSnapshot {
  const mem008 = getMem008Walkthrough();
  const specFrozen = isMemorySpecFrozen();
  const specTag = getMemorySpecReleaseTag();
  const wave1_slices = parseEngMemWave1Slices();
  const wave1_complete_count = wave1_slices.filter((s) => s.status === "complete").length;
  const wave1_active_slice = wave1_slices.find((s) => s.status === "authorized") ?? null;

  const spec_progress_percent = specFrozen ? 100 : mem008.progress_percent;
  const impl_progress_percent = wave1ImplPercent(wave1_complete_count);
  const module_progress_percent = moduleProgressPercent(
    specFrozen,
    spec_progress_percent,
    impl_progress_percent,
  );

  return {
    spec_frozen: specFrozen,
    spec_tag: specTag,
    mem008,
    wave1_slices,
    wave1_complete_count,
    wave1_active_slice,
    spec_progress_percent,
    impl_progress_percent,
    module_progress_percent,
    building_today: buildBuildingToday(
      specFrozen,
      mem008,
      wave1_active_slice,
      wave1_complete_count,
    ),
    summary: buildSummary(
      specFrozen,
      mem008,
      wave1_complete_count,
      wave1_active_slice,
      specTag,
    ),
  };
}

export function getMemoryOsModuleProgress(): number {
  return getMemoryOsProgressSnapshot().module_progress_percent;
}
