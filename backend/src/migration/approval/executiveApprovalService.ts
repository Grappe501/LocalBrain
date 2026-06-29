import type {
  MigrationApprovalCreateRequest,
  MigrationApprovalCreateResponse,
  MigrationApprovalOverview,
  MigrationApprovalPackage,
  MigrationApprovalRejectRequest,
  MigrationApprovalSignRequest,
  MigrationPlan,
} from "@localbrain/shared";
import {
  MIGRATION_APPROVAL_CORE_RULE,
  MIGRATION_APPROVAL_ENGINE_ID,
} from "@localbrain/shared";
import { approveAction, rejectAction } from "../../actions/executorService.js";
import { getPlanById } from "../planning/migrate.js";
import { buildSignOffChecklist } from "./checklistBuilder.js";
import { createMigrationCutoverAction } from "./actionBridge.js";
import {
  allocateApprovalId,
  countApprovalsByStatus,
  findPendingApprovalForPlan,
  getApprovalById,
  listRecentApprovals,
  saveApprovalRecord,
  updateApprovalRecord,
} from "./migrate.js";

const GUARDRAILS = [
  "No execution — approval package only",
  "No file moves · deletes · mkdir · provider runtime actions",
  "No bypassing LB-OS-010 Actions approval gates",
  "No approval without certified plan provenance",
  "Human sign-off required — checklist · risk · rollback acknowledgement",
];

function validatePlanForApproval(plan: MigrationPlan): void {
  if (!plan.ready_for_proposal) {
    throw new Error(`Plan ${plan.plan_id} is not ready for proposal`);
  }
  if (!plan.provenance.certificate_id) {
    throw new Error(`Plan ${plan.plan_id} missing certificate provenance`);
  }
  if (plan.provenance.certificate_id !== plan.certificate_id) {
    throw new Error(`Plan ${plan.plan_id} certificate provenance mismatch`);
  }
  const failing = plan.constraints.filter((c) => c.status === "fail");
  if (failing.length > 0) {
    throw new Error(`Plan ${plan.plan_id} has failing constraints`);
  }
}

function buildApprovalPackage(
  plan: MigrationPlan,
  approvalId: string,
  requestedBy: string,
): MigrationApprovalPackage {
  const now = new Date().toISOString();
  return {
    approval_id: approvalId,
    slice_id: "LB-OS-025",
    engine_id: MIGRATION_APPROVAL_ENGINE_ID,
    actions_engine_ref: "LB-OS-010",
    read_only: true,
    status: "pending",
    plan_id: plan.plan_id,
    certificate_id: plan.certificate_id,
    workspace_ids: plan.workspace_ids,
    title: `Approve migration: ${plan.title}`,
    provenance: {
      audit_ref: plan.provenance.audit_ref,
      survey_ref: plan.provenance.survey_ref,
      certificate_id: plan.provenance.certificate_id,
      simulation_id: plan.provenance.simulation_id,
      plan_id: plan.plan_id,
      approval_id: approvalId,
    },
    checklist: buildSignOffChecklist(plan),
    risk_acknowledgement: {
      risk_label: plan.plan_quality.risk_label,
      plan_quality_percent: plan.plan_quality.percent,
      total_operations: plan.total_operations,
      estimated_duration_minutes: plan.estimated_duration_minutes,
      acknowledged: false,
      acknowledged_at: null,
    },
    rollback_acknowledgement: {
      rollback_duration_minutes: plan.rollback_duration_minutes,
      rollback_step_count: plan.rollback_plan.length,
      acknowledged: false,
      acknowledged_at: null,
    },
    plan_summary: {
      plan_quality_percent: plan.plan_quality.percent,
      risk_label: plan.plan_quality.risk_label,
      total_operations: plan.total_operations,
      estimated_duration_minutes: plan.estimated_duration_minutes,
      rollback_duration_minutes: plan.rollback_duration_minutes,
      variant_strategy: plan.variant_strategy,
      variant_label: plan.variant_label,
    },
    action_id: null,
    ready_for_cutover: false,
    signed_at: null,
    signed_by: null,
    rejected_at: null,
    rejected_by: null,
    rejection_reason: null,
    created_at: now,
  };
}

export function getMigrationApprovalsOverview(): MigrationApprovalOverview {
  const recent = listRecentApprovals(12);
  return {
    slice_id: "LB-OS-025",
    engine_id: MIGRATION_APPROVAL_ENGINE_ID,
    actions_engine_ref: "LB-OS-010",
    read_only: true,
    core_rule: MIGRATION_APPROVAL_CORE_RULE,
    guardrails: GUARDRAILS,
    recent_approvals: recent,
    pending_count: countApprovalsByStatus("pending"),
    signed_count: countApprovalsByStatus("signed"),
    observed_at: new Date().toISOString(),
  };
}

export function createApprovalFromPlan(
  request: MigrationApprovalCreateRequest,
): MigrationApprovalCreateResponse {
  const plan = getPlanById(request.plan_id);
  if (!plan) {
    throw new Error(`Plan not found: ${request.plan_id}`);
  }

  validatePlanForApproval(plan);

  const existing = findPendingApprovalForPlan(plan.plan_id);
  if (existing) {
    throw new Error(
      `Pending approval already exists for plan ${plan.plan_id}: ${existing.approval_id}`,
    );
  }

  const approvalId = allocateApprovalId();
  const approval = buildApprovalPackage(
    plan,
    approvalId,
    request.requested_by ?? "steve",
  );

  const actionId = createMigrationCutoverAction(
    approval,
    request.requested_by ?? "steve",
  );
  approval.action_id = actionId;

  saveApprovalRecord(approval);
  return { approval };
}

export function signMigrationApproval(
  approvalId: string,
  request: MigrationApprovalSignRequest,
): MigrationApprovalPackage {
  const approval = getApprovalById(approvalId);
  if (!approval) {
    throw new Error(`Approval not found: ${approvalId}`);
  }
  if (approval.status !== "pending") {
    throw new Error(`Approval ${approvalId} is not pending (status: ${approval.status})`);
  }

  if (!request.risk_acknowledged) {
    throw new Error("Risk acknowledgement required");
  }
  if (!request.rollback_acknowledged) {
    throw new Error("Rollback acknowledgement required");
  }

  const checklistMap = new Map(request.checklist.map((c) => [c.item_id, c.checked]));
  const updatedChecklist = approval.checklist.map((item) => ({
    ...item,
    checked: checklistMap.get(item.item_id) ?? false,
  }));

  const missingRequired = updatedChecklist.filter((item) => item.required && !item.checked);
  if (missingRequired.length > 0) {
    throw new Error(
      `Required checklist items not checked: ${missingRequired.map((i) => i.item_id).join(", ")}`,
    );
  }

  const now = new Date().toISOString();
  const signed: MigrationApprovalPackage = {
    ...approval,
    status: "signed",
    checklist: updatedChecklist,
    risk_acknowledgement: {
      ...approval.risk_acknowledgement,
      acknowledged: true,
      acknowledged_at: now,
    },
    rollback_acknowledgement: {
      ...approval.rollback_acknowledgement,
      acknowledged: true,
      acknowledged_at: now,
    },
    ready_for_cutover: true,
    signed_at: now,
    signed_by: request.signed_by,
  };

  if (!signed.action_id) {
    throw new Error("Approval missing linked LB-OS-010 action");
  }

  const actionRow = approveAction(signed.action_id);
  if (!actionRow) {
    throw new Error(`Failed to approve linked action ${signed.action_id}`);
  }

  updateApprovalRecord(signed);
  return signed;
}

export function rejectMigrationApproval(
  approvalId: string,
  request: MigrationApprovalRejectRequest,
): MigrationApprovalPackage {
  const approval = getApprovalById(approvalId);
  if (!approval) {
    throw new Error(`Approval not found: ${approvalId}`);
  }
  if (approval.status !== "pending") {
    throw new Error(`Approval ${approvalId} is not pending (status: ${approval.status})`);
  }

  const now = new Date().toISOString();
  const reason = request.reason ?? "Executive rejected migration cutover";

  if (approval.action_id) {
    const row = rejectAction(approval.action_id, reason);
    if (!row) {
      throw new Error(`Failed to reject linked action ${approval.action_id}`);
    }
  }

  const rejected: MigrationApprovalPackage = {
    ...approval,
    status: "rejected",
    ready_for_cutover: false,
    rejected_at: now,
    rejected_by: request.rejected_by ?? "steve",
    rejection_reason: reason,
  };

  updateApprovalRecord(rejected);
  return rejected;
}

export function getMigrationApprovalById(approvalId: string): MigrationApprovalPackage | null {
  return getApprovalById(approvalId);
}
