import type {
  EpoDecisionEvent,
  EpoOverview,
  EpoPhaseSummary,
  EpoSliceDetail,
  EpoSliceSummary,
} from "@localbrain/shared";
import { BINDING_DECISIONS } from "../context/bindingDecisions.js";
import { getRegisteredModules } from "../core/moduleLoader.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { getSystemUsage } from "../system/systemService.js";
import { listDocumentationLibrary } from "./docsLibrary.js";
import {
  changelogDecisions,
  parseGateLine,
  parsePhaseChecklistSlices,
} from "./checklistParser.js";
import { EPO_PHASES, SLICE_DEPENDENCIES } from "./epoData.js";
import { explainBlocker, isBlocked, toGraphStatus } from "./blockerExplainer.js";
import { computeCoverage, extractBurtMission } from "./coverageHeuristics.js";
import { getRecentCommits } from "./gitReader.js";
import { computeEngineeringScore } from "../engineering/engineeringScore.js";

function sliceMap() {
  const slices = parsePhaseChecklistSlices();
  return new Map(slices.map((s) => [s.slice_id, s]));
}

function buildPhases(all: Map<string, ReturnType<typeof parsePhaseChecklistSlices>[0]>): EpoPhaseSummary[] {
  return EPO_PHASES.map((phase) => {
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
      objectives: phase.objectives,
    };
  });
}

function findCurrentAndNext(slices: EpoSliceSummary[]): {
  current: EpoSliceSummary | null;
  next: EpoSliceSummary | null;
  phaseLabel: string;
} {
  const inProgress = slices.find((s) => s.status === "in_progress");
  const v1Order = [
    "LB-OS-012",
    "LB-OS-012.5",
    "LB-OS-013",
    "LB-OS-014",
    "LB-OS-015",
    "LB-OS-016",
  ];
  const firstIncomplete = v1Order
    .map((id) => slices.find((s) => s.slice_id === id))
    .find((s) => s && s.status !== "complete");

  const specLockedReady = slices.filter(
    (s) =>
      s.status === "spec_locked" &&
      !(s.blocker_explanation?.startsWith("Waiting") ?? false),
  );
  const preferred = firstIncomplete ?? specLockedReady[0] ?? null;
  const current = inProgress ?? preferred ?? null;

  const next =
    slices.find(
      (s) =>
        (s.status === "spec_locked" || s.status === "planned") &&
        s.slice_id !== current?.slice_id &&
        !isBlocked(s.slice_id, sliceMap()),
    ) ?? slices.find((s) => s.status === "planned" || s.status === "spec_locked") ?? null;

  let phaseLabel = "Core Executive OS";
  if (current) {
    for (const p of EPO_PHASES) {
      if (p.slice_ids.includes(current.slice_id)) {
        phaseLabel = p.label;
        break;
      }
    }
  }

  return { current, next, phaseLabel };
}

function buildDecisions(): EpoDecisionEvent[] {
  const events: EpoDecisionEvent[] = BINDING_DECISIONS.map((d) => ({
    id: d.id,
    date: "2026-06-28",
    title: d.title,
    summary: d.summary,
    replaced: d.title.includes("replaces") ? "Prior model" : null,
    impact: "Downstream slices and UI follow this binding.",
  }));

  for (const row of changelogDecisions()) {
    events.push({
      id: `CHG-${row.date}-${events.length}`,
      date: row.date,
      title: row.title,
      summary: row.title,
      replaced: null,
      impact: "Recorded in Phase Checklist change log.",
    });
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

export function getEpoOverview(): EpoOverview {
  const parsed = parsePhaseChecklistSlices();
  const map = sliceMap();
  const usage = getSystemUsage();

  const slices: EpoSliceSummary[] = parsed.map((s) => ({
    slice_id: s.slice_id,
    name: s.name,
    status: s.status,
    burt_packet_path: s.burt_packet_path,
    spec_doc_path: null,
    dependencies: SLICE_DEPENDENCIES[s.slice_id] ?? [],
    coverage: computeCoverage(s.slice_id, s.status, s.burt_packet_path),
    blocker_explanation: explainBlocker(s, map),
  }));

  const completed = slices.filter((s) => s.status === "complete").length;
  const total = slices.length;
  const { current, next, phaseLabel } = findCurrentAndNext(slices);

  const modules = getRegisteredModules();
  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);
  const docs = listDocumentationLibrary();
  const engScore = computeEngineeringScore().score;

  return {
    current_phase_label: phaseLabel,
    current_slice_id: current?.slice_id ?? null,
    current_slice_name: current?.name ?? null,
    next_slice_id: next?.slice_id ?? null,
    next_slice_name: next?.name ?? null,
    gate_text: parseGateLine(),
    metrics: {
      completed_slices: completed,
      remaining_slices: total - completed,
      total_v1_slices: total,
      overall_progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      document_count: docs.length,
      module_count: modules.length,
      workspace_count: workspaces.length,
      tests_passing: null,
      api_cost_today_usd: usage.cost_usd_today,
      tokens_today: usage.tokens_today,
      operational_health_score: usage.operational_health_score,
      engineering_score: engScore,
    },
    phases: buildPhases(map),
    slices,
    build_graph: parsed.map((s) => ({
      slice_id: s.slice_id,
      status: toGraphStatus(s.status, isBlocked(s.slice_id, map)),
      depends_on: SLICE_DEPENDENCIES[s.slice_id] ?? [],
    })),
    decisions: buildDecisions(),
    read_only: true,
    observed_at: new Date().toISOString(),
  };
}

export function getEpoSliceDetail(sliceId: string): EpoSliceDetail | null {
  const map = sliceMap();
  const s = map.get(sliceId);
  if (!s) return null;

  const { mission, objectives } = extractBurtMission(s.burt_packet_path);
  const related = listDocumentationLibrary()
    .filter((d) => d.path.includes(sliceId.replace(/\./g, "")) || d.title.includes(sliceId))
    .map((d) => d.path)
    .slice(0, 8);

  return {
    slice_id: s.slice_id,
    name: s.name,
    status: s.status,
    burt_packet_path: s.burt_packet_path,
    spec_doc_path: null,
    dependencies: SLICE_DEPENDENCIES[s.slice_id] ?? [],
    coverage: computeCoverage(s.slice_id, s.status, s.burt_packet_path),
    blocker_explanation: explainBlocker(s, map),
    mission,
    objectives,
    architecture_notes: s.burt_packet_path ? `See ${s.burt_packet_path}` : null,
    related_docs: related,
    recent_commits: getRecentCommits(5),
    open_decisions: BINDING_DECISIONS.map((d) => `${d.id}: ${d.title}`),
  };
}

export { listDocumentationLibrary };
