import type { KnowledgeSourcePanel } from "@localbrain/shared";
import { getDefaultDbPath } from "../db/repoRoot.js";
import { getDatabase, isDatabaseConnected } from "../db/database.js";
import { getRegistryStats } from "../digitalAssets/assetRegistry.js";
import { getSystemHealth } from "../system/systemService.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { getRegisteredModules } from "../core/moduleLoader.js";

function tableCount(table: string): number | null {
  try {
    const row = getDatabase().prepare(`SELECT COUNT(*) AS c FROM ${table}`).get() as {
      c: number;
    };
    return row.c;
  } catch {
    return null;
  }
}

const PLANNED_SOURCES: Omit<KnowledgeSourcePanel, "record_count" | "last_synced_at">[] = [
  {
    source_id: "postgres_county",
    kind: "postgres",
    title: "Postgres — County Workbench",
    description: "Production analytics databases (future server brain).",
    status: "planned",
    permissions: "Not connected",
    health: "planned",
    workspace_id: "countyworkbench",
  },
  {
    source_id: "google_drive",
    kind: "custom",
    title: "Google Drive Archive",
    description: "Cloud archive sync — Phase 14 future arc.",
    status: "planned",
    permissions: "Not connected",
    health: "planned",
    workspace_id: null,
  },
  {
    source_id: "voter_registration",
    kind: "csv",
    title: "Voter Registration Files",
    description: "Campaign voter files — Pulaski County and statewide.",
    status: "planned",
    permissions: "Import approval required",
    health: "planned",
    workspace_id: "reddirt",
  },
  {
    source_id: "census_api",
    kind: "api",
    title: "Census API",
    description: "Demographic and block-level public data.",
    status: "planned",
    permissions: "API key + approval",
    health: "planned",
    workspace_id: null,
  },
  {
    source_id: "bls_api",
    kind: "api",
    title: "Bureau of Labor Statistics",
    description: "Economic indicators and employment data.",
    status: "planned",
    permissions: "API registration",
    health: "planned",
    workspace_id: null,
  },
  {
    source_id: "email_metadata",
    kind: "email",
    title: "Email Threads",
    description: "Metadata-only email index (future).",
    status: "planned",
    permissions: "Not connected",
    health: "planned",
    workspace_id: null,
  },
  {
    source_id: "calendar_feed",
    kind: "calendar",
    title: "Calendar",
    description: "Deadlines, events, campaign schedule.",
    status: "planned",
    permissions: "Not connected",
    health: "planned",
    workspace_id: null,
  },
  {
    source_id: "chatgpt_archive",
    kind: "chatgpt_archive",
    title: "ChatGPT Archive",
    description: "Imported conversation knowledge — migration pipeline.",
    status: "planned",
    permissions: "Import approval",
    health: "planned",
    workspace_id: null,
  },
  {
    source_id: "cursor_reports",
    kind: "cursor_reports",
    title: "Cursor Reports",
    description: "Build handoffs and agent transcripts.",
    status: "planned",
    permissions: "Filesystem read",
    health: "planned",
    workspace_id: "localbrain",
  },
];

export function buildKnowledgeSourceCatalog(): KnowledgeSourcePanel[] {
  const health = getSystemHealth();
  const registry = getRegistryStats();
  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);
  const modules = getRegisteredModules();
  const now = new Date().toISOString();

  const live: KnowledgeSourcePanel[] = [
    {
      source_id: "localbrain_db",
      kind: "sqlite",
      title: "LocalBrain SQLite",
      description: getDefaultDbPath(),
      status: isDatabaseConnected() ? "active" : "error",
      last_synced_at: now,
      record_count: tableCount("digital_assets"),
      permissions: "Kernel read · writes gated",
      health: isDatabaseConnected() ? "healthy" : "error",
      workspace_id: null,
    },
    {
      source_id: "filesystem_index",
      kind: "filesystem",
      title: "Filesystem Index",
      description: "Knowledge Explorer metadata index over approved roots.",
      status: "active",
      last_synced_at: health.storage.latest_index_at,
      record_count: registry.total_assets,
      permissions: "Permission engine roots only",
      health:
        health.storage.index_freshness === "fresh"
          ? "healthy"
          : health.storage.index_freshness === "stale"
            ? "attention"
            : "healthy",
      workspace_id: null,
    },
    {
      source_id: "digital_asset_registry",
      kind: "sqlite",
      title: "Digital Asset Registry",
      description: "Asset records, fingerprints, collections.",
      status: "active",
      last_synced_at: now,
      record_count: registry.total_assets,
      permissions: "Read · intelligence refresh gated",
      health: registry.total_assets > 0 ? "healthy" : "attention",
      workspace_id: null,
    },
    {
      source_id: "workspace_registry",
      kind: "sqlite",
      title: "LivingWorkspace Registry",
      description: "Workspaces, events, links.",
      status: "active",
      last_synced_at: now,
      record_count: tableCount("living_workspaces"),
      permissions: "Kernel read",
      health: "healthy",
      workspace_id: null,
    },
    {
      source_id: "git_history",
      kind: "git",
      title: "Git History",
      description: "Read-only commit log for Platform repo.",
      status: "active",
      last_synced_at: now,
      record_count: null,
      permissions: "Read-only",
      health: "healthy",
      workspace_id: "localbrain",
    },
    {
      source_id: "architecture_docs",
      kind: "filesystem",
      title: "Architecture Docs",
      description: "docs/ planning library indexed by EPO.",
      status: "active",
      last_synced_at: now,
      record_count: null,
      permissions: "Read",
      health: "healthy",
      workspace_id: null,
    },
    {
      source_id: "module_manifests",
      kind: "custom",
      title: "Module Manifests",
      description: "Department capabilities and dependencies.",
      status: "active",
      last_synced_at: now,
      record_count: modules.length,
      permissions: "Read",
      health: "healthy",
      workspace_id: null,
    },
    {
      source_id: "contacts_intel",
      kind: "contacts",
      title: "Relationship & Network Intelligence",
      description: "Social knowledge stub catalog — LB-OS-015.",
      status: "active",
      last_synced_at: now,
      record_count: 8,
      permissions: "Read-only stub · no external sync",
      health: "healthy",
      workspace_id: null,
    },
  ];

  const planned = PLANNED_SOURCES.map((p) => ({
    ...p,
    last_synced_at: null,
    record_count: null,
  }));

  return [...live, ...planned];
}
