import type {
  Artifact,
  Conversation,
  ConversationTurn,
  DecisionCitation,
  Episode,
  Fact,
  MemoryDomain,
} from "./index.js";
import type {
  InclusionRuleApplication,
  RetrievalCompletenessReport,
  RetrievalExclusionReason,
  RetrievalRuleId,
} from "./retrievalRules.js";

/** ENG-EI-001.3 — Constitutional Retrieval · ordering · retrieval audit. */
export const CONSTITUTIONAL_RETRIEVAL_VERSION = "ENG-EI-001.3" as const;

export const CONSTITUTIONAL_RETRIEVAL_ENGINE_ID = "ENG-EI-001" as const;

/** Binding citation and record ordering — no relevance ranking. */
export const CONSTITUTIONAL_RETRIEVAL_ORDERING_SPEC =
  "event_at:asc,substrate:constitutional_order,record_id:asc" as const;

export const CONSTITUTIONAL_SUBSTRATE_KINDS = [
  "episode",
  "fact",
  "artifact",
  "conversation",
  "decision_citation",
] as const;

export type ConstitutionalSubstrateKind = (typeof CONSTITUTIONAL_SUBSTRATE_KINDS)[number];

export type ConstitutionalRetrievalRequest = {
  request_id: string;
  /** Human scope — e.g. "Initiative X". Not interpreted; carried in package metadata. */
  scope_label: string;
  /** When set, domain-scoped scans include only matching records. */
  domain?: MemoryDomain;
  /** Explicit substrate identifiers — deterministic fetch by id. */
  substrate_refs?: Partial<Record<ConstitutionalSubstrateKind, readonly string[]>>;
};

export type ExcludedRecord = {
  substrate: ConstitutionalSubstrateKind;
  record_id: string;
  reason: RetrievalExclusionReason;
  rule_id: RetrievalRuleId;
  rule_description: string;
};

export type RetrievalCoverageReport = {
  substrates_searched: ConstitutionalSubstrateKind[];
  records_retrieved: Record<ConstitutionalSubstrateKind, number>;
  records_excluded: ExcludedRecord[];
  inclusion_rules_applied: InclusionRuleApplication[];
  completeness: RetrievalCompletenessReport;
  retrieval_timestamp: string;
  retrieval_version: typeof CONSTITUTIONAL_RETRIEVAL_VERSION;
  citation_count: number;
};

export type RetrievalAuditTrail = {
  retrieval_version: typeof CONSTITUTIONAL_RETRIEVAL_VERSION;
  request_fingerprint: string;
  package_fingerprint: string;
  substrates_searched: ConstitutionalSubstrateKind[];
  citation_order: string[];
  ordering_spec: typeof CONSTITUTIONAL_RETRIEVAL_ORDERING_SPEC;
};

export type ConstitutionalCitation = {
  citation_ref: string;
  substrate: ConstitutionalSubstrateKind;
  record_id: string;
  event_at: string;
  ordering_key: string;
};

export type ConversationEvidence = {
  conversation: Conversation;
  turns: ConversationTurn[];
};

export type ConstitutionalEvidencePackageStatus =
  | "complete"
  | "withheld"
  | "insufficient_evidence";

export type ConstitutionalEvidencePackage = {
  package_id: string;
  request_id: string;
  scope_label: string;
  status: ConstitutionalEvidencePackageStatus;
  status_reason?: string;
  retrieval_version: typeof CONSTITUTIONAL_RETRIEVAL_VERSION;
  assembled_at: string;
  episodes: Episode[];
  facts: Fact[];
  artifacts: Artifact[];
  conversations: ConversationEvidence[];
  decision_citations: DecisionCitation[];
  citations: ConstitutionalCitation[];
  coverage_report: RetrievalCoverageReport;
  retrieval_audit: RetrievalAuditTrail;
};
