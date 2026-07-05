import type { ContactBrief } from "@localbrain/shared";

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

export async function fetchContactBrief(contactId: string): Promise<ContactBrief> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/brief`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { brief: ContactBrief };
  return data.brief;
}

export async function regenerateContactBriefApi(contactId: string): Promise<ContactBrief> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/brief/regenerate`, {
    method: "POST",
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { brief: ContactBrief };
  return data.brief;
}

export async function fetchContactBriefEvidence(contactId: string) {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/brief/evidence`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
