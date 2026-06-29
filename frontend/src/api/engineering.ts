import type {
  BurtPacketPreview,
  EngineeringExplainResponse,
  EngineeringImpactResult,
  EngineeringKnowledgeGraph,
  EngineeringOverview,
  EngineeringScore,
} from "@localbrain/shared";

export async function fetchEngineeringOverview(): Promise<EngineeringOverview> {
  const res = await fetch("/api/engineering/overview");
  if (!res.ok) throw new Error("Engineering overview fetch failed");
  return (await res.json()) as EngineeringOverview;
}

export async function fetchEngineeringScore(): Promise<EngineeringScore> {
  const res = await fetch("/api/engineering/score");
  if (!res.ok) throw new Error("Engineering score fetch failed");
  return (await res.json()) as EngineeringScore;
}

export async function fetchEngineeringGraph(): Promise<EngineeringKnowledgeGraph> {
  const res = await fetch("/api/engineering/graph");
  if (!res.ok) throw new Error("Engineering graph fetch failed");
  return (await res.json()) as EngineeringKnowledgeGraph;
}

export async function fetchEngineeringImpact(query: string): Promise<EngineeringImpactResult> {
  const res = await fetch(`/api/engineering/impact?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Impact analysis fetch failed");
  return (await res.json()) as EngineeringImpactResult;
}

export async function fetchExplainProject(workspaceId: string): Promise<EngineeringExplainResponse> {
  const res = await fetch(
    `/api/engineering/explain?workspace_id=${encodeURIComponent(workspaceId)}`,
  );
  if (!res.ok) throw new Error("Explain project fetch failed");
  return (await res.json()) as EngineeringExplainResponse;
}

export async function previewBurtPacket(body: {
  slice_id?: string;
  title?: string;
}): Promise<BurtPacketPreview> {
  const res = await fetch("/api/engineering/burt/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Burt preview failed");
  return (await res.json()) as BurtPacketPreview;
}
