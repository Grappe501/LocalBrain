import type { LiveSurfaceEntry } from "@localbrain/shared";

export const LIVE_SURFACE_ENGINE_ID = "ENG-SRF-001";

/** Canonical surface registry — every visible route is live, partial, or explicitly stubbed. */
export const SURFACE_REGISTRY: LiveSurfaceEntry[] = [
  {
    route: "/workspace/:workspaceId",
    label: "Living Workspace",
    mode: "live",
    data_sources: ["SQLite workspace registry", "ENG-BLD-001 build state", "workspace events", "workspace links"],
    api_endpoints: ["/api/workspaces/:id", "/api/workspaces/:id/events", "/api/workspaces/:id/links"],
    stub_sections: [],
    slice_id: "LB-OS-004",
  },
  {
    route: "/actions",
    label: "Actions",
    mode: "live",
    data_sources: ["proposed_actions", "action_log", "backup_records"],
    api_endpoints: ["/api/actions/proposed", "/api/actions/log", "/api/actions/backups"],
    stub_sections: [],
    slice_id: "LB-OS-010",
  },
  {
    route: "/program-office",
    label: "Executive Program Office",
    mode: "live",
    data_sources: ["PHASE_CHECKLIST", "BUILD_SLICE_QUEUE_V2", "git", "docs index"],
    api_endpoints: ["/api/epo/overview", "/api/epo/docs"],
    stub_sections: [],
    slice_id: "LB-OS-012.5",
  },
  {
    route: "/system",
    label: "System Health",
    mode: "partial",
    data_sources: ["machine metrics", "storage", "AI usage", "operations counters", "EPO gate"],
    api_endpoints: ["/api/system/health", "/api/epo/overview"],
    stub_sections: [],
    slice_id: "LB-OS-011",
  },
  {
    route: "/explorer",
    label: "Knowledge Explorer",
    mode: "live",
    data_sources: ["metadata index", "workspace registry", "permission engine"],
    api_endpoints: ["/api/knowledge-explorer/tree", "/api/knowledge-explorer/executive"],
    stub_sections: [
      { label: "Manual index run", reason: "POST /index/run not exposed in UI yet — LB-OS-007+" },
    ],
    slice_id: "LB-OS-005",
  },
  {
    route: "/studio/engineering",
    label: "Engineering Studio",
    mode: "partial",
    data_sources: ["repo scan", "checklist", "test inventory"],
    api_endpoints: ["/api/engineering/overview"],
    stub_sections: [
      { label: "Specialist routing", reason: "POST /api/engineering/route — UI wiring LB-OS-026+" },
      { label: "Learn / OJT tab", reason: "Academy slice LB-OS-027–032" },
    ],
    slice_id: "LB-OS-012",
  },
  {
    route: "/studio/writing",
    label: "Writing Studio",
    mode: "partial",
    data_sources: ["workspace roots", "template draft assembler"],
    api_endpoints: ["/api/writing/overview", "/api/writing/sources"],
    stub_sections: [
      { label: "Draft preview", reason: "Template assembly — LLM draft path LB-OS-026+" },
      { label: "Learn tab", reason: "Academy slice LB-OS-027–032" },
    ],
    slice_id: "LB-OS-013",
  },
  {
    route: "/studio/data",
    label: "Data Intelligence Studio",
    mode: "partial",
    data_sources: ["SQLite registry", "source catalog", "query plan preview"],
    api_endpoints: ["/api/data-intelligence/overview", "/api/data-intelligence/insights"],
    stub_sections: [
      { label: "External sources", reason: "Postgres, Drive, etc. marked planned in catalog" },
      { label: "Learn tab", reason: "Academy slice LB-OS-027–032" },
    ],
    slice_id: "LB-OS-014",
  },
  {
    route: "/studio/relationships",
    label: "Relationship Network",
    mode: "partial",
    data_sources: ["seed catalog", "engagement heuristics"],
    api_endpoints: ["/api/relationship-network/overview", "/api/relationship-network/people/:id"],
    stub_sections: [
      { label: "CRM import", reason: "Illustrative seed catalog — live CRM LB-OS-115+" },
      { label: "Network graph viz", reason: "List view only until graph UI slice" },
      { label: "Learn tab", reason: "Academy slice LB-OS-027–032" },
    ],
    slice_id: "LB-OS-015",
  },
  {
    route: "/settings",
    label: "Settings",
    mode: "partial",
    data_sources: ["permission engine", "safety policy"],
    api_endpoints: ["/api/safety/status", "/api/safety/allowed", "/api/safety/forbidden"],
    stub_sections: [
      { label: "Teach Me While We Build", reason: "Local UI toggle — persistence LB-OS-028" },
      { label: "AI providers", reason: "Live at /system/providers (LB-OS-017)" },
    ],
    slice_id: "LB-OS-002",
  },
];
