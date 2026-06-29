/** Drive architecture & migration planner — LB-OS-018 (read-only) */

export type DriveLetter = "C" | "H" | "OTHER";

export type MigrationRiskLevel = "low" | "medium" | "high" | "critical";

export type DataClassification =
  | "program"
  | "work_project"
  | "work_document"
  | "work_code"
  | "work_media"
  | "work_archive"
  | "unknown";

export interface DriveDoctrinePanel {
  c_drive_role: string;
  h_drive_role: string;
  rules: string[];
  localbrain_default: string;
  migration_sequence: string[];
}

export interface DriveVolumeSummary {
  drive: DriveLetter;
  label: string;
  used_percent: number | null;
  free_bytes: number | null;
  total_bytes: number | null;
  indexed_asset_count: number;
  indexed_bytes: number;
  allowed_folder_count: number;
}

export interface PlacementAuditRow {
  path: string;
  drive: DriveLetter;
  classification: DataClassification;
  expected_drive: DriveLetter;
  misplaced: boolean;
  risk: MigrationRiskLevel;
  reason: string;
  size_bytes: number | null;
  workspace_id: string | null;
}

export interface DrivePlacementAudit {
  total_indexed: number;
  misplaced_count: number;
  by_drive: { drive: DriveLetter; count: number; bytes: number }[];
  by_classification: { classification: DataClassification; count: number }[];
  candidates: PlacementAuditRow[];
}

export interface MigrationPhasePreview {
  slice_id: string;
  name: string;
  status: "complete" | "current" | "planned";
  description: string;
}

export interface HStructureProposal {
  root: string;
  folders: { path: string; purpose: string; risk: MigrationRiskLevel }[];
  notes: string[];
}

export interface ArchiveStrategyDraft {
  principles: string[];
  candidates: { path: string; strategy: string; risk: MigrationRiskLevel; reason: string }[];
  retention_notes: string[];
}

export interface MigrationApprovalItem {
  id: string;
  label: string;
  detail: string;
  risk: MigrationRiskLevel;
  required_before_execution: boolean;
  completed: boolean;
}

export interface MigrationPlannerOverview {
  slice_id: "LB-OS-018";
  read_only: true;
  planning_only: true;
  inventory_gate: boolean;
  doctrine: DriveDoctrinePanel;
  volumes: DriveVolumeSummary[];
  placement_audit: DrivePlacementAudit;
  migration_arc: MigrationPhasePreview[];
  structure_proposal: HStructureProposal;
  archive_strategy: ArchiveStrategyDraft;
  approval_checklist: MigrationApprovalItem[];
  core_rule: string;
  guardrails: string[];
  observed_at: string;
}
