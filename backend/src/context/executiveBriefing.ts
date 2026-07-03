/** Executive Briefing metadata for CoS context — mirrors Program Office posture. */

import { getCommunicationsOfficeSnapshot } from "../buildState/communicationsOfficeMetrics.js";
import { getExecutiveIntelligenceEraSnapshot } from "../buildState/executiveIntelligenceEraMetrics.js";

export type BriefingSection = {
  title: string;
  lines: string[];
};

export function buildExecutiveBriefingSections(): BriefingSection[] {
  const ei = getExecutiveIntelligenceEraSnapshot();
  const com = getCommunicationsOfficeSnapshot();
  const comActive = ei.work_product_complete && com.office_started;

  const todayPriorities = comActive
    ? com.slice_001_3_complete
      ? [
          "1. ENG-COM-001.3 COMPLETE · ENG-PMO-012 — advisory restraint inherited",
          "2. Inherited: traceability (C1–C5) · uncertainty (U1–U5) · advisory restraint (A1–A5)",
          "3. Next authority: Communications Office module evaluation — not engineering",
        ]
      : com.slice_001_3_implementation_frozen && !com.slice_001_3_complete
      ? [
          "1. ENG-COM-001.3 IMPLEMENTATION FROZEN — A1–A5 evidence submitted · ENG-PMO-012 PENDING",
          "2. Inherited: traceability (C1–C5) · uncertainty (U1–U5) — not under evaluation",
          "3. No optimization before acceptance — engineering stops at evidence freeze",
        ]
      : com.slice_001_3_authorized && !com.slice_001_3_complete
      ? [
          "1. ENG-COM-001.3 AUTHORIZED — active crossing · advisory restraint under ambiguity",
          "2. Inherited: traceability (C1–C5) · uncertainty (U1–U5) — not under evaluation",
          "3. Implement only enough to produce A1–A5 behavioral evidence — then stop",
        ]
      : com.slice_001_2_complete && com.baseline_stable
      ? [
          "1. Stable baseline — inherited traceability + uncertainty · no active architectural uncertainty",
          "2. ENG-COM-001.1 + 001.2 COMPLETE · ENG-PMO-010 + ENG-PMO-011 · 11/11 behavioral tests",
          "3. Next crossing reserved — ENG-COM-001.3 Advisory Restraint · authorization required",
        ]
      : com.slice_001_2_implementation_frozen
      ? [
          "1. ENG-COM-001.2 IMPLEMENTATION FROZEN — evidence submitted · ENG-PMO-011 PENDING",
          "2. Uncertainty must survive probabilistic rewriting — U1–U5 under PMO review",
          "3. No optimization before acceptance — traceability inherited from ENG-COM-001.1",
        ]
      : com.slice_001_1_complete
        ? [
            "1. ENG-COM-001.1 COMPLETE · ENG-PMO-010 · traceability earned",
            "2. ENG-COM-001.2 Uncertainty Preservation — active behavioral question",
            "3. Probabilistic generation must not reduce, hide, or overstate uncertainty",
          ]
        : [
            "1. ENG-COM-001 AUTHORIZED — bounded probabilistic language generation",
            "2. One architectural question per slice — traceability first",
            "3. ENG-COM-001.1 Traceable Draft Generation — smallest next executable slice",
          ]
    : ei.work_product_complete
      ? [
          "1. Deterministic executive pipeline closed — Reference Consumer 001 · ENG-PMO-009",
          "2. Probabilistic reasoning must inhabit interfaces — not violate them",
          "3. Communications Office — next platform module",
        ]
      : ei.work_product_started
        ? [
            "1. ENG-EI-002 quality phase — behavioral fidelity · citation grouping · omissions",
            "2. Work Product Contract candidate — every assertion traceable to package",
            "3. ENG-EI-002.2 — still no recommendations · no prioritization",
          ]
        : ei.retrieval_complete
          ? [
              "1. ENG-EI-002 Executive Brief — first Evidence Package consumer · Lane 2",
              "2. Work Product Contract candidate — every assertion traceable to package",
              "3. No recommendations · no prioritization · doctrine-compliant brief only",
            ]
          : ei.implementation_started
            ? [
                "1. ENG-EI-001 quality phase — completeness · exclusion reasons · citation integrity",
                "2. Evidence Package Contract — retrieval without making it smarter",
                "3. ENG-EI-001 charter acceptance (A1–A9) before Communications Office",
              ]
            : ei.doctrine_frozen
              ? [
                  "1. ENG-EI-001.1 Constitutional Retrieval — read-only · cite · package evidence",
                  "2. Doctrine Fidelity — Articles I–IX · fidelity-first engineering",
                  "3. Evidence Package Contract — constitutional bridge to Executive Intelligence",
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

  const eiEraLines = ei.work_product_complete
    ? [
        "ENG-EI-002 COMPLETE · ENG-PMO-009 · Reference Consumer 001",
        `Work Product Contract ${ei.work_product_contract_version ?? "ENG-EI-002.2"} · ${ei.brief_tests_count}/${ei.brief_tests_count} brief tests`,
        "Deterministic pipeline closed — Memory → Retrieval → Evidence Package → Executive Brief",
      ]
    : ei.work_product_started
      ? [
          `ENG-EI-002 IN PROGRESS · ${ei.work_product_slices_complete.join(" · ")} COMPLETE`,
          `Work Product Contract ${ei.work_product_contract_version ?? "ENG-EI-002"} · ${ei.brief_tests_count}/${ei.brief_tests_count} brief tests`,
          `Evidence Package ${ei.retrieval_contract_version ?? "ENG-EI-001.3"} · Lane 2 · faithful consumption`,
        ]
      : ei.retrieval_complete
        ? [
            "ENG-EI-001 COMPLETE · ENG-PMO-008 · ENG-EI-DOC-003",
            `Evidence Package Contract ${ei.retrieval_contract_version ?? "ENG-EI-001.3"} · ${ei.retrieval_tests_count}/${ei.retrieval_tests_count} retrieval tests`,
            "Constitutional Retrieval complete — Executive Intelligence consumes, does not revalidate",
          ]
        : ei.implementation_started
          ? [
              `ENG-EI-001 IN PROGRESS · ${ei.impl_slices_complete.join(" · ")} COMPLETE`,
              `Evidence Package Contract ${ei.retrieval_contract_version ?? "ENG-EI-001"} · ${ei.retrieval_tests_count}/${ei.retrieval_tests_count} retrieval tests`,
              `${ei.implementation_phase} phase · Doctrine Fidelity · without making it smarter`,
            ]
          : ei.doctrine_frozen
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

  const comLines = com.slice_001_3_complete
    ? [
        `ENG-COM-001.3 COMPLETE · ENG-PMO-012 · Contract ${com.contract_version ?? "ENG-COM-001.3"} · ${com.advisory_tests_count}/${com.advisory_tests_count} advisory tests`,
        "Inherited: traceability · uncertainty preservation · advisory restraint",
        "Next: Communications Office module evaluation — separate gate from slice acceptance",
      ]
    : com.slice_001_3_implementation_frozen && !com.slice_001_3_complete
    ? [
        `ENG-COM-001.3 IMPLEMENTATION FROZEN · Contract ${com.contract_version ?? "ENG-COM-001.3"} · ${com.advisory_tests_count}/${com.advisory_tests_count} advisory tests`,
        "Inherited: traceability · uncertainty preservation · deterministic interfaces",
        "ENG-PMO-012 PENDING — can advisory boundaries hold under ambiguous prompts?",
      ]
    : com.slice_001_3_authorized && !com.slice_001_3_complete
    ? [
        "ENG-COM-001.3 AUTHORIZED · Advisory Restraint · active crossing",
        "Inherited: traceability · uncertainty preservation · deterministic interfaces",
        "Behavioral question: can the inhabitant remain advisory under ambiguous prompts?",
      ]
    : com.slice_001_2_complete && com.baseline_stable
    ? [
        "Stable baseline · inherited: traceability (C1–C5) · uncertainty preservation (U1–U5)",
        `ENG-COM-001.1 + 001.2 COMPLETE · ENG-PMO-010 + ENG-PMO-011 · Contract ${com.contract_version ?? "ENG-COM-001.2"} · 11/11 tests`,
        "No active architectural uncertainty · ENG-COM-001.3 reserved · authorization required",
      ]
    : com.slice_001_2_implementation_frozen
    ? [
        "ENG-COM-001.1 COMPLETE · ENG-PMO-010 · traceability C1–C5 earned",
        `ENG-COM-001.2 IMPLEMENTATION FROZEN · Contract ${com.contract_version ?? "ENG-COM-001.2"} · ${com.uncertainty_tests_count}/${com.uncertainty_tests_count} uncertainty · ${com.traceability_tests_count}/${com.traceability_tests_count} traceability`,
        "ENG-PMO-011 PENDING — can uncertainty survive probabilistic rewriting?",
      ]
    : com.slice_001_1_complete
      ? [
          "ENG-COM-001.1 COMPLETE · ENG-PMO-010 · traceability C1–C5 earned",
          `${com.traceability_tests_count}/${com.traceability_tests_count} traceability tests · Contract ENG-COM-001.1`,
          "ENG-COM-001.2 Uncertainty Preservation — active slice",
        ]
      : [
          "ENG-COM-001 AUTHORIZED · bounded probabilistic language generation",
          "One architectural question per slice · composed validators",
          "ENG-COM-001.1 Traceable Draft Generation — smallest next slice",
        ];

  const sections: BriefingSection[] = [
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
  ];

  if (comActive) {
    sections.push({
      title: "Communications Office",
      lines: comLines,
    });
  }

  sections.push(
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
        comActive
          ? com.slice_001_3_complete
            ? "Communications Office IN PROGRESS · ENG-COM-001.3 COMPLETE · module evaluation next"
            : com.slice_001_3_implementation_frozen && !com.slice_001_3_complete
            ? "Communications Office IN PROGRESS · ENG-COM-001.3 FROZEN · ENG-PMO-012 pending"
            : com.slice_001_3_authorized && !com.slice_001_3_complete
            ? "Communications Office IN PROGRESS · ENG-COM-001.3 active crossing"
            : com.slice_001_2_complete && com.baseline_stable
              ? "Communications Office · stable baseline · inherited capabilities · 001.3 reserved"
              : com.slice_001_2_implementation_frozen
              ? "Communications Office IN PROGRESS · ENG-PMO-011 pending · Commercial Beta awaits"
              : com.slice_001_1_complete
              ? "Communications Office IN PROGRESS · ENG-COM-001.2 active"
              : "Communications Office AUTHORIZED · ENG-COM-001.1 next"
          : ei.work_product_complete
            ? "Communications Office pending — deterministic pipeline complete"
            : ei.work_product_started
              ? "Communications awaits ENG-EI-002 charter acceptance"
              : ei.retrieval_complete
                ? "Communications awaits ENG-EI-002 Executive Brief"
                : ei.implementation_started
                  ? "Communications awaits ENG-EI-001 charter acceptance"
                  : ei.doctrine_frozen
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
  );

  return sections;
}

/** @deprecated Prefer buildExecutiveBriefingSections() — kept for importers expecting a constant. */
export const EXECUTIVE_BRIEFING_SECTIONS = buildExecutiveBriefingSections();

export function briefingAsContextText(): string {
  return buildExecutiveBriefingSections()
    .map((s) => `${s.title}:\n${s.lines.map((l) => `- ${l}`).join("\n")}`)
    .join("\n\n");
}
