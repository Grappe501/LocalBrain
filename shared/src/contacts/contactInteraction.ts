/** CONTACT-V3-014 — Relationship Timeline + Interaction Intelligence contract. */
export const CONTACT_TIMELINE_VERSION = "CONTACT-V3-014" as const;

export const CONTACT_INTERACTION_TYPES = [
  "call",
  "text",
  "email",
  "meeting",
  "door_knock",
  "event",
  "volunteer_shift",
  "donation",
  "note",
  "commitment",
  "follow_up",
] as const;

export type ContactInteractionType = (typeof CONTACT_INTERACTION_TYPES)[number];

export const CONTACT_INTERACTION_VISIBILITY = ["private", "campaign", "leadership"] as const;
export type ContactInteractionVisibility = (typeof CONTACT_INTERACTION_VISIBILITY)[number];

export const CONTACT_INTERACTION_SENTIMENT = [
  "positive",
  "neutral",
  "negative",
  "unknown",
] as const;
export type ContactInteractionSentiment = (typeof CONTACT_INTERACTION_SENTIMENT)[number];

export const CONTACT_INTERACTION_SOURCES = ["manual", "import", "system", "ai_assisted"] as const;
export type ContactInteractionSource = (typeof CONTACT_INTERACTION_SOURCES)[number];

export const CONTACT_USER_ROLES = ["admin", "owner", "organizer", "viewer"] as const;
export type ContactUserRole = (typeof CONTACT_USER_ROLES)[number];

export type ContactInteraction = {
  id: string;
  contact_id: string;
  workspace_id: string;
  type: ContactInteractionType;
  summary: string;
  details: string;
  occurred_at: string;
  created_by_user_id: string;
  assigned_to_user_id?: string;
  visibility: ContactInteractionVisibility;
  sentiment: ContactInteractionSentiment;
  follow_up_required: boolean;
  follow_up_due_at?: string;
  source: ContactInteractionSource;
  context_id?: string;
  created_at: string;
  updated_at: string;
};

export type CreateContactInteractionInput = {
  workspace_id: string;
  contact_id: string;
  type: ContactInteractionType;
  summary: string;
  details?: string;
  occurred_at?: string;
  created_by_user_id: string;
  assigned_to_user_id?: string;
  visibility?: ContactInteractionVisibility;
  sentiment?: ContactInteractionSentiment;
  follow_up_required?: boolean;
  follow_up_due_at?: string;
  source?: ContactInteractionSource;
  context_id?: string;
};

export type UpdateContactInteractionInput = {
  type?: ContactInteractionType;
  summary?: string;
  details?: string;
  occurred_at?: string;
  assigned_to_user_id?: string;
  visibility?: ContactInteractionVisibility;
  sentiment?: ContactInteractionSentiment;
  follow_up_required?: boolean;
  follow_up_due_at?: string | null;
  context_id?: string | null;
};

export type ContactTimelineMeta = {
  contact_id: string;
  workspace_id: string;
  manual_summary: string;
  relationship_owner_user_id?: string;
  pinned_next_step: string;
  updated_at: string;
};

export type UpdateContactTimelineMetaInput = {
  manual_summary?: string;
  relationship_owner_user_id?: string | null;
  pinned_next_step?: string;
};

export type ContactTimelinePinnedSummary = {
  manual_summary: string;
  relationship_owner_user_id?: string;
  last_contact_at?: string;
  last_contact_summary?: string;
  pinned_next_step: string;
  next_follow_up_due_at?: string;
};

export type ContactTimelineAdvisoryCitation = {
  interaction_id: string;
  summary: string;
  occurred_at: string;
};

export type ContactTimelineAdvisorySummary = {
  advisory: true;
  notice: string;
  summary_text: string;
  suggested_next_step: string;
  uncertainty_notes: readonly string[];
  citations: readonly ContactTimelineAdvisoryCitation[];
  live_ai_wired: false;
};

export type ContactFollowUpBucket = "overdue" | "due_today" | "upcoming";

export type ContactFollowUpItem = {
  interaction: ContactInteraction;
  contact_id: string;
  contact_display_name: string;
  bucket: ContactFollowUpBucket;
};

export type ContactTimelineView = {
  engine_id: typeof CONTACT_TIMELINE_VERSION;
  contact_id: string;
  pinned: ContactTimelinePinnedSummary;
  interactions: readonly ContactInteraction[];
  advisory_summary: ContactTimelineAdvisorySummary;
  follow_ups: {
    overdue: readonly ContactFollowUpItem[];
    due_today: readonly ContactFollowUpItem[];
    upcoming: readonly ContactFollowUpItem[];
  };
};

export const CONTACT_TIMELINE_ADVISORY_NOTICE =
  "Advisory only — timeline summary cites logged interactions. AI cannot create facts. No automatic outreach." as const;
