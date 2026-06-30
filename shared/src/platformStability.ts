/**
 * Platform Stability — ENG-PST-001 (engineering architecture health)
 * Distinct from Platform Readiness (daily use) and Executive Maturity (intelligence).
 */

export type ArchitectureDebtBand = "low" | "medium" | "high";

export const PLATFORM_STABILITY_CORE_RULE =
  "How likely is the platform architecture to require fundamental change?";

export interface PlatformStabilityScoreComponents {
  four_systems_compliance: number;
  foundational_object_integrity: number;
  five_gates_compliance: number;
  migration_lifecycle_complete: number;
  safety_guardrail_compliance: number;
  architecture_debt_inverse: number;
  breaking_redesigns_inverse: number;
}

export interface PlatformStabilityReport {
  engine_id: "ENG-PST-001";
  slice_id: "LB-OS-019.5";
  core_rule: string;
  /** 0–100 — stays high once architecture is locked */
  stability_percent: number;
  components: PlatformStabilityScoreComponents;
  foundational_objects_locked: true;
  architecture_debt_label: ArchitectureDebtBand;
  open_redesign_items: number;
  phase_1_completion_percent: number;
  certification_pipeline_complete: boolean;
  observed_at: string;
  summary: string;
}
