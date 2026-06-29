import { randomUUID } from "node:crypto";
import type { FilesystemMappingAudit } from "@localbrain/shared";
import { getDatabase } from "../../db/database.js";
import { buildFilesystemMappingAudit } from "./aggregator.js";
import { runHFilesystemScan } from "./scanner.js";

export function getLatestFilesystemAudit(): FilesystemMappingAudit | null {
  const row = getDatabase()
    .prepare(
      `SELECT report_json FROM migration_audit_runs
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get() as { report_json: string } | undefined;

  if (!row?.report_json) return null;
  try {
    return JSON.parse(row.report_json) as FilesystemMappingAudit;
  } catch {
    return null;
  }
}

export function isInventoryGateComplete(): boolean {
  return getLatestFilesystemAudit()?.inventory_complete === true;
}

export function runFilesystemMappingAudit(options?: { force?: boolean }): FilesystemMappingAudit {
  if (!options?.force) {
    const cached = getLatestFilesystemAudit();
    if (cached) {
      const ageMs = Date.now() - new Date(cached.observed_at).getTime();
      if (ageMs < 24 * 60 * 60 * 1000) {
        return cached;
      }
    }
  }

  const runId = randomUUID();
  const scan = runHFilesystemScan();
  const report = buildFilesystemMappingAudit(scan, runId);

  getDatabase()
    .prepare(
      `INSERT INTO migration_audit_runs (run_id, paths_scanned, mapping_confidence, report_json)
       VALUES (?, ?, ?, ?)`,
    )
    .run(runId, report.paths_scanned, report.mapping_confidence, JSON.stringify(report));

  return report;
}

export function exportFilesystemAuditJson(): string {
  const report = runFilesystemMappingAudit();
  return JSON.stringify(report, null, 2);
}
