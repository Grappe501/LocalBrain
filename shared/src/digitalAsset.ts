/**
 * Digital Asset registry contracts — specializes KnowledgeSource + file_index (LB-OS-006+).
 * @see docs/LOCALBRAIN_DIGITAL_ASSET_MODEL.md
 */

export type DigitalAssetKind =
  | "document"
  | "source_code"
  | "photo"
  | "podcast"
  | "video"
  | "spreadsheet"
  | "database"
  | "zip_archive"
  | "pdf"
  | "email_attachment"
  | "ai_export"
  | "git_repository"
  | "font"
  | "directory"
  | "unknown";

export type AssetLifecycleStage =
  | "created"
  | "active"
  | "referenced"
  | "dormant"
  | "archive_candidate"
  | "archived"
  | "deleted";

export interface DigitalAssetFingerprint {
  hash: string | null;
  size_bytes: number | null;
  created_at: string | null;
  modified_at: string | null;
  last_referenced_at: string | null;
  workspace_id: string | null;
  knowledge_source_id: string | null;
  owner: string | null;
  health_score: number | null;
  lifecycle_stage: AssetLifecycleStage;
  duplicate_group_id: string | null;
  version_cluster_id: string | null;
  summary: string | null;
}

export interface DigitalAsset {
  asset_id: string;
  path: string;
  name: string;
  kind: DigitalAssetKind;
  fingerprint: DigitalAssetFingerprint;
  collection_ids: string[];
  relationship_ids: string[];
  tags: string[];
}

export interface AssetCollection {
  collection_id: string;
  title: string;
  description: string;
  /** Dynamic query definition — not a folder path */
  query: string;
  asset_count: number | null;
}

export interface AssetHealthSignals {
  fresh: boolean;
  referenced_recently: boolean;
  active_workspace: boolean;
  has_backup: boolean;
  no_duplicates: boolean;
  indexed: boolean;
  tagged: boolean;
  understood: boolean;
}
