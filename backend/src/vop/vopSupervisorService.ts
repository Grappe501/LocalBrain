import type { VopSupervisorDashboard } from "@localbrain/shared";
import { listOpenWorkItems } from "../ucie/ucieWorkService.js";
import { listAllActiveVopWorkItems } from "./vopWorkService.js";
import { getDatabase } from "../db/database.js";

export function buildSupervisorDashboard(workspaceId: string): VopSupervisorDashboard {
  const db = getDatabase();
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  const open = db
    .prepare(`SELECT COUNT(*) AS c FROM vop_work_items WHERE workspace_id = ? AND status = 'open'`)
    .get(workspaceId) as { c: number };
  const claimed = db
    .prepare(`SELECT COUNT(*) AS c FROM vop_work_items WHERE workspace_id = ? AND status = 'claimed'`)
    .get(workspaceId) as { c: number };
  const completedToday = db
    .prepare(
      `SELECT COUNT(*) AS c FROM vop_work_items
       WHERE workspace_id = ? AND status = 'completed' AND completed_at >= ?`,
    )
    .get(workspaceId, todayIso) as { c: number };
  const completedAll = db
    .prepare(`SELECT COUNT(*) AS c FROM vop_work_items WHERE workspace_id = ? AND status = 'completed'`)
    .get(workspaceId) as { c: number };
  const total = db
    .prepare(`SELECT COUNT(*) AS c FROM vop_work_items WHERE workspace_id = ?`)
    .get(workspaceId) as { c: number };

  const stuck = db
    .prepare(
      `SELECT COUNT(*) AS c FROM vop_work_items
       WHERE workspace_id = ? AND status = 'claimed'
       AND claimed_at IS NOT NULL
       AND datetime(claimed_at) < datetime('now', '-1 day')`,
    )
    .get(workspaceId) as { c: number };

  const qualityFlags = db
    .prepare(
      `SELECT COUNT(*) AS c FROM vop_work_items
       WHERE workspace_id = ? AND quality_flag != 'none'`,
    )
    .get(workspaceId) as { c: number };

  const backlogByType = db
    .prepare(
      `SELECT item_type, COUNT(*) AS count FROM vop_work_items
       WHERE workspace_id = ? AND status IN ('open', 'claimed')
       GROUP BY item_type ORDER BY count DESC`,
    )
    .all(workspaceId) as { item_type: string; count: number }[];

  const qualityByFlag = db
    .prepare(
      `SELECT quality_flag, COUNT(*) AS count FROM vop_work_items
       WHERE workspace_id = ? AND quality_flag != 'none'
       GROUP BY quality_flag`,
    )
    .all(workspaceId) as { quality_flag: VopSupervisorDashboard["quality_by_flag"][number]["quality_flag"]; count: number }[];

  const claimRows = db
    .prepare(
      `SELECT claimed_at, completed_at FROM vop_work_items
       WHERE workspace_id = ? AND status = 'completed' AND claimed_at IS NOT NULL AND completed_at IS NOT NULL`,
    )
    .all(workspaceId) as { claimed_at: string; completed_at: string }[];

  let averageClaimHours = 0;
  if (claimRows.length > 0) {
    const totalHours = claimRows.reduce((sum, row) => {
      const start = new Date(row.claimed_at).getTime();
      const end = new Date(row.completed_at).getTime();
      return sum + Math.max(0, (end - start) / (1000 * 60 * 60));
    }, 0);
    averageClaimHours = Math.round((totalHours / claimRows.length) * 10) / 10;
  }

  const ucieOpen = listOpenWorkItems(workspaceId).filter((i) => i.status === "open").length;
  const vopOpen = open.c;

  const completionRate =
    total.c === 0 ? 0 : Math.round((completedAll.c / total.c) * 100);

  return {
    workspace_id: workspaceId,
    observed_at: now.toISOString(),
    open_backlog: open.c,
    claimed_in_progress: claimed.c,
    completed_today: completedToday.c,
    completion_rate_percent: completionRate,
    average_claim_hours: averageClaimHours,
    stuck_work_count: stuck.c,
    quality_flag_count: qualityFlags.c,
    backlog_by_type: backlogByType,
    quality_by_flag: qualityByFlag,
    ucie_open_items: ucieOpen,
    vop_open_items: vopOpen,
  };
}

export function listSupervisorActiveWork(workspaceId: string) {
  return listAllActiveVopWorkItems(workspaceId);
}
