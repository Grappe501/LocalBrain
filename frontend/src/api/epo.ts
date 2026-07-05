import type { EpoOverview, EpoSliceDetail, EpoDocEntry, PlatformReadinessReport, PlatformStateReport, ProjectState } from "@localbrain/shared";
import { fetchLiveJson } from "./fetchLive";

export async function fetchProjectState(): Promise<ProjectState> {
  return fetchLiveJson<ProjectState>("/api/epo/project-state");
}

export async function fetchEpoOverview(): Promise<EpoOverview> {
  return fetchLiveJson<EpoOverview>("/api/epo/overview");
}

export async function fetchEpoSlice(sliceId: string): Promise<EpoSliceDetail> {
  const data = await fetchLiveJson<{ slice: EpoSliceDetail }>(
    `/api/epo/slices/${encodeURIComponent(sliceId)}`,
  );
  return data.slice;
}

export async function fetchEpoDocs(query?: string): Promise<EpoDocEntry[]> {
  const url = query
    ? `/api/epo/docs?q=${encodeURIComponent(query)}`
    : "/api/epo/docs";
  const data = await fetchLiveJson<{ docs: EpoDocEntry[] }>(url);
  return data.docs;
}

export async function fetchEpoWhy(sliceId: string): Promise<{
  slice_id: string;
  explanation: string;
  confidence: string;
}> {
  return fetchLiveJson(`/api/epo/why/${encodeURIComponent(sliceId)}`);
}

export async function fetchPlatformReadiness(): Promise<PlatformReadinessReport> {
  return fetchLiveJson<PlatformReadinessReport>("/api/epo/readiness");
}

export async function fetchPlatformStateAudit(): Promise<PlatformStateReport> {
  return fetchLiveJson<PlatformStateReport>("/api/epo/platform-state-audit");
}

export async function fetchEpoDocContent(docPath: string): Promise<{
  path: string;
  title: string;
  content: string;
}> {
  return fetchLiveJson(
    `/api/epo/docs/content?path=${encodeURIComponent(docPath)}`,
  );
}
