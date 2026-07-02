/** Executive Briefing metadata for CoS context — mirrors Program Office posture. */

import { getExecutiveIntelligenceEraSnapshot } from "../buildState/executiveIntelligenceEraMetrics.js";

export type BriefingSection = {
  title: string;
  lines: string[];
};

export function buildExecutiveBriefingSections(): BriefingSection[] {
  const ei = getExecutiveIntelligenceEraSnapshot();

  const todayPriorities = ei.doctrine_frozen
    ? [
        "1. ENG-EI-001 Constitutional Retrieval — read-only · cite · package evidence",
        "2. Doctrine Fidelity — Articles I–IX · fidelity-first engineering",
        "3. Communications Office — unblocked after ENG-EI-001 acceptance",
      ]
    : ei.mar3_complete
      ? [
          "1. EI-001 doctrine freeze ceremony — tag ei-doctrine-v1.0",
          "2. Executive Intelligence Doctrine — 9 articles · MAR-3 COMPLETE",
          "3. ENG-EI-001 Constitutional Retrieval — AUTHORIZED after freeze",
        ]
      : [
          "1. MAR-3 Executive Intelligence Architecture Review — Q1–Q7",
          "2. Executive Intelligence Doctrine — 9 articles · evidence threshold model",
          "3. EI-001 doctrine freeze ceremony after MAR-3 PASS",
        ];

  const eiEraLines = ei.doctrine_frozen
    ? [
        "ei-doctrine-v1.0 FROZEN · ENG-PMO-006 · ENG-PMO-007 governance refinements",
        "ENG-EI-001 Constitutional Retrieval AUTHORIZED — first code against frozen doctrine",
        "Metric: Doctrine Fidelity (Articles I–IX · 100%)",
      ]
    : [
        "Doctrine AUTHORIZED · Articles I–IX · burden of proof · safe degradation",
        "Sequence: Doctrine → MAR-3 → EI-001 → ENG-EI-001 Constitutional Retrieval",
        "No advisory implementation before ei-doctrine-v1.0 freeze",
      ];

  return [
    {
      title: "Today's priorities",
      lines: todayPriorities,
    },
    {
      title: "Institutional substrates",
      lines: [
        "Episode records · Fact accepts · Artifact preserves · Conversation captures · DecisionCitation justifies",
        "Institutional Cognition Foundation V1 COMPLETE — memory-spec-v1.0 · ENG-PMO-005",
      ],
    },
    {
      title: "Executive Intelligence Era",
      lines: eiEraLines,
    },
    {
      title: "Memory OS",
      lines: [
        "✓ 001.1 Episode · ✓ 001.2 Fact · ✓ 001.3 Artifact · ✓ 001.4 Conversation · ✓ 001.5 DecisionCitation",
        "80 memory storage tests · memory-spec-v1.0 frozen · 107/107 MEM-008 PASS · Module 100%",
      ],
    },
    {
      title: "Certified modules",
      lines: [
        "Executive Office · Empty Brain Factory · Capability Graph · Experience — locked",
        ei.doctrine_frozen
          ? "Communications awaits ENG-EI-001 Constitutional Retrieval"
          : "Communications awaits EI-001 doctrine freeze",
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
}

/** @deprecated Prefer buildExecutiveBriefingSections() — kept for importers expecting a constant. */
export const EXECUTIVE_BRIEFING_SECTIONS = buildExecutiveBriefingSections();

export function briefingAsContextText(): string {
  return buildExecutiveBriefingSections()
    .map((s) => `${s.title}:\n${s.lines.map((l) => `- ${l}`).join("\n")}`)
    .join("\n\n");
}
