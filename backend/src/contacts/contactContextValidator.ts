import {
  CONTACT_CONTEXT_CATEGORIES,
  CONTACT_CONTEXT_RANKS,
  CONTACT_CONTEXT_SOURCES,
  type AssignContactContextInput,
  type ContactContextCategory,
  type ContactContextRank,
  type ContactUserRole,
  type CreateRelationshipContextInput,
  type MergeRelationshipContextsInput,
  type UpdateContactContextLinkInput,
  type UpdateRelationshipContextInput,
} from "@localbrain/shared";
import { resolveAccessContext, type ContactAccessContext } from "./contactInteractionValidator.js";

export class ContactContextValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContactContextValidationError";
    this.code = code;
  }
}

export { resolveAccessContext, type ContactAccessContext };

export function assertContextCategory(value: unknown): ContactContextCategory {
  if (typeof value !== "string" || !CONTACT_CONTEXT_CATEGORIES.includes(value as ContactContextCategory)) {
    throw new ContactContextValidationError("invalid_category", "Invalid context category");
  }
  return value as ContactContextCategory;
}

export function assertContextRank(value: unknown): ContactContextRank {
  if (typeof value !== "string" || !CONTACT_CONTEXT_RANKS.includes(value as ContactContextRank)) {
    throw new ContactContextValidationError("invalid_rank", "Invalid context rank");
  }
  return value as ContactContextRank;
}

export function validateCreateContextInput(input: CreateRelationshipContextInput): void {
  if (!input.workspace_id?.trim()) {
    throw new ContactContextValidationError("workspace_required", "workspace_id is required");
  }
  if (!input.label?.trim()) {
    throw new ContactContextValidationError("label_required", "label is required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactContextValidationError("user_required", "created_by_user_id is required");
  }
  if (input.category) assertContextCategory(input.category);
}

export function validateUpdateContextInput(input: UpdateRelationshipContextInput): void {
  if (input.label !== undefined && !input.label.trim()) {
    throw new ContactContextValidationError("label_required", "label cannot be empty");
  }
  if (input.category !== undefined) assertContextCategory(input.category);
}

export function validateAssignContextInput(input: AssignContactContextInput): void {
  if (!input.workspace_id?.trim() || !input.contact_id?.trim() || !input.context_id?.trim()) {
    throw new ContactContextValidationError("ids_required", "workspace_id, contact_id, and context_id are required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactContextValidationError("user_required", "created_by_user_id is required");
  }
  if (input.rank) assertContextRank(input.rank);
  if (input.source && !CONTACT_CONTEXT_SOURCES.includes(input.source)) {
    throw new ContactContextValidationError("invalid_source", "Invalid context source");
  }
}

export function validateUpdateLinkInput(input: UpdateContactContextLinkInput): void {
  if (input.rank !== undefined) assertContextRank(input.rank);
}

export function validateMergeContextsInput(input: MergeRelationshipContextsInput): void {
  if (!input.workspace_id?.trim() || !input.from_context_id?.trim() || !input.to_context_id?.trim()) {
    throw new ContactContextValidationError("merge_ids_required", "workspace_id and context ids are required");
  }
  if (input.from_context_id === input.to_context_id) {
    throw new ContactContextValidationError("merge_same", "Cannot merge a context into itself");
  }
  if (!input.merged_by_user_id?.trim()) {
    throw new ContactContextValidationError("user_required", "merged_by_user_id is required");
  }
}

export function canViewContexts(_ctx: ContactAccessContext): boolean {
  return true;
}

export function canCreateContextCatalog(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner";
}

export function canEditContextCatalog(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner";
}

export function canArchiveContext(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin";
}

export function canMergeContexts(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin";
}

export function canAssignContactContext(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner" || ctx.role === "organizer";
}

export function canEndContactContextLink(ctx: ContactAccessContext): boolean {
  return canAssignContactContext(ctx);
}

export function assertRoleCapable(
  allowed: boolean,
  code: string,
  message: string,
): void {
  if (!allowed) {
    throw new ContactContextValidationError(code, message);
  }
}

export type { ContactUserRole };
