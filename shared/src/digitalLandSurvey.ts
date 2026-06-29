/**
 * Digital Land Survey — LB-OS-022 · ENG-DLS-001
 * Geographic survey of the Physical World (read-only).
 */

import type { StorageProviderHealth, StorageProviderRole, StorageProviderType } from "./workspaceArchitecture.js";

export type LandSurveyConfidenceLabel = "low" | "medium" | "high" | "excellent";

export interface LandSurveyStorageTopologyNode {
  path: string;
  label: string;
  depth: number;
  drive: string;
  role: StorageProviderRole;
  provider_type: StorageProviderType;
  health: StorageProviderHealth;
  child_count: number;
}

export interface LandSurveyStorageTopology {
  volumes: {
    label: string;
    mount: string;
    provider_id: string;
    role: StorageProviderRole;
    health: StorageProviderHealth;
    available: boolean;
  }[];
  scanned_roots: string[];
  h_top_level_count: number;
  summary: string;
}

export interface LandSurveyDriveUtilization {
  drive: string;
  label: string;
  used_percent: number | null;
  total_bytes: number | null;
  free_bytes: number | null;
  indexed_asset_count: number;
  indexed_bytes: number;
  headroom_label: "critical" | "low" | "comfortable" | "unknown";
}

export interface LandSurveyFolderOwnership {
  path: string;
  workspace_id: string | null;
  workspace_title: string | null;
  confidence_percent: number;
  confidence_label: LandSurveyConfidenceLabel;
  asset_count: number;
  size_bytes: number;
  reason: string;
}

export interface LandSurveyWorkspaceCoverage {
  workspace_id: string;
  title: string;
  roots_registered: number;
  indexed_asset_count: number;
  indexed_bytes: number;
  blueprint_confidence_percent: number | null;
  coverage_note: string;
}

export interface LandSurveyOrphanedData {
  unclaimed_folders: {
    path: string;
    asset_count: number;
    size_bytes: number;
    reason: string;
  }[];
  orphan_workspaces: {
    workspace_id: string;
    title: string;
    summary: string;
  }[];
  c_drive_misplaced: {
    path: string;
    classification: string;
    risk: string;
    reason: string;
  }[];
  total_orphan_bytes: number;
}

export interface LandSurveyDuplicateRegion {
  region_id: string;
  workspace_ids: string[];
  overlapping_paths: string[];
  reason: string;
}

export interface LandSurveyEmptyFolderChain {
  path: string;
  chain_depth: number;
  parent_path: string | null;
  workspace_id: string | null;
  summary: string;
}

export interface LandSurveyOversizedMedia {
  folder_path: string;
  media_file_count: number;
  total_bytes: number;
  dominant_kind: string;
  workspace_id: string | null;
  summary: string;
}

export interface LandSurveyArchiveCandidate {
  folder_path: string;
  days_since_activity: number;
  size_bytes: number;
  asset_count: number;
  reason: string;
  workspace_id: string | null;
}

export interface LandSurveyActivitySignals {
  active_folders_30d: number;
  stale_folders_90d: number;
  recently_modified_top_level: string[];
  dormant_top_level: string[];
  trend_label: "growing" | "stable" | "dormant" | "unknown";
  summary: string;
}

export interface LandSurveyMigrationComplexity {
  overall_score: number;
  overall_label: "low" | "moderate" | "high" | "critical";
  workspace_scores: {
    workspace_id: string;
    title: string;
    complexity_score: number;
    complexity_label: string;
    folder_count: number;
    file_count: number;
    blueprint_confidence_percent: number;
  }[];
  summary: string;
}

export interface LandSurveyProjectionCoverage {
  workspace_id: string;
  title: string;
  bound_locations: {
    location_id: string;
    location_label: string;
    location_role: string;
    physical_ref: string;
    status: string;
  }[];
  missing_location_roles: string[];
  coverage_percent: number;
}

export interface DigitalLandSurveyReport {
  slice_id: "LB-OS-022";
  engine_id: "ENG-DLS-001";
  read_only: true;
  core_rule: "Map the estate. Do not change the estate.";
  guardrails: string[];
  audit_run_id: string | null;
  mapping_confidence_percent: number;
  mapping_confidence_label: string;
  storage_topology: LandSurveyStorageTopology;
  drive_utilization: LandSurveyDriveUtilization[];
  folder_ownership: LandSurveyFolderOwnership[];
  workspace_coverage: LandSurveyWorkspaceCoverage[];
  orphaned_data: LandSurveyOrphanedData;
  duplicate_storage_regions: LandSurveyDuplicateRegion[];
  empty_folder_chains: LandSurveyEmptyFolderChain[];
  oversized_media_collections: LandSurveyOversizedMedia[];
  archive_candidates: LandSurveyArchiveCandidate[];
  activity_signals: LandSurveyActivitySignals;
  migration_complexity: LandSurveyMigrationComplexity;
  projection_coverage: LandSurveyProjectionCoverage[];
  recommendations: string[];
  observed_at: string;
}
