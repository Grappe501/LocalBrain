import type {
  EvidenceProvenance,
  MigrationProofOverview,
  MigrationProofSimulateRequest,
  MigrationProofSimulateResponse,
  ProofCertificate,
  ProofContext,
} from "@localbrain/shared";
import {
  PROOF_CERTIFICATION_THRESHOLDS,
  PROOF_CORE_RULE,
} from "@localbrain/shared";
import { getLatestFilesystemAudit } from "../fsAudit/auditService.js";
import { getDigitalLandSurvey } from "../digitalLandSurvey/digitalLandSurveyService.js";
import { getExecutiveWorkspaceArchitecture } from "../workspaceArchitecture/workspaceArchitectureService.js";
import { buildWorkspaceBlueprint } from "../workspaceArchitecture/blueprintEngine.js";
import { listWorkspaces } from "../../workspaces/workspaceRegistry.js";
import {
  aggregateProofScore,
  certificateResultFromScore,
  proofDimensionCatalog,
} from "./proofEngine.js";
import {
  buildMigrationSimulation,
  buildMigrationSimulationBatches,
} from "./migrationSimulationEngine.js";
import {
  allocateCertificateId,
  allocateSimulationId,
  listRecentCertificates,
  saveCertificateRecord,
  saveSimulationRecord,
} from "./migrate.js";

export const MIGRATION_PROOF_ENGINE_ID = "ENG-PRF-001";

const GUARDRAILS = [
  "Read-only proof and simulation",
  "Deterministic proof only — no LLM scoring",
  "No file moves · deletes · proposals · execution",
  "No cloud sync · no provider runtime",
  "Certification gates LB-OS-024 proposal generation",
];

function buildProofContext(
  workspaceIds: string[],
  batches: ReturnType<typeof buildMigrationSimulationBatches>,
  audit: ReturnType<typeof getLatestFilesystemAudit>,
  survey: ReturnType<typeof getDigitalLandSurvey>,
  architectureObservedAt: string | null,
): ProofContext {
  const hDrive = survey.drive_utilization.find((d) => d.drive.toUpperCase().startsWith("H"));

  return {
    workspace_ids: workspaceIds,
    simulation_batches: batches,
    audit_run_id: audit?.run_id ?? null,
    mapping_confidence_percent: audit?.mapping_confidence ?? null,
    survey_observed_at: survey.observed_at,
    architecture_observed_at: architectureObservedAt,
    evidence_confidence_percent: survey.mapping_confidence_percent,
    migration_complexity_overall: survey.migration_complexity.overall_score,
    duplicate_region_count: survey.duplicate_storage_regions.length,
    orphan_workspace_count: survey.orphaned_data.orphan_workspaces.length,
    drive_headroom_label: hDrive?.headroom_label ?? null,
  };
}

function buildEvidenceProvenance(
  audit: ReturnType<typeof getLatestFilesystemAudit>,
  survey: ReturnType<typeof getDigitalLandSurvey>,
  architectureObservedAt: string | null,
): EvidenceProvenance {
  return {
    audit_run_id: audit?.run_id ?? null,
    survey_observed_at: survey.observed_at,
    architecture_observed_at: architectureObservedAt,
    evidence_confidence_percent: survey.mapping_confidence_percent,
  };
}

export function getMigrationProofOverview(): MigrationProofOverview {
  const audit = getLatestFilesystemAudit();
  const survey = getDigitalLandSurvey();
  const latestJson = listRecentCertificates(5);
  const latest_certificates = latestJson.map((j) => JSON.parse(j) as ProofCertificate);

  return {
    slice_id: "LB-OS-023",
    engine_id: MIGRATION_PROOF_ENGINE_ID,
    read_only: true,
    core_rule: PROOF_CORE_RULE,
    guardrails: GUARDRAILS,
    proof_dimensions: proofDimensionCatalog(),
    evidence_confidence_percent: survey.mapping_confidence_percent,
    latest_certificates,
    certification_thresholds: {
      certified_min_percent: PROOF_CERTIFICATION_THRESHOLDS.certified_min_percent,
      conditional_min_percent: PROOF_CERTIFICATION_THRESHOLDS.conditional_min_percent,
    },
    observed_at: new Date().toISOString(),
  };
}

export function runMigrationProofSimulation(
  request: MigrationProofSimulateRequest = {},
): MigrationProofSimulateResponse {
  const audit = getLatestFilesystemAudit();
  const survey = getDigitalLandSurvey();
  const architecture = getExecutiveWorkspaceArchitecture();
  const allWorkspaces = listWorkspaces().filter((ws) => !ws.flags.hidden);

  const selected =
    request.workspace_ids && request.workspace_ids.length > 0
      ? allWorkspaces.filter((ws) => request.workspace_ids!.includes(ws.workspace_id))
      : allWorkspaces.filter((ws) => {
          const bp = buildWorkspaceBlueprint(ws, audit);
          return bp.confidence_percent < 98 || bp.current_projections.length === 0;
        });

  const workspaceIds = selected.map((ws) => ws.workspace_id);
  const blueprints = selected.map((ws) => buildWorkspaceBlueprint(ws, audit));
  const batches = buildMigrationSimulationBatches(selected, blueprints);

  const simulationId = allocateSimulationId();
  let simulation = buildMigrationSimulation(simulationId, batches);

  const ctx = buildProofContext(
    workspaceIds,
    batches,
    audit,
    survey,
    architecture.observed_at,
  );
  const proof_score = aggregateProofScore(ctx);
  const result = certificateResultFromScore(proof_score.percent);
  const certificateId = allocateCertificateId();

  const certificate: ProofCertificate = {
    certificate_id: certificateId,
    simulation_id: simulationId,
    slice_id: "LB-OS-023",
    engine_id: MIGRATION_PROOF_ENGINE_ID,
    read_only: true,
    created_at: new Date().toISOString(),
    proof_score,
    evidence: buildEvidenceProvenance(audit, survey, architecture.observed_at),
    workspace_ids: workspaceIds,
    blueprint_refs: blueprints.map((b) => ({
      workspace_id: b.workspace_id,
      title: b.title,
      confidence_percent: b.confidence_percent,
    })),
    result,
    core_rule: PROOF_CORE_RULE,
    plan_eligible: result === "certified",
    proposal_eligible: result === "certified",
  };

  simulation = { ...simulation, certificate_id: certificateId };

  saveSimulationRecord(simulationId, certificateId, JSON.stringify(simulation));
  saveCertificateRecord(
    certificateId,
    simulationId,
    proof_score.percent,
    result,
    JSON.stringify(certificate),
  );

  return { simulation, certificate };
}
