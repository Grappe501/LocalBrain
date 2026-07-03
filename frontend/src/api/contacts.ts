import type {
  ContactOrganization,
  ContactOutreachStatus,
  ContactRecordWithAffiliations,
  CreateContactInput,
  UpdateContactInput,
} from "@localbrain/shared";

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string; error?: string };
    return body.message ?? body.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchContacts(options: {
  workspace_id: string;
  search?: string;
  tag?: string;
  email?: string;
  include_archived?: boolean;
}): Promise<ContactRecordWithAffiliations[]> {
  const params = new URLSearchParams({ workspace_id: options.workspace_id });
  if (options.search) params.set("search", options.search);
  if (options.tag) params.set("tag", options.tag);
  if (options.email) params.set("email", options.email);
  if (options.include_archived) params.set("include_archived", "true");

  const res = await fetch(`/api/contacts?${params.toString()}`);
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { contacts: ContactRecordWithAffiliations[] };
  return data.contacts;
}

export async function fetchContact(contactId: string): Promise<ContactRecordWithAffiliations> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}`);
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { contact: ContactRecordWithAffiliations };
  return data.contact;
}

export async function createContactApi(
  input: CreateContactInput & { organization_id?: string; role_label?: string },
): Promise<ContactRecordWithAffiliations> {
  const res = await fetch(`/api/contacts?workspace_id=${encodeURIComponent(input.workspace_id)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { contact: ContactRecordWithAffiliations };
  return data.contact;
}

export async function updateContactApi(
  contactId: string,
  input: UpdateContactInput,
): Promise<ContactRecordWithAffiliations> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { contact: ContactRecordWithAffiliations };
  return data.contact;
}

export async function archiveContactApi(
  contactId: string,
): Promise<ContactRecordWithAffiliations> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/archive`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { contact: ContactRecordWithAffiliations };
  return data.contact;
}

export async function restoreContactApi(
  contactId: string,
): Promise<ContactRecordWithAffiliations> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/restore`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { contact: ContactRecordWithAffiliations };
  return data.contact;
}

export async function fetchContactOrganizations(
  workspaceId: string,
): Promise<ContactOrganization[]> {
  const params = new URLSearchParams({ workspace_id: workspaceId });
  const res = await fetch(`/api/contacts/organizations/list?${params.toString()}`);
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { organizations: ContactOrganization[] };
  return data.organizations;
}

export async function createContactOrganizationApi(options: {
  workspace_id: string;
  name: string;
}): Promise<ContactOrganization> {
  const res = await fetch("/api/contacts/organizations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { organization: ContactOrganization };
  return data.organization;
}

export async function linkContactAffiliationApi(options: {
  contact_id: string;
  organization_id: string;
  role_label?: string;
}): Promise<ContactRecordWithAffiliations> {
  const res = await fetch(
    `/api/contacts/${encodeURIComponent(options.contact_id)}/affiliations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organization_id: options.organization_id,
        role_label: options.role_label,
      }),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { contact: ContactRecordWithAffiliations };
  return data.contact;
}

export const OUTREACH_STATUS_OPTIONS: ContactOutreachStatus[] = [
  "none",
  "queued",
  "sent",
  "replied",
];
