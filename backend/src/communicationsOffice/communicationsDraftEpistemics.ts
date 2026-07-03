/**
 * ENG-COM-001.2 — Deterministic epistemic profiles from Evidence Package citations.
 */

import type {
  CitationEpistemicProfile,
  ConstitutionalEvidencePackage,
  EpistemicCertaintyLevel,
  TrustLevel,
} from "@localbrain/shared";

export const EPISTEMIC_UNCERTAINTY_RANK: Record<EpistemicCertaintyLevel, number> = {
  established: 0,
  qualified: 1,
  hypothesis: 2,
  absent: 3,
};

const HEDGE_PATTERNS = [
  /\bmay\b/i,
  /\bmight\b/i,
  /\bcould\b/i,
  /\bsuggests?\b/i,
  /\bappears?\b/i,
  /\bseems?\b/i,
  /\blikely\b/i,
  /\bpossibly\b/i,
  /\buncertain\b/i,
  /\bhypothesis\b/i,
  /\bavailable information suggests\b/i,
];

const ASSERTIVE_PATTERNS = [
  /\bis\b/i,
  /\bare\b/i,
  /\bremains\b/i,
  /\bconfirms?\b/i,
  /\bdemonstrates?\b/i,
  /\bwill\b/i,
  /\bdefinitely\b/i,
  /\bcertainly\b/i,
];

export function trustLevelToEpistemic(level: TrustLevel): EpistemicCertaintyLevel {
  switch (level) {
    case "hypothesis":
      return "hypothesis";
    case "observed":
    case "imported":
    case "derived":
      return "qualified";
    default:
      return "established";
  }
}

export function extractCitationEpistemicProfile(
  pkg: ConstitutionalEvidencePackage,
  citationRef: string,
): CitationEpistemicProfile {
  if (citationRef.startsWith("fact:")) {
    const factId = citationRef.slice("fact:".length);
    const fact = pkg.facts.find((f) => f.fact_id === factId);
    if (fact) {
      const required_level = trustLevelToEpistemic(fact.confidence.level);
      return {
        citation_ref: citationRef,
        required_level,
        package_uncertainty_note:
          required_level === "established"
            ? undefined
            : `Source confidence: ${fact.confidence.level}`,
      };
    }
  }

  if (citationRef.startsWith("conversation:")) {
    return {
      citation_ref: citationRef,
      required_level: "qualified",
      package_uncertainty_note: "Conversation interpretation — qualified epistemic status",
    };
  }

  return {
    citation_ref: citationRef,
    required_level: "established",
  };
}

/** Most conservative (highest uncertainty) level across cited records. */
export function requiredEpistemicForCitationRefs(
  pkg: ConstitutionalEvidencePackage,
  citationRefs: readonly string[],
): { required_level: EpistemicCertaintyLevel; profiles: CitationEpistemicProfile[] } {
  const profiles = citationRefs.map((ref) => extractCitationEpistemicProfile(pkg, ref));
  let maxRank = 0;
  for (const profile of profiles) {
    maxRank = Math.max(maxRank, EPISTEMIC_UNCERTAINTY_RANK[profile.required_level]);
  }
  const required_level = (
    Object.entries(EPISTEMIC_UNCERTAINTY_RANK) as [EpistemicCertaintyLevel, number][]
  ).find(([, rank]) => rank === maxRank)![0];
  return { required_level, profiles };
}

export function textCarriesExplicitUncertainty(text: string): boolean {
  return HEDGE_PATTERNS.some((pattern) => pattern.test(text));
}

const HYPOTHESIS_STRENGTH_MARKERS = [
  /\bsuggests?\b/i,
  /\bmay\b/i,
  /\bmight\b/i,
  /\bcould\b/i,
  /\buncertain\b/i,
  /\bhypothesis\b/i,
];

/** Detect assertive phrasing or insufficient hedging when source demands uncertainty. */
export function detectLexicalStrengthening(
  requiredLevel: EpistemicCertaintyLevel,
  text: string,
): boolean {
  if (requiredLevel === "established") {
    return false;
  }

  if (requiredLevel === "hypothesis") {
    const hasRequiredHedge = HYPOTHESIS_STRENGTH_MARKERS.some((pattern) => pattern.test(text));
    const hasAssertive = ASSERTIVE_PATTERNS.some((pattern) => pattern.test(text));
    const softHedgeOnly = /\bappears?\b/i.test(text) && !hasRequiredHedge;
    return softHedgeOnly || (hasAssertive && !hasRequiredHedge);
  }

  if (requiredLevel === "qualified") {
    return /\bconfirms?\b/i.test(text) || /\bcertainly\b/i.test(text);
  }

  return false;
}

export function epistemicLevelStrengthened(
  requiredLevel: EpistemicCertaintyLevel,
  proposedLevel: EpistemicCertaintyLevel,
): boolean {
  return (
    EPISTEMIC_UNCERTAINTY_RANK[proposedLevel] < EPISTEMIC_UNCERTAINTY_RANK[requiredLevel]
  );
}

export function buildUncertaintyNote(
  profiles: CitationEpistemicProfile[],
): string | undefined {
  const notes = profiles
    .map((p) => p.package_uncertainty_note)
    .filter((n): n is string => Boolean(n));
  if (notes.length === 0) return undefined;
  return [...new Set(notes)].join(" · ");
}
