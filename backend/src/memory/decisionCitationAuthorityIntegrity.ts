import type { DecisionCitation, IdentityRef } from "@localbrain/shared";
import {
  ENG_MEM_ENGINE_ID,
  isDecisionCitationSubstrateRef,
  isMemoryObjectRef,
} from "@localbrain/shared";
import { decisionCitationContentFingerprint } from "./decisionCitationStore.js";

export const AUTHORITY_EXERCISED_INVARIANT =
  "Authority is exercised. It is never inferred." as const;

export const DECISION_CITATION_AUTHORITY_QUESTION =
  "Who exercised institutional authority?" as const;

export type DecisionCitationAuthorityMethod = "substrate_reconstruction";

export type DecisionCitationAuthorityChain = {
  decider_ref: IdentityRef;
  decided_at: string;
  decision_id: string;
  ledger_ref: string;
  recorded_by: IdentityRef;
  source_ref: string;
};

export type DecisionCitationAuthorityIntegrity = {
  question: typeof DECISION_CITATION_AUTHORITY_QUESTION;
  citation_id: string;
  engine_id: typeof ENG_MEM_ENGINE_ID;
  method: DecisionCitationAuthorityMethod;
  /** Authority chain reconstructable from stored DecisionCitation fields alone. */
  chain: DecisionCitationAuthorityChain;
  supporting_memory_refs: string[];
  checks: {
    authority_explicit: boolean;
    delegation_traceable: boolean;
    ledger_citation_immutable: boolean;
    decision_body_immutable: boolean;
    supporting_refs_intact: boolean;
    authority_not_inferred: boolean;
  };
  cited_field_paths: string[];
};

export class DecisionCitationAuthorityError extends Error {
  readonly citation_id: string;

  constructor(citationId: string, reason: string) {
    super(`DecisionCitation ${citationId} authority integrity failed: ${reason}`);
    this.name = "DecisionCitationAuthorityError";
    this.citation_id = citationId;
  }
}

function assertExplicitIdentity(ref: IdentityRef, field: string, citationId: string): void {
  if (!ref.identity_id?.trim() || !ref.identity_kind?.trim()) {
    throw new DecisionCitationAuthorityError(
      citationId,
      `${field} must identify who exercised authority explicitly`,
    );
  }
}

/**
 * A17 — deterministic authority reconstruction from stored DecisionCitation only.
 * DecisionCitation records authority. It does not perform authority.
 */
export function verifyDecisionCitationAuthorityIntegrity(
  citation: DecisionCitation,
  captureBaseline?: DecisionCitation,
): DecisionCitationAuthorityIntegrity {
  assertExplicitIdentity(citation.decider_ref, "decider_ref", citation.citation_id);
  assertExplicitIdentity(
    citation.provenance.captured_by,
    "provenance.captured_by",
    citation.citation_id,
  );

  if (!citation.decision_id.trim() || !citation.decision_id.startsWith("decision:")) {
    throw new DecisionCitationAuthorityError(
      citation.citation_id,
      "decision_id must cite governing decision explicitly",
    );
  }

  if (!citation.ledger_ref.trim() || !isMemoryObjectRef(citation.ledger_ref)) {
    throw new DecisionCitationAuthorityError(
      citation.citation_id,
      "ledger_ref must cite Decision Ledger explicitly",
    );
  }

  if (citation.provenance.source_ref !== citation.ledger_ref) {
    throw new DecisionCitationAuthorityError(
      citation.citation_id,
      "provenance.source_ref must match ledger_ref — delegation traceable to ledger",
    );
  }

  for (let i = 0; i < citation.supporting_memory_refs.length; i += 1) {
    const ref = citation.supporting_memory_refs[i]!;
    if (!isDecisionCitationSubstrateRef(ref)) {
      throw new DecisionCitationAuthorityError(
        citation.citation_id,
        `supporting_memory_refs[${i}] must be outward substrate ref only`,
      );
    }
  }

  let ledgerCitationImmutable = true;
  let decisionBodyImmutable = true;

  if (captureBaseline) {
    if (captureBaseline.citation_id !== citation.citation_id) {
      throw new DecisionCitationAuthorityError(
        citation.citation_id,
        "capture baseline citation_id mismatch",
      );
    }
    ledgerCitationImmutable =
      captureBaseline.decision_id === citation.decision_id &&
      captureBaseline.ledger_ref === citation.ledger_ref;
    if (!ledgerCitationImmutable) {
      throw new DecisionCitationAuthorityError(
        citation.citation_id,
        "ledger citation mutated after capture",
      );
    }

    decisionBodyImmutable =
      decisionCitationContentFingerprint(captureBaseline) ===
      decisionCitationContentFingerprint(citation);
    if (!decisionBodyImmutable) {
      throw new DecisionCitationAuthorityError(
        citation.citation_id,
        "authoritative body mutated after capture",
      );
    }
  }

  const cited = new Set<string>([
    "decider_ref",
    "decider_ref.identity_id",
    "decider_ref.identity_kind",
    "decided_at",
    "decision_id",
    "ledger_ref",
    "question",
    "outcome_summary",
    "provenance.captured_by",
    "provenance.captured_by.identity_id",
    "provenance.captured_by.identity_kind",
    "provenance.source_ref",
    "supporting_memory_refs",
  ]);

  return {
    question: DECISION_CITATION_AUTHORITY_QUESTION,
    citation_id: citation.citation_id,
    engine_id: ENG_MEM_ENGINE_ID,
    method: "substrate_reconstruction",
    chain: {
      decider_ref: citation.decider_ref,
      decided_at: citation.decided_at,
      decision_id: citation.decision_id,
      ledger_ref: citation.ledger_ref,
      recorded_by: citation.provenance.captured_by,
      source_ref: citation.provenance.source_ref,
    },
    supporting_memory_refs: [...citation.supporting_memory_refs],
    checks: {
      authority_explicit: true,
      delegation_traceable: true,
      ledger_citation_immutable: ledgerCitationImmutable,
      decision_body_immutable: decisionBodyImmutable,
      supporting_refs_intact: true,
      authority_not_inferred: true,
    },
    cited_field_paths: [...cited].sort(),
  };
}

export function isCompleteAuthorityIntegrity(
  result: DecisionCitationAuthorityIntegrity,
): boolean {
  return Object.values(result.checks).every(Boolean) && result.chain.decider_ref.identity_id.length > 0;
}
