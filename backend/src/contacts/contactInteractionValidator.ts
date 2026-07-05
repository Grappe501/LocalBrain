import {
  CONTACT_INTERACTION_SENTIMENT,
  CONTACT_INTERACTION_SOURCES,
  CONTACT_INTERACTION_TYPES,
  CONTACT_INTERACTION_VISIBILITY,
  type ContactInteractionType,
  type ContactInteractionVisibility,
  type ContactUserRole,
  type CreateContactInteractionInput,
  type UpdateContactInteractionInput,
} from "@localbrain/shared";

export class ContactInteractionValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContactInteractionValidationError";
    this.code = code;
  }
}

export function assertInteractionType(value: unknown): ContactInteractionType {
  if (typeof value !== "string" || !CONTACT_INTERACTION_TYPES.includes(value as ContactInteractionType)) {
    throw new ContactInteractionValidationError("invalid_type", "Invalid interaction type");
  }
  return value as ContactInteractionType;
}

export function assertVisibility(value: unknown): ContactInteractionVisibility {
  if (
    typeof value !== "string" ||
    !CONTACT_INTERACTION_VISIBILITY.includes(value as ContactInteractionVisibility)
  ) {
    throw new ContactInteractionValidationError("invalid_visibility", "Invalid visibility");
  }
  return value as ContactInteractionVisibility;
}

export function validateCreateInteractionInput(input: CreateContactInteractionInput): void {
  if (!input.workspace_id?.trim()) {
    throw new ContactInteractionValidationError("workspace_required", "workspace_id is required");
  }
  if (!input.contact_id?.trim()) {
    throw new ContactInteractionValidationError("contact_required", "contact_id is required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactInteractionValidationError("user_required", "created_by_user_id is required");
  }
  assertInteractionType(input.type);
  if (!input.summary?.trim()) {
    throw new ContactInteractionValidationError("summary_required", "summary is required");
  }
  if (input.visibility) assertVisibility(input.visibility);
  if (
    input.sentiment &&
    !CONTACT_INTERACTION_SENTIMENT.includes(input.sentiment)
  ) {
    throw new ContactInteractionValidationError("invalid_sentiment", "Invalid sentiment");
  }
  if (input.source && !CONTACT_INTERACTION_SOURCES.includes(input.source)) {
    throw new ContactInteractionValidationError("invalid_source", "Invalid source");
  }
  if (input.follow_up_required && !input.follow_up_due_at) {
    throw new ContactInteractionValidationError(
      "follow_up_due_required",
      "follow_up_due_at is required when follow_up_required is true",
    );
  }
}

export function validateUpdateInteractionInput(input: UpdateContactInteractionInput): void {
  if (input.type !== undefined) assertInteractionType(input.type);
  if (input.visibility !== undefined) assertVisibility(input.visibility);
  if (input.summary !== undefined && !input.summary.trim()) {
    throw new ContactInteractionValidationError("summary_required", "summary cannot be empty");
  }
  if (
    input.sentiment !== undefined &&
    !CONTACT_INTERACTION_SENTIMENT.includes(input.sentiment)
  ) {
    throw new ContactInteractionValidationError("invalid_sentiment", "Invalid sentiment");
  }
}

export type ContactAccessContext = {
  user_id: string;
  role: ContactUserRole;
};

export function canViewInteraction(
  interaction: {
    visibility: ContactInteractionVisibility;
    created_by_user_id: string;
    assigned_to_user_id?: string;
  },
  ctx: ContactAccessContext,
): boolean {
  if (ctx.role === "admin" || ctx.role === "owner") return true;
  if (interaction.visibility === "private") {
    return interaction.created_by_user_id === ctx.user_id;
  }
  if (interaction.visibility === "leadership" && ctx.role === "viewer") {
    return false;
  }
  return true;
}

export function canMutateInteraction(
  interaction: { created_by_user_id: string; source: string },
  ctx: ContactAccessContext,
): boolean {
  if (ctx.role === "viewer") return false;
  if (ctx.role === "admin" || ctx.role === "owner") return true;
  if (interaction.source !== "manual" && interaction.source !== "ai_assisted") return false;
  return interaction.created_by_user_id === ctx.user_id;
}

export function resolveAccessContext(options: {
  user_id?: unknown;
  role?: unknown;
}): ContactAccessContext {
  const user_id =
    typeof options.user_id === "string" && options.user_id.trim()
      ? options.user_id.trim()
      : "local-user";
  const roleRaw = typeof options.role === "string" ? options.role.trim() : "admin";
  const role = (
    ["admin", "owner", "organizer", "viewer"].includes(roleRaw) ? roleRaw : "admin"
  ) as ContactUserRole;
  return { user_id, role };
}
