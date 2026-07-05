import type {
  ContactHouseholdLookupRow,
  ContactHouseholdMemberRole,
  ContactHouseholdRelationshipType,
  ContactHouseholdSummary,
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

export async function fetchContactHouseholds(contactId: string): Promise<ContactHouseholdSummary[]> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/households`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { households: ContactHouseholdSummary[] };
  return data.households;
}

export async function fetchHouseholdSummary(householdId: string): Promise<ContactHouseholdSummary> {
  const res = await fetch(`/api/contacts/households/${encodeURIComponent(householdId)}`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { summary: ContactHouseholdSummary };
  return data.summary;
}

export async function createHouseholdApi(
  workspaceId: string,
  input: {
    name: string;
    primary_contact_id?: string;
    voting_district?: string;
    primary_address?: { line1?: string; city?: string; state?: string; postal_code?: string };
  },
): Promise<ContactHouseholdSummary> {
  const res = await fetch(`/api/contacts/households?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify({ workspace_id: workspaceId, ...input }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { summary: ContactHouseholdSummary };
  return data.summary;
}

export async function addHouseholdMemberApi(
  householdId: string,
  input: {
    contact_id: string;
    role: ContactHouseholdMemberRole;
    relationship_label?: string;
  },
) {
  const res = await fetch(`/api/contacts/households/${encodeURIComponent(householdId)}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function removeHouseholdMemberApi(householdId: string, memberId: string) {
  const res = await fetch(
    `/api/contacts/households/${encodeURIComponent(householdId)}/members/${encodeURIComponent(memberId)}`,
    { method: "DELETE", headers: CONTACT_USER_HEADERS },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function addHouseholdRelationshipApi(
  householdId: string,
  input: {
    from_contact_id: string;
    to_contact_id: string;
    relationship_type: ContactHouseholdRelationshipType;
    label?: string;
  },
) {
  const res = await fetch(
    `/api/contacts/households/${encodeURIComponent(householdId)}/relationships`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
      body: JSON.stringify(input),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function transferPrimaryResidenceApi(householdId: string, contactId: string) {
  const res = await fetch(
    `/api/contacts/households/${encodeURIComponent(householdId)}/primary-residence`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
      body: JSON.stringify({ contact_id: contactId }),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { summary: ContactHouseholdSummary };
  return data.summary;
}

export async function searchHouseholdsApi(
  workspaceId: string,
  search?: string,
): Promise<ContactHouseholdLookupRow[]> {
  const params = new URLSearchParams({ workspace_id: workspaceId });
  if (search?.trim()) params.set("search", search.trim());
  const res = await fetch(`/api/contacts/households?${params.toString()}`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { households: ContactHouseholdLookupRow[] };
  return data.households;
}
