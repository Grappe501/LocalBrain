import type { DataInsight } from "@localbrain/shared";
import { buildKnowledgeSourceCatalog } from "./knowledgeSourceCatalog.js";
import { getSystemHealth } from "../system/systemService.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";

export function generateDataInsights(): DataInsight[] {
  const insights: DataInsight[] = [];
  const sources = buildKnowledgeSourceCatalog();
  const health = getSystemHealth();
  const planned = sources.filter((s) => s.status === "planned");
  const stale = sources.filter((s) => s.health === "attention");

  if (health.storage.index_freshness === "stale") {
    insights.push({
      id: "stale-index",
      severity: "attention",
      title: "Filesystem index is stale",
      detail: "Run Knowledge Explorer refresh or wait for background indexer before cross-file queries.",
    });
  }

  if (planned.length > 0) {
    insights.push({
      id: "planned-sources",
      severity: "opportunity",
      title: `${planned.length} knowledge sources ready to connect`,
      detail: `Next imports: ${planned
        .slice(0, 4)
        .map((p) => p.title)
        .join(", ")}`,
    });
  }

  for (const s of stale) {
    insights.push({
      id: `stale-${s.source_id}`,
      severity: "attention",
      title: `${s.title} needs attention`,
      detail: s.description,
    });
  }

  const noRoots = listWorkspaces().filter(
    (w) => !w.flags.hidden && w.filesystem_roots.length === 0 && w.workspace_id !== "localbrain",
  );
  if (noRoots.length > 0) {
    insights.push({
      id: "missing-roots",
      severity: "info",
      title: "Workspaces without filesystem roots",
      detail: `${noRoots.map((w) => w.title).join(", ")} — link sources for project-aware queries.`,
    });
  }

  insights.push({
    id: "lineage-ready",
    severity: "info",
    title: "Data lineage available on every query plan",
    detail: "Use Lineage in Query Studio to trace Source → Transformation → Workspace → Query → Result.",
  });

  return insights;
}
