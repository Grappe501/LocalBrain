import type { Fact } from "@localbrain/shared";
import { ENG_MEM_ENGINE_ID } from "@localbrain/shared";
import { validateFactProvenanceAttachment } from "./factProvenance.js";
import { FactValidationError } from "./factValidator.js";

export const FACT_EXPLAIN_QUESTION = "Why does this Fact exist?" as const;

export type FactExplanationMethod = "substrate_reconstruction";

/** One hop in the deterministic explainability chain — stored field citation only. */
export type FactExplanationHop = {
  hop: string;
  fields: Record<string, unknown>;
};

export type FactExplanation = {
  question: typeof FACT_EXPLAIN_QUESTION;
  fact_id: string;
  engine_id: typeof ENG_MEM_ENGINE_ID;
  method: FactExplanationMethod;
  /** Ordered substrate walk — no LLM · no inference · no graph traversal. */
  chain: FactExplanationHop[];
  /** Dot-paths of every cited stored field (audit / A12 evidence). */
  cited_field_paths: string[];
};

export class FactNotExplainableError extends Error {
  readonly fact_id: string;

  constructor(factId: string, reason: string) {
    super(`Fact ${factId} not explainable from substrate: ${reason}`);
    this.name = "FactNotExplainableError";
    this.fact_id = factId;
  }
}

function pushHop(
  chain: FactExplanationHop[],
  cited: Set<string>,
  hop: string,
  entries: Record<string, unknown>,
  prefix: string,
): void {
  chain.push({ hop, fields: entries });
  for (const key of Object.keys(entries)) {
    cited.add(`${prefix}${key}`);
  }
}

/**
 * A12 — deterministic reconstruction from stored Fact substrate.
 * Does not resolve refs, rank recall, or invoke Intelligence.
 */
export function explainFactFromSubstrate(fact: Fact): FactExplanation {
  try {
    validateFactProvenanceAttachment(fact);
  } catch (err) {
    const reason = err instanceof FactValidationError ? err.message : "provenance invalid";
    throw new FactNotExplainableError(fact.fact_id, reason);
  }

  const chain: FactExplanationHop[] = [];
  const cited = new Set<string>();

  pushHop(
    chain,
    cited,
    "fact",
    {
      fact_id: fact.fact_id,
      schema_version: fact.schema_version,
      domain: fact.domain,
      statement: fact.statement,
      subject_ref: fact.subject_ref,
      predicate: fact.predicate,
      object_ref: fact.object_ref ?? null,
    },
    "fact.",
  );

  pushHop(
    chain,
    cited,
    "provenance",
    {
      provenance_id: fact.provenance.provenance_id,
      source_ref: fact.provenance.source_ref,
      capture_method: fact.provenance.capture_method,
      captured_by: fact.provenance.captured_by,
      consent_ref: fact.provenance.consent_ref,
      convention_provenance_version: fact.provenance.convention_provenance_version,
      trust: fact.provenance.trust,
      recorded_at: fact.provenance.recorded_at,
    },
    "provenance.",
  );

  pushHop(
    chain,
    cited,
    "source_refs",
    { source_refs: fact.source_refs },
    "source_refs",
  );

  pushHop(
    chain,
    cited,
    "authority_refs",
    { authority_refs: fact.authority_refs },
    "authority_refs",
  );

  pushHop(
    chain,
    cited,
    "confidence",
    { confidence: fact.confidence },
    "confidence.",
  );

  pushHop(
    chain,
    cited,
    "validity",
    {
      valid_from: fact.valid_from ?? null,
      valid_until: fact.valid_until ?? null,
    },
    "validity.",
  );

  pushHop(
    chain,
    cited,
    "timestamps",
    {
      event_at: fact.event_at,
      created_at: fact.created_at,
    },
    "timestamps.",
  );

  pushHop(
    chain,
    cited,
    "lifecycle",
    { lifecycle_state: fact.lifecycle_state },
    "lifecycle.",
  );

  if (fact.supersedes) {
    pushHop(
      chain,
      cited,
      "supersession_lineage",
      {
        supersedes: fact.supersedes,
        supersession_reason: fact.supersession_reason ?? null,
      },
      "lineage.",
    );
  }

  if (fact.superseded_by) {
    pushHop(
      chain,
      cited,
      "supersession_successor",
      {
        superseded_by: fact.superseded_by,
        superseded_at: fact.superseded_at ?? null,
      },
      "lineage.",
    );
  }

  return {
    question: FACT_EXPLAIN_QUESTION,
    fact_id: fact.fact_id,
    engine_id: ENG_MEM_ENGINE_ID,
    method: "substrate_reconstruction",
    chain,
    cited_field_paths: [...cited].sort(),
  };
}

/** Load Fact by id and reconstruct A12 explanation — identifier lookup only, no graph walk. */
export function explainStoredFactById(factId: string, load: (id: string) => Fact | null): FactExplanation {
  const fact = load(factId);
  if (!fact) {
    throw new FactNotExplainableError(factId, "fact not found");
  }
  return explainFactFromSubstrate(fact);
}

/** True when explanation chain includes required A12 substrate hops. */
export function isCompleteFactExplanation(explanation: FactExplanation): boolean {
  const hops = new Set(explanation.chain.map((c) => c.hop));
  return (
    hops.has("fact") &&
    hops.has("provenance") &&
    hops.has("source_refs") &&
    hops.has("authority_refs") &&
    hops.has("lifecycle") &&
    hops.has("timestamps") &&
    explanation.cited_field_paths.includes("provenance.source_ref") &&
    explanation.cited_field_paths.some((p) => p.startsWith("source_refs"))
  );
}
