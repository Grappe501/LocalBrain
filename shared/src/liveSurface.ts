/** Live surface audit contracts — LB-OS-019.6 */

import type { LivingWorkspace, WorkspaceEvent } from "./workspace.js";

export type LiveSurfaceMode = "live" | "partial" | "stub";

export interface LiveSurfaceStubSection {
  label: string;
  reason: string;
}

export interface LiveSurfaceEntry {
  route: string;
  label: string;
  mode: LiveSurfaceMode;
  data_sources: string[];
  api_endpoints: string[];
  stub_sections: LiveSurfaceStubSection[];
  slice_id: string;
}

export interface LiveSurfaceAudit {
  surfaces: LiveSurfaceEntry[];
  observed_at: string;
  engine_id: string;
}

export interface LiveSurfaceSmokeResult {
  route: string;
  endpoint: string;
  ok: boolean;
  status_code: number | null;
  error: string | null;
  keys_present: string[];
}

export interface LiveSurfaceSmokeReport {
  results: LiveSurfaceSmokeResult[];
  passed: number;
  failed: number;
  observed_at: string;
}

export interface WorkspaceLinkRow {
  id: number;
  from_workspace_id: string;
  to_entity_type: string;
  to_entity_id: string;
  relationship_type: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface WorkspaceLiveEnvelope {
  workspace: LivingWorkspace;
  links: WorkspaceLinkRow[];
  events: WorkspaceEvent[];
  active_workspace_id: string | null;
  live_projection: boolean;
  observed_at: string;
}
