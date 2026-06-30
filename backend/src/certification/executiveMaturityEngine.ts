import type { ExecutiveMaturityReport } from "@localbrain/shared";
import { EXECUTIVE_MATURITY_CORE_RULE } from "@localbrain/shared";

export function computeExecutiveMaturity(): ExecutiveMaturityReport {
  const domains: ExecutiveMaturityReport["domains"] = [
    {
      domain_id: "executive_os",
      label: "Executive OS",
      percent: 100,
      status: "complete",
    },
    {
      domain_id: "executive_memory",
      label: "Executive Memory",
      percent: 5,
      status: "planned",
    },
    {
      domain_id: "executive_intelligence",
      label: "Executive Intelligence",
      percent: 8,
      status: "partial",
    },
    {
      domain_id: "executive_evolution",
      label: "Executive Evolution",
      percent: 2,
      status: "planned",
    },
  ];

  const overall = Math.round(
    domains.reduce((sum, d) => sum + d.percent, 0) / domains.length,
  );

  return {
    engine_id: "ENG-EMT-001",
    core_rule: EXECUTIVE_MATURITY_CORE_RULE,
    overall_percent: overall,
    domains,
    observed_at: new Date().toISOString(),
    summary:
      overall < 40
        ? "Executive intelligence systems are intentionally scheduled for Phase 2 — Executive OS foundation is complete"
        : "Executive maturity rising as Memory, Mission Stack, and Evolution ship",
  };
}
