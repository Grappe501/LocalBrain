import type { CommandActionClass } from "@localbrain/shared";

export type ActionClassification = {
  action_class: CommandActionClass;
  intent_hint: string;
};

const RULES: { action_class: CommandActionClass; patterns: RegExp[] }[] = [
  {
    action_class: "focus_priority",
    patterns: [
      /\bfocus\b/i,
      /\bpriorit/i,
      /\bwhat should i (work on|do|focus)/i,
      /\bnext (step|action|task)/i,
      /\btoday'?s plan/i,
    ],
  },
  {
    action_class: "workspace_explain",
    patterns: [
      /\bexplain (the )?(current )?workspace/i,
      /\bworkspace context/i,
      /\bliving workspace/i,
      /\bwhat is (this|the) workspace/i,
    ],
  },
  {
    action_class: "asset_stale",
    patterns: [
      /\bstale\b/i,
      /\bdormant\b/i,
      /\barchive candidate/i,
      /\bduplicate/i,
      /\bflagged\b/i,
      /\basset intelligence/i,
      /\bwhy is (this|it) (flagged|stale)/i,
    ],
  },
  {
    action_class: "file_summarize",
    patterns: [
      /\bsummarize (this )?(file|asset|folder|selected)\b/i,
      /\bask cos about\b/i,
      /\babout this asset\b/i,
      /\bfolder manifest\b/i,
    ],
  },
  {
    action_class: "file_read",
    patterns: [/\bread (this )?(file|content)\b/i, /\bshow (file )?content\b/i],
  },
  {
    action_class: "briefing_summary",
    patterns: [
      /\bbriefing\b/i,
      /\bexecutive briefing/i,
      /\bsummarize (my )?(executive )?briefing/i,
      /\bgood morning/i,
    ],
  },
];

export function classifyCommand(message: string): ActionClassification {
  const text = message.trim();
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      return { action_class: rule.action_class, intent_hint: rule.action_class };
    }
  }
  return { action_class: "general_query", intent_hint: "general" };
}

export function actionClassToIntent(
  actionClass: CommandActionClass,
): "FOCUS_NEXT" | "EXPLAIN_WORKSPACE" | "ASSET_INTELLIGENCE" | "BRIEFING_SUMMARY" | "FILE_READ" | "FILE_SUMMARIZE" | "GENERAL" {
  switch (actionClass) {
    case "focus_priority":
      return "FOCUS_NEXT";
    case "workspace_explain":
      return "EXPLAIN_WORKSPACE";
    case "asset_stale":
      return "ASSET_INTELLIGENCE";
    case "briefing_summary":
      return "BRIEFING_SUMMARY";
    case "file_read":
      return "FILE_READ";
    case "file_summarize":
      return "FILE_SUMMARIZE";
    default:
      return "GENERAL";
  }
}

/** Rough token estimate stub — chars / 4 heuristic */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
