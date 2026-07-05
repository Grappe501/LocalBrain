/** CONTACT-V3-021 — Relationship Analytics & Campaign Health Dashboard contract. */

import type {
  ContactLifecycleStage,
  ContactRelationshipMomentum,
  ContactRelationshipStrength,
} from "./contactStewardship.js";

export const CONTACT_RELATIONSHIP_ANALYTICS_VERSION = "CONTACT-V3-021" as const;

export const RELATIONSHIP_ANALYTICS_SOURCE_ENGINES = [
  "timeline",
  "context",
  "stewardship",
  "household",
  "organization",
  "action",
] as const;

export type RelationshipAnalyticsSourceEngine =
  (typeof RELATIONSHIP_ANALYTICS_SOURCE_ENGINES)[number];

export type RelationshipAnalyticsFilter = {
  tag?: string;
  context_id?: string;
  strength?: ContactRelationshipStrength;
  momentum?: ContactRelationshipMomentum;
  health_label?: string;
};

export type RelationshipAnalyticsContactRow = {
  contact_id: string;
  display_name: string;
  steward_user_id?: string;
  strength: ContactRelationshipStrength;
  lifecycle_stage: ContactLifecycleStage;
  momentum: ContactRelationshipMomentum;
  health_score: number;
  health_label: string;
  days_since_meaningful_contact?: number;
  contributor_count: number;
  open_action_count: number;
  overdue_action_count: number;
  interaction_count: number;
  primary_context_labels: readonly string[];
  tags: readonly string[];
  has_org_leadership: boolean;
  evidence_summary: string;
};

export type RelationshipAnalyticsStewardLoad = {
  steward_user_id: string;
  contact_count: number;
  cooling_count: number;
  without_recent_contact_count: number;
};

export type RelationshipAnalyticsPortfolio = {
  total_contacts: number;
  stewarded_count: number;
  unowned_count: number;
  steward_coverage_percent: number;
  momentum_growing: number;
  momentum_stable: number;
  momentum_cooling: number;
  momentum_dormant: number;
  momentum_lost: number;
  open_actions_total: number;
  overdue_actions_total: number;
};

export type RelationshipAnalyticsDashboard = {
  engine_id: typeof CONTACT_RELATIONSHIP_ANALYTICS_VERSION;
  workspace_id: string;
  advisory: true;
  notice: string;
  computed_at: string;
  filters_applied: RelationshipAnalyticsFilter;
  portfolio: RelationshipAnalyticsPortfolio;
  without_steward: readonly RelationshipAnalyticsContactRow[];
  contributors_without_steward: readonly RelationshipAnalyticsContactRow[];
  cooling: readonly RelationshipAnalyticsContactRow[];
  growing: readonly RelationshipAnalyticsContactRow[];
  overloaded_stewards: readonly RelationshipAnalyticsStewardLoad[];
  ignored_volunteers: readonly RelationshipAnalyticsContactRow[];
  cold_donors: readonly RelationshipAnalyticsContactRow[];
  inactive_leaders: readonly RelationshipAnalyticsContactRow[];
  action_backlog: readonly RelationshipAnalyticsContactRow[];
  source_engines: readonly RelationshipAnalyticsSourceEngine[];
};

export type RelationshipAnalyticsExport = {
  engine_id: typeof CONTACT_RELATIONSHIP_ANALYTICS_VERSION;
  workspace_id: string;
  computed_at: string;
  filters_applied: RelationshipAnalyticsFilter;
  portfolio: RelationshipAnalyticsPortfolio;
  contacts: readonly RelationshipAnalyticsContactRow[];
};

export const CONTACT_RELATIONSHIP_ANALYTICS_NOTICE =
  "Advisory only — aggregates verified engine evidence across the portfolio. Summarize, don't speculate. No automatic outreach." as const;

/** Stewards managing at or above this count appear in overloaded_stewards. */
export const RELATIONSHIP_ANALYTICS_OVERLOAD_THRESHOLD = 10;
