import type { ContactBrief, ContactBriefEvidenceView } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { composeContactBrief, composeContactBriefEvidence } from "./contactBriefComposer.js";
import type { ContactAccessContext } from "./contactBriefValidator.js";
import { assertRoleCapable, canRegenerateBriefs, canViewBriefs } from "./contactBriefValidator.js";

type CacheRow = {
  contact_id: string;
  workspace_id: string;
  generated_at: string;
  generated_by_user_id: string;
  regeneration_count: number;
  operator_approved: number;
  operator_approved_by_user_id: string | null;
  operator_approved_at: string | null;
  updated_at: string;
};

function readCache(contactId: string): CacheRow | undefined {
  return getDatabase()
    .prepare(`SELECT * FROM contact_brief_cache WHERE contact_id = ?`)
    .get(contactId) as CacheRow | undefined;
}

function upsertCache(options: {
  contact_id: string;
  workspace_id: string;
  generated_by_user_id: string;
  regeneration_count: number;
  operator_approved: boolean;
  operator_approved_by_user_id?: string;
  operator_approved_at?: string;
}): void {
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO contact_brief_cache (
        contact_id, workspace_id, generated_at, generated_by_user_id, regeneration_count,
        operator_approved, operator_approved_by_user_id, operator_approved_at, updated_at
      ) VALUES (
        @contact_id, @workspace_id, @generated_at, @generated_by_user_id, @regeneration_count,
        @operator_approved, @operator_approved_by_user_id, @operator_approved_at, @updated_at
      )
      ON CONFLICT(contact_id) DO UPDATE SET
        generated_at = excluded.generated_at,
        generated_by_user_id = excluded.generated_by_user_id,
        regeneration_count = excluded.regeneration_count,
        operator_approved = excluded.operator_approved,
        operator_approved_by_user_id = excluded.operator_approved_by_user_id,
        operator_approved_at = excluded.operator_approved_at,
        updated_at = excluded.updated_at`,
    )
    .run({
      contact_id: options.contact_id,
      workspace_id: options.workspace_id,
      generated_at: now,
      generated_by_user_id: options.generated_by_user_id,
      regeneration_count: options.regeneration_count,
      operator_approved: options.operator_approved ? 1 : 0,
      operator_approved_by_user_id: options.operator_approved_by_user_id ?? null,
      operator_approved_at: options.operator_approved_at ?? null,
      updated_at: now,
    });
}

function cacheInput(contactId: string, userId: string, regenerate: boolean) {
  const existing = readCache(contactId);
  return {
    regeneration_count: regenerate ? (existing?.regeneration_count ?? 0) + 1 : (existing?.regeneration_count ?? 0),
    operator_approved: existing?.operator_approved === 1,
    operator_approved_by_user_id: existing?.operator_approved_by_user_id ?? undefined,
    operator_approved_at: existing?.operator_approved_at ?? undefined,
    generated_by_user_id: userId,
  };
}

export function buildContactBrief(
  contactId: string,
  ctx: ContactAccessContext,
  options: { regenerate?: boolean } = {},
): ContactBrief | null {
  assertRoleCapable(canViewBriefs(ctx), "forbidden", "Insufficient permissions to view briefs");
  const cacheMeta = cacheInput(contactId, ctx.user_id, options.regenerate ?? false);
  const brief = composeContactBrief({
    contact_id: contactId,
    ctx,
    generated_by_user_id: cacheMeta.generated_by_user_id,
    regeneration_count: cacheMeta.regeneration_count,
    operator_approved: cacheMeta.operator_approved,
    operator_approved_by_user_id: cacheMeta.operator_approved_by_user_id,
    operator_approved_at: cacheMeta.operator_approved_at,
  });
  if (!brief) return null;

  upsertCache({
    contact_id: brief.contact_id,
    workspace_id: brief.workspace_id,
    generated_by_user_id: ctx.user_id,
    regeneration_count: brief.metadata.regeneration_count,
    operator_approved: brief.metadata.operator_approved,
    operator_approved_by_user_id: brief.metadata.operator_approved_by_user_id,
    operator_approved_at: brief.metadata.operator_approved_at,
  });

  return brief;
}

export function regenerateContactBrief(contactId: string, ctx: ContactAccessContext): ContactBrief | null {
  assertRoleCapable(canRegenerateBriefs(ctx), "forbidden", "Insufficient permissions to regenerate briefs");
  return buildContactBrief(contactId, ctx, { regenerate: true });
}

export function buildContactBriefEvidenceView(
  contactId: string,
  ctx: ContactAccessContext,
): ContactBriefEvidenceView | null {
  assertRoleCapable(canViewBriefs(ctx), "forbidden", "Insufficient permissions to view brief evidence");
  const cacheMeta = cacheInput(contactId, ctx.user_id, false);
  const view = composeContactBriefEvidence({
    contact_id: contactId,
    ctx,
    generated_by_user_id: cacheMeta.generated_by_user_id,
    regeneration_count: cacheMeta.regeneration_count,
    operator_approved: cacheMeta.operator_approved,
    operator_approved_by_user_id: cacheMeta.operator_approved_by_user_id,
    operator_approved_at: cacheMeta.operator_approved_at,
  });
  if (!view) return null;

  upsertCache({
    contact_id: view.contact_id,
    workspace_id: view.workspace_id,
    generated_by_user_id: ctx.user_id,
    regeneration_count: view.metadata.regeneration_count,
    operator_approved: view.metadata.operator_approved,
    operator_approved_by_user_id: view.metadata.operator_approved_by_user_id,
    operator_approved_at: view.metadata.operator_approved_at,
  });

  return view;
}
