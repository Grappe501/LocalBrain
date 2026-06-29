import type { MigrationPlannerOverview } from "@localbrain/shared";
import { DRIVE_DOCTRINE } from "./driveDoctrine.js";
import { buildVolumeSummaries, runPlacementAudit } from "./placementAudit.js";
import {
  buildApprovalChecklist,
  buildArchiveStrategy,
  buildHStructureProposal,
  buildMigrationArc,
} from "./planGenerator.js";

const GUARDRAILS = [
  "Read-only planning",
  "No file moves",
  "No deletes",
  "No cleanup execution",
  "No drive reorganization",
  "No cloud sync",
  "No Google Drive actions",
  "No bulk operations",
];

export function getMigrationPlannerOverview(): MigrationPlannerOverview {
  const placement_audit = runPlacementAudit();
  const volumes = buildVolumeSummaries(placement_audit);

  return {
    slice_id: "LB-OS-018",
    read_only: true,
    planning_only: true,
    inventory_gate: false,
    doctrine: {
      c_drive_role: DRIVE_DOCTRINE.c_drive_role,
      h_drive_role: DRIVE_DOCTRINE.h_drive_role,
      rules: [...DRIVE_DOCTRINE.rules],
      localbrain_default: DRIVE_DOCTRINE.localbrain_default,
      migration_sequence: [...DRIVE_DOCTRINE.migration_sequence],
    },
    volumes,
    placement_audit,
    migration_arc: buildMigrationArc(),
    structure_proposal: buildHStructureProposal(),
    archive_strategy: buildArchiveStrategy(placement_audit),
    approval_checklist: buildApprovalChecklist(placement_audit),
    core_rule:
      "Inventory → Map → Diagnosis → Recommendations → Approval checklist → later action",
    guardrails: GUARDRAILS,
    observed_at: new Date().toISOString(),
  };
}
