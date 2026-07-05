import {
  PLATFORM_HEALTH_CATEGORIES,
  WALKTHROUGH_001_ID,
  type PlatformHealthCategory,
  type PlatformHealthScore,
  type WalkthroughPhaseEvidence,
  type WalkthroughPhaseId,
} from "./walkthrough001.js";

export const PLATFORM_HEALTH_CATEGORY_LABELS: Record<PlatformHealthCategory, string> = {
  intake_experience: "Intake Experience",
  identity_resolution: "Identity Resolution",
  voter_verification: "Voter Verification",
  queue_workflow: "Queue Workflow",
  relationship_assignment: "Relationship Assignment",
  ai_brief_accuracy: "AI Brief Accuracy",
  manager_visibility: "Manager Visibility",
};

const PHASE_TO_CATEGORY: Partial<Record<WalkthroughPhaseId, PlatformHealthCategory>> = {
  phase_1_intake: "intake_experience",
  phase_2_identity_resolution: "identity_resolution",
  phase_3_voter_verification: "voter_verification",
  phase_5_relationship_cultivation: "relationship_assignment",
  phase_6_intelligence: "ai_brief_accuracy",
  phase_7_campaign_view: "manager_visibility",
};

function scorePhase(phase: WalkthroughPhaseEvidence): number {
  if (!phase.technical_pass) return 0;
  let score = 100;
  score -= Math.min(phase.errors.length * 15, 45);
  score -= Math.min(phase.human_interventions * 3, 15);
  if (phase.ai_confidence_avg !== undefined) {
    score = Math.round(score * (0.7 + phase.ai_confidence_avg * 0.3));
  }
  return Math.max(0, Math.min(100, score));
}

/** Derive automated technical readiness scores from captured phase evidence. */
export function computeTechnicalPlatformHealth(
  workspace_id: string,
  phases: readonly WalkthroughPhaseEvidence[],
): PlatformHealthScore {
  const categories = Object.fromEntries(
    PLATFORM_HEALTH_CATEGORIES.map((category) => [category, 0]),
  ) as Record<PlatformHealthCategory, number>;

  for (const phase of phases) {
    const category = PHASE_TO_CATEGORY[phase.phase_id];
    if (category) categories[category] = scorePhase(phase);
  }

  const queuePhases = phases.filter((phase) =>
    (["phase_1_intake", "phase_2_identity_resolution", "phase_3_voter_verification"] as const).includes(
      phase.phase_id as "phase_1_intake" | "phase_2_identity_resolution" | "phase_3_voter_verification",
    ),
  );
  categories.queue_workflow = queuePhases.length
    ? Math.round(queuePhases.reduce((sum, phase) => sum + scorePhase(phase), 0) / queuePhases.length)
    : 0;

  const commitPhase = phases.find((phase) => phase.phase_id === "phase_4_commit");
  if (commitPhase && categories.identity_resolution > 0) {
    categories.identity_resolution = Math.round(
      (categories.identity_resolution + scorePhase(commitPhase)) / 2,
    );
  }

  const values = PLATFORM_HEALTH_CATEGORIES.map((category) => categories[category]);
  const overall_operator_readiness = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

  return {
    walkthrough_id: WALKTHROUGH_001_ID,
    workspace_id,
    captured_at: new Date().toISOString(),
    categories,
    overall_operator_readiness,
    notes:
      "Automated technical acceptance scores. Live operator walkthroughs may adjust with observed hesitation, UX friction, and recovery paths.",
  };
}
