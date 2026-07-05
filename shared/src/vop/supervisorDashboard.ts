/** VOP-001 — Supervisor dashboard contracts. */

import type { VopQualityFlag, VopWorkItemType } from "./workMarketplace.js";

export type VopSupervisorDashboard = {
  workspace_id: string;
  observed_at: string;
  open_backlog: number;
  claimed_in_progress: number;
  completed_today: number;
  completion_rate_percent: number;
  average_claim_hours: number;
  stuck_work_count: number;
  quality_flag_count: number;
  backlog_by_type: readonly { item_type: VopWorkItemType | string; count: number }[];
  quality_by_flag: readonly { quality_flag: VopQualityFlag; count: number }[];
  ucie_open_items: number;
  vop_open_items: number;
};

export const VOP_DOCTRINE =
  "Coordinate people, don't just assign tasks." as const;
