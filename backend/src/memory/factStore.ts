import {
  assertLifecycleTransitionAllowed,
  deserializeFact,
  type Fact,
  serializeFact,
  type LifecycleState,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export class FactNotFoundError extends Error {
  constructor(factId: string) {
    super(`Fact not found: ${factId}`);
    this.name = "FactNotFoundError";
  }
}

export class FactImmutableFieldError extends Error {
  constructor(field: string) {
    super(`Fact authoritative field is immutable: ${field}`);
    this.name = "FactImmutableFieldError";
  }
}

export function insertFact(fact: Fact): void {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO memory_facts (
      fact_id, domain, lifecycle_state, schema_version,
      payload_json, created_at, lifecycle_updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    fact.fact_id,
    fact.domain,
    fact.lifecycle_state,
    fact.schema_version,
    serializeFact(fact),
    fact.created_at,
    fact.created_at,
  );
}

export function getFactById(factId: string): Fact | null {
  const row = getDatabase()
    .prepare(`SELECT payload_json FROM memory_facts WHERE fact_id = ?`)
    .get(factId) as { payload_json: string } | undefined;
  if (!row) return null;
  return deserializeFact(row.payload_json);
}

export function updateFactLifecycleState(
  factId: string,
  nextState: LifecycleState,
  lifecycleUpdatedAt: string,
): Fact {
  const current = getFactById(factId);
  if (!current) throw new FactNotFoundError(factId);

  assertLifecycleTransitionAllowed(current.lifecycle_state, nextState);

  const updated: Fact = {
    ...current,
    lifecycle_state: nextState,
  };

  getDatabase()
    .prepare(
      `UPDATE memory_facts
       SET lifecycle_state = ?, lifecycle_updated_at = ?
       WHERE fact_id = ?`,
    )
    .run(nextState, lifecycleUpdatedAt, factId);

  return updated;
}

/** Payload body is append-only — only lifecycle_state may change after insert. */
export function factContentFingerprint(fact: Fact): string {
  const { lifecycle_state: _state, ...content } = fact;
  return JSON.stringify(content);
}

export function assertFactContentUnchanged(before: Fact, after: Fact): void {
  if (factContentFingerprint(before) !== factContentFingerprint(after)) {
    throw new FactImmutableFieldError("payload");
  }
}

export function getFactPayloadRevisionCount(factId: string): number {
  const row = getDatabase()
    .prepare(`SELECT COUNT(*) AS count FROM memory_facts WHERE fact_id = ?`)
    .get(factId) as { count: number };
  return row.count;
}
