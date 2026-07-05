/** UCIE-107 — Work marketplace. */

export const UCIE_WORK_ITEM_TYPES = [
  "ocr_review",
  "identity_review",
  "voter_verification",
  "duplicate_resolution",
  "missing_phone",
  "missing_email",
  "household_review",
  "organization_review",
] as const;

export type UcieWorkItemType = (typeof UCIE_WORK_ITEM_TYPES)[number];

export const UCIE_WORK_ITEM_STATUSES = [
  "open",
  "claimed",
  "completed",
  "released",
  "cancelled",
] as const;

export type UcieWorkItemStatus = (typeof UCIE_WORK_ITEM_STATUSES)[number];

export type WorkItem = {
  work_item_id: string;
  workspace_id: string;
  session_id?: string;
  row_id?: string;
  item_type: UcieWorkItemType;
  status: UcieWorkItemStatus;
  title: string;
  detail: string;
  claimed_by_user_id?: string;
  claimed_at?: string;
  completed_by_user_id?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
};

export type WorkItemClaim = {
  claim_id: string;
  work_item_id: string;
  user_id: string;
  claimed_at: string;
  released_at?: string;
};

export type ClaimWorkItemInput = {
  work_item_id: string;
  user_id: string;
};

export type CompleteWorkItemInput = {
  work_item_id: string;
  user_id: string;
  resolution_note?: string;
};
