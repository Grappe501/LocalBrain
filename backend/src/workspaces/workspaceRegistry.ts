import type { LivingWorkspace, WorkspaceType } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";
import { getDatabase } from "../db/database.js";
import { getPermissionEngine } from "../safety/permissionEngine.js";
import { appendWorkspaceEvent } from "./workspaceEvents.js";
import { rowToWorkspace, workspaceToRowFields, type WorkspaceRow } from "./workspaceMappers.js";

export function migrateWorkspaceTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS living_workspaces (
      workspace_id TEXT PRIMARY KEY,
      workspace_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active',
      priority INTEGER NOT NULL DEFAULT 50,
      owner TEXT NOT NULL DEFAULT 'steve',
      parent_workspace_id TEXT,
      executive_context TEXT NOT NULL DEFAULT '',
      current_focus TEXT NOT NULL DEFAULT '',
      success_definition TEXT NOT NULL DEFAULT '',
      workspace_avatar TEXT NOT NULL DEFAULT '📁',
      workspace_color TEXT NOT NULL DEFAULT '#6b7280',
      workspace_icon TEXT NOT NULL DEFAULT 'workspace',
      filesystem_roots_json TEXT NOT NULL DEFAULT '[]',
      profile_json TEXT NOT NULL DEFAULT '{}',
      flags_json TEXT NOT NULL DEFAULT '{}',
      health_score REAL,
      risk_score REAL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workspace_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workspace_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT '',
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (workspace_id) REFERENCES living_workspaces(workspace_id)
    );

    CREATE TABLE IF NOT EXISTS workspace_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_workspace_id TEXT NOT NULL,
      to_entity_type TEXT NOT NULL,
      to_entity_id TEXT NOT NULL,
      relationship_type TEXT,
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (from_workspace_id) REFERENCES living_workspaces(workspace_id)
    );

    CREATE INDEX IF NOT EXISTS idx_workspace_events_ws ON workspace_events(workspace_id);
  `);

  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run(
    "active_workspace_id",
    "localbrain",
  );
}

function upsertWorkspace(ws: LivingWorkspace): void {
  const f = workspaceToRowFields(ws);
  getDatabase()
    .prepare(
      `INSERT INTO living_workspaces (
        workspace_id, workspace_type, title, description, status, priority, owner,
        parent_workspace_id, executive_context, current_focus, success_definition,
        workspace_avatar, workspace_color, workspace_icon,
        filesystem_roots_json, profile_json, flags_json,
        health_score, risk_score, created_at, updated_at
      ) VALUES (
        @workspace_id, @workspace_type, @title, @description, @status, @priority, @owner,
        @parent_workspace_id, @executive_context, @current_focus, @success_definition,
        @workspace_avatar, @workspace_color, @workspace_icon,
        @filesystem_roots_json, @profile_json, @flags_json,
        @health_score, @risk_score, datetime('now'), datetime('now')
      )
      ON CONFLICT(workspace_id) DO UPDATE SET
        workspace_type = excluded.workspace_type,
        title = excluded.title,
        description = excluded.description,
        status = excluded.status,
        priority = excluded.priority,
        executive_context = excluded.executive_context,
        current_focus = excluded.current_focus,
        success_definition = excluded.success_definition,
        workspace_avatar = excluded.workspace_avatar,
        workspace_color = excluded.workspace_color,
        workspace_icon = excluded.workspace_icon,
        filesystem_roots_json = excluded.filesystem_roots_json,
        profile_json = excluded.profile_json,
        flags_json = excluded.flags_json,
        health_score = excluded.health_score,
        risk_score = excluded.risk_score,
        updated_at = datetime('now')`,
    )
    .run(f);
}

export function listWorkspaces(filterFlag?: string): LivingWorkspace[] {
  const rows = getDatabase()
    .prepare("SELECT * FROM living_workspaces ORDER BY priority DESC, title")
    .all() as WorkspaceRow[];

  let workspaces = rows.map(rowToWorkspace);

  if (filterFlag) {
    workspaces = workspaces.filter((ws) => Boolean(ws.flags[filterFlag as keyof typeof ws.flags]));
  }

  return workspaces.filter((ws) => !ws.flags.hidden);
}

export function getWorkspace(workspaceId: string): LivingWorkspace | null {
  const row = getDatabase()
    .prepare("SELECT * FROM living_workspaces WHERE workspace_id = ?")
    .get(workspaceId) as WorkspaceRow | undefined;

  return row ? rowToWorkspace(row) : null;
}

export function getActiveWorkspaceId(): string {
  const row = getDatabase()
    .prepare("SELECT value FROM settings WHERE key = 'active_workspace_id'")
    .get() as { value: string } | undefined;

  return row?.value ?? "localbrain";
}

export function setActiveWorkspaceId(workspaceId: string): LivingWorkspace | null {
  const ws = getWorkspace(workspaceId);
  if (!ws) return null;

  getDatabase()
    .prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('active_workspace_id', ?)")
    .run(workspaceId);

  appendWorkspaceEvent({
    workspace_id: workspaceId,
    event_type: "focus_updated",
    title: "Active workspace selected",
    detail: `${ws.title} is now the active workspace in the shell.`,
  });

  return ws;
}

export function validateFilesystemRoots(roots: string[]): { ok: true; normalized: string[] } | { ok: false; reason: string } {
  const engine = getPermissionEngine();
  const normalized: string[] = [];

  for (const root of roots) {
    const result = engine.validateNewFilesystemRoot(root);
    if (!result.allowed) {
      return { ok: false, reason: result.reason };
    }
    if (result.normalizedPath) {
      normalized.push(result.normalizedPath);
    }
  }

  return { ok: true, normalized };
}

export function createWorkspace(input: {
  workspace_id: string;
  workspace_type: WorkspaceType;
  title: string;
  filesystem_roots?: string[];
  description?: string;
  executive_context?: string;
  current_focus?: string;
  success_definition?: string;
}): LivingWorkspace | { error: string } {
  if (getWorkspace(input.workspace_id)) {
    return { error: "Workspace already exists" };
  }

  const roots = input.filesystem_roots ?? [];
  if (roots.length > 0) {
    const validation = validateFilesystemRoots(roots);
    if (!validation.ok) return { error: validation.reason };
  }

  const ws: LivingWorkspace = {
    workspace_id: input.workspace_id,
    workspace_type: input.workspace_type,
    title: input.title,
    description: input.description ?? "",
    status: "active",
    priority: 50,
    owner: "steve",
    parent_workspace_id: null,
    executive_context: input.executive_context ?? "",
    current_focus: input.current_focus ?? "",
    success_definition: input.success_definition ?? "",
    workspace_avatar: "📁",
    workspace_color: "#6b7280",
    workspace_icon: input.workspace_type,
    filesystem_roots: roots,
    profile: {},
    flags: {},
    health_score: null,
    risk_score: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  upsertWorkspace(ws);
  appendWorkspaceEvent({
    workspace_id: ws.workspace_id,
    event_type: "workspace_created",
    title: "Workspace created",
    detail: `${ws.title} registered in the workspace registry.`,
  });

  syncFilesystemRootsToAllowedFolders();

  return ws;
}

export function updateWorkspaceFilesystemRoots(
  workspaceId: string,
  roots: string[],
): LivingWorkspace | { error: string } {
  const ws = getWorkspace(workspaceId);
  if (!ws) return { error: "Workspace not found" };

  const validation = validateFilesystemRoots(roots);
  if (!validation.ok) return { error: validation.reason };

  const updated: LivingWorkspace = {
    ...ws,
    filesystem_roots: validation.normalized,
    updated_at: new Date().toISOString(),
  };

  upsertWorkspace(updated);
  syncFilesystemRootsToAllowedFolders();

  appendWorkspaceEvent({
    workspace_id: workspaceId,
    event_type: "filesystem_root_added",
    title: "Filesystem projection updated",
    detail: `Cutover verification applied projection: ${validation.normalized.join(", ")}`,
  });

  return updated;
}

export function syncFilesystemRootsToAllowedFolders(): void {
  const db = getDatabase();
  const insert = db.prepare(
    "INSERT OR IGNORE INTO allowed_folders (path, label) VALUES (?, ?)",
  );

  for (const ws of listWorkspaces()) {
    for (const root of ws.filesystem_roots) {
      insert.run(root, `${ws.title} · workspace root`);
    }
  }
}

export function seedWorkspaces(): void {
  const seeded = getDatabase()
    .prepare("SELECT value FROM settings WHERE key = 'workspace_registry_seed_v1'")
    .get() as { value: string } | undefined;

  if (seeded?.value === "done") {
    return;
  }

  const repoRoot = getRepoRoot();

  const localbrain: LivingWorkspace = {
    workspace_id: "localbrain",
    workspace_type: "meta",
    title: "LocalBrain",
    description: "Meta workspace — teaches LocalBrain to build itself.",
    status: "active",
    priority: 100,
    owner: "steve",
    parent_workspace_id: null,
    executive_context:
      "LocalBrain is Steve's Executive Operating System — not a chatbot. Wave 1 builds the Institutional Cognition Foundation: deterministic memory substrates that Executive Intelligence reasons over.",
    current_focus: "Institutional Cognition Foundation COMPLETE · Executive Intelligence Era (LB-OS-027)",
    success_definition:
      "A modular AI Executive Operating System that becomes Steve's primary interface for work.",
    workspace_avatar: "🧠",
    workspace_color: "#3b82f6",
    workspace_icon: "meta",
    filesystem_roots: [repoRoot],
    profile: {
      mission: "Build Steve's Executive Operating System",
      current_phase: "Executive Memory · Wave 1 (5/5) · Foundation COMPLETE",
      completed_slices: [
        "LB-OS-001",
        "LB-OS-002",
        "LB-OS-003",
        "LB-OS-004",
        "LB-OS-106",
        "ENG-MEM-001.1",
        "ENG-MEM-001.2",
        "ENG-MEM-001.3",
        "ENG-MEM-001.4",
        "ENG-MEM-001.5",
        "ENG-PMO-005",
      ],
      active_slice: "Executive Intelligence Era",
      next_slices: ["Executive Intelligence · retrieval · graph · advisory layer"],
      recent_decisions: [
        "PSP approved",
        "localbrain home mock",
        "CFO briefing-only in shell",
        "MODULARITY GATE after 004",
        "LivingWorkspace replaces Project Registry",
      ],
      chief_of_staff_summary:
        "Institutional Cognition Foundation COMPLETE — Wave 1 5/5. Episode · Fact · Artifact · Conversation · DecisionCitation. Deterministic Foundation CLOSED · ENG-PMO-005.",
      recommended_next_action:
        "Executive Intelligence Era authorized — build advisory cognition over deterministic substrates.",
      repositories: [],
      contacts: [],
      calendar_links: [],
      documents: [],
      data_sources: [],
      ai_memory: [],
      knowledge_graph_nodes: [],
      goals: [],
      kpis: [],
      next_actions: [],
    },
    flags: { pinned: true, favorite: true, recent: true },
    health_score: 95,
    risk_score: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  upsertWorkspace(localbrain);

  const stubs: Array<Partial<LivingWorkspace> & { workspace_id: string; workspace_type: WorkspaceType; title: string }> = [
    { workspace_id: "reddirt", workspace_type: "campaign", title: "RedDirt", filesystem_roots: [], flags: { hidden: false } },
    { workspace_id: "acu", workspace_type: "engineering", title: "ACU", filesystem_roots: [], flags: { hidden: true } },
    { workspace_id: "countyworkbench", workspace_type: "campaign", title: "CountyWorkbench", filesystem_roots: [] },
    { workspace_id: "votematch", workspace_type: "research", title: "VoteMatch", filesystem_roots: [] },
    { workspace_id: "general", workspace_type: "personal", title: "General Files", filesystem_roots: [] },
  ];

  for (const stub of stubs) {
    upsertWorkspace({
      workspace_id: stub.workspace_id,
      workspace_type: stub.workspace_type,
      title: stub.title,
      description: `${stub.title} workspace (stub seed)`,
      status: "planning",
      priority: 30,
      owner: "steve",
      parent_workspace_id: null,
      executive_context: "",
      current_focus: "",
      success_definition: "",
      workspace_avatar: "📁",
      workspace_color: "#6b7280",
      workspace_icon: stub.workspace_type,
      filesystem_roots: stub.filesystem_roots ?? [],
      profile: {},
      flags: stub.flags ?? {},
      health_score: null,
      risk_score: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  seedLocalbrainEvents();

  getDatabase()
    .prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('workspace_registry_seed_v1', 'done')")
    .run();

  syncFilesystemRootsToAllowedFolders();
}

function seedLocalbrainEvents(): void {
  const events = [
    { event_type: "workspace_created" as const, title: "Workspace created", detail: "LocalBrain meta workspace registered." },
    { event_type: "mission_updated" as const, title: "Mission set", detail: "Build Steve's Executive Operating System." },
    { event_type: "slice_completed" as const, title: "LB-OS-001 complete", detail: "Repo scaffold shipped.", metadata: { slice: "LB-OS-001" } },
    { event_type: "slice_completed" as const, title: "LB-OS-002 complete", detail: "Executive briefing shell shipped.", metadata: { slice: "LB-OS-002" } },
    { event_type: "slice_completed" as const, title: "LB-OS-003 complete", detail: "Permission engine v2 shipped.", metadata: { slice: "LB-OS-003" } },
    { event_type: "chief_of_staff_recommendation" as const, title: "Ship workspace registry next", detail: "Freeze object model at 004; modules after 106." },
    { event_type: "decision_accepted" as const, title: "PSP approved", detail: "Product strategy phase signed off." },
    { event_type: "focus_updated" as const, title: "Current focus updated", detail: "Institutional Cognition Foundation COMPLETE · ENG-PMO-005." },
    { event_type: "success_definition_updated" as const, title: "Success definition set", detail: "Modular AI Executive OS as Steve's primary work interface." },
  ];

  for (const ev of events) {
    appendWorkspaceEvent({ workspace_id: "localbrain", ...ev });
  }
}
