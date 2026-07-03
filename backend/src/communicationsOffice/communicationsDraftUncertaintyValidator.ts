/**
 * ENG-COM-001.2 — Uncertainty preservation validation (U1–U5).
 * Composed after traceability validator — does not replace it.
 */

import type {
  ConstitutionalEvidencePackage,
  EpistemicCertaintyLevel,
  TraceableDraftProposal,
  TraceableDraftProposalStatement,
} from "@localbrain/shared";
import {
  detectLexicalStrengthening,
  epistemicLevelStrengthened,
  requiredEpistemicForCitationRefs,
  textCarriesExplicitUncertainty,
} from "./communicationsDraftEpistemics.js";

export type UncertaintyViolationCode =
  | "U1_UNCERTAINTY_NOT_PRESERVED"
  | "U2_CONFIDENCE_STRENGTHENED"
  | "U3_EPISTEMIC_LEVEL_MISMATCH"
  | "U4_IMPLIED_CERTAINTY"
  | "U5_MAPPING_UNCERTAINTY_LOST";

export class CommunicationsDraftUncertaintyError extends Error {
  readonly code: UncertaintyViolationCode;

  constructor(code: UncertaintyViolationCode, message: string) {
    super(message);
    this.name = "CommunicationsDraftUncertaintyError";
    this.code = code;
  }
}

function isSubstantive(text: string): boolean {
  return text.trim().length > 0;
}

export function validateUncertaintyDraftProposal(
  pkg: ConstitutionalEvidencePackage,
  proposal: TraceableDraftProposal,
): void {
  for (const statement of proposal.statements) {
    if (!isSubstantive(statement.text)) continue;
    validateProposalStatementUncertainty(pkg, statement);
  }
}

function validateProposalStatementUncertainty(
  pkg: ConstitutionalEvidencePackage,
  statement: TraceableDraftProposalStatement,
): void {
  const { required_level } = requiredEpistemicForCitationRefs(
    pkg,
    statement.citation_refs,
  );

  if (epistemicLevelStrengthened(required_level, statement.epistemic_level)) {
    throw new CommunicationsDraftUncertaintyError(
      "U2_CONFIDENCE_STRENGTHENED",
      `Declared epistemic level ${statement.epistemic_level} exceeds Evidence Package support (${required_level})`,
    );
  }

  if (detectLexicalStrengthening(required_level, statement.text)) {
    throw new CommunicationsDraftUncertaintyError(
      "U2_CONFIDENCE_STRENGTHENED",
      "Lexical strengthening detected — assertive phrasing without required uncertainty markers",
    );
  }

  if (required_level !== "established" && statement.epistemic_level === "established") {
    throw new CommunicationsDraftUncertaintyError(
      "U4_IMPLIED_CERTAINTY",
      "Uncertain source material presented as established fact",
    );
  }

  const explicitInText = textCarriesExplicitUncertainty(statement.text);
  const explicitInMarkers = (statement.uncertainty_markers?.length ?? 0) > 0;

  if (required_level !== "established" && !explicitInText && !explicitInMarkers) {
    throw new CommunicationsDraftUncertaintyError(
      "U1_UNCERTAINTY_NOT_PRESERVED",
      "Required package uncertainty not preserved in draft statement",
    );
  }

  if (required_level === "hypothesis" && statement.epistemic_level === "established") {
    throw new CommunicationsDraftUncertaintyError(
      "U3_EPISTEMIC_LEVEL_MISMATCH",
      "Hypothesis-level evidence not distinguishable from confirmed statements",
    );
  }
}

export function validateCitationMappingUncertainty(
  pkg: ConstitutionalEvidencePackage,
  entries: ReadonlyArray<{
    citation_ref: string;
    source_epistemic_level: EpistemicCertaintyLevel;
    uncertainty_context?: string;
  }>,
): void {
  for (const entry of entries) {
    const profile = requiredEpistemicForCitationRefs(pkg, [entry.citation_ref]);
    const expected = profile.profiles[0]!;
    if (entry.source_epistemic_level !== expected.required_level) {
      throw new CommunicationsDraftUncertaintyError(
        "U5_MAPPING_UNCERTAINTY_LOST",
        `Citation mapping lost epistemic context for ${entry.citation_ref}`,
      );
    }
    if (
      expected.package_uncertainty_note &&
      !entry.uncertainty_context &&
      expected.required_level !== "established"
    ) {
      throw new CommunicationsDraftUncertaintyError(
        "U5_MAPPING_UNCERTAINTY_LOST",
        `Citation mapping missing uncertainty context for ${entry.citation_ref}`,
      );
    }
  }
}
