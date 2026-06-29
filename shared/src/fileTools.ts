/** Permission-gated file read/summarize contracts — LB-OS-009 */

export type FileSummarizeMode = "file" | "asset" | "folder";

export interface FileReadResult {
  path: string;
  normalized_path: string;
  allowed: boolean;
  reason: string;
  content: string | null;
  truncated: boolean;
  size_bytes: number | null;
  chars_returned: number;
  is_directory: boolean;
  logged: true;
}

export interface FolderManifestEntry {
  path: string;
  name: string;
  is_directory: boolean;
  size_bytes: number | null;
  modified_at: string | null;
  kind: string | null;
  lifecycle_stage: string | null;
  in_registry: boolean;
}

export interface FolderManifestResult {
  path: string;
  normalized_path: string;
  allowed: boolean;
  reason: string;
  entries: FolderManifestEntry[];
  total_in_registry: number;
  manifest_only: true;
  logged: true;
}

export interface FileSummarizeResult {
  mode: FileSummarizeMode;
  source_path: string;
  normalized_path: string;
  summary: string;
  allowed: boolean;
  reason: string;
  truncated: boolean;
  tokens_estimate: number | null;
  model: string | null;
  key_configured: boolean;
  manifest_only: boolean;
  logged: true;
}
