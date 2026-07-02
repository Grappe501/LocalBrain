/**
 * ENG-EI-001 Constitutional Retrieval — read-only · cite · package evidence.
 * Constitutional Retrieval assembles constitutional records. It does not evaluate them.
 */

import type {
  Artifact,
  ConstitutionalCitation,
  ConstitutionalEvidencePackage,
  ConstitutionalRetrievalRequest,
  ConstitutionalSubstrateKind,
  Conversation,
  ConversationEvidence,
  DecisionCitation,
  Episode,
  ExcludedRecord,
  Fact,
  MemoryDomain,
  RetrievalCoverageReport,
} from "@localbrain/shared";
import {
  CONSTITUTIONAL_RETRIEVAL_ENGINE_ID,
  CONSTITUTIONAL_RETRIEVAL_VERSION,
  CONSTITUTIONAL_SUBSTRATE_KINDS,
} from "@localbrain/shared";
import { getArtifactById } from "../memory/artifactStore.js";
import { getConversationById } from "../memory/conversationStore.js";
import { getConversationTurnsByConversationId } from "../memory/conversationTurnStore.js";
import { getDecisionCitationById } from "../memory/decisionCitationStore.js";
import { getEpisodeById } from "../memory/episodeStore.js";
import { getFactById } from "../memory/factStore.js";
import {
  listArtifactsReadOnly,
  listConversationsReadOnly,
  listDecisionCitationsReadOnlyScoped,
  listEpisodesReadOnly,
  listFactsReadOnly,
} from "../memory/substrateReadAccess.js";

function emptyRetrievedCounts(): Record<ConstitutionalSubstrateKind, number> {
  return {
    episode: 0,
    fact: 0,
    artifact: 0,
    conversation: 0,
    decision_citation: 0,
  };
}

function citationRef(substrate: ConstitutionalSubstrateKind, recordId: string): string {
  return `${substrate}:${recordId}`;
}

function episodeEventAt(episode: Episode): string {
  return episode.event_at;
}

function factEventAt(fact: Fact): string {
  return fact.event_at;
}

function artifactEventAt(artifact: Artifact): string {
  return artifact.event_at;
}

function conversationEventAt(conversation: Conversation): string {
  return conversation.event_at;
}

function decisionCitationEventAt(citation: DecisionCitation): string {
  return citation.event_at;
}

function buildCitation(
  substrate: ConstitutionalSubstrateKind,
  recordId: string,
  eventAt: string,
): ConstitutionalCitation {
  return {
    citation_ref: citationRef(substrate, recordId),
    substrate,
    record_id: recordId,
    event_at: eventAt,
    ordering_key: `${eventAt}\0${recordId}`,
  };
}

function domainMatches(
  recordDomain: MemoryDomain | undefined,
  filter?: MemoryDomain,
): boolean {
  if (!filter) return true;
  return recordDomain === filter;
}

function fetchById(
  substrate: ConstitutionalSubstrateKind,
  recordId: string,
  domain: MemoryDomain | undefined,
  excluded: ExcludedRecord[],
):
  | { kind: "episode"; episode: Episode }
  | { kind: "fact"; fact: Fact }
  | { kind: "artifact"; artifact: Artifact }
  | { kind: "conversation"; conversation: Conversation }
  | { kind: "decision_citation"; citation: DecisionCitation }
  | null {
  switch (substrate) {
    case "episode": {
      const episode = getEpisodeById(recordId);
      if (!episode) {
        excluded.push({ substrate, record_id: recordId, reason: "not_found" });
        return null;
      }
      if (!domainMatches(episode.domain, domain)) {
        excluded.push({ substrate, record_id: recordId, reason: "domain_mismatch" });
        return null;
      }
      return { kind: "episode", episode };
    }
    case "fact": {
      const fact = getFactById(recordId);
      if (!fact) {
        excluded.push({ substrate, record_id: recordId, reason: "not_found" });
        return null;
      }
      if (!domainMatches(fact.domain, domain)) {
        excluded.push({ substrate, record_id: recordId, reason: "domain_mismatch" });
        return null;
      }
      return { kind: "fact", fact };
    }
    case "artifact": {
      const artifact = getArtifactById(recordId);
      if (!artifact) {
        excluded.push({ substrate, record_id: recordId, reason: "not_found" });
        return null;
      }
      if (!domainMatches(artifact.domain, domain)) {
        excluded.push({ substrate, record_id: recordId, reason: "domain_mismatch" });
        return null;
      }
      return { kind: "artifact", artifact };
    }
    case "conversation": {
      const conversation = getConversationById(recordId);
      if (!conversation) {
        excluded.push({ substrate, record_id: recordId, reason: "not_found" });
        return null;
      }
      if (!domainMatches(conversation.domain, domain)) {
        excluded.push({ substrate, record_id: recordId, reason: "domain_mismatch" });
        return null;
      }
      return { kind: "conversation", conversation };
    }
    case "decision_citation": {
      const citation = getDecisionCitationById(recordId);
      if (!citation) {
        excluded.push({ substrate, record_id: recordId, reason: "not_found" });
        return null;
      }
      return { kind: "decision_citation", citation };
    }
    default:
      return null;
  }
}

function sortCitations(citations: ConstitutionalCitation[]): ConstitutionalCitation[] {
  return [...citations].sort((a, b) => a.ordering_key.localeCompare(b.ordering_key));
}

function assembleFromRefs(
  request: ConstitutionalRetrievalRequest,
): Pick<
  ConstitutionalEvidencePackage,
  | "episodes"
  | "facts"
  | "artifacts"
  | "conversations"
  | "decision_citations"
  | "citations"
  | "coverage_report"
> {
  const excluded: ExcludedRecord[] = [];
  const substratesSearched = new Set<ConstitutionalSubstrateKind>();
  const episodes: Episode[] = [];
  const facts: Fact[] = [];
  const artifacts: Artifact[] = [];
  const conversations: ConversationEvidence[] = [];
  const decision_citations: DecisionCitation[] = [];
  const citations: ConstitutionalCitation[] = [];
  const retrieved = emptyRetrievedCounts();

  const refs = request.substrate_refs ?? {};
  for (const substrate of CONSTITUTIONAL_SUBSTRATE_KINDS) {
    const ids = refs[substrate];
    if (!ids?.length) continue;
    substratesSearched.add(substrate);
    for (const recordId of ids) {
      const result = fetchById(substrate, recordId, request.domain, excluded);
      if (!result) continue;
      switch (result.kind) {
        case "episode":
          episodes.push(result.episode);
          retrieved.episode += 1;
          citations.push(
            buildCitation("episode", result.episode.episode_id, episodeEventAt(result.episode)),
          );
          break;
        case "fact":
          facts.push(result.fact);
          retrieved.fact += 1;
          citations.push(
            buildCitation("fact", result.fact.fact_id, factEventAt(result.fact)),
          );
          break;
        case "artifact":
          artifacts.push(result.artifact);
          retrieved.artifact += 1;
          citations.push(
            buildCitation(
              "artifact",
              result.artifact.artifact_id,
              artifactEventAt(result.artifact),
            ),
          );
          break;
        case "conversation": {
          const turns = getConversationTurnsByConversationId(result.conversation.conversation_id);
          conversations.push({ conversation: result.conversation, turns });
          retrieved.conversation += 1;
          citations.push(
            buildCitation(
              "conversation",
              result.conversation.conversation_id,
              conversationEventAt(result.conversation),
            ),
          );
          break;
        }
        case "decision_citation":
          decision_citations.push(result.citation);
          retrieved.decision_citation += 1;
          citations.push(
            buildCitation(
              "decision_citation",
              result.citation.citation_id,
              decisionCitationEventAt(result.citation),
            ),
          );
          break;
        default:
          break;
      }
    }
  }

  const sorted = sortCitations(citations);
  const coverage_report: RetrievalCoverageReport = {
    substrates_searched: [...substratesSearched],
    records_retrieved: retrieved,
    records_excluded: excluded,
    retrieval_timestamp: new Date().toISOString(),
    retrieval_version: CONSTITUTIONAL_RETRIEVAL_VERSION,
    citation_count: sorted.length,
  };

  return {
    episodes,
    facts,
    artifacts,
    conversations,
    decision_citations,
    citations: sorted,
    coverage_report,
  };
}

function assembleFromDomainScan(
  request: ConstitutionalRetrievalRequest,
): Pick<
  ConstitutionalEvidencePackage,
  | "episodes"
  | "facts"
  | "artifacts"
  | "conversations"
  | "decision_citations"
  | "citations"
  | "coverage_report"
> {
  const episodes = listEpisodesReadOnly(request.domain);
  const facts = listFactsReadOnly(request.domain);
  const artifacts = listArtifactsReadOnly(request.domain);
  const conversationRecords = listConversationsReadOnly(request.domain);
  const decision_citations = request.domain
    ? []
    : listDecisionCitationsReadOnlyScoped();

  const substratesSearched: ConstitutionalSubstrateKind[] = request.domain
    ? ["episode", "fact", "artifact", "conversation"]
    : [...CONSTITUTIONAL_SUBSTRATE_KINDS];

  const citations: ConstitutionalCitation[] = [
    ...episodes.map((e) => buildCitation("episode", e.episode_id, episodeEventAt(e))),
    ...facts.map((f) => buildCitation("fact", f.fact_id, factEventAt(f))),
    ...artifacts.map((a) =>
      buildCitation("artifact", a.artifact_id, artifactEventAt(a)),
    ),
    ...conversationRecords.map((c) =>
      buildCitation("conversation", c.conversation_id, conversationEventAt(c)),
    ),
    ...decision_citations.map((d) =>
      buildCitation("decision_citation", d.citation_id, decisionCitationEventAt(d)),
    ),
  ];

  const conversations: ConversationEvidence[] = conversationRecords.map((conversation) => ({
    conversation,
    turns: getConversationTurnsByConversationId(conversation.conversation_id),
  }));

  const sorted = sortCitations(citations);
  const coverage_report: RetrievalCoverageReport = {
    substrates_searched: substratesSearched,
    records_retrieved: {
      episode: episodes.length,
      fact: facts.length,
      artifact: artifacts.length,
      conversation: conversations.length,
      decision_citation: decision_citations.length,
    },
    records_excluded: [],
    retrieval_timestamp: new Date().toISOString(),
    retrieval_version: CONSTITUTIONAL_RETRIEVAL_VERSION,
    citation_count: sorted.length,
  };

  return {
    episodes,
    facts,
    artifacts,
    conversations,
    decision_citations,
    citations: sorted,
    coverage_report,
  };
}

function hasExplicitRefs(request: ConstitutionalRetrievalRequest): boolean {
  const refs = request.substrate_refs;
  if (!refs) return false;
  return CONSTITUTIONAL_SUBSTRATE_KINDS.some((k) => (refs[k]?.length ?? 0) > 0);
}

function resolveStatus(
  body: Pick<ConstitutionalEvidencePackage, "citations" | "coverage_report">,
  explicitRefs: boolean,
): Pick<ConstitutionalEvidencePackage, "status" | "status_reason"> {
  if (explicitRefs && body.coverage_report.records_excluded.length > 0) {
    return {
      status: "withheld",
      status_reason:
        "Evidence package withheld — one or more requested substrate references could not be resolved (Article VIII · Article IX).",
    };
  }
  if (body.citations.length === 0) {
    return {
      status: "insufficient_evidence",
      status_reason:
        "No constitutional records matched the retrieval request — insufficient evidence reported without fabrication (Article VIII).",
    };
  }
  return { status: "complete" };
}

/** Assemble a deterministic constitutional evidence package — read-only · no reasoning. */
export function assembleConstitutionalEvidencePackage(
  request: ConstitutionalRetrievalRequest,
): ConstitutionalEvidencePackage {
  const explicitRefs = hasExplicitRefs(request);
  const body = explicitRefs
    ? assembleFromRefs(request)
    : assembleFromDomainScan(request);
  const { status, status_reason } = resolveStatus(body, explicitRefs);
  const assembled_at = new Date().toISOString();

  return {
    package_id: crypto.randomUUID(),
    request_id: request.request_id,
    scope_label: request.scope_label,
    status,
    status_reason,
    retrieval_version: CONSTITUTIONAL_RETRIEVAL_VERSION,
    assembled_at,
    ...body,
  };
}

export { CONSTITUTIONAL_RETRIEVAL_ENGINE_ID, CONSTITUTIONAL_RETRIEVAL_VERSION };
