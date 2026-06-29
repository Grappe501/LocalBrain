import { getDatabase } from "../../db/database.js";
import type { MigrationCutoverRun } from "@localbrain/shared";

export function migrateCutoverTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS migration_cutover_sequences (
      prefix TEXT PRIMARY KEY,
      next_value INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS migration_cutover_runs (
      cutover_id TEXT PRIMARY KEY,
      approval_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL,
      report_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_cutover_runs_created
      ON migration_cutover_runs(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_cutover_runs_approval
      ON migration_cutover_runs(approval_id);
  `);
}

function nextSequenceId(prefix: "CUT"): string {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO migration_cutover_sequences (prefix, next_value) VALUES (?, 1)
     ON CONFLICT(prefix) DO NOTHING`,
  ).run(prefix);

  const row = db
    .prepare(`SELECT next_value FROM migration_cutover_sequences WHERE prefix = ?`)
    .get(prefix) as { next_value: number };

  const value = row.next_value;
  db.prepare(
    `UPDATE migration_cutover_sequences SET next_value = next_value + 1 WHERE prefix = ?`,
  ).run(prefix);

  return `${prefix}-${String(value).padStart(6, "0")}`;
}

export function allocateCutoverId(): string {
  return nextSequenceId("CUT");
}

export function saveCutoverRun(run: MigrationCutoverRun): void {
  getDatabase()
    .prepare(
      `INSERT INTO migration_cutover_runs (cutover_id, approval_id, plan_id, status, report_json)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(run.cutover_id, run.approval_id, run.plan_id, run.status, JSON.stringify(run));
}

export function updateCutoverRun(run: MigrationCutoverRun): void {
  getDatabase()
    .prepare(
      `UPDATE migration_cutover_runs SET status = ?, report_json = ? WHERE cutover_id = ?`,
    )
    .run(run.status, JSON.stringify(run), run.cutover_id);
}

export function listRecentCutoverRuns(limit = 12): MigrationCutoverRun[] {
  const rows = getDatabase()
    .prepare(`SELECT report_json FROM migration_cutover_runs ORDER BY created_at DESC LIMIT ?`)
    .all(limit) as { report_json: string }[];

  return rows.map((r) => JSON.parse(r.report_json) as MigrationCutoverRun);
}

export function getCutoverRunById(cutoverId: string): MigrationCutoverRun | null {
  const row = getDatabase()
    .prepare(`SELECT report_json FROM migration_cutover_runs WHERE cutover_id = ?`)
    .get(cutoverId) as { report_json: string } | undefined;
  if (!row?.report_json) return null;
  return JSON.parse(row.report_json) as MigrationCutoverRun;
}

export function findActiveCutoverRun(): MigrationCutoverRun | null {
  const row = getDatabase()
    .prepare(
      `SELECT report_json FROM migration_cutover_runs
       WHERE status IN ('running', 'verifying')
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get() as { report_json: string } | undefined;
  if (!row?.report_json) return null;
  return JSON.parse(row.report_json) as MigrationCutoverRun;
}

export function countCutoverByStatus(status: string): number {
  const row = getDatabase()
    .prepare(`SELECT COUNT(*) AS count FROM migration_cutover_runs WHERE status = ?`)
    .get(status) as { count: number };
  return row.count;
}
