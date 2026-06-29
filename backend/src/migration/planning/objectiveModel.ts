import type {
  MigrationPlan,
  MigrationSimulation,
  PlanObjective,
  PlanVariantStrategy,
} from "@localbrain/shared";

export function buildMigrationObjectives(
  simulation: MigrationSimulation,
  variant: PlanVariantStrategy,
  plan: Pick<MigrationPlan, "total_operations" | "total_bytes_moved" | "rollback_plan">,
): PlanObjective[] {
  const translationCount = simulation.impact_summary.projections_changed;
  const fragmentationReduction =
    translationCount > 0
      ? Math.min(100, 40 + translationCount * 15)
      : 30;

  const duplicateReduction =
    simulation.batches.length > 1
      ? Math.min(90, 50 + simulation.batches.length * 8)
      : 45;

  const pathShortening =
    simulation.batches.filter((b) => b.current_projection !== b.recommended_projection).length > 0
      ? 75
      : 40;

  const minimizeOps =
    variant === "aggressive"
      ? Math.max(50, 100 - plan.total_operations * 2)
      : variant === "conservative"
        ? 70
        : 82;

  const rollbackPreserve = plan.rollback_plan.length > 0 ? 95 : 20;

  const archiveImprovement =
    variant === "aggressive" ? 80 : variant === "balanced" ? 65 : 50;

  return [
    {
      objective_id: "reduce-fragmentation",
      label: "Reduce fragmentation",
      priority: "primary",
      fulfillment_percent: fragmentationReduction,
    },
    {
      objective_id: "reduce-duplicates",
      label: "Reduce duplicate storage regions",
      priority: "secondary",
      fulfillment_percent: duplicateReduction,
    },
    {
      objective_id: "shorten-paths",
      label: "Shorten paths to H:\\Projects hierarchy",
      priority: "secondary",
      fulfillment_percent: pathShortening,
    },
    {
      objective_id: "improve-archive",
      label: "Improve archive structure",
      priority: "secondary",
      fulfillment_percent: archiveImprovement,
    },
    {
      objective_id: "minimize-operations",
      label: "Minimize operations",
      priority: "secondary",
      fulfillment_percent: minimizeOps,
    },
    {
      objective_id: "preserve-rollback",
      label: "Preserve rollback",
      priority: "secondary",
      fulfillment_percent: rollbackPreserve,
    },
  ];
}

export function averageObjectiveFulfillment(objectives: PlanObjective[]): number {
  if (objectives.length === 0) return 0;
  const primary = objectives.filter((o) => o.priority === "primary");
  const secondary = objectives.filter((o) => o.priority === "secondary");
  const primaryAvg =
    primary.length > 0
      ? primary.reduce((s, o) => s + o.fulfillment_percent, 0) / primary.length
      : 0;
  const secondaryAvg =
    secondary.length > 0
      ? secondary.reduce((s, o) => s + o.fulfillment_percent, 0) / secondary.length
      : 0;
  return Math.round(primaryAvg * 0.55 + secondaryAvg * 0.45);
}
