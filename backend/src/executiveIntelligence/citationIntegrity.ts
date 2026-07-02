import type {
  Artifact,
  ConstitutionalCitation,
  ConstitutionalEvidencePackage,
  ConstitutionalSubstrateKind,
  ConversationEvidence,
  DecisionCitation,
  Episode,
  ExcludedRecord,
  Fact,
  RetrievalCompletenessReport,
} from "@localbrain/shared";
import { CONSTITUTIONAL_SUBSTRATE_KINDS } from "@localbrain/shared";
import { RETRIEVAL_RULE_IDS, RETRIEVAL_RULES } from "@localbrain/shared";

function emptySubstrateCounts(): Record<ConstitutionalSubstrateKind, number> {
  return {
    episode: 0,
    fact: 0,
    artifact: 0,
    conversation: 0,
    decision_citation: 0,
  };
}

function recordInPackage(
  substrate: ConstitutionalSubstrateKind,
  recordId: string,
  body: Pick<
    ConstitutionalEvidencePackage,
    "episodes" | "facts" | "artifacts" | "conversations" | "decision_citations"
  >,
): boolean {
  switch (substrate) {
    case "episode":
      return body.episodes.some((e) => e.episode_id === recordId);
    case "fact":
      return body.facts.some((f) => f.fact_id === recordId);
    case "artifact":
      return body.artifacts.some((a) => a.artifact_id === recordId);
    case "conversation":
      return body.conversations.some((c) => c.conversation.conversation_id === recordId);
    case "decision_citation":
      return body.decision_citations.some((d) => d.citation_id === recordId);
    default:
      return false;
  }
}

/** Lane 1 negative guard — every citation must reference an included record. */
export function verifyCitationIntegrity(
  body: Pick<
    ConstitutionalEvidencePackage,
    | "episodes"
    | "facts"
    | "artifacts"
    | "conversations"
    | "decision_citations"
    | "citations"
  >,
): { valid: boolean; broken: ExcludedRecord[] } {
  const broken: ExcludedRecord[] = [];
  const rule = RETRIEVAL_RULES[RETRIEVAL_RULE_IDS.CITATION_INTEGRITY];

  for (const citation of body.citations) {
    if (!recordInPackage(citation.substrate, citation.record_id, body)) {
      broken.push({
        substrate: citation.substrate,
        record_id: citation.record_id,
        reason: "citation_integrity_failure",
        rule_id: rule.rule_id,
        rule_description: `${rule.description} Broken ref: ${citation.citation_ref}.`,
      });
    }
  }

  return { valid: broken.length === 0, broken };
}

export function buildCompletenessReport(input: {
  mode: RetrievalCompletenessReport["mode"];
  substratesRequired: ConstitutionalSubstrateKind[];
  recordsRequested: Record<ConstitutionalSubstrateKind, number>;
  recordsRetrieved: Record<ConstitutionalSubstrateKind, number>;
  exclusionsCount: number;
}): RetrievalCompletenessReport {
  const substrates_with_results = CONSTITUTIONAL_SUBSTRATE_KINDS.filter(
    (k) => input.recordsRetrieved[k] > 0,
  );
  const all_required_resolved =
    input.mode === "explicit_refs"
      ? input.exclusionsCount === 0
      : input.substratesRequired.every((k) => input.recordsRetrieved[k] > 0 || input.recordsRequested[k] === 0);

  return {
    mode: input.mode,
    substrates_required: input.substratesRequired,
    substrates_with_results,
    all_required_resolved,
    records_requested: input.recordsRequested,
  };
}

export function exclusionFromRule(
  substrate: ConstitutionalSubstrateKind,
  recordId: string,
  reason: ExcludedRecord["reason"],
): ExcludedRecord {
  if (reason === "not_found") {
    const rule = RETRIEVAL_RULES[RETRIEVAL_RULE_IDS.REF_NOT_FOUND];
    return {
      substrate,
      record_id: recordId,
      reason,
      rule_id: rule.rule_id,
      rule_description: rule.description,
    };
  }
  if (reason === "domain_mismatch") {
    const rule = RETRIEVAL_RULES[RETRIEVAL_RULE_IDS.DOMAIN_FILTER];
    return {
      substrate,
      record_id: recordId,
      reason,
      rule_id: rule.rule_id,
      rule_description: rule.description,
    };
  }
  const rule = RETRIEVAL_RULES[RETRIEVAL_RULE_IDS.CITATION_INTEGRITY];
  return {
    substrate,
    record_id: recordId,
    reason,
    rule_id: rule.rule_id,
    rule_description: rule.description,
  };
}
