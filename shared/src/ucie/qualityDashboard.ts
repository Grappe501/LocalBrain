/** UCIE-110 — Data quality dashboard. */

import type { UCIE_VERSION } from "./ucieConstants.js";

export type UcieQualityDashboard = {
  engine_id: typeof UCIE_VERSION;
  workspace_id: string;
  computed_at: string;
  import_success_rate_percent: number;
  duplicate_rate_percent: number;
  match_confidence_distribution: {
    exact_match: number;
    high_confidence: number;
    review_required: number;
    new_identity: number;
  };
  ocr_backlog: number;
  volunteer_claim_rate_percent: number;
  verification_turnaround_hours: number;
  county_verification_backlog: Record<string, number>;
  connector_usage: Record<string, number>;
  open_work_items: number;
  total_sessions: number;
  total_rows_staged: number;
  total_rows_committed: number;
};
