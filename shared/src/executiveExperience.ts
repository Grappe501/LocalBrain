/** Executive Experience Certification contracts — LB-OS-026.6 */

export const EXECUTIVE_EXPERIENCE_ENGINE_ID = "ENG-EEX-001";
export const EXECUTIVE_EXPERIENCE_COHESION_ENGINE_ID = "ENG-EEC-001";

export interface RegistryCoverageRow {
  source: string;
  route_count: number;
}

export interface ExecutiveExperienceAuditMetrics {
  live_routes: number;
  registered_capabilities: number;
  surface_registry: number;
  sidebar_nav: number;
  dashboard_links: number;
  capability_matrix: number;
  registry_drift: number;
  broken_links: number;
  orphan_capabilities: number;
  dead_ends: number;
  average_click_depth: number;
}

export interface ExecutiveExperienceDimension {
  dimension_id: string;
  label: string;
  pass: boolean;
  score_percent: number;
}

export interface ExecutiveExperienceCertification {
  slice_id: "LB-OS-026.6";
  engine_id: typeof EXECUTIVE_EXPERIENCE_COHESION_ENGINE_ID;
  observed_at: string;
  navigation_pass: boolean;
  cross_link_integrity_pass: boolean;
  route_registry_pass: boolean;
  capability_discovery_pass: boolean;
  workflow_continuity_pass: boolean;
  dead_ends: number;
  average_click_depth: number;
  registry_drift: number;
  broken_links: number;
  certified: boolean;
  metrics: ExecutiveExperienceAuditMetrics;
  coverage: RegistryCoverageRow[];
  dimensions: ExecutiveExperienceDimension[];
  executive_experience_score: number;
  executive_experience_label: "needs_work" | "cohesive" | "certified";
}

export interface ExecutiveExperienceScore {
  engine_id: typeof EXECUTIVE_EXPERIENCE_ENGINE_ID;
  overall_percent: number;
  label: "needs_work" | "cohesive" | "certified";
  findability_percent: number;
  navigation_percent: number;
  workflow_continuity_percent: number;
  context_preservation_percent: number;
  dead_ends: number;
}

export interface JourneyStep {
  route: string;
  capability_id: string;
  reachable_via: string[];
}

export interface JourneyTestResult {
  test_id: string;
  pass: boolean;
  steps: JourneyStep[];
  missing_steps: string[];
}

export interface GraphIntegrityViolation {
  check_id: string;
  message: string;
  entity_id?: string;
}

export interface GraphIntegrityCertification {
  slice_id: "LB-OS-026.6";
  engine_id: "ENG-CAP-001";
  observed_at: string;
  certified: boolean;
  violations: GraphIntegrityViolation[];
  checks_passed: number;
  checks_total: number;
}
