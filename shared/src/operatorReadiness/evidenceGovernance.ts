/** Prime Directive & evidence governance — cultural rules codified for shared contracts. */

export const PRIME_DIRECTIVE = "Protect the evidence." as const;

/** PRL-3 closing · pairs with PRIME_DIRECTIVE — wait for pattern before implementation batches. */
export const SECOND_PRIME_DIRECTIVE = "Protect the pace." as const;

export const PRIME_DIRECTIVES = [PRIME_DIRECTIVE, SECOND_PRIME_DIRECTIVE] as const;

export const ONE_WAY_DOOR_PRINCIPLE =
  "Every first operator experience is a one-way door. Treat it as irreplaceable evidence." as const;

/** Replaces "The build passed" as the primary engineering celebration signal during EDD. */
export const ENGINEERING_SUCCESS_MANTRA = "We learned something true." as const;

export type EvidenceScoreboardTrend = "up_good" | "down_good";

export type EvidenceScoreboardMetric = {
  metric_id: string;
  label: string;
  trend: EvidenceScoreboardTrend;
  description: string;
};

/** Primary governance dashboard — feature completion is no longer the success signal. */
export const EVIDENCE_SCOREBOARD_METRICS: readonly EvidenceScoreboardMetric[] = [
  {
    metric_id: "oecs_opened",
    label: "OECs opened",
    trend: "down_good",
    description: "New operational evidence candidates per session — fewer is better when dispositioned",
  },
  {
    metric_id: "oecs_confirmed",
    label: "OECs confirmed",
    trend: "down_good",
    description: "OECs replicated across operators — fewer confirmed problems over time",
  },
  {
    metric_id: "operator_confidence",
    label: "Operator confidence",
    trend: "up_good",
    description: "Self-reported and observed certainty during walkthrough",
  },
  {
    metric_id: "facilitator_interventions",
    label: "Facilitator interventions",
    trend: "down_good",
    description: "Navigation hints, terminology, or architectural explanations — evidence contamination",
  },
  {
    metric_id: "self_recovery",
    label: "Self-recovery",
    trend: "up_good",
    description: "Operator recovers from errors without facilitator assistance",
  },
  {
    metric_id: "platform_readiness",
    label: "Platform Readiness",
    trend: "up_good",
    description: "Longitudinal readiness dimension average across evidence packages",
  },
  {
    metric_id: "time_to_completion",
    label: "Time to completion",
    trend: "down_good",
    description: "Walkthrough duration — efficiency without rushed or coached sessions",
  },
  {
    metric_id: "evidence_quality",
    label: "Evidence quality",
    trend: "up_good",
    description: "Complete scribe capture, contamination log, post-session debrief — uncorrupted signal",
  },
] as const;

/** Walkthrough #1 becomes permanent operator-experience regression after PRL-4. */
export const WALKTHROUGH_001_FREEZE_POLICY = {
  walkthrough_id: "OPERATOR-WALKTHROUGH-001",
  frozen_after_prl: "PRL-4",
  policy:
    "Do not change Walkthrough #1 after PRL-4 exit. Create Walkthrough #2, then #3. Every future release must still pass #1.",
  operator_regression_required: true,
} as const;

export const EVIDENCE_PIPELINE_STAGES = [
  "Operator Evidence",
  "Implementation Decisions",
  "Platform Readiness",
  "Launch Decision",
] as const;

/** Review pipeline — no shortcuts from single observations. */
export const OPERATOR_EVIDENCE_REVIEW_PIPELINE = [
  { step_id: "evidence", label: "Evidence", question: "What happened?" },
  { step_id: "pattern", label: "Pattern", question: "Did multiple operators experience it?" },
  {
    step_id: "interpretation",
    label: "Interpretation",
    question: "What is the most likely explanation?",
  },
  {
    step_id: "recommendation",
    label: "Recommendation",
    question: "What is the smallest justified change?",
  },
  {
    step_id: "regression_check",
    label: "Regression check",
    question: "Does the change preserve doctrines and keep CPAT green?",
  },
] as const;

/** PRL-4 operator cycle — batch disposition after three operators, not fix-after-each-session. */
export const OPERATOR_SESSION_CADENCE = [
  "Kelly session",
  "Chris session",
  "Third operator session",
  "Evidence synthesis",
  "Disposition",
  "Implementation batch",
  "CPAT regression",
  "Next operator cycle",
] as const;
