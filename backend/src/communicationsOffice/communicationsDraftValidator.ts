/**
 * ENG-COM-001.1 — Communications draft traceability validation (C1–C5).
 */

import type {
  ConstitutionalEvidencePackage,
  TraceableDraftProposal,
  TraceableDraftProposalStatement,
} from "@localbrain/shared";

export type TraceabilityViolationCode =
  | "C1_UNMAPPED_CITATION"
  | "C2_UNSUPPORTED_STATEMENT"
  | "C3_EMPTY_CITATION_REFS"
  | "C4_NON_PACKAGE_CITATION";

export class CommunicationsDraftTraceabilityError extends Error {
  readonly code: TraceabilityViolationCode;

  constructor(code: TraceabilityViolationCode, message: string) {
    super(message);
    this.name = "CommunicationsDraftTraceabilityError";
    this.code = code;
  }
}

function packageCitationRefSet(pkg: ConstitutionalEvidencePackage): Set<string> {
  return new Set(pkg.citations.map((c) => c.citation_ref));
}

function isSubstantive(text: string): boolean {
  return text.trim().length > 0;
}

export function validateTraceableDraftProposal(
  pkg: ConstitutionalEvidencePackage,
  proposal: TraceableDraftProposal,
): void {
  const allowed = packageCitationRefSet(pkg);

  for (const statement of proposal.statements) {
    validateProposalStatement(statement, allowed);
  }
}

function validateProposalStatement(
  statement: TraceableDraftProposalStatement,
  allowed: Set<string>,
): void {
  if (!isSubstantive(statement.text)) {
    return;
  }

  if (statement.citation_refs.length === 0) {
    throw new CommunicationsDraftTraceabilityError(
      "C2_UNSUPPORTED_STATEMENT",
      "Substantive statement emitted without supporting evidence",
    );
  }

  for (const ref of statement.citation_refs) {
    if (!allowed.has(ref)) {
      throw new CommunicationsDraftTraceabilityError(
        "C4_NON_PACKAGE_CITATION",
        `Citation ref not in Evidence Package: ${ref}`,
      );
    }
  }
}

export function assertCitationMappingComplete(
  statementIds: readonly string[],
  mappedIds: readonly string[],
): void {
  const unmapped = statementIds.filter((id) => !mappedIds.includes(id));
  if (unmapped.length > 0) {
    throw new CommunicationsDraftTraceabilityError(
      "C1_UNMAPPED_CITATION",
      `Substantive statements without citation mapping: ${unmapped.join(", ")}`,
    );
  }
}
