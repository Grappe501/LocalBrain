/**
 * Executive Migration Approval — LB-OS-025 · ENG-APR-001
 * Converts ready_for_proposal plans into formal approval packages.
 */

import type { PlanRiskLabel, PlanVariantStrategy } from "./planningEngine.js";

export type MigrationApprovalStatus = "pending" | "signed" | "rejected" | "superseded";

export interface SignOffChecklistItem {
  item_id: string;
  label: string;
  required: boolean;
  checked: boolean;
}

export interface RiskAcknowledgement {
  risk_label: PlanRiskLabel;
  plan_quality_percent: number;
  total_operations: number;
  estimated_duration_minutes: number;
  acknowledged: boolean;
  acknowledged_at: string | null;
}

export interface RollbackAcknowledgement {
  rollback_duration_minutes: number;
  rollback_step_count: number;
  acknowledged: boolean;
  acknowledged_at: string | null;
}

/** AUD → SUR → CERT → PLAN → APPR */
export interface MigrationApprovalProvenance {
  audit_ref: string | null;
  survey_ref: string | null;
  certificate_id: string;
  simulation_id: string;
  plan_id: string;
  approval_id: string;
}

export interface MigrationApprovalPlanSummary {
  plan_quality_percent: number;
  risk_label: PlanRiskLabel;
  total_operations: number;
  estimated_duration_minutes: number;
  rollback_duration_minutes: number;
  variant_strategy: PlanVariantStrategy;
  variant_label: string;
}

/** Formal executive approval package — references MigrationPlan only. */
export interface MigrationApprovalPackage {
  approval_id: string;
  slice_id: "LB-OS-025";
  engine_id: "ENG-APR-001";
  actions_engine_ref: "LB-OS-010";
  read_only: true;
  status: MigrationApprovalStatus;
  plan_id: string;
  certificate_id: string;
  workspace_ids: string[];
  title: string;
  provenance: MigrationApprovalProvenance;
  checklist: SignOffChecklistItem[];
  risk_acknowledgement: RiskAcknowledgement;
  rollback_acknowledgement: RollbackAcknowledgement;
  plan_summary: MigrationApprovalPlanSummary;
  /** Linked LB-OS-010 proposed action — approval gate integration */
  action_id: string | null;
  /** True when signed with full checklist, risk, and rollback acknowledgement */
  ready_for_cutover: boolean;
  signed_at: string | null;
  signed_by: string | null;
  rejected_at: string | null;
  rejected_by: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface MigrationApprovalOverview {
  slice_id: "LB-OS-025";
  engine_id: "ENG-APR-001";
  actions_engine_ref: "LB-OS-010";
  read_only: true;
  core_rule: string;
  guardrails: string[];
  recent_approvals: MigrationApprovalPackage[];
  pending_count: number;
  signed_count: number;
  observed_at: string;
}

export interface MigrationApprovalCreateRequest {
  plan_id: string;
  requested_by?: string;
}

export interface MigrationApprovalCreateResponse {
  approval: MigrationApprovalPackage;
}

export interface MigrationApprovalSignRequest {
  signed_by: string;
  checklist: { item_id: string; checked: boolean }[];
  risk_acknowledged: boolean;
  rollback_acknowledged: boolean;
}

export interface MigrationApprovalRejectRequest {
  reason?: string;
  rejected_by?: string;
}

export const MIGRATION_APPROVAL_ENGINE_ID = "ENG-APR-001";

export const MIGRATION_APPROVAL_CORE_RULE =
  "Has Steve explicitly approved this plan for cutover? — references plan only, no execution.";
