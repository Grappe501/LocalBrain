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
  context_id?: string;
  context_primary_only?: boolean;
}): Promise<ContactRecordWithAffiliations[]> {
  const params = new URLSearchParams({ workspace_id: options.workspace_id });
  if (options.search) params.set("search", options.search);
  if (options.tag) params.set("tag", options.tag);
  if (options.email) params.set("email", options.email);
  if (options.include_archived) params.set("include_archived", "true");
  if (options.context_id) params.set("context_id", options.context_id);
  if (options.context_primary_only) params.set("context_primary_only", "true");

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

export type ContactImportDuplicatePolicy = "skip" | "update" | "error";

export async function exportContactsCsv(options: {
  workspace_id: string;
  include_archived?: boolean;
  search?: string;
  tag?: string;
}): Promise<string> {
  const params = new URLSearchParams({ workspace_id: options.workspace_id });
  if (options.include_archived) params.set("include_archived", "true");
  if (options.search) params.set("search", options.search);
  if (options.tag) params.set("tag", options.tag);

  const res = await fetch(`/api/contacts/export.csv?${params.toString()}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.text();
}

export async function previewContactImportApi(options: {
  workspace_id: string;
  csv_text: string;
  duplicate_policy?: ContactImportDuplicatePolicy;
}) {
  const res = await fetch(
    `/api/contacts/import/preview?workspace_id=${encodeURIComponent(options.workspace_id)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{
    preview: import("@localbrain/shared").ContactImportPreviewResult;
  }>;
}

export async function commitContactImportApi(options: {
  workspace_id: string;
  csv_text: string;
  duplicate_policy?: ContactImportDuplicatePolicy;
}) {
  const res = await fetch(
    `/api/contacts/import/commit?workspace_id=${encodeURIComponent(options.workspace_id)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{
    result: import("@localbrain/shared").ContactImportCommitResult;
  }>;
}

export async function fetchContactDrafts(contactId: string) {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/drafts`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{ drafts: import("@localbrain/shared").ContactDraftLink[] }>;
}

export async function fetchContactOutreachAudit(contactId: string) {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/outreach-audit`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{ audit: import("@localbrain/shared").ContactOutreachAuditEntry[] }>;
}

export async function updateContactOutreachApi(options: {
  contact_id: string;
  outreach_status: ContactOutreachStatus;
  note: string;
  draft_link_id?: string;
}) {
  const res = await fetch(`/api/contacts/${encodeURIComponent(options.contact_id)}/outreach`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      outreach_status: options.outreach_status,
      note: options.note,
      draft_link_id: options.draft_link_id,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{ contact: ContactRecordWithAffiliations }>;
}

export async function generateContactLinkedDraftApi(options: {
  workspace_id: string;
  contact_id: string;
  intent_label: string;
  audience_label?: string;
  use_fixture?: boolean;
}) {
  const res = await fetch("/api/communications/drafts/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{
    result: import("@localbrain/shared").GenerateContactLinkedDraftResult;
    draft: import("@localbrain/shared").TraceableDraftGenerationResult;
  }>;
}
