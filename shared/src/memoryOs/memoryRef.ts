import type { IdentityRef } from "./primitives.js";

/** Pointer to supporting record — identifier only (no graph traversal in Wave 1). */
export type MemoryObjectRef = string;

export const MEMORY_OBJECT_REF_PREFIXES = [
  "episode:",
  "fact:",
  "artifact:",
  "source:",
  "identity:",
  "decision:",
] as const;

export function isMemoryObjectRef(value: string): boolean {
  if (!value.trim()) return false;
  return MEMORY_OBJECT_REF_PREFIXES.some((prefix) => value.startsWith(prefix));
}

export function identityRefMatches(a: IdentityRef, b: IdentityRef): boolean {
  return a.identity_id === b.identity_id && a.identity_kind === b.identity_kind;
}

export function authorityRefsInclude(
  refs: IdentityRef[],
  actor: IdentityRef,
): boolean {
  return refs.some((ref) => identityRefMatches(ref, actor));
}
