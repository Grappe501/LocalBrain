import type { SliceStatus } from "@localbrain/shared";
import type { ParsedSlice } from "../epo/checklistParser.js";
import {
  parsePeerReviewProgress,
  parsePostConsolidationSequence,
} from "../epo/checklistParser.js";

export const PHASE_19_SLICE_IDS = [
  "LB-OS-026.6",
  "LB-OS-026.65",
  "LB-OS-026.66",
  "LB-OS-026.67",
  "LB-OS-026.7",
] as const;

export type ConsolidationMilestone = {
  milestone_id: string;
  label: string;
  status: SliceStatus;
};

export function isPhase19ConsolidationComplete(
  parsedMap: Map<string, ParsedSlice>,
): boolean {
  return PHASE_19_SLICE_IDS.every((id) => parsedMap.get(id)?.status === "complete");
}

function statusForSequenceStep(
  step: ReturnType<typeof parsePostConsolidationSequence>[number],
  parsedMap: Map<string, ParsedSlice>,
  peerReview: ReturnType<typeof parsePeerReviewProgress>,
): SliceStatus {
  if (step.slice_id) {
    return parsedMap.get(step.slice_id)?.status ?? "not_started";
  }

  switch (step.milestone_id) {
    case "MILESTONE-GRAPH-INTEGRITY":
      return parsedMap.get("LB-OS-026.67")?.status === "complete"
        ? "complete"
        : "in_progress";
    case "MILESTONE-EXP-CERT":
      if (peerReview.s4 !== "planned" || peerReview.s5 === "complete") return "complete";
      return "in_progress";
    case "MILESTONE-PR-S4":
      return peerReview.s4;
    case "MILESTONE-PR-S5":
      return peerReview.s5;
    case "MILESTONE-THEORY-FREEZE":
      return peerReview.theory_frozen ? "complete" : "planned";
    case "MILESTONE-CONVENTION":
      return peerReview.convention;
    default:
      return "planned";
  }
}

/** After Phase 1.9 slices complete, follow the post-consolidation gate sequence before Phase 4 queue. */
export function resolveConsolidationCursor(
  parsedMap: Map<string, ParsedSlice>,
): { current: ConsolidationMilestone; next: ConsolidationMilestone | null } | null {
  if (!isPhase19ConsolidationComplete(parsedMap)) return null;

  const peerReview = parsePeerReviewProgress();
  const sequence = parsePostConsolidationSequence();
  if (sequence.length === 0) return null;

  const milestones: ConsolidationMilestone[] = sequence.map((step) => ({
    milestone_id: step.milestone_id,
    label: step.label,
    status: statusForSequenceStep(step, parsedMap, peerReview),
  }));

  const current = milestones.find((m) => m.status !== "complete") ?? null;
  if (!current) return null;

  const currentIdx = milestones.indexOf(current);
  const next =
    milestones.slice(currentIdx + 1).find((m) => m.status !== "complete") ?? null;

  return { current, next };
}
