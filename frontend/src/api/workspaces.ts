import type { LivingWorkspace, WorkspaceEvent } from "@localbrain/shared";

export async function fetchWorkspaces(flag?: string): Promise<LivingWorkspace[]> {
  const url = flag ? `/api/workspaces?flag=${encodeURIComponent(flag)}` : "/api/workspaces";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Workspaces fetch failed: ${res.status}`);
  const data = (await res.json()) as { workspaces: LivingWorkspace[] };
  return data.workspaces;
}

export async function fetchActiveWorkspace(): Promise<LivingWorkspace> {
  const res = await fetch("/api/workspaces/active");
  if (!res.ok) throw new Error(`Active workspace failed: ${res.status}`);
  const data = (await res.json()) as { workspace: LivingWorkspace };
  return data.workspace;
}

export async function fetchWorkspace(id: string): Promise<LivingWorkspace> {
  const res = await fetch(`/api/workspaces/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Workspace ${id} not found`);
  const data = (await res.json()) as { workspace: LivingWorkspace };
  return data.workspace;
}

export async function fetchWorkspaceEvents(id: string): Promise<WorkspaceEvent[]> {
  const res = await fetch(`/api/workspaces/${encodeURIComponent(id)}/events`);
  if (!res.ok) throw new Error(`Workspace events failed: ${res.status}`);
  const data = (await res.json()) as { events: WorkspaceEvent[] };
  return data.events;
}

export async function selectWorkspace(id: string): Promise<LivingWorkspace> {
  const res = await fetch(`/api/workspaces/${encodeURIComponent(id)}/select`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Select workspace failed: ${res.status}`);
  const data = (await res.json()) as { workspace: LivingWorkspace };
  return data.workspace;
}
