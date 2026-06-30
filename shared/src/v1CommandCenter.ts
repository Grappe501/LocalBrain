/**
 * V1 Live Build Command Center — construction as observable product (ENG-BLD-001 extension)
 * Program Office answers: version, today's work, blockers, yesterday, time to V1.
 */

export const V1_COMMAND_CENTER_ENGINE_ID = "ENG-BLD-001-V1CC";

export const V1_CRITICAL_PATH = [
  "executive_office_polish",
  "peer_review_session_4",
  "peer_review_session_5",
  "theory_v1_freeze",
  "executive_epistemology_convention",
  "empty_brain_factory",
  "memory_os",
  "communications_office",
  "commercial_beta",
] as const;

export type V1CriticalPathStep = (typeof V1_CRITICAL_PATH)[number];

export const V1_CRITICAL_PATH_LABELS: Record<V1CriticalPathStep, string> = {
  executive_office_polish: "Executive Office polish",
  peer_review_session_4: "Peer Review Session 4",
  peer_review_session_5: "Peer Review Session 5",
  theory_v1_freeze: "Theory v1.0 freeze",
  executive_epistemology_convention: "Executive Epistemology Convention",
  empty_brain_factory: "Empty Brain Factory",
  memory_os: "Memory OS",
  communications_office: "Communications Office",
  commercial_beta: "Commercial beta",
};

/** Critical-path burn-down estimates (days) — revised by Program Office from git velocity. */
export const V1_BURNDOWN_ESTIMATES_DAYS: Record<V1CriticalPathStep, number> = {
  executive_office_polish: 2,
  peer_review_session_4: 1,
  peer_review_session_5: 1,
  theory_v1_freeze: 0.5,
  executive_epistemology_convention: 4,
  empty_brain_factory: 10,
  memory_os: 20,
  communications_office: 15,
  commercial_beta: 5,
};

/** Weighted V1 launch readiness — critical path only, not total backlog. */
export const V1_LAUNCH_WEIGHTS = {
  executive_office: 0.1,
  theory_convention: 0.15,
  factory: 0.2,
  memory_os: 0.3,
  communications: 0.2,
  documentation_beta: 0.05,
} as const;

export type V1LaunchWeightArea = keyof typeof V1_LAUNCH_WEIGHTS;

export const V1_MODULE_COMPLETENESS_RULE =
  "No module is complete until demonstrably testable in isolation — demo screen, test suite, readiness indicator, pass/fail certification.";

/** Formal environments — Kelly gets Production, Sandbox, and Factory brains. */
export const LOCALBRAIN_ENVIRONMENTS = [
  "development",
  "integration",
  "beta",
  "production",
] as const;

export type LocalBrainEnvironment = (typeof LOCALBRAIN_ENVIRONMENTS)[number];

export const KELLY_BRAIN_ENVIRONMENTS = [
  "production_brain",
  "sandbox_brain",
  "factory_brain",
] as const;

export const SANDBOX_ISOLATION_RULE =
  "Kelly production data never enters development directly. Flow: Production → sanitized snapshot → isolated sandbox (separate DB, keys, storage, comms credentials). No real outbound messages from dev.";

export type V1ModuleLifecycleStatus =
  | "complete"
  | "in_progress"
  | "waiting"
  | "not_started"
  | "blocked";

export interface V1ModuleRow {
  module_id: string;
  name: string;
  version: string;
  progress_percent: number;
  status: V1ModuleLifecycleStatus;
  eta_label: string;
  owner: string | null;
  blockers: string;
  tests_label: string;
  weight_area: V1LaunchWeightArea;
  certified: boolean;
}

export interface V1DependencyNode {
  step_id: V1CriticalPathStep;
  label: string;
  status: V1ModuleLifecycleStatus;
  blocked_by: V1CriticalPathStep | null;
}

export interface V1BurndownRow {
  step_id: V1CriticalPathStep;
  label: string;
  estimated_days: number;
  status: V1ModuleLifecycleStatus;
}

export interface V1LaunchReadinessBreakdown {
  area: V1LaunchWeightArea;
  label: string;
  weight_percent: number;
  module_progress_percent: number;
  weighted_contribution: number;
}

export interface V1CommandCenter {
  engine_id: typeof V1_COMMAND_CENTER_ENGINE_ID;
  product_version: string;
  implementation_mode: true;
  building_today: string | null;
  blocked_summary: string | null;
  finished_yesterday: string[];
  days_to_v1_estimate: number | null;
  v1_launch_score_percent: number;
  critical_path: V1DependencyNode[];
  modules: V1ModuleRow[];
  burndown: V1BurndownRow[];
  launch_breakdown: V1LaunchReadinessBreakdown[];
  environments: LocalBrainEnvironment[];
  sandbox_rule: string;
  module_completeness_rule: string;
  observed_at: string;
}
