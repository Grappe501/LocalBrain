import type {
  V1AdaptiveForecast,
  V1CriticalPathVelocity,
  V1DepartmentVelocityRow,
  V1ForecastDayComparison,
  V1ForecastModelTier,
  V1ModuleVelocityRow,
  V1ScheduleDriftPoint,
} from "@localbrain/shared";
import { V1_FORECAST_ENGINE_ID } from "@localbrain/shared";
import fs from "node:fs";
import path from "node:path";
import type { BuildStateSnapshot } from "./buildStateEngine.js";
import type { V1CommandCenter } from "@localbrain/shared";
import { getCommitsSince, getCommitCount } from "./gitMetrics.js";
import { getRepoRoot } from "../db/repoRoot.js";
import { certifyCurrentModule } from "./moduleCertificationEngine.js";

const HISTORY_PATH = path.join(getRepoRoot(), "local_data", "v1-forecast-history.json");

type ForecastHistoryPoint = {
  date: string;
  estimated_days: number;
  predicted_days: number;
  launch_score_percent: number;
  confidence_percent: number;
  launch_score_delta?: number;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + Math.round(days));
  return d.toISOString().slice(0, 10);
}

function formatLaunchDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function readHistory(): ForecastHistoryPoint[] {
  try {
    if (!fs.existsSync(HISTORY_PATH)) return [];
    const raw = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8")) as {
      points?: ForecastHistoryPoint[];
    };
    return raw.points ?? [];
  } catch {
    return [];
  }
}

function writeHistory(points: ForecastHistoryPoint[]): void {
  const dir = path.dirname(HISTORY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify({ points }, null, 2));
}

function modelTier(historyCount: number, buildCount: number | null): V1ForecastModelTier {
  if (buildCount != null && buildCount >= 300) return "predictive_model";
  if (historyCount >= 50 || (buildCount != null && buildCount >= 50)) return "predictive_model";
  if (historyCount >= 7 || (buildCount != null && buildCount >= 7)) return "historical_average";
  return "engineering_estimate";
}

function confidencePercent(
  history: ForecastHistoryPoint[],
  buildCount: number | null,
  tier: V1ForecastModelTier,
): number {
  let c = 22 + history.length * 3;
  if (buildCount != null) c += Math.min(20, Math.floor(buildCount / 10));
  if (tier === "historical_average") c += 15;
  if (tier === "predictive_model") c += 25;
  return Math.min(94, Math.max(22, c));
}

/** Shared velocity factor for launch and phase forecasts. */
export function computeVelocityFactor(
  state: BuildStateSnapshot,
  cc: V1CommandCenter,
  history?: ForecastHistoryPoint[],
): number {
  const hist = history ?? readHistory();
  const commits7 = getCommitsSince(7).length;
  const expectedWeeklyCommits = 5;
  const commitBoost = commits7 / expectedWeeklyCommits;

  const avgSliceDays = state.build_velocity.average_slice_duration_days;
  let velocityFactor = 1.0;
  if (avgSliceDays != null && avgSliceDays > 0) {
    const remainingSteps = cc.burndown.filter((b) => b.status !== "complete").length;
    const impliedDaily = avgSliceDays / Math.max(1, remainingSteps);
    velocityFactor = Math.max(0.6, Math.min(1.4, commitBoost * (2 / impliedDaily)));
  } else {
    velocityFactor = Math.max(0.7, Math.min(1.3, commitBoost));
  }

  if (hist.length >= 14) {
    const recent = hist.slice(-14);
    const avgPredicted =
      recent.reduce((s, p) => s + p.predicted_days, 0) / recent.length;
    const trend = recent[0].predicted_days - recent[recent.length - 1].predicted_days;
    if (trend > 0) velocityFactor *= 1 + trend / (avgPredicted * 4);
  }

  return velocityFactor;
}

function criticalPathVelocity(
  history: ForecastHistoryPoint[],
  launchScore: number,
  prevScore: number | null,
  prevPredicted: number | null,
  predicted: number,
): V1CriticalPathVelocity {
  const scoreDelta = prevScore != null ? launchScore - prevScore : 0;
  const daysDelta =
    prevPredicted != null ? prevPredicted - predicted : 0;

  if (scoreDelta <= 0 && daysDelta <= 0) {
    return {
      velocity_percent: 0,
      critical_path_moved: false,
      label: "0%",
      detail: "Critical path — no movement (off-path work does not change launch)",
    };
  }

  const velocity = Math.round(
    Math.max(scoreDelta * 4, daysDelta * 8, scoreDelta > 0 ? 5 : 0),
  );
  return {
    velocity_percent: velocity,
    critical_path_moved: true,
    label: `+${velocity}%`,
    detail:
      daysDelta > 0
        ? `Launch forecast pulled in ${daysDelta.toFixed(1)} days · score +${scoreDelta}%`
        : `Launch score +${scoreDelta}% on critical path`,
  };
}

function moduleVelocityRows(cc: V1CommandCenter): V1ModuleVelocityRow[] {
  return cc.modules.map((mod) => {
    const step = cc.burndown.find((b) =>
      mod.module_id === "executive_office"
        ? b.step_id === "executive_office_polish"
        : mod.module_id === "factory"
          ? b.step_id === "empty_brain_factory"
          : mod.module_id === "memory_os"
            ? b.step_id === "memory_os"
            : mod.module_id === "communications"
              ? b.step_id === "communications_office"
              : false,
    );
    const expected = step?.estimated_days ?? 5;

    if (mod.status === "not_started" || mod.status === "waiting") {
      return {
        module_id: mod.module_id,
        module_name: mod.name,
        expected_days: expected,
        actual_days: null,
        velocity_percent: null,
        status: "tracking",
      };
    }

    const progress = mod.progress_percent / 100;
    const actual = progress > 0 ? Math.round(expected * progress * 10) / 10 : null;
    let velocity_percent: number | null = null;
    let status: V1ModuleVelocityRow["status"] = "tracking";
    if (actual != null && actual > 0) {
      velocity_percent = Math.round(((expected - actual) / expected) * 100);
      status =
        velocity_percent > 5 ? "ahead" : velocity_percent < -5 ? "behind" : "on_track";
    }

    return {
      module_id: mod.module_id,
      module_name: mod.name,
      expected_days: expected,
      actual_days: actual,
      velocity_percent,
      status,
    };
  });
}

function departmentVelocity(cc: V1CommandCenter): V1DepartmentVelocityRow[] {
  const map: V1DepartmentVelocityRow[] = [
    { office_id: "chief_of_staff", office_name: "Chief of Staff", progress_percent: 0, status: "reserved" },
    { office_id: "program_office", office_name: "Program Office", progress_percent: 0, status: "in_progress" },
    { office_id: "executive_office", office_name: "Executive Office", progress_percent: 0, status: "in_progress" },
    { office_id: "engineering", office_name: "Engineering", progress_percent: 0, status: "in_progress" },
    { office_id: "memory_office", office_name: "Memory Office", progress_percent: 0, status: "reserved" },
    { office_id: "communications", office_name: "Communications", progress_percent: 0, status: "not_started" },
  ];

  for (const row of map) {
    const mod = cc.modules.find((m) => m.module_id === row.office_id.replace("_office", "_office") || m.module_id === row.office_id);
    if (row.office_id === "program_office") {
      row.progress_percent = Math.min(100, cc.v1_launch_score_percent + 82);
      row.status = "in_progress";
      continue;
    }
    if (row.office_id === "chief_of_staff") {
      const eo = cc.modules.find((m) => m.module_id === "executive_office");
      row.progress_percent = eo ? Math.min(100, eo.progress_percent) : 0;
      row.status = eo?.status === "complete" ? "complete" : "in_progress";
      continue;
    }
    if (mod) {
      row.progress_percent = mod.progress_percent;
      row.status =
        mod.status === "complete"
          ? "complete"
          : mod.status === "not_started" || mod.status === "waiting"
            ? "not_started"
            : "in_progress";
    }
  }

  return map;
}

function buildReasons(
  cc: V1CommandCenter,
  scoreDelta: number,
  blockersRemoved: number,
  velocityExceeded: boolean,
): string[] {
  const reasons: string[] = [];
  if (scoreDelta > 0) {
    const mod = cc.modules.find((m) => m.status === "in_progress");
    reasons.push(`✓ ${mod?.name ?? "Critical path"} +${scoreDelta}%`);
  }
  if (blockersRemoved > 0) reasons.push(`✓ ${blockersRemoved} blocker(s) removed`);
  if (velocityExceeded) reasons.push("✓ Actual velocity exceeded expected");
  if (reasons.length === 0) reasons.push("Tracking — awaiting critical path movement");
  return reasons;
}

function pmoReasoning(cc: V1CommandCenter): string[] {
  const lines: string[] = [];
  const eoCert = certifyCurrentModule("executive_office");
  if (eoCert?.regression_detected) {
    lines.push("REGRESSION — Executive Office failed re-certification; launch confidence reduced");
  }
  const eo = cc.modules.find((m) => m.module_id === "executive_office");
  if (eo && eo.status === "in_progress") {
    lines.push(
      eo.progress_percent >= 55
        ? "Executive Office ahead of schedule on polish"
        : "Executive Office certification in progress",
    );
  }
  const factory = cc.modules.find((m) => m.module_id === "factory");
  if (factory && factory.progress_percent < 20) {
    lines.push("Factory implementation largely unknown — largest schedule uncertainty after Convention");
  }
  const memory = cc.modules.find((m) => m.module_id === "memory_os");
  if (memory?.status === "waiting" || memory?.status === "not_started") {
    lines.push("Memory OS still largest remaining module (30% launch weight)");
  }
  const comms = cc.modules.find((m) => m.module_id === "communications");
  if (comms?.status === "not_started" || comms?.status === "waiting") {
    lines.push("Communications not started");
  }
  if (cc.blocked_summary) lines.push(`Blocker: ${cc.blocked_summary}`);
  return lines;
}

function dayComparison(
  label: string,
  estimatedDays: number,
  predictedDays: number,
  confidence: number,
  reasons: string[],
  baseDate: string,
): V1ForecastDayComparison {
  return {
    label,
    estimated_launch_date: formatLaunchDate(addDays(baseDate, estimatedDays)),
    predicted_launch_date: formatLaunchDate(addDays(baseDate, predictedDays)),
    confidence_percent: confidence,
    reasons,
  };
}

export function computeAdaptiveForecast(
  state: BuildStateSnapshot,
  cc: V1CommandCenter,
  launchScore: number,
): V1AdaptiveForecast {
  const today = todayIso();
  const estimatedDays = cc.days_to_v1_estimate ?? 0;
  const buildCount = getCommitCount();
  let history = readHistory();

  const commits7 = getCommitsSince(7).length;
  const commits30 = getCommitsSince(30).length;
  const expectedWeeklyCommits = 5;
  const commitBoost = commits7 / expectedWeeklyCommits;

  const velocityFactor = computeVelocityFactor(state, cc, history);

  const predictedDays =
    estimatedDays > 0
      ? Math.round((estimatedDays / velocityFactor) * 10) / 10
      : null;

  const tier = modelTier(history.length, buildCount);
  let confidence = confidencePercent(history, buildCount, tier);
  const eoCert = certifyCurrentModule("executive_office");
  if (eoCert?.regression_detected) {
    confidence = Math.max(22, confidence - 25);
  }

  const prevPoint = history.find((p) => p.date === yesterdayIso()) ?? history.at(-2) ?? null;
  const scoreDelta = prevPoint ? launchScore - prevPoint.launch_score_percent : 0;
  const blockersRemoved =
    prevPoint && cc.blocked_summary === null ? 1 : 0;
  const velocityExceeded = commitBoost > 1.15;

  const reasons = buildReasons(cc, scoreDelta, blockersRemoved, velocityExceeded);
  const yesterdayConfidence = prevPoint?.confidence_percent ?? Math.max(22, confidence - 3);

  const todayPoint: ForecastHistoryPoint = {
    date: today,
    estimated_days: estimatedDays,
    predicted_days: predictedDays ?? estimatedDays,
    launch_score_percent: launchScore,
    confidence_percent: confidence,
    launch_score_delta: scoreDelta,
  };

  history = history.filter((p) => p.date !== today);
  history.push(todayPoint);
  history.sort((a, b) => a.date.localeCompare(b.date));
  if (history.length > 90) history = history.slice(-90);
  writeHistory(history);

  const schedule_drift: V1ScheduleDriftPoint[] = history.slice(-14).map((p) => ({
    iso_date: p.date,
    date_label: formatLaunchDate(p.date),
    estimated_days: p.estimated_days,
    predicted_days: p.predicted_days,
  }));

  const pred = predictedDays ?? estimatedDays;
  const estLaunch = estimatedDays > 0 ? addDays(today, estimatedDays) : null;
  const predLaunch = pred > 0 ? addDays(today, pred) : null;
  const diff =
    estimatedDays > 0 && predictedDays != null
      ? Math.round((predictedDays - estimatedDays) * 10) / 10
      : null;

  let divergence_reason: string | null = null;
  if (diff != null && Math.abs(diff) >= 3) {
    divergence_reason =
      diff > 0
        ? `Predicted ${Math.abs(diff)} days later than expert burn-down — velocity below plan or Memory-weight modules untested`
        : `Predicted ${Math.abs(diff)} days earlier — git velocity exceeding expert estimates`;
  }

  return {
    engine_id: V1_FORECAST_ENGINE_ID,
    model_tier: tier,
    estimated_days_to_beta: estimatedDays > 0 ? estimatedDays : null,
    predicted_days_to_beta: predictedDays,
    estimated_vs_predicted: {
      estimated_launch_date: estLaunch ? formatLaunchDate(estLaunch) : null,
      predicted_launch_date: predLaunch ? formatLaunchDate(predLaunch) : null,
      difference_days: diff,
      divergence_reason,
    },
    prediction_confidence_percent: confidence,
    pmo_reasoning: pmoReasoning(cc),
    yesterday: prevPoint
      ? dayComparison(
          "Yesterday",
          prevPoint.estimated_days,
          prevPoint.predicted_days,
          yesterdayConfidence,
          [],
          prevPoint.date,
        )
      : null,
    today: dayComparison("Today", estimatedDays, pred, confidence, reasons, today),
    module_velocity: moduleVelocityRows(cc),
    critical_path_velocity: criticalPathVelocity(
      history,
      launchScore,
      prevPoint?.launch_score_percent ?? null,
      prevPoint?.predicted_days ?? null,
      pred,
    ),
    schedule_drift,
    department_velocity: departmentVelocity(cc),
    observed_at: new Date().toISOString(),
  };
}
