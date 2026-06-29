import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import type {
  ArchiveStrategyDraft,
  HStructureProposal,
  MigrationApprovalItem,
  MigrationPhasePreview,
} from "@localbrain/shared";
import type { DrivePlacementAudit } from "@localbrain/shared";
import { parsePhaseChecklistSlices } from "../epo/checklistParser.js";

const MIGRATION_ARC: { slice_id: string; name: string; description: string }[] = [
  {
    slice_id: "LB-OS-018",
    name: "Drive architecture & migration planner",
    description: "Doctrine dashboard, placement audit, plan preview (read-only)",
  },
  {
    slice_id: "LB-OS-019",
    name: "Full filesystem mapping audit",
    description: "Permission-gated H: inventory — metadata only",
  },
  {
    slice_id: "LB-OS-020",
    name: "Duplicate / version cleanup planner",
    description: "Dry-run duplicates report — no auto cleanup",
  },
  {
    slice_id: "LB-OS-021",
    name: "H:/ project filing system builder",
    description: "Filing taxonomy proposals",
  },
  {
    slice_id: "LB-OS-022",
    name: "ChatGPT knowledge import pipeline",
    description: "Import/map exports into project memory",
  },
  {
    slice_id: "LB-OS-023",
    name: "Project memory transfer engine",
    description: "Cursor reports, handoffs, build docs",
  },
  {
    slice_id: "LB-OS-024",
    name: "Legacy folder reorganization assistant",
    description: "Approved batch reorg only",
  },
  {
    slice_id: "LB-OS-025",
    name: "Personal system cutover plan",
    description: "Sign-off checklist",
  },
  {
    slice_id: "LB-OS-026",
    name: "LocalBrain Personal OS launch",
    description: "Primary interface cutover",
  },
];

export function buildMigrationArc(): MigrationPhasePreview[] {
  const slices = parsePhaseChecklistSlices();
  const statusMap = new Map(slices.map((s) => [s.slice_id, s.status]));

  return MIGRATION_ARC.map((phase) => {
    const st = statusMap.get(phase.slice_id);
    let status: MigrationPhasePreview["status"] = "planned";
    if (st === "complete") status = "complete";
    else if (phase.slice_id === "LB-OS-018" || st === "in_progress") status = "current";

    return { ...phase, status };
  });
}

export function buildHStructureProposal(): HStructureProposal {
  const workspaces = listWorkspaces();
  const existingRoots = new Set(
    workspaces.flatMap((w) => w.filesystem_roots.map((r) => r.toLowerCase())),
  );

  const folders: HStructureProposal["folders"] = [
    {
      path: "H:\\Projects",
      purpose: "Active client & civic campaigns, codebases, initiatives",
      risk: "low",
    },
    {
      path: "H:\\Archives",
      purpose: "Completed work, legacy exports, cold storage candidates",
      risk: "low",
    },
    {
      path: "H:\\Documents",
      purpose: "Strategy, writing, finance, long-form documents",
      risk: "low",
    },
    {
      path: "H:\\Media",
      purpose: "Photography, podcast assets, creative media",
      risk: "low",
    },
    {
      path: "H:\\localAgent",
      purpose: "LocalBrain Executive OS (meta workspace)",
      risk: "low",
    },
  ];

  for (const ws of workspaces) {
    for (const root of ws.filesystem_roots) {
      if (!existingRoots.has(root.toLowerCase()) && root.toUpperCase().startsWith("H:\\")) {
        folders.push({
          path: root,
          purpose: `Existing workspace root: ${ws.title}`,
          risk: "medium",
        });
      }
    }
  }

  return {
    root: "H:\\",
    folders,
    notes: [
      "Proposal only — no folders created in LB-OS-018",
      "Align each LivingWorkspace filesystem_root under H:\\",
      "Keep C:\\ for programs; never register C:\\ project roots without override",
    ],
  };
}

export function buildArchiveStrategy(audit: DrivePlacementAudit): ArchiveStrategyDraft {
  const staleCandidates = audit.candidates
    .filter((c) => c.classification === "work_archive" || c.risk === "low")
    .slice(0, 15);

  const highRisk = audit.candidates.filter((c) => c.risk === "high" || c.risk === "critical");

  return {
    principles: [
      "Archive before delete — quarantine path only after approval (LB-OS-010)",
      "Preserve provenance: keep source path in migration log",
      "ChatGPT exports and legacy handoffs → H:\\Archives\\Imports",
      "No cloud sync or Google Drive actions in migration phase 2",
    ],
    candidates: [
      ...highRisk.slice(0, 5).map((c) => ({
        path: c.path,
        strategy: "Relocate to H: work tree before archive",
        risk: c.risk,
        reason: c.reason,
      })),
      ...staleCandidates.map((c) => ({
        path: c.path,
        strategy: "Review for H:\\Archives placement",
        risk: "low" as const,
        reason: "Candidate for cold storage after inventory (LB-OS-019)",
      })),
    ],
    retention_notes: [
      "Duplicate/version decisions deferred to LB-OS-020",
      "Bulk operations forbidden until approval checklist complete",
    ],
  };
}

import { isInventoryGateComplete } from "./fsAudit/auditService.js";

export function buildApprovalChecklist(audit: DrivePlacementAudit): MigrationApprovalItem[] {
  const inventoryDone = isInventoryGateComplete();
  return [
    {
      id: "doctrine-review",
      label: "Review C:/ vs H:/ doctrine dashboard",
      detail: "Confirm team understands two-drive separation before any migration action",
      risk: "low",
      required_before_execution: true,
      completed: false,
    },
    {
      id: "placement-audit",
      label: "Review misplaced asset candidates",
      detail: `${audit.misplaced_count} placement issue(s) flagged from indexed assets and allowed folders`,
      risk: audit.misplaced_count > 0 ? "medium" : "low",
      required_before_execution: true,
      completed: false,
    },
    {
      id: "structure-proposal",
      label: "Approve H:/ workspace structure proposal",
      detail: "Sign off taxonomy before filing system builder (LB-OS-021)",
      risk: "medium",
      required_before_execution: true,
      completed: false,
    },
    {
      id: "archive-strategy",
      label: "Review archive strategy draft",
      detail: "No deletes — archive and quarantine paths only via approval queue",
      risk: "medium",
      required_before_execution: true,
      completed: false,
    },
    {
      id: "inventory-gate",
      label: "Complete filesystem mapping audit (LB-OS-019)",
      detail: inventoryDone
        ? "H: mapping audit complete — inventory gate open for downstream planners"
        : "Gate: no migration tool execution until inventory flag set",
      risk: inventoryDone ? "low" : "high",
      required_before_execution: true,
      completed: inventoryDone,
    },
    {
      id: "no-bulk-ops",
      label: "Acknowledge no bulk moves in LB-OS-018",
      detail: "This slice is planning only — execution requires later slices + Actions queue",
      risk: "critical",
      required_before_execution: true,
      completed: true,
    },
  ];
}
