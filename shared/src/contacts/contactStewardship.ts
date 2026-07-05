/** CONTACT-V3-016 — Relationship Stewardship Engine contract. */
export const CONTACT_STEWERSHIP_VERSION = "CONTACT-V3-016" as const;

export const CONTACT_RELATIONSHIP_STRENGTHS = [
  "unknown",
  "new",
  "acquaintance",
  "supporter",
  "volunteer",
  "core_volunteer",
  "county_leader",
  "donor",
  "major_donor",
  "community_influencer",
  "strategic_partner",
] as const;
export type ContactRelationshipStrength = (typeof CONTACT_RELATIONSHIP_STRENGTHS)[number];

export const CONTACT_LIFECYCLE_STAGES = [
  "unknown",
  "identified",
  "connected",
  "engaged",
  "supporter",
  "volunteer",
  "leader",
  "advocate",
  "champion",
] as const;
export type ContactLifecycleStage = (typeof CONTACT_LIFECYCLE_STAGES)[number];

export const CONTACT_RELATIONSHIP_MOMENTUM = [
  "growing",
  "stable",
  "cooling",
  "dormant",
  "lost",
] as const;
export type ContactRelationshipMomentum = (typeof CONTACT_RELATIONSHIP_MOMENTUM)[number];

export const CONTACT_STEWARD_PARTICIPANT_ROLES = ["contributor", "watcher"] as const;
export type ContactStewardParticipantRole = (typeof CONTACT_STEWARD_PARTICIPANT_ROLES)[number];

export type ContactStewardParticipant = {
  participant_id: string;
  workspace_id: string;
  contact_id: string;
  user_id: string;
  role: ContactStewardParticipantRole;
  label?: string;
  effective_until?: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type ContactStewardTransition = {
  transition_id: string;
  workspace_id: string;
  contact_id: string;
  from_steward_user_id?: string;
  to_steward_user_id: string;
  reason: string;
  created_by_user_id: string;
  created_at: string;
};

export type ContactStewardshipHealthFactor = {
  code: string;
  label: string;
  impact: "positive" | "neutral" | "negative";
  detail: string;
};

export type ContactStewardshipComputed = {
  momentum: ContactRelationshipMomentum;
  health_score: number;
  health_label: string;
  factors: readonly ContactStewardshipHealthFactor[];
  last_meaningful_contact_at?: string;
  last_meaningful_contact_summary?: string;
  days_since_meaningful_contact?: number;
  open_follow_up_count: number;
};

export type ContactStewardshipRecord = {
  contact_id: string;
  workspace_id: string;
  steward_user_id?: string;
  strength: ContactRelationshipStrength;
  lifecycle_stage: ContactLifecycleStage;
  updated_at: string;
  updated_by_user_id?: string;
};

export type ContactStewardshipView = {
  engine_id: typeof CONTACT_STEWERSHIP_VERSION;
  contact_id: string;
  workspace_id: string;
  stewardship: ContactStewardshipRecord;
  contributors: readonly ContactStewardParticipant[];
  watchers: readonly ContactStewardParticipant[];
  computed: ContactStewardshipComputed;
  transitions: readonly ContactStewardTransition[];
  advisory_summary: ContactStewardshipAdvisorySummary;
};

export type ContactStewardshipAdvisorySummary = {
  advisory: true;
  notice: string;
  summary_text: string;
  uncertainty_notes: readonly string[];
  live_ai_wired: false;
};

export const CONTACT_STEWERSHIP_ADVISORY_NOTICE =
  "Advisory only — stewardship summary cites timeline and assignment history. AI cannot create facts." as const;

export type AssignContactStewardInput = {
  workspace_id: string;
  contact_id: string;
  steward_user_id: string;
  reason?: string;
  created_by_user_id: string;
};

export type UpdateContactStewardshipInput = {
  strength?: ContactRelationshipStrength;
  lifecycle_stage?: ContactLifecycleStage;
  updated_by_user_id: string;
};

export type AddContactStewardParticipantInput = {
  workspace_id: string;
  contact_id: string;
  user_id: string;
  role: ContactStewardParticipantRole;
  label?: string;
  created_by_user_id: string;
};

export type ContactStewardshipDashboardRow = {
  contact_id: string;
  display_name: string;
  steward_user_id?: string;
  strength: ContactRelationshipStrength;
  momentum: ContactRelationshipMomentum;
  health_score: number;
  contributor_count: number;
  days_since_meaningful_contact?: number;
};

export type ContactStewardshipDashboard = {
  engine_id: typeof CONTACT_STEWERSHIP_VERSION;
  workspace_id: string;
  cooling: readonly ContactStewardshipDashboardRow[];
  growing: readonly ContactStewardshipDashboardRow[];
  without_steward: readonly ContactStewardshipDashboardRow[];
  contributors_without_steward: readonly ContactStewardshipDashboardRow[];
};
