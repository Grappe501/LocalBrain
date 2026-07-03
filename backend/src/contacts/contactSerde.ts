import type {
  ContactAddress,
  ContactEmail,
  ContactOrganization,
  ContactOrganizationAffiliation,
  ContactOutreachStatus,
  ContactPhone,
  ContactRecord,
} from "@localbrain/shared";

export type ContactRow = {
  contact_id: string;
  workspace_id: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  emails_json: string;
  phones_json: string;
  addresses_json: string;
  tags_json: string;
  notes: string;
  outreach_status: string;
  archived: number;
  created_at: string;
  updated_at: string;
};

export type ContactOrganizationRow = {
  organization_id: string;
  workspace_id: string;
  name: string;
  archived: number;
  created_at: string;
  updated_at: string;
};

const OUTREACH_STATUSES: readonly ContactOutreachStatus[] = [
  "none",
  "queued",
  "sent",
  "replied",
];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parseEmailsJson(raw: string): ContactEmail[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (item): item is ContactEmail =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as ContactEmail).email === "string",
  );
}

export function parsePhonesJson(raw: string): ContactPhone[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (item): item is ContactPhone =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as ContactPhone).phone === "string",
  );
}

export function parseAddressesJson(raw: string): ContactAddress[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is ContactAddress => typeof item === "object" && item !== null);
}

export function parseTagsJson(raw: string): string[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function serializeEmails(emails: readonly ContactEmail[]): string {
  return JSON.stringify([...emails]);
}

export function serializePhones(phones: readonly ContactPhone[]): string {
  return JSON.stringify([...phones]);
}

export function serializeAddresses(addresses: readonly ContactAddress[]): string {
  return JSON.stringify([...addresses]);
}

export function serializeTags(tags: readonly string[]): string {
  return JSON.stringify([...tags]);
}

export function parseOutreachStatus(raw: string): ContactOutreachStatus {
  if (OUTREACH_STATUSES.includes(raw as ContactOutreachStatus)) {
    return raw as ContactOutreachStatus;
  }
  return "none";
}

export function rowToContactRecord(row: ContactRow): ContactRecord {
  return {
    contact_id: row.contact_id,
    workspace_id: row.workspace_id,
    display_name: row.display_name,
    first_name: row.first_name ?? undefined,
    last_name: row.last_name ?? undefined,
    emails: parseEmailsJson(row.emails_json),
    phones: parsePhonesJson(row.phones_json),
    addresses: parseAddressesJson(row.addresses_json),
    tags: parseTagsJson(row.tags_json),
    notes: row.notes,
    outreach_status: parseOutreachStatus(row.outreach_status),
    archived: row.archived === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function rowToContactOrganization(row: ContactOrganizationRow): ContactOrganization {
  return {
    organization_id: row.organization_id,
    workspace_id: row.workspace_id,
    name: row.name,
    archived: row.archived === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function affiliationFromRow(row: {
  organization_id: string;
  name: string;
  role_label: string | null;
}): ContactOrganizationAffiliation {
  return {
    organization_id: row.organization_id,
    organization_name: row.name,
    role_label: row.role_label ?? undefined,
  };
}

export function collectNormalizedEmails(emails: readonly ContactEmail[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const entry of emails) {
    const value = normalizeEmail(entry.email);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    normalized.push(value);
  }
  return normalized;
}
