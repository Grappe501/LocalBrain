import {
  CONTACT_HOUSEHOLD_MEMBER_ROLES,
  CONTACT_HOUSEHOLD_RELATIONSHIP_TYPES,
  type AddContactHouseholdMemberInput,
  type AddContactHouseholdRelationshipInput,
  type ContactHouseholdMemberRole,
  type ContactHouseholdRelationshipType,
  type CreateContactHouseholdInput,
  type MergeContactHouseholdsInput,
  type SplitContactHouseholdInput,
  type TransferPrimaryResidenceInput,
  type UpdateContactHouseholdInput,
} from "@localbrain/shared";
import { resolveAccessContext, type ContactAccessContext } from "./contactInteractionValidator.js";

export class ContactHouseholdValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContactHouseholdValidationError";
    this.code = code;
  }
}

export { resolveAccessContext, type ContactAccessContext };

export function assertMemberRole(value: unknown): ContactHouseholdMemberRole {
  if (
    typeof value !== "string" ||
    !CONTACT_HOUSEHOLD_MEMBER_ROLES.includes(value as ContactHouseholdMemberRole)
  ) {
    throw new ContactHouseholdValidationError("invalid_role", "Invalid household member role");
  }
  return value as ContactHouseholdMemberRole;
}

export function assertRelationshipType(value: unknown): ContactHouseholdRelationshipType {
  if (
    typeof value !== "string" ||
    !CONTACT_HOUSEHOLD_RELATIONSHIP_TYPES.includes(value as ContactHouseholdRelationshipType)
  ) {
    throw new ContactHouseholdValidationError(
      "invalid_relationship",
      "Invalid household relationship type",
    );
  }
  return value as ContactHouseholdRelationshipType;
}

export function validateCreateHouseholdInput(input: CreateContactHouseholdInput): void {
  if (!input.workspace_id?.trim() || !input.name?.trim()) {
    throw new ContactHouseholdValidationError("ids_required", "workspace_id and name are required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactHouseholdValidationError("user_required", "created_by_user_id is required");
  }
}

export function validateUpdateHouseholdInput(input: UpdateContactHouseholdInput): void {
  if (!input.updated_by_user_id?.trim()) {
    throw new ContactHouseholdValidationError("user_required", "updated_by_user_id is required");
  }
  if (input.name !== undefined && !input.name.trim()) {
    throw new ContactHouseholdValidationError("name_required", "name cannot be empty");
  }
}

export function validateAddMemberInput(input: AddContactHouseholdMemberInput): void {
  if (!input.workspace_id?.trim() || !input.household_id?.trim() || !input.contact_id?.trim()) {
    throw new ContactHouseholdValidationError(
      "ids_required",
      "workspace_id, household_id, and contact_id are required",
    );
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactHouseholdValidationError("user_required", "created_by_user_id is required");
  }
  assertMemberRole(input.role);
}

export function validateAddRelationshipInput(input: AddContactHouseholdRelationshipInput): void {
  if (
    !input.workspace_id?.trim() ||
    !input.household_id?.trim() ||
    !input.from_contact_id?.trim() ||
    !input.to_contact_id?.trim()
  ) {
    throw new ContactHouseholdValidationError("ids_required", "workspace_id, household_id, and contact ids are required");
  }
  if (input.from_contact_id === input.to_contact_id) {
    throw new ContactHouseholdValidationError("self_relationship", "Cannot relate a contact to themselves");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactHouseholdValidationError("user_required", "created_by_user_id is required");
  }
  assertRelationshipType(input.relationship_type);
}

export function validateMergeHouseholdsInput(input: MergeContactHouseholdsInput): void {
  if (!input.workspace_id?.trim() || !input.from_household_id?.trim() || !input.to_household_id?.trim()) {
    throw new ContactHouseholdValidationError("ids_required", "workspace_id and household ids are required");
  }
  if (input.from_household_id === input.to_household_id) {
    throw new ContactHouseholdValidationError("same_household", "Cannot merge a household into itself");
  }
  if (!input.merged_by_user_id?.trim()) {
    throw new ContactHouseholdValidationError("user_required", "merged_by_user_id is required");
  }
}

export function validateSplitHouseholdInput(input: SplitContactHouseholdInput): void {
  if (!input.workspace_id?.trim() || !input.source_household_id?.trim() || !input.new_household_name?.trim()) {
    throw new ContactHouseholdValidationError("ids_required", "workspace_id, source household, and name are required");
  }
  if (!input.member_contact_ids?.length) {
    throw new ContactHouseholdValidationError("members_required", "At least one member contact id is required");
  }
  if (!input.split_by_user_id?.trim()) {
    throw new ContactHouseholdValidationError("user_required", "split_by_user_id is required");
  }
}

export function validateTransferPrimaryResidenceInput(input: TransferPrimaryResidenceInput): void {
  if (!input.workspace_id?.trim() || !input.household_id?.trim() || !input.contact_id?.trim()) {
    throw new ContactHouseholdValidationError("ids_required", "workspace_id, household_id, and contact_id are required");
  }
  if (!input.changed_by_user_id?.trim()) {
    throw new ContactHouseholdValidationError("user_required", "changed_by_user_id is required");
  }
}

export function canViewHouseholds(_ctx: ContactAccessContext): boolean {
  return true;
}

export function canEditHouseholds(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner" || ctx.role === "organizer";
}

export function assertRoleCapable(allowed: boolean, code: string, message: string): void {
  if (!allowed) {
    throw new ContactHouseholdValidationError(code, message);
  }
}
