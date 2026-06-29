/**
 * Migration Cutover — LB-OS-026 · ENG-CUT-001
 * Controlled Phase 1 closing gate: execute approved cutover only, verify before projection updates.
 */

import type { MigrationOperationKind } from "./migrationPlan.js";
import type { PlanRiskLabel } from "./planningEngine.js";

export type CutoverRunStatus =
  | "preflight_ok"
  | "running"
  | "verifying"
  | "completed"
  | "failed"
  | "rolled_back";

export type CutoverStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "skipped"
  | "failed"
  | "deferred";

export type FailureRecoveryStatus =
  | "none"
  | "recoverable"
  | "rollback_available"
  | "rollback_in_progress"
  | "rollback_complete"
  | "manual_intervention";

export type VerificationCheckStatus = "pass" | "warn" | "fail";

export interface CutoverProvenance {
  audit_ref: string | null;
  survey_ref: string | null;
  certificate_id: string;
  simulation_id: string;
  plan_id: string;
  approval_id: string;
  cutover_id: string;
}

export interface CutoverExecutionStep {
  step_index: number;
  operation_id: string;
  kind: MigrationOperationKind;
  label: string;
  workspace_id: string;
  status: CutoverStepStatus;
  critical: boolean;
  detail: string;
  physical_path: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface CutoverVerificationCheck {
  check_id: string;
  label: string;
  status: VerificationCheckStatus;
  detail: string;
}

export interface CutoverRollbackStep {
  step_id: string;
  label: string;
  status: "pending" | "completed" | "failed" | "skipped";
  detail: string;
}

export interface PersonalOsLaunchChecklistItem {
  item_id: string;
  label: string;
  required: boolean;
  complete: boolean;
}

export interface Phase1LaunchReport {
  cutover_id: string;
  phase: "Phase 1 — Personal OS launch gate";
  personal_os_ready: boolean;
  operations_completed: number;
  operations_failed: number;
  projections_updated: number;
  verification_passed: boolean;
  failure_recovery_status: FailureRecoveryStatus;
  provenance: CutoverProvenance;
  summary: string;
  generated_at: string;
}

export interface MigrationCutoverRun {
  cutover_id: string;
  slice_id: "LB-OS-026";
  engine_id: "ENG-CUT-001";
  read_only: true;
  status: CutoverRunStatus;
  approval_id: string;
  plan_id: string;
  action_id: string;
  certificate_id: string;
  workspace_ids: string[];
  provenance: CutoverProvenance;
  plan_summary: {
    variant_label: string;
    risk_label: PlanRiskLabel;
    total_operations: number;
    rollback_steps: number;
  };
  staging_root: string;
  execution_log: CutoverExecutionStep[];
  verification_checks: CutoverVerificationCheck[];
  rollback_package: CutoverRollbackStep[];
  projections_updated: boolean;
  projection_updates: { workspace_id: string; from_root: string | null; to_root: string }[];
  failure_recovery_status: FailureRecoveryStatus;
  phase_1_launch_report: Phase1LaunchReport | null;
  personal_os_launch_checklist: PersonalOsLaunchChecklistItem[];
  critical_failure: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface MigrationCutoverOverview {
  slice_id: "LB-OS-026";
  engine_id: "ENG-CUT-001";
  read_only: true;
  core_rule: string;
  verification_rule: string;
  guardrails: string[];
  recent_runs: MigrationCutoverRun[];
  completed_count: number;
  observed_at: string;
}

export interface CutoverPreflightCheck {
  check_id: string;
  label: string;
  status: VerificationCheckStatus;
  detail: string;
}

export interface CutoverPreflightResult {
  approval_id: string;
  plan_id: string;
  ready: boolean;
  checks: CutoverPreflightCheck[];
  observed_at: string;
}

export interface CutoverRunRequest {
  approval_id: string;
}

export interface CutoverRollbackRequest {
  cutover_id: string;
  reason?: string;
}

export const MIGRATION_CUTOVER_ENGINE_ID = "ENG-CUT-001";

export const MIGRATION_CUTOVER_CORE_RULE =
  "Execution changes the Physical World — only approved migration_cutover actions with ready_for_cutover packages.";

export const MIGRATION_CUTOVER_VERIFICATION_RULE =
  "Verification decides whether Logical World projections may be updated.";
