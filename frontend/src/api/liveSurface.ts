import type { LiveSurfaceEntry } from "@localbrain/shared";

const ROUTE_ALIASES: Record<string, string> = {
  "/workspace/localbrain": "/workspace/:workspaceId",
  "/studio/engineering": "/studio/engineering",
};

export async function fetchSurfaceAudit(): Promise<LiveSurfaceEntry[]> {
  const res = await fetch("/api/surfaces/audit");
  if (!res.ok) throw new Error(`Surface audit failed: ${res.status}`);
  const data = (await res.json()) as { surfaces: LiveSurfaceEntry[] };
  return data.surfaces;
}

export function matchSurface(
  surfaces: LiveSurfaceEntry[],
  pathname: string,
): LiveSurfaceEntry | undefined {
  const normalized = pathname.replace(/\/workspace\/[^/]+/, "/workspace/:workspaceId");
  return (
    surfaces.find((s) => s.route === normalized) ??
    surfaces.find((s) => s.route === ROUTE_ALIASES[pathname])
  );
}
