import {
  ORGANIZATION_CATEGORIES,
  ORGANIZATION_MEMBERSHIP_ROLES,
  ORGANIZATION_MEMBERSHIP_STATUSES,
  type AddOrganizationMembershipInput,
  type AssignOrganizationRoleInput,
  type CreateOrganizationInput,
  type MergeOrganizationsInput,
  type OrganizationCategory,
  type OrganizationMembershipRole,
  type OrganizationMembershipStatus,
  type UpdateOrganizationInput,
  type UpdateOrganizationMembershipInput,
} from "@localbrain/shared";
import { resolveAccessContext, type ContactAccessContext } from "./contactInteractionValidator.js";

export class ContactOrganizationValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContactOrganizationValidationError";
    this.code = code;
  }
}

export { resolveAccessContext, type ContactAccessContext };

export function assertOrganizationCategory(value: unknown): OrganizationCategory {
  if (typeof value !== "string" || !ORGANIZATION_CATEGORIES.includes(value as OrganizationCategory)) {
    throw new ContactOrganizationValidationError("invalid_category", "Invalid organization category");
  }
  return value as OrganizationCategory;
}

export function assertMembershipRole(value: unknown): OrganizationMembershipRole {
  if (
    typeof value !== "string" ||
    !ORGANIZATION_MEMBERSHIP_ROLES.includes(value as OrganizationMembershipRole)
  ) {
    throw new ContactOrganizationValidationError("invalid_role", "Invalid membership role");
  }
  return value as OrganizationMembershipRole;
}

export function assertMembershipStatus(value: unknown): OrganizationMembershipStatus {
  if (
    typeof value !== "string" ||
    !ORGANIZATION_MEMBERSHIP_STATUSES.includes(value as OrganizationMembershipStatus)
  ) {
    throw new ContactOrganizationValidationError("invalid_status", "Invalid membership status");
  }
  return value as OrganizationMembershipStatus;
}

export function validateCreateOrganizationInput(input: CreateOrganizationInput): void {
  if (!input.workspace_id?.trim() || !input.name?.trim()) {
    throw new ContactOrganizationValidationError("ids_required", "workspace_id and name are required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactOrganizationValidationError("user_required", "created_by_user_id is required");
  }
  if (input.category !== undefined) assertOrganizationCategory(input.category);
}

export function validateUpdateOrganizationInput(input: UpdateOrganizationInput): void {
  if (!input.updated_by_user_id?.trim()) {
    throw new ContactOrganizationValidationError("user_required", "updated_by_user_id is required");
  }
  if (input.name !== undefined && !input.name.trim()) {
    throw new ContactOrganizationValidationError("name_required", "name cannot be empty");
  }
  if (input.category !== undefined) assertOrganizationCategory(input.category);
}

export function validateAddMembershipInput(input: AddOrganizationMembershipInput): void {
  if (!input.workspace_id?.trim() || !input.organization_id?.trim() || !input.contact_id?.trim()) {
    throw new ContactOrganizationValidationError("ids_required", "workspace_id, organization_id, and contact_id are required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactOrganizationValidationError("user_required", "created_by_user_id is required");
  }
  if (input.membership_role !== undefined) assertMembershipRole(input.membership_role);
  if (input.membership_status !== undefined) assertMembershipStatus(input.membership_status);
}

export function validateUpdateMembershipInput(input: UpdateOrganizationMembershipInput): void {
  if (!input.updated_by_user_id?.trim()) {
    throw new ContactOrganizationValidationError("user_required", "updated_by_user_id is required");
  }
  if (input.membership_role !== undefined) assertMembershipRole(input.membership_role);
  if (input.membership_status !== undefined) assertMembershipStatus(input.membership_status);
}

export function validateAssignRoleInput(input: AssignOrganizationRoleInput): void {
  if (!input.workspace_id?.trim() || !input.organization_id?.trim() || !input.membership_id?.trim()) {
    throw new ContactOrganizationValidationError("ids_required", "workspace_id, organization_id, and membership_id are required");
  }
  if (!input.created_by_user_id?.trim()) {
    throw new ContactOrganizationValidationError("user_required", "created_by_user_id is required");
  }
  assertMembershipRole(input.role);
}

export function validateMergeOrganizationsInput(input: MergeOrganizationsInput): void {
  if (!input.workspace_id?.trim() || !input.from_organization_id?.trim() || !input.to_organization_id?.trim()) {
    throw new ContactOrganizationValidationError("ids_required", "workspace_id and organization ids are required");
  }
  if (input.from_organization_id === input.to_organization_id) {
    throw new ContactOrganizationValidationError("same_organization", "Cannot merge an organization into itself");
  }
  if (!input.merged_by_user_id?.trim()) {
    throw new ContactOrganizationValidationError("user_required", "merged_by_user_id is required");
  }
}

export function canViewOrganizations(_ctx: ContactAccessContext): boolean {
  return true;
}

export function canEditOrganizations(ctx: ContactAccessContext): boolean {
  return ctx.role === "admin" || ctx.role === "owner" || ctx.role === "organizer";
}

export function assertRoleCapable(allowed: boolean, code: string, message: string): void {
  if (!allowed) {
    throw new ContactOrganizationValidationError(code, message);
  }
}
