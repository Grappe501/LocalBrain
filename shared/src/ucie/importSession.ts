/** UCIE-101 / UCIE-102 — Import session entities. */

import { UCIE_VERSION } from "./ucieConstants.js";

export const UCIE_IMPORT_SOURCE_TYPES = [
  "manual_entry",
  "csv",
  "excel",
  "ocr_image",
  "pdf_form",
  "voter_file",
  "google_contacts",
  "apple_contacts",
  "outlook",
  "gmail",
  "event_export",
  "petition_export",
  "api_import",
] as const;

export type UcieImportSourceType = (typeof UCIE_IMPORT_SOURCE_TYPES)[number];

export const UCIE_SESSION_STATUSES = [
  "draft",
  "intake",
  "schema_discovery",
  "normalizing",
  "matching",
  "review",
  "committing",
  "completed",
  "failed",
  "cancelled",
] as const;

export type UcieSessionStatus = (typeof UCIE_SESSION_STATUSES)[number];

export const UCIE_ROW_PROCESSING_STATES = [
  "pending",
  "schema_mapped",
  "normalized",
  "matching",
  "matched",
  "review_required",
  "committed",
  "rejected",
  "failed",
] as const;

export type UcieRowProcessingState = (typeof UCIE_ROW_PROCESSING_STATES)[number];

export type ImportSource = {
  source_type: UcieImportSourceType;
  label: string;
  connector_id?: string;
};

export type ImportSession = {
  engine_id: typeof UCIE_VERSION;
  session_id: string;
  workspace_id: string;
  source_type: UcieImportSourceType;
  source_label: string;
  status: UcieSessionStatus;
  created_by_user_id: string;
  row_count: number;
  committed_count: number;
  review_count: number;
  checksum?: string;
  created_at: string;
  updated_at: string;
};

export type ImportBatch = {
  batch_id: string;
  session_id: string;
  workspace_id: string;
  batch_index: number;
  row_count: number;
  created_at: string;
};

export type ImportFile = {
  file_id: string;
  session_id: string;
  workspace_id: string;
  filename: string;
  mime_type?: string;
  byte_size: number;
  checksum: string;
  uploaded_by_user_id: string;
  uploaded_at: string;
};

export type ImportArtifact = {
  artifact_id: string;
  session_id: string;
  workspace_id: string;
  artifact_type: "ocr_image" | "pdf" | "raw_export" | "other";
  storage_ref: string;
  checksum: string;
  metadata_json?: string;
  created_at: string;
};

export type ImportRow = {
  row_id: string;
  session_id: string;
  batch_id: string;
  workspace_id: string;
  row_index: number;
  processing_state: UcieRowProcessingState;
  raw_json: string;
  normalized_json?: string;
  source_type: UcieImportSourceType;
  uploaded_by_user_id: string;
  checksum: string;
  match_outcome?: string;
  committed_contact_id?: string;
  created_at: string;
  updated_at: string;
};

export type CreateImportSessionInput = {
  workspace_id: string;
  source_type: UcieImportSourceType;
  source_label?: string;
  created_by_user_id: string;
};

export type IntakeCsvInput = {
  session_id: string;
  filename: string;
  csv_text: string;
  uploaded_by_user_id: string;
};

export type IntakeManualRowInput = {
  session_id: string;
  fields: Record<string, string>;
  uploaded_by_user_id: string;
};

export type IntakeOcrArtifactInput = {
  session_id: string;
  filename: string;
  storage_ref: string;
  checksum: string;
  uploaded_by_user_id: string;
};
