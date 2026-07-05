import type { ConstitutionalSubstrateKind } from "./constitutionalRetrieval.js";

/** ENG-EI-002.2 — Executive Brief · behavioral fidelity · deterministic renderer. */
export const EXECUTIVE_BRIEF_VERSION = "ENG-EI-002.2" as const;

export const EXECUTIVE_BRIEF_ENGINE_ID = "ENG-EI-002" as const;

/** Constitutional substrate section order — deterministic across identical package input. */
export const EXECUTIVE_BRIEF_SECTION_ORDER = [
  "sec-episodes",
  "sec-facts",
  "sec-artifacts",
  "sec-conversations",
  "sec-decisions",
] as const;

export type ExecutiveBriefOmissionKind =
  | "excluded_record"
  | "package_withheld"
  | "insufficient_evidence"
  | "substrate_gap"
  | "completeness_gap";

export type ExecutiveBriefOmissionNote = {
  kind: ExecutiveBriefOmissionKind;
  description: string;
  citation_ref?: string;
  rule_id?: string;
  substrate?: ConstitutionalSubstrateKind;
};

export type ExecutiveBriefEvidenceBoundaryKind =
  | "reported"
  | "excluded"
  | "absent"
  | "withheld";

export type ExecutiveBriefEvidenceBoundary = {
  kind: ExecutiveBriefEvidenceBoundaryKind;
  citation_ref?: string;
  substrate?: ConstitutionalSubstrateKind;
  record_id?: string;
  description: string;
  rule_id?: string;
};

export type ExecutiveBriefCitationGroup = {
  group_id: string;
  section_id: string;
  statement_ids: readonly string[];
  citation_refs: readonly string[];
};

export type ExecutiveBriefStatement = {
  statement_id: string;
  text: string;
  citation_refs: readonly string[];
  uncertainty_note?: string;
};

export type ExecutiveBriefSection = {
  section_id: string;
  title: string;
  statements: ExecutiveBriefStatement[];
};

export type ExecutiveBriefSourceMapping = {
  citation_ref: string;
  substrate: ConstitutionalSubstrateKind;
  record_id: string;
  summary: string;
};

export type ExecutiveBrief = {
  brief_id: string;
  package_id: string;
  request_id: string;
  scope_label: string;
  brief_version: typeof EXECUTIVE_BRIEF_VERSION;
  rendered_at: string;
  source_package_fingerprint: string;
  source_package_status: "complete" | "withheld" | "insufficient_evidence";
  sections: ExecutiveBriefSection[];
  source_mapping: ExecutiveBriefSourceMapping[];
  citation_groups: ExecutiveBriefCitationGroup[];
  evidence_boundaries: ExecutiveBriefEvidenceBoundary[];
  omission_notes: ExecutiveBriefOmissionNote[];
};
