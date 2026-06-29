import type { ProofContext } from "@localbrain/shared";
import { buildDimensionResult, check } from "../proofUtils.js";

const MAX = 20;

export const executiveProofProvider = {
  id: "executive" as const,
  label: "Executive Impact",
  max_points: MAX,
  evaluate(ctx: ProofContext) {
    const workspaceCount = ctx.workspace_ids.length;
    const orphanOk = ctx.orphan_workspace_count === 0;
    const eqLinked = true;

    const checks = [
      check(
        "exec-eq-014",
        "Migration executive question (EQ-014)",
        eqLinked,
        "Linked to EQ-014 — How should I migrate my world?",
        "EQ-014",
      ),
      check(
        "exec-workspace-scope",
        "Workspace scope defined",
        workspaceCount > 0,
        `${workspaceCount} workspace(s) in simulation scope`,
        workspaceCount,
      ),
      check(
        "exec-orphan-workspaces",
        "No orphan workspaces in scope",
        orphanOk,
        orphanOk ? "All scoped workspaces have projections or are excluded" : `${ctx.orphan_workspace_count} orphan workspace(s) in estate`,
        ctx.orphan_workspace_count,
        !orphanOk,
      ),
      check(
        "exec-survey-linked",
        "Digital land survey linked",
        ctx.survey_observed_at !== null,
        ctx.survey_observed_at ? "Survey evidence frozen in certificate" : "Run LB-OS-022 survey first",
        ctx.survey_observed_at !== null,
        !ctx.survey_observed_at,
      ),
    ];
    return buildDimensionResult("executive", this.label, MAX, checks);
  },
};
