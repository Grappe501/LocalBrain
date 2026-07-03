import crypto from "node:crypto";
import type {
  ContactListFilter,
  ContactOrganization,
  ContactRecord,
  ContactRecordWithAffiliations,
  CreateContactInput,
  CreateContactOrganizationInput,
  UpdateContactInput,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import {
  affiliationFromRow,
  collectNormalizedEmails,
  normalizeEmail,
  parseEmailsJson,
  rowToContactOrganization,
  rowToContactRecord,
  serializeAddresses,
  serializeEmails,
  serializePhones,
  serializeTags,
  type ContactOrganizationRow,
  type ContactRow,
} from "./contactSerde.js";
import {
  ContactDuplicateEmailError,
  emailMatchesFilter,
  findDuplicateEmailConflict,
  validateCreateContactInput,
  validateCreateOrganizationInput,
  validateUpdateContactInput,
} from "./contactValidator.js";

function lookupContactIdByEmail(workspaceId: string, normalizedEmail: string): string | null {
  const rows = getDatabase()
    .prepare(
      `SELECT contact_id, emails_json FROM contacts
       WHERE workspace_id = ? AND archived = 0`,
    )
    .all(workspaceId) as Pick<ContactRow, "contact_id" | "emails_json">[];

  for (const row of rows) {
    const emails = parseEmailsJson(row.emails_json);
    if (emails.some((entry) => normalizeEmail(entry.email) === normalizedEmail)) {
      return row.contact_id;
    }
  }
  return null;
}

function attachAffiliations(record: ContactRecord): ContactRecordWithAffiliations {
  const rows = getDatabase()
    .prepare(
      `SELECT l.organization_id, l.role_label, o.name
       FROM contact_organization_links l
       INNER JOIN contact_organizations o ON o.organization_id = l.organization_id
       WHERE l.contact_id = ? AND o.archived = 0
       ORDER BY o.name ASC`,
    )
    .all(record.contact_id) as {
    organization_id: string;
    role_label: string | null;
    name: string;
  }[];

  return {
    ...record,
    affiliations: rows.map(affiliationFromRow),
  };
}

function matchesSearch(record: ContactRecord, search: string): boolean {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [
    record.display_name,
    record.first_name,
    record.last_name,
    record.notes,
    ...record.tags,
    ...record.emails.map((entry) => entry.email),
    ...record.phones.map((entry) => entry.phone),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

export function createContact(input: CreateContactInput): ContactRecordWithAffiliations {
  const validated = validateCreateContactInput(input);
  const duplicate = findDuplicateEmailConflict(
    validated.workspace_id,
    validated.emails,
    null,
    lookupContactIdByEmail,
  );
  if (duplicate) throw duplicate;

  const contactId = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO contacts (
        contact_id, workspace_id, display_name, first_name, last_name,
        emails_json, phones_json, addresses_json, tags_json, notes, outreach_status
      ) VALUES (
        @contact_id, @workspace_id, @display_name, @first_name, @last_name,
        @emails_json, @phones_json, @addresses_json, @tags_json, @notes, @outreach_status
      )`,
    )
    .run({
      contact_id: contactId,
      workspace_id: validated.workspace_id,
      display_name: validated.display_name,
      first_name: validated.first_name ?? null,
      last_name: validated.last_name ?? null,
      emails_json: serializeEmails(validated.emails),
      phones_json: serializePhones(validated.phones),
      addresses_json: serializeAddresses(validated.addresses),
      tags_json: serializeTags(validated.tags),
      notes: validated.notes ?? "",
      outreach_status: validated.outreach_status ?? "none",
    });

  return attachAffiliations(getContactById(contactId)!);
}

export function getContactById(contactId: string): ContactRecordWithAffiliations | null {
  const row = getDatabase()
    .prepare("SELECT * FROM contacts WHERE contact_id = ?")
    .get(contactId) as ContactRow | undefined;
  if (!row) return null;
  return attachAffiliations(rowToContactRecord(row));
}

export function updateContact(
  contactId: string,
  input: UpdateContactInput,
): ContactRecordWithAffiliations | null {
  const existing = getDatabase()
    .prepare("SELECT * FROM contacts WHERE contact_id = ?")
    .get(contactId) as ContactRow | undefined;
  if (!existing) return null;

  const validated = validateUpdateContactInput(input);
  const nextEmails =
    validated.emails !== undefined ? validated.emails : parseEmailsJson(existing.emails_json);
  const duplicate = findDuplicateEmailConflict(
    existing.workspace_id,
    nextEmails,
    contactId,
    lookupContactIdByEmail,
  );
  if (duplicate) throw duplicate;

  const fields: string[] = ["updated_at = datetime('now')"];
  const params: Record<string, string | null> = { contact_id: contactId };

  if (validated.display_name !== undefined) {
    fields.push("display_name = @display_name");
    params.display_name = validated.display_name;
  }
  if (validated.first_name !== undefined) {
    fields.push("first_name = @first_name");
    params.first_name = validated.first_name;
  }
  if (validated.last_name !== undefined) {
    fields.push("last_name = @last_name");
    params.last_name = validated.last_name;
  }
  if (validated.emails !== undefined) {
    fields.push("emails_json = @emails_json");
    params.emails_json = serializeEmails(validated.emails);
  }
  if (validated.phones !== undefined) {
    fields.push("phones_json = @phones_json");
    params.phones_json = serializePhones(validated.phones);
  }
  if (validated.addresses !== undefined) {
    fields.push("addresses_json = @addresses_json");
    params.addresses_json = serializeAddresses(validated.addresses);
  }
  if (validated.tags !== undefined) {
    fields.push("tags_json = @tags_json");
    params.tags_json = serializeTags(validated.tags);
  }
  if (validated.notes !== undefined) {
    fields.push("notes = @notes");
    params.notes = validated.notes;
  }
  if (validated.outreach_status !== undefined) {
    fields.push("outreach_status = @outreach_status");
    params.outreach_status = validated.outreach_status;
  }

  getDatabase()
    .prepare(`UPDATE contacts SET ${fields.join(", ")} WHERE contact_id = @contact_id`)
    .run(params);

  return getContactById(contactId);
}

export function archiveContact(contactId: string): ContactRecordWithAffiliations | null {
  const result = getDatabase()
    .prepare(
      `UPDATE contacts
       SET archived = 1, updated_at = datetime('now')
       WHERE contact_id = ?`,
    )
    .run(contactId);
  if (result.changes === 0) return null;
  return getContactById(contactId);
}

export function listContacts(filter: ContactListFilter): ContactRecordWithAffiliations[] {
  const params: (string | number)[] = [filter.workspace_id];
  let sql = "SELECT * FROM contacts WHERE workspace_id = ?";

  if (!filter.include_archived) {
    sql += " AND archived = 0";
  }

  sql += " ORDER BY display_name COLLATE NOCASE ASC";

  const rows = getDatabase().prepare(sql).all(...params) as ContactRow[];
  let records = rows.map((row) => attachAffiliations(rowToContactRecord(row)));

  if (filter.tag) {
    const tag = filter.tag.trim().toLowerCase();
    records = records.filter((record) =>
      record.tags.some((value) => value.toLowerCase() === tag),
    );
  }
  if (filter.email) {
    records = records.filter((record) => emailMatchesFilter(record.emails, filter.email!));
  }
  if (filter.search) {
    records = records.filter((record) => matchesSearch(record, filter.search!));
  }

  return records;
}

export function createContactOrganization(input: CreateContactOrganizationInput): ContactOrganization {
  const validated = validateCreateOrganizationInput(input);
  const organizationId = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO contact_organizations (organization_id, workspace_id, name)
       VALUES (?, ?, ?)`,
    )
    .run(organizationId, validated.workspace_id, validated.name);

  return getContactOrganizationById(organizationId)!;
}

export function getContactOrganizationById(organizationId: string): ContactOrganization | null {
  const row = getDatabase()
    .prepare("SELECT * FROM contact_organizations WHERE organization_id = ?")
    .get(organizationId) as ContactOrganizationRow | undefined;
  return row ? rowToContactOrganization(row) : null;
}

export function linkContactToOrganization(options: {
  contact_id: string;
  organization_id: string;
  role_label?: string;
}): ContactRecordWithAffiliations | null {
  const contact = getDatabase()
    .prepare("SELECT contact_id, workspace_id FROM contacts WHERE contact_id = ? AND archived = 0")
    .get(options.contact_id) as { contact_id: string; workspace_id: string } | undefined;
  const organization = getDatabase()
    .prepare(
      "SELECT organization_id, workspace_id FROM contact_organizations WHERE organization_id = ? AND archived = 0",
    )
    .get(options.organization_id) as { organization_id: string; workspace_id: string } | undefined;

  if (!contact || !organization) return null;
  if (contact.workspace_id !== organization.workspace_id) return null;

  getDatabase()
    .prepare(
      `INSERT INTO contact_organization_links (contact_id, organization_id, role_label)
       VALUES (@contact_id, @organization_id, @role_label)
       ON CONFLICT(contact_id, organization_id) DO UPDATE SET role_label = excluded.role_label`,
    )
    .run({
      contact_id: options.contact_id,
      organization_id: options.organization_id,
      role_label: options.role_label?.trim() || null,
    });

  return getContactById(options.contact_id);
}

/** Test and repository helper — exposes normalized email set for a contact row. */
export function getContactEmailSet(contactId: string): string[] {
  const row = getDatabase()
    .prepare("SELECT emails_json FROM contacts WHERE contact_id = ?")
    .get(contactId) as { emails_json: string } | undefined;
  if (!row) return [];
  return collectNormalizedEmails(parseEmailsJson(row.emails_json));
}

export { ContactDuplicateEmailError };
