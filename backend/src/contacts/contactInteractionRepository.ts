import crypto from "node:crypto";
import type {
  ContactFollowUpBucket,
  ContactFollowUpItem,
  ContactInteraction,
  ContactTimelineAdvisorySummary,
  ContactTimelineMeta,
  ContactTimelinePinnedSummary,
  ContactTimelineView,
  CreateContactInteractionInput,
  UpdateContactInteractionInput,
  UpdateContactTimelineMetaInput,
} from "@localbrain/shared";
import { CONTACT_TIMELINE_ADVISORY_NOTICE, CONTACT_TIMELINE_VERSION } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getContactById } from "./contactRepository.js";
import {
  canMutateInteraction,
  canViewInteraction,
  type ContactAccessContext,
  validateCreateInteractionInput,
  validateUpdateInteractionInput,
} from "./contactInteractionValidator.js";

type InteractionRow = {
  interaction_id: string;
  workspace_id: string;
  contact_id: string;
  type: string;
  summary: string;
  details: string;
  occurred_at: string;
  created_by_user_id: string;
  assigned_to_user_id: string | null;
  visibility: string;
  sentiment: string;
  follow_up_required: number;
  follow_up_due_at: string | null;
  source: string;
  context_id: string | null;
  created_at: string;
  updated_at: string;
};

type TimelineMetaRow = {
  contact_id: string;
  workspace_id: string;
  manual_summary: string;
  relationship_owner_user_id: string | null;
  pinned_next_step: string;
  updated_at: string;
};

function rowToInteraction(row: InteractionRow): ContactInteraction {
  return {
    id: row.interaction_id,
    contact_id: row.contact_id,
    workspace_id: row.workspace_id,
    type: row.type as ContactInteraction["type"],
    summary: row.summary,
    details: row.details,
    occurred_at: row.occurred_at,
    created_by_user_id: row.created_by_user_id,
    assigned_to_user_id: row.assigned_to_user_id ?? undefined,
    visibility: row.visibility as ContactInteraction["visibility"],
    sentiment: row.sentiment as ContactInteraction["sentiment"],
    follow_up_required: row.follow_up_required === 1,
    follow_up_due_at: row.follow_up_due_at ?? undefined,
    source: row.source as ContactInteraction["source"],
    context_id: row.context_id ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToMeta(row: TimelineMetaRow): ContactTimelineMeta {
  return {
    contact_id: row.contact_id,
    workspace_id: row.workspace_id,
    manual_summary: row.manual_summary,
    relationship_owner_user_id: row.relationship_owner_user_id ?? undefined,
    pinned_next_step: row.pinned_next_step,
    updated_at: row.updated_at,
  };
}

function filterVisible(
  interactions: ContactInteraction[],
  ctx: ContactAccessContext,
): ContactInteraction[] {
  return interactions.filter((item) => canViewInteraction(item, ctx));
}

export function createContactInteraction(
  input: CreateContactInteractionInput,
): ContactInteraction | null {
  validateCreateInteractionInput(input);
  const contact = getContactById(input.contact_id);
  if (!contact || contact.workspace_id !== input.workspace_id) {
    return null;
  }

  const id = crypto.randomUUID();
  const occurredAt = input.occurred_at ?? new Date().toISOString();
  const now = new Date().toISOString();

  getDatabase()
    .prepare(
      `INSERT INTO contact_interactions (
        interaction_id, workspace_id, contact_id, type, summary, details, occurred_at,
        created_by_user_id, assigned_to_user_id, visibility, sentiment,
        follow_up_required, follow_up_due_at, source, context_id, created_at, updated_at
      ) VALUES (
        @interaction_id, @workspace_id, @contact_id, @type, @summary, @details, @occurred_at,
        @created_by_user_id, @assigned_to_user_id, @visibility, @sentiment,
        @follow_up_required, @follow_up_due_at, @source, @context_id, @created_at, @updated_at
      )`,
    )
    .run({
      interaction_id: id,
      workspace_id: input.workspace_id,
      contact_id: input.contact_id,
      type: input.type,
      summary: input.summary.trim(),
      details: (input.details ?? "").trim(),
      occurred_at: occurredAt,
      created_by_user_id: input.created_by_user_id,
      assigned_to_user_id: input.assigned_to_user_id ?? null,
      visibility: input.visibility ?? "campaign",
      sentiment: input.sentiment ?? "unknown",
      follow_up_required: input.follow_up_required ? 1 : 0,
      follow_up_due_at: input.follow_up_due_at ?? null,
      source: input.source ?? "manual",
      context_id: input.context_id ?? null,
      created_at: now,
      updated_at: now,
    });

  return getContactInteractionById(id);
}

export function getContactInteractionById(id: string): ContactInteraction | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM contact_interactions WHERE interaction_id = ?`)
    .get(id) as InteractionRow | undefined;
  return row ? rowToInteraction(row) : null;
}

export function listContactInteractions(options: {
  contact_id: string;
  type?: string;
  ctx: ContactAccessContext;
}): ContactInteraction[] {
  let sql = `SELECT * FROM contact_interactions WHERE contact_id = ?`;
  const params: unknown[] = [options.contact_id];
  if (options.type) {
    sql += ` AND type = ?`;
    params.push(options.type);
  }
  sql += ` ORDER BY occurred_at DESC, created_at DESC`;
  const rows = getDatabase().prepare(sql).all(...params) as InteractionRow[];
  return filterVisible(rows.map(rowToInteraction), options.ctx);
}

export function updateContactInteraction(
  id: string,
  input: UpdateContactInteractionInput,
  ctx: ContactAccessContext,
): ContactInteraction | null {
  validateUpdateInteractionInput(input);
  const existing = getContactInteractionById(id);
  if (!existing || !canMutateInteraction(existing, ctx)) return null;

  const next = {
    type: input.type ?? existing.type,
    summary: input.summary?.trim() ?? existing.summary,
    details: input.details !== undefined ? input.details.trim() : existing.details,
    occurred_at: input.occurred_at ?? existing.occurred_at,
    assigned_to_user_id:
      input.assigned_to_user_id !== undefined
        ? input.assigned_to_user_id
        : existing.assigned_to_user_id,
    visibility: input.visibility ?? existing.visibility,
    sentiment: input.sentiment ?? existing.sentiment,
    follow_up_required:
      input.follow_up_required !== undefined
        ? input.follow_up_required
        : existing.follow_up_required,
    follow_up_due_at:
      input.follow_up_due_at === null
        ? null
        : (input.follow_up_due_at ?? existing.follow_up_due_at ?? null),
    context_id:
      input.context_id === null ? null : (input.context_id ?? existing.context_id ?? null),
    updated_at: new Date().toISOString(),
  };

  if (next.follow_up_required && !next.follow_up_due_at) {
    throw new Error("follow_up_due_at required");
  }

  getDatabase()
    .prepare(
      `UPDATE contact_interactions SET
        type = @type, summary = @summary, details = @details, occurred_at = @occurred_at,
        assigned_to_user_id = @assigned_to_user_id, visibility = @visibility, sentiment = @sentiment,
        follow_up_required = @follow_up_required, follow_up_due_at = @follow_up_due_at,
        context_id = @context_id,
        updated_at = @updated_at
      WHERE interaction_id = @interaction_id`,
    )
    .run({
      interaction_id: id,
      type: next.type,
      summary: next.summary,
      details: next.details,
      occurred_at: next.occurred_at,
      assigned_to_user_id: next.assigned_to_user_id ?? null,
      visibility: next.visibility,
      sentiment: next.sentiment,
      follow_up_required: next.follow_up_required ? 1 : 0,
      follow_up_due_at: next.follow_up_due_at,
      context_id: next.context_id,
      updated_at: next.updated_at,
    });

  return getContactInteractionById(id);
}

export function deleteContactInteraction(id: string, ctx: ContactAccessContext): boolean {
  const existing = getContactInteractionById(id);
  if (!existing || !canMutateInteraction(existing, ctx)) return false;
  getDatabase()
    .prepare(`DELETE FROM contact_interactions WHERE interaction_id = ?`)
    .run(id);
  return true;
}

export function getOrCreateTimelineMeta(contactId: string, workspaceId: string): ContactTimelineMeta {
  const existing = getDatabase()
    .prepare(`SELECT * FROM contact_timeline_meta WHERE contact_id = ?`)
    .get(contactId) as TimelineMetaRow | undefined;
  if (existing) return rowToMeta(existing);

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO contact_timeline_meta (contact_id, workspace_id, updated_at)
       VALUES (@contact_id, @workspace_id, @updated_at)`,
    )
    .run({ contact_id: contactId, workspace_id: workspaceId, updated_at: now });

  return getOrCreateTimelineMeta(contactId, workspaceId);
}

export function updateTimelineMeta(
  contactId: string,
  input: UpdateContactTimelineMetaInput,
): ContactTimelineMeta | null {
  const contact = getContactById(contactId);
  if (!contact) return null;
  const meta = getOrCreateTimelineMeta(contactId, contact.workspace_id);
  const updated_at = new Date().toISOString();

  getDatabase()
    .prepare(
      `UPDATE contact_timeline_meta SET
        manual_summary = @manual_summary,
        relationship_owner_user_id = @relationship_owner_user_id,
        pinned_next_step = @pinned_next_step,
        updated_at = @updated_at
      WHERE contact_id = @contact_id`,
    )
    .run({
      contact_id: contactId,
      manual_summary: input.manual_summary ?? meta.manual_summary,
      relationship_owner_user_id:
        input.relationship_owner_user_id === null
          ? null
          : (input.relationship_owner_user_id ?? meta.relationship_owner_user_id ?? null),
      pinned_next_step: input.pinned_next_step ?? meta.pinned_next_step,
      updated_at,
    });

  return getOrCreateTimelineMeta(contactId, contact.workspace_id);
}

function startOfLocalDay(iso: string): Date {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d;
}

function classifyFollowUp(dueAt: string, now = new Date()): ContactFollowUpBucket {
  const due = startOfLocalDay(dueAt);
  const today = startOfLocalDay(now.toISOString());
  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "due_today";
  return "upcoming";
}

export function listWorkspaceFollowUps(options: {
  workspace_id: string;
  ctx: ContactAccessContext;
}): {
  overdue: ContactFollowUpItem[];
  due_today: ContactFollowUpItem[];
  upcoming: ContactFollowUpItem[];
} {
  const rows = getDatabase()
    .prepare(
      `SELECT i.*, c.display_name AS contact_display_name
       FROM contact_interactions i
       JOIN contacts c ON c.contact_id = i.contact_id
       WHERE i.workspace_id = ? AND i.follow_up_required = 1 AND i.follow_up_due_at IS NOT NULL
       ORDER BY i.follow_up_due_at ASC`,
    )
    .all(options.workspace_id) as (InteractionRow & { contact_display_name: string })[];

  const buckets = {
    overdue: [] as ContactFollowUpItem[],
    due_today: [] as ContactFollowUpItem[],
    upcoming: [] as ContactFollowUpItem[],
  };

  for (const row of rows) {
    const interaction = rowToInteraction(row);
    if (!canViewInteraction(interaction, options.ctx)) continue;
    const bucket = classifyFollowUp(interaction.follow_up_due_at!);
    buckets[bucket].push({
      interaction,
      contact_id: interaction.contact_id,
      contact_display_name: row.contact_display_name,
      bucket,
    });
  }

  return buckets;
}

export function buildAdvisoryTimelineSummary(
  interactions: readonly ContactInteraction[],
  pinned: ContactTimelinePinnedSummary,
): ContactTimelineAdvisorySummary {
  const citations = interactions.slice(0, 5).map((item) => ({
    interaction_id: item.id,
    summary: item.summary,
    occurred_at: item.occurred_at,
  }));

  const typeCounts = new Map<string, number>();
  for (const item of interactions) {
    typeCounts.set(item.type, (typeCounts.get(item.type) ?? 0) + 1);
  }
  const themes = [...typeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type.replace(/_/g, " "));

  const uncertainty: string[] = [];
  if (interactions.length === 0) {
    uncertainty.push("No timeline entries yet — summary is placeholder only.");
  }
  if (interactions.length < 3) {
    uncertainty.push("Limited interaction history — inference confidence is low.");
  }

  const summaryText =
    interactions.length === 0
      ? "No logged interactions yet. Add calls, notes, or events to build campaign memory."
      : `Based on ${interactions.length} timeline ${interactions.length === 1 ? "entry" : "entries"}${
          themes.length ? ` (${themes.join(", ")})` : ""
        }, this contact has an active relationship record.${pinned.manual_summary ? ` ${pinned.manual_summary}` : ""}`;

  const followUpItem = interactions.find((i) => i.follow_up_required);
  const suggested =
    pinned.pinned_next_step ||
    (followUpItem?.follow_up_due_at
      ? `Follow up by ${followUpItem.follow_up_due_at.slice(0, 10)}: ${followUpItem.summary}`
      : followUpItem
        ? `Complete follow-up: ${followUpItem.summary}`
        : "Review timeline and log the next human-initiated step.");

  return {
    advisory: true,
    notice: CONTACT_TIMELINE_ADVISORY_NOTICE,
    summary_text: summaryText,
    suggested_next_step: suggested,
    uncertainty_notes: uncertainty,
    citations,
    live_ai_wired: false,
  };
}

export function buildContactTimelineView(options: {
  contact_id: string;
  ctx: ContactAccessContext;
  type_filter?: string;
}): ContactTimelineView | null {
  const contact = getContactById(options.contact_id);
  if (!contact) return null;

  const meta = getOrCreateTimelineMeta(contact.contact_id, contact.workspace_id);
  const interactions = listContactInteractions({
    contact_id: contact.contact_id,
    type: options.type_filter,
    ctx: options.ctx,
  });

  const last = interactions[0];
  const nextFollowUp = interactions.find((i) => i.follow_up_required && i.follow_up_due_at);

  const pinned: ContactTimelinePinnedSummary = {
    manual_summary: meta.manual_summary,
    relationship_owner_user_id: meta.relationship_owner_user_id,
    last_contact_at: last?.occurred_at,
    last_contact_summary: last?.summary,
    pinned_next_step: meta.pinned_next_step,
    next_follow_up_due_at: nextFollowUp?.follow_up_due_at,
  };

  const followUps = listWorkspaceFollowUps({
    workspace_id: contact.workspace_id,
    ctx: options.ctx,
  });

  const contactFollowUps = {
    overdue: followUps.overdue.filter((f) => f.contact_id === contact.contact_id),
    due_today: followUps.due_today.filter((f) => f.contact_id === contact.contact_id),
    upcoming: followUps.upcoming.filter((f) => f.contact_id === contact.contact_id),
  };

  return {
    engine_id: CONTACT_TIMELINE_VERSION,
    contact_id: contact.contact_id,
    pinned,
    interactions,
    advisory_summary: buildAdvisoryTimelineSummary(interactions, pinned),
    follow_ups: contactFollowUps,
  };
}
