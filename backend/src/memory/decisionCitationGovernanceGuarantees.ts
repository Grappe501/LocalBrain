import type { DecisionCitation } from "@localbrain/shared";
import {
  DECISION_CITATION_FIELD_KEYS,
  ENG_MEM_ENGINE_ID,
  isDecisionCitationSubstrateRef,
} from "@localbrain/shared";
import { AUTHORITY_EXERCISED_INVARIANT } from "./decisionCitationAuthorityIntegrity.js";

export const RECORDING_PRINCIPLE =
  "Authority is recorded. It is never reconstructed." as const;

export const GOVERNANCE_PRINCIPLE =
  "Authority creates responsibility. It does not create truth." as const;

export const DECISION_LEDGER_BOUNDARY_INVARIANT =
  "Decision Ledger owns binding authority. Memory stores DecisionCitation only." as const;

/** Fields that imply reconstructed or inferred authority — Recording Principle. */
export const RECONSTRUCTION_FORBIDDEN_FIELDS = [
  "inferred_authority",
  "inferred_decider",
  "reconstructed_from",
  "reconstructed_decision",
  "reconstructed_authority",
  "synthesized_decision",
  "derived_authority",
  "context_inferred_decision",
  "probably_approved",
  "consensus_decision",
  "authority_inference",
] as const;

/** Fields that duplicate ledger authority or perform governance — Ledger Boundary. */
export const LEDGER_BOUNDARY_FORBIDDEN_FIELDS = [
  "binding_decision_body",
  "ledger_payload",
  "ledger_entry",
  "ledger_state",
  "decision_body",
  "authoritative_decision",
  "binding_authority",
  "is_binding",
] as const;

/** Fields that conflate authority with truth — Governance Principle. */
export const GOVERNANCE_FORBIDDEN_FIELDS = [
  "establishes_truth",
  "creates_fact",
  "factual_correctness",
  "is_true",
  "verified_truth",
  "knowledge_assertion",
  "statement",
  "confidence",
  "domain",
] as const;

/** Workflow and policy execution — excluded from Wave 1 substrate. */
export const EXECUTION_FORBIDDEN_FIELDS = [
  "approval_status",
  "workflow_id",
  "workflow_state",
  "policy_enforcement",
  "approval_workflow",
  "policy_action",
  "executive_decision",
] as const;

export const DECISION_CITATION_FORBIDDEN_FIELDS = [
  ...RECONSTRUCTION_FORBIDDEN_FIELDS,
  ...LEDGER_BOUNDARY_FORBIDDEN_FIELDS,
  ...GOVERNANCE_FORBIDDEN_FIELDS,
  ...EXECUTION_FORBIDDEN_FIELDS,
] as const;

export type DecisionCitationGovernanceGuarantees = {
  principles: {
    authority_exercised: typeof AUTHORITY_EXERCISED_INVARIANT;
    authority_recorded: typeof RECORDING_PRINCIPLE;
    authority_creates_responsibility: typeof GOVERNANCE_PRINCIPLE;
    ledger_boundary: typeof DECISION_LEDGER_BOUNDARY_INVARIANT;
  };
  citation_id: string;
  engine_id: typeof ENG_MEM_ENGINE_ID;
  checks: {
    recording_principle_enforced: boolean;
    governance_principle_enforced: boolean;
    ledger_boundary_preserved: boolean;
    supporting_refs_outward_only: boolean;
    no_binding_authority_duplication: boolean;
    no_inference_at_capture: boolean;
  };
  cited_field_paths: string[];
};

export class DecisionCitationGovernanceError extends Error {
  readonly citation_id: string;

  constructor(citationId: string, reason: string) {
    super(`DecisionCitation ${citationId} governance guarantee failed: ${reason}`);
    this.name = "DecisionCitationGovernanceError";
    this.citation_id = citationId;
  }
}

export function assertNoForbiddenGovernanceFields(
  obj: Record<string, unknown>,
  citationId = "draft",
): void {
  for (const forbidden of DECISION_CITATION_FORBIDDEN_FIELDS) {
    if (forbidden in obj) {
      throw new DecisionCitationGovernanceError(
        citationId,
        `forbidden field ${forbidden} — doctrine enforcement`,
      );
    }
  }
}

export function assertDecisionCitationLedgerBoundary(citation: DecisionCitation): void {
  if (!citation.decision_id.startsWith("decision:")) {
    throw new DecisionCitationGovernanceError(
      citation.citation_id,
      "decision_id must cite Decision Ledger decision pointer only",
    );
  }
  if (!citation.ledger_ref.startsWith("ledger:")) {
    throw new DecisionCitationGovernanceError(
      citation.citation_id,
      "ledger_ref must cite Decision Ledger entry only",
    );
  }
}

export function assertDecisionCitationRecordingPrinciple(citation: DecisionCitation): void {
  if (citation.provenance.capture_method === "inference") {
    throw new DecisionCitationGovernanceError(
      citation.citation_id,
      "capture_method inference forbidden — authority is recorded, never reconstructed",
    );
  }
}

export function assertDecisionCitationSupportingRefsOutwardOnly(citation: DecisionCitation): void {
  for (let i = 0; i < citation.supporting_memory_refs.length; i += 1) {
    const ref = citation.supporting_memory_refs[i]!;
    if (!isDecisionCitationSubstrateRef(ref)) {
      throw new DecisionCitationGovernanceError(
        citation.citation_id,
        `supporting_memory_refs[${i}] must be outward substrate ref only`,
      );
    }
    if (ref.startsWith("decision:") || ref.startsWith("ledger:") || ref.startsWith("citation:")) {
      throw new DecisionCitationGovernanceError(
        citation.citation_id,
        `supporting_memory_refs[${i}] must not cite authority — ledger boundary`,
      );
    }
  }
}

export function assertDecisionCitationSchemaIsCitationOnly(citation: DecisionCitation): void {
  const allowed = new Set<string>(DECISION_CITATION_FIELD_KEYS);
  for (const key of Object.keys(citation)) {
    if (!allowed.has(key)) {
      throw new DecisionCitationGovernanceError(
        citation.citation_id,
        `unknown field ${key} — Memory stores DecisionCitation only`,
      );
    }
  }
}

/**
 * Doctrine enforcement — Recording Principle · Governance Principle · Ledger Boundary.
 * DecisionCitation records authority. It does not perform authority.
 */
export function verifyDecisionCitationGovernanceGuarantees(
  citation: DecisionCitation,
): DecisionCitationGovernanceGuarantees {
  assertNoForbiddenGovernanceFields(citation as unknown as Record<string, unknown>, citation.citation_id);
  assertDecisionCitationSchemaIsCitationOnly(citation);
  assertDecisionCitationLedgerBoundary(citation);
  assertDecisionCitationRecordingPrinciple(citation);
  assertDecisionCitationSupportingRefsOutwardOnly(citation);

  const cited = new Set<string>([
    "decision_id",
    "ledger_ref",
    "decider_ref",
    "outcome_summary",
    "supporting_memory_refs",
    "provenance.capture_method",
    "provenance.source_ref",
  ]);

  return {
    principles: {
      authority_exercised: AUTHORITY_EXERCISED_INVARIANT,
      authority_recorded: RECORDING_PRINCIPLE,
      authority_creates_responsibility: GOVERNANCE_PRINCIPLE,
      ledger_boundary: DECISION_LEDGER_BOUNDARY_INVARIANT,
    },
    citation_id: citation.citation_id,
    engine_id: ENG_MEM_ENGINE_ID,
    checks: {
      recording_principle_enforced: true,
      governance_principle_enforced: true,
      ledger_boundary_preserved: true,
      supporting_refs_outward_only: true,
      no_binding_authority_duplication: true,
      no_inference_at_capture: citation.provenance.capture_method !== "inference",
    },
    cited_field_paths: [...cited].sort(),
  };
}

export function isCompleteGovernanceGuarantees(
  result: DecisionCitationGovernanceGuarantees,
): boolean {
  return Object.values(result.checks).every(Boolean);
}
