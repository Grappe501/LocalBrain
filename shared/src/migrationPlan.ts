/**
 * Migration Plan — LB-OS-024 · ENG-MPL-001 (first Planning Engine implementation)
 */

import type {
  PlanConstraint,
  PlanObjective,
  PlanQualityScore,
  PlanVariantStrategy,
  ProvenanceChain,
} from "./planningEngine.js";

export type MigrationOperationKind =
  | "create_folder_structure"
  | "copy_documentation"
  | "move_source"
  | "update_projection"
  | "validate_references"
  | "finalize"
  | "verify";

export type MigrationPlanStatus = "draft" | "ready" | "superseded" | "immutable";

export interface MigrationPlanOperation {
  operation_id: string;
  kind: MigrationOperationKind;
  label: string;
  workspace_id: string;
  sequence_order: number;
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

/** Immutable execution blueprint — constraint-aware, no approval, no execution. */
export interface MigrationPlan {
  plan_id: string;
  slice_id: "LB-OS-024";
  engine_id: "ENG-MPL-001";
  planner_id: "ENG-MPL-001";
  planning_engine_id: "ENG-PLN-001";
  read_only: true;
  immutable: true;
  status: MigrationPlanStatus;
  variant_strategy: PlanVariantStrategy;
  variant_label: string;
  certificate_id: string;
  simulation_id: string;
  provenance: ProvenanceChain;
  workspace_ids: string[];
  title: string;
  constraints: PlanConstraint[];
  objectives: PlanObjective[];
  plan_quality: PlanQualityScore;
  estimated_duration_minutes: number;
  rollback_duration_minutes: number;
  total_operations: number;
  total_bytes_moved: number;
  operations: MigrationPlanOperation[];
  execution_order: string[];
  dependency_graph: MigrationPlanDependencyNode[];
  rollback_plan: MigrationPlanRollbackStep[];
  /** True when all constraints pass and plan_quality meets threshold */
  ready_for_proposal: boolean;
  created_at: string;
}

export interface MigrationPlanDiff {
  plan_a_id: string;
  plan_b_id: string;
  variant_a: PlanVariantStrategy;
  variant_b: PlanVariantStrategy;
  operations_a: number;
  operations_b: number;
  operations_delta: number;
  bytes_a: number;
  bytes_b: number;
  bytes_delta: number;
  duration_a_minutes: number;
  duration_b_minutes: number;
  duration_delta_minutes: number;
  quality_a: number;
  quality_b: number;
  summary: string;
}

export interface MigrationPlanGenerateRequest {
  certificate_id: string;
  variants?: PlanVariantStrategy[];
}

export interface MigrationPlanGenerateResponse {
  plans: MigrationPlan[];
  recommended_plan_id: string | null;
}

export interface MigrationPlanOverview {
  slice_id: "LB-OS-024";
  engine_id: "ENG-MPL-001";
  planning_engine_id: "ENG-PLN-001";
  read_only: true;
  core_rule: string;
  guardrails: string[];
  default_constraints: string[];
  variant_strategies: PlanVariantStrategy[];
  recent_plans: MigrationPlan[];
  observed_at: string;
}

export const MIGRATION_PLAN_CORE_RULE =
  "If we execute this, what exactly happens? — optimize within constraints until executive approval (025).";
