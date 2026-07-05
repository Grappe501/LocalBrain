import {
  CONTACT_LIFECYCLE_STAGES,
  CONTACT_RELATIONSHIP_STRENGTHS,
  CONTACT_STEWARD_PARTICIPANT_ROLES,
  type AddContactStewardParticipantInput,
  type AssignContactStewardInput,
  type ContactLifecycleStage,
  type ContactRelationshipStrength,
  type ContactStewardParticipantRole,
  type UpdateContactStewardshipInput,
} from "@localbrain/shared";
import { resolveAccessContext, type ContactAccessContext } from "./contactInteractionValidator.js";

export class ContactStewardshipValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContactStewardshipValidationError";
    this.code = code;
  }
}

export { resolveAccessContext, type ContactAccessContext };

export function assertStrength(value: unknown): ContactRelationshipStrength {
  if (
    typeof value !== "string" ||
    !CONTACT_RELATIONSHIP_STRENGTHS.includes(value as ContactRelationshipStrength)
  ) {
    throw new ContactStewardshipValidationError("invalid_strength", "Invalid relationship strength");
  }
  return value as ContactRelationshipStrength;
}

export function assertLifecycleStage(value: unknown): ContactLifecycleStage {
  if (
    typeof value !== "string" ||
    !CONTACT_LIFECYCLE_STAGES.includes(value as ContactLifecycleStage)
  ) {
    throw new ContactStewardshipValidationError("invalid_lifecycle", "Invalid lifecycle stage");
  }
  return value as ContactLifecycleStage;
}

export function assertParticipantRole(value: unknown): ContactStewardParticipantRole {
  if (
    typeof value !== "string" ||
    !CONTACT_STEWARD_PARTICIPANT_ROLES.includes(value as ContactStewardParticipantRole)
  ) {
    throw new ContactStewardshipValidationError("invalid_role", "Invalid participant role");
  }
  return value as ContactStewardParticipantRole;
}

export function validateAssignStewardInput(input: AssignContactStewardInput): void {
  if (!input.workspace_id?.trim() || !input.contact_id?.trim() || !input.steward_user_id?.trim()) {
    throw new ContactStewardshipValidationError("ids_required", "workspace_id, contact_id, and steward_user_id are required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactStewardshipValidationError("user_required", "created_by_user_id is required");
  }
}

export function validateUpdateStewardshipInput(input: UpdateContactStewardshipInput): void {
  if (!input.updated_by_user_id?.trim()) {
    throw new ContactStewardshipValidationError("user_required", "updated_by_user_id is required");
  }
  if (input.strength !== undefined) assertStrength(input.strength);
  if (input.lifecycle_stage !== undefined) assertLifecycleStage(input.lifecycle_stage);
}

export function validateAddParticipantInput(input: AddContactStewardParticipantInput): void {
  if (!input.workspace_id?.trim() || !input.contact_id?.trim() || !input.user_id?.trim()) {
    throw new ContactStewardshipValidationError("ids_required", "workspace_id, contact_id, and user_id are required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactStewardshipValidationError("user_required", "created_by_user_id is required");
  }
  assertParticipantRole(input.role);
}

export function canViewStewardship(_ctx: ContactAccessContext): boolean {
  return true;
}

export function canEditStewardship(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner" || ctx.role === "organizer";
}

export function assertRoleCapable(allowed: boolean, code: string, message: string): void {
  if (!allowed) {
    throw new ContactStewardshipValidationError(code, message);
  }
}
