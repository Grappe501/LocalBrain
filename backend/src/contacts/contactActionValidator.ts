import {
  CONTACT_TASK_PRIORITIES,
  CONTACT_TASK_SOURCES,
  CONTACT_TASK_STATUSES,
  type CompleteContactActionTaskInput,
  type ContactTaskPriority,
  type ContactTaskSource,
  type ContactTaskStatus,
  type CreateContactActionTaskInput,
  type UpdateContactActionTaskInput,
} from "@localbrain/shared";
import { resolveAccessContext, type ContactAccessContext } from "./contactInteractionValidator.js";

export class ContactActionValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContactActionValidationError";
    this.code = code;
  }
}

export { resolveAccessContext, type ContactAccessContext };

export function assertTaskStatus(value: unknown): ContactTaskStatus {
  if (typeof value !== "string" || !CONTACT_TASK_STATUSES.includes(value as ContactTaskStatus)) {
    throw new ContactActionValidationError("invalid_status", "Invalid task status");
  }
  return value as ContactTaskStatus;
}

export function assertTaskPriority(value: unknown): ContactTaskPriority {
  if (
    typeof value !== "string" ||
    !CONTACT_TASK_PRIORITIES.includes(value as ContactTaskPriority)
  ) {
    throw new ContactActionValidationError("invalid_priority", "Invalid task priority");
  }
  return value as ContactTaskPriority;
}

export function assertTaskSource(value: unknown): ContactTaskSource {
  if (typeof value !== "string" || !CONTACT_TASK_SOURCES.includes(value as ContactTaskSource)) {
    throw new ContactActionValidationError("invalid_source", "Invalid task source");
  }
  return value as ContactTaskSource;
}

export function validateCreateTaskInput(input: CreateContactActionTaskInput): void {
  if (!input.workspace_id?.trim() || !input.contact_id?.trim()) {
    throw new ContactActionValidationError("ids_required", "workspace_id and contact_id are required");
  }
  if (!input.title?.trim()) {
    throw new ContactActionValidationError("title_required", "title is required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactActionValidationError("user_required", "created_by_user_id is required");
  }
  if (input.priority !== undefined) assertTaskPriority(input.priority);
  if (input.source !== undefined) assertTaskSource(input.source);
}

export function validateUpdateTaskInput(input: UpdateContactActionTaskInput): void {
  if (!input.updated_by_user_id?.trim()) {
    throw new ContactActionValidationError("user_required", "updated_by_user_id is required");
  }
  if (input.title !== undefined && !input.title.trim()) {
    throw new ContactActionValidationError("title_required", "title cannot be empty");
  }
  if (input.priority !== undefined) assertTaskPriority(input.priority);
}

export function validateCompleteTaskInput(input: CompleteContactActionTaskInput): void {
  if (!input.completed_by_user_id?.trim()) {
    throw new ContactActionValidationError("user_required", "completed_by_user_id is required");
  }
}

export function canViewActions(_ctx: ContactAccessContext): boolean {
  return true;
}

export function canEditActions(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner" || ctx.role === "organizer";
}

export function assertRoleCapable(allowed: boolean, code: string, message: string): void {
  if (!allowed) {
    throw new ContactActionValidationError(code, message);
  }
}
