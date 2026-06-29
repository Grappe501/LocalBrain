import crypto from "node:crypto";
import { insertProposedAction } from "../../actions/proposalStore.js";
import type { MigrationApprovalPackage } from "@localbrain/shared";

export function createMigrationCutoverAction(
  approval: MigrationApprovalPackage,
  requestedBy: string,
): string {
  const meta = {
    approval_id: approval.approval_id,
    plan_id: approval.plan_id,
    certificate_id: approval.certificate_id,
    workspace_ids: approval.workspace_ids,
    slice_id: "LB-OS-025",
  };

  const row = insertProposedAction({
    action_id: crypto.randomUUID(),
    action_type: "migration_cutover",
    title: approval.title,
    description: `Executive migration cutover approval for ${approval.plan_id}`,
    source_path: null,
    target_path: null,
    proposed_content: JSON.stringify(meta),
    requested_by: requestedBy,
  });

  return row.action_id;
}
