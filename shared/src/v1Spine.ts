/** Executive OS V1 spine acceptance — LB-OS-016 */

export interface V1SpineCheck {
  id: string;
  label: string;
  category: "kernel" | "department" | "safety" | "guardrail";
  passed: boolean;
  detail: string;
}

export interface V1Guardrail {
  id: string;
  rule: string;
  enforced: boolean;
}

export interface V1AcceptanceReport {
  milestone: "Executive OS V1";
  slice_id: "LB-OS-016";
  release_candidate: boolean;
  overall_pass: boolean;
  passed_count: number;
  total_count: number;
  operational_loop: string[];
  checks: V1SpineCheck[];
  guardrails: V1Guardrail[];
  can_do: string[];
  cannot_do: string[];
  read_only: true;
  observed_at: string;
}
