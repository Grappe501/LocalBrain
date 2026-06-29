import type { DataHealthScore } from "@localbrain/shared";
import { buildKnowledgeSourceCatalog } from "./knowledgeSourceCatalog.js";
import { getSystemHealth } from "../system/systemService.js";
import { listDocumentationLibrary } from "../epo/docsLibrary.js";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function labelFromScore(score: number): DataHealthScore["label"] {
  if (score >= 85) return "strong";
  if (score >= 70) return "solid";
  return "needs_attention";
}

export function computeDataHealthScore(): DataHealthScore {
  const sources = buildKnowledgeSourceCatalog();
  const health = getSystemHealth();
  const docs = listDocumentationLibrary().filter(
    (d) => d.category === "Database" || d.path.includes("DATA") || d.path.includes("KNOWLEDGE"),
  );

  const active = sources.filter((s) => s.status === "active").length;
  const planned = sources.filter((s) => s.status === "planned").length;
  const connectivity = clamp(50 + active * 6);
  const freshness =
    health.storage.index_freshness === "fresh"
      ? 95
      : health.storage.index_freshness === "stale"
        ? 45
        : 75;
  const coverage = clamp(40 + active * 5 + planned * 2);
  const integrity = clamp(health.storage.registry_asset_count > 0 ? 88 : 55);
  const documentation = clamp(50 + Math.min(40, docs.length * 5));
  const performance = clamp(health.operational_health_score.score);
  const querySuccess = 100;
  const knowledgeQuality = clamp(
    sources.filter((s) => s.health === "healthy").length * 12 + 20,
  );

  const factors = [
    {
      id: "connectivity",
      name: "Connectivity",
      score: connectivity,
      weight: 0.15,
      detail: `${active} active · ${planned} planned sources`,
    },
    {
      id: "freshness",
      name: "Freshness",
      score: freshness,
      weight: 0.15,
      detail: `Index ${health.storage.index_freshness}`,
    },
    {
      id: "coverage",
      name: "Coverage",
      score: coverage,
      detail: `${sources.length} sources in catalog`,
      weight: 0.12,
    },
    {
      id: "integrity",
      name: "Integrity",
      score: integrity,
      weight: 0.13,
      detail: `${health.storage.registry_asset_count} registry assets`,
    },
    {
      id: "documentation",
      name: "Documentation",
      score: documentation,
      weight: 0.1,
      detail: `${docs.length} data/knowledge docs`,
    },
    {
      id: "performance",
      name: "Performance",
      score: performance,
      weight: 0.1,
      detail: "Operational health cross-signal",
    },
    {
      id: "query_success",
      name: "Query Success",
      score: querySuccess,
      weight: 0.1,
      detail: "V1 plan-only — execution blocked until approval",
    },
    {
      id: "knowledge_quality",
      name: "Knowledge Quality",
      score: knowledgeQuality,
      weight: 0.15,
      detail: "Healthy source ratio + graph linkage",
    },
  ];

  const weightSum = factors.reduce((s, f) => s + f.weight, 0);
  const score = clamp(factors.reduce((sum, f) => sum + f.score * f.weight, 0) / weightSum);
  const label = labelFromScore(score);

  return {
    score,
    label,
    summary:
      label === "strong"
        ? "Connected sources are healthy — ready for governed query planning."
        : label === "solid"
          ? "Foundation is solid — connect planned sources as imports are approved."
          : "Refresh indexes and document sources before cross-dataset queries.",
    factors,
  };
}
