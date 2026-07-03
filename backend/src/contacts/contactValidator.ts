import type {
  ContactAddress,
  ContactEmail,
  ContactOutreachStatus,
  ContactPhone,
  CreateContactInput,
  CreateContactOrganizationInput,
  UpdateContactInput,
} from "@localbrain/shared";
import { collectNormalizedEmails, normalizeEmail } from "./contactSerde.js";

export class ContactValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContactValidationError";
    this.code = code;
  }
}

export class ContactDuplicateEmailError extends ContactValidationError {
  readonly email: string;
  readonly existing_contact_id: string;

  constructor(email: string, existingContactId: string) {
    super(
      "duplicate_email",
      `Contact with email ${email} already exists in workspace (${existingContactId})`,
    );
    this.email = email;
    this.existing_contact_id = existingContactId;
  }
}

const OUTREACH_STATUSES: readonly ContactOutreachStatus[] = [
  "none",
  "queued",
  "sent",
  "replied",
];

function assertNonEmpty(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ContactValidationError("required_field", `${field} is required`);
  }
  return trimmed;
}

function validateEmailEntry(entry: ContactEmail, index: number): ContactEmail {
  const email = assertNonEmpty(entry.email, `emails[${index}].email`);
  if (!email.includes("@")) {
    throw new ContactValidationError("invalid_email", `emails[${index}] is not a valid email`);
  }
  return {
    email: email.trim(),
    label: entry.label?.trim() || undefined,
    primary: entry.primary,
  };
}

function validatePhoneEntry(entry: ContactPhone, index: number): ContactPhone {
  const phone = assertNonEmpty(entry.phone, `phones[${index}].phone`);
  return {
    phone: phone.trim(),
    label: entry.label?.trim() || undefined,
    primary: entry.primary,
  };
}

function validateAddressEntry(entry: ContactAddress): ContactAddress {
  const hasValue = [
    entry.line1,
    entry.line2,
    entry.city,
    entry.state,
    entry.postal_code,
    entry.country,
  ].some((part) => typeof part === "string" && part.trim().length > 0);
  if (!hasValue) {
    throw new ContactValidationError("invalid_address", "address entry requires at least one field");
  }
  return {
    line1: entry.line1?.trim() || undefined,
    line2: entry.line2?.trim() || undefined,
    city: entry.city?.trim() || undefined,
    state: entry.state?.trim() || undefined,
    postal_code: entry.postal_code?.trim() || undefined,
    country: entry.country?.trim() || undefined,
    label: entry.label?.trim() || undefined,
  };
}

export function validateCreateContactInput(input: CreateContactInput): CreateContactInput {
  const display_name = assertNonEmpty(input.display_name, "display_name");
  const workspace_id = assertNonEmpty(input.workspace_id, "workspace_id");
  const emails = (input.emails ?? []).map(validateEmailEntry);
  const phones = (input.phones ?? []).map(validatePhoneEntry);
  const addresses = (input.addresses ?? []).map(validateAddressEntry);
  const tags = [...new Set((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean))];
  const outreach_status = input.outreach_status ?? "none";
  if (!OUTREACH_STATUSES.includes(outreach_status)) {
    throw new ContactValidationError("invalid_outreach_status", "outreach_status is invalid");
  }

  return {
    workspace_id,
    display_name,
    first_name: input.first_name?.trim() || undefined,
    last_name: input.last_name?.trim() || undefined,
    emails,
    phones,
    addresses,
    tags,
    notes: input.notes?.trim() ?? "",
    outreach_status,
  };
}

export function validateUpdateContactInput(input: UpdateContactInput): UpdateContactInput {
  const next: UpdateContactInput = { ...input };

  if (input.display_name !== undefined) {
    next.display_name = assertNonEmpty(input.display_name, "display_name");
  }
  if (input.emails !== undefined) {
    next.emails = input.emails.map(validateEmailEntry);
  }
  if (input.phones !== undefined) {
    next.phones = input.phones.map(validatePhoneEntry);
  }
  if (input.addresses !== undefined) {
    next.addresses = input.addresses.map(validateAddressEntry);
  }
  if (input.tags !== undefined) {
    next.tags = [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))];
  }
  if (input.outreach_status !== undefined && !OUTREACH_STATUSES.includes(input.outreach_status)) {
    throw new ContactValidationError("invalid_outreach_status", "outreach_status is invalid");
  }
  if (input.first_name === null) next.first_name = null;
  else if (input.first_name !== undefined) next.first_name = input.first_name.trim() || undefined;
  if (input.last_name === null) next.last_name = null;
  else if (input.last_name !== undefined) next.last_name = input.last_name.trim() || undefined;
  if (input.notes !== undefined) next.notes = input.notes.trim();

  return next;
}

export function validateCreateOrganizationInput(
  input: CreateContactOrganizationInput,
): CreateContactOrganizationInput {
  return {
    workspace_id: assertNonEmpty(input.workspace_id, "workspace_id"),
    name: assertNonEmpty(input.name, "name"),
  };
}

export function findDuplicateEmailConflict(
  workspaceId: string,
  emails: readonly ContactEmail[],
  excludeContactId: string | null,
  lookup: (workspaceId: string, normalizedEmail: string) => string | null,
): ContactDuplicateEmailError | null {
  for (const email of collectNormalizedEmails(emails)) {
    const existingId = lookup(workspaceId, email);
    if (existingId && existingId !== excludeContactId) {
      return new ContactDuplicateEmailError(email, existingId);
    }
  }
  return null;
}

export function emailMatchesFilter(recordEmails: readonly ContactEmail[], filterEmail: string): boolean {
  const normalized = normalizeEmail(filterEmail);
  return recordEmails.some((entry) => normalizeEmail(entry.email) === normalized);
}
