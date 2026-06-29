/** Engineering Department contracts — LB-OS-012 (read-only intelligence) */

export type EngGraphNodeKind =
  | "repository"
  | "module"
  | "engine"
  | "capability"
  | "knowledge_source"
  | "workspace"
  | "decision"
  | "burt_packet"
  | "test"
  | "slice";

export type EngGraphEdgeKind =
  | "depends_on"
  | "implements"
  | "documents"
  | "tests"
  | "belongs_to"
  | "introduced_by"
  | "uses";

export interface EngGraphNode {
  id: string;
  kind: EngGraphNodeKind;
  label: string;
  detail: string | null;
  status: string | null;
}

export interface EngGraphEdge {
  from: string;
  to: string;
  kind: EngGraphEdgeKind;
}

export interface EngineeringKnowledgeGraph {
  nodes: EngGraphNode[];
  edges: EngGraphEdge[];
  node_counts: Record<EngGraphNodeKind, number>;
  read_only: true;
}

export interface EngineeringScoreFactor {
  id: string;
  name: string;
  score: number;
  weight: number;
  detail: string;
}

export interface EngineeringScore {
  score: number;
  label: "strong" | "solid" | "needs_attention";
  summary: string;
  factors: EngineeringScoreFactor[];
}

export interface EngineeringRecommendation {
  what: string;
  why: string;
  confidence: "high" | "medium" | "low";
  if_approved: string;
}

export interface EngineeringProjectSummary {
  workspace_id: string;
  title: string;
  workspace_type: string;
  status: string;
  current_focus: string;
  health_score: number | null;
  filesystem_roots: string[];
}

export interface BurtPacketSummary {
  slice_id: string | null;
  path: string;
  title: string;
  status: string;
}

export interface BurtPacketPreview {
  slice_id: string | null;
  title: string;
  markdown: string;
  export_path: string;
  read_only: true;
}

export interface EngineeringExplainResponse {
  workspace_id: string;
  workspace_title: string;
  mission: string;
  architecture: string;
  health: string;
  current_sprint: string;
  major_risks: string[];
  dependencies: string[];
  open_decisions: string[];
  technical_debt: string[];
  recommended_next_step: EngineeringRecommendation;
  read_only: true;
}

export interface EngineeringImpactResult {
  query: string;
  matched_nodes: EngGraphNode[];
  affected_nodes: EngGraphNode[];
  paths: string[][];
  read_only: true;
}

export interface EngineeringLearnStub {
  concepts_learned: string[];
  current_level: string;
  suggested_lesson: string;
  practice_challenge: string;
  progress_percent: number;
  teach_mode_available: boolean;
}

export interface EngineeringOverview {
  engineering_score: EngineeringScore;
  current_slice_id: string | null;
  current_slice_name: string | null;
  current_sprint: string;
  active_repositories: { id: string; label: string; path: string }[];
  test_status: {
    test_file_count: number;
    last_run: string | null;
    passing: number | null;
    detail: string;
  };
  technical_debt: string[];
  chief_recommendation: EngineeringRecommendation;
  projects: EngineeringProjectSummary[];
  graph_summary: EngineeringKnowledgeGraph;
  burt_history: BurtPacketSummary[];
  knowledge_docs: { path: string; title: string; category: string }[];
  learn: EngineeringLearnStub;
  specialists: { id: string; name: string; focus: string }[];
  operational_health_score: number;
  read_only: true;
  observed_at: string;
}
