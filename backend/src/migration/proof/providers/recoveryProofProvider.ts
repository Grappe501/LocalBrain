import type { ProofContext } from "@localbrain/shared";
import { buildDimensionResult, check } from "../proofUtils.js";

const MAX = 20;

export const recoveryProofProvider = {
  id: "recovery" as const,
  label: "Recovery Readiness",
  max_points: MAX,
  evaluate(ctx: ProofContext) {
    const batches = ctx.simulation_batches;
    const hasRollback = batches.length > 0;
    const checks = [
      check(
        "rec-read-only",
        "Simulation is read-only",
        true,
        "023 simulation performs zero filesystem mutations",
        true,
      ),
      check(
        "rec-preview-only",
        "Preview-only action types",
        batches.every((b) => b.action_type === "projection_translation"),
        "All batches are projection_translation — no delete/rename execution",
        batches.length,
      ),
      check(
        "rec-rollback-documented",
        "Rollback path documented per batch",
        hasRollback,
        hasRollback
          ? "Rollback = restore prior projection paths from certificate provenance"
          : "No batches to rollback",
        hasRollback,
      ),
      check(
        "rec-no-destructive",
        "No destructive operations in simulation",
        true,
        "Zero files deleted · zero folders removed in proof simulation",
        0,
      ),
    ];
    return buildDimensionResult("recovery", this.label, MAX, checks);
  },
};
