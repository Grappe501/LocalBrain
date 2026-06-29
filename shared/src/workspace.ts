export type WorkspaceType =
  | "meta"
  | "engineering"
  | "campaign"
  | "novel"
  | "photography"
  | "podcast"
  | "research"
  | "database"
  | "finance"
  | "learning"
  | "personal"
  | "executive";

export type WorkspaceFlags = {
  pinned?: boolean;
  recent?: boolean;
  favorite?: boolean;
  archived?: boolean;
  hidden?: boolean;
  ai_recommended?: boolean;
  needs_attention?: boolean;
};

export type WorkspaceProfile = {
  mission?: string;
  current_phase?: string;
  completed_slices?: string[];
  active_slice?: string;
  next_slices?: string[];
  recent_decisions?: string[];
  chief_of_staff_summary?: string;
  recommended_next_action?: string;
  repositories?: unknown[];
  contacts?: unknown[];
  calendar_links?: unknown[];
  documents?: unknown[];
  data_sources?: unknown[];
  ai_memory?: unknown[];
  knowledge_graph_nodes?: unknown[];
  goals?: unknown[];
  kpis?: unknown[];
  next_actions?: unknown[];
};

export type LivingWorkspace = {
  workspace_id: string;
  workspace_type: WorkspaceType;
  title: string;
  description: string;
  status: string;
  priority: number;
  owner: string;
  parent_workspace_id: string | null;
  executive_context: string;
  current_focus: string;
  success_definition: string;
  workspace_avatar: string;
  workspace_color: string;
  workspace_icon: string;
  filesystem_roots: string[];
  profile: WorkspaceProfile;
  flags: WorkspaceFlags;
  health_score: number | null;
  risk_score: number | null;
  created_at: string;
  updated_at: string;
};

export type WorkspaceEventType =
  | "workspace_created"
  | "mission_updated"
  | "focus_updated"
  | "burt_packet_generated"
  | "slice_completed"
  | "deployment_failed"
  | "chief_of_staff_recommendation"
  | "decision_accepted"
  | "workspace_archived"
  | "filesystem_root_added"
  | "success_definition_updated";

export type WorkspaceEvent = {
  id: number;
  workspace_id: string;
  event_type: WorkspaceEventType;
  title: string;
  detail: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type WorkspaceLink = {
  id: number;
  from_workspace_id: string;
  to_entity_type: string;
  to_entity_id: string;
  relationship_type: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};
