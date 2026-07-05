import type { ExperienceMaturityRow } from "./experienceMaturity.js";
import type { ProjectState } from "./projectState.js";
import type { V1CommandCenter } from "./v1CommandCenter.js";

export type SliceStatus =
  | "complete"
  | "in_progress"
  | "spec_locked"
  | "planned"
  | "not_started";

export type BuildGraphNodeStatus =
  | "planned"
  | "ready"
  | "in_progress"
  | "testing"
  | "committed"
  | "released"
  | "blocked";

export interface EpoCurrentSprint {
  completed: string[];
  in_progress: string[];
  queued: string[];
}

export interface EpoBuildVelocity {
  period_days: number;
  slices_completed: number;
  commits_count: number;
  documents_changed: number;
  loc_count: number;
  tests_count: number;
  average_slice_duration_days: number | null;
}

export interface EpoCoverageBars {
  implementation: number;
  tests: number;
  documentation: number;
  user_guide: number;
  ojt_lesson: number;
}

export interface EpoSliceSummary {
  slice_id: string;
  name: string;
  status: SliceStatus;
  burt_packet_path: string | null;
  spec_doc_path: string | null;
  dependencies: string[];
  coverage: EpoCoverageBars;
  blocker_explanation: string | null;
}

export interface EpoPhaseSummary {
  phase_id: string;
  label: string;
  progress_percent: number;
  total_slices: number;
  completed_slices: number;
  slice_ids: string[];
  objectives: string;
}

export interface EpoDecisionEvent {
  id: string;
  date: string;
  title: string;
  summary: string;
  replaced: string | null;
  impact: string | null;
}

export interface EpoDocEntry {
  path: string;
  title: string;
  category: string;
  version: string | null;
  last_updated: string;
  status: string;
  quick_summary: string;
}

export interface EpoBuildGraphNode {
  slice_id: string;
  status: BuildGraphNodeStatus;
  depends_on: string[];
}

export interface EpoLiveMetrics {
  completed_slices: number;
  remaining_slices: number;
  total_v1_slices: number;
  overall_progress_percent: number;
  document_count: number;
  module_count: number;
  workspace_count: number;
  tests_passing: number | null;
  api_cost_today_usd: number;
  tokens_today: number;
  operational_health_score: number;
  engineering_score: number | null;
}

export interface EpoOverview {
  current_phase_label: string;
  current_slice_id: string | null;
  current_slice_name: string | null;
  next_slice_id: string | null;
  next_slice_name: string | null;
  gate_text: string | null;
  metrics: EpoLiveMetrics;
  phases: EpoPhaseSummary[];
  slices: EpoSliceSummary[];
  build_graph: EpoBuildGraphNode[];
  decisions: EpoDecisionEvent[];
  current_sprint: EpoCurrentSprint;
  build_velocity: EpoBuildVelocity;
  commit_timeline: { hash: string; subject: string; date: string }[];
  build_state_engine_id: string;
  experience_maturity: ExperienceMaturityRow[];
  experience_maturity_engine_id: string;
  v1_command_center: V1CommandCenter;
  project_state: ProjectState;
  governed_platform: import("./operatorReadiness/platformRoadmap.js").GovernedPlatformDashboard | null;
  read_only: true;
  observed_at: string;
}

export interface EpoSliceDetail extends EpoSliceSummary {
  mission: string | null;
  objectives: string[];
  architecture_notes: string | null;
  related_docs: string[];
  recent_commits: { hash: string; subject: string; date: string }[];
  open_decisions: string[];
}
