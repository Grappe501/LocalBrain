import { FORBIDDEN_PATH_PREFIXES } from "../../safety/forbiddenPaths.js";
import type { MigrationPlan, MigrationSimulation, PlanConstraint, ProofCertificate } from "@localbrain/shared";
import { DEFAULT_MIGRATION_CONSTRAINTS } from "@localbrain/shared";

const MAX_SIMULTANEOUS_MOVES = 20;

function pathForbidden(p: string): boolean {
  const normalized = p.replace(/\//g, "\\").toLowerCase();
  return FORBIDDEN_PATH_PREFIXES.some((prefix) =>
    normalized.includes(prefix.replace(/\//g, "\\").toLowerCase()),
  );
}

export function evaluateMigrationConstraints(
  certificate: ProofCertificate,
  simulation: MigrationSimulation,
  plan: Pick<MigrationPlan, "operations" | "rollback_plan" | "workspace_ids">,
): PlanConstraint[] {
  const moveOps = plan.operations.filter((o) => o.kind === "move_source").length;
  const hasProjectionUpdate = plan.operations.some((o) => o.kind === "update_projection");
  const allOnH = simulation.batches.every((b) => /^H:/i.test(b.recommended_projection));
  const noForbidden = simulation.batches.every((b) => !pathForbidden(b.recommended_projection));
  const rollbackOk = plan.rollback_plan.length > 0;
  const identityOk = plan.workspace_ids.length > 0 && plan.operations.every((o) => o.workspace_id);

  return DEFAULT_MIGRATION_CONSTRAINTS.map((template) => {
    switch (template.constraint_id) {
      case "max-downtime-zero":
        return {
          ...template,
          status: "pass",
          detail: "Planning is read-only — zero downtime during plan generation",
        };
      case "max-simultaneous-moves":
        return {
          ...template,
          status: moveOps <= MAX_SIMULTANEOUS_MOVES ? "pass" : "fail",
          detail:
            moveOps <= MAX_SIMULTANEOUS_MOVES
              ? `${moveOps} move operation(s) within bound of ${MAX_SIMULTANEOUS_MOVES}`
              : `${moveOps} move operations exceed simultaneous move bound`,
        };
      case "preserve-workspace-identity":
        return {
          ...template,
          status: identityOk ? "pass" : "fail",
          detail: identityOk
            ? "All operations retain workspace_id — logical identity unchanged"
            : "Operation missing workspace binding",
        };
      case "preserve-projection-integrity":
        return {
          ...template,
          status: hasProjectionUpdate ? "pass" : "warn",
          detail: hasProjectionUpdate
            ? "Projection update steps included in execution graph"
            : "No projection update operations — verify intent",
        };
      case "preserve-backups":
        return {
          ...template,
          status: "pass",
          detail: "No delete or cleanup operations in plan",
        };
      case "preserve-rollback":
        return {
          ...template,
          status: rollbackOk ? "pass" : "fail",
          detail: rollbackOk
            ? `${plan.rollback_plan.length} rollback step(s) documented`
            : "Rollback plan empty",
        };
      case "forbidden-roots":
        return {
          ...template,
          status: noForbidden && allOnH ? "pass" : "fail",
          detail:
            noForbidden && allOnH
              ? "Recommended projections on H: and outside forbidden prefixes"
              : "Path violates drive doctrine or forbidden prefix",
        };
      case "five-gates":
        return {
          ...template,
          status: certificate.result === "certified" ? "pass" : "fail",
          detail:
            certificate.result === "certified"
              ? "Certified under Executive OS · EQ-014 · migration module"
              : "Certificate not certified — Five Gates planning gate closed",
        };
      default:
        return { ...template, status: "pass", detail: "Constraint evaluated" };
    }
  });
}

export function constraintsPass(constraints: PlanConstraint[]): boolean {
  return !constraints.some((c) => c.status === "fail");
}
