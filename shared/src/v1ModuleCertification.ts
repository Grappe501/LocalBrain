/**
 * V1 module certification — PASS / NEEDS WORK / CERTIFIED (no percentages on critical path)
 */

export type V1CertDimensionStatus = "pass" | "needs_work" | "pending" | "not_applicable";

export type V1ModuleLaunchStatus =
  | "certified"
  | "needs_work"
  | "in_progress"
  | "not_started"
  | "regression";

export type V1ModuleReviewVerdict = "PASS" | "NEEDS WORK";

export const V1_NO_REGRESSION_RULE =
  "No module may regress after certification. Regression flags launch confidence and returns module to IN PROGRESS until fixed.";

export const BURT_V1_MISSION =
  "Finish the current module. Not improve the architecture. Not find opportunities. Not expand the vision.";

export const V1_DEFINITION_OF_DONE =
  "Every module in V1 has been independently certified before becoming part of the product.";

export const V1_CERT_DIMENSION_LABELS = {
  navigation: "Navigation",
  experience: "Experience",
  tests: "Tests",
  security: "Security",
  kelly_sandbox: "Kelly Sandbox",
  launch: "Launch",
} as const;

export type V1CertDimensionId = keyof typeof V1_CERT_DIMENSION_LABELS;

export interface V1CertDimensionRow {
  dimension_id: V1CertDimensionId;
  label: string;
  status: V1CertDimensionStatus;
  evidence: string | null;
}

export interface V1ModuleCertificationCard {
  module_id: string;
  module_name: string;
  purpose: string;
  acceptance_criteria: string;
  dimensions: V1CertDimensionRow[];
  launch_status: V1ModuleLaunchStatus;
  review_verdict: V1ModuleReviewVerdict | null;
  certification_locked: boolean;
  regression_detected: boolean;
}

/** Standard Burt return — ask "Review this module," not "What should we build next?" */
export const V1_MODULE_REVIEW_TEMPLATE = `Module:
Purpose:
Acceptance Criteria:
Tests:
Kelly Sandbox Result:
Performance:
Security:
UX:
Launch Ready?
PASS / NEEDS WORK
`;

export interface V1ModuleReviewRequest {
  template: typeof V1_MODULE_REVIEW_TEMPLATE;
  instruction: string;
}

export const V1_MODULE_REVIEW_REQUEST: V1ModuleReviewRequest = {
  template: V1_MODULE_REVIEW_TEMPLATE,
  instruction:
    "Review this module against acceptance criteria and certification dimensions. Do not propose new architecture.",
};
