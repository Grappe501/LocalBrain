/**
 * Migration Plan — LB-OS-024 · ENG-MPL-001
 * Execution blueprint between Proof Certificate and Proposal.
 *
 * Certificate: "This is safe."
 * Plan:        "This is the sequence."
 * Proposal:    "Please approve these specific actions."
 */

export type MigrationOperationKind =
  | "create_folder_structure"
  | "copy_documentation"
  | "move_source"
  | "update_projection"
  | "validate_references"
  | "finalize"
  | "verify";

export type MigrationPlanStatus = "draft" | "ready" | "superseded";

/** Single operation in a dependency-ordered execution graph. */
export interface MigrationPlanOperation {
  operation_id: string;
  kind: MigrationOperationKind;
  label: string;
  workspace_id: string;
  /** Topological sequence (1-based display order) */
  sequence_order: number;
  /** operation_ids that must complete before this step */
  depends_on: string[];
  estimated_bytes: number;
  estimated_duration_seconds: number;
  rollback_operation_id: string | null;
}

export interface MigrationPlanRollbackStep {
  step_id: string;
  label: string;
  reverses_operation_id: string;
  estimated_duration_seconds: number;
}

export interface MigrationPlanDependencyNode {
  operation_id: string;
  depends_on: string[];
}

/** Immutable execution blueprint — no approval, no execution. */
export interface MigrationPlan {
  plan_id: string;
  slice_id: "LB-OS-024";
  engine_id: "ENG-MPL-001";
  read_only: true;
  status: MigrationPlanStatus;
  certificate_id: string;
  simulation_id: string;
  workspace_ids: string[];
  title: string;
  estimated_duration_minutes: number;
  rollback_duration_minutes: number;
  total_operations: number;
  total_bytes_moved: number;
  operations: MigrationPlanOperation[];
  /** Flat execution order (topologically sorted operation_ids) */
  execution_order: string[];
  dependency_graph: MigrationPlanDependencyNode[];
  rollback_plan: MigrationPlanRollbackStep[];
  created_at: string;
}

/** Compare two plans — CoS and executive diff surfaces. */
export interface MigrationPlanDiff {
  plan_a_id: string;
  plan_b_id: string;
  operations_a: number;
  operations_b: number;
  operations_delta: number;
  bytes_a: number;
  bytes_b: number;
  bytes_delta: number;
  duration_a_minutes: number;
  duration_b_minutes: number;
  duration_delta_minutes: number;
  summary: string;
}

export interface MigrationPlanGenerateRequest {
  certificate_id: string;
  /** Optional variant label for alternate plans from same certificate */
  variant?: string;
}

export interface MigrationPlanGenerateResponse {
  plan: MigrationPlan;
}

export interface MigrationPlanOverview {
  slice_id: "LB-OS-024";
  engine_id: "ENG-MPL-001";
  read_only: true;
  core_rule: string;
  guardrails: string[];
  recent_plans: MigrationPlan[];
  observed_at: string;
}

export const MIGRATION_PLAN_CORE_RULE =
  "If we execute this, what exactly happens? — planning only until executive approval (025).";
