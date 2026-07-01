import type { Fact } from "@localbrain/shared";
import { isIso8601 } from "@localbrain/shared";
import { FactValidationError } from "./factValidator.js";

/** Immutable fact body — corrections create new records; lineage fields are metadata only. */
export function factAuthoritativeBodyFingerprint(fact: Fact): string {
  const {
    lifecycle_state: _lifecycle,
    superseded_by: _by,
    superseded_at: _at,
    valid_until: _until,
    ...body
  } = fact;
  return JSON.stringify(body);
}

function validateLineageFieldRules(obj: Record<string, unknown>): void {
  const hasSupersedes = obj.supersedes !== undefined;
  const hasSupersededBy = obj.superseded_by !== undefined;
  const hasSupersededAt = obj.superseded_at !== undefined;
  const hasReason = obj.supersession_reason !== undefined;

  if (hasSupersedes && hasSupersededBy) {
    throw new FactValidationError(
      "supersedes",
      "supersedes and superseded_by are mutually exclusive on one record",
    );
  }

  if (hasSupersedes) {
    if (typeof obj.supersedes !== "string" || !obj.supersedes.trim()) {
      throw new FactValidationError("supersedes", "required non-empty fact_id when present");
    }
    if (
      typeof obj.supersession_reason !== "string" ||
      !obj.supersession_reason.trim()
    ) {
      throw new FactValidationError(
        "supersession_reason",
        "required when supersedes is set",
      );
    }
  } else if (hasReason) {
    throw new FactValidationError(
      "supersession_reason",
      "only allowed when supersedes is set",
    );
  }

  if (hasSupersededBy) {
    if (typeof obj.superseded_by !== "string" || !obj.superseded_by.trim()) {
      throw new FactValidationError("superseded_by", "required non-empty fact_id when present");
    }
    if (!hasSupersededAt) {
      throw new FactValidationError("superseded_at", "required when superseded_by is set");
    }
  }

  if (hasSupersededAt) {
    if (typeof obj.superseded_at !== "string" || !isIso8601(obj.superseded_at)) {
      throw new FactValidationError("superseded_at", "invalid ISO-8601");
    }
    if (!hasSupersededBy) {
      throw new FactValidationError("superseded_by", "required when superseded_at is set");
    }
  }

  if (hasSupersedes && typeof obj.fact_id === "string" && obj.supersedes === obj.fact_id) {
    throw new FactValidationError("supersedes", "fact cannot supersede itself");
  }
}

export function validateFactLineageFields(obj: Record<string, unknown>): void {
  validateLineageFieldRules(obj);
}

export function assertSupersessionPair(
  prior: Fact,
  successor: Fact,
  reason: string,
): void {
  if (prior.fact_id === successor.fact_id) {
    throw new FactValidationError("supersedes", "successor must be a distinct fact");
  }
  if (prior.lifecycle_state !== "Superseded") {
    throw new FactValidationError("lifecycle_state", "prior must be Superseded after correction");
  }
  if (!prior.superseded_by) {
    throw new FactValidationError("superseded_by", "prior must reference successor fact_id");
  }
  if (successor.supersedes !== prior.fact_id) {
    throw new FactValidationError("supersedes", "successor must reference prior fact_id");
  }
  if (prior.superseded_by !== successor.fact_id) {
    throw new FactValidationError("superseded_by", "prior must reference successor fact_id");
  }
  if (prior.superseded_at !== successor.created_at) {
    throw new FactValidationError(
      "superseded_at",
      "must align with successor created_at at supersession",
    );
  }
  if (successor.supersession_reason !== reason.trim()) {
    throw new FactValidationError("supersession_reason", "must match supersession reason");
  }
}

export function isLifecycleEligibleForSupersession(state: Fact["lifecycle_state"]): boolean {
  return state === "Verified" || state === "Referenced" || state === "Strengthened";
}

export class FactContentMutationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FactContentMutationError";
  }
}

/** Corrections are lineage — authoritative statement fields must not change in place. */
export function assertFactBodyUnchanged(before: Fact, after: Fact): void {
  if (factAuthoritativeBodyFingerprint(before) !== factAuthoritativeBodyFingerprint(after)) {
    throw new FactContentMutationError(
      "Fact body mutation forbidden — correct by supersession, not in-place edit",
    );
  }
}
