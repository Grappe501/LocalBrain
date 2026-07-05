/** VOP-001 — Volunteer work marketplace (operational queue). */

export const VOP_WORK_ITEM_TYPES = [
  "follow_up",
  "stewardship_gap",
  "event_invite",
  "voter_verification",
  "data_cleanup",
  "field_shift",
  "canvass_block",
  "phone_bank",
  "identity_review",
] as const;

export type VopWorkItemType = (typeof VOP_WORK_ITEM_TYPES)[number];

export const VOP_WORK_ITEM_STATUSES = [
  "open",
  "claimed",
  "completed",
  "released",
  "cancelled",
] as const;

export type VopWorkItemStatus = (typeof VOP_WORK_ITEM_STATUSES)[number];

export const VOP_WORK_URGENCIES = ["low", "normal", "high"] as const;
export type VopWorkUrgency = (typeof VOP_WORK_URGENCIES)[number];

export const VOP_QUALITY_FLAGS = ["none", "needs_review", "rework", "rejected"] as const;
export type VopQualityFlag = (typeof VOP_QUALITY_FLAGS)[number];

export const VOP_WORK_SOURCES = ["manual", "contact", "ucie", "event"] as const;
export type VopWorkSource = (typeof VOP_WORK_SOURCES)[number];

export type VopWorkItem = {
  work_item_id: string;
  workspace_id: string;
  item_type: VopWorkItemType;
  status: VopWorkItemStatus;
  title: string;
  detail: string;
  county?: string;
  required_skills: readonly string[];
  urgency: VopWorkUrgency;
  source_system: VopWorkSource;
  source_ref_id?: string;
  contact_id?: string;
  quality_flag: VopQualityFlag;
  claimed_by_user_id?: string;
  claimed_at?: string;
  completed_by_user_id?: string;
  completed_at?: string;
  match_score?: number;
  created_at: string;
  updated_at: string;
};

export type VopWorkClaim = {
  claim_id: string;
  work_item_id: string;
  user_id: string;
  claimed_at: string;
  released_at?: string;
};

export type CreateVopWorkItemInput = {
  workspace_id: string;
  item_type: VopWorkItemType;
  title: string;
  detail: string;
  county?: string;
  required_skills?: readonly string[];
  urgency?: VopWorkUrgency;
  source_system?: VopWorkSource;
  source_ref_id?: string;
  contact_id?: string;
};

export type ClaimVopWorkItemInput = {
  work_item_id: string;
  user_id: string;
};

export type ReleaseVopWorkItemInput = {
  work_item_id: string;
  user_id: string;
};

export type CompleteVopWorkItemInput = {
  work_item_id: string;
  user_id: string;
  resolution_note?: string;
};

export type FlagVopWorkQualityInput = {
  work_item_id: string;
  flagged_by_user_id: string;
  flag_type: "accuracy" | "rework" | "stuck";
  note?: string;
};
