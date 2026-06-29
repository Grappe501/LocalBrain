import type { QueryPlanPreview } from "@localbrain/shared";

export function previewQueryPlan(question: string): QueryPlanPreview {
  const q = question.trim() || "List active workspaces";
  const lower = q.toLowerCase();

  const plan_steps: string[] = [
    "Parse natural language intent",
    "Resolve Knowledge Sources from catalog",
    "Build query plan (SQL or API)",
    "Check permissions — read-only default",
    "Preview results + lineage (execution blocked in V1)",
  ];

  let suggested_sql: string | null = null;
  let suggested_api: string | null = null;
  const sources_used: string[] = [];

  if (lower.includes("workspace") || lower.includes("project")) {
    sources_used.push("workspace_registry", "localbrain_db");
    suggested_sql = `SELECT workspace_id, title, workspace_type, status, current_focus
FROM living_workspaces
WHERE status = 'active'
ORDER BY priority DESC;`;
  } else if (lower.includes("asset") || lower.includes("file") || lower.includes("digital")) {
    sources_used.push("digital_asset_registry", "filesystem_index");
    suggested_sql = `SELECT path, kind, lifecycle_stage, size_bytes, modified_at
FROM digital_assets
ORDER BY modified_at DESC
LIMIT 50;`;
  } else if (lower.includes("pulaski") || lower.includes("county") || lower.includes("voter")) {
    sources_used.push("voter_registration", "census_api");
    suggested_api =
      "PLANNED: Join voter_registration import with census blocks — source not connected in V1.";
    suggested_sql = `-- Requires voter_registration source (LB-OS-015+ import)
-- SELECT * FROM voters WHERE county = 'Pulaski' ...`;
  } else if (lower.includes("contact") || lower.includes("met twice")) {
    sources_used.push("contacts_intel");
    suggested_api = "PLANNED: Relationship Intelligence graph query — LB-OS-015.";
  } else if (lower.includes("novel") || lower.includes("scene")) {
    sources_used.push("filesystem_index", "architecture_docs");
    suggested_sql = `-- Canon/scene index not yet materialized — search Digital Asset Registry
SELECT path, title FROM digital_assets WHERE path LIKE '%novel%' OR title LIKE '%scene%';`;
  } else {
    sources_used.push("localbrain_db", "filesystem_index");
    suggested_sql = `-- General catalog probe
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`;
  }

  return {
    question: q,
    plan_steps,
    suggested_sql,
    suggested_api,
    explanation:
      "V1 returns a governed query plan only. Execution requires approval gates (LB-OS-010+) and connected sources. Lineage will trace Source → Transformation → Workspace → Query → Result.",
    sources_used,
    execution_blocked: true,
    read_only: true,
  };
}
