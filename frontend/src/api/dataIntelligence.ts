import type {
  DataIntelligenceOverview,
  DataHealthScore,
  DataLineageResult,
  QueryPlanPreview,
  KnowledgeSourcePanel,
  DataInsight,
  DataRelationshipGraph,
} from "@localbrain/shared";

export async function fetchDataOverview(): Promise<DataIntelligenceOverview> {
  const res = await fetch("/api/data-intelligence/overview");
  if (!res.ok) throw new Error("Data overview fetch failed");
  return (await res.json()) as DataIntelligenceOverview;
}

export async function fetchDataScore(): Promise<DataHealthScore> {
  const res = await fetch("/api/data-intelligence/score");
  if (!res.ok) throw new Error("Data score fetch failed");
  return (await res.json()) as DataHealthScore;
}

export async function fetchKnowledgeSources(): Promise<KnowledgeSourcePanel[]> {
  const res = await fetch("/api/data-intelligence/sources");
  if (!res.ok) throw new Error("Sources fetch failed");
  const data = (await res.json()) as { sources: KnowledgeSourcePanel[] };
  return data.sources;
}

export async function fetchDataGraph(): Promise<DataRelationshipGraph> {
  const res = await fetch("/api/data-intelligence/graph");
  if (!res.ok) throw new Error("Data graph fetch failed");
  return (await res.json()) as DataRelationshipGraph;
}

export async function fetchDataInsights(): Promise<DataInsight[]> {
  const res = await fetch("/api/data-intelligence/insights");
  if (!res.ok) throw new Error("Insights fetch failed");
  const data = (await res.json()) as { insights: DataInsight[] };
  return data.insights;
}

export async function previewDataQuery(question: string): Promise<QueryPlanPreview> {
  const res = await fetch("/api/data-intelligence/query/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Query preview failed");
  return (await res.json()) as QueryPlanPreview;
}

export async function fetchDataLineage(q: string, sourceId?: string): Promise<DataLineageResult> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sourceId) params.set("source_id", sourceId);
  const res = await fetch(`/api/data-intelligence/lineage?${params}`);
  if (!res.ok) throw new Error("Lineage fetch failed");
  return (await res.json()) as DataLineageResult;
}
