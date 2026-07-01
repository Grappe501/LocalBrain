import type {
  V1BurndownRow,
  V1CommandCenter,
  V1CriticalPathStep,
  V1DependencyNode,
  V1LaunchReadinessBreakdown,
  V1LaunchWeightArea,
  V1ModuleLifecycleStatus,
  V1ModuleRow,
} from "@localbrain/shared";
import {
  KELLY_BRAIN_ENVIRONMENTS,
  LOCALBRAIN_ENVIRONMENTS,
  SANDBOX_ISOLATION_RULE,
  V1_BURNDOWN_ESTIMATES_DAYS,
  V1_COMMAND_CENTER_ENGINE_ID,
  V1_CRITICAL_PATH,
  V1_CRITICAL_PATH_LABELS,
  V1_LAUNCH_WEIGHTS,
  V1_MODULE_COMPLETENESS_RULE,
} from "@localbrain/shared";
import fs from "node:fs";
import path from "node:path";
import type { BuildStateSnapshot } from "./buildStateEngine.js";
import { getCommitCount, getRecentCommits } from "./gitMetrics.js";
import { certifyCurrentModule } from "./moduleCertificationEngine.js";
import { parsePeerReviewProgress } from "../epo/checklistParser.js";
import { getRepoRoot } from "../db/repoRoot.js";

/** Map V1 weight areas to module rows. */
const MODULE_DEFS: {
  module_id: string;
  name: string;
  version: string;
  weight_area: V1LaunchWeightArea;
  owner: string | null;
  path_steps: V1CriticalPathStep[];
  slice_ids: string[];
  test_globs: string[];
}[] = [
  {
    module_id: "executive_office",
    name: "Executive Office",
    version: "1.7",
    weight_area: "executive_office",
    owner: "Burt",
    path_steps: ["executive_office_polish"],
    slice_ids: ["LB-OS-026.7"],
    test_globs: [
      "backend/src/certification/executiveBriefing.test.ts",
      "backend/src/certification/executiveOffice.test.ts",
      "backend/src/certification/executiveExperience.test.ts",
    ],
  },
  {
    module_id: "theory_convention",
    name: "Theory & Convention",
    version: "1.0",
    weight_area: "theory_convention",
    owner: null,
    path_steps: [
      "peer_review_session_4",
      "peer_review_session_5",
      "theory_v1_freeze",
      "executive_epistemology_convention",
    ],
    slice_ids: [],
    test_globs: ["backend/src/certification/executiveIntentGraph.test.ts"],
  },
  {
    module_id: "factory",
    name: "Empty Brain Factory",
    version: "0.1",
    weight_area: "factory",
    owner: null,
    path_steps: ["empty_brain_factory"],
    slice_ids: ["LB-OS-PROD-001", "LB-OS-PROD-010"],
    test_globs: [
      "backend/src/factory/factoryService.test.ts",
      "backend/src/factory/factoryPackage.test.ts",
    ],
  },
  {
    module_id: "memory_os",
    name: "Memory OS",
    version: "0.2",
    weight_area: "memory_os",
    owner: null,
    path_steps: ["memory_os"],
    slice_ids: ["LB-OS-027"],
    test_globs: [],
  },
  {
    module_id: "communications",
    name: "Communications Office",
    version: "0.0",
    weight_area: "communications",
    owner: null,
    path_steps: ["communications_office"],
    slice_ids: [],
    test_globs: [],
  },
  {
    module_id: "documentation_beta",
    name: "Documentation & Beta",
    version: "0.0",
    weight_area: "documentation_beta",
    owner: null,
    path_steps: ["commercial_beta"],
    slice_ids: [],
    test_globs: [],
  },
];

function countTestsInGlobs(relativePaths: string[]): { total: number; files: number } {
  const root = getRepoRoot();
  let total = 0;
  let files = 0;
  for (const rel of relativePaths) {
    const full = path.join(root, rel.replace(/\//g, path.sep));
    if (!fs.existsSync(full)) continue;
    files += 1;
    const text = fs.readFileSync(full, "utf8");
    total += (text.match(/\btest\s*\(/g) ?? []).length;
  }
  return { total, files };
}

function sliceProgress(state: BuildStateSnapshot, sliceIds: string[]): number {
  if (sliceIds.length === 0) return 0;
  let sum = 0;
  let n = 0;
  for (const id of sliceIds) {
    const s = state.slices.find((x) => x.slice_id === id);
    if (!s) continue;
    n += 1;
    if (s.status === "complete") sum += 100;
    else {
      const c = s.coverage;
      sum += Math.round(
        (c.implementation + c.tests + c.documentation) / 3,
      );
    }
  }
  return n > 0 ? Math.round(sum / n) : 0;
}

function theoryStepStatus(
  step: V1CriticalPathStep,
  pr: ReturnType<typeof parsePeerReviewProgress>,
): V1ModuleLifecycleStatus | null {
  switch (step) {
    case "peer_review_session_4":
      if (pr.s4 === "complete") return "complete";
      if (pr.s4 === "in_progress") return "in_progress";
      return null;
    case "peer_review_session_5":
      if (pr.s5 === "complete") return "complete";
      if (pr.s5 === "in_progress") return "in_progress";
      return null;
    case "theory_v1_freeze":
      if (pr.theory_frozen) return "complete";
      if (pr.s5 === "complete") return "in_progress";
      return null;
    case "executive_epistemology_convention":
      if (pr.convention === "complete") return "complete";
      if (pr.convention === "in_progress" || pr.convention === "spec_locked") return "in_progress";
      return null;
    default:
      return null;
  }
}

function theoryConventionProgress(pr: ReturnType<typeof parsePeerReviewProgress>): number {
  let p = 0;
  if (pr.s4 === "complete") p += 20;
  if (pr.s5 === "complete") p += 20;
  if (pr.theory_frozen) p += 20;
  if (pr.convention === "complete") p += 40;
  else if (pr.convention === "in_progress" || pr.convention === "spec_locked") p += 10;
  return p;
}

function stepStatus(
  step: V1CriticalPathStep,
  state: BuildStateSnapshot,
  moduleProgress: Map<string, number>,
): V1ModuleLifecycleStatus {
  const pr = parsePeerReviewProgress();
  const theoryStatus = theoryStepStatus(step, pr);
  if (theoryStatus) return theoryStatus;

  const def = MODULE_DEFS.find((m) => m.path_steps.includes(step));
  if (!def) return "not_started";

  const idx = V1_CRITICAL_PATH.indexOf(step);
  const prior = V1_CRITICAL_PATH.slice(0, idx);
  for (const p of prior) {
    const priorDef = MODULE_DEFS.find((m) => m.path_steps.includes(p));
    if (priorDef && (moduleProgress.get(priorDef.module_id) ?? 0) < 100) {
      if (priorDef.path_steps[priorDef.path_steps.length - 1] === p) {
        return step === V1_CRITICAL_PATH[idx] ? "waiting" : "not_started";
      }
    }
  }

  const prog = moduleProgress.get(def.module_id) ?? 0;
  if (prog >= 100) return "complete";
  if (state.current_slice_id?.includes("026.7") && step === "executive_office_polish") return "in_progress";
  if (step === "executive_office_polish" && prog > 0) return "in_progress";
  if (prog > 0) return "in_progress";
  if (idx > 0) return "waiting";
  return "not_started";
}

function moduleStatus(progress: number, blockers: string): V1ModuleLifecycleStatus {
  if (progress >= 100) return "complete";
  if (blockers && blockers !== "None") return "blocked";
  if (progress > 0) return "in_progress";
  return "not_started";
}

function moduleBlockers(
  moduleId: string,
  state: BuildStateSnapshot,
  moduleProgress: Map<string, number>,
): string {
  const def = MODULE_DEFS.find((m) => m.module_id === moduleId);
  if (!def) return "None";
  const firstStep = def.path_steps[0];
  const stepIdx = V1_CRITICAL_PATH.indexOf(firstStep);
  if (stepIdx <= 0) return "None";
  for (let i = 0; i < stepIdx; i++) {
    const priorStep = V1_CRITICAL_PATH[i];
    const priorDef = MODULE_DEFS.find((m) => m.path_steps.includes(priorStep));
    if (!priorDef) continue;
    if ((moduleProgress.get(priorDef.module_id) ?? 0) < 100) {
      return V1_CRITICAL_PATH_LABELS[priorStep];
    }
  }
  for (const id of def.slice_ids) {
    const s = state.slices.find((x) => x.slice_id === id);
    if (s?.blocker_explanation) return s.blocker_explanation.slice(0, 80);
  }
  return "None";
}

function etaLabel(status: V1ModuleLifecycleStatus, days: number): string {
  if (status === "complete") return "Done";
  if (status === "waiting") return "Waiting";
  if (days < 1) return `${Math.round(days * 24)}h`;
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  const weeks = Math.round(days / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"}`;
}

function finishedYesterday(state: BuildStateSnapshot): string[] {
  const commits = getRecentCommits(30);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  return commits
    .filter((c) => c.date === yStr || (c.date === today && state.current_sprint.completed.length > 0))
    .slice(0, 5)
    .map((c) => c.subject);
}

function productVersion(): string {
  const count = getCommitCount();
  const head = getRecentCommits(1)[0]?.hash ?? "dev";
  return `V1-implement · ${head}${count != null ? ` · ${count} commits` : ""}`;
}

export function computeV1CommandCenter(state: BuildStateSnapshot): V1CommandCenter {
  const peerReview = parsePeerReviewProgress();
  const moduleProgress = new Map<string, number>();
  for (const def of MODULE_DEFS) {
    let progress = sliceProgress(state, def.slice_ids);
    if (def.module_id === "executive_office") {
      progress = Math.max(progress, 55);
      const eoCert = certifyCurrentModule("executive_office");
      if (eoCert?.launch_status === "certified") progress = 100;
    }
    if (def.module_id === "factory") {
      progress = Math.max(progress, sliceProgress(state, ["LB-OS-PROD-001"]));
    }
    if (def.module_id === "theory_convention") {
      progress = Math.max(progress, theoryConventionProgress(peerReview));
    }
    moduleProgress.set(def.module_id, Math.min(progress, 100));
  }

  const modules: V1ModuleRow[] = MODULE_DEFS.map((def) => {
    const progress = moduleProgress.get(def.module_id) ?? 0;
    const blockers = moduleBlockers(def.module_id, state, moduleProgress);
    const status = moduleStatus(progress, blockers);
    const estDays = def.path_steps.reduce((s, step) => s + V1_BURNDOWN_ESTIMATES_DAYS[step], 0);
    const tests = countTestsInGlobs(def.test_globs);
    const testsLabel = tests.total > 0 ? `${tests.total}/${tests.total}` : tests.files > 0 ? `${tests.files} files` : "0/0";
    const eoCert =
      def.module_id === "executive_office" ? certifyCurrentModule("executive_office") : null;
    const moduleCertified =
      eoCert?.launch_status === "certified" && eoCert.certification_locked
        ? true
        : progress >= 100 && tests.total > 0;

    return {
      module_id: def.module_id,
      name: def.name,
      version: def.version,
      progress_percent: progress,
      status: eoCert?.regression_detected ? "in_progress" : status,
      eta_label: etaLabel(status, estDays),
      owner: def.owner,
      blockers: eoCert?.regression_detected
        ? ["REGRESSION — module failed re-certification"]
        : blockers,
      tests_label: testsLabel,
      weight_area: def.weight_area,
      certified: moduleCertified,
    };
  });

  const critical_path: V1DependencyNode[] = V1_CRITICAL_PATH.map((step_id, idx) => {
    const status = stepStatus(step_id, state, moduleProgress);
    let blocked_by: V1CriticalPathStep | null = null;
    if (status === "waiting" || status === "not_started") {
      for (let i = idx - 1; i >= 0; i--) {
        const prior = V1_CRITICAL_PATH[i];
        const priorDef = MODULE_DEFS.find((m) => m.path_steps.includes(prior));
        if (priorDef && (moduleProgress.get(priorDef.module_id) ?? 0) < 100) {
          blocked_by = prior;
          break;
        }
      }
    }
    return {
      step_id,
      label: V1_CRITICAL_PATH_LABELS[step_id],
      status,
      blocked_by,
    };
  });

  const burndown: V1BurndownRow[] = V1_CRITICAL_PATH.map((step_id) => ({
    step_id,
    label: V1_CRITICAL_PATH_LABELS[step_id],
    estimated_days: V1_BURNDOWN_ESTIMATES_DAYS[step_id],
    status: stepStatus(step_id, state, moduleProgress),
  }));

  const launch_breakdown: V1LaunchReadinessBreakdown[] = (
    Object.keys(V1_LAUNCH_WEIGHTS) as V1LaunchWeightArea[]
  ).map((area) => {
    const mod = modules.find((m) => m.weight_area === area);
    const weight = V1_LAUNCH_WEIGHTS[area];
    const module_progress = mod?.progress_percent ?? 0;
    return {
      area,
      label: mod?.name ?? area,
      weight_percent: Math.round(weight * 100),
      module_progress_percent: module_progress,
      weighted_contribution: Math.round(module_progress * weight),
    };
  });

  const v1_launch_score_percent = launch_breakdown.reduce(
    (s, r) => s + r.weighted_contribution,
    0,
  );

  const remainingDays = burndown
    .filter((b) => b.status !== "complete")
    .reduce((s, b) => s + b.estimated_days, 0);

  const buildingToday =
    state.current_slice_name ??
    critical_path.find((c) => c.status === "in_progress")?.label ??
    null;

  const blockedNode = critical_path.find((c) => c.status === "waiting" || c.status === "blocked");
  const blocked_summary = blockedNode
    ? blockedNode.blocked_by
      ? `${blockedNode.label} blocked by ${V1_CRITICAL_PATH_LABELS[blockedNode.blocked_by]}`
      : `${blockedNode.label} blocked`
    : null;

  return {
    engine_id: V1_COMMAND_CENTER_ENGINE_ID,
    product_version: productVersion(),
    implementation_mode: true,
    building_today: buildingToday,
    blocked_summary,
    finished_yesterday: finishedYesterday(state),
    days_to_v1_estimate: remainingDays > 0 ? Math.round(remainingDays * 10) / 10 : null,
    v1_launch_score_percent,
    critical_path,
    modules,
    burndown,
    launch_breakdown,
    environments: [...LOCALBRAIN_ENVIRONMENTS],
    sandbox_rule: SANDBOX_ISOLATION_RULE,
    module_completeness_rule: V1_MODULE_COMPLETENESS_RULE,
    observed_at: new Date().toISOString(),
  };
}

export { KELLY_BRAIN_ENVIRONMENTS };
