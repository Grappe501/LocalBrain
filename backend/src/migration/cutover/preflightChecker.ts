import type {
  CutoverPreflightCheck,
  CutoverPreflightResult,
  MigrationApprovalPackage,
  MigrationPlan,
  MigrationSimulation,
  ProofCertificate,
} from "@localbrain/shared";
import { getProposedAction } from "../../actions/proposalStore.js";
import { getCertificateById } from "../proof/migrate.js";
import { getDatabase } from "../../db/database.js";
import { findActiveCutoverRun } from "./migrate.js";

function getSimulationById(simulationId: string): MigrationSimulation | null {
  const row = getDatabase()
    .prepare(`SELECT report_json FROM migration_proof_simulations WHERE simulation_id = ?`)
    .get(simulationId) as { report_json: string } | undefined;
  if (!row?.report_json) return null;
  return JSON.parse(row.report_json) as MigrationSimulation;
}

function loadCertificate(certificateId: string): ProofCertificate | null {
  const json = getCertificateById(certificateId);
  if (!json) return null;
  return JSON.parse(json) as ProofCertificate;
}

export function runCutoverPreflight(
  approval: MigrationApprovalPackage,
  plan: MigrationPlan,
): CutoverPreflightResult {
  const checks: CutoverPreflightCheck[] = [];

  checks.push({
    check_id: "approval-ready",
    label: "Approval package ready_for_cutover",
    status: approval.ready_for_cutover && approval.status === "signed" ? "pass" : "fail",
    detail:
      approval.ready_for_cutover && approval.status === "signed"
        ? `Signed approval ${approval.approval_id}`
        : `Approval status: ${approval.status}, ready: ${approval.ready_for_cutover}`,
  });

  const action = approval.action_id ? getProposedAction(approval.action_id) : null;
  checks.push({
    check_id: "action-approved",
    label: "Linked migration_cutover action approved",
    status:
      action?.action_type === "migration_cutover" && action.status === "approved" ? "pass" : "fail",
    detail: action
      ? `Action ${action.action_id} · ${action.action_type} · ${action.status}`
      : "No linked action",
  });

  checks.push({
    check_id: "plan-provenance",
    label: "Certified plan provenance",
    status:
      plan.certificate_id === approval.certificate_id &&
      plan.provenance.certificate_id === approval.certificate_id
        ? "pass"
        : "fail",
    detail: `Plan ${plan.plan_id} · cert ${plan.certificate_id}`,
  });

  checks.push({
    check_id: "rollback-package",
    label: "Rollback package present on plan",
    status: plan.rollback_plan.length > 0 ? "pass" : "fail",
    detail: `${plan.rollback_plan.length} rollback steps`,
  });

  const certificate = loadCertificate(plan.certificate_id);
  checks.push({
    check_id: "certificate-certified",
    label: "Certificate certified and plan-eligible",
    status:
      certificate?.result === "certified" && certificate.plan_eligible ? "pass" : "fail",
    detail: certificate ? `Result: ${certificate.result}` : "Certificate missing",
  });

  const simulation = getSimulationById(plan.simulation_id);
  checks.push({
    check_id: "simulation-present",
    label: "Simulation batch data available",
    status: simulation && simulation.batches.length > 0 ? "pass" : "fail",
    detail: simulation ? `${simulation.batches.length} batches` : "Simulation missing",
  });

  const active = findActiveCutoverRun();
  checks.push({
    check_id: "no-active-run",
    label: "No other cutover run in progress",
    status: active ? "fail" : "pass",
    detail: active ? `Active run ${active.cutover_id}` : "No concurrent run",
  });

  const ready = checks.every((c) => c.status === "pass");

  return {
    approval_id: approval.approval_id,
    plan_id: plan.plan_id,
    ready,
    checks,
    observed_at: new Date().toISOString(),
  };
}
