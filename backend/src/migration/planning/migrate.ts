import { getDatabase } from "../../db/database.js";
import type { MigrationPlan } from "@localbrain/shared";

export function migratePlanningTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS migration_plan_sequences (
      prefix TEXT PRIMARY KEY,
      next_value INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS migration_plans (
      plan_id TEXT PRIMARY KEY,
      certificate_id TEXT NOT NULL,
      variant_strategy TEXT NOT NULL,
      quality_percent REAL NOT NULL,
      ready_for_proposal INTEGER NOT NULL DEFAULT 0,
      report_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_migration_plans_created
      ON migration_plans(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_migration_plans_certificate
      ON migration_plans(certificate_id);
  `);
}

function nextSequenceId(prefix: "PLAN"): string {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO migration_plan_sequences (prefix, next_value) VALUES (?, 1)
     ON CONFLICT(prefix) DO NOTHING`,
  ).run(prefix);

  const row = db
    .prepare(`SELECT next_value FROM migration_plan_sequences WHERE prefix = ?`)
    .get(prefix) as { next_value: number };

  const value = row.next_value;
  db.prepare(`UPDATE migration_plan_sequences SET next_value = next_value + 1 WHERE prefix = ?`).run(
    prefix,
  );

  return `${prefix}-${String(value).padStart(6, "0")}`;
}

export function allocatePlanId(): string {
  return nextSequenceId("PLAN");
}

export function savePlanRecord(plan: MigrationPlan): void {
  getDatabase()
    .prepare(
      `INSERT INTO migration_plans
       (plan_id, certificate_id, variant_strategy, quality_percent, ready_for_proposal, report_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      plan.plan_id,
      plan.certificate_id,
      plan.variant_strategy,
      plan.plan_quality.percent,
      plan.ready_for_proposal ? 1 : 0,
      JSON.stringify(plan),
    );
}

export function listRecentPlans(limit = 12): MigrationPlan[] {
  const rows = getDatabase()
    .prepare(
      `SELECT report_json FROM migration_plans ORDER BY created_at DESC LIMIT ?`,
    )
    .all(limit) as { report_json: string }[];

  return rows.map((r) => JSON.parse(r.report_json) as MigrationPlan);
}

export function getPlanById(planId: string): MigrationPlan | null {
  const row = getDatabase()
    .prepare(`SELECT report_json FROM migration_plans WHERE plan_id = ?`)
    .get(planId) as { report_json: string } | undefined;
  if (!row?.report_json) return null;
  return JSON.parse(row.report_json) as MigrationPlan;
}

export function formatAuditRef(runId: string | null): string | null {
  if (!runId) return null;
  const compact = runId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `AUD-${compact}`;
}

export function formatSurveyRef(observedAt: string | null): string | null {
  if (!observedAt) return null;
  const d = new Date(observedAt);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  return `SUR-${y}${m}${day}${h}`;
}
