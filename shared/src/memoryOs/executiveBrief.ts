import type { ConstitutionalSubstrateKind } from "./constitutionalRetrieval.js";

/** ENG-EI-002.1 — Executive Brief · contract · deterministic renderer. */
export const EXECUTIVE_BRIEF_VERSION = "ENG-EI-002.1" as const;

export const EXECUTIVE_BRIEF_ENGINE_ID = "ENG-EI-002" as const;

export type ExecutiveBriefOmissionKind =
  | "excluded_record"
  | "package_withheld"
  | "insufficient_evidence"
  | "substrate_gap";

export type ExecutiveBriefOmissionNote = {
  kind: ExecutiveBriefOmissionKind;
  description: string;
  citation_ref?: string;
  rule_id?: string;
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
  omission_notes: ExecutiveBriefOmissionNote[];
};
