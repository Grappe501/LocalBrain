import crypto from "node:crypto";
import type { CompleteWorkItemInput, WorkItem, WorkItemClaim } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export function createWorkItem(input: {
  workspace_id: string;
  session_id?: string;
  row_id?: string;
  item_type: WorkItem["item_type"];
  title: string;
  detail: string;
}): WorkItem {
  const work_item_id = crypto.randomUUID();
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO ucie_work_items (
        work_item_id, workspace_id, session_id, row_id, item_type, status, title, detail, created_at, updated_at
      ) VALUES (
        @work_item_id, @workspace_id, @session_id, @row_id, @item_type, 'open', @title, @detail, @now, @now
      )`,
    )
    .run({
      work_item_id,
      workspace_id: input.workspace_id,
      session_id: input.session_id ?? null,
      row_id: input.row_id ?? null,
      item_type: input.item_type,
      title: input.title,
      detail: input.detail,
      now,
    });
  return getWorkItem(work_item_id)!;
}

export function getWorkItem(workItemId: string): WorkItem | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM ucie_work_items WHERE work_item_id = ?`)
    .get(workItemId) as Record<string, unknown> | undefined;
  return row ? mapWorkItem(row) : null;
}

function mapWorkItem(row: Record<string, unknown>): WorkItem {
  return {
    work_item_id: row.work_item_id as string,
    workspace_id: row.workspace_id as string,
    session_id: (row.session_id as string) ?? undefined,
    row_id: (row.row_id as string) ?? undefined,
    item_type: row.item_type as WorkItem["item_type"],
    status: row.status as WorkItem["status"],
    title: row.title as string,
    detail: row.detail as string,
    claimed_by_user_id: (row.claimed_by_user_id as string) ?? undefined,
    claimed_at: (row.claimed_at as string) ?? undefined,
    completed_by_user_id: (row.completed_by_user_id as string) ?? undefined,
    completed_at: (row.completed_at as string) ?? undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function listOpenWorkItems(workspaceId: string): WorkItem[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM ucie_work_items WHERE workspace_id = ? AND status IN ('open', 'claimed') ORDER BY created_at ASC`,
    )
    .all(workspaceId) as Record<string, unknown>[];
  return rows.map(mapWorkItem);
}

export function claimWorkItem(input: { work_item_id: string; user_id: string }): WorkItem | null {
  const item = getWorkItem(input.work_item_id);
  if (!item || item.status === "completed" || item.status === "cancelled") return null;
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE ucie_work_items SET status = 'claimed', claimed_by_user_id = @user_id, claimed_at = @now, updated_at = @now
       WHERE work_item_id = @work_item_id`,
    )
    .run({ work_item_id: input.work_item_id, user_id: input.user_id, now });
  getDatabase()
    .prepare(
      `INSERT INTO ucie_work_claims (claim_id, work_item_id, user_id, claimed_at) VALUES (@claim_id, @work_item_id, @user_id, @now)`,
    )
    .run({ claim_id: crypto.randomUUID(), work_item_id: input.work_item_id, user_id: input.user_id, now });
  return getWorkItem(input.work_item_id);
}

export function completeWorkItem(input: CompleteWorkItemInput): WorkItem | null {
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE ucie_work_items SET
        status = 'completed',
        completed_by_user_id = @user_id,
        completed_at = @now,
        detail = CASE WHEN @note IS NOT NULL AND length(@note) > 0 THEN detail || ' — ' || @note ELSE detail END,
        updated_at = @now
       WHERE work_item_id = @work_item_id`,
    )
    .run({
      work_item_id: input.work_item_id,
      user_id: input.user_id,
      now,
      note: input.resolution_note ?? "",
    });
  return getWorkItem(input.work_item_id);
}

export function listWorkClaims(workItemId: string): WorkItemClaim[] {
  return getDatabase()
    .prepare(`SELECT * FROM ucie_work_claims WHERE work_item_id = ? ORDER BY claimed_at ASC`)
    .all(workItemId) as WorkItemClaim[];
}
