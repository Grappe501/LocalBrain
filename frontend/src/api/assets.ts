import type { DigitalAsset, DigitalAssetFingerprint } from "@localbrain/shared";

export type { DigitalAsset, DigitalAssetFingerprint };

export async function fetchAssetByPath(path: string): Promise<DigitalAsset | null> {
  const res = await fetch(`/api/assets?path=${encodeURIComponent(path)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Asset fetch failed");
  const data = (await res.json()) as { assets: DigitalAsset[] };
  return data.assets[0] ?? null;
}

export async function fetchAssetStats(): Promise<{
  total_assets: number;
  by_lifecycle: Record<string, number>;
  dormant_bytes_estimate: number;
  collections_count: number;
}> {
  const res = await fetch("/api/assets/stats");
  if (!res.ok) throw new Error("Asset stats failed");
  const data = (await res.json()) as { stats: {
    total_assets: number;
    by_lifecycle: Record<string, number>;
    dormant_bytes_estimate: number;
    collections_count: number;
  } };
  return data.stats;
}

export async function fetchRegistryStatus(): Promise<{
  registry: string;
  stats: {
    total_assets: number;
    by_lifecycle: Record<string, number>;
    dormant_bytes_estimate: number;
    collections_count: number;
  };
  collections: { collection_id: string; title: string; description: string; query: string; asset_count: number | null }[];
}> {
  const res = await fetch("/api/assets/registry/status");
  if (!res.ok) throw new Error("Registry status failed");
  return (await res.json()) as {
    registry: string;
    stats: {
      total_assets: number;
      by_lifecycle: Record<string, number>;
      dormant_bytes_estimate: number;
      collections_count: number;
    };
    collections: { collection_id: string; title: string; description: string; query: string; asset_count: number | null }[];
  };
}
