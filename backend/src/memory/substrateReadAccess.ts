/**
 * Read-only constitutional substrate access for ENG-EI-001.
 * Constitutional Retrieval assembles constitutional records. It does not evaluate them.
 */

import {
  deserializeArtifact,
  deserializeConversation,
  deserializeDecisionCitation,
  deserializeEpisode,
  deserializeFact,
  type Artifact,
  type Conversation,
  type DecisionCitation,
  type Episode,
  type Fact,
  type MemoryDomain,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

function listPayloads<T>(
  table: string,
  deserialize: (json: string) => T,
  domain?: MemoryDomain,
): T[] {
  const db = getDatabase();
  const rows = domain
    ? (db
        .prepare(
          `SELECT payload_json FROM ${table} WHERE domain = ? ORDER BY created_at ASC, rowid ASC`,
        )
        .all(domain) as { payload_json: string }[])
    : (db
        .prepare(`SELECT payload_json FROM ${table} ORDER BY created_at ASC, rowid ASC`)
        .all() as { payload_json: string }[]);
  return rows.map((r) => deserialize(r.payload_json));
}

function listDecisionCitationsReadOnly(): DecisionCitation[] {
  const rows = getDatabase()
    .prepare(
      `SELECT payload_json FROM memory_decision_citations ORDER BY created_at ASC, rowid ASC`,
    )
    .all() as { payload_json: string }[];
  return rows.map((r) => deserializeDecisionCitation(r.payload_json));
}

export function listEpisodesReadOnly(domain?: MemoryDomain): Episode[] {
  return listPayloads("memory_episodes", deserializeEpisode, domain);
}

export function listFactsReadOnly(domain?: MemoryDomain): Fact[] {
  return listPayloads("memory_facts", deserializeFact, domain);
}

export function listArtifactsReadOnly(domain?: MemoryDomain): Artifact[] {
  return listPayloads("memory_artifacts", deserializeArtifact, domain);
}

export function listConversationsReadOnly(domain?: MemoryDomain): Conversation[] {
  return listPayloads("memory_conversations", deserializeConversation, domain);
}

export function listDecisionCitationsReadOnlyScoped(
  _domain?: MemoryDomain,
): DecisionCitation[] {
  return listDecisionCitationsReadOnly();
}
