/** OPERATOR-WALKTHROUGH-001 — Platform health & evidence contracts. */

export const WALKTHROUGH_001_ID = "OPERATOR-WALKTHROUGH-001" as const;
export const WALKTHROUGH_001_TITLE = "Unknown Person → Trusted Relationship" as const;

export const PLATFORM_HEALTH_CATEGORIES = [
  "intake_experience",
  "identity_resolution",
  "voter_verification",
  "queue_workflow",
  "relationship_assignment",
  "ai_brief_accuracy",
  "manager_visibility",
] as const;

export type PlatformHealthCategory = (typeof PLATFORM_HEALTH_CATEGORIES)[number];

export type PlatformHealthScore = {
  walkthrough_id: string;
  workspace_id: string;
  captured_at: string;
  operator_id?: string;
  categories: Record<PlatformHealthCategory, number>;
  overall_operator_readiness: number;
  notes?: string;
};

export type WalkthroughPhaseId =
  | "phase_1_intake"
  | "phase_2_identity_resolution"
  | "phase_3_voter_verification"
  | "phase_4_commit"
  | "phase_5_relationship_cultivation"
  | "phase_6_intelligence"
  | "phase_7_campaign_view";

export type WalkthroughPhaseEvidence = {
  phase_id: WalkthroughPhaseId;
  started_at: string;
  completed_at: string;
  duration_ms: number;
  human_interventions: number;
  ai_confidence_avg?: number;
  errors: readonly string[];
  recovery_path?: string;
  operator_hesitation_notes?: string;
  questions_asked?: readonly string[];
  suggested_improvements?: readonly string[];
  technical_pass: boolean;
};

export type Walkthrough001EvidencePackage = {
  walkthrough_id: typeof WALKTHROUGH_001_ID;
  title: typeof WALKTHROUGH_001_TITLE;
  workspace_id: string;
  scenario: string;
  started_at: string;
  completed_at: string;
  phases: readonly WalkthroughPhaseEvidence[];
  platform_health?: PlatformHealthScore;
  readiness_snapshot?: import("./platformReadiness.js").PlatformReadinessSnapshot;
  central_question: "Can an organization reliably transform raw information into a trusted relationship?";
  technical_acceptance_pass: boolean;
};
