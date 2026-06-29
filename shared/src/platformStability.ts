/**
 * Platform Stability — EPO leading indicator (ENG-PST-001)
 * Answers: "How likely is it that we'll have to redesign the platform?"
 */

export type ArchitectureDebtBand = "low" | "medium" | "high";

export interface PlatformStabilityReport {
  engine_id: "ENG-PST-001";
  slice_id: "LB-OS-019.5";
  /** 0–100 — rises as Phase 1 closes and foundational objects stay locked */
  stability_percent: number;
  foundational_objects_locked: true;
  architecture_debt_label: ArchitectureDebtBand;
  open_redesign_items: number;
  phase_1_completion_percent: number;
  certification_pipeline_complete: boolean;
  observed_at: string;
  summary: string;
}
