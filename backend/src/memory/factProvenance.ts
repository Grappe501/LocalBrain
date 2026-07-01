import type { Fact, IdentityRef } from "@localbrain/shared";
import { authorityRefsInclude, isMemoryObjectRef } from "@localbrain/shared";
import { FactValidationError } from "./factValidator.js";

function validateIdentityRefList(value: unknown, field: string): IdentityRef[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new FactValidationError(field, "at least one authority reference required");
  }
  const refs: IdentityRef[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const item = value[i];
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      throw new FactValidationError(`${field}[${i}]`, "must be identity_ref object");
    }
    const obj = item as Record<string, unknown>;
    if (typeof obj.identity_id !== "string" || !obj.identity_id.trim()) {
      throw new FactValidationError(`${field}[${i}].identity_id`, "required");
    }
    if (typeof obj.identity_kind !== "string" || !obj.identity_kind.trim()) {
      throw new FactValidationError(`${field}[${i}].identity_kind`, "required");
    }
    refs.push({ identity_id: obj.identity_id, identity_kind: obj.identity_kind });
  }
  return refs;
}

function validateSourceRefList(value: unknown): string[] {
  const field = "source_refs";
  if (!Array.isArray(value) || value.length === 0) {
    throw new FactValidationError(field, "at least one source reference required");
  }
  const refs: string[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const item = value[i];
    if (typeof item !== "string" || !isMemoryObjectRef(item)) {
      throw new FactValidationError(
        `${field}[${i}]`,
        "must be a prefixed memory object ref (episode:, source:, artifact:, …)",
      );
    }
    refs.push(item);
  }
  return refs;
}

/**
 * S4 provenance attachment — knowledge must remain linked to evidence and authority.
 * Identifier refs only — no graph traversal or recall.
 */
export function validateFactProvenanceAttachment(fact: Fact): void {
  const sourceRefs = validateSourceRefList(fact.source_refs);
  const authorityRefs = validateIdentityRefList(fact.authority_refs, "authority_refs");

  if (!sourceRefs.includes(fact.provenance.source_ref)) {
    throw new FactValidationError(
      "source_refs",
      "must include provenance.source_ref — knowledge attached to evidence",
    );
  }

  if (!authorityRefsInclude(authorityRefs, fact.provenance.captured_by)) {
    throw new FactValidationError(
      "authority_refs",
      "must include provenance.captured_by — capture authority required",
    );
  }
}

export function assertFactVerificationAuthority(fact: Fact, actor: IdentityRef): void {
  validateFactProvenanceAttachment(fact);
  if (!authorityRefsInclude(fact.authority_refs, actor)) {
    throw new FactValidationError(
      "authority_refs",
      "verifying actor must be listed in authority_refs",
    );
  }
}
