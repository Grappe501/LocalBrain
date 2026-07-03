/** ENG-CONTACT-001.3 — CSV import/export contract. */
export const CONTACT_CSV_VERSION = "ENG-CONTACT-001.3" as const;

/** Canonical export columns — round-trip safe for beta CSV workflows. */
export const CONTACT_CSV_HEADERS = [
  "contact_id",
  "display_name",
  "first_name",
  "last_name",
  "email",
  "phone",
  "tags",
  "notes",
  "outreach_status",
  "archived",
] as const;

export type ContactCsvHeader = (typeof CONTACT_CSV_HEADERS)[number];

/** How duplicate emails (within workspace) are handled on import commit. */
export type ContactImportDuplicatePolicy = "skip" | "update" | "error";

export type ContactImportRowAction = "create" | "update" | "skip" | "error";

export type ContactImportPreviewRow = {
  row_number: number;
  action: ContactImportRowAction;
  display_name: string;
  email: string;
  existing_contact_id: string | null;
  errors: readonly string[];
  warnings: readonly string[];
};

export type ContactImportPreviewResult = {
  engine_id: typeof CONTACT_CSV_VERSION;
  workspace_id: string;
  duplicate_policy: ContactImportDuplicatePolicy;
  total_rows: number;
  create_count: number;
  update_count: number;
  skip_count: number;
  error_count: number;
  can_commit: boolean;
  rows: readonly ContactImportPreviewRow[];
};

export type ContactImportCommitRowResult = {
  row_number: number;
  action: "created" | "updated" | "skipped" | "failed";
  contact_id: string | null;
  message: string;
};

export type ContactImportCommitResult = {
  engine_id: typeof CONTACT_CSV_VERSION;
  workspace_id: string;
  duplicate_policy: ContactImportDuplicatePolicy;
  created_count: number;
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  rows: readonly ContactImportCommitRowResult[];
};

export type ContactImportPreviewInput = {
  workspace_id: string;
  csv_text: string;
  duplicate_policy?: ContactImportDuplicatePolicy;
};

export type ContactImportCommitInput = {
  workspace_id: string;
  csv_text: string;
  duplicate_policy?: ContactImportDuplicatePolicy;
};
