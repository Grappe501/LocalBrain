import type {
  ContactLifecycleStage,
  ContactRelationshipStrength,
  ContactStewardParticipantRole,
  ContactStewardshipDashboard,
  ContactStewardshipView,
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

export async function fetchContactStewardship(contactId: string): Promise<ContactStewardshipView> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/stewardship`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { view: ContactStewardshipView };
  return data.view;
}

export async function assignContactStewardApi(
  contactId: string,
  input: { steward_user_id: string; reason?: string },
): Promise<ContactStewardshipView> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/stewardship/steward`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { view: ContactStewardshipView };
  return data.view;
}

export async function updateContactStewardshipApi(
  contactId: string,
  input: { strength?: ContactRelationshipStrength; lifecycle_stage?: ContactLifecycleStage },
): Promise<ContactStewardshipView> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/stewardship`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { view: ContactStewardshipView };
  return data.view;
}

export async function addContactStewardParticipantApi(
  contactId: string,
  input: { user_id: string; role: ContactStewardParticipantRole; label?: string },
) {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/stewardship/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function endContactStewardParticipantApi(contactId: string, participantId: string) {
  const res = await fetch(
    `/api/contacts/${encodeURIComponent(contactId)}/stewardship/participants/${encodeURIComponent(participantId)}`,
    { method: "DELETE", headers: CONTACT_USER_HEADERS },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchStewardshipDashboard(
  workspaceId: string,
): Promise<ContactStewardshipDashboard> {
  const res = await fetch(
    `/api/contacts/stewardship/dashboard?workspace_id=${encodeURIComponent(workspaceId)}`,
    { headers: CONTACT_USER_HEADERS },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { dashboard: ContactStewardshipDashboard };
  return data.dashboard;
}
