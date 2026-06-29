import type { PlanConstraint, PlanQualityScore, PlanVariantStrategy } from "@localbrain/shared";
import type { PlanObjective } from "@localbrain/shared";
import { averageObjectiveFulfillment } from "./objectiveModel.js";
import { constraintsPass } from "./constraintEvaluator.js";

const QUALITY_MAX = 100;
const READY_MIN_QUALITY = 70;

export function scorePlanQuality(input: {
  variant: PlanVariantStrategy;
  total_operations: number;
  total_bytes_moved: number;
  estimated_duration_minutes: number;
  rollback_duration_minutes: number;
  objectives: PlanObjective[];
  constraints: PlanConstraint[];
}): PlanQualityScore {
  const { variant, total_operations, estimated_duration_minutes, rollback_duration_minutes } =
    input;

  const efficiency =
    variant === "aggressive"
      ? Math.max(0, 100 - total_operations * 0.8)
      : variant === "conservative"
        ? Math.max(40, 90 - total_operations * 0.3)
        : Math.max(0, 95 - total_operations * 0.5);

  const risk =
    variant === "conservative"
      ? 95
      : variant === "balanced"
        ? 78
        : 55;

  const rollback_simplicity =
    rollback_duration_minutes <= estimated_duration_minutes
      ? 90
      : Math.max(40, 90 - (rollback_duration_minutes - estimated_duration_minutes) * 5);

  const operation_count = Math.max(0, 100 - Math.min(100, total_operations * 0.6));

  const duration = Math.max(0, 100 - Math.min(100, estimated_duration_minutes * 4));

  const objective_fulfillment = averageObjectiveFulfillment(input.objectives);

  const components = {
    efficiency: Math.round(efficiency),
    risk: Math.round(risk),
    rollback_simplicity: Math.round(rollback_simplicity),
    operation_count: Math.round(operation_count),
    duration: Math.round(duration),
    objective_fulfillment: objective_fulfillment,
  };

  const weights = {
    efficiency: 0.15,
    risk: 0.2,
    rollback_simplicity: 0.15,
    operation_count: 0.15,
    duration: 0.1,
    objective_fulfillment: 0.25,
  };

  const total_points = Math.round(
    components.efficiency * weights.efficiency +
      components.risk * weights.risk +
      components.rollback_simplicity * weights.rollback_simplicity +
      components.operation_count * weights.operation_count +
      components.duration * weights.duration +
      components.objective_fulfillment * weights.objective_fulfillment,
  );

  const percent = Math.min(100, Math.max(0, total_points));
  const risk_label =
    components.risk >= 85 ? "low" : components.risk >= 65 ? "medium" : "high";
  const recommendation_confidence =
    percent >= 85 && constraintsPass(input.constraints)
      ? "high"
      : percent >= 70
        ? "medium"
        : "low";

  return {
    percent,
    max_points: QUALITY_MAX,
    total_points: percent,
    components,
    risk_label,
    recommendation_confidence,
  };
}

export function isReadyForProposal(
  quality: PlanQualityScore,
  constraints: PlanConstraint[],
): boolean {
  return constraintsPass(constraints) && quality.percent >= READY_MIN_QUALITY;
}
