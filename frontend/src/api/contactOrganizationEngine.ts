import type {
  OrganizationCategory,
  OrganizationMembershipRole,
  OrganizationMembershipStatus,
  OrganizationSummary,
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

export async function fetchContactOrganizations(contactId: string): Promise<OrganizationSummary[]> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/organizations`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { organizations: OrganizationSummary[] };
  return data.organizations;
}

export async function searchOrganizationsApi(
  workspaceId: string,
  search?: string,
  category?: OrganizationCategory,
) {
  const params = new URLSearchParams({ workspace_id: workspaceId });
  if (search?.trim()) params.set("search", search.trim());
  if (category) params.set("category", category);
  const res = await fetch(`/api/contacts/organizations/search?${params.toString()}`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createOrganizationApi(
  workspaceId: string,
  input: { name: string; category?: OrganizationCategory; description?: string },
): Promise<OrganizationSummary> {
  const res = await fetch(`/api/contacts/organizations?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify({ workspace_id: workspaceId, ...input }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { summary: OrganizationSummary };
  return data.summary;
}

export async function addOrganizationMembershipApi(
  organizationId: string,
  input: {
    contact_id: string;
    membership_role?: OrganizationMembershipRole;
    membership_status?: OrganizationMembershipStatus;
    custom_role_label?: string;
  },
) {
  const res = await fetch(
    `/api/contacts/organizations/${encodeURIComponent(organizationId)}/memberships`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
      body: JSON.stringify(input),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function endOrganizationMembershipApi(membershipId: string) {
  const res = await fetch(
    `/api/contacts/organizations/memberships/${encodeURIComponent(membershipId)}`,
    { method: "DELETE", headers: CONTACT_USER_HEADERS },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function assignOrganizationRoleApi(
  organizationId: string,
  input: { membership_id: string; contact_id: string; role: OrganizationMembershipRole; label?: string },
) {
  const res = await fetch(`/api/contacts/organizations/${encodeURIComponent(organizationId)}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
