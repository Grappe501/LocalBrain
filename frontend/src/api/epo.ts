import type { EpoOverview, EpoSliceDetail, EpoDocEntry } from "@localbrain/shared";

export async function fetchEpoOverview(): Promise<EpoOverview> {
  const res = await fetch("/api/epo/overview");
  if (!res.ok) throw new Error("EPO overview fetch failed");
  return (await res.json()) as EpoOverview;
}

export async function fetchEpoSlice(sliceId: string): Promise<EpoSliceDetail> {
  const res = await fetch(`/api/epo/slices/${encodeURIComponent(sliceId)}`);
  if (!res.ok) throw new Error("EPO slice fetch failed");
  const data = (await res.json()) as { slice: EpoSliceDetail };
  return data.slice;
}

export async function fetchEpoDocs(query?: string): Promise<EpoDocEntry[]> {
  const url = query
    ? `/api/epo/docs?q=${encodeURIComponent(query)}`
    : "/api/epo/docs";
  const res = await fetch(url);
  if (!res.ok) throw new Error("EPO docs fetch failed");
  const data = (await res.json()) as { docs: EpoDocEntry[] };
  return data.docs;
}

export async function fetchEpoWhy(sliceId: string): Promise<{
  slice_id: string;
  explanation: string;
  confidence: string;
}> {
  const res = await fetch(`/api/epo/why/${encodeURIComponent(sliceId)}`);
  if (!res.ok) throw new Error("EPO why fetch failed");
  return (await res.json()) as { slice_id: string; explanation: string; confidence: string };
}
