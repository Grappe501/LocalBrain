import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { ActionLogEventType } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getBackupDir } from "./actionPaths.js";

export type ProposedActionRow = {
  action_id: string;
  action_type: string;
  status: string;
  title: string;
  description: string;
  source_path: string | null;
  target_path: string | null;
  proposed_content: string | null;
  original_content: string | null;
  diff_preview: string | null;
  backup_id: string | null;
  requested_by: string;
  execution_detail: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  executed_at: string | null;
};

export function newActionId(): string {
  return crypto.randomUUID();
}

export function appendActionLog(
  actionId: string,
  eventType: ActionLogEventType,
  detail: string,
): void {
  getDatabase()
    .prepare(
      "INSERT INTO action_log (action_id, event_type, detail) VALUES (?, ?, ?)",
    )
    .run(actionId, eventType, detail);
}

export function insertProposedAction(row: {
  action_id: string;
  action_type: string;
  title: string;
  description: string;
  source_path: string | null;
  target_path: string | null;
  proposed_content: string | null;
  original_content?: string | null;
  diff_preview?: string | null;
  requested_by?: string;
}): ProposedActionRow {
  getDatabase()
    .prepare(
      `INSERT INTO proposed_actions (
        action_id, action_type, status, title, description,
        source_path, target_path, proposed_content, original_content, diff_preview,
        requested_by
      ) VALUES (
        @action_id, @action_type, 'pending', @title, @description,
        @source_path, @target_path, @proposed_content, @original_content, @diff_preview,
        @requested_by
      )`,
    )
    .run({
      ...row,
      original_content: row.original_content ?? null,
      diff_preview: row.diff_preview ?? null,
      requested_by: row.requested_by ?? "user",
    });

  appendActionLog(row.action_id, "proposed", row.title);
  return getProposedAction(row.action_id)!;
}

export function getProposedAction(actionId: string): ProposedActionRow | null {
  return (
    (getDatabase().prepare("SELECT * FROM proposed_actions WHERE action_id = ?").get(actionId) as
      | ProposedActionRow
      | undefined) ?? null
  );
}

export function listProposedActions(status?: string): ProposedActionRow[] {
  if (status) {
    return getDatabase()
      .prepare("SELECT * FROM proposed_actions WHERE status = ? ORDER BY created_at DESC")
      .all(status) as ProposedActionRow[];
  }
  return getDatabase()
    .prepare("SELECT * FROM proposed_actions ORDER BY created_at DESC")
    .all() as ProposedActionRow[];
}

export function updateProposedStatus(
  actionId: string,
  status: string,
  extra?: { execution_detail?: string; backup_id?: string },
): ProposedActionRow | null {
  const now = new Date().toISOString();
  const fields = ["status = @status", "updated_at = @updated_at"];
  const params: Record<string, string | null> = { action_id: actionId, status, updated_at: now };

  if (status === "approved") {
    fields.push("approved_at = @approved_at");
    params.approved_at = now;
  }
  if (status === "executed" || status === "failed") {
    fields.push("executed_at = @executed_at");
    params.executed_at = now;
  }
  if (extra?.execution_detail) {
    fields.push("execution_detail = @execution_detail");
    params.execution_detail = extra.execution_detail;
  }
  if (extra?.backup_id) {
    fields.push("backup_id = @backup_id");
    params.backup_id = extra.backup_id;
  }

  getDatabase()
    .prepare(`UPDATE proposed_actions SET ${fields.join(", ")} WHERE action_id = @action_id`)
    .run(params);

  return getProposedAction(actionId);
}

export function listActionLog(limit = 50): {
  id: number;
  action_id: string;
  event_type: string;
  detail: string;
  created_at: string;
}[] {
  return getDatabase()
    .prepare("SELECT * FROM action_log ORDER BY id DESC LIMIT ?")
    .all(limit) as {
    id: number;
    action_id: string;
    event_type: string;
    detail: string;
    created_at: string;
  }[];
}

export function createBackupRecord(options: {
  actionId: string | null;
  sourcePath: string;
  sourceFilePath: string;
}): { backup_id: string; backup_path: string } | null {
  if (!fs.existsSync(options.sourceFilePath)) return null;

  const backupId = crypto.randomUUID();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const base = path.basename(options.sourcePath);
  const backupPath = path.join(getBackupDir(), `${stamp}_${base}`);

  fs.copyFileSync(options.sourceFilePath, backupPath);

  getDatabase()
    .prepare(
      "INSERT INTO backup_records (backup_id, action_id, source_path, backup_path) VALUES (?, ?, ?, ?)",
    )
    .run(backupId, options.actionId, options.sourcePath, backupPath);

  return { backup_id: backupId, backup_path: backupPath };
}

export function getBackupRecord(backupId: string): {
  backup_id: string;
  action_id: string | null;
  source_path: string;
  backup_path: string;
  created_at: string;
} | null {
  return (
    (getDatabase()
      .prepare("SELECT * FROM backup_records WHERE backup_id = ?")
      .get(backupId) as
      | {
          backup_id: string;
          action_id: string | null;
          source_path: string;
          backup_path: string;
          created_at: string;
        }
      | undefined) ?? null
  );
}

export function listBackupRecords(limit = 50): {
  backup_id: string;
  action_id: string | null;
  source_path: string;
  backup_path: string;
  created_at: string;
}[] {
  return getDatabase()
    .prepare("SELECT * FROM backup_records ORDER BY created_at DESC LIMIT ?")
    .all(limit) as {
    backup_id: string;
    action_id: string | null;
    source_path: string;
    backup_path: string;
    created_at: string;
  }[];
}

export function rowToProposedAction(row: ProposedActionRow) {
  return {
    action_id: row.action_id,
    action_type: row.action_type,
    status: row.status,
    title: row.title,
    description: row.description,
    source_path: row.source_path,
    target_path: row.target_path,
    proposed_content: row.proposed_content,
    diff_preview: row.diff_preview,
    backup_id: row.backup_id,
    requested_by: row.requested_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    approved_at: row.approved_at,
    executed_at: row.executed_at,
    execution_detail: row.execution_detail,
  };
}
