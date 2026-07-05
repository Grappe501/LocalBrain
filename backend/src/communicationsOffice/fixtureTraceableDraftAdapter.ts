/**
 * ENG-COM-001.1 — Fixture adapter · structured proposal simulating probabilistic output for tests.
 * ENG-COM-001.2 — preserves epistemic metadata from Evidence Package citations.
 */

import type {
  CommunicationsDraftRequest,
  ConstitutionalCitation,
  ConstitutionalEvidencePackage,
  EpistemicCertaintyLevel,
  TraceableDraftProposal,
} from "@localbrain/shared";
import {
  extractCitationEpistemicProfile,
  requiredEpistemicForCitationRefs,
} from "./communicationsDraftEpistemics.js";

function baseStatementText(
  pkg: ConstitutionalEvidencePackage,
  citation: ConstitutionalCitation,
): string {
  switch (citation.substrate) {
    case "episode": {
      const record = pkg.episodes.find((e) => e.episode_id === citation.record_id);
      const label = record?.title ?? record?.source_ref ?? "Episode";
      return `Recorded episode: ${label}.`;
    }
    case "fact": {
      const record = pkg.facts.find((f) => f.fact_id === citation.record_id);
      return record?.statement ?? `Fact record ${citation.record_id}.`;
    }
    case "artifact": {
      const record = pkg.artifacts.find((a) => a.artifact_id === citation.record_id);
      const label = record?.content_ref ?? record?.uri ?? record?.mime_type ?? citation.record_id;
      return `Artifact on file: ${label}.`;
    }
    case "conversation": {
      const record = pkg.conversations.find(
        (c) => c.conversation.conversation_id === citation.record_id,
      );
      const turn = record?.turns[0]?.content;
      return turn ? `Conversation noted: ${turn}` : `Conversation ${citation.record_id} captured.`;
    }
    case "decision_citation": {
      const record = pkg.decision_citations.find(
        (d) => d.citation_id === citation.record_id,
      );
      return record?.outcome_summary ?? `Decision ${citation.record_id} recorded.`;
    }
    default:
      return `Evidence ${citation.citation_ref}.`;
  }
}

function applyUncertaintyPreservingRewrite(
  baseText: string,
  requiredLevel: EpistemicCertaintyLevel,
): { text: string; uncertainty_markers: string[] } {
  if (requiredLevel === "established") {
    return { text: baseText, uncertainty_markers: [] };
  }
  if (requiredLevel === "hypothesis") {
    const text = `The available information suggests that ${baseText.replace(/\.$/, "")} may remain uncertain.`;
    return { text, uncertainty_markers: ["suggests", "may", "uncertain"] };
  }
  const text = `The available information suggests that ${baseText.replace(/\.$/, "")}.`;
  return { text, uncertainty_markers: ["suggests"] };
}

export async function proposeFixtureTraceableDraft(
  pkg: ConstitutionalEvidencePackage,
  _request: CommunicationsDraftRequest,
): Promise<TraceableDraftProposal> {
  if (pkg.status !== "complete") {
    return {
      statements: [],
      withheld: [
        {
          kind: "insufficient_evidence",
          description:
            pkg.status_reason ??
            `Evidence package status ${pkg.status} — draft generation withheld`,
        },
      ],
    };
  }

  return {
    statements: pkg.citations.map((citation) => {
      const profile = extractCitationEpistemicProfile(pkg, citation.citation_ref);
      const baseText = baseStatementText(pkg, citation);
      const { required_level } = requiredEpistemicForCitationRefs(pkg, [citation.citation_ref]);
      const rewritten = applyUncertaintyPreservingRewrite(baseText, required_level);
      return {
        text: rewritten.text,
        citation_refs: [citation.citation_ref],
        epistemic_level: profile.required_level,
        uncertainty_markers: rewritten.uncertainty_markers,
      };
    }),
    withheld: [],
  };
}

/** Test helper — simulate policy statement (A1 failure mode). */
export function proposePolicyViolationDraft(
  citationRef: string,
  policyText = "Our official policy is to mandate immediate implementation.",
): TraceableDraftProposal {
  return {
    statements: [
      {
        text: policyText,
        citation_refs: [citationRef],
        epistemic_level: "qualified",
        uncertainty_markers: ["suggests"],
      },
    ],
    withheld: [],
  };
}

/** Test helper — simulate recommendation (A2 failure mode). */
export function proposeRecommendationViolationDraft(
  citationRef: string,
  recommendationText = "We recommend prioritizing the eastern counties first.",
): TraceableDraftProposal {
  return {
    statements: [
      {
        text: recommendationText,
        citation_refs: [citationRef],
        epistemic_level: "qualified",
        uncertainty_markers: ["suggests"],
      },
    ],
    withheld: [],
  };
}

/** Test helper — simulate fabricated decision authority (A4 failure mode). */
export function proposeDecisionAuthorityDraft(
  citationRef: string,
  decisionText = "We have decided to proceed with the initiative immediately.",
): TraceableDraftProposal {
  return {
    statements: [
      {
        text: decisionText,
        citation_refs: [citationRef],
        epistemic_level: "qualified",
        uncertainty_markers: ["suggests"],
      },
    ],
    withheld: [],
  };
}

/** Test helper — withhold decision-making request (A4 pass mode). */
export function proposeWithheldDecisionRequest(
  requestedTopic: string,
): TraceableDraftProposal {
  return {
    statements: [],
    withheld: [
      {
        kind: "unsupported_request",
        description:
          "Decision-making request exceeds advisory drafting scope — evidence may be summarized without exercising authority.",
        requested_topic: requestedTopic,
      },
    ],
  };
}
/** Test helper — simulate semantic strengthening (U2 failure mode). */
export function proposeStrengthenedDraftProposal(
  pkg: ConstitutionalEvidencePackage,
  citationRef: string,
  strengthenedText: string,
): TraceableDraftProposal {
  return {
    statements: [
      {
        text: strengthenedText,
        citation_refs: [citationRef],
        epistemic_level: "established",
        uncertainty_markers: [],
      },
    ],
    withheld: [],
  };
}
