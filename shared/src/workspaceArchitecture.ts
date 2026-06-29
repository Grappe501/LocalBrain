/**
 * Executive Workspace Architecture — LB-OS-021 · ENG-EWA-001
 * Three Worlds: Executive → Logical → Projection → Physical
 */

export type ProjectionKind =
  | "filesystem_root"
  | "sqlite_db"
  | "physical_file"
  | "contact_record"
  | "storage";

export type ProjectionStatus = "active" | "stale" | "missing" | "planned";

export type LogicalProjectionType =
  | "living_workspace"
  | "knowledge_source"
  | "digital_asset"
  | "memory"
  | "relationship";

export interface Projection {
  projection_id: string;
  logical_type: LogicalProjectionType;
  logical_id: string;
  projection_kind: ProjectionKind;
  physical_ref: string;
  storage_provider_id: string | null;
  status: ProjectionStatus;
  observed_at: string;
}

/** Storage provider contract — runtime disabled in LB-OS-021 (stub only). */
export type StorageProviderType =
  | "local_volume"
  | "cloud"
  | "nas"
  | "gpu_server"
  | "removable";

export type StorageProviderHealth =
  | "healthy"
  | "degraded"
  | "offline"
  | "expected_offline"
  | "unknown";

export type StorageProviderRole =
  | "primary"
  | "archive"
  | "cold_storage"
  | "replication"
  | "system";

export interface StorageProviderStub {
  provider_id: string;
  label: string;
  provider_type: StorageProviderType;
  health: StorageProviderHealth;
  capacity_bytes: number | null;
  free_bytes: number | null;
  role: StorageProviderRole;
  /** Always false in 021 — no provider runtime */
  runtime_enabled: false;
}

export type OrganizationNodeKind =
  | "root"
  | "category"
  | "workspace"
  | "collection"
  | "archive";

export interface OrganizationTreeNode {
  node_id: string;
  label: string;
  kind: OrganizationNodeKind;
  workspace_id?: string;
  children?: OrganizationTreeNode[];
}

export interface WorkspaceDNA {
  workspace_id: string;
  title: string;
  mission: string | null;
  owner: string;
  created_at: string;
  purpose: string;
  success_definition: string;
  primary_department: string | null;
  mission_category: string | null;
  lifecycle: string;
  health: number | null;
  knowledge_source_ids: string[];
  projections: Projection[];
}

export interface WorkspaceBlueprintMigrationImpact {
  folder_count: number;
  file_count: number;
  broken_workspace_refs: number;
}

export interface WorkspaceBlueprint {
  workspace_id: string;
  title: string;
  logical_id: string;
  current_projections: Projection[];
  recommended_projections: Projection[];
  confidence_percent: number;
  confidence_label: string;
  why: string[];
  migration_impact: WorkspaceBlueprintMigrationImpact;
  simulation_available: boolean;
}

export interface PhysicalVolumeSurvey {
  provider_id: string;
  label: string;
  mount: string;
  health: StorageProviderHealth;
  total_bytes: number | null;
  free_bytes: number | null;
  role: StorageProviderRole;
  provider_type: StorageProviderType;
  available: boolean;
}

export type PhysicalWorldBindingIssueKind =
  | "orphan_folder"
  | "orphan_workspace"
  | "boundary_conflict"
  | "naming_inconsistency"
  | "empty_namespace";

export interface PhysicalWorldBindingIssue {
  issue_id: string;
  kind: PhysicalWorldBindingIssueKind;
  path: string | null;
  workspace_id: string | null;
  summary: string;
}

export interface PhysicalWorldSurvey {
  volumes: PhysicalVolumeSurvey[];
  storage_providers: StorageProviderStub[];
  binding_issues: PhysicalWorldBindingIssue[];
  observed_at: string;
}

export interface ExecutiveWorkspaceArchitectureReport {
  slice_id: "LB-OS-021";
  engine_id: "ENG-EWA-001";
  read_only: true;
  three_worlds_model: "executive_logical_projection_physical";
  organization_tree: OrganizationTreeNode;
  workspace_dna: WorkspaceDNA[];
  blueprints: WorkspaceBlueprint[];
  physical_world: PhysicalWorldSurvey;
  observed_at: string;
}
