/** Writing specialist routing stub — LB-OS-013 */

export const WRITING_SPECIALISTS = [
  { id: "writing_chief", name: "Writing Chief", focus: "Triage, voice selection, narrative synthesis" },
  { id: "novel_specialist", name: "Novel Specialist", focus: "Canon, continuity, scenes" },
  { id: "campaign_copywriter", name: "Campaign Copywriter", focus: "Field, fundraising, voter contact" },
  { id: "speechwriter", name: "Speechwriter", focus: "Stump, debate, town hall" },
  { id: "grant_writer", name: "Grant Writer", focus: "Narratives, LOIs, strategy memos" },
  { id: "blog_writer", name: "Blog / Substack Writer", focus: "Long-form civic and faith crossover" },
  { id: "social_drafter", name: "Social Drafter", focus: "Short-form drafts — no posting" },
  { id: "voice_editor", name: "Voice Editor", focus: "Style pass, tone consistency" },
] as const;

export function routeWritingSpecialist(intent: string): string {
  const lower = intent.toLowerCase();
  if (lower.includes("novel") || lower.includes("canon")) return "novel_specialist";
  if (lower.includes("campaign") || lower.includes("fundraising")) return "campaign_copywriter";
  if (lower.includes("speech") || lower.includes("debate")) return "speechwriter";
  if (lower.includes("grant") || lower.includes("strategy")) return "grant_writer";
  if (lower.includes("substack") || lower.includes("blog")) return "blog_writer";
  if (lower.includes("social") || lower.includes("post")) return "social_drafter";
  if (lower.includes("voice") || lower.includes("tone")) return "voice_editor";
  return "writing_chief";
}
