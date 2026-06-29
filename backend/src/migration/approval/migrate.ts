import { getDatabase } from "../../db/database.js";
import type { MigrationApprovalPackage } from "@localbrain/shared";

export function migrateApprovalTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS migration_approval_sequences (
      prefix TEXT PRIMARY KEY,
      next_value INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS migration_approvals (
      approval_id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      certificate_id TEXT NOT NULL,
      status TEXT NOT NULL,
      action_id TEXT,
      ready_for_cutover INTEGER NOT NULL DEFAULT 0,
      report_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_migration_approvals_created
      ON migration_approvals(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_migration_approvals_plan
      ON migration_approvals(plan_id);

    CREATE INDEX IF NOT EXISTS idx_migration_approvals_status
      ON migration_approvals(status);
  `);
}

function nextSequenceId(prefix: "APPR"): string {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO migration_approval_sequences (prefix, next_value) VALUES (?, 1)
     ON CONFLICT(prefix) DO NOTHING`,
  ).run(prefix);

  const row = db
    .prepare(`SELECT next_value FROM migration_approval_sequences WHERE prefix = ?`)
    .get(prefix) as { next_value: number };

  const value = row.next_value;
  db.prepare(
    `UPDATE migration_approval_sequences SET next_value = next_value + 1 WHERE prefix = ?`,
  ).run(prefix);

  return `${prefix}-${String(value).padStart(6, "0")}`;
}

export function allocateApprovalId(): string {
  return nextSequenceId("APPR");
}

export function saveApprovalRecord(approval: MigrationApprovalPackage): void {
  getDatabase()
    .prepare(
      `INSERT INTO migration_approvals
       (approval_id, plan_id, certificate_id, status, action_id, ready_for_cutover, report_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      approval.approval_id,
      approval.plan_id,
      approval.certificate_id,
      approval.status,
      approval.action_id,
      approval.ready_for_cutover ? 1 : 0,
      JSON.stringify(approval),
    );
}

export function updateApprovalRecord(approval: MigrationApprovalPackage): void {
  getDatabase()
    .prepare(
      `UPDATE migration_approvals
       SET status = ?, action_id = ?, ready_for_cutover = ?, report_json = ?
       WHERE approval_id = ?`,
    )
    .run(
      approval.status,
      approval.action_id,
      approval.ready_for_cutover ? 1 : 0,
      JSON.stringify(approval),
      approval.approval_id,
    );
}

export function listRecentApprovals(limit = 12): MigrationApprovalPackage[] {
  const rows = getDatabase()
    .prepare(`SELECT report_json FROM migration_approvals ORDER BY created_at DESC LIMIT ?`)
    .all(limit) as { report_json: string }[];

  return rows.map((r) => JSON.parse(r.report_json) as MigrationApprovalPackage);
}

export function getApprovalById(approvalId: string): MigrationApprovalPackage | null {
  const row = getDatabase()
    .prepare(`SELECT report_json FROM migration_approvals WHERE approval_id = ?`)
    .get(approvalId) as { report_json: string } | undefined;
  if (!row?.report_json) return null;
  return JSON.parse(row.report_json) as MigrationApprovalPackage;
}

export function findPendingApprovalForPlan(planId: string): MigrationApprovalPackage | null {
  const row = getDatabase()
    .prepare(
      `SELECT report_json FROM migration_approvals
       WHERE plan_id = ? AND status = 'pending'
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(planId) as { report_json: string } | undefined;
  if (!row?.report_json) return null;
  return JSON.parse(row.report_json) as MigrationApprovalPackage;
}

export function countApprovalsByStatus(status: string): number {
  const row = getDatabase()
    .prepare(`SELECT COUNT(*) AS count FROM migration_approvals WHERE status = ?`)
    .get(status) as { count: number };
  return row.count;
}
