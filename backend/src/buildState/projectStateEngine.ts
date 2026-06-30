import type {
  BuildHistoryDay,
  LaunchCountdown,
  ProjectState,
  V1CommandCenter,
} from "@localbrain/shared";
import {
  FACTORY_ENVIRONMENT_MODEL,
  PROJECT_STATE_ENGINE_ID,
} from "@localbrain/shared";
import { changelogDecisions } from "../epo/checklistParser.js";
import type { BuildStateSnapshot } from "./buildStateEngine.js";
import { computeBuildState } from "./buildStateEngine.js";
import { getCommitCount, getRecentCommits } from "./gitMetrics.js";
import { computeV1CommandCenter } from "./v1CommandCenterEngine.js";

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

function resolveCurrentModule(cc: V1CommandCenter): string | null {
  const active = cc.modules.find(
    (m) => m.status === "in_progress" || m.status === "blocked",
  );
  return active?.name ?? cc.modules.find((m) => m.status === "waiting")?.name ?? null;
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

export function computeProjectState(
  state: BuildStateSnapshot,
  command_center: V1CommandCenter,
): ProjectState {
  const head = getRecentCommits(1)[0];
  const build_number = getCommitCount();

  return {
    engine_id: PROJECT_STATE_ENGINE_ID,
    current_version: command_center.product_version,
    build_number,
    git_commit: head?.hash ?? "dev",
    launch_score_percent: command_center.v1_launch_score_percent,
    current_phase: state.current_phase_label,
    current_module: resolveCurrentModule(command_center),
    current_burt_packet: resolveCurrentBurtPacket(state),
    critical_path: command_center.critical_path,
    overall_eta_days: command_center.days_to_v1_estimate,
    todays_objective: command_center.building_today,
    yesterdays_progress: command_center.finished_yesterday,
    blockers: command_center.blocked_summary,
    certification_status: certificationStatus(command_center),
    launch_countdown: buildLaunchCountdown(command_center),
    build_history: buildHistoryTimeline(),
    factory_environments: FACTORY_ENVIRONMENT_MODEL,
    command_center,
    observed_at: new Date().toISOString(),
  };
}

/** Authoritative project state — call once per request and pass to consumers. */
export function getProjectState(): ProjectState {
  const buildState = computeBuildState();
  const command_center = computeV1CommandCenter(buildState);
  return computeProjectState(buildState, command_center);
}
