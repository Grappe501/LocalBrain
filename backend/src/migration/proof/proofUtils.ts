import type { ProofCheck, ProofCheckStatus, ProofDimensionResult } from "@localbrain/shared";

export function dimensionStatus(checks: ProofCheck[]): ProofCheckStatus {
  if (checks.some((c) => c.status === "fail")) return "fail";
  if (checks.some((c) => c.status === "warn")) return "warn";
  return "pass";
}

export function scoreFromChecks(checks: ProofCheck[], maxPoints: number): number {
  if (checks.length === 0) return 0;
  const failCount = checks.filter((c) => c.status === "fail").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;
  const passCount = checks.filter((c) => c.status === "pass").length;
  const perCheck = maxPoints / checks.length;
  return Math.max(0, Math.round(passCount * perCheck + warnCount * perCheck * 0.5 - failCount * perCheck * 0.25));
}

export function buildDimensionResult(
  dimension_id: ProofDimensionResult["dimension_id"],
  label: string,
  max_points: number,
  checks: ProofCheck[],
): ProofDimensionResult {
  return {
    dimension_id,
    label,
    max_points,
    earned_points: scoreFromChecks(checks, max_points),
    status: dimensionStatus(checks),
    checks,
  };
}

export function check(
  check_id: string,
  label: string,
  ok: boolean,
  detail: string,
  measured_value?: string | number | boolean | null,
  warnOnly = false,
): ProofCheck {
  return {
    check_id,
    label,
    status: ok ? "pass" : warnOnly ? "warn" : "fail",
    detail,
    measured_value,
  };
}
