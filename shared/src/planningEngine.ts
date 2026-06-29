/**
 * Generic Planning Engine — platform contract (LB-OS-024+)
 * Migration is the first planner implementation (ENG-MPL-001).
 *
 * Evidence → Proof → Planner → Plan
 */

export type PlanVariantStrategy = "conservative" | "balanced" | "aggressive" | "custom";

export type PlanConstraintStatus = "pass" | "warn" | "fail";

export type PlanRiskLabel = "low" | "medium" | "high";

/** Hard rules the planner must obey — optimize within constraints, not unconstrained. */
export interface PlanConstraint {
  constraint_id: string;
  label: string;
  status: PlanConstraintStatus;
  detail: string;
}

export interface PlanObjective {
  objective_id: string;
  label: string;
  priority: "primary" | "secondary";
  /** Deterministic fulfillment 0–100 */
  fulfillment_percent: number;
}

/** Deterministic plan quality — separate from Evidence Confidence and Proof Score. */
export interface PlanQualityScore {
  percent: number;
  max_points: number;
  total_points: number;
  components: {
    efficiency: number;
    risk: number;
    rollback_simplicity: number;
    operation_count: number;
    duration: number;
    objective_fulfillment: number;
  };
  risk_label: PlanRiskLabel;
  recommendation_confidence: "low" | "medium" | "high";
}

/** Immutable provenance chain for every operation. */
export interface ProvenanceChain {
  audit_ref: string | null;
  survey_ref: string | null;
  certificate_id: string;
  simulation_id: string;
  plan_id: string;
  proposal_id: string | null;
}

export const PLANNING_ENGINE_ID = "ENG-PLN-001";

export const MIGRATION_PLANNER_ID = "ENG-MPL-001";

export const DEFAULT_MIGRATION_CONSTRAINTS: Omit<PlanConstraint, "status" | "detail">[] = [
  { constraint_id: "max-downtime-zero", label: "Maximum downtime: 0" },
  { constraint_id: "max-simultaneous-moves", label: "Maximum simultaneous moves bounded" },
  { constraint_id: "preserve-workspace-identity", label: "Preserve workspace identity" },
  { constraint_id: "preserve-projection-integrity", label: "Preserve projection integrity" },
  { constraint_id: "preserve-backups", label: "Preserve backups" },
  { constraint_id: "preserve-rollback", label: "Preserve rollback path" },
  { constraint_id: "forbidden-roots", label: "Never cross forbidden roots" },
  { constraint_id: "five-gates", label: "Respect Five Gates" },
];

export const PLAN_VARIANT_LABELS: Record<PlanVariantStrategy, string> = {
  conservative: "Conservative — lowest risk",
  balanced: "Balanced — best overall",
  aggressive: "Aggressive — maximum cleanup",
  custom: "Custom variant",
};

export interface PlannerGenerateRequest {
  certificate_id: string;
  /** Generate one or all variant strategies */
  variants?: PlanVariantStrategy[];
}

export interface PlannerGenerateResponse<TPlan> {
  plans: TPlan[];
  recommended_plan_id: string | null;
}
