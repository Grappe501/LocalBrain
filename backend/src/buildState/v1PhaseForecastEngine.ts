import type {
  V1AdaptiveForecast,
  V1CommandCenter,
  V1CriticalPathStep,
  V1PhaseDayChange,
  V1PhaseForecast,
  V1PhaseForecastRow,
  V1PhaseForecastStatus,
  V1PhaseWorkUnit,
  V1MegaPhaseSummary,
} from "@localbrain/shared";
import {
  V1_BURNDOWN_ESTIMATES_DAYS,
  V1_MEGA_PHASES,
  V1_PHASE_DISPLAY_LABELS,
  V1_PHASE_FINISHABILITY_BASE,
  V1_PHASE_FORECAST_ENGINE_ID,
  V1_PHASE_WORK_UNITS,
  V1_ROADMAP_ITEMS,
} from "@localbrain/shared";
import fs from "node:fs";
import path from "node:path";
import type { BuildStateSnapshot } from "./buildStateEngine.js";
import { computeVelocityFactor } from "./v1ForecastEngine.js";
import { getRepoRoot } from "../db/repoRoot.js";
import { certifyCurrentModule } from "./moduleCertificationEngine.js";

const HISTORY_PATH = path.join(getRepoRoot(), "local_data", "v1-phase-forecast-history.json");

type PhaseHistoryPoint = {
  date: string;
  phases: Record<string, { predicted_days: number; label: string }>;
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
  d.setDate(d.getDate() + Math.round(days * 10) / 10);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function readPhaseHistory(): PhaseHistoryPoint[] {
  try {
    if (!fs.existsSync(HISTORY_PATH)) return [];
    const raw = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8")) as {
      points?: PhaseHistoryPoint[];
    };
    return raw.points ?? [];
  } catch {
    return [];
  }
}

function writePhaseHistory(points: PhaseHistoryPoint[]): void {
  const dir = path.dirname(HISTORY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify({ points }, null, 2));
}

function stepStatus(
  stepId: V1CriticalPathStep,
  cc: V1CommandCenter,
): V1PhaseForecastStatus {
  const row = cc.burndown.find((b) => b.step_id === stepId);
  if (!row || row.status === "complete") return "complete";

  const firstOpen = cc.burndown.find((b) => b.status !== "complete");
  if (firstOpen?.step_id === stepId) return "in_progress";
  return "not_started";
}

function stepProgressPercent(stepId: V1CriticalPathStep, cc: V1CommandCenter): number {
  const status = stepStatus(stepId, cc);
  if (status === "complete") return 100;
  if (status === "not_started") return 0;

  const roadmapItem = V1_ROADMAP_ITEMS.find((r) => r.critical_path_step === stepId);
  const moduleId =
    stepId === "executive_office_polish"
      ? "executive_office"
      : [
            "peer_review_session_4",
            "peer_review_session_5",
            "theory_v1_freeze",
            "executive_epistemology_convention",
          ].includes(stepId)
        ? "theory_convention"
        : stepId === "empty_brain_factory"
          ? "factory"
          : stepId === "memory_os"
            ? "memory_os"
            : stepId === "communications_office"
              ? "communications"
              : stepId === "commercial_beta"
                ? "documentation_beta"
                : null;

  const mod = moduleId ? cc.modules.find((m) => m.module_id === moduleId) : null;
  if (!mod) return 35;

  if (roadmapItem) {
    const moduleSteps = V1_ROADMAP_ITEMS.filter((r) => {
      const mid =
        r.critical_path_step === "executive_office_polish"
          ? "executive_office"
          : ["peer_review_session_4", "peer_review_session_5", "theory_v1_freeze", "executive_epistemology_convention"].includes(
                r.critical_path_step,
              )
            ? "theory_convention"
            : r.critical_path_step === "empty_brain_factory"
              ? "factory"
              : r.critical_path_step === "memory_os"
                ? "memory_os"
                : r.critical_path_step === "communications_office"
                  ? "communications"
                  : r.critical_path_step === "commercial_beta"
                    ? "documentation_beta"
                    : null;
      return mid === moduleId;
    });
    const totalEst = moduleSteps.reduce(
      (s, r) => s + V1_BURNDOWN_ESTIMATES_DAYS[r.critical_path_step],
      0,
    );
    const stepEst = V1_BURNDOWN_ESTIMATES_DAYS[stepId];
    const stepWeight = totalEst > 0 ? stepEst / totalEst : 1 / moduleSteps.length;

    let priorComplete = 0;
    for (const s of moduleSteps) {
      if (s.critical_path_step === stepId) break;
      if (stepStatus(s.critical_path_step, cc) === "complete") priorComplete += 1;
    }
    const priorFraction = priorComplete / moduleSteps.length;
    const inStepFraction = (mod.progress_percent / 100) * stepWeight;
    return Math.min(99, Math.round((priorFraction + inStepFraction) * 100));
  }

  return Math.min(99, mod.progress_percent);
}

function finishability(stepId: V1CriticalPathStep, cc: V1CommandCenter): number {
  const base = V1_PHASE_FINISHABILITY_BASE[stepId] ?? 50;
  const status = stepStatus(stepId, cc);
  if (status === "complete") return 100;
  const mod =
    stepId === "executive_office_polish"
      ? cc.modules.find((m) => m.module_id === "executive_office")
      : null;
  if (mod?.certified) return 100;
  if (status === "in_progress") return Math.min(100, base + 4);
  return base;
}

function buildWorkUnits(
  stepId: V1CriticalPathStep,
  phaseRemainingPredicted: number,
  phaseProgress: number,
): V1PhaseWorkUnit[] {
  const defs = V1_PHASE_WORK_UNITS[stepId];
  if (!defs || phaseRemainingPredicted <= 0) return [];

  const completedFraction = phaseProgress / 100;
  return defs.map((def, idx) => {
    const unitStart = defs.slice(0, idx).reduce((s, d) => s + d.weight, 0);
    const unitEnd = unitStart + def.weight;
    let status: V1PhaseForecastStatus = "not_started";
    if (completedFraction >= unitEnd) status = "complete";
    else if (completedFraction > unitStart) status = "in_progress";

    const unitTotalDays = Math.round(phaseRemainingPredicted * def.weight * 10) / 10;
    const unitRemaining =
      status === "complete"
        ? 0
        : status === "in_progress"
          ? Math.round(unitTotalDays * (1 - (completedFraction - unitStart) / def.weight) * 10) / 10
          : unitTotalDays;

    return {
      unit_id: def.unit_id,
      label: def.label,
      estimated_days: unitTotalDays,
      predicted_days: unitRemaining,
      status,
    };
  });
}

function megaPhaseSummary(
  megaId: string,
  label: string,
  steps: V1CriticalPathStep[],
  phaseRows: V1PhaseForecastRow[],
  today: string,
): V1MegaPhaseSummary {
  const rows = steps
    .map((s) => phaseRows.find((p) => p.step_id === s))
    .filter((r): r is V1PhaseForecastRow => r != null);

  const incomplete = rows.filter((r) => r.status !== "complete");
  const estimated = incomplete.reduce((s, r) => s + (r.estimated_days ?? 0), 0);
  const predicted = incomplete.reduce((s, r) => s + (r.predicted_days ?? 0), 0);
  const progress =
    rows.length > 0
      ? Math.round(rows.reduce((s, r) => s + r.progress_percent, 0) / rows.length)
      : 0;
  const finishability =
    rows.length > 0
      ? Math.round(rows.reduce((s, r) => s + r.finishability_percent, 0) / rows.length)
      : 0;

  const allComplete = incomplete.length === 0;
  return {
    mega_phase_id: megaId,
    label,
    progress_percent: allComplete ? 100 : progress,
    estimated_days_remaining: Math.round(estimated * 10) / 10,
    predicted_days_remaining: Math.round(predicted * 10) / 10,
    predicted_completion_date:
      predicted > 0 && !allComplete ? formatDate(addDays(today, predicted)) : allComplete ? "Complete" : null,
    finishability_percent: finishability,
  };
}

function buildReasons(
  cc: V1CommandCenter,
  forecast: V1AdaptiveForecast,
  changes: V1PhaseDayChange[],
): string[] {
  const reasons: string[] = [];
  const eoCert = certifyCurrentModule("executive_office");
  if (eoCert?.launch_status === "certified") {
    reasons.push("✓ Executive Office certified");
  }
  if (forecast.critical_path_velocity.critical_path_moved) {
    reasons.push("✓ Critical path accelerating");
  }
  const histVel = forecast.critical_path_velocity.velocity_percent;
  if (histVel > 10) {
    reasons.push(`✓ Historical velocity +${histVel}%`);
  }
  const lowFinish = changes.find((c) => c.delta_days > 0.5);
  if (lowFinish) {
    reasons.push(`⚠ ${lowFinish.label} estimate extended — ${lowFinish.reason}`);
  } else if (changes.some((c) => c.delta_days < -0.3)) {
    const pulled = changes.find((c) => c.delta_days < -0.3)!;
    reasons.push(`✓ ${pulled.label} pulled in — ${pulled.reason}`);
  } else {
    reasons.push("✓ Remaining work well understood");
  }
  if (reasons.length === 0) reasons.push("Tracking — awaiting critical path movement");
  return reasons;
}

function changeReason(
  phaseId: string,
  delta: number,
  cc: V1CommandCenter,
): string {
  if (delta < -0.3) {
    const finished = cc.finished_yesterday.find((s) =>
      s.toLowerCase().includes(phaseId.replace(/_/g, " ")),
    );
    if (finished) return `${finished.slice(0, 60)} finished ahead of schedule.`;
    return "Critical path velocity exceeded estimate.";
  }
  if (delta > 0.3) {
    if (cc.blocked_summary) return cc.blocked_summary;
    return "Unresolved review findings or scope clarification added.";
  }
  return "Estimate stable.";
}

export function computePhaseForecast(
  state: BuildStateSnapshot,
  cc: V1CommandCenter,
  forecast: V1AdaptiveForecast,
): V1PhaseForecast {
  const today = todayIso();
  const velocityFactor = computeVelocityFactor(state, cc);

  const phases: V1PhaseForecastRow[] = V1_ROADMAP_ITEMS.map((item) => {
    const stepId = item.critical_path_step;
    const status = stepStatus(stepId, cc);
    const progress = stepProgressPercent(stepId, cc);
    const fullEst = V1_BURNDOWN_ESTIMATES_DAYS[stepId];
    const remainingFraction = status === "complete" ? 0 : Math.max(0, 1 - progress / 100);
    const estimatedDays =
      status === "complete" ? null : Math.round(fullEst * remainingFraction * 10) / 10;
    const predictedDays =
      status === "complete"
        ? null
        : Math.round((fullEst * remainingFraction) / velocityFactor * 10) / 10;

    return {
      phase_id: item.id,
      step_id: stepId,
      label: V1_PHASE_DISPLAY_LABELS[item.id] ?? item.label,
      status,
      progress_percent: status === "complete" ? 100 : progress,
      finishability_percent: finishability(stepId, cc),
      estimated_days: estimatedDays,
      predicted_days: predictedDays,
      predicted_completion_date:
        predictedDays != null && predictedDays > 0
          ? formatDate(addDays(today, predictedDays))
          : status === "complete"
            ? "Complete"
            : null,
      work_units: buildWorkUnits(stepId, predictedDays ?? 0, progress),
    };
  });

  let history = readPhaseHistory();
  const todaySnapshot: Record<string, { predicted_days: number; label: string }> = {};
  for (const p of phases) {
    if (p.predicted_days != null) {
      todaySnapshot[p.phase_id] = { predicted_days: p.predicted_days, label: p.label };
    }
  }

  const prevPoint =
    history.find((h) => h.date === yesterdayIso()) ?? history.at(-2) ?? null;

  const todays_changes: V1PhaseDayChange[] = [];
  for (const p of phases) {
    if (p.predicted_days == null) continue;
    const prev = prevPoint?.phases[p.phase_id]?.predicted_days;
    if (prev == null) continue;
    const delta = Math.round((p.predicted_days - prev) * 10) / 10;
    if (Math.abs(delta) < 0.05) continue;
    todays_changes.push({
      phase_id: p.phase_id,
      label: p.label,
      yesterday_predicted_days: prev,
      today_predicted_days: p.predicted_days,
      delta_days: delta,
      reason: changeReason(p.phase_id, delta, cc),
    });
  }

  history = history.filter((h) => h.date !== today);
  history.push({ date: today, phases: todaySnapshot });
  history.sort((a, b) => a.date.localeCompare(b.date));
  if (history.length > 90) history = history.slice(-90);
  writePhaseHistory(history);

  const megaSummaries = V1_MEGA_PHASES.map((mp) =>
    megaPhaseSummary(mp.id, mp.label, mp.steps, phases, today),
  );

  const currentMega =
    megaSummaries.find((m) => m.progress_percent < 100) ?? megaSummaries[megaSummaries.length - 1];
  const currentMegaIdx = megaSummaries.indexOf(currentMega);
  const nextMega =
    currentMegaIdx >= 0 && currentMegaIdx < megaSummaries.length - 1
      ? megaSummaries[currentMegaIdx + 1]
      : null;

  const activePhase = phases.find((p) => p.status === "in_progress") ?? phases.find((p) => p.status === "not_started");

  const reasons = buildReasons(cc, forecast, todays_changes);

  return {
    engine_id: V1_PHASE_FORECAST_ENGINE_ID,
    days_to_commercial_beta: forecast.predicted_days_to_beta,
    predicted_v1_beta_date: forecast.estimated_vs_predicted.predicted_launch_date,
    current_module_label: activePhase?.label ?? cc.building_today,
    current_module_eta_days: activePhase?.predicted_days ?? null,
    current_mega_phase: currentMega,
    next_mega_phase: nextMega,
    confidence_percent: forecast.prediction_confidence_percent,
    reasons,
    phases,
    todays_changes,
    observed_at: new Date().toISOString(),
  };
}
