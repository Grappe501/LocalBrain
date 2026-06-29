import { randomUUID } from "node:crypto";
import type {
  MigrationPlan,
  MigrationPlanOperation,
  MigrationPlanRollbackStep,
  MigrationSimulation,
  MigrationSimulationBatch,
  PlanVariantStrategy,
  ProofCertificate,
  ProvenanceChain,
} from "@localbrain/shared";
import { MIGRATION_PLANNER_ID, PLANNING_ENGINE_ID, PLAN_VARIANT_LABELS } from "@localbrain/shared";
import { MIGRATION_PLAN_CORE_RULE } from "@localbrain/shared";
import { evaluateMigrationConstraints } from "./constraintEvaluator.js";
import { buildMigrationObjectives } from "./objectiveModel.js";
import { isReadyForProposal, scorePlanQuality } from "./planQualityScorer.js";
import { allocatePlanId, formatAuditRef, formatSurveyRef } from "./migrate.js";

const VARIANT_OPS: Record<
  PlanVariantStrategy,
  MigrationPlanOperation["kind"][]
> = {
  conservative: [
    "create_folder_structure",
    "copy_documentation",
    "move_source",
    "update_projection",
    "validate_references",
  ],
  balanced: [
    "create_folder_structure",
    "copy_documentation",
    "move_source",
    "update_projection",
    "validate_references",
    "finalize",
    "verify",
  ],
  aggressive: ["create_folder_structure", "move_source", "update_projection", "verify"],
  custom: [
    "create_folder_structure",
    "move_source",
    "update_projection",
    "validate_references",
    "verify",
  ],
};

function filterBatchesForVariant(
  batches: MigrationSimulationBatch[],
  variant: PlanVariantStrategy,
): MigrationSimulationBatch[] {
  const needsTranslation = batches.filter(
    (b) => b.current_projection !== b.recommended_projection,
  );

  if (variant === "conservative") {
    return needsTranslation.filter((b) => b.file_count <= 5000);
  }
  if (variant === "aggressive") {
    return batches.filter((b) => b.file_count > 0 || b.current_projection !== b.recommended_projection);
  }
  return needsTranslation.length > 0 ? needsTranslation : batches.slice(0, Math.max(1, batches.length));
}

function buildOperationsForBatch(
  batch: MigrationSimulationBatch,
  variant: PlanVariantStrategy,
  startSequence: number,
): { operations: MigrationPlanOperation[]; rollback: MigrationPlanRollbackStep[] } {
  const kinds = VARIANT_OPS[variant];
  const operations: MigrationPlanOperation[] = [];
  const rollback: MigrationPlanRollbackStep[] = [];
  const opIds: string[] = [];

  const bytesPerOp = Math.max(1, Math.floor(batch.file_count / kinds.length));
  const secondsPerOp = Math.max(30, Math.min(180, batch.file_count * 2 + 30));

  for (let i = 0; i < kinds.length; i++) {
    const opId = randomUUID();
    opIds.push(opId);
    const depends_on = i === 0 ? [] : [opIds[i - 1]];

    operations.push({
      operation_id: opId,
      kind: kinds[i],
      label: `${kinds[i].replace(/_/g, " ")} — ${batch.title}`,
      workspace_id: batch.workspace_id,
      sequence_order: startSequence + i,
      depends_on,
      estimated_bytes:
        kinds[i] === "move_source" || kinds[i] === "copy_documentation"
          ? batch.file_count * 1024
          : bytesPerOp * 1024,
      estimated_duration_seconds: secondsPerOp,
      rollback_operation_id: null,
    });
  }

  for (const op of operations) {
    rollback.push({
      step_id: randomUUID(),
      label: `Rollback ${op.label}`,
      reverses_operation_id: op.operation_id,
      estimated_duration_seconds: Math.max(15, Math.floor(op.estimated_duration_seconds / 2)),
    });
    op.rollback_operation_id = rollback[rollback.length - 1].step_id;
  }

  return { operations, rollback };
}

function buildMigrationPlanForVariant(
  certificate: ProofCertificate,
  simulation: MigrationSimulation,
  variant: PlanVariantStrategy,
  auditRef: string | null,
  surveyRef: string | null,
): MigrationPlan {
  const planId = allocatePlanId();
  const batches = filterBatchesForVariant(simulation.batches, variant);

  let sequence = 1;
  const allOps: MigrationPlanOperation[] = [];
  const allRollback: MigrationPlanRollbackStep[] = [];

  for (const batch of batches) {
    const { operations, rollback } = buildOperationsForBatch(batch, variant, sequence);
    allOps.push(...operations);
    allRollback.push(...rollback);
    sequence += operations.length;
  }

  const dependency_graph = allOps.map((o) => ({
    operation_id: o.operation_id,
    depends_on: o.depends_on,
  }));

  const execution_order = allOps.map((o) => o.operation_id);
  const total_bytes = allOps.reduce((s, o) => s + o.estimated_bytes, 0);
  const durationSeconds = allOps.reduce((s, o) => s + o.estimated_duration_seconds, 0);
  const rollbackSeconds = allRollback.reduce((s, r) => s + r.estimated_duration_seconds, 0);

  const provenance: ProvenanceChain = {
    audit_ref: auditRef,
    survey_ref: surveyRef,
    certificate_id: certificate.certificate_id,
    simulation_id: certificate.simulation_id,
    plan_id: planId,
    proposal_id: null,
  };

  const partialPlan = {
    plan_id: planId,
    operations: allOps,
    rollback_plan: allRollback,
    workspace_ids: simulation.workspace_ids,
    total_operations: allOps.length,
    total_bytes_moved: total_bytes,
    estimated_duration_minutes: Math.max(1, Math.ceil(durationSeconds / 60)),
    rollback_duration_minutes: Math.max(1, Math.ceil(rollbackSeconds / 60)),
  };

  const objectives = buildMigrationObjectives(simulation, variant, partialPlan);
  const constraints = evaluateMigrationConstraints(certificate, simulation, partialPlan);
  const plan_quality = scorePlanQuality({
    variant,
    total_operations: partialPlan.total_operations,
    total_bytes_moved: partialPlan.total_bytes_moved,
    estimated_duration_minutes: partialPlan.estimated_duration_minutes,
    rollback_duration_minutes: partialPlan.rollback_duration_minutes,
    objectives,
    constraints,
  });

  const ready_for_proposal = isReadyForProposal(plan_quality, constraints);

  return {
    plan_id: planId,
    slice_id: "LB-OS-024",
    engine_id: "ENG-MPL-001",
    planner_id: MIGRATION_PLANNER_ID,
    planning_engine_id: PLANNING_ENGINE_ID,
    read_only: true,
    immutable: true,
    status: "immutable",
    variant_strategy: variant,
    variant_label: PLAN_VARIANT_LABELS[variant],
    certificate_id: certificate.certificate_id,
    simulation_id: certificate.simulation_id,
    provenance,
    workspace_ids: simulation.workspace_ids,
    title: `Migration Plan — ${PLAN_VARIANT_LABELS[variant]}`,
    constraints,
    objectives,
    plan_quality,
    estimated_duration_minutes: partialPlan.estimated_duration_minutes,
    rollback_duration_minutes: partialPlan.rollback_duration_minutes,
    total_operations: partialPlan.total_operations,
    total_bytes_moved: partialPlan.total_bytes_moved,
    operations: allOps,
    execution_order,
    dependency_graph,
    rollback_plan: allRollback,
    ready_for_proposal,
    created_at: new Date().toISOString(),
  };
}

/** Generic Planning Engine — migration implementation */
export const migrationPlanner = {
  planner_id: MIGRATION_PLANNER_ID,
  planning_engine_id: PLANNING_ENGINE_ID,
  core_rule: MIGRATION_PLAN_CORE_RULE,
  generate(
    certificate: ProofCertificate,
    simulation: MigrationSimulation,
    variants: PlanVariantStrategy[] = ["conservative", "balanced", "aggressive"],
  ): MigrationPlan[] {
    const auditRef = formatAuditRef(certificate.evidence.audit_run_id);
    const surveyRef = formatSurveyRef(certificate.evidence.survey_observed_at);

    return variants.map((variant) =>
      buildMigrationPlanForVariant(certificate, simulation, variant, auditRef, surveyRef),
    );
  },
  recommend(plans: MigrationPlan[]): string | null {
    const ready = plans.filter((p) => p.ready_for_proposal);
    if (ready.length === 0) return plans[0]?.plan_id ?? null;
    const balanced = ready.find((p) => p.variant_strategy === "balanced");
    if (balanced) return balanced.plan_id;
    return ready.sort((a, b) => b.plan_quality.percent - a.plan_quality.percent)[0].plan_id;
  },
};

export function buildMigrationPlans(
  certificate: ProofCertificate,
  simulation: MigrationSimulation,
  variants?: PlanVariantStrategy[],
): { plans: MigrationPlan[]; recommended_plan_id: string | null } {
  const v = variants ?? ["conservative", "balanced", "aggressive"];
  const plans = migrationPlanner.generate(certificate, simulation, v);
  return { plans, recommended_plan_id: migrationPlanner.recommend(plans) };
}
