import crypto from "node:crypto";
import type {
  CompleteVopWorkItemInput,
  CreateVopWorkItemInput,
  FlagVopWorkQualityInput,
  ReleaseVopWorkItemInput,
  VopWorkItem,
  VolunteerProfile,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getVolunteerProfileByUser } from "./vopProfileService.js";

function parseJsonArray(raw: unknown): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapWorkItem(row: Record<string, unknown>, matchScore?: number): VopWorkItem {
  return {
    work_item_id: row.work_item_id as string,
    workspace_id: row.workspace_id as string,
    item_type: row.item_type as VopWorkItem["item_type"],
    status: row.status as VopWorkItem["status"],
    title: row.title as string,
    detail: row.detail as string,
    county: (row.county as string) ?? undefined,
    required_skills: parseJsonArray(row.required_skills_json),
    urgency: row.urgency as VopWorkItem["urgency"],
    source_system: row.source_system as VopWorkItem["source_system"],
    source_ref_id: (row.source_ref_id as string) ?? undefined,
    contact_id: (row.contact_id as string) ?? undefined,
    quality_flag: row.quality_flag as VopWorkItem["quality_flag"],
    claimed_by_user_id: (row.claimed_by_user_id as string) ?? undefined,
    claimed_at: (row.claimed_at as string) ?? undefined,
    completed_by_user_id: (row.completed_by_user_id as string) ?? undefined,
    completed_at: (row.completed_at as string) ?? undefined,
    match_score: matchScore,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function computeMatchScore(
  item: Pick<VopWorkItem, "county" | "required_skills" | "urgency">,
  profile: VolunteerProfile | null,
): number {
  if (!profile) return 50;
  let score = 40;
  if (!item.county || !profile.county || item.county.toLowerCase() === profile.county.toLowerCase()) {
    score += 30;
  }
  const required = item.required_skills;
  if (required.length === 0) {
    score += 20;
  } else {
    const overlap = required.filter((s) => profile.skills.includes(s as VolunteerProfile["skills"][number]));
    score += Math.round((overlap.length / required.length) * 25);
  }
  if (item.urgency === "high") score += 5;
  return Math.min(100, score);
}

export function createVopWorkItem(input: CreateVopWorkItemInput): VopWorkItem {
  const work_item_id = crypto.randomUUID();
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO vop_work_items (
        work_item_id, workspace_id, item_type, status, title, detail, county,
        required_skills_json, urgency, source_system, source_ref_id, contact_id,
        quality_flag, created_at, updated_at
      ) VALUES (
        @work_item_id, @workspace_id, @item_type, 'open', @title, @detail, @county,
        @required_skills_json, @urgency, @source_system, @source_ref_id, @contact_id,
        'none', @now, @now
      )`,
    )
    .run({
      work_item_id,
      workspace_id: input.workspace_id,
      item_type: input.item_type,
      title: input.title,
      detail: input.detail,
      county: input.county ?? null,
      required_skills_json: JSON.stringify(input.required_skills ?? []),
      urgency: input.urgency ?? "normal",
      source_system: input.source_system ?? "manual",
      source_ref_id: input.source_ref_id ?? null,
      contact_id: input.contact_id ?? null,
      now,
    });
  return getVopWorkItem(work_item_id)!;
}

export function getVopWorkItem(workItemId: string): VopWorkItem | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM vop_work_items WHERE work_item_id = ?`)
    .get(workItemId) as Record<string, unknown> | undefined;
  return row ? mapWorkItem(row) : null;
}

export function listOpenVopWorkItems(
  workspaceId: string,
  profile?: VolunteerProfile | null,
): VopWorkItem[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM vop_work_items
       WHERE workspace_id = ? AND status = 'open'
       ORDER BY
         CASE urgency WHEN 'high' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END,
         created_at ASC`,
    )
    .all(workspaceId) as Record<string, unknown>[];

  return rows
    .map((row) => {
      const item = mapWorkItem(row);
      const score = computeMatchScore(item, profile ?? null);
      return { item, score };
    })
    .filter(({ item, score }) => {
      if (!profile) return true;
      if (item.county && profile.county && item.county.toLowerCase() !== profile.county.toLowerCase()) {
        return false;
      }
      if (item.required_skills.length === 0) return true;
      return score >= 50;
    })
    .sort((a, b) => b.score - a.score)
    .map(({ item, score }) => ({ ...item, match_score: score }));
}

export function listClaimedVopWorkItems(workspaceId: string, userId: string): VopWorkItem[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM vop_work_items
       WHERE workspace_id = ? AND status = 'claimed' AND claimed_by_user_id = ?
       ORDER BY claimed_at ASC`,
    )
    .all(workspaceId, userId) as Record<string, unknown>[];
  return rows.map((row) => mapWorkItem(row));
}

export function listAllActiveVopWorkItems(workspaceId: string): VopWorkItem[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM vop_work_items
       WHERE workspace_id = ? AND status IN ('open', 'claimed')
       ORDER BY created_at ASC`,
    )
    .all(workspaceId) as Record<string, unknown>[];
  return rows.map((row) => mapWorkItem(row));
}

export function claimVopWorkItem(input: { work_item_id: string; user_id: string }): VopWorkItem | null {
  const item = getVopWorkItem(input.work_item_id);
  if (!item || item.status === "completed" || item.status === "cancelled") return null;
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE vop_work_items SET
        status = 'claimed',
        claimed_by_user_id = @user_id,
        claimed_at = @now,
        updated_at = @now
       WHERE work_item_id = @work_item_id AND status = 'open'`,
    )
    .run({ work_item_id: input.work_item_id, user_id: input.user_id, now });

  const updated = getVopWorkItem(input.work_item_id);
  if (!updated || updated.status !== "claimed") return null;

  getDatabase()
    .prepare(
      `INSERT INTO vop_work_claims (claim_id, work_item_id, user_id, claimed_at)
       VALUES (@claim_id, @work_item_id, @user_id, @now)`,
    )
    .run({
      claim_id: crypto.randomUUID(),
      work_item_id: input.work_item_id,
      user_id: input.user_id,
      now,
    });
  return updated;
}

export function releaseVopWorkItem(input: ReleaseVopWorkItemInput): VopWorkItem | null {
  const item = getVopWorkItem(input.work_item_id);
  if (!item || item.status !== "claimed") return null;
  if (item.claimed_by_user_id !== input.user_id) return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE vop_work_items SET
        status = 'open',
        claimed_by_user_id = NULL,
        claimed_at = NULL,
        updated_at = @now
       WHERE work_item_id = @work_item_id`,
    )
    .run({ work_item_id: input.work_item_id, now });

  getDatabase()
    .prepare(
      `UPDATE vop_work_claims SET released_at = @now
       WHERE work_item_id = @work_item_id AND user_id = @user_id AND released_at IS NULL`,
    )
    .run({ work_item_id: input.work_item_id, user_id: input.user_id, now });

  return getVopWorkItem(input.work_item_id);
}

export function completeVopWorkItem(input: CompleteVopWorkItemInput): VopWorkItem | null {
  const item = getVopWorkItem(input.work_item_id);
  if (!item || item.status !== "claimed") return null;
  if (item.claimed_by_user_id !== input.user_id) return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE vop_work_items SET
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
  return getVopWorkItem(input.work_item_id);
}

export function flagVopWorkQuality(input: FlagVopWorkQualityInput): VopWorkItem | null {
  const item = getVopWorkItem(input.work_item_id);
  if (!item) return null;

  const now = new Date().toISOString();
  const qualityFlag =
    input.flag_type === "rework" ? "rework" : input.flag_type === "stuck" ? "needs_review" : "needs_review";

  getDatabase()
    .prepare(
      `INSERT INTO vop_quality_events (event_id, work_item_id, flagged_by_user_id, flag_type, note, created_at)
       VALUES (@event_id, @work_item_id, @flagged_by_user_id, @flag_type, @note, @now)`,
    )
    .run({
      event_id: crypto.randomUUID(),
      work_item_id: input.work_item_id,
      flagged_by_user_id: input.flagged_by_user_id,
      flag_type: input.flag_type,
      note: input.note ?? null,
      now,
    });

  getDatabase()
    .prepare(
      `UPDATE vop_work_items SET quality_flag = @quality_flag, updated_at = @now WHERE work_item_id = @work_item_id`,
    )
    .run({ work_item_id: input.work_item_id, quality_flag: qualityFlag, now });

  return getVopWorkItem(input.work_item_id);
}

export function resolveProfileForUser(workspaceId: string, userId: string): VolunteerProfile | null {
  return getVolunteerProfileByUser(workspaceId, userId);
}
