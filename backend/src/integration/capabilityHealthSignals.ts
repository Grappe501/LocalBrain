import type { CapabilityHealthSignal } from "@localbrain/shared";
import { getMigrationApprovalsOverview } from "../migration/approval/executiveApprovalService.js";
import { getMigrationCutoverOverview } from "../migration/cutover/cutoverService.js";
import { getMigrationPlansOverview } from "../migration/planning/migrationPlanService.js";
import { getMigrationProofOverview } from "../migration/proof/migrationProofService.js";
import { getDigitalLandSurvey } from "../migration/digitalLandSurvey/digitalLandSurveyService.js";
import { getExecutiveWorkspaceArchitecture } from "../migration/workspaceArchitecture/workspaceArchitectureService.js";
import { runFilesystemMappingAudit } from "../migration/fsAudit/auditService.js";

/** Runtime health overlay for capability operational states (LB-OS-026.65) */
export function collectCapabilityHealthSignals(): CapabilityHealthSignal[] {
  const signals: CapabilityHealthSignal[] = [];

  try {
    const audit = runFilesystemMappingAudit({ force: false });
    signals.push({
      capability_id: "CAP-MIG-002",
      healthy: audit.mapping_confidence >= 50,
      detail: `mapping confidence ${audit.mapping_confidence}%`,
    });
  } catch {
    signals.push({ capability_id: "CAP-MIG-002", healthy: false, detail: "audit unavailable" });
  }

  try {
    const arch = getExecutiveWorkspaceArchitecture();
    signals.push({
      capability_id: "CAP-EWA-001",
      healthy: (arch.blueprints?.length ?? 0) > 0,
      detail: `${arch.blueprints?.length ?? 0} blueprints`,
    });
  } catch {
    signals.push({ capability_id: "CAP-EWA-001", healthy: false });
  }

  try {
    const survey = getDigitalLandSurvey();
    signals.push({
      capability_id: "CAP-DLS-001",
      healthy: survey.migration_complexity != null,
      detail: `complexity ${survey.migration_complexity ?? "—"}`,
    });
  } catch {
    signals.push({ capability_id: "CAP-DLS-001", healthy: false });
  }

  try {
    const proof = getMigrationProofOverview();
    const certified = (proof.latest_certificates?.length ?? 0) > 0;
    signals.push({
      capability_id: "CAP-PRF-001",
      healthy: true,
      completed: certified,
      detail: certified ? "certificate present" : "awaiting certification",
    });
  } catch {
    signals.push({ capability_id: "CAP-PRF-001", healthy: false });
  }

  try {
    const plans = getMigrationPlansOverview();
    signals.push({
      capability_id: "CAP-PLN-001",
      healthy: true,
      detail: `${plans.recent_plans?.length ?? 0} plans`,
    });
  } catch {
    signals.push({ capability_id: "CAP-PLN-001", healthy: false });
  }

  try {
    const approvals = getMigrationApprovalsOverview();
    const signed = (approvals.signed_count ?? 0) > 0;
    signals.push({
      capability_id: "CAP-APP-001",
      healthy: true,
      completed: signed,
      detail: signed ? "signed package" : "awaiting approval",
    });
  } catch {
    signals.push({ capability_id: "CAP-APP-001", healthy: false });
  }

  try {
    const cutover = getMigrationCutoverOverview();
    const done = (cutover.completed_count ?? 0) > 0;
    signals.push({
      capability_id: "CAP-CTO-001",
      healthy: true,
      completed: done,
      detail: done ? "cutover completed" : "ready",
    });
  } catch {
    signals.push({ capability_id: "CAP-CTO-001", healthy: false });
  }

  return signals;
}
