import type { ProofContext } from "@localbrain/shared";
import { buildDimensionResult, check } from "../proofUtils.js";

const MAX = 20;

export const referenceProofProvider = {
  id: "reference" as const,
  label: "Reference Integrity",
  max_points: MAX,
  evaluate(ctx: ProofContext) {
    const broken = ctx.simulation_batches.reduce((s, b) => s + (b.current_projection ? 0 : 1), 0);
    const mappingOk = (ctx.mapping_confidence_percent ?? 0) >= 50;
    const evidenceOk = (ctx.evidence_confidence_percent ?? 0) >= 40;

    const checks = [
      check(
        "ref-mapping-confidence",
        "Filesystem mapping confidence",
        mappingOk,
        mappingOk ? "Mapping confidence acceptable" : "Run LB-OS-019 audit to improve mapping confidence",
        ctx.mapping_confidence_percent,
        !mappingOk,
      ),
      check(
        "ref-evidence-confidence",
        "Evidence confidence from survey",
        evidenceOk,
        evidenceOk ? "Survey evidence confidence acceptable" : "Digital land survey confidence low",
        ctx.evidence_confidence_percent,
        !evidenceOk,
      ),
      check(
        "ref-broken-projections",
        "Broken workspace projections",
        broken === 0,
        broken === 0 ? "All batches have registered or planned projections" : `${broken} workspace(s) missing current projection`,
        broken,
        broken > 0,
      ),
      check(
        "ref-audit-version",
        "Audit run linked",
        ctx.audit_run_id !== null,
        ctx.audit_run_id ? `Audit run ${ctx.audit_run_id.slice(0, 8)}…` : "No filesystem audit — run LB-OS-019",
        ctx.audit_run_id !== null,
        !ctx.audit_run_id,
      ),
    ];
    return buildDimensionResult("reference", this.label, MAX, checks);
  },
};
