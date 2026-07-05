import type { ReadinessDimension } from "./platformReadiness.js";

/** PRL-4 exit contract — evidence-based completion criteria (governance guidelines). */

export const PRL4_EXIT_CONTRACT_ID = "PRL-4-EXIT-CONTRACT-v1.0" as const;

export type Prl4ExitCriterionId =
  | "canonical_walkthroughs_completed"
  | "minimum_internal_operators"
  | "platform_readiness_score_threshold"
  | "readiness_dimension_floor"
  | "oecs_reviewed_and_dispositioned"
  | "no_severity_1_or_2_blockers"
  | "training_completion";

export type Prl4ExitCriterion = {
  id: Prl4ExitCriterionId;
  label: string;
  guideline: string;
  required_for_exit: boolean;
};

export const PRL4_EXIT_CRITERIA: readonly Prl4ExitCriterion[] = [
  {
    id: "canonical_walkthroughs_completed",
    label: "Canonical walkthroughs completed",
    guideline: "All canonical walkthroughs completed by internal operators with signed evidence packages",
    required_for_exit: true,
  },
  {
    id: "minimum_internal_operators",
    label: "Minimum internal operators",
    guideline: "At least three distinct internal operators complete each canonical walkthrough",
    required_for_exit: true,
  },
  {
    id: "platform_readiness_score_threshold",
    label: "Platform Readiness Score",
    guideline: "Overall readiness ≥ 90% (readiness dimension average across signed packages)",
    required_for_exit: true,
  },
  {
    id: "readiness_dimension_floor",
    label: "Readiness dimension floor",
    guideline: "No readiness dimension below 85% in any signed operator package",
    required_for_exit: true,
  },
  {
    id: "oecs_reviewed_and_dispositioned",
    label: "OECs dispositioned",
    guideline:
      "All Operational Evidence Candidates reviewed and dispositioned (no_change, training_change, implementation_change, architecture_review, rejected, or deferred)",
    required_for_exit: true,
  },
  {
    id: "no_severity_1_or_2_blockers",
    label: "No operator blockers",
    guideline: "No open Severity-1 or Severity-2 operator blockers",
    required_for_exit: true,
  },
  {
    id: "training_completion",
    label: "Training completion",
    guideline: "Internal operator training completed and recorded",
    required_for_exit: true,
  },
] as const;

export const PRL4_READINESS_SCORE_TARGET = 90;
export const PRL4_READINESS_DIMENSION_FLOOR = 85;
export const PRL4_MINIMUM_INTERNAL_OPERATORS = 3;

export type Prl4ExitContractAssessment = {
  contract_id: typeof PRL4_EXIT_CONTRACT_ID;
  assessed_at: string;
  assessor_id: string;
  criteria: Record<
    Prl4ExitCriterionId,
    { met: boolean; evidence_ref?: string; notes?: string }
  >;
  dimension_scores?: Partial<Record<ReadinessDimension, number>>;
  overall_readiness?: number;
  exit_approved: boolean;
};
