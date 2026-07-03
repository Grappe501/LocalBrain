import type {
  BuildGraphNodeStatus,
  EpoBuildVelocity,
  EpoCurrentSprint,
  EpoPhaseSummary,
  EpoSliceSummary,
  SliceStatus,
} from "@localbrain/shared";
import {
  changelogDecisions,
  parseGateLine,
  parsePhaseChecklistSlices,
  parsePhaseSections,
  type ParsedSlice,
} from "../epo/checklistParser.js";
import { explainBlocker, isBlocked, toLifecycleStatus } from "../epo/blockerExplainer.js";
import { computeCoverage } from "../epo/coverageHeuristics.js";
import { parseSliceRegistry } from "./sliceRegistry.js";
import {
  countDocsChangedSince,
  countTestFiles,
  countTypeScriptLoc,
  getCommitsSince,
  getRecentCommits,
  getSliceIdsFromCommits,
} from "./gitMetrics.js";
import { parsePeerReviewProgress, buildTheoryFrozenStatus, theoryValidationPhaseLabel } from "../epo/checklistParser.js";
import { resolveConsolidationCursor } from "./consolidationCursor.js";
import { getCommunicationsOfficeSnapshot, isCommunicationsOfficeStarted } from "./communicationsOfficeMetrics.js";
import { isWorkProductComplete } from "./executiveIntelligenceEraMetrics.js";

export const BUILD_STATE_ENGINE_ID = "ENG-BLD-001";

export type BuildStateSnapshot = {
  slices: EpoSliceSummary[];
  phases: EpoPhaseSummary[];
  current_sprint: EpoCurrentSprint;
  build_velocity: EpoBuildVelocity;
  build_graph: { slice_id: string; status: BuildGraphNodeStatus; depends_on: string[] }[];
  current_slice_id: string | null;
  current_slice_name: string | null;
  next_slice_id: string | null;
  next_slice_name: string | null;
  current_phase_label: string;
  gate_text: string | null;
  commit_timeline: { hash: string; subject: string; date: string }[];
  completed_count: number;
  total_count: number;
};

function sliceMap(slices: ParsedSlice[]): Map<string, ParsedSlice> {
  return new Map(slices.map((s) => [s.slice_id, s]));
}

function parseNextFromGate(gate: string | null): string | null {
  const m = gate?.match(/Next:\s*\*?\*?(LB-OS-[\d.]+)/i);
  return m ? m[1] : null;
}

function findCurrentAndNext(
  summaries: EpoSliceSummary[],
  order: string[],
  gate: string | null,
  dependencies: Record<string, string[]>,
  parsedMap: Map<string, ParsedSlice>,
): {
  current: EpoSliceSummary | null;
  next: EpoSliceSummary | null;
  phaseLabel: string;
} {
  const byId = new Map(summaries.map((s) => [s.slice_id, s]));
  const gateNext = parseNextFromGate(gate);

  const inProgress = summaries.find((s) => s.status === "in_progress");
  const gateSlice = gateNext ? byId.get(gateNext) ?? null : null;

  const firstActionable = order
    .map((id) => byId.get(id))
    .find(
      (s) =>
        s &&
        s.status !== "complete" &&
        !isBlocked(s.slice_id, parsedMap, dependencies),
    );

  const consolidation = resolveConsolidationCursor(parsedMap);

  const current =
    inProgress ??
    (gateSlice && gateSlice.status !== "complete" ? gateSlice : null) ??
    (consolidation
      ? ({
          slice_id: consolidation.current.milestone_id,
          name: consolidation.current.label,
          status: consolidation.current.status,
          burt_packet_path: null,
          spec_doc_path: null,
          dependencies: [],
          coverage: {
            implementation: 0,
            tests: 0,
            documentation: 0,
            user_guide: 0,
            ojt_lesson: 0,
          },
          blocker_explanation: null,
        } satisfies EpoSliceSummary)
      : null) ??
    firstActionable ??
    null;

  const currentIdx = current ? order.indexOf(current.slice_id) : -1;
  const nextFromOrder =
    order
      .slice(currentIdx + 1)
      .map((id) => byId.get(id))
      .find((s) => s && s.status !== "complete" && s.slice_id !== current?.slice_id) ??
    summaries.find(
      (s) =>
        (s.status === "spec_locked" || s.status === "planned") &&
        s.slice_id !== current?.slice_id &&
        !isBlocked(s.slice_id, parsedMap, dependencies),
    ) ??
    null;

  const next =
    consolidation && current?.slice_id === consolidation.current.milestone_id
      ? consolidation.next
        ? ({
            slice_id: consolidation.next.milestone_id,
            name: consolidation.next.label,
            status: consolidation.next.status,
            burt_packet_path: null,
            spec_doc_path: null,
            dependencies: [],
            coverage: {
              implementation: 0,
              tests: 0,
              documentation: 0,
              user_guide: 0,
              ojt_lesson: 0,
            },
            blocker_explanation: null,
          } satisfies EpoSliceSummary)
        : null
      : nextFromOrder;

  let phaseLabel = "LocalBrain Build";
  if (consolidation && current?.slice_id.startsWith("MILESTONE-")) {
    phaseLabel = theoryValidationPhaseLabel(
      parsePeerReviewProgress(),
      consolidation.current.milestone_id,
    );
  } else {
    const anchor = current ?? gateSlice;
    if (anchor) {
      const parsed = parsedMap.get(anchor.slice_id);
      if (parsed) phaseLabel = parsed.phase_label;
    }
  }

  if (isWorkProductComplete() && isCommunicationsOfficeStarted()) {
    const com = getCommunicationsOfficeSnapshot();
    phaseLabel = com.module_complete
      ? "Communications Office · COMPLETE · ENG-PMO-013"
      : com.module_evaluation_pending
        ? "Communications Office · ENG-PMO-013 module evaluation"
        : com.slice_001_3_complete
          ? "Communications Office · ENG-COM-001.3 COMPLETE · ENG-PMO-012"
          : com.slice_001_3_implementation_frozen && !com.slice_001_3_complete
      ? "Communications Office · ENG-COM-001.3 IMPLEMENTATION FROZEN"
      : com.slice_001_3_authorized && !com.slice_001_3_complete
      ? "Communications Office · ENG-COM-001.3 AUTHORIZED · active crossing"
      : com.baseline_stable
        ? "Communications Office · stable baseline · no active architectural uncertainty"
        : com.slice_001_2_complete
        ? "Communications Office · ENG-COM-001.2 COMPLETE · ENG-PMO-011"
        : com.slice_001_2_implementation_frozen
          ? "Communications Office · ENG-COM-001.2 IMPLEMENTATION FROZEN"
          : com.slice_001_1_complete
            ? "Communications Office · ENG-COM-001.1 COMPLETE"
            : "Communications Office · ENG-COM-001 AUTHORIZED";
  }

  return { current, next, phaseLabel };
}

function buildCurrentSprint(
  summaries: EpoSliceSummary[],
  order: string[],
  currentId: string | null,
): EpoCurrentSprint {
  const completeIds = order.filter((id) => {
    const s = summaries.find((x) => x.slice_id === id);
    return s?.status === "complete";
  });

  const completed = completeIds.slice(-3);
  const inProgress: string[] = currentId ? [currentId] : [];

  const currentIdx = currentId ? order.indexOf(currentId) : completeIds.length;
  const queued = order
    .slice(currentIdx + 1)
    .filter((id) => {
      const s = summaries.find((x) => x.slice_id === id);
      return s && s.status !== "complete";
    })
    .slice(0, 3);

  return { completed, in_progress: inProgress, queued };
}

function buildVelocity(slices: ParsedSlice[]): EpoBuildVelocity {
  const periodDays = 30;
  const commits = getCommitsSince(periodDays);
  const sliceCommits = getSliceIdsFromCommits(commits);
  const completedInPeriod = slices.filter(
    (s) => s.status === "complete" && (sliceCommits.has(s.slice_id) || true),
  ).length;

  const recentComplete = slices.filter((s) => s.status === "complete");
  const durations: number[] = [];
  const allCommits = getCommitsSince(90);
  const allSliceCommits = getSliceIdsFromCommits(allCommits);
  const dated = recentComplete
    .map((s) => allSliceCommits.get(s.slice_id)?.[0]?.date)
    .filter(Boolean)
    .map((d) => new Date(d!).getTime())
    .sort((a, b) => a - b);

  for (let i = 1; i < dated.length; i++) {
    durations.push((dated[i] - dated[i - 1]) / 86_400_000);
  }

  const avg =
    durations.length > 0
      ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
      : null;

  return {
    period_days: periodDays,
    slices_completed: sliceCommits.size > 0 ? sliceCommits.size : completedInPeriod,
    commits_count: commits.length,
    documents_changed: countDocsChangedSince(periodDays),
    loc_count: countTypeScriptLoc(),
    tests_count: countTestFiles(),
    average_slice_duration_days: avg,
  };
}

function buildPhases(
  sections: ReturnType<typeof parsePhaseSections>,
  all: Map<string, ParsedSlice>,
): EpoPhaseSummary[] {
  return sections.map((phase) => {
    const statuses = phase.slice_ids.map((id) => all.get(id)?.status ?? "not_started");
    const completed = statuses.filter((s) => s === "complete").length;
    const total = phase.slice_ids.length;
    return {
      phase_id: phase.phase_id,
      label: phase.label,
      progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      total_slices: total,
      completed_slices: completed,
      slice_ids: phase.slice_ids,
      objectives: phase.gate_text ?? phase.label,
    };
  });
}

/** ENG-BLD-001 — authoritative build projection from checklist, registry, git, and docs. */
export function computeBuildState(): BuildStateSnapshot {
  const parsed = parsePhaseChecklistSlices();
  const { order, dependencies, names } = parseSliceRegistry();
  const map = sliceMap(parsed);
  const gate = parseGateLine();
  const recentCommits = getRecentCommits(20);

  const checklistIds = new Set(parsed.map((s) => s.slice_id));
  const orderedIds = [
    ...order.filter((id) => checklistIds.has(id)),
    ...parsed.map((s) => s.slice_id).filter((id) => !order.includes(id)),
  ];

  const summaries: EpoSliceSummary[] = [];
  for (const id of orderedIds) {
    const s = map.get(id);
    if (!s) continue;
    const coverage = computeCoverage(s.slice_id, s.status, s.burt_packet_path);
    summaries.push({
      slice_id: s.slice_id,
      name: names[s.slice_id] ?? s.name,
      status: s.status as SliceStatus,
      burt_packet_path: s.burt_packet_path,
      spec_doc_path: null,
      dependencies: dependencies[s.slice_id] ?? [],
      coverage,
      blocker_explanation: explainBlocker(s, map, dependencies),
    });
  }

  const { current, next, phaseLabel } = findCurrentAndNext(
    summaries,
    orderedIds,
    gate,
    dependencies,
    map,
  );

  const actionableNext = next?.slice_id ?? parseNextFromGate(gate);

  const build_graph = parsed.map((s) => {
    const cov = computeCoverage(s.slice_id, s.status, s.burt_packet_path);
    return {
      slice_id: s.slice_id,
      status: toLifecycleStatus(
        s,
        map,
        dependencies,
        current?.slice_id ?? null,
        cov.tests >= 40,
      ),
      depends_on: dependencies[s.slice_id] ?? [],
    };
  });

  const completed = summaries.filter((s) => s.status === "complete").length;

  return {
    slices: summaries,
    phases: buildPhases(parsePhaseSections(), map),
    current_sprint: buildCurrentSprint(summaries, orderedIds, current?.slice_id ?? null),
    build_velocity: buildVelocity(parsed),
    build_graph,
    current_slice_id: current?.slice_id ?? null,
    current_slice_name: current?.name ?? null,
    next_slice_id: next?.slice_id ?? null,
    next_slice_name: next?.name ?? null,
    current_phase_label: phaseLabel,
    gate_text: gate,
    commit_timeline: recentCommits,
    completed_count: completed,
    total_count: summaries.length,
  };
}

export { changelogDecisions };
