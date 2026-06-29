/**
 * Digital Asset Intelligence contracts — LB-OS-007 (ENG-DAI-001).
 * Recommendations only; no cleanup execution.
 */

import type { AssetCollection, AssetHealthSignals } from "./digitalAsset.js";

export type RecommendationRisk = "low" | "medium" | "high";

export interface CleanupRecommendation {
  id: string;
  title: string;
  message: string;
  risk: RecommendationRisk;
  /** Always true in 007 — no auto-actions */
  recommend_only: true;
  why: string[];
  workspace_id?: string;
  asset_count?: number;
  bytes_estimate?: number;
  paths_sample?: string[];
}

export interface DuplicateCandidateGroup {
  group_id: string;
  match_reason: string;
  /** Candidates only — no dedupe actions in 007 */
  candidate_only: true;
  assets: {
    asset_id: string;
    path: string;
    name: string;
    size_bytes: number | null;
  }[];
}

export interface WorkspaceStorageSummary {
  workspace_id: string;
  title: string;
  asset_count: number;
  file_count: number;
  bytes_total: number;
  dormant_count: number;
  dormant_bytes: number;
}

export interface AssetIntelligenceSummary {
  total_assets: number;
  dormant: { count: number; bytes: number };
  archive_candidates: { count: number; bytes: number };
  duplicate_groups: number;
  large_assets: { count: number; bytes: number };
  by_workspace: WorkspaceStorageSummary[];
  collections: AssetCollection[];
}

export interface AssetIntelligenceForPath {
  health_signals: AssetHealthSignals;
  health_score: number;
  duplicate_candidates: DuplicateCandidateGroup[];
  related_collections: AssetCollection[];
  recommendations: CleanupRecommendation[];
}
