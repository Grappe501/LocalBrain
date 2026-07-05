/** UCIE-103 — Schema discovery. */

export const UCIE_CANONICAL_FIELDS = [
  "display_name",
  "first_name",
  "last_name",
  "phone",
  "mobile",
  "email",
  "address_line1",
  "city",
  "county",
  "state",
  "postal_code",
  "employer",
  "organization",
  "notes",
  "tags",
  "date_of_birth",
] as const;

export type UcieCanonicalField = (typeof UCIE_CANONICAL_FIELDS)[number];

export const UCIE_MAPPING_CONFIDENCE = ["high", "medium", "low", "unknown"] as const;

export type UcieMappingConfidence = (typeof UCIE_MAPPING_CONFIDENCE)[number];

export type ColumnMapping = {
  source_column: string;
  canonical_field: UcieCanonicalField;
  confidence: UcieMappingConfidence;
  approved: boolean;
};

export type SchemaDiscoveryResult = {
  session_id: string;
  header_fingerprint: string;
  mappings: readonly ColumnMapping[];
  unmapped_columns: readonly string[];
  requires_approval: boolean;
};

export type ApproveSchemaMappingInput = {
  session_id: string;
  mappings: readonly ColumnMapping[];
  approved_by_user_id: string;
  remember_for_future: boolean;
};

export type SavedSchemaMapping = {
  mapping_id: string;
  workspace_id: string;
  source_type: string;
  header_fingerprint: string;
  mappings_json: string;
  approved_by_user_id: string;
  created_at: string;
};
