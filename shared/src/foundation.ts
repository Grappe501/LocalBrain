/**
 * Foundational object contracts — frozen after architecture lock v1.0 (2026-06-28).
 * @see docs/LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md
 */

/** @see docs/LOCALBRAIN_MEMORY_DOMAINS.md */
export type MemoryDomain =
  | "personal"
  | "workspace"
  | "system"
  | "relationship"
  | "learning"
  | "executive";

/** @see docs/LOCALBRAIN_KNOWLEDGE_SOURCES.md */
export type KnowledgeSourceKind =
  | "sqlite"
  | "postgres"
  | "filesystem"
  | "git"
  | "contacts"
  | "calendar"
  | "email"
  | "api"
  | "csv"
  | "vector"
  | "archive"
  | "custom";

export type KnowledgeSourceStatus = "active" | "paused" | "error" | "sync_pending";

export interface KnowledgeSource {
  source_id: string;
  kind: KnowledgeSourceKind;
  title: string;
  description: string;
  workspace_id: string | null;
  status: KnowledgeSourceStatus;
  last_synced_at: string | null;
  capabilities: Array<"query" | "full_text" | "semantic" | "write">;
}

/** @see docs/LOCALBRAIN_DECISION_LEDGER.md */
export type DecisionStatus = "proposed" | "accepted" | "binding" | "superseded" | "revoked";

export interface Decision {
  decision_id: string;
  title: string;
  summary: string;
  reason: string;
  status: DecisionStatus;
  decided_at: string;
  decided_by: string;
  supersedes: string | null;
  superseded_by: string | null;
  tags: string[];
  related_workspace_ids: string[];
  evidence_links: string[];
}

export interface MemoryRecord {
  memory_id: string;
  domain: MemoryDomain;
  workspace_id: string | null;
  kind: string;
  content: string;
  source_ref: string | null;
  created_at: string;
  updated_at: string;
}

/** @see docs/LOCALBRAIN_AGENT_REGISTRY.md */
export interface Agent {
  agent_id: string;
  title: string;
  mandate: string;
  tool_allowlist: string[];
  status: "active" | "stub" | "deprecated";
}

/** @see docs/LOCALBRAIN_CAPABILITY_MAP.md */
export interface Capability {
  capability_id: string;
  title: string;
  domain: string;
  matrix_cell: string | null;
  status: "planned" | "partial" | "complete";
}

/** @see docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md */
export interface Module {
  module_id: string;
  title: string;
  version: string;
  entry: string;
  dependencies: string[];
  status: "stub" | "loaded" | "disabled";
}

/** @see docs/LOCALBRAIN_ENGINE_REGISTRY.md */
export type EngineStatus = "PLANNED" | "BOOTSTRAP" | "PARTIAL" | "COMPLETE" | "DEFERRED";

export interface Engine {
  engine_id: string;
  title: string;
  layer: 1 | 2 | 3 | 4 | 5;
  status: EngineStatus;
  responsibility: string;
}
