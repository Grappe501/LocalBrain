import type { V1AcceptanceReport } from "@localbrain/shared";

export async function fetchV1Acceptance(): Promise<V1AcceptanceReport> {
  const res = await fetch("/api/v1/acceptance");
  if (!res.ok) throw new Error("V1 acceptance fetch failed");
  return (await res.json()) as V1AcceptanceReport;
}
