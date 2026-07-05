import type {
  AssignContactContextInput,
  ContactContextLink,
  ContactContextLinkHistoryEntry,
  ContactContextView,
  ContactContextRank,
  RelationshipContext,
} from "@localbrain/shared";

const CONTACT_USER_HEADERS = {
  "X-Contact-User-Id": "local-user",
  "X-Contact-User-Role": "admin",
} as const;

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string; error?: string };
    return body.message ?? body.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchWorkspaceContexts(
  workspaceId: string,
  options?: { include_archived?: boolean },
): Promise<RelationshipContext[]> {
  const params = new URLSearchParams({ workspace_id: workspaceId });
  if (options?.include_archived) params.set("include_archived", "true");
  const res = await fetch(`/api/contacts/contexts?${params.toString()}`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { contexts: RelationshipContext[] };
  return data.contexts;
}

export async function createRelationshipContextApi(input: {
  workspace_id: string;
  label: string;
  category?: RelationshipContext["category"];
}): Promise<RelationshipContext> {
  const res = await fetch(
    `/api/contacts/contexts?workspace_id=${encodeURIComponent(input.workspace_id)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
      body: JSON.stringify(input),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { context: RelationshipContext };
  return data.context;
}

export async function fetchContactContextView(contactId: string): Promise<ContactContextView> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/contexts`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { view: ContactContextView };
  return data.view;
}

export async function fetchContactContextHistory(
  contactId: string,
): Promise<ContactContextLinkHistoryEntry[]> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/contexts/history`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { history: ContactContextLinkHistoryEntry[] };
  return data.history;
}

export async function assignContactContextApi(
  contactId: string,
  input: Omit<AssignContactContextInput, "contact_id" | "created_by_user_id"> & {
    created_by_user_id?: string;
  },
): Promise<ContactContextLink> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/contexts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { link: ContactContextLink };
  return data.link;
}

export async function updateContactContextLinkApi(
  contactId: string,
  linkId: string,
  input: { rank?: ContactContextRank; reason?: string },
): Promise<ContactContextLink> {
  const res = await fetch(
    `/api/contacts/${encodeURIComponent(contactId)}/contexts/${encodeURIComponent(linkId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
      body: JSON.stringify(input),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { link: ContactContextLink };
  return data.link;
}

export async function endContactContextLinkApi(
  contactId: string,
  linkId: string,
  input?: { reason?: string },
): Promise<ContactContextLink> {
  const res = await fetch(
    `/api/contacts/${encodeURIComponent(contactId)}/contexts/${encodeURIComponent(linkId)}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
      body: JSON.stringify(input ?? {}),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { link: ContactContextLink };
  return data.link;
}
