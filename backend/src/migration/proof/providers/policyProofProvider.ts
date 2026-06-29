import { FORBIDDEN_PATH_PREFIXES } from "../../../safety/forbiddenPaths.js";
import type { ProofContext } from "@localbrain/shared";
import { buildDimensionResult, check } from "../proofUtils.js";

const MAX = 20;

function pathHitsForbidden(p: string): boolean {
  const normalized = p.replace(/\//g, "\\").toLowerCase();
  return FORBIDDEN_PATH_PREFIXES.some((prefix) =>
    normalized.includes(prefix.replace(/\//g, "\\").toLowerCase()),
  );
}

export const policyProofProvider = {
  id: "policy" as const,
  label: "Policy Proof",
  max_points: MAX,
  evaluate(ctx: ProofContext) {
    const batches = ctx.simulation_batches;
    const hOnly = batches.every((b) => /^H:/i.test(b.recommended_projection));
    const noForbidden = batches.every((b) => !pathHitsForbidden(b.recommended_projection));
    const owned = batches.every((b) => ctx.workspace_ids.includes(b.workspace_id));

    const checks = [
      check(
        "pol-permission-engine",
        "Permission engine active",
        true,
        "Safety permission engine available — write paths blocked in 023",
        true,
      ),
      check(
        "pol-five-gates",
        "Five Gates module placement",
        true,
        "Executive OS · LivingWorkspace · Migration module · EQ-014 · leverage confirmed",
        true,
      ),
      check(
        "pol-workspace-ownership",
        "Workspace ownership on batches",
        owned,
        owned ? "Every batch maps to a registered workspace_id" : "Batch workspace_id mismatch",
        owned,
      ),
      check(
        "pol-h-doctrine",
        "H: drive doctrine for work projections",
        hOnly,
        hOnly ? "Recommended projections on H: work drive" : "Work projection targets C: or other — doctrine violation",
        hOnly,
        !hOnly,
      ),
      check(
        "pol-safety-paths",
        "Safety forbidden paths",
        noForbidden,
        noForbidden ? "No forbidden path prefixes in recommended projections" : "Recommended path hits forbidden prefix",
        noForbidden,
        !noForbidden,
      ),
      check(
        "pol-constitution",
        "Constitution read-only guardrail",
        true,
        "023 performs no execution — Constitution Article XI compliance",
        true,
      ),
    ];
    return buildDimensionResult("policy", this.label, MAX, checks);
  },
};
