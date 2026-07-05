/** Platform Readiness Levels & longitudinal governance dimensions. */

export const PLATFORM_READINESS_LEVELS = [
  "PRL-1",
  "PRL-2",
  "PRL-3",
  "PRL-4",
  "PRL-5",
  "PRL-6",
] as const;

export type PlatformReadinessLevel = (typeof PLATFORM_READINESS_LEVELS)[number];

export const PLATFORM_READINESS_LEVEL_LABELS: Record<PlatformReadinessLevel, string> = {
  "PRL-1": "Architecture Complete",
  "PRL-2": "Certified Core Implemented",
  "PRL-3": "Automated Acceptance Passing",
  "PRL-4": "Internal Operator Validated",
  "PRL-5": "External Pilot Validated",
  "PRL-6": "Production Ready",
};

/** Longitudinal governance dimensions — captured on every walkthrough. */
export const READINESS_DIMENSIONS = [
  "operator_readiness",
  "technical_readiness",
  "performance_readiness",
  "training_readiness",
  "operational_readiness",
  "data_quality_readiness",
  "volunteer_readiness",
  "manager_readiness",
] as const;

export type ReadinessDimension = (typeof READINESS_DIMENSIONS)[number];

export const READINESS_DIMENSION_LABELS: Record<ReadinessDimension, string> = {
  operator_readiness: "Operator Readiness",
  technical_readiness: "Technical Readiness",
  performance_readiness: "Performance Readiness",
  training_readiness: "Training Readiness",
  operational_readiness: "Operational Readiness",
  data_quality_readiness: "Data Quality Readiness",
  volunteer_readiness: "Volunteer Readiness",
  manager_readiness: "Manager Readiness",
};

export type PlatformReadinessSnapshot = {
  walkthrough_id: string;
  workspace_id: string;
  captured_at: string;
  platform_readiness_level: PlatformReadinessLevel;
  operator_id?: string;
  readiness_dimensions: Record<ReadinessDimension, number>;
  overall_readiness: number;
  notes?: string;
};

export const CANONICAL_ACCEPTANCE_TEST_ID = "CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0" as const;
export const CANONICAL_ACCEPTANCE_WALKTHROUGH_ID = "OPERATOR-WALKTHROUGH-001" as const;
