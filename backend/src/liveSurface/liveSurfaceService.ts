import {
  maturityLabel,
  type ExperienceMaturityRow,
  type LiveSurfaceAudit,
  type LiveSurfaceSmokeReport,
  type LiveSurfaceSmokeResult,
} from "@localbrain/shared";
import { listActionLog, listBackupRecords, listProposedActions } from "../actions/proposalStore.js";
import { getDataIntelligenceOverview } from "../dataIntelligence/dataIntelligenceService.js";
import { getEpoOverview } from "../epo/epoService.js";
import { getEngineeringOverview } from "../engineering/engineeringService.js";
import { getExecutiveInsights } from "../knowledgeExplorer/explainService.js";
import { getRelationshipNetworkOverview } from "../relationshipNetwork/relationshipNetworkService.js";
import { getSystemHealth } from "../system/systemService.js";
import { getWritingOverview } from "../writing/writingService.js";
import {
  getActiveWorkspaceId,
  getWorkspace,
} from "../workspaces/workspaceRegistry.js";
import { getWorkspaceEvents } from "../workspaces/workspaceEvents.js";
import { getWorkspaceLinks } from "../workspaces/workspaceLinks.js";
import { isDatabaseConnected } from "../db/database.js";
import { getForbiddenRuleCount } from "../safety/permissionEngine.js";
import { projectWorkspaceLive } from "./workspaceProjection.js";
import { LIVE_SURFACE_ENGINE_ID, SURFACE_REGISTRY, EXPERIENCE_MATURITY_ENGINE_ID } from "./surfaceRegistry.js";

export function getExperienceMaturityMatrix(): ExperienceMaturityRow[] {
  return SURFACE_REGISTRY.map((s) => ({
    route: s.route,
    label: s.label,
    surface_mode: s.mode,
    maturity_level: s.maturity_level,
    maturity_label: maturityLabel(s.maturity_level),
    target_level: s.target_maturity_level,
    next_upgrade_slice: s.next_upgrade_slice,
    next_upgrade_summary: s.next_upgrade_summary,
  }));
}

export function getLiveSurfaceAudit(): LiveSurfaceAudit {
  return {
    surfaces: SURFACE_REGISTRY,
    observed_at: new Date().toISOString(),
    engine_id: LIVE_SURFACE_ENGINE_ID,
    experience_maturity_engine_id: EXPERIENCE_MATURITY_ENGINE_ID,
    experience_maturity: getExperienceMaturityMatrix(),
  };
}

function smoke(
  route: string,
  endpoint: string,
  fn: () => unknown,
  requiredKeys: string[],
): LiveSurfaceSmokeResult {
  try {
    const payload = fn();
    if (!payload || typeof payload !== "object") {
      return {
        route,
        endpoint,
        ok: false,
        status_code: 200,
        error: "empty payload",
        keys_present: [],
      };
    }
    const keys_present = requiredKeys.filter((k) => k in (payload as object));
    const ok = keys_present.length === requiredKeys.length;
    return {
      route,
      endpoint,
      ok,
      status_code: 200,
      error: ok
        ? null
        : `missing keys: ${requiredKeys.filter((k) => !keys_present.includes(k)).join(", ")}`,
      keys_present,
    };
  } catch (e) {
    return {
      route,
      endpoint,
      ok: false,
      status_code: null,
      error: e instanceof Error ? e.message : "unknown error",
      keys_present: [],
    };
  }
}

/** In-process smoke checks for priority route payloads (no HTTP). */
export function runLiveSurfaceSmoke(): LiveSurfaceSmokeReport {
  const results: LiveSurfaceSmokeResult[] = [
    smoke("/workspace/:workspaceId", "/api/workspaces/localbrain", () => {
      const ws = getWorkspace("localbrain");
      if (!ws) throw new Error("localbrain workspace missing");
      return {
        workspace: projectWorkspaceLive(ws),
        links: getWorkspaceLinks("localbrain"),
        events: getWorkspaceEvents("localbrain"),
        active_workspace_id: getActiveWorkspaceId(),
      };
    }, ["workspace", "links", "events"]),
    smoke("/actions", "/api/actions/proposed", () => ({
      actions: listProposedActions(),
      log: listActionLog(),
      backups: listBackupRecords(),
    }), ["actions", "log", "backups"]),
    smoke("/program-office", "/api/epo/overview", () => getEpoOverview(), [
      "current_slice_id",
      "build_state_engine_id",
      "current_sprint",
      "build_velocity",
    ]),
    smoke("/system", "/api/system/health", () => getSystemHealth(), [
      "operational_health_score",
      "machine",
      "operations",
    ]),
    smoke("/explorer", "/api/knowledge-explorer/executive", () => ({
      insights: getExecutiveInsights(),
    }), ["insights"]),
    smoke("/studio/engineering", "/api/engineering/overview", () => getEngineeringOverview(), [
      "engineering_score",
      "projects",
    ]),
    smoke("/studio/writing", "/api/writing/overview", () => getWritingOverview(), [
      "writing_score",
      "projects",
    ]),
    smoke("/studio/data", "/api/data-intelligence/overview", () => getDataIntelligenceOverview(), [
      "data_health_score",
      "knowledge_sources",
    ]),
    smoke("/studio/relationships", "/api/relationship-network/overview", () =>
      getRelationshipNetworkOverview(), ["relationship_health_score", "people"]),
    smoke("/settings", "/api/safety/status", () => ({
      engine: "v2",
      active: isDatabaseConnected(),
      dbConnected: isDatabaseConnected(),
      forbiddenRuleCount: getForbiddenRuleCount(),
    }), ["engine", "active", "dbConnected"]),
  ];

  const passed = results.filter((r) => r.ok).length;
  return {
    results,
    passed,
    failed: results.length - passed,
    observed_at: new Date().toISOString(),
  };
}

export function getWorkspaceLiveEnvelope(workspaceId: string) {
  const ws = getWorkspace(workspaceId);
  if (!ws) return null;
  return {
    workspace: projectWorkspaceLive(ws),
    links: getWorkspaceLinks(workspaceId),
    events: getWorkspaceEvents(workspaceId),
    active_workspace_id: getActiveWorkspaceId(),
    live_projection: workspaceId === "localbrain",
    observed_at: new Date().toISOString(),
  };
}
