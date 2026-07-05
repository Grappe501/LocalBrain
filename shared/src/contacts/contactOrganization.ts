/** CONTACT-V3-019 — Organization & Affiliation Engine contract. */
export const CONTACT_ORGANIZATION_VERSION = "CONTACT-V3-019" as const;

export const ORGANIZATION_CATEGORIES = [
  "church",
  "business",
  "employer",
  "school",
  "university",
  "union",
  "nonprofit",
  "political_party",
  "campaign",
  "pac",
  "neighborhood_association",
  "hoa",
  "veterans_group",
  "professional_association",
  "sports_league",
  "civic_club",
  "fraternal_organization",
  "volunteer_organization",
  "government_agency",
  "unknown",
] as const;
export type OrganizationCategory = (typeof ORGANIZATION_CATEGORIES)[number];

export const ORGANIZATION_STATUSES = ["active", "archived", "merged"] as const;
export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];

export const ORGANIZATION_MEMBERSHIP_ROLES = [
  "member",
  "volunteer",
  "staff",
  "employee",
  "owner",
  "pastor",
  "board_member",
  "officer",
  "president",
  "treasurer",
  "secretary",
  "chair",
  "candidate",
  "donor",
  "supporter",
  "attendee",
  "custom",
] as const;
export type OrganizationMembershipRole = (typeof ORGANIZATION_MEMBERSHIP_ROLES)[number];

export const ORGANIZATION_MEMBERSHIP_STATUSES = [
  "prospective",
  "active",
  "inactive",
  "former",
  "unknown",
] as const;
export type OrganizationMembershipStatus = (typeof ORGANIZATION_MEMBERSHIP_STATUSES)[number];

export const ORGANIZATION_HISTORY_ACTIONS = [
  "created",
  "updated",
  "archived",
  "membership_added",
  "membership_ended",
  "role_assigned",
  "role_ended",
  "promoted",
  "merged",
] as const;
export type OrganizationHistoryAction = (typeof ORGANIZATION_HISTORY_ACTIONS)[number];

export type Organization = {
  organization_id: string;
  workspace_id: string;
  name: string;
  category: OrganizationCategory;
  description?: string;
  status: OrganizationStatus;
  archived: boolean;
  merged_into_organization_id?: string;
  created_by_user_id?: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationMembership = {
  membership_id: string;
  workspace_id: string;
  organization_id: string;
  contact_id: string;
  membership_role: OrganizationMembershipRole;
  membership_status: OrganizationMembershipStatus;
  custom_role_label?: string;
  started_at?: string;
  ended_at?: string;
  effective_from: string;
  effective_until?: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationMembershipView = OrganizationMembership & {
  contact_display_name: string;
};

export type OrganizationRole = {
  role_id: string;
  membership_id: string;
  workspace_id: string;
  organization_id: string;
  contact_id: string;
  role: OrganizationMembershipRole;
  label?: string;
  effective_from: string;
  effective_until?: string;
  created_by_user_id: string;
  created_at: string;
};

export type OrganizationHistory = {
  history_id: string;
  organization_id: string;
  workspace_id: string;
  action: OrganizationHistoryAction;
  summary: string;
  related_contact_id?: string;
  related_organization_id?: string;
  detail?: string;
  changed_by_user_id: string;
  created_at: string;
};

export type OrganizationMetrics = {
  membership_count: number;
  volunteer_count: number;
  leader_count: number;
  steward_count: number;
  average_health_score: number;
  open_action_count: number;
  strength_score: number;
  strength_label: string;
  participation_score: number;
  participation_label: string;
  momentum: "growing" | "stable" | "cooling";
  shared_household_count: number;
};

export type OrganizationIntegration = {
  referenced_steward_user_ids: readonly string[];
  referenced_open_action_count: number;
  referenced_context_count: number;
  referenced_household_count: number;
  notice: string;
};

export type OrganizationSummary = {
  engine_id: typeof CONTACT_ORGANIZATION_VERSION;
  organization: Organization;
  memberships: readonly OrganizationMembershipView[];
  roles: readonly OrganizationRole[];
  metrics: OrganizationMetrics;
  integration: OrganizationIntegration;
  history: readonly OrganizationHistory[];
};

export type OrganizationSearchResult = {
  organization_id: string;
  name: string;
  category: OrganizationCategory;
  membership_count: number;
  status: OrganizationStatus;
};

export type CreateOrganizationInput = {
  workspace_id: string;
  name: string;
  category?: OrganizationCategory;
  description?: string;
  created_by_user_id: string;
};

export type UpdateOrganizationInput = {
  name?: string;
  category?: OrganizationCategory;
  description?: string | null;
  updated_by_user_id: string;
};

export type AddOrganizationMembershipInput = {
  workspace_id: string;
  organization_id: string;
  contact_id: string;
  membership_role?: OrganizationMembershipRole;
  membership_status?: OrganizationMembershipStatus;
  custom_role_label?: string;
  started_at?: string;
  created_by_user_id: string;
};

export type UpdateOrganizationMembershipInput = {
  membership_role?: OrganizationMembershipRole;
  membership_status?: OrganizationMembershipStatus;
  custom_role_label?: string | null;
  started_at?: string | null;
  updated_by_user_id: string;
};

export type AssignOrganizationRoleInput = {
  workspace_id: string;
  organization_id: string;
  membership_id: string;
  contact_id: string;
  role: OrganizationMembershipRole;
  label?: string;
  created_by_user_id: string;
};

export type MergeOrganizationsInput = {
  workspace_id: string;
  from_organization_id: string;
  to_organization_id: string;
  reason?: string;
  merged_by_user_id: string;
};

export const CONTACT_ORGANIZATION_ADVISORY_NOTICE =
  "Organizations group canonical contacts — belong, don't flatten. Derived metrics reference Stewardship, Context, Action, and Household engines." as const;
