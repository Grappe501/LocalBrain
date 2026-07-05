import type {
  UpsertVolunteerProfileInput,
  VolunteerProfile,
  VopSupervisorDashboard,
  VopWorkItem,
  WorkItem,
} from "@localbrain/shared";
import { fetchLiveJson } from "./fetchLive";

const VOP_HEADERS = {
  "x-contact-user-id": "volunteer-fair-1",
  "x-contact-user-role": "volunteer",
};

const SUPERVISOR_HEADERS = {
  "x-contact-user-id": "supervisor-1",
  "x-contact-user-role": "supervisor",
};

export async function fetchVolunteerProfile(workspaceId: string): Promise<VolunteerProfile | null> {
  const data = await fetchLiveJson<{ profile: VolunteerProfile | null }>(
    `/api/vop/profiles/me?workspace_id=${encodeURIComponent(workspaceId)}`,
    { headers: VOP_HEADERS },
  );
  return data.profile;
}

export async function saveVolunteerProfile(
  input: UpsertVolunteerProfileInput,
): Promise<VolunteerProfile> {
  const data = await fetchLiveJson<{ profile: VolunteerProfile }>(`/api/vop/profiles/me`, {
    method: "PUT",
    headers: { ...VOP_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return data.profile;
}

export async function fetchOpenVopWork(workspaceId: string): Promise<{
  items: VopWorkItem[];
  ucie_items: WorkItem[];
}> {
  return fetchLiveJson(`/api/vop/work/open?workspace_id=${encodeURIComponent(workspaceId)}`, {
    headers: VOP_HEADERS,
  });
}

export async function fetchMyVopWork(workspaceId: string): Promise<VopWorkItem[]> {
  const data = await fetchLiveJson<{ items: VopWorkItem[] }>(
    `/api/vop/work/mine?workspace_id=${encodeURIComponent(workspaceId)}`,
    { headers: VOP_HEADERS },
  );
  return data.items;
}

export async function claimVopWorkApi(workItemId: string): Promise<VopWorkItem> {
  const data = await fetchLiveJson<{ item: VopWorkItem }>(`/api/vop/work/${workItemId}/claim`, {
    method: "POST",
    headers: VOP_HEADERS,
  });
  return data.item;
}

export async function releaseVopWorkApi(workItemId: string): Promise<VopWorkItem> {
  const data = await fetchLiveJson<{ item: VopWorkItem }>(`/api/vop/work/${workItemId}/release`, {
    method: "POST",
    headers: VOP_HEADERS,
  });
  return data.item;
}

export async function completeVopWorkApi(
  workItemId: string,
  resolutionNote?: string,
): Promise<VopWorkItem> {
  const data = await fetchLiveJson<{ item: VopWorkItem }>(`/api/vop/work/${workItemId}/complete`, {
    method: "POST",
    headers: { ...VOP_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ resolution_note: resolutionNote }),
  });
  return data.item;
}

export async function fetchSupervisorDashboard(workspaceId: string): Promise<{
  dashboard: VopSupervisorDashboard;
  active_work: VopWorkItem[];
}> {
  return fetchLiveJson(
    `/api/vop/supervisor/dashboard?workspace_id=${encodeURIComponent(workspaceId)}`,
    { headers: SUPERVISOR_HEADERS },
  );
}

export async function flagVopWorkApi(
  workItemId: string,
  flagType: "accuracy" | "rework" | "stuck",
  note?: string,
): Promise<VopWorkItem> {
  const data = await fetchLiveJson<{ item: VopWorkItem }>(`/api/vop/work/${workItemId}/flag`, {
    method: "POST",
    headers: { ...SUPERVISOR_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ flag_type: flagType, note }),
  });
  return data.item;
}
