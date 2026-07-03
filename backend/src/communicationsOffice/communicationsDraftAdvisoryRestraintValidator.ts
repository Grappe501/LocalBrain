/**
 * ENG-COM-001.3 — Advisory restraint validation (A1–A5).
 * Composed after traceability and uncertainty validators — does not replace them.
 */

import type {
  CommunicationsDraftRequest,
  TraceableDraftProposal,
  TraceableDraftProposalStatement,
} from "@localbrain/shared";
import {
  classifyCommunicationsRequest,
  statementContainsDecisionAuthority,
  statementContainsPolicyLanguage,
  statementContainsRecommendationLanguage,
} from "./communicationsDraftAdvisoryPatterns.js";

export type AdvisoryRestraintViolationCode =
  | "A1_POLICY_STATEMENT"
  | "A2_RECOMMENDATION_OR_PRIORITIZATION"
  | "A3_PRESSURE_BOUNDARY_COLLAPSE"
  | "A4_DECISION_AUTHORITY_FABRICATED"
  | "A4_DECISION_REQUEST_UNBOUNDED";

export class CommunicationsDraftAdvisoryRestraintError extends Error {
  readonly code: AdvisoryRestraintViolationCode;

  constructor(code: AdvisoryRestraintViolationCode, message: string) {
    super(message);
    this.name = "CommunicationsDraftAdvisoryRestraintError";
    this.code = code;
  }
}

function isSubstantive(text: string): boolean {
  return text.trim().length > 0;
}

function throwBoundaryViolation(
  code: Exclude<
    AdvisoryRestraintViolationCode,
    "A3_PRESSURE_BOUNDARY_COLLAPSE" | "A4_DECISION_REQUEST_UNBOUNDED"
  >,
  message: string,
  pressuring: boolean,
): never {
  if (pressuring) {
    throw new CommunicationsDraftAdvisoryRestraintError(
      "A3_PRESSURE_BOUNDARY_COLLAPSE",
      `Pressuring prompt collapsed advisory boundary: ${message}`,
    );
  }
  throw new CommunicationsDraftAdvisoryRestraintError(code, message);
}

function validateProposalStatementAdvisoryRestraint(
  statement: TraceableDraftProposalStatement,
  pressuring: boolean,
): void {
  if (!isSubstantive(statement.text)) return;

  if (statementContainsPolicyLanguage(statement.text)) {
    throwBoundaryViolation(
      "A1_POLICY_STATEMENT",
      "Policy statement detected in advisory draft proposal",
      pressuring,
    );
  }

  if (statementContainsRecommendationLanguage(statement.text)) {
    throwBoundaryViolation(
      "A2_RECOMMENDATION_OR_PRIORITIZATION",
      "Recommendation or prioritization detected in advisory draft proposal",
      pressuring,
    );
  }

  if (statementContainsDecisionAuthority(statement.text)) {
    throwBoundaryViolation(
      "A4_DECISION_AUTHORITY_FABRICATED",
      "Decision authority fabricated in advisory draft proposal",
      pressuring,
    );
  }
}

function validateDecisionRequestBounded(
  request: CommunicationsDraftRequest,
  proposal: TraceableDraftProposal,
): void {
  const profile = classifyCommunicationsRequest(request);
  if (!profile.requests_decision) return;

  const substantive = proposal.statements.filter((s) => isSubstantive(s.text));
  const hasBoundaryWithhold = proposal.withheld.some(
    (item) => item.kind === "unsupported_request" || item.kind === "out_of_scope",
  );

  if (substantive.length === 0 && !hasBoundaryWithhold) {
    throw new CommunicationsDraftAdvisoryRestraintError(
      "A4_DECISION_REQUEST_UNBOUNDED",
      "Decision-making request must be withheld or bounded by advisory evidence statements",
    );
  }
}

export function validateAdvisoryRestraintDraftProposal(
  request: CommunicationsDraftRequest,
  proposal: TraceableDraftProposal,
): void {
  const profile = classifyCommunicationsRequest(request);

  for (const statement of proposal.statements) {
    validateProposalStatementAdvisoryRestraint(statement, profile.is_pressuring);
  }

  validateDecisionRequestBounded(request, proposal);
}
