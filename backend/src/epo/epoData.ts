/** V1 slice dependencies — from BUILD_SLICE_QUEUE_V2 summary table */
export const SLICE_DEPENDENCIES: Record<string, string[]> = {
  "LB-OS-001": [],
  "LB-OS-002": ["LB-OS-001"],
  "LB-OS-003": ["LB-OS-002"],
  "LB-OS-004": ["LB-OS-003"],
  "LB-OS-106": ["LB-OS-004"],
  "LB-OS-005": ["LB-OS-106"],
  "LB-OS-006": ["LB-OS-005"],
  "LB-OS-007": ["LB-OS-006"],
  "LB-OS-008": ["LB-OS-002"],
  "LB-OS-009": ["LB-OS-005", "LB-OS-008"],
  "LB-OS-010": ["LB-OS-003", "LB-OS-009"],
  "LB-OS-010.5": ["LB-OS-008", "LB-OS-010"],
  "LB-OS-011": ["LB-OS-010"],
  "LB-OS-012": ["LB-OS-010", "LB-OS-010.5", "LB-OS-011", "LB-OS-106"],
  "LB-OS-012.5": ["LB-OS-011", "LB-OS-010.5", "LB-OS-106"],
  "LB-OS-013": ["LB-OS-008", "LB-OS-106"],
  "LB-OS-014": ["LB-OS-106"],
  "LB-OS-015": ["LB-OS-004", "LB-OS-106"],
  "LB-OS-016": ["LB-OS-012", "LB-OS-012.5", "LB-OS-013", "LB-OS-014", "LB-OS-015"],
};

export const EPO_PHASES: {
  phase_id: string;
  label: string;
  slice_ids: string[];
  objectives: string;
}[] = [
  {
    phase_id: "foundation",
    label: "Foundation",
    slice_ids: ["LB-OS-001", "LB-OS-002", "LB-OS-003", "LB-OS-004", "LB-OS-106"],
    objectives: "Repo, shell, permissions, workspaces, module loader",
  },
  {
    phase_id: "knowledge",
    label: "Knowledge Platform",
    slice_ids: ["LB-OS-005", "LB-OS-006", "LB-OS-007", "LB-OS-009"],
    objectives: "Explorer, Digital Asset Registry, intelligence, read tools",
  },
  {
    phase_id: "cos",
    label: "Chief of Staff",
    slice_ids: ["LB-OS-008", "LB-OS-010", "LB-OS-010.5", "LB-OS-011"],
    objectives: "Command layer, approvals, orchestration, system health",
  },
  {
    phase_id: "departments",
    label: "Departments",
    slice_ids: ["LB-OS-012", "LB-OS-012.5", "LB-OS-013", "LB-OS-014", "LB-OS-015"],
    objectives: "Engineering, EPO, Writing, Database, Relationship Intelligence",
  },
  {
    phase_id: "v1",
    label: "Executive OS V1",
    slice_ids: ["LB-OS-016"],
    objectives: "V1 milestone ship gate",
  },
];
