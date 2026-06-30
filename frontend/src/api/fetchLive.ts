/** Live-surface fetch — bypass browser and proxy caches for mission-control APIs. */
export async function fetchLiveJson<T>(url: string, init?: RequestInit): Promise<T> {
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}_t=${Date.now()}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...init?.headers,
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status}): ${url}`);
  }
  return (await res.json()) as T;
}
