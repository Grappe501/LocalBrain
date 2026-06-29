import type { WritingVoice } from "@localbrain/shared";

export const WRITING_VOICES: WritingVoice[] = [
  {
    id: "steve_strategic",
    label: "Steve — Strategic",
    description: "Executive clarity, systems thinking, long-range framing.",
    best_for: ["grant_strategy", "substack_blog", "speech_debate"],
    tone_notes: "Direct, evidence-led, builder mindset. Avoid hype.",
  },
  {
    id: "kelly_campaign",
    label: "Kelly — Campaign",
    description: "Warm, urgent, community-first campaign voice.",
    best_for: ["campaign_writing", "social_draft", "speech_debate"],
    tone_notes: "Inclusive, action-oriented, Oklahoma roots.",
  },
  {
    id: "jeb_crawse",
    label: "Jeb Crawse",
    description: "Distinct character/narrator voice for fiction and monologue.",
    best_for: ["novel_studio"],
    tone_notes: "Period-appropriate, grounded, wry when earned.",
  },
  {
    id: "grant_professional",
    label: "Grant / Professional",
    description: "Formal nonprofit and institutional narrative voice.",
    best_for: ["grant_strategy"],
    tone_notes: "Outcome metrics, compliance-aware, funder-facing.",
  },
  {
    id: "tv_debate",
    label: "TV / Debate",
    description: "Punchy broadcast cadence with clear sound bites.",
    best_for: ["speech_debate", "social_draft"],
    tone_notes: "Short sentences. Repeat the thesis. Land the close.",
  },
  {
    id: "investigative_blog",
    label: "Investigative Blog",
    description: "RedDirt-style civic accountability and deep context.",
    best_for: ["substack_blog", "campaign_writing"],
    tone_notes: "Show receipts. Name names when sourced. No filler.",
  },
  {
    id: "historical_novel",
    label: "Historical Novel",
    description: "Period fiction voice with canon discipline.",
    best_for: ["novel_studio"],
    tone_notes: "Sensory detail, dated diction, continuity with timeline.",
  },
];

export function getWritingVoice(id: string): WritingVoice | undefined {
  return WRITING_VOICES.find((v) => v.id === id);
}
