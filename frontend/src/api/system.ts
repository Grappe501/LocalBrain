import type { SystemHealthResponse, SystemUsageSnapshot } from "@localbrain/shared";

export async function fetchSystemUsage(): Promise<SystemUsageSnapshot & { dock_line: string }> {
  const res = await fetch("/api/system/usage");
  if (!res.ok) throw new Error("System usage fetch failed");
  return (await res.json()) as SystemUsageSnapshot & { dock_line: string };
}

export async function fetchSystemHealth(): Promise<SystemHealthResponse> {
  const res = await fetch("/api/system/health");
  if (!res.ok) throw new Error("System health fetch failed");
  return (await res.json()) as SystemHealthResponse;
}
