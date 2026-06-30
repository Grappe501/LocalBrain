/**
 * Program Office project state — single source of truth for all build observability (ENG-BLD-001-PSTATE)
 */

import type { V1CommandCenter, V1DependencyNode } from "./v1CommandCenter.js";
import type { CeoModeBrief } from "./v1Roadmap.js";
import type { V1AdaptiveForecast } from "./v1Forecast.js";

export const PROJECT_STATE_ENGINE_ID = "ENG-BLD-001-PSTATE";

export interface LaunchCountdown {
  product_label: string;
  current_phase: string;
  overall_progress_percent: number;
  critical_path_remaining_days: number | null;
  modules_remaining: number;
  modules_certified: number;
  open_critical_bugs: number;
  architecture_status: "FROZEN" | "OPEN";
  target: string;
}

export interface BuildHistoryDay {
  iso_date: string;
  date_label: string;
  entries: string[];
}

export interface FactoryEnvironmentModel {
  factory_template: string;
  sandbox_brains: string[];
  production_brains: string[];
  rule: string;
}

/** Canonical project state — every dashboard reads from this object. */
export interface ProjectState {
  engine_id: typeof PROJECT_STATE_ENGINE_ID;
  current_version: string;
  build_number: number | null;
  git_commit: string;
  launch_score_percent: number;
  current_phase: string;
  current_module: string | null;
  current_burt_packet: string | null;
  critical_path: V1DependencyNode[];
  overall_eta_days: number | null;
  /** Project heartbeat — critical path days to Commercial Beta. */
  days_to_beta: number | null;
  todays_objective: string | null;
  yesterdays_progress: string[];
  blockers: string | null;
  certification_status: string;
  ceo_mode: CeoModeBrief;
  launch_countdown: LaunchCountdown;
  build_history: BuildHistoryDay[];
  factory_environments: FactoryEnvironmentModel;
  command_center: V1CommandCenter;
  adaptive_forecast: V1AdaptiveForecast;
  observed_at: string;
}

export const FACTORY_ENVIRONMENT_MODEL: FactoryEnvironmentModel = {
  factory_template: "Factory Template",
  sandbox_brains: [
    "Steve Sandbox",
    "Kelly Sandbox",
    "Chris Sandbox",
    "Future Customer Sandboxes",
  ],
  production_brains: ["Steve Production", "Kelly Production", "Chris Production"],
  rule: "Sandboxes are disposable. Production brains are protected.",
};

export const SANDBOX_FLOW_RULE =
  "Production → sanitized snapshot → isolated sandbox (separate DB, keys, storage, comms). No real outbound messages from dev.";
