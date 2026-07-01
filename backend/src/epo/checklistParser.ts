import fs from "node:fs";
import path from "node:path";
import type { SliceStatus } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";

export type ParsedSlice = {
  slice_id: string;
  name: string;
  status: SliceStatus;
  raw_status: string;
  burt_packet_path: string | null;
  phase_id: string;
  phase_label: string;
};

export type ParsedPhase = {
  phase_id: string;
  label: string;
  slice_ids: string[];
  gate_text: string | null;
};

const SLICE_ROW =
  /^\|\s*(LB-OS-[\d.]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/;

function parseStatus(raw: string): SliceStatus {
  const s = raw.trim();
  if (/✅|COMPLETE|Complete/i.test(s)) return "complete";
  if (/📋|Next|Spec locked/i.test(s)) return "spec_locked";
  if (/in progress|IN PROGRESS|▶|Implementation/i.test(s)) return "in_progress";
  if (/⬜|PLANNED/i.test(s)) return "planned";
  return "not_started";
}

function extractBurtLink(cell: string): string | null {
  const m = cell.match(/\[Burt packet\]\(\.\/burt_packets\/([^)]+\.md)\)/i);
  if (m) return `docs/burt_packets/${m[1]}`;
  const m2 = cell.match(/burt_packets\/([^\s)]+\.md)/i);
  if (m2) return `docs/burt_packets/${m2[1]}`;
  const spec = cell.match(/\(\.\/(LOCALBRAIN[^)]+\.md)\)/i);
  if (spec) return `docs/${spec[1]}`;
  return null;
}

function slugPhaseId(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function burtPacketExists(sliceId: string): string | null {
  const candidates = [
    `docs/burt_packets/${sliceId}.md`,
    `docs/burt_packets/${sliceId.replace(/\./g, "-")}.md`,
  ];
  for (const rel of candidates) {
    if (fs.existsSync(path.join(getRepoRoot(), rel))) return rel;
  }
  const dir = path.join(getRepoRoot(), "docs", "burt_packets");
  if (!fs.existsSync(dir)) return null;
  const base = sliceId.toLowerCase().replace(/\./g, "");
  const hit = fs.readdirSync(dir).find((f) => f.toLowerCase().includes(base));
  return hit ? `docs/burt_packets/${hit}` : null;
}

/** Parse all LB-OS slice tables from PHASE_CHECKLIST.md (all phases). */
export function parsePhaseChecklistSlices(): ParsedSlice[] {
  const checklistPath = path.join(getRepoRoot(), "docs", "PHASE_CHECKLIST.md");
  const text = fs.readFileSync(checklistPath, "utf8");
  const lines = text.split("\n");
  const slices: ParsedSlice[] = [];
  let currentPhaseId = "unknown";
  let currentPhaseLabel = "Unknown";
  let inSliceTable = false;

  for (const line of lines) {
    const phaseHeader = line.match(/^##\s+(.+)/);
    if (phaseHeader) {
      const title = phaseHeader[1].trim();
      if (title.startsWith("Phase ") || title.includes("Phase")) {
        currentPhaseLabel = title.replace(/^Phase\s+[\d.]+\s*[—–-]\s*/i, "").trim() || title;
        currentPhaseId = slugPhaseId(title);
      }
      inSliceTable = false;
      continue;
    }

    if (line.match(/^\|\s*Slice\s*\|/i)) {
      inSliceTable = true;
      continue;
    }

    if (inSliceTable && line.startsWith("## ")) {
      inSliceTable = false;
      continue;
    }

    if (!inSliceTable) continue;
    if (line.match(/^\|\s*[-:]+\s*\|/)) continue;

    const m = line.match(SLICE_ROW);
    if (!m) {
      if (line.trim() === "" || line.startsWith("**Gate")) inSliceTable = false;
      continue;
    }

    const [, slice_id, name, raw_status] = m;
    if (slice_id === "Slice") continue;

    slices.push({
      slice_id,
      name: name.trim(),
      status: parseStatus(raw_status),
      raw_status: raw_status.trim(),
      burt_packet_path: extractBurtLink(raw_status) ?? burtPacketExists(slice_id),
      phase_id: currentPhaseId,
      phase_label: currentPhaseLabel,
    });
  }

  return dedupeChecklistSlices(slices);
}

const SLICE_STATUS_PRIORITY: Record<SliceStatus, number> = {
  in_progress: 5,
  spec_locked: 4,
  complete: 3,
  not_started: 2,
  planned: 1,
};

/** Same slice id can appear in multiple phase tables — keep the most actionable row. */
function dedupeChecklistSlices(slices: ParsedSlice[]): ParsedSlice[] {
  const byId = new Map<string, ParsedSlice>();
  for (const slice of slices) {
    const existing = byId.get(slice.slice_id);
    if (
      !existing ||
      SLICE_STATUS_PRIORITY[slice.status] > SLICE_STATUS_PRIORITY[existing.status]
    ) {
      byId.set(slice.slice_id, slice);
    }
  }
  return Array.from(byId.values());
}

/** Dynamic phase groupings from checklist headers + slice tables. */
export function parsePhaseSections(): ParsedPhase[] {
  const checklistPath = path.join(getRepoRoot(), "docs", "PHASE_CHECKLIST.md");
  const text = fs.readFileSync(checklistPath, "utf8");
  const lines = text.split("\n");
  const phases: ParsedPhase[] = [];
  let current: ParsedPhase | null = null;
  let inSliceTable = false;

  for (const line of lines) {
    const phaseHeader = line.match(/^##\s+(.+)/);
    if (phaseHeader) {
      const title = phaseHeader[1].trim();
      if (title.startsWith("Phase ") || title.includes("Phase")) {
        if (current) phases.push(current);
        current = {
          phase_id: slugPhaseId(title),
          label: title.replace(/^Phase\s+[\d.]+\s*[—–-]\s*/i, "").trim() || title,
          slice_ids: [],
          gate_text: null,
        };
        inSliceTable = false;
      }
      continue;
    }

    if (!current) continue;

    const gateMatch = line.match(/^\*\*Gates?:\*\*\s*(.+)/i);
    if (gateMatch) {
      current.gate_text = gateMatch[1].trim();
      continue;
    }

    if (line.match(/^\|\s*Slice\s*\|/i)) {
      inSliceTable = true;
      continue;
    }

    if (inSliceTable && line.startsWith("## ")) {
      inSliceTable = false;
      continue;
    }

    if (!inSliceTable) continue;
    if (line.match(/^\|\s*[-:]+\s*\|/)) continue;

    const m = line.match(SLICE_ROW);
    if (!m) continue;
    const [, slice_id] = m;
    if (slice_id === "Slice") continue;
    current.slice_ids.push(slice_id);
  }

  if (current) phases.push(current);

  const globalGate = parseGateLine();
  if (globalGate && phases.length > 0) {
    const migration = phases.find((p) => p.label.toLowerCase().includes("migration"));
    if (migration && !migration.gate_text) migration.gate_text = globalGate;
  }

  return phases;
}

export function parseGateLine(): string | null {
  const text = fs.readFileSync(path.join(getRepoRoot(), "docs", "PHASE_CHECKLIST.md"), "utf8");
  const m = text.match(/\*\*Gate:\*\*\s*(.+)/);
  return m ? m[1].trim() : null;
}

export type PostConsolidationStep = {
  milestone_id: string;
  label: string;
  slice_id: string | null;
};

const SLICE_IN_STEP = /LB-OS-[\d.]+/;
const BARE_SLICE_PREFIX = /^(\d{3}(?:\.\d+)?)\b/;

function extractSliceId(part: string): string | null {
  const explicit = part.match(SLICE_IN_STEP)?.[0];
  if (explicit) return explicit;
  const bare = part.match(BARE_SLICE_PREFIX)?.[1];
  return bare ? `LB-OS-${bare}` : null;
}

function labelForMilestone(raw: string): { milestone_id: string; label: string; slice_id: string | null } {
  const normalized = raw.trim();
  const slice_id = extractSliceId(normalized);
  if (slice_id) {
    const label =
      normalized.replace(slice_id.replace("LB-OS-", ""), "").replace(/^[\s—–-]+/, "").trim() ||
      normalized.replace(BARE_SLICE_PREFIX, "").trim() ||
      slice_id;
    return { milestone_id: slice_id, label, slice_id };
  }
  if (/experience certification/i.test(normalized)) {
    return { milestone_id: "MILESTONE-EXP-CERT", label: "Experience Certification", slice_id: null };
  }
  if (/peer review s4|session 4/i.test(normalized)) {
    return { milestone_id: "MILESTONE-PR-S4", label: "Peer Review Session 4", slice_id: null };
  }
  if (/peer review s5|session 5|\bs5\b/i.test(normalized)) {
    return { milestone_id: "MILESTONE-PR-S5", label: "Peer Review Session 5", slice_id: null };
  }
  if (/theory v1\.0|theory freeze/i.test(normalized)) {
    return { milestone_id: "MILESTONE-THEORY-FREEZE", label: "Theory v1.0 freeze", slice_id: null };
  }
  if (/convention/i.test(normalized)) {
    return {
      milestone_id: "MILESTONE-CONVENTION",
      label: "Executive Epistemology Convention",
      slice_id: null,
    };
  }
  if (/graph integrity/i.test(normalized)) {
    return {
      milestone_id: "MILESTONE-GRAPH-INTEGRITY",
      label: "Graph Integrity certification",
      slice_id: null,
    };
  }
  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return { milestone_id: `MILESTONE-${slug.toUpperCase()}`, label: normalized, slice_id: null };
}

/** Ordered milestones from Phase 1.9 post-consolidation sequence block. */
export function parsePostConsolidationSequence(): PostConsolidationStep[] {
  const text = fs.readFileSync(path.join(getRepoRoot(), "docs", "PHASE_CHECKLIST.md"), "utf8");
  const marker = "**Post-consolidation sequence";
  const start = text.indexOf(marker);
  if (start < 0) return [];

  const blockStart = text.indexOf("```txt", start);
  if (blockStart < 0) return [];
  const blockEnd = text.indexOf("```", blockStart + 6);
  if (blockEnd < 0) return [];

  const body = text.slice(blockStart + 6, blockEnd).replace(/\r/g, "");
  const parts = body
    .split(/→/g)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const steps: PostConsolidationStep[] = [];
  const seen = new Set<string>();

  for (const part of parts) {
    const { milestone_id, label, slice_id } = labelForMilestone(part);
    if (seen.has(milestone_id)) continue;
    seen.add(milestone_id);
    steps.push({ milestone_id, label, slice_id });
  }

  return steps;
}

export type PeerReviewProgress = {
  s4: SliceStatus;
  s5: SliceStatus;
  theory_frozen: boolean;
  convention: SliceStatus;
  /** Where progress was read — for observability in Program Office. */
  source: "evidence_base" | "phase_checklist";
};

const EVIDENCE_BASE_REL = "docs/LOCALBRAIN_COGNITIVE_EVIDENCE_BASE.md";

function parsePeerReviewFromEvidenceBase(text: string): PeerReviewProgress {
  const s4Complete =
    /\|\s*4\s*\|\s*Executive practitioner\s*\|\s*✅\s*Passed/i.test(text) ||
    /\|\s*PR-S4 Executive Practitioner[\s\S]*?\|\s*\*\*Passed/i.test(text);

  const s5Complete =
    /\|\s*5\s*\|\s*Skeptic\s*\|\s*✅\s*Passed/i.test(text) ||
    /\|\s*PR-S5 Skeptic[\s\S]*?\|\s*\*\*Passed/i.test(text);

  const theoryFrozen =
    /Complete — Theory v1\.0 frozen/i.test(text) ||
    (/## Theory v1\.0 freeze/i.test(text) &&
      /Contradictions requiring redesign\s*\|\s*\*\*0\*\*/i.test(text));

  const conventionComplete =
    /Executive Epistemology Convention[\s\S]*?Sessions 1–5 complete/i.test(text) ||
    /Convention Session 5[\s\S]*?complete/i.test(text) ||
    /Convention Close[\s\S]*?\*\*Complete\*\*/i.test(text) ||
    /CON-S5[\s\S]*?Ethics[\s\S]*?✅/i.test(text);

  let s4: SliceStatus = "planned";
  if (s4Complete) s4 = "complete";
  else if (/Peer Review Session 4[\s\S]*?\*\*In progress\*\*/i.test(text)) s4 = "in_progress";

  let s5: SliceStatus = "planned";
  if (s5Complete) s5 = "complete";
  else if (s4Complete && /Peer Review Session 5/i.test(text) && !s5Complete) s5 = "in_progress";

  let convention: SliceStatus = "planned";
  if (conventionComplete) convention = "complete";
  else if (theoryFrozen) convention = "in_progress";

  return { s4, s5, theory_frozen: theoryFrozen, convention, source: "evidence_base" };
}

function parsePeerReviewFromPhaseChecklist(text: string): PeerReviewProgress {
  const row = text
    .split("\n")
    .find((line) => /Executive Cognition Peer Review/i.test(line) && line.includes("|"));

  const cell = row?.split("|")[3]?.trim() ?? "";
  const s4Complete = /S4\s*✅/i.test(cell);
  const s4Active = /S4\s*(paused|in progress|pending)/i.test(cell);
  const s5Complete = /S5\s*✅/i.test(cell);
  const theoryFrozen = /theory v1\.0 frozen|theory frozen/i.test(cell);
  const conventionComplete = /convention\s*✅/i.test(cell);
  const conventionActive = /convention/i.test(cell) && !conventionComplete;

  let s4: SliceStatus = "planned";
  if (s4Complete) s4 = "complete";
  else if (s4Active || /in progress/i.test(cell)) s4 = "in_progress";

  let s5: SliceStatus = "planned";
  if (s5Complete) s5 = "complete";
  else if (/S5\s*(in progress|pending)/i.test(cell) && s4Complete) s5 = "in_progress";

  let convention: SliceStatus = "planned";
  if (conventionComplete) convention = "complete";
  else if (conventionActive || (theoryFrozen && !conventionComplete)) convention = "spec_locked";

  return { s4, s5, theory_frozen: theoryFrozen, convention, source: "phase_checklist" };
}

/** Parse peer-review / theory-freeze progress from Evidence Base (primary) or PHASE_CHECKLIST (fallback). */
export function parsePeerReviewProgress(): PeerReviewProgress {
  const root = getRepoRoot();
  const evidencePath = path.join(root, EVIDENCE_BASE_REL);
  if (fs.existsSync(evidencePath)) {
    return parsePeerReviewFromEvidenceBase(fs.readFileSync(evidencePath, "utf8"));
  }

  const checklistPath = path.join(root, "docs", "PHASE_CHECKLIST.md");
  return parsePeerReviewFromPhaseChecklist(fs.readFileSync(checklistPath, "utf8"));
}

/** Build theory freeze panel from Evidence Base (or checklist fallback). */
export function buildTheoryFrozenStatus(pr: PeerReviewProgress): import("./v1Roadmap.js").TheoryFrozenStatus {
  const evidencePath = path.join(getRepoRoot(), EVIDENCE_BASE_REL);
  let amendments = 0;
  let contradictions = 0;
  let sessionsComplete = 0;

  if (fs.existsSync(evidencePath)) {
    const text = fs.readFileSync(evidencePath, "utf8");
    const amendmentMatch = text.match(
      /\|\s*Theory amendments\s*\|\s*\*\*(\d+)\*\*/i,
    );
    if (amendmentMatch) amendments = Number(amendmentMatch[1]);
    const contradictionMatch = text.match(
      /Contradictions requiring redesign\s*\|\s*\*\*(\d+)\*\*/i,
    );
    if (contradictionMatch) contradictions = Number(contradictionMatch[1]);
    sessionsComplete = (text.match(/\|\s*[1-5]\s*\|[^|]+\|\s*✅\s*Passed/gi) ?? []).length;
  }

  const frozen = pr.theory_frozen;
  const allSessionsDone = sessionsComplete >= 5 || (pr.s4 === "complete" && pr.s5 === "complete" && frozen);

  return {
    version: "1.0",
    frozen,
    amendments,
    peer_review_sessions_complete: allSessionsDone ? 5 : sessionsComplete,
    peer_review_sessions_total: 5,
    contradictions_found: contradictions,
    theory_risk: frozen && contradictions === 0 ? "LOW" : frozen ? "MEDIUM" : "HIGH",
    remaining_risk: frozen ? "IMPLEMENTATION" : "THEORY",
    progress_source: pr.source,
    project_era: frozen ? "construction" : "theory_validation",
  };
}

/** Human-readable phase label while on post-consolidation theory milestones. */
export function theoryValidationPhaseLabel(
  pr: PeerReviewProgress,
  milestoneId?: string,
): string {
  if (
    milestoneId === "MILESTONE-CONVENTION" ||
    (pr.theory_frozen && pr.convention !== "complete")
  ) {
    return "Theory Validation — Convention";
  }
  if (pr.theory_frozen) return "Theory Validation — Theory Frozen";
  if (pr.s5 === "complete") return "Theory Validation — Session 5 complete";
  if (pr.s4 === "complete") return "Theory Validation — Session 5 (Skeptic)";
  return "Theory Validation — Session 4 (Executive Practitioner)";
}

export function changelogDecisions(): { date: string; title: string }[] {
  const text = fs.readFileSync(path.join(getRepoRoot(), "docs", "PHASE_CHECKLIST.md"), "utf8");
  const events: { date: string; title: string }[] = [];
  const section = text.split("## Change Log")[1];
  if (!section) return events;

  for (const line of section.split("\n")) {
    const m = line.match(/\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.+?)\s*\|/);
    if (m) events.push({ date: m[1], title: m[2].trim() });
  }
  return events;
}
