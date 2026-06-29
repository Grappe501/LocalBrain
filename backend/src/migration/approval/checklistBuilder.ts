import type { MigrationPlan, SignOffChecklistItem } from "@localbrain/shared";

export function buildSignOffChecklist(plan: MigrationPlan): SignOffChecklistItem[] {
  const workspaceList = plan.workspace_ids.join(", ") || "none";
  return [
    {
      item_id: "review-plan",
      label: "I have reviewed the migration plan operations and execution order",
      required: true,
      checked: false,
    },
    {
      item_id: "review-constraints",
      label: `I have reviewed all ${plan.constraints.length} plan constraints`,
      required: true,
      checked: false,
    },
    {
      item_id: "review-workspaces",
      label: `Workspace scope confirmed: ${workspaceList}`,
      required: true,
      checked: false,
    },
    {
      item_id: "certified-provenance",
      label: `Certified provenance chain verified through ${plan.certificate_id}`,
      required: true,
      checked: false,
    },
    {
      item_id: "no-auto-execution",
      label: "I understand this approval does not execute migration — cutover is LB-OS-026",
      required: true,
      checked: false,
    },
  ];
}
