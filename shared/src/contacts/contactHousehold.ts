/** CONTACT-V3-018 — Household Engine contract. */
export const CONTACT_HOUSEHOLD_VERSION = "CONTACT-V3-018" as const;

export const CONTACT_HOUSEHOLD_STATUSES = ["active", "merged", "split"] as const;
export type ContactHouseholdStatus = (typeof CONTACT_HOUSEHOLD_STATUSES)[number];

export const CONTACT_HOUSEHOLD_MEMBER_ROLES = [
  "head",
  "spouse",
  "partner",
  "child",
  "parent",
  "sibling",
  "relative",
  "roommate",
  "other",
] as const;
export type ContactHouseholdMemberRole = (typeof CONTACT_HOUSEHOLD_MEMBER_ROLES)[number];

export const CONTACT_HOUSEHOLD_RELATIONSHIP_TYPES = [
  "spouse",
  "partner",
  "parent",
  "child",
  "sibling",
  "influences",
  "decision_maker",
  "other",
] as const;
export type ContactHouseholdRelationshipType =
  (typeof CONTACT_HOUSEHOLD_RELATIONSHIP_TYPES)[number];

export const CONTACT_HOUSEHOLD_HISTORY_ACTIONS = [
  "created",
  "updated",
  "member_added",
  "member_removed",
  "relationship_added",
  "relationship_ended",
  "merged",
  "split",
  "primary_residence_changed",
] as const;
export type ContactHouseholdHistoryAction = (typeof CONTACT_HOUSEHOLD_HISTORY_ACTIONS)[number];

export type ContactHouseholdAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

export type ContactHousehold = {
  household_id: string;
  workspace_id: string;
  name: string;
  primary_address?: ContactHouseholdAddress;
  voting_district?: string;
  primary_contact_id?: string;
  status: ContactHouseholdStatus;
  merged_into_household_id?: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type ContactHouseholdMember = {
  member_id: string;
  household_id: string;
  workspace_id: string;
  contact_id: string;
  role: ContactHouseholdMemberRole;
  relationship_label?: string;
  is_primary_residence: boolean;
  effective_from: string;
  effective_until?: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type ContactHouseholdMemberView = ContactHouseholdMember & {
  contact_display_name: string;
};

export type ContactHouseholdRelationship = {
  relationship_id: string;
  household_id: string;
  workspace_id: string;
  from_contact_id: string;
  to_contact_id: string;
  relationship_type: ContactHouseholdRelationshipType;
  label?: string;
  effective_from: string;
  effective_until?: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type ContactHouseholdHistory = {
  history_id: string;
  household_id: string;
  workspace_id: string;
  action: ContactHouseholdHistoryAction;
  summary: string;
  related_contact_id?: string;
  related_household_id?: string;
  detail?: string;
  changed_by_user_id: string;
  created_at: string;
};

export type ContactHouseholdComputed = {
  size: number;
  adults: number;
  minors: number;
  registered_voters: number;
  volunteers: number;
  strength_score: number;
  strength_label: string;
  participation_score: number;
  participation_label: string;
  health_score: number;
  health_label: string;
  open_action_count: number;
  steward_user_ids: readonly string[];
};

export type ContactHouseholdIntegration = {
  referenced_steward_user_ids: readonly string[];
  referenced_open_action_count: number;
  referenced_context_count: number;
  notice: string;
};

export type ContactHouseholdSummary = {
  engine_id: typeof CONTACT_HOUSEHOLD_VERSION;
  household: ContactHousehold;
  members: readonly ContactHouseholdMemberView[];
  relationships: readonly ContactHouseholdRelationship[];
  computed: ContactHouseholdComputed;
  integration: ContactHouseholdIntegration;
  history: readonly ContactHouseholdHistory[];
};

export type ContactHouseholdLookupRow = {
  household_id: string;
  name: string;
  member_count: number;
  primary_address_line?: string;
  voting_district?: string;
};

export type CreateContactHouseholdInput = {
  workspace_id: string;
  name: string;
  primary_address?: ContactHouseholdAddress;
  voting_district?: string;
  primary_contact_id?: string;
  created_by_user_id: string;
};

export type UpdateContactHouseholdInput = {
  name?: string;
  primary_address?: ContactHouseholdAddress | null;
  voting_district?: string | null;
  primary_contact_id?: string | null;
  updated_by_user_id: string;
};

export type AddContactHouseholdMemberInput = {
  workspace_id: string;
  household_id: string;
  contact_id: string;
  role: ContactHouseholdMemberRole;
  relationship_label?: string;
  is_primary_residence?: boolean;
  created_by_user_id: string;
};

export type AddContactHouseholdRelationshipInput = {
  workspace_id: string;
  household_id: string;
  from_contact_id: string;
  to_contact_id: string;
  relationship_type: ContactHouseholdRelationshipType;
  label?: string;
  created_by_user_id: string;
};

export type MergeContactHouseholdsInput = {
  workspace_id: string;
  from_household_id: string;
  to_household_id: string;
  reason?: string;
  merged_by_user_id: string;
};

export type SplitContactHouseholdInput = {
  workspace_id: string;
  source_household_id: string;
  new_household_name: string;
  member_contact_ids: readonly string[];
  reason?: string;
  split_by_user_id: string;
};

export type TransferPrimaryResidenceInput = {
  workspace_id: string;
  household_id: string;
  contact_id: string;
  changed_by_user_id: string;
};

export const CONTACT_HOUSEHOLD_ADVISORY_NOTICE =
  "Households group canonical contacts — individuals are never duplicated. Derived metrics reference Timeline, Stewardship, and Action engines." as const;
