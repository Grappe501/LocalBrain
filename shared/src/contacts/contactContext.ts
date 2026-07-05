/** CONTACT-V3-016.1 — Relationship Context Engine contract. */
export const CONTACT_CONTEXT_VERSION = "CONTACT-V3-016.1" as const;

export const CONTACT_CONTEXT_CATEGORIES = [
  "campaign",
  "civic",
  "professional",
  "program",
  "other",
] as const;
export type ContactContextCategory = (typeof CONTACT_CONTEXT_CATEGORIES)[number];

export const CONTACT_CONTEXT_STATUSES = ["active", "archived"] as const;
export type ContactContextStatus = (typeof CONTACT_CONTEXT_STATUSES)[number];

export const CONTACT_CONTEXT_RANKS = ["primary", "secondary"] as const;
export type ContactContextRank = (typeof CONTACT_CONTEXT_RANKS)[number];

export const CONTACT_CONTEXT_SOURCES = ["manual", "import", "inferred_advisory"] as const;
export type ContactContextSource = (typeof CONTACT_CONTEXT_SOURCES)[number];

export const CONTACT_CONTEXT_LINK_ACTIONS = [
  "assigned",
  "rank_changed",
  "ended",
  "merged",
] as const;
export type ContactContextLinkAction = (typeof CONTACT_CONTEXT_LINK_ACTIONS)[number];

export type RelationshipContext = {
  context_id: string;
  workspace_id: string;
  label: string;
  category: ContactContextCategory;
  status: ContactContextStatus;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type CreateRelationshipContextInput = {
  workspace_id: string;
  label: string;
  category?: ContactContextCategory;
  created_by_user_id: string;
};

export type UpdateRelationshipContextInput = {
  label?: string;
  category?: ContactContextCategory;
};

export type MergeRelationshipContextsInput = {
  workspace_id: string;
  from_context_id: string;
  to_context_id: string;
  merged_by_user_id: string;
  reason?: string;
};

export type ContactContextLink = {
  link_id: string;
  workspace_id: string;
  contact_id: string;
  context_id: string;
  rank: ContactContextRank;
  effective_from: string;
  effective_until?: string;
  source: ContactContextSource;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export type AssignContactContextInput = {
  workspace_id: string;
  contact_id: string;
  context_id: string;
  rank?: ContactContextRank;
  effective_from?: string;
  source?: ContactContextSource;
  created_by_user_id: string;
  reason?: string;
};

export type UpdateContactContextLinkInput = {
  rank?: ContactContextRank;
  effective_from?: string;
  reason?: string;
};

export type EndContactContextLinkInput = {
  effective_until?: string;
  reason?: string;
  ended_by_user_id: string;
};

export type ContactContextLinkWithContext = ContactContextLink & {
  context: RelationshipContext;
};

export type ContactContextLinkHistoryEntry = {
  history_id: string;
  workspace_id: string;
  contact_id: string;
  context_id: string;
  link_id?: string;
  action: ContactContextLinkAction;
  reason: string;
  payload_json: string;
  created_by_user_id: string;
  created_at: string;
};

export type ContactContextView = {
  engine_id: typeof CONTACT_CONTEXT_VERSION;
  contact_id: string;
  workspace_id: string;
  links: readonly ContactContextLinkWithContext[];
};
