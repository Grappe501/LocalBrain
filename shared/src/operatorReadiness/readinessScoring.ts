import type { PlatformHealthCategory } from "./walkthrough001.js";
import {
  READINESS_DIMENSIONS,
  type PlatformReadinessLevel,
  type PlatformReadinessSnapshot,
  type ReadinessDimension,
} from "./platformReadiness.js";

function avg(...values: number[]): number {
  const filtered = values.filter((value) => value > 0);
  if (filtered.length === 0) return 0;
  return Math.round(filtered.reduce((sum, value) => sum + value, 0) / filtered.length);
}

/** Map walkthrough scenario scores into longitudinal governance dimensions. */
export function computeReadinessDimensionsFromScenarioScores(
  categories: Record<PlatformHealthCategory, number>,
): Record<ReadinessDimension, number> {
  const dimensions = Object.fromEntries(
    READINESS_DIMENSIONS.map((dimension) => [dimension, 0]),
  ) as Record<ReadinessDimension, number>;

  dimensions.operator_readiness = avg(
    categories.intake_experience,
    categories.relationship_assignment,
  );
  dimensions.technical_readiness = avg(
    categories.identity_resolution,
    categories.ai_brief_accuracy,
  );
  dimensions.performance_readiness = avg(
    categories.intake_experience,
    categories.queue_workflow,
    categories.manager_visibility,
  );
  dimensions.training_readiness = avg(
    categories.relationship_assignment,
    categories.intake_experience,
  );
  dimensions.operational_readiness = avg(
    categories.queue_workflow,
    categories.identity_resolution,
    categories.voter_verification,
  );
  dimensions.data_quality_readiness = avg(
    categories.intake_experience,
    categories.identity_resolution,
    categories.voter_verification,
  );
  dimensions.volunteer_readiness = avg(
    categories.voter_verification,
    categories.queue_workflow,
  );
  dimensions.manager_readiness = avg(
    categories.manager_visibility,
    categories.ai_brief_accuracy,
  );

  return dimensions;
}

export function computePlatformReadinessSnapshot(input: {
  walkthrough_id: string;
  workspace_id: string;
  platform_readiness_level: PlatformReadinessLevel;
  scenario_scores: Record<PlatformHealthCategory, number>;
  operator_id?: string;
  notes?: string;
}): PlatformReadinessSnapshot {
  const readiness_dimensions = computeReadinessDimensionsFromScenarioScores(input.scenario_scores);
  const values = READINESS_DIMENSIONS.map((dimension) => readiness_dimensions[dimension]);
  const overall_readiness = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

  return {
    walkthrough_id: input.walkthrough_id,
    workspace_id: input.workspace_id,
    captured_at: new Date().toISOString(),
    platform_readiness_level: input.platform_readiness_level,
    operator_id: input.operator_id,
    readiness_dimensions,
    overall_readiness,
    notes: input.notes,
  };
}
