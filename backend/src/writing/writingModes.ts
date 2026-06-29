import type { WritingMode } from "@localbrain/shared";

export const WRITING_MODES: WritingMode[] = [
  {
    id: "novel_studio",
    label: "Novel Studio",
    studio_label: "Novel Studio",
    description: "Historical fiction canon, continuity, chapters, and scene inventory.",
    example_outputs: ["Scene draft", "Continuity note", "Character voice pass"],
  },
  {
    id: "campaign_writing",
    label: "Campaign Writing",
    studio_label: "Campaign",
    description: "Kelly voice, voter contact, fundraising, and field messaging.",
    example_outputs: ["Fundraising email draft", "Walk script", "Volunteer brief"],
  },
  {
    id: "substack_blog",
    label: "Substack / Blog",
    studio_label: "Long-form",
    description: "Investigative civic posts, faith crossover, RedDirt-style essays.",
    example_outputs: ["Substack draft", "Newsletter intro", "Series outline"],
  },
  {
    id: "speech_debate",
    label: "Speeches & Debate Prep",
    studio_label: "Speech",
    description: "Rallies, town halls, Q&A blocks, rebuttals, and fact sheets.",
    example_outputs: ["5-minute stump", "Debate rebuttal", "Town hall opener"],
  },
  {
    id: "grant_strategy",
    label: "Grant & Strategy",
    studio_label: "Strategy",
    description: "Grant narratives, LOI language, strategy memos, lane documents.",
    example_outputs: ["Grant narrative", "Strategy memo", "LOI draft"],
  },
  {
    id: "social_draft",
    label: "Social Drafts",
    studio_label: "Social",
    description: "Short-form posts and threads — draft only, no auto-publishing.",
    example_outputs: ["X thread", "Facebook post", "Caption set"],
  },
];

export function getWritingMode(id: string): WritingMode | undefined {
  return WRITING_MODES.find((m) => m.id === id);
}

export function modesForWorkspaceType(workspaceType: string): WritingMode["id"][] {
  switch (workspaceType) {
    case "novel":
      return ["novel_studio", "substack_blog"];
    case "campaign":
      return ["campaign_writing", "speech_debate", "social_draft", "grant_strategy"];
    case "research":
      return ["grant_strategy", "substack_blog", "speech_debate"];
    case "executive":
    case "meta":
      return ["grant_strategy", "substack_blog", "speech_debate"];
    default:
      return ["substack_blog", "grant_strategy", "social_draft"];
  }
}
