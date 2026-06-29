/** Curated kernel engines for Engineering Knowledge Graph (V1 read model). */

export interface EngineSeed {
  id: string;
  label: string;
  detail: string;
  status: string;
  path: string | null;
  depends_on: string[];
}

export const KERNEL_ENGINE_SEEDS: EngineSeed[] = [
  {
    id: "ENG-PM-001",
    label: "Permission Engine",
    detail: "Filesystem roots, action gates, safety model",
    status: "complete",
    path: "backend/src/safety",
    depends_on: [],
  },
  {
    id: "ENG-WR-001",
    label: "Workspace Registry",
    detail: "LivingWorkspace, events, links",
    status: "complete",
    path: "backend/src/workspaces",
    depends_on: ["ENG-PM-001"],
  },
  {
    id: "ENG-KE-001",
    label: "Knowledge Explorer",
    detail: "Metadata index, browse/understand modes",
    status: "complete",
    path: "backend/src/knowledgeExplorer",
    depends_on: ["ENG-PM-001", "ENG-DA-001"],
  },
  {
    id: "ENG-DA-001",
    label: "Digital Asset Registry",
    detail: "Asset records, fingerprints, collections",
    status: "complete",
    path: "backend/src/digitalAssets",
    depends_on: ["ENG-PM-001"],
  },
  {
    id: "ENG-ACT-001",
    label: "Approval Engine",
    detail: "Proposed actions, quarantine, backup",
    status: "complete",
    path: "backend/src/actions",
    depends_on: ["ENG-PM-001"],
  },
  {
    id: "ENG-COS-001",
    label: "Chief of Staff",
    detail: "Intent routing, proposals, learning outcomes",
    status: "complete",
    path: "backend/src/cos",
    depends_on: ["ENG-PM-001", "ENG-WR-001"],
  },
  {
    id: "ENG-SYS-001",
    label: "System Health",
    detail: "Operational health score, machine panels",
    status: "complete",
    path: "backend/src/system",
    depends_on: ["ENG-ACT-001"],
  },
  {
    id: "ENG-EPO-001",
    label: "Executive Program Office",
    detail: "Slice scoreboard, docs library, build graph",
    status: "complete",
    path: "backend/src/epo",
    depends_on: ["ENG-WR-001", "ENG-SYS-001"],
  },
  {
    id: "ENG-MOD-001",
    label: "Module Loader",
    detail: "Manifest registry, department routing",
    status: "complete",
    path: "backend/src/core/moduleLoader.ts",
    depends_on: [],
  },
  {
    id: "ENG-ENG-001",
    label: "Engineering Department",
    detail: "Knowledge graph, score, Burt integration",
    status: "bootstrap",
    path: "backend/src/engineering",
    depends_on: ["ENG-EPO-001", "ENG-MOD-001", "ENG-WR-001"],
  },
];

export const KNOWLEDGE_SOURCE_SEEDS = [
  {
    id: "KS-EXPLORER",
    label: "Filesystem Index",
    detail: "Knowledge Explorer metadata index",
    status: "active",
  },
  {
    id: "KS-ASSET-REG",
    label: "Digital Asset Registry",
    detail: "SQLite asset records",
    status: "active",
  },
  {
    id: "KS-DOCS",
    label: "Architecture Docs",
    detail: "docs/ planning library",
    status: "active",
  },
  {
    id: "KS-GIT",
    label: "Git History",
    detail: "Read-only commit log",
    status: "active",
  },
];
