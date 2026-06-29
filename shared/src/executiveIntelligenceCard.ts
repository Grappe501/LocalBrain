/**
 * Executive Intelligence Cards — ENG-EIC-001 (LB-OS-020).
 * Presentation contract; not a foundational object.
 */

export type IntelligenceCardPriority = "low" | "medium" | "high" | "critical";

export type IntelligenceCardCategory =
  | "duplicate_file"
  | "version_chain"
  | "folder_consolidation"
  | "program_consolidation"
  | "knowledge_consolidation"
  | "archive_opportunity"
  | "workspace_orphan"
  | "system";

export type IntelligencePipelineStage =
  | "recommendation"
  | "simulation"
  | "proposal"
  | "approval"
  | "execution"
  | "verification"
  | "learning";

export type PipelineStageStatus =
  | "complete"
  | "available"
  | "not_generated"
  | "pending"
  | "waived"
  | "not_applicable";

/** Universal seven-score standard (0–100). */
export interface IntelligenceScores {
  importance: number;
  confidence: number;
  urgency: number;
  effort: number;
  expected_benefit: number;
  decision_friction_reduction: number;
  risk: number;
}

export interface IntelligencePipelineState {
  recommendation: PipelineStageStatus;
  simulation: PipelineStageStatus;
  proposal: PipelineStageStatus;
  approval: PipelineStageStatus;
  execution: PipelineStageStatus;
  verification: PipelineStageStatus;
  learning: PipelineStageStatus;
}

export interface EvidenceSignalPublic {
  signal: string;
  weight: "low" | "medium" | "high";
  detail?: string;
}

export interface ExecutiveIntelligenceCard {
  card_id: string;
  title: string;
  category: IntelligenceCardCategory;
  category_label: string;
  source: string;
  priority: IntelligenceCardPriority;
  scores: IntelligenceScores;
  evidence_percent: number;
  evidence_signals: EvidenceSignalPublic[];
  executive_impact: string;
  decision_friction: string;
  estimated_review_minutes: number;
  estimated_benefit: string;
  reclaimable_bytes: number | null;
  decision_points_eliminated: number | null;
  pipeline: IntelligencePipelineState;
  /** Always true in LB-OS-020 — analyze/simulate only */
  read_only: true;
  related_paths: string[];
  dismissed: boolean;
}
