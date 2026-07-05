/** UCIE-105 / UCIE-106 — Identity resolution. */

export const UCIE_MATCH_OUTCOMES = [
  "exact_match",
  "high_confidence",
  "review_required",
  "new_identity",
] as const;

export type UcieMatchOutcome = (typeof UCIE_MATCH_OUTCOMES)[number];

export type IdentityMatchEvidence = {
  evidence_id: string;
  evidence_type:
    | "email"
    | "phone"
    | "name"
    | "address"
    | "household"
    | "organization"
    | "context"
    | "voter_record"
    | "alias";
  label: string;
  detail: string;
  contact_id?: string;
  voter_id?: string;
  weight: number;
};

export type IdentityMatchResult = {
  row_id: string;
  session_id: string;
  outcome: UcieMatchOutcome;
  confidence_score: number;
  matched_contact_id?: string;
  evidence: readonly IdentityMatchEvidence[];
  rationale: string;
  auto_merge_allowed: boolean;
};

export type VoterRecord = {
  voter_id: string;
  workspace_id: string;
  county: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  date_of_birth?: string;
};

export type VoterSearchFilter = {
  workspace_id: string;
  county: string;
  last_name?: string;
  first_name?: string;
  address?: string;
  date_of_birth?: string;
};

export type VoterVerificationInput = {
  row_id: string;
  voter_id?: string;
  verified_by_user_id: string;
  create_work_item_if_unresolved: boolean;
};

export type CommitImportRowInput = {
  row_id: string;
  committed_by_user_id: string;
  force_create?: boolean;
};

export type CommitImportRowResult = {
  row_id: string;
  contact_id: string;
  action: "created" | "linked";
  provenance_count: number;
};
