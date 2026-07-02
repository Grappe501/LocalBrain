/**
 * Deterministic retrieval rules — ENG-EI-001.2 · ENG-EI-001.3
 */

export const RETRIEVAL_RULE_IDS = {
  EXPLICIT_REF: "RULE-EXPLICIT-REF",
  DOMAIN_SCAN: "RULE-DOMAIN-SCAN",
  GLOBAL_SCAN: "RULE-GLOBAL-SCAN",
  DOMAIN_SKIP_DECISION_CITATION: "RULE-DOMAIN-SKIP-DECISION-CITATION",
  REF_NOT_FOUND: "RULE-REF-NOT-FOUND",
  DOMAIN_FILTER: "RULE-DOMAIN-FILTER",
  CITATION_INTEGRITY: "RULE-CITATION-INTEGRITY",
} as const;

export type RetrievalRuleId = (typeof RETRIEVAL_RULE_IDS)[keyof typeof RETRIEVAL_RULE_IDS];

export type RetrievalRuleDefinition = {
  rule_id: RetrievalRuleId;
  description: string;
};

export const RETRIEVAL_RULES: Record<RetrievalRuleId, RetrievalRuleDefinition> = {
  [RETRIEVAL_RULE_IDS.EXPLICIT_REF]: {
    rule_id: RETRIEVAL_RULE_IDS.EXPLICIT_REF,
    description: "Include substrate record when identifier appears in substrate_refs.",
  },
  [RETRIEVAL_RULE_IDS.DOMAIN_SCAN]: {
    rule_id: RETRIEVAL_RULE_IDS.DOMAIN_SCAN,
    description: "Include all substrate records matching request.domain.",
  },
  [RETRIEVAL_RULE_IDS.GLOBAL_SCAN]: {
    rule_id: RETRIEVAL_RULE_IDS.GLOBAL_SCAN,
    description: "Include all substrate records when no domain filter is set.",
  },
  [RETRIEVAL_RULE_IDS.DOMAIN_SKIP_DECISION_CITATION]: {
    rule_id: RETRIEVAL_RULE_IDS.DOMAIN_SKIP_DECISION_CITATION,
    description:
      "DecisionCitation has no domain field; excluded from domain-scoped scans by deterministic rule.",
  },
  [RETRIEVAL_RULE_IDS.REF_NOT_FOUND]: {
    rule_id: RETRIEVAL_RULE_IDS.REF_NOT_FOUND,
    description: "Requested substrate identifier does not resolve to a stored record.",
  },
  [RETRIEVAL_RULE_IDS.DOMAIN_FILTER]: {
    rule_id: RETRIEVAL_RULE_IDS.DOMAIN_FILTER,
    description: "Record exists but request.domain does not match record.domain.",
  },
  [RETRIEVAL_RULE_IDS.CITATION_INTEGRITY]: {
    rule_id: RETRIEVAL_RULE_IDS.CITATION_INTEGRITY,
    description: "Citation must reference an included package record.",
  },
};

export type RetrievalExclusionReason =
  | "not_found"
  | "domain_mismatch"
  | "substrate_not_searched"
  | "citation_integrity_failure";

export type InclusionRuleApplication = {
  rule_id: RetrievalRuleId;
  rule_description: string;
  substrates?: readonly string[];
};

export type RetrievalSubstrateKind =
  | "episode"
  | "fact"
  | "artifact"
  | "conversation"
  | "decision_citation";

export type RetrievalCompletenessReport = {
  mode: "explicit_refs" | "domain_scan" | "global_scan";
  substrates_required: RetrievalSubstrateKind[];
  substrates_with_results: RetrievalSubstrateKind[];
  all_required_resolved: boolean;
  records_requested: Record<RetrievalSubstrateKind, number>;
};
