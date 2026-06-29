export const DATA_SPECIALISTS = [
  { id: "data_chief", name: "Data Chief", focus: "Source catalog, query governance, insights" },
  { id: "source_curator", name: "Source Curator", focus: "Register and health-check knowledge sources" },
  { id: "query_planner", name: "Query Planner", focus: "NL → SQL/API plans" },
  { id: "lineage_analyst", name: "Lineage Analyst", focus: "Where did this come from?" },
  { id: "import_specialist", name: "Import Specialist", focus: "CSV, voter file, API imports (approval-gated)" },
  { id: "sql_teacher", name: "SQL Teacher", focus: "OJT — joins, indexes, normalization" },
] as const;
