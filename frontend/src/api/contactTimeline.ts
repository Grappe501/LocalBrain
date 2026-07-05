import type {
  ContactInteraction,
  ContactInteractionType,
  ContactTimelineView,
  CreateContactInteractionInput,
} from "@localbrain/shared";
import { CONTACT_INTERACTION_TYPES } from "@localbrain/shared";

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

export async function fetchContactTimeline(
  contactId: string,
  options?: { type?: string },
): Promise<ContactTimelineView> {
  const params = new URLSearchParams();
  if (options?.type) params.set("type", options.type);
  const qs = params.toString();
  const res = await fetch(
    `/api/contacts/${encodeURIComponent(contactId)}/timeline${qs ? `?${qs}` : ""}`,
    { headers: CONTACT_USER_HEADERS },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { timeline: ContactTimelineView };
  return data.timeline;
}

export async function updateContactTimelineMetaApi(
  contactId: string,
  input: {
    manual_summary?: string;
    relationship_owner_user_id?: string | null;
    pinned_next_step?: string;
  },
) {
  const res = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/timeline/meta`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createContactInteractionApi(
  contactId: string,
  input: Omit<CreateContactInteractionInput, "contact_id" | "created_by_user_id"> & {
    created_by_user_id?: string;
  },
): Promise<ContactInteraction> {
  const res = await fetch(
    `/api/contacts/${encodeURIComponent(contactId)}/interactions?workspace_id=${encodeURIComponent(input.workspace_id)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...CONTACT_USER_HEADERS },
      body: JSON.stringify(input),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { interaction: ContactInteraction };
  return data.interaction;
}

export { CONTACT_INTERACTION_TYPES };
export type { ContactInteractionType };
