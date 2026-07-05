import type {
  ContactActionQueue,
  ContactActionView,
  ContactTaskPriority,
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

export async function fetchContactActions(contactId: string): Promise<ContactActionView> {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/actions`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { view: ContactActionView };
  return data.view;
}

export async function createContactActionTaskApi(
  contactId: string,
  input: {
    title: string;
    details?: string;
    priority?: ContactTaskPriority;
    assigned_to_user_id?: string;
    due_at?: string;
    interaction_id?: string;
  },
) {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/actions/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function completeContactActionTaskApi(taskId: string, note?: string) {
  const res = await fetch(`/api/contacts/actions/tasks/${encodeURIComponent(taskId)}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function completeInteractionFollowUpApi(interactionId: string) {
  const res = await fetch(
    `/api/contacts/actions/follow-ups/${encodeURIComponent(interactionId)}/complete`,
    {
      method: "POST",
      headers: CONTACT_USER_HEADERS,
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchActionQueue(
  workspaceId: string,
  assignedTo?: string,
): Promise<ContactActionQueue> {
  const params = new URLSearchParams({ workspace_id: workspaceId });
  if (assignedTo) params.set("assigned_to", assignedTo);
  const res = await fetch(`/api/contacts/actions/queue?${params.toString()}`, {
    headers: CONTACT_USER_HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { queue: ContactActionQueue };
  return data.queue;
}
