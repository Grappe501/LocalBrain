/**
 * Consolidation Planner contracts — LB-OS-020 (ENG-CNS-001 + briefing).
 */

import type { ExecutiveIntelligenceCard, IntelligenceCardCategory } from "./executiveIntelligenceCard.js";

export type ConsolidationCategory =
  | "duplicates"
  | "versions"
  | "folders"
  | "programs"
  | "knowledge"
  | "ignored";

export type WorkspaceSimplificationLevel = "low" | "medium" | "high";

export type ConsolidationScoreBand = "critical" | "fair" | "healthy" | "excellent";

export interface ConsolidationScoreComponents {
  duplicate_density: number;
  version_fragmentation: number;
  workspace_fragmentation: number;
  orphan_assets: number;
  archive_opportunities: number;
  naming_consistency: number;
  storage_efficiency: number;
}

export interface ConsolidationScore {
  score: number;
  band: ConsolidationScoreBand;
  band_label: string;
  trend_delta: number | null;
  trend_label: string | null;
  components: ConsolidationScoreComponents;
  computed_at: string;
}

export interface ConsolidationRiskAssessment {
  high: number;
  medium: number;
  low: number;
}

export interface OverallOpportunity {
  reclaimable_storage_bytes: number;
  workspace_simplification: WorkspaceSimplificationLevel;
  duplicate_confidence_percent: number;
  estimated_review_minutes: number;
  decision_friction_before: string;
  decision_friction_after: string;
}

export interface ExecutiveConsolidationBriefing {
  slice_id: "LB-OS-020";
  engine_id: "ENG-CNS-001";
  read_only: true;
  nothing_changed: true;
  safety_footer: string;
  observed_at: string;
  inventory_gate: boolean;
  consolidation_score: ConsolidationScore;
  overall_opportunity: OverallOpportunity;
  risk_assessment: ConsolidationRiskAssessment;
  priority_cards: ExecutiveIntelligenceCard[];
  card_count_by_category: Record<IntelligenceCardCategory, number>;
  /** Subset for Executive Briefing home */
  consolidation_opportunity: ConsolidationOpportunitySummary;
}

export interface ConsolidationOpportunitySummary {
  consolidation_score: number;
  score_band: ConsolidationScoreBand;
  trend_label: string | null;
  reclaimable_storage_bytes: number;
  workspace_simplification: WorkspaceSimplificationLevel;
  duplicate_confidence_percent: number;
  estimated_review_minutes: number;
  risk_assessment: ConsolidationRiskAssessment;
  top_priority_summary: string | null;
  executive_summary: string;
  briefing_path: "/migration/consolidation";
}

export interface ConsolidationCategoryResponse {
  category: ConsolidationCategory;
  stub: boolean;
  stub_message: string | null;
  cards: ExecutiveIntelligenceCard[];
  observed_at: string;
}

export interface ConsolidationSimulateRequest {
  card_ids?: string[];
}

export interface ConsolidationSimulationResult {
  read_only: true;
  preview_only: true;
  reversible: true;
  storage_recovered_bytes: number;
  duplicate_files_removed: number;
  folders_merged: number;
  workspaces_cleaned: number;
  files_deleted: number;
  decision_points_eliminated: number;
  cards_simulated: number;
  summary: string;
  nothing_changed: true;
}
