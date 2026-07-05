import type {
  ColumnMapping,
  ImportSession,
  SchemaDiscoveryResult,
  UcieImportSourceType,
  UcieQualityDashboard,
  VoterRecord,
  WorkItem,
} from "@localbrain/shared";

const HEADERS = {
  "X-Contact-User-Id": "local-user",
  "X-Contact-User-Role": "admin",
  "Content-Type": "application/json",
} as const;

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string; error?: string };
    return body.message ?? body.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchUcieSessions(workspaceId: string): Promise<ImportSession[]> {
  const res = await fetch(`/api/ucie/sessions?workspace_id=${encodeURIComponent(workspaceId)}`, { headers: HEADERS });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { sessions: ImportSession[] };
  return data.sessions;
}

export async function createUcieSession(input: {
  workspace_id: string;
  source_type: UcieImportSourceType;
  source_label?: string;
}): Promise<ImportSession> {
  const res = await fetch("/api/ucie/sessions", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { session: ImportSession };
  return data.session;
}

export async function intakeCsv(sessionId: string, filename: string, csv_text: string) {
  const res = await fetch(`/api/ucie/sessions/${encodeURIComponent(sessionId)}/intake/csv`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ filename, csv_text }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{ row_count: number; schema: SchemaDiscoveryResult }>;
}

export async function approveSchema(sessionId: string, mappings: ColumnMapping[], remember: boolean) {
  const res = await fetch(`/api/ucie/sessions/${encodeURIComponent(sessionId)}/schema/approve`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ mappings, remember_for_future: remember }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchWorkItems(workspaceId: string): Promise<WorkItem[]> {
  const res = await fetch(`/api/ucie/work?workspace_id=${encodeURIComponent(workspaceId)}`, { headers: HEADERS });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { items: WorkItem[] };
  return data.items;
}

export async function claimWorkItemApi(workItemId: string) {
  const res = await fetch(`/api/ucie/work/${encodeURIComponent(workItemId)}/claim`, {
    method: "POST",
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function searchVotersApi(filter: {
  workspace_id: string;
  county: string;
  last_name?: string;
  first_name?: string;
}): Promise<VoterRecord[]> {
  const params = new URLSearchParams(filter as Record<string, string>);
  const res = await fetch(`/api/ucie/voters/search?${params.toString()}`, { headers: HEADERS });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { voters: VoterRecord[] };
  return data.voters;
}

export async function fetchQualityDashboard(workspaceId: string): Promise<UcieQualityDashboard> {
  const res = await fetch(`/api/ucie/dashboard/quality?workspace_id=${encodeURIComponent(workspaceId)}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { dashboard: UcieQualityDashboard };
  return data.dashboard;
}

export async function commitUcieRow(rowId: string) {
  const res = await fetch(`/api/ucie/rows/${encodeURIComponent(rowId)}/commit`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
