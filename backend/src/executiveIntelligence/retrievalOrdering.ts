import type {
  Artifact,
  ConstitutionalCitation,
  ConstitutionalSubstrateKind,
  ConversationEvidence,
  DecisionCitation,
  Episode,
  ExcludedRecord,
  Fact,
} from "@localbrain/shared";
import { CONSTITUTIONAL_SUBSTRATE_KINDS } from "@localbrain/shared";

/** Binding ordering spec — event time, constitutional substrate order, record id. */
export const RETRIEVAL_ORDERING_SPEC =
  "event_at:asc,substrate:constitutional_order,record_id:asc" as const;

function compareEventThenId(eventA: string, idA: string, eventB: string, idB: string): number {
  const byEvent = eventA.localeCompare(eventB);
  if (byEvent !== 0) return byEvent;
  return idA.localeCompare(idB);
}

export function substrateOrdinal(substrate: ConstitutionalSubstrateKind): number {
  return CONSTITUTIONAL_SUBSTRATE_KINDS.indexOf(substrate);
}

export function sortEpisodes(episodes: Episode[]): Episode[] {
  return [...episodes].sort((a, b) =>
    compareEventThenId(a.event_at, a.episode_id, b.event_at, b.episode_id),
  );
}

export function sortFacts(facts: Fact[]): Fact[] {
  return [...facts].sort((a, b) =>
    compareEventThenId(a.event_at, a.fact_id, b.event_at, b.fact_id),
  );
}

export function sortArtifacts(artifacts: Artifact[]): Artifact[] {
  return [...artifacts].sort((a, b) =>
    compareEventThenId(a.event_at, a.artifact_id, b.event_at, b.artifact_id),
  );
}

export function sortDecisionCitations(citations: DecisionCitation[]): DecisionCitation[] {
  return [...citations].sort((a, b) =>
    compareEventThenId(a.event_at, a.citation_id, b.event_at, b.citation_id),
  );
}

export function sortConversationEvidence(
  conversations: ConversationEvidence[],
): ConversationEvidence[] {
  return [...conversations]
    .map((entry) => ({
      conversation: entry.conversation,
      turns: [...entry.turns].sort(
        (a, b) => a.sequence - b.sequence || a.event_at.localeCompare(b.event_at),
      ),
    }))
    .sort((a, b) =>
      compareEventThenId(
        a.conversation.event_at,
        a.conversation.conversation_id,
        b.conversation.event_at,
        b.conversation.conversation_id,
      ),
    );
}

export function sortCitationsStable(citations: ConstitutionalCitation[]): ConstitutionalCitation[] {
  return [...citations].sort((a, b) => {
    const byKey = a.ordering_key.localeCompare(b.ordering_key);
    if (byKey !== 0) return byKey;
    const bySubstrate = substrateOrdinal(a.substrate) - substrateOrdinal(b.substrate);
    if (bySubstrate !== 0) return bySubstrate;
    return a.record_id.localeCompare(b.record_id);
  });
}

export function sortExcludedRecords(excluded: ExcludedRecord[]): ExcludedRecord[] {
  return [...excluded].sort((a, b) => {
    const bySubstrate = substrateOrdinal(a.substrate) - substrateOrdinal(b.substrate);
    if (bySubstrate !== 0) return bySubstrate;
    return a.record_id.localeCompare(b.record_id);
  });
}

export function sortSubstratesSearched(
  substrates: ConstitutionalSubstrateKind[],
): ConstitutionalSubstrateKind[] {
  return [...substrates].sort(
    (a, b) => substrateOrdinal(a) - substrateOrdinal(b),
  );
}
