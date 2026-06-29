/**
 * Platform Readiness — LB-OS-026.5 · ENG-PRS-001
 * Airworthiness certificate before Phase 2 — distinct from build progress.
 */

import type { LiveSurfaceSmokeReport } from "./liveSurface.js";

export type ReadinessAreaStatus = "complete" | "partial" | "planned" | "blocked";

export interface ReadinessDashboardRow {
  area_id: string;
  label: string;
  status: ReadinessAreaStatus;
  display: string;
  detail: string;
}

export type PlatformSystemId =
  | "executive_os"
  | "executive_memory"
  | "executive_intelligence"
  | "executive_evolution";

export interface PlatformSystemOwnershipRow {
  system_id: PlatformSystemId;
  label: string;
  status: ReadinessAreaStatus;
  implemented_features: string[];
  owner_confirmed: boolean;
}

export interface MigrationPipelineStage {
  stage_id: string;
  label: string;
  slice_id: string;
  complete: boolean;
}

export interface PlatformReadinessScoreComponents {
  architecture_stability: number;
  test_health: number;
  documentation_completeness: number;
  live_surface_coverage: number;
  integration_cohesion: number;
  technical_debt: number;
  open_blockers: number;
}

export type PlatformReadinessLabel =
  | "not_ready"
  | "release_candidate"
  | "daily_use_ready";

export interface PlatformReadinessScore {
  percent: number;
  label: PlatformReadinessLabel;
  components: PlatformReadinessScoreComponents;
  summary: string;
}

export interface PlaceholderRouteEntry {
  route: string;
  label: string;
  stub_sections: string[];
  clearly_marked: boolean;
}

export interface PlatformReadinessReport {
  slice_id: "LB-OS-026.5";
  engine_id: "ENG-PRS-001";
  stability_engine_id: "ENG-PST-001";
  read_only: true;
  core_rule: string;
  executive_os_version: "v1.0-rc";
  freeze_policy: string;
  readiness_dashboard: ReadinessDashboardRow[];
  platform_readiness_score: PlatformReadinessScore;
  platform_stability_percent: number;
  route_smoke: LiveSurfaceSmokeReport;
  integration_targets_met: boolean;
  orphan_routes: string[];
  migration_pipeline_complete: boolean;
  migration_pipeline_stages: MigrationPipelineStage[];
  placeholder_routes: PlaceholderRouteEntry[];
  placeholder_route_count: number;
  documentation_coverage_percent: number;
  test_coverage_percent: number;
  five_gates_compliance_percent: number;
  platform_systems: PlatformSystemOwnershipRow[];
  executive_questions_total: number;
  executive_questions_authoritative: number;
  recommended_phase_2_sequence: string[];
  certification_passed: boolean;
  observed_at: string;
}

export const PLATFORM_READINESS_ENGINE_ID = "ENG-PRS-001";

export const PLATFORM_READINESS_CORE_RULE =
  "Is LocalBrain ready for daily use? — Platform Readiness Score, not build progress alone.";

export const EXECUTIVE_OS_V1_FREEZE_POLICY =
  "Executive OS v1.0 — Architecture Frozen after LB-OS-026.5. Only bug fixes and polish. No foundational changes.";

export const RECOMMENDED_PHASE_2_SEQUENCE = [
  "LB-OS-026.5 Phase 1 Certification",
  "LB-OS-027 Teach the Brain",
  "LB-OS-028 Executive Memory OS",
  "LB-OS-029 Memory Recall Engine",
  "LB-OS-030 Executive Context Window",
  "LB-OS-031 Executive Mission Stack",
  "LB-OS-032 Attention Budget",
  "LB-OS-033 Executive Question Router",
  "LB-OS-034 Mission Completion Probability",
  "LB-OS-035 System Evolution",
];
