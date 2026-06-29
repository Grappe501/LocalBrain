import type { DataLineageResult } from "@localbrain/shared";
import { buildKnowledgeSourceCatalog } from "./knowledgeSourceCatalog.js";

export function explainLineage(input: {
  query?: string;
  source_id?: string;
}): DataLineageResult {
  const catalog = buildKnowledgeSourceCatalog();
  const sourceId = input.source_id ?? catalog.find((s) => s.status === "active")?.source_id ?? null;
  const source = catalog.find((s) => s.source_id === sourceId);

  const steps = [
    {
      stage: "source",
      label: source?.title ?? "Unknown source",
      detail: source ? `${source.kind} · ${source.permissions}` : "Specify source_id",
    },
    {
      stage: "transformation",
      label: "Adapter / index",
      detail:
        source?.kind === "filesystem"
          ? "Knowledge Explorer indexer → Digital Asset Registry"
          : source?.kind === "sqlite"
            ? "SQLite adapter · permission-gated reads"
            : "Planned adapter — not connected",
    },
    {
      stage: "workspace",
      label: source?.workspace_id ?? "Global brain scope",
      detail: "LivingWorkspace context for scoped queries",
    },
    {
      stage: "query",
      label: input.query?.trim() || "Query plan",
      detail: "NL → plan → SQL/API (execution blocked in V1)",
    },
    {
      stage: "result",
      label: "Answer envelope",
      detail: "CoS or Data Chief presents result with lineage footer",
    },
  ];

  return {
    query: input.query ?? null,
    source_id: sourceId,
    steps,
    read_only: true,
  };
}
