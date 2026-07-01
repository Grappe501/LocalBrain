/** Executive Briefing metadata for CoS context — mirrors Program Office posture. */

export type BriefingSection = {
  title: string;
  lines: string[];
};

export const EXECUTIVE_BRIEFING_SECTIONS: BriefingSection[] = [
  {
    title: "Today's priorities",
    lines: [
      "1. Institutional Cognition Foundation COMPLETE — Wave 1 · 5/5 substrates",
      "2. Executive Intelligence Era authorized — reason over deterministic memory",
      "3. Program Office dashboards reflect constitutional completion (ENG-PMO-005)",
    ],
  },
  {
    title: "Institutional substrates",
    lines: [
      "Episode records · Fact accepts · Artifact preserves · Conversation captures · DecisionCitation justifies",
      "Deterministic Foundation CLOSED — Executive Intelligence remains advisory",
    ],
  },
  {
    title: "Memory OS Wave 1",
    lines: [
      "✓ 001.1 Episode · ✓ 001.2 Fact · ✓ 001.3 Artifact · ✓ 001.4 Conversation · ✓ 001.5 DecisionCitation",
      "ENG-PMO-005 COMPLETE · Reference Slices 001–005 · 80 memory storage tests · memory-spec-v1.0 frozen · 107/107 MEM-008 PASS",
    ],
  },
  {
    title: "Certified modules",
    lines: [
      "Executive Office · Empty Brain Factory · Capability Graph · Experience — locked",
      "Memory OS Wave 1 complete — Communications Office unblocked",
    ],
  },
  {
    title: "System health",
    lines: [
      "Factory regression lock active · Convention closed · Theory v1.0 frozen",
      "Permission engine active · Program Office CEO Mode operational",
    ],
  },
];

export function briefingAsContextText(): string {
  return EXECUTIVE_BRIEFING_SECTIONS.map(
    (s) => `${s.title}:\n${s.lines.map((l) => `- ${l}`).join("\n")}`,
  ).join("\n\n");
}
