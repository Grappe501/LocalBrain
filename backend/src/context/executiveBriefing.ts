/** Executive Briefing metadata for CoS context — mirrors Program Office posture. */

export type BriefingSection = {
  title: string;
  lines: string[];
};

export const EXECUTIVE_BRIEFING_SECTIONS: BriefingSection[] = [
  {
    title: "Today's priorities",
    lines: [
      "1. Memory OS — ENG-MEM-001.3.2 Artifact chain of custody (Wave 1 · 2/5 slices complete)",
      "2. Preserve authenticity-survives-custody invariant — no OCR · extraction · AI on Artifact",
      "3. Program Office dashboards reflect Episode · Fact · Artifact substrate progress",
    ],
  },
  {
    title: "Institutional substrates",
    lines: [
      "Episode records · Fact accepts · Artifact preserves — three non-overlapping verbs",
      "Active: Artifact custody events · actor · timestamps · stewardship only",
    ],
  },
  {
    title: "Memory OS Wave 1",
    lines: [
      "✓ 001.1 Episode · ✓ 001.2 Fact · ▶ 001.3 Artifact (001.3.1 PMO complete · 001.3.2 active)",
      "45 storage tests · memory-spec-v1.0 frozen · 107/107 MEM-008 PASS",
    ],
  },
  {
    title: "Certified modules",
    lines: [
      "Executive Office · Empty Brain Factory · Capability Graph · Experience — locked",
      "Memory OS in progress — Communications Office blocked until Wave 1 closes",
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
