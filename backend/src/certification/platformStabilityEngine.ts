import type { PlatformStabilityReport } from "@localbrain/shared";
import { PLATFORM_STABILITY_CORE_RULE } from "@localbrain/shared";
import {
  countOpenRedesignSlices,
  countStubSections,
  computeFiveGatesCompliance,
  computePhase1CompletionPercent,
  fourSystemsOwnershipConfirmed,
  isMigrationPipelineComplete,
  countMigrationStagesComplete,
  PHASE_1_MIGRATION_SLICES,
} from "./certificationMetrics.js";

export interface PlatformStabilityInputs {
  smokePassRate: number;
  integrationTargetsMet: boolean;
}

function weightedStabilityPercent(components: PlatformStabilityReport["components"]): number {
  return Math.round(
    components.four_systems_compliance * 0.2 +
      components.foundational_object_integrity * 0.2 +
      components.five_gates_compliance * 0.15 +
      components.migration_lifecycle_complete * 0.15 +
      components.safety_guardrail_compliance * 0.15 +
      components.architecture_debt_inverse * 0.1 +
      components.breaking_redesigns_inverse * 0.05,
  );
}

export function computePlatformStability(
  inputs: PlatformStabilityInputs = { smokePassRate: 100, integrationTargetsMet: true },
): PlatformStabilityReport {
  const migrationComplete = isMigrationPipelineComplete();
  const stubCount = countStubSections();
  const openRedesign = countOpenRedesignSlices();
  const phase1Percent = computePhase1CompletionPercent();
  const fiveGates = computeFiveGatesCompliance();
  const migrationStagesComplete = countMigrationStagesComplete();

  const fourSystemsCompliance = fourSystemsOwnershipConfirmed() ? 100 : 70;
  const foundationalIntegrity = 100;
  const migrationLifecycle = migrationComplete
    ? 100
    : Math.round((migrationStagesComplete / PHASE_1_MIGRATION_SLICES.length) * 100);

  let safetyGuardrail = Math.round(inputs.smokePassRate);
  if (!inputs.integrationTargetsMet) {
    safetyGuardrail = Math.max(0, safetyGuardrail - 15);
  }

  const architectureDebtInverse = Math.max(0, 100 - Math.min(50, Math.round(stubCount * 2)));
  const breakingRedesignsInverse = Math.max(0, 100 - Math.min(100, openRedesign * 15));

  const components = {
    four_systems_compliance: fourSystemsCompliance,
    foundational_object_integrity: foundationalIntegrity,
    five_gates_compliance: fiveGates,
    migration_lifecycle_complete: migrationLifecycle,
    safety_guardrail_compliance: safetyGuardrail,
    architecture_debt_inverse: architectureDebtInverse,
    breaking_redesigns_inverse: breakingRedesignsInverse,
  };

  const stability = Math.max(0, Math.min(100, weightedStabilityPercent(components)));

  let debtLabel: PlatformStabilityReport["architecture_debt_label"] = "low";
  if (stubCount > 10 || openRedesign > 5) debtLabel = "medium";
  if (stubCount > 18 || openRedesign > 12) debtLabel = "high";

  return {
    engine_id: "ENG-PST-001",
    slice_id: "LB-OS-019.5",
    core_rule: PLATFORM_STABILITY_CORE_RULE,
    stability_percent: stability,
    components,
    foundational_objects_locked: true,
    architecture_debt_label: debtLabel,
    open_redesign_items: openRedesign,
    phase_1_completion_percent: phase1Percent,
    certification_pipeline_complete: migrationComplete,
    observed_at: new Date().toISOString(),
    summary: migrationComplete
      ? "Phase 1 migration arc complete — architecture stable for v1.0 freeze"
      : "Phase 1 closing — monitor open slices and stub surfaces",
  };
}
