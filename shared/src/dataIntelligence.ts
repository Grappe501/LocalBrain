/** Data & Intelligence Department contracts — LB-OS-014 (read/plan only) */

import type { KnowledgeSourceKind, KnowledgeSourceStatus } from "./foundation.js";

export interface KnowledgeSourcePanel {
  source_id: string;
  kind: KnowledgeSourceKind | "excel" | "chatgpt_archive" | "cursor_reports";
  title: string;
  description: string;
  status: KnowledgeSourceStatus | "planned";
  last_synced_at: string | null;
  record_count: number | null;
  permissions: string;
  health: "healthy" | "attention" | "planned" | "error";
  workspace_id: string | null;
}

export interface DataHealthScoreFactor {
  id: string;
  name: string;
  score: number;
  weight: number;
  detail: string;
}

export interface DataHealthScore {
  score: number;
  label: "strong" | "solid" | "needs_attention";
  summary: string;
  factors: DataHealthScoreFactor[];
}

export interface DataRecommendation {
  what: string;
  why: string;
  confidence: "high" | "medium" | "low";
  if_approved: string;
}

export interface QueryPlanPreview {
  question: string;
  plan_steps: string[];
  suggested_sql: string | null;
  suggested_api: string | null;
  explanation: string;
  sources_used: string[];
  execution_blocked: true;
  read_only: true;
}

export interface DataInsight {
  id: string;
  severity: "info" | "attention" | "opportunity";
  title: string;
  detail: string;
}

export interface DataLineageStep {
  stage: string;
  label: string;
  detail: string;
}

export interface DataLineageResult {
  query: string | null;
  source_id: string | null;
  steps: DataLineageStep[];
  read_only: true;
}

export interface DataRelationshipNode {
  id: string;
  kind: "workspace" | "knowledge_source" | "digital_asset" | "module" | "decision" | "engine";
  label: string;
  detail: string | null;
}

export interface DataRelationshipEdge {
  from: string;
  to: string;
  kind: "feeds" | "indexes" | "documents" | "depends_on" | "scopes";
}

export interface DataRelationshipGraph {
  nodes: DataRelationshipNode[];
  edges: DataRelationshipEdge[];
  read_only: true;
}

export interface DataLearnStub {
  concepts: string[];
  current_level: string;
  suggested_lesson: string;
  practice_challenge: string;
  progress_percent: number;
}

export interface DataIntelligenceOverview {
  data_health_score: DataHealthScore;
  knowledge_sources: KnowledgeSourcePanel[];
  active_queries: number;
  chief_recommendation: DataRecommendation;
  data_quality_summary: string[];
  insights: DataInsight[];
  relationship_graph: DataRelationshipGraph;
  learn: DataLearnStub;
  guardrails: string[];
  read_only: true;
  observed_at: string;
}
