/** Full filesystem mapping audit — LB-OS-019 (read-only) */

export type MappingConfidenceLabel = "low" | "medium" | "high";

export interface HFolderMapNode {
  path: string;
  name: string;
  depth: number;
  is_directory: boolean;
  size_bytes: number | null;
  child_count: number;
  permission_allowed: boolean;
}

export interface TopLevelDirectoryEntry {
  path: string;
  name: string;
  asset_count: number;
  file_count: number;
  directory_count: number;
  size_bytes: number;
  last_modified_at: string | null;
  workspace_claimed: boolean;
  claiming_workspace_id: string | null;
}

export interface WorkspaceRootCoverage {
  workspace_id: string;
  title: string;
  roots: string[];
  indexed_asset_count: number;
  indexed_bytes: number;
  coverage_note: string;
}

export interface FolderInventoryStat {
  folder_path: string;
  asset_count: number;
  file_count: number;
  directory_count: number;
  size_bytes: number;
  last_modified_at: string | null;
}

export interface StaleFolderCandidate {
  folder_path: string;
  days_since_activity: number;
  asset_count: number;
  size_bytes: number;
  reason: string;
}

export interface UnclaimedFolderCandidate {
  path: string;
  asset_count: number;
  size_bytes: number;
  reason: string;
}

export interface DuplicateWorkspaceCandidate {
  workspace_ids: string[];
  overlapping_paths: string[];
  reason: string;
}

export interface CMisplacedWorkCandidate {
  path: string;
  classification: string;
  risk: string;
  reason: string;
}

export interface FilesystemMappingAudit {
  slice_id: "LB-OS-019";
  read_only: true;
  principle: string;
  guardrails: string[];
  scanned_roots: string[];
  paths_scanned: number;
  h_drive_map: HFolderMapNode[];
  top_level_inventory: TopLevelDirectoryEntry[];
  workspace_coverage: WorkspaceRootCoverage[];
  folder_stats: FolderInventoryStat[];
  stale_candidates: StaleFolderCandidate[];
  unclaimed_folders: UnclaimedFolderCandidate[];
  duplicate_workspace_candidates: DuplicateWorkspaceCandidate[];
  c_misplaced_candidates: CMisplacedWorkCandidate[];
  mapping_confidence: number;
  mapping_confidence_label: MappingConfidenceLabel;
  recommendations: string[];
  inventory_complete: boolean;
  observed_at: string;
  run_id: string;
}
