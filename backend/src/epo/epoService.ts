import type {
  EpoDecisionEvent,
  EpoOverview,
  EpoSliceDetail,
} from "@localbrain/shared";
import { BINDING_DECISIONS } from "../context/bindingDecisions.js";
import { getRegisteredModules } from "../core/moduleLoader.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { getSystemUsage } from "../system/systemService.js";
import { listDocumentationLibrary } from "./docsLibrary.js";
import { parsePhaseChecklistSlices } from "./checklistParser.js";
import { computeBuildState, BUILD_STATE_ENGINE_ID, changelogDecisions } from "../buildState/buildStateEngine.js";
import { getRecentCommits } from "./gitReader.js";
import { computeEngineeringScore } from "../engineering/engineeringScore.js";
import { explainBlocker } from "./blockerExplainer.js";
import { computeCoverage, extractBurtMission } from "./coverageHeuristics.js";
import { parseSliceRegistry } from "../buildState/sliceRegistry.js";

function sliceMap() {
  const slices = parsePhaseChecklistSlices();
  return new Map(slices.map((s) => [s.slice_id, s]));
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
  const state = computeBuildState();
  const usage = getSystemUsage();
  const modules = getRegisteredModules();
  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);
  const docs = listDocumentationLibrary();
  const engScore = computeEngineeringScore().score;

  return {
    current_phase_label: state.current_phase_label,
    current_slice_id: state.current_slice_id,
    current_slice_name: state.current_slice_name,
    next_slice_id: state.next_slice_id,
    next_slice_name: state.next_slice_name,
    gate_text: state.gate_text,
    metrics: {
      completed_slices: state.completed_count,
      remaining_slices: state.total_count - state.completed_count,
      total_v1_slices: state.total_count,
      overall_progress_percent:
        state.total_count > 0
          ? Math.round((state.completed_count / state.total_count) * 100)
          : 0,
      document_count: docs.length,
      module_count: modules.length,
      workspace_count: workspaces.length,
      tests_passing: state.build_velocity.tests_count,
      api_cost_today_usd: usage.cost_usd_today,
      tokens_today: usage.tokens_today,
      operational_health_score: usage.operational_health_score,
      engineering_score: engScore,
    },
    phases: state.phases,
    slices: state.slices,
    build_graph: state.build_graph,
    decisions: buildDecisions(),
    current_sprint: state.current_sprint,
    build_velocity: state.build_velocity,
    commit_timeline: state.commit_timeline,
    build_state_engine_id: BUILD_STATE_ENGINE_ID,
    read_only: true,
    observed_at: new Date().toISOString(),
  };
}

export function getEpoSliceDetail(sliceId: string): EpoSliceDetail | null {
  const map = sliceMap();
  const s = map.get(sliceId);
  if (!s) return null;

  const { dependencies } = parseSliceRegistry();
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
    dependencies: dependencies[s.slice_id] ?? [],
    coverage: computeCoverage(s.slice_id, s.status, s.burt_packet_path),
    blocker_explanation: explainBlocker(s, map, dependencies),
    mission,
    objectives,
    architecture_notes: s.burt_packet_path ? `See ${s.burt_packet_path}` : null,
    related_docs: related,
    recent_commits: getRecentCommits(5),
    open_decisions: BINDING_DECISIONS.map((d) => `${d.id}: ${d.title}`),
  };
}

export { listDocumentationLibrary };
