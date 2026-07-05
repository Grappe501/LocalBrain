import crypto from "node:crypto";
import type { UpsertVolunteerProfileInput, VolunteerProfile } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

function parseJsonArray<T>(raw: unknown, fallback: T[] = []): T[] {
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function mapProfile(row: Record<string, unknown>): VolunteerProfile {
  return {
    profile_id: row.profile_id as string,
    workspace_id: row.workspace_id as string,
    user_id: row.user_id as string,
    contact_id: (row.contact_id as string) ?? undefined,
    display_name: row.display_name as string,
    county: (row.county as string) ?? undefined,
    roles: parseJsonArray(row.roles_json),
    skills: parseJsonArray(row.skills_json),
    availability_note: (row.availability_note as string) ?? undefined,
    training_completed: parseJsonArray(row.training_completed_json),
    permissions: parseJsonArray(row.permissions_json),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function upsertVolunteerProfile(input: UpsertVolunteerProfileInput): VolunteerProfile {
  const existing = getVolunteerProfileByUser(input.workspace_id, input.user_id);
  const now = new Date().toISOString();
  const profile_id = existing?.profile_id ?? crypto.randomUUID();

  getDatabase()
    .prepare(
      `INSERT INTO vop_volunteer_profiles (
        profile_id, workspace_id, user_id, contact_id, display_name, county,
        roles_json, skills_json, availability_note, training_completed_json, permissions_json,
        created_at, updated_at
      ) VALUES (
        @profile_id, @workspace_id, @user_id, @contact_id, @display_name, @county,
        @roles_json, @skills_json, @availability_note, @training_completed_json, @permissions_json,
        @created_at, @updated_at
      )
      ON CONFLICT(workspace_id, user_id) DO UPDATE SET
        contact_id = excluded.contact_id,
        display_name = excluded.display_name,
        county = excluded.county,
        roles_json = excluded.roles_json,
        skills_json = excluded.skills_json,
        availability_note = excluded.availability_note,
        training_completed_json = excluded.training_completed_json,
        permissions_json = excluded.permissions_json,
        updated_at = excluded.updated_at`,
    )
    .run({
      profile_id,
      workspace_id: input.workspace_id,
      user_id: input.user_id,
      contact_id: input.contact_id ?? null,
      display_name: input.display_name,
      county: input.county ?? null,
      roles_json: JSON.stringify(input.roles ?? existing?.roles ?? []),
      skills_json: JSON.stringify(input.skills ?? existing?.skills ?? []),
      availability_note: input.availability_note ?? existing?.availability_note ?? null,
      training_completed_json: JSON.stringify(
        input.training_completed ?? existing?.training_completed ?? [],
      ),
      permissions_json: JSON.stringify(input.permissions ?? existing?.permissions ?? []),
      created_at: existing?.created_at ?? now,
      updated_at: now,
    });

  return getVolunteerProfileByUser(input.workspace_id, input.user_id)!;
}

export function getVolunteerProfileByUser(
  workspaceId: string,
  userId: string,
): VolunteerProfile | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM vop_volunteer_profiles WHERE workspace_id = ? AND user_id = ?`)
    .get(workspaceId, userId) as Record<string, unknown> | undefined;
  return row ? mapProfile(row) : null;
}

export function listVolunteerProfiles(workspaceId: string): VolunteerProfile[] {
  const rows = getDatabase()
    .prepare(`SELECT * FROM vop_volunteer_profiles WHERE workspace_id = ? ORDER BY display_name ASC`)
    .all(workspaceId) as Record<string, unknown>[];
  return rows.map(mapProfile);
}
