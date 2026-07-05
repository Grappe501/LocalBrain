/** VOP-001 — Volunteer profile contracts. */

export const VOP_VERSION = "VOP-001" as const;

export const VOP_VOLUNTEER_ROLES = [
  "canvasser",
  "phone_bank",
  "data_entry",
  "event_staff",
  "steward",
  "supervisor",
] as const;

export type VopVolunteerRole = (typeof VOP_VOLUNTEER_ROLES)[number];

export const VOP_SKILL_TAGS = [
  "voter_verification",
  "ocr_review",
  "data_cleanup",
  "outreach",
  "event_setup",
  "phone_calls",
  "canvassing",
  "stewardship",
  "supervision",
] as const;

export type VopSkillTag = (typeof VOP_SKILL_TAGS)[number];

export type VolunteerProfile = {
  profile_id: string;
  workspace_id: string;
  user_id: string;
  contact_id?: string;
  display_name: string;
  county?: string;
  roles: readonly VopVolunteerRole[];
  skills: readonly VopSkillTag[];
  availability_note?: string;
  training_completed: readonly string[];
  permissions: readonly string[];
  created_at: string;
  updated_at: string;
};

export type UpsertVolunteerProfileInput = {
  workspace_id: string;
  user_id: string;
  contact_id?: string;
  display_name: string;
  county?: string;
  roles?: readonly VopVolunteerRole[];
  skills?: readonly VopSkillTag[];
  availability_note?: string;
  training_completed?: readonly string[];
  permissions?: readonly string[];
};
