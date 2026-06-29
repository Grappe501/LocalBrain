import type { DataIntelligenceOverview } from "@localbrain/shared";
import { computeDataHealthScore } from "./dataHealthScore.js";
import { buildKnowledgeSourceCatalog } from "./knowledgeSourceCatalog.js";
import { buildDataRelationshipGraph } from "./relationshipGraph.js";
import { generateDataInsights } from "./insights.js";

export const DATA_GUARDRAILS = [
  "No arbitrary SQL execution in V1 — query plans only",
  "No imports without approval",
  "No writes to external systems",
  "Source-aware — permission engine on every path",
  "Every answer must support lineage: where did this come from?",
];

export function getDataIntelligenceOverview(): DataIntelligenceOverview {
  const score = computeDataHealthScore();
  const sources = buildKnowledgeSourceCatalog();
  const insights = generateDataInsights();

  const quality: string[] = [
    `${sources.filter((s) => s.status === "active").length} active knowledge sources`,
    `${sources.filter((s) => s.health === "healthy").length} healthy · ${sources.filter((s) => s.health === "planned").length} planned`,
    `Registry assets drive filesystem coverage`,
  ];

  return {
    data_health_score: score,
    knowledge_sources: sources,
    active_queries: 0,
    chief_recommendation: {
      what: "Connect voter file or Census when campaign research needs cross-county answers",
      why: "Data & Intelligence answers what we know — not just how to run SQL",
      confidence: "medium",
      if_approved: "Import pipeline proposal via Actions queue, then re-run Query Studio",
    },
    data_quality_summary: quality,
    insights,
    relationship_graph: buildDataRelationshipGraph(),
    learn: {
      concepts: ["Knowledge Sources", "Query plans", "Data lineage", "Indexes", "Normalization"],
      current_level: "Explorer — governed read models",
      suggested_lesson: "Why Knowledge Sources replace the word database in LocalBrain",
      practice_challenge: "Trace lineage for localbrain_db workspace query",
      progress_percent: Math.min(100, score.score),
    },
    guardrails: DATA_GUARDRAILS,
    read_only: true,
    observed_at: new Date().toISOString(),
  };
}

export { computeDataHealthScore } from "./dataHealthScore.js";
export { buildKnowledgeSourceCatalog } from "./knowledgeSourceCatalog.js";
export { buildDataRelationshipGraph } from "./relationshipGraph.js";
export { previewQueryPlan } from "./queryStudio.js";
export { explainLineage } from "./lineage.js";
export { generateDataInsights } from "./insights.js";
