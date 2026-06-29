/**
 * Proof & Certification — LB-OS-023 · ENG-PRF-001
 * Deterministic validation layer between Evidence and Proposal.
 *
 * Evidence answers: "What do we know?"
 * Proof answers: "Can we safely act?"
 * Certification gates whether 024 may generate proposals.
 */

export type ProofDimensionId =
  | "structural"
  | "reference"
  | "recovery"
  | "performance"
  | "executive"
  | "policy";

export type ProofCheckStatus = "pass" | "warn" | "fail";

export type ProofCertificateResult = "certified" | "conditional" | "rejected";

export type RecommendationConfidence = "low" | "medium" | "high";

/** Single measurable check — never LLM-generated. */
export interface ProofCheck {
  check_id: string;
  label: string;
  status: ProofCheckStatus;
  detail: string;
  measured_value?: string | number | boolean | null;
}

/** Result from one ProofProvider dimension. */
export interface ProofDimensionResult {
  dimension_id: ProofDimensionId;
  label: string;
  max_points: number;
  earned_points: number;
  status: ProofCheckStatus;
  checks: ProofCheck[];
}

/** Aggregated deterministic proof score. */
export interface ProofScore {
  total_points: number;
  max_points: number;
  /** Normalized 0–100 for executive display */
  percent: number;
  dimension_results: ProofDimensionResult[];
  certified: boolean;
  recommendation_confidence: RecommendationConfidence;
}

/** Evidence lineage frozen at certification time. */
export interface EvidenceProvenance {
  audit_run_id: string | null;
  survey_observed_at: string | null;
  architecture_observed_at: string | null;
  evidence_confidence_percent: number | null;
}

/** Immutable proof certificate — 024 proposals require certification. */
export interface ProofCertificate {
  certificate_id: string;
  simulation_id: string;
  slice_id: "LB-OS-023";
  engine_id: "ENG-PRF-001";
  read_only: true;
  created_at: string;
  proof_score: ProofScore;
  evidence: EvidenceProvenance;
  workspace_ids: string[];
  blueprint_refs: { workspace_id: string; title: string; confidence_percent: number }[];
  result: ProofCertificateResult;
  core_rule: string;
  /** True when certified — gates LB-OS-024 Migration Plan generation */
  plan_eligible: boolean;
  /** True when certified — 025 proposals require an existing plan_id */
  proposal_eligible: boolean;
}

export type MigrationSimulationActionType = "projection_translation";

/** Dry-run batch — zero filesystem mutations. */
export interface MigrationSimulationBatch {
  batch_id: string;
  workspace_id: string;
  title: string;
  current_projection: string | null;
  recommended_projection: string;
  location_label: string;
  action_type: MigrationSimulationActionType;
  folder_count: number;
  file_count: number;
}

/** Immutable simulation record linked to certificate. */
export interface MigrationSimulation {
  simulation_id: string;
  read_only: true;
  preview_only: true;
  nothing_changed: true;
  created_at: string;
  workspace_ids: string[];
  batches: MigrationSimulationBatch[];
  rollback_preview: string[];
  impact_summary: {
    folders_affected: number;
    files_affected: number;
    projections_changed: number;
  };
  certificate_id: string | null;
}

export interface MigrationProofSimulateRequest {
  workspace_ids?: string[];
}

export interface MigrationProofSimulateResponse {
  simulation: MigrationSimulation;
  certificate: ProofCertificate;
}

/** GET /api/migration/proof overview */
export interface MigrationProofOverview {
  slice_id: "LB-OS-023";
  engine_id: "ENG-PRF-001";
  read_only: true;
  core_rule: string;
  guardrails: string[];
  proof_dimensions: { id: ProofDimensionId; label: string; max_points: number }[];
  evidence_confidence_percent: number | null;
  latest_certificates: ProofCertificate[];
  certification_thresholds: {
    certified_min_percent: number;
    conditional_min_percent: number;
  };
  observed_at: string;
}

/** ProofProvider contract — mirrors EvidenceProvider pattern (deterministic only). */
export interface ProofContext {
  workspace_ids: string[];
  simulation_batches: MigrationSimulationBatch[];
  audit_run_id: string | null;
  mapping_confidence_percent: number | null;
  survey_observed_at: string | null;
  architecture_observed_at: string | null;
  evidence_confidence_percent: number | null;
  migration_complexity_overall: number | null;
  duplicate_region_count: number;
  orphan_workspace_count: number;
  drive_headroom_label: string | null;
}

export interface ProofProvider {
  id: ProofDimensionId;
  label: string;
  max_points: number;
  evaluate(ctx: ProofContext): ProofDimensionResult;
}

export const PROOF_CERTIFICATION_THRESHOLDS = {
  certified_min_percent: 85,
  conditional_min_percent: 70,
} as const;

export const PROOF_CORE_RULE =
  "Evidence tells us what we know. Proof tells us whether it is safe to act. Certification decides whether 024 may generate proposals.";

export const PROOF_DIMENSION_LABELS: Record<ProofDimensionId, string> = {
  structural: "Structural Integrity",
  reference: "Reference Integrity",
  recovery: "Recovery Readiness",
  performance: "Performance Benefit",
  executive: "Executive Impact",
  policy: "Policy Proof",
};
