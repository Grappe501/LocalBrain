import type {
  AIProviderPublic,
  AIProvidersOverview,
  AIFlightRecordPublic,
  AIProviderVerifyResult,
  UpdateAIProviderRequest,
} from "@localbrain/shared";

const API = "/api";

export async function fetchProvidersOverview(): Promise<AIProvidersOverview> {
  const res = await fetch(`${API}/providers`);
  if (!res.ok) throw new Error("Failed to load AI providers");
  return res.json() as Promise<AIProvidersOverview>;
}

export async function updateProvider(
  id: string,
  patch: UpdateAIProviderRequest,
): Promise<AIProviderPublic> {
  const res = await fetch(`${API}/providers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update provider");
  return res.json() as Promise<AIProviderPublic>;
}

export async function saveProviderCredential(id: string, apiKey: string): Promise<void> {
  const res = await fetch(`${API}/providers/${id}/credential`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to save credential");
  }
}

export async function verifyProvider(id: string): Promise<AIProviderVerifyResult> {
  const res = await fetch(`${API}/providers/${id}/verify`, { method: "POST" });
  if (!res.ok) throw new Error("Verification failed");
  return res.json() as Promise<AIProviderVerifyResult>;
}

export async function fetchFlightLog(limit = 30): Promise<AIFlightRecordPublic[]> {
  const res = await fetch(`${API}/providers/flight-log?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load flight log");
  const data = (await res.json()) as { records: AIFlightRecordPublic[] };
  return data.records;
}
