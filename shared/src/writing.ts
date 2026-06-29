/** Writing Department contracts — LB-OS-013 (draft/preview only) */

export type WritingModeId =
  | "novel_studio"
  | "campaign_writing"
  | "substack_blog"
  | "speech_debate"
  | "grant_strategy"
  | "social_draft";

export type WritingVoiceId =
  | "steve_strategic"
  | "kelly_campaign"
  | "jeb_crawse"
  | "grant_professional"
  | "tv_debate"
  | "investigative_blog"
  | "historical_novel";

export interface WritingMode {
  id: WritingModeId;
  label: string;
  description: string;
  studio_label: string;
  example_outputs: string[];
}

export interface WritingVoice {
  id: WritingVoiceId;
  label: string;
  description: string;
  best_for: string[];
  tone_notes: string;
}

export interface WritingScoreFactor {
  id: string;
  name: string;
  score: number;
  weight: number;
  detail: string;
}

export interface WritingScore {
  score: number;
  label: "strong" | "solid" | "needs_attention";
  summary: string;
  factors: WritingScoreFactor[];
}

export interface WritingRecommendation {
  what: string;
  why: string;
  confidence: "high" | "medium" | "low";
  if_approved: string;
}

export interface WritingProjectSummary {
  workspace_id: string;
  title: string;
  workspace_type: string;
  status: string;
  current_focus: string;
  suggested_modes: WritingModeId[];
}

export interface WritingSourceFile {
  path: string;
  name: string;
  kind: string;
  size_bytes: number | null;
  allowed: boolean;
}

export interface WritingDraftPreview {
  mode_id: WritingModeId;
  voice_id: WritingVoiceId;
  workspace_id: string;
  topic: string;
  markdown: string;
  source_paths: string[];
  read_only: true;
  publish_blocked: true;
}

export interface NarrativeCatalogEntry {
  id: string;
  kind: "mode" | "voice" | "workspace" | "project";
  label: string;
  links: string[];
}

export interface WritingOverview {
  writing_score: WritingScore;
  guardrails: string[];
  chief_recommendation: WritingRecommendation;
  modes: WritingMode[];
  voices: WritingVoice[];
  projects: WritingProjectSummary[];
  narrative_catalog: NarrativeCatalogEntry[];
  active_draft_count: number;
  read_only: true;
  observed_at: string;
}
