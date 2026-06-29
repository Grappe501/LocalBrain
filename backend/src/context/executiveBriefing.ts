/** Executive Briefing metadata for CoS context — mirrors frontend mock (LB-OS-002). */

export type BriefingSection = {
  title: string;
  lines: string[];
};

export const EXECUTIVE_BRIEFING_SECTIONS: BriefingSection[] = [
  {
    title: "Today's priorities",
    lines: [
      "1. LocalBrain — continue OS slice queue (LB-OS-008+)",
      "2. Review workspace focus and asset intelligence recommendations",
      "3. Keep filesystem tools disabled until approval gates ship",
    ],
  },
  {
    title: "Calendar",
    lines: ["Deep work block available — command layer + registry context"],
  },
  {
    title: "Projects at risk",
    lines: ["Review dormant assets and duplicate candidates in Knowledge Explorer"],
  },
  {
    title: "Token spend",
    lines: ["Tracked after LB-OS-008 command layer connects"],
  },
  {
    title: "System health",
    lines: ["Permission engine active · Digital Asset Registry online"],
  },
];

export function briefingAsContextText(): string {
  return EXECUTIVE_BRIEFING_SECTIONS.map(
    (s) => `${s.title}:\n${s.lines.map((l) => `- ${l}`).join("\n")}`,
  ).join("\n\n");
}
