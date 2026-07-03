import type { ConstitutionalEvidencePackageStatus } from "./constitutionalRetrieval.js";
import type { ConstitutionalSubstrateKind } from "./constitutionalRetrieval.js";

/** ENG-COM-001.3 — Advisory restraint · uncertainty preservation · traceable draft generation. */
export const COMMUNICATIONS_DRAFT_VERSION = "ENG-COM-001.3" as const;

export const COMMUNICATIONS_DRAFT_ENGINE_ID = "ENG-COM-001" as const;

export const COMMUNICATIONS_DRAFT_ADVISORY_NOTICE =
  "Advisory draft — not policy, recommendation, or action." as const;

/** Epistemic status — deterministic comparison between package and proposal. */
export type EpistemicCertaintyLevel = "established" | "qualified" | "hypothesis" | "absent";

export type CommunicationsDraftRequest = {
  request_id: string;
  /** Bounded communications intent — e.g. "Status update to board". */
  intent_label: string;
  audience_label?: string;
};

export type CommunicationsDraftWithheldKind =
  | "unsupported_request"
  | "insufficient_evidence"
  | "out_of_scope";

export type CommunicationsDraftWithheldItem = {
  kind: CommunicationsDraftWithheldKind;
  description: string;
  requested_topic?: string;
};

export type CommunicationsDraftStatement = {
  statement_id: string;
  text: string;
  citation_refs: readonly string[];
  /** ENG-COM-001.2 — distinguish uncertain from confirmed statements (U3). */
  epistemic_level: EpistemicCertaintyLevel;
  /** Explicit uncertainty preserved in prose when required (U1). */
  uncertainty_note?: string;
};

/** Draft communication body — independently evaluable from citation mapping. */
export type CommunicationsDraft = {
  draft_id: string;
  package_id: string;
  communications_request_id: string;
  intent_label: string;
  draft_version: typeof COMMUNICATIONS_DRAFT_VERSION;
  generated_at: string;
  source_package_fingerprint: string;
  source_package_status: ConstitutionalEvidencePackageStatus;
  advisory_notice: typeof COMMUNICATIONS_DRAFT_ADVISORY_NOTICE;
  body_text: string;
  statements: CommunicationsDraftStatement[];
  withheld: CommunicationsDraftWithheldItem[];
};

export type CommunicationsDraftCitationEntry = {
  citation_ref: string;
  substrate: ConstitutionalSubstrateKind;
  record_id: string;
  summary: string;
  statement_ids: readonly string[];
  /** ENG-COM-001.2 — package epistemic context preserved in mapping (U5). */
  source_epistemic_level: EpistemicCertaintyLevel;
  uncertainty_context?: string;
};

/** Citation mapping — first-class · independently inspectable · not embedded in prose. */
export type CommunicationsDraftCitationMapping = {
  mapping_id: string;
  draft_id: string;
  package_id: string;
  package_fingerprint: string;
  entries: CommunicationsDraftCitationEntry[];
  /** Substantive statements with no package citation — empty when traceability holds. */
  unmapped_statement_ids: readonly string[];
};

export type TraceableDraftGenerationResult = {
  draft: CommunicationsDraft;
  citation_mapping: CommunicationsDraftCitationMapping;
};

/** Structured proposal from probabilistic generation — validated before assembly. */
export type TraceableDraftProposalStatement = {
  text: string;
  citation_refs: readonly string[];
  /** ENG-COM-001.2 — declared epistemic status of the proposal statement. */
  epistemic_level: EpistemicCertaintyLevel;
  /** Explicit uncertainty markers preserved from source (U1). */
  uncertainty_markers?: readonly string[];
};

export type TraceableDraftProposal = {
  statements: readonly TraceableDraftProposalStatement[];
  withheld: readonly CommunicationsDraftWithheldItem[];
};

/** Deterministic epistemic profile extracted from Evidence Package per citation. */
export type CitationEpistemicProfile = {
  citation_ref: string;
  required_level: EpistemicCertaintyLevel;
  package_uncertainty_note?: string;
};
