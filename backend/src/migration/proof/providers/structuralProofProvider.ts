import type { ProofContext } from "@localbrain/shared";
import { buildDimensionResult, check } from "../proofUtils.js";

const MAX = 20;

export const structuralProofProvider = {
  id: "structural" as const,
  label: "Structural Integrity",
  max_points: MAX,
  evaluate(ctx: ProofContext) {
    const batches = ctx.simulation_batches;
    const checks = [
      check(
        "struct-batches",
        "Simulation batches present",
        batches.length > 0,
        batches.length > 0 ? `${batches.length} batch(es) defined` : "No migration batches to evaluate",
      ),
      check(
        "struct-h-projects",
        "Recommended paths follow H:\\Projects hierarchy",
        batches.every((b) => /^H:\\Projects\\/i.test(b.recommended_projection)),
        "Recommended projections must align with organization tree layout",
        batches.filter((b) => /^H:\\Projects\\/i.test(b.recommended_projection)).length,
      ),
      check(
        "struct-translation-needed",
        "Projection translation identified",
        batches.some((b) => b.current_projection !== b.recommended_projection),
        "At least one workspace needs projection translation",
        batches.filter((b) => b.current_projection !== b.recommended_projection).length,
        true,
      ),
      check(
        "struct-no-duplicate-selection",
        "No overlapping workspace batch selection",
        ctx.duplicate_region_count === 0 || batches.length <= 1,
        ctx.duplicate_region_count > 0
          ? `${ctx.duplicate_region_count} duplicate region(s) — resolve before migration`
          : "No duplicate storage regions among selected workspaces",
        ctx.duplicate_region_count,
        ctx.duplicate_region_count > 0,
      ),
    ];
    return buildDimensionResult("structural", this.label, MAX, checks);
  },
};
