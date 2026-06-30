/**
 * Platform Readiness — LB-OS-026.5 · ENG-PRS-001
 * Airworthiness certificate before Phase 2 — distinct from build progress.
 */

import type { LiveSurfaceSmokeReport } from "./liveSurface.js";
import type { PlatformStabilityReport } from "./platformStability.js";

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
  live_surface_completion: number;
  placeholder_removal: number;
  documentation_coverage: number;
  test_health: number;
  ux_cohesion: number;
  integration_quality: number;
  open_critical_bugs_inverse: number;
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

export interface PlatformMetricHeadline {
  metric_id:
    | "platform_stability"
    | "platform_readiness"
    | "executive_maturity"
    | "architecture_volatility";
  label: string;
  percent: number;
  meaning: string;
}

export interface ExecutiveMaturityDomain {
  domain_id: PlatformSystemId;
  label: string;
  percent: number;
  status: ReadinessAreaStatus;
}

export interface ExecutiveMaturityReport {
  engine_id: "ENG-EMT-001";
  core_rule: string;
  overall_percent: number;
  domains: ExecutiveMaturityDomain[];
  observed_at: string;
  summary: string;
}

export interface ArchitectureVolatilityReport {
  engine_id: "ENG-AV-001";
  core_rule: string;
  /** 0–100 — lower is better (less redesign risk) */
  volatility_percent: number;
  open_redesign_slices: number;
  stub_surface_count: number;
  in_progress_slices: number;
  foundational_objects_locked: boolean;
  observed_at: string;
  summary: string;
}

export interface PlatformReadinessReport {
  slice_id: "LB-OS-026.5";
  engine_id: "ENG-PRS-001";
  stability_engine_id: "ENG-PST-001";
  maturity_engine_id: "ENG-EMT-001";
  volatility_engine_id: "ENG-AV-001";
  read_only: true;
  core_rule: string;
  executive_os_version: "v1.0-rc";
  freeze_policy: string;
  platform_metric_headlines: PlatformMetricHeadline[];
  platform_stability: PlatformStabilityReport;
  platform_readiness_score: PlatformReadinessScore;
  executive_maturity: ExecutiveMaturityReport;
  architecture_volatility: ArchitectureVolatilityReport;
  readiness_dashboard: ReadinessDashboardRow[];
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
export const EXECUTIVE_MATURITY_ENGINE_ID = "ENG-EMT-001";
export const ARCHITECTURE_VOLATILITY_ENGINE_ID = "ENG-AV-001";

export const PLATFORM_READINESS_CORE_RULE =
  "Can I comfortably use this every day? — Platform Readiness, not architecture stability.";

export const EXECUTIVE_MATURITY_CORE_RULE =
  "How intelligent has the system become? — Memory, Mission Stack, and Evolution are Phase 2+.";

export const ARCHITECTURE_VOLATILITY_CORE_RULE =
  "If we stopped development today, how much of this platform would likely be redesigned?";

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
