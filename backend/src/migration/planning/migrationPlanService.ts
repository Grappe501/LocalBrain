import type {
  MigrationPlan,
  MigrationPlanGenerateRequest,
  MigrationPlanGenerateResponse,
  MigrationPlanOverview,
  MigrationSimulation,
  ProofCertificate,
} from "@localbrain/shared";
import { DEFAULT_MIGRATION_CONSTRAINTS, MIGRATION_PLAN_CORE_RULE } from "@localbrain/shared";
import { getCertificateById } from "../proof/migrate.js";
import { getDatabase } from "../../db/database.js";
import { buildMigrationPlans } from "./migrationPlanner.js";
import { getPlanById, listRecentPlans, savePlanRecord } from "./migrate.js";

export const MIGRATION_PLANNING_ENGINE_ID = "ENG-MPL-001";

const GUARDRAILS = [
  "Read-only planning — no execution",
  "Deterministic planning only — no LLM decisions",
  "No proposals · approvals · file moves · deletes · mkdir",
  "No provider runtime · no cloud sync",
  "Plans require certified Proof Certificate",
];

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

export function getMigrationPlansOverview(): MigrationPlanOverview {
  return {
    slice_id: "LB-OS-024",
    engine_id: MIGRATION_PLANNING_ENGINE_ID,
    planning_engine_id: "ENG-PLN-001",
    read_only: true,
    core_rule: MIGRATION_PLAN_CORE_RULE,
    guardrails: GUARDRAILS,
    default_constraints: DEFAULT_MIGRATION_CONSTRAINTS.map((c) => c.label),
    variant_strategies: ["conservative", "balanced", "aggressive"],
    recent_plans: listRecentPlans(8),
    observed_at: new Date().toISOString(),
  };
}

export function generateMigrationPlans(
  request: MigrationPlanGenerateRequest,
): MigrationPlanGenerateResponse {
  const certificate = loadCertificate(request.certificate_id);
  if (!certificate) {
    throw new Error(`Certificate not found: ${request.certificate_id}`);
  }
  if (!certificate.plan_eligible || certificate.result !== "certified") {
    throw new Error(
      `Certificate ${request.certificate_id} is not plan-eligible (result: ${certificate.result})`,
    );
  }

  const simulation = getSimulationById(certificate.simulation_id);
  if (!simulation) {
    throw new Error(`Simulation not found: ${certificate.simulation_id}`);
  }

  const variants = request.variants ?? ["conservative", "balanced", "aggressive"];
  const { plans, recommended_plan_id } = buildMigrationPlans(certificate, simulation, variants);

  for (const plan of plans) {
    savePlanRecord(plan);
  }

  return { plans, recommended_plan_id };
}

export function getMigrationPlanById(planId: string): MigrationPlan | null {
  return getPlanById(planId);
}
