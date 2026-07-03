/**
 * ENG-COM-001.3 — Deterministic advisory-boundary pattern detection.
 */

import type { CommunicationsDraftRequest } from "@localbrain/shared";

export type AdvisoryRequestProfile = {
  requests_policy: boolean;
  requests_recommendation: boolean;
  requests_decision: boolean;
  is_pressuring: boolean;
};

const REQUEST_TEXT = (request: CommunicationsDraftRequest): string =>
  `${request.intent_label} ${request.audience_label ?? ""}`.trim();

const POLICY_REQUEST_PATTERNS = [
  /\bpolic(y|ies)\b/i,
  /\bdraft (a |the )?policy\b/i,
  /\bdefine (our|the) (official )?position\b/i,
  /\bestablish (a |the )?policy\b/i,
  /\bwhat (is|should be) our stance\b/i,
];

const RECOMMENDATION_REQUEST_PATTERNS = [
  /\brecommend(ation|s|ed)?\b/i,
  /\bwhat should we (do|prioritize)\b/i,
  /\b(prioritize|rank) (these|the) options\b/i,
  /\bwhat(?:'s| is) the best (course|option)\b/i,
  /\badvise (us|me|the executive)\b/i,
];

const DECISION_REQUEST_PATTERNS = [
  /\bdecide (for|whether|if)\b/i,
  /\bmake the decision\b/i,
  /\btell us what to do\b/i,
  /\b(approve|authorize) (this|it)( for us)?\b/i,
  /\bwho should we choose\b/i,
];

const PRESSURING_REQUEST_PATTERNS = [
  /\burgent(ly)?\b/i,
  /\bimmediately\b/i,
  /\bright now\b/i,
  /\bjust tell (us|me)\b/i,
  /\byou must\b/i,
  /\bno (time|alternatives|hedging)\b/i,
  /\bstop (hedging|qualifying)\b/i,
];

const POLICY_STATEMENT_PATTERNS = [
  /\bour (official )?polic(y|ies) (is|are)\b/i,
  /\bthe (organization|institution) (will|shall|must) (implement|adopt|enforce)\b/i,
  /\b(mandate[ds]?|binding rule|official position)\b/i,
  /\bestablish(ed|ing)? (a |the )?policy\b/i,
  /\bwe (will|shall) require\b/i,
];

const RECOMMENDATION_STATEMENT_PATTERNS = [
  /\bwe recommend\b/i,
  /\bi recommend\b/i,
  /\brecommendation is\b/i,
  /\bshould prioritize\b/i,
  /\b(best|preferred) (course|option|approach) is\b/i,
  /\badvise (you|the executive|us) to\b/i,
  /\bought to (proceed|prioritize|choose)\b/i,
  /\btop priority (is|should be)\b/i,
];

const DECISION_AUTHORITY_PATTERNS = [
  /\b(i|we) (have )?(decided|approve[d]?|authorize[d]?)\b/i,
  /\bthe decision is\b/i,
  /\b(binding|final) decision\b/i,
  /\bauthorized to proceed\b/i,
  /\bexecutive order\b/i,
  /\bwe will proceed\b/i,
];

function matchesAny(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function classifyCommunicationsRequest(
  request: CommunicationsDraftRequest,
): AdvisoryRequestProfile {
  const text = REQUEST_TEXT(request);
  return {
    requests_policy: matchesAny(text, POLICY_REQUEST_PATTERNS),
    requests_recommendation: matchesAny(text, RECOMMENDATION_REQUEST_PATTERNS),
    requests_decision: matchesAny(text, DECISION_REQUEST_PATTERNS),
    is_pressuring: matchesAny(text, PRESSURING_REQUEST_PATTERNS),
  };
}

export function statementContainsPolicyLanguage(text: string): boolean {
  return matchesAny(text, POLICY_STATEMENT_PATTERNS);
}

export function statementContainsRecommendationLanguage(text: string): boolean {
  return matchesAny(text, RECOMMENDATION_STATEMENT_PATTERNS);
}

export function statementContainsDecisionAuthority(text: string): boolean {
  return matchesAny(text, DECISION_AUTHORITY_PATTERNS);
}
