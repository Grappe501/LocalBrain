import type {
  BuildHistoryDay,
  LaunchCountdown,
  ProjectState,
  V1CommandCenter,
} from "@localbrain/shared";
import {
  FACTORY_ENVIRONMENT_MODEL,
  PROJECT_STATE_ENGINE_ID,
  BURT_V1_MISSION,
  V1_MODULE_REVIEW_REQUEST,
  V1_ROADMAP_ITEMS,
  V2_SCOPE_RULE,
  type CeoModeBrief,
  type V1RoadmapItemRow,
} from "@localbrain/shared";
import { changelogDecisions } from "../epo/checklistParser.js";
import type { BuildStateSnapshot } from "./buildStateEngine.js";
import { computeBuildState } from "./buildStateEngine.js";
import { certifyCurrentModule } from "./moduleCertificationEngine.js";
import { getCommitCount, getRecentCommits } from "./gitMetrics.js";
import { computeV1CommandCenter } from "./v1CommandCenterEngine.js";
import { computeAdaptiveForecast } from "./v1ForecastEngine.js";
import { recordV1Heartbeat } from "./v1Heartbeat.js";

function formatHistoryDateLabel(iso: string, today: string, yesterday: string): string {
  if (iso === today) return "Today";
  if (iso === yesterday) return "Yesterday";
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function buildHistoryTimeline(): BuildHistoryDay[] {
  const commits = getRecentCommits(120);
  const changelog = changelogDecisions();
  const today = new Date().toISOString().slice(0, 10);
  const yDate = new Date();
  yDate.setDate(yDate.getDate() - 1);
  const yesterday = yDate.toISOString().slice(0, 10);

  const byDate = new Map<string, string[]>();

  for (const c of commits) {
    const list = byDate.get(c.date) ?? [];
    if (!list.includes(c.subject)) list.push(c.subject);
    byDate.set(c.date, list);
  }

  for (const row of changelog) {
    const list = byDate.get(row.date) ?? [];
    const short = row.title.length > 80 ? `${row.title.slice(0, 77)}…` : row.title;
    if (!list.some((e) => e === short || e.includes(short.slice(0, 24)))) {
      list.unshift(short);
    }
    byDate.set(row.date, list);
  }

  return [...byDate.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 40)
    .map(([iso_date, entries]) => ({
      iso_date,
      date_label: formatHistoryDateLabel(iso_date, today, yesterday),
      entries: entries.slice(0, 6),
    }));
}

function resolveCurrentModuleId(cc: V1CommandCenter): string | null {
  const active = cc.modules.find(
    (m) => m.status === "in_progress" || m.status === "blocked",
  );
  return active?.module_id ?? cc.modules.find((m) => m.status === "waiting")?.module_id ?? null;
}

function resolveCurrentModule(cc: V1CommandCenter): string | null {
  const id = resolveCurrentModuleId(cc);
  if (id) return cc.modules.find((m) => m.module_id === id)?.name ?? null;
  return null;
}

function resolveCurrentBurtPacket(
  state: BuildStateSnapshot,
): string | null {
  if (!state.current_slice_id) return null;
  const slice = state.slices.find((s) => s.slice_id === state.current_slice_id);
  if (slice?.burt_packet_path) return slice.burt_packet_path;
  const milestoneSlice = state.slices.find(
    (s) => s.status === "in_progress" && s.burt_packet_path,
  );
  return milestoneSlice?.burt_packet_path ?? null;
}

function certificationStatus(cc: V1CommandCenter): string {
  const certified = cc.modules.filter((m) => m.certified).length;
  const total = cc.modules.length;
  if (certified === total) return "All modules certified";
  if (certified > 0) return `${certified}/${total} modules certified`;
  return "Certification in progress";
}

function buildLaunchCountdown(cc: V1CommandCenter): LaunchCountdown {
  const modulesRemaining = cc.modules.filter((m) => m.progress_percent < 100).length;
  const modulesCertified = cc.modules.filter((m) => m.certified).length;

  return {
    product_label: "LOCALBRAIN V1",
    current_phase: "Implementation",
    overall_progress_percent: cc.v1_launch_score_percent,
    critical_path_remaining_days: cc.days_to_v1_estimate,
    modules_remaining: modulesRemaining,
    modules_certified: modulesCertified,
    open_critical_bugs: 0,
    architecture_status: "FROZEN",
    target: "Commercial Beta",
  };
}

function roadmapRows(cc: V1CommandCenter): V1RoadmapItemRow[] {
  return V1_ROADMAP_ITEMS.map((item) => {
    const node = cc.critical_path.find((n) => n.step_id === item.critical_path_step);
    let status: V1RoadmapItemRow["status"] = "not_started";
    if (node?.status === "complete") status = "complete";
    else if (node?.status === "in_progress") status = "in_progress";
    return { id: item.id, label: item.label, status };
  });
}

function buildCeoMode(
  cc: V1CommandCenter,
  days_to_beta: number | null,
  launch_score_percent: number,
): CeoModeBrief {
  const inProgress = cc.critical_path.find((n) => n.status === "in_progress");
  const module_finishing_today =
    inProgress?.label ??
    cc.modules.find((m) => m.status === "in_progress")?.name ??
    cc.building_today;

  const blocked = cc.critical_path.find(
    (n) => n.status === "waiting" || n.status === "blocked",
  );
  const blocks_v1_most = blocked
    ? blocked.blocked_by
      ? `${blocked.label} ← ${cc.critical_path.find((n) => n.step_id === blocked.blocked_by)?.label}`
      : blocked.label
    : cc.blocked_summary;

  const heartbeat = recordV1Heartbeat(launch_score_percent, days_to_beta);
  const moduleId = resolveCurrentModuleId(cc);

  return {
    module_finishing_today: module_finishing_today ?? null,
    current_module_id: moduleId,
    blocks_v1_most: blocks_v1_most ?? null,
    wait_until_v2: V2_SCOPE_RULE,
    completed_since_yesterday: cc.finished_yesterday,
    launch_closer_than_yesterday: heartbeat.launch_closer_than_yesterday,
    launch_momentum_label: heartbeat.momentum_label,
    days_to_beta,
    v1_roadmap: roadmapRows(cc),
    current_module_certification: certifyCurrentModule(moduleId),
    burt_mission: BURT_V1_MISSION,
    module_review_instruction: V1_MODULE_REVIEW_REQUEST.instruction,
  };
}

export function computeProjectState(
  state: BuildStateSnapshot,
  command_center: V1CommandCenter,
): ProjectState {
  const head = getRecentCommits(1)[0];
  const build_number = getCommitCount();
  const days_to_beta = command_center.days_to_v1_estimate;
  const launch_score_percent = command_center.v1_launch_score_percent;
  const adaptive_forecast = computeAdaptiveForecast(state, command_center, launch_score_percent);

  return {
    engine_id: PROJECT_STATE_ENGINE_ID,
    current_version: command_center.product_version,
    build_number,
    git_commit: head?.hash ?? "dev",
    launch_score_percent,
    current_phase: state.current_phase_label,
    current_module: resolveCurrentModule(command_center),
    current_burt_packet: resolveCurrentBurtPacket(state),
    critical_path: command_center.critical_path,
    overall_eta_days: days_to_beta,
    days_to_beta,
    todays_objective: command_center.building_today,
    yesterdays_progress: command_center.finished_yesterday,
    blockers: command_center.blocked_summary,
    certification_status: certificationStatus(command_center),
    ceo_mode: buildCeoMode(command_center, days_to_beta, launch_score_percent),
    launch_countdown: buildLaunchCountdown(command_center),
    build_history: buildHistoryTimeline(),
    factory_environments: FACTORY_ENVIRONMENT_MODEL,
    command_center,
    adaptive_forecast,
    observed_at: new Date().toISOString(),
  };
}

/** Authoritative project state — call once per request and pass to consumers. */
export function getProjectState(): ProjectState {
  const buildState = computeBuildState();
  const command_center = computeV1CommandCenter(buildState);
  return computeProjectState(buildState, command_center);
}
