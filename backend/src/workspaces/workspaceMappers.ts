import type {
  LivingWorkspace,
  WorkspaceEvent,
  WorkspaceFlags,
  WorkspaceProfile,
} from "@localbrain/shared";

export type WorkspaceRow = {
  workspace_id: string;
  workspace_type: string;
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
  filesystem_roots_json: string;
  profile_json: string;
  flags_json: string;
  health_score: number | null;
  risk_score: number | null;
  created_at: string;
  updated_at: string;
};

export function rowToWorkspace(row: WorkspaceRow): LivingWorkspace {
  return {
    workspace_id: row.workspace_id,
    workspace_type: row.workspace_type as LivingWorkspace["workspace_type"],
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    owner: row.owner,
    parent_workspace_id: row.parent_workspace_id,
    executive_context: row.executive_context,
    current_focus: row.current_focus,
    success_definition: row.success_definition,
    workspace_avatar: row.workspace_avatar,
    workspace_color: row.workspace_color,
    workspace_icon: row.workspace_icon,
    filesystem_roots: JSON.parse(row.filesystem_roots_json) as string[],
    profile: JSON.parse(row.profile_json) as WorkspaceProfile,
    flags: JSON.parse(row.flags_json) as WorkspaceFlags,
    health_score: row.health_score,
    risk_score: row.risk_score,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function workspaceToRowFields(ws: Partial<LivingWorkspace> & { workspace_id: string }) {
  return {
    workspace_id: ws.workspace_id,
    workspace_type: ws.workspace_type ?? "personal",
    title: ws.title ?? ws.workspace_id,
    description: ws.description ?? "",
    status: ws.status ?? "active",
    priority: ws.priority ?? 50,
    owner: ws.owner ?? "steve",
    parent_workspace_id: ws.parent_workspace_id ?? null,
    executive_context: ws.executive_context ?? "",
    current_focus: ws.current_focus ?? "",
    success_definition: ws.success_definition ?? "",
    workspace_avatar: ws.workspace_avatar ?? "📁",
    workspace_color: ws.workspace_color ?? "#6b7280",
    workspace_icon: ws.workspace_icon ?? "workspace",
    filesystem_roots_json: JSON.stringify(ws.filesystem_roots ?? []),
    profile_json: JSON.stringify(ws.profile ?? {}),
    flags_json: JSON.stringify(ws.flags ?? {}),
    health_score: ws.health_score ?? null,
    risk_score: ws.risk_score ?? null,
  };
}

export type WorkspaceEventRow = {
  id: number;
  workspace_id: string;
  event_type: string;
  title: string;
  detail: string;
  metadata_json: string;
  created_at: string;
};

export function rowToEvent(row: WorkspaceEventRow): WorkspaceEvent {
  return {
    id: row.id,
    workspace_id: row.workspace_id,
    event_type: row.event_type as WorkspaceEvent["event_type"],
    title: row.title,
    detail: row.detail,
    metadata: JSON.parse(row.metadata_json) as Record<string, unknown>,
    created_at: row.created_at,
  };
}
