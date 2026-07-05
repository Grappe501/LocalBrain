/** CONTACT-V3-020 — AI Contact Briefs (Advisory-Only) contract. */
export const CONTACT_BRIEF_VERSION = "CONTACT-V3-020" as const;

export const BRIEF_CONFIDENCE_RATINGS = ["high", "medium", "low"] as const;
export type BriefConfidenceRating = (typeof BRIEF_CONFIDENCE_RATINGS)[number];

export const BRIEF_EVIDENCE_ENGINES = [
  "timeline",
  "context",
  "stewardship",
  "household",
  "organization",
  "action",
] as const;
export type BriefEvidenceEngine = (typeof BRIEF_EVIDENCE_ENGINES)[number];

export const BRIEF_RECOMMENDATION_CATEGORIES = [
  "follow_up",
  "leadership",
  "volunteer",
  "verify",
  "household",
  "introduction",
  "other",
] as const;
export type BriefRecommendationCategory = (typeof BRIEF_RECOMMENDATION_CATEGORIES)[number];

export type EvidenceCitation = {
  citation_id: string;
  engine_id: BriefEvidenceEngine;
  source_type: string;
  source_id?: string;
  label: string;
  detail: string;
  occurred_at?: string;
};

export type BriefSection = {
  section_id: string;
  title: string;
  body?: string;
  citations: readonly EvidenceCitation[];
  withheld: boolean;
  withheld_reason?: string;
};

export type AdvisoryRecommendation = {
  recommendation_id: string;
  title: string;
  rationale: string;
  confidence: BriefConfidenceRating;
  category: BriefRecommendationCategory;
  citations: readonly EvidenceCitation[];
  why: string;
};

export type BriefGenerationMetadata = {
  generated_at: string;
  generated_by_user_id: string;
  regeneration_count: number;
  operator_approved: boolean;
  operator_approved_by_user_id?: string;
  operator_approved_at?: string;
  source_engines: readonly BriefEvidenceEngine[];
  live_ai_wired: false;
};

export type BriefSummary = {
  contact_display_name: string;
  has_substantive_evidence: boolean;
  open_action_count: number;
  momentum?: string;
  steward_user_id?: string;
};

export type ContactBrief = {
  engine_id: typeof CONTACT_BRIEF_VERSION;
  contact_id: string;
  workspace_id: string;
  advisory: true;
  notice: string;
  summary: BriefSummary;
  executive_summary?: string;
  sections: readonly BriefSection[];
  opportunities: readonly AdvisoryRecommendation[];
  risks: readonly AdvisoryRecommendation[];
  recommendations: readonly AdvisoryRecommendation[];
  evidence: readonly EvidenceCitation[];
  metadata: BriefGenerationMetadata;
};

export type ContactBriefEvidenceView = {
  engine_id: typeof CONTACT_BRIEF_VERSION;
  contact_id: string;
  workspace_id: string;
  evidence: readonly EvidenceCitation[];
  metadata: BriefGenerationMetadata;
};

export const CONTACT_BRIEF_ADVISORY_NOTICE =
  "Advisory only — brief synthesizes verified engine evidence. Summarize, don't speculate. No automatic outreach." as const;
