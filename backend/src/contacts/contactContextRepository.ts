import crypto from "node:crypto";
import type {
  AssignContactContextInput,
  ContactContextLink,
  ContactContextLinkHistoryEntry,
  ContactContextLinkWithContext,
  ContactContextView,
  ContactListFilter,
  CreateRelationshipContextInput,
  EndContactContextLinkInput,
  MergeRelationshipContextsInput,
  RelationshipContext,
  UpdateContactContextLinkInput,
  UpdateRelationshipContextInput,
} from "@localbrain/shared";
import { CONTACT_CONTEXT_VERSION } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getContactById, listContacts as listContactsBase } from "./contactRepository.js";
import type { ContactAccessContext } from "./contactContextValidator.js";
import {
  assertRoleCapable,
  canArchiveContext,
  canAssignContactContext,
  canCreateContextCatalog,
  canEditContextCatalog,
  canEndContactContextLink,
  canMergeContexts,
  validateAssignContextInput,
  validateCreateContextInput,
  validateMergeContextsInput,
  validateUpdateContextInput,
  validateUpdateLinkInput,
} from "./contactContextValidator.js";

type ContextRow = {
  context_id: string;
  workspace_id: string;
  label: string;
  category: string;
  status: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

type LinkRow = {
  link_id: string;
  workspace_id: string;
  contact_id: string;
  context_id: string;
  rank: string;
  effective_from: string;
  effective_until: string | null;
  source: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

function rowToContext(row: ContextRow): RelationshipContext {
  return {
    context_id: row.context_id,
    workspace_id: row.workspace_id,
    label: row.label,
    category: row.category as RelationshipContext["category"],
    status: row.status as RelationshipContext["status"],
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToLink(row: LinkRow): ContactContextLink {
  return {
    link_id: row.link_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    context_id: row.context_id,
    rank: row.rank as ContactContextLink["rank"],
    effective_from: row.effective_from,
    effective_until: row.effective_until ?? undefined,
    source: row.source as ContactContextLink["source"],
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function appendHistory(entry: {
  workspace_id: string;
  contact_id: string;
  context_id: string;
  link_id?: string;
  action: ContactContextLinkHistoryEntry["action"];
  reason: string;
  payload: Record<string, unknown>;
  created_by_user_id: string;
}): void {
  getDatabase()
    .prepare(
      `INSERT INTO contact_context_link_history (
        history_id, workspace_id, contact_id, context_id, link_id,
        action, reason, payload_json, created_by_user_id, created_at
      ) VALUES (
        @history_id, @workspace_id, @contact_id, @context_id, @link_id,
        @action, @reason, @payload_json, @created_by_user_id, @created_at
      )`,
    )
    .run({
      history_id: crypto.randomUUID(),
      workspace_id: entry.workspace_id,
      contact_id: entry.contact_id,
      context_id: entry.context_id,
      link_id: entry.link_id ?? null,
      action: entry.action,
      reason: entry.reason,
      payload_json: JSON.stringify(entry.payload),
      created_by_user_id: entry.created_by_user_id,
      created_at: new Date().toISOString(),
    });
}

function demoteOtherPrimaryLinks(contactId: string, exceptLinkId: string | null, now: string): void {
  getDatabase()
    .prepare(
      `UPDATE contact_context_links
       SET rank = 'secondary', updated_at = @now
       WHERE contact_id = @contact_id
         AND effective_until IS NULL
         AND rank = 'primary'
         AND (@except IS NULL OR link_id != @except)`,
    )
    .run({ contact_id: contactId, except: exceptLinkId, now });
}

export function createRelationshipContext(
  input: CreateRelationshipContextInput,
  ctx: ContactAccessContext,
): RelationshipContext {
  validateCreateContextInput(input);
  assertRoleCapable(canCreateContextCatalog(ctx), "forbidden", "Cannot create context catalog entry");

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const category = input.category ?? "other";

  getDatabase()
    .prepare(
      `INSERT INTO relationship_contexts (
        context_id, workspace_id, label, category, status,
        created_by_user_id, created_at, updated_at
      ) VALUES (
        @context_id, @workspace_id, @label, @category, 'active',
        @created_by_user_id, @created_at, @updated_at
      )`,
    )
    .run({
      context_id: id,
      workspace_id: input.workspace_id,
      label: input.label.trim(),
      category,
      created_by_user_id: input.created_by_user_id,
      created_at: now,
      updated_at: now,
    });

  return rowToContext(
    getDatabase()
      .prepare("SELECT * FROM relationship_contexts WHERE context_id = ?")
      .get(id) as ContextRow,
  );
}

export function updateRelationshipContext(
  contextId: string,
  input: UpdateRelationshipContextInput,
  ctx: ContactAccessContext,
): RelationshipContext | null {
  validateUpdateContextInput(input);
  assertRoleCapable(canEditContextCatalog(ctx), "forbidden", "Cannot edit context catalog entry");

  const existing = getDatabase()
    .prepare("SELECT * FROM relationship_contexts WHERE context_id = ?")
    .get(contextId) as ContextRow | undefined;
  if (!existing || existing.status === "archived") return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE relationship_contexts SET
        label = COALESCE(@label, label),
        category = COALESCE(@category, category),
        updated_at = @updated_at
       WHERE context_id = @context_id`,
    )
    .run({
      context_id: contextId,
      label: input.label?.trim() ?? null,
      category: input.category ?? null,
      updated_at: now,
    });

  return rowToContext(
    getDatabase()
      .prepare("SELECT * FROM relationship_contexts WHERE context_id = ?")
      .get(contextId) as ContextRow,
  );
}

export function archiveRelationshipContext(
  contextId: string,
  ctx: ContactAccessContext,
): RelationshipContext | null {
  assertRoleCapable(canArchiveContext(ctx), "forbidden", "Cannot archive context");

  const existing = getDatabase()
    .prepare("SELECT * FROM relationship_contexts WHERE context_id = ?")
    .get(contextId) as ContextRow | undefined;
  if (!existing) return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE relationship_contexts SET status = 'archived', updated_at = @now WHERE context_id = @context_id`,
    )
    .run({ context_id: contextId, now });

  return rowToContext(
    getDatabase()
      .prepare("SELECT * FROM relationship_contexts WHERE context_id = ?")
      .get(contextId) as ContextRow,
  );
}

export function listWorkspaceContexts(
  workspaceId: string,
  options?: { include_archived?: boolean },
): RelationshipContext[] {
  let sql = "SELECT * FROM relationship_contexts WHERE workspace_id = ?";
  if (!options?.include_archived) sql += " AND status = 'active'";
  sql += " ORDER BY label COLLATE NOCASE ASC";
  const rows = getDatabase().prepare(sql).all(workspaceId) as ContextRow[];
  return rows.map(rowToContext);
}

export function getRelationshipContext(contextId: string): RelationshipContext | null {
  const row = getDatabase()
    .prepare("SELECT * FROM relationship_contexts WHERE context_id = ?")
    .get(contextId) as ContextRow | undefined;
  return row ? rowToContext(row) : null;
}

function getActiveLinkForContext(contactId: string, contextId: string): LinkRow | undefined {
  return getDatabase()
    .prepare(
      `SELECT * FROM contact_context_links
       WHERE contact_id = ? AND context_id = ? AND effective_until IS NULL`,
    )
    .get(contactId, contextId) as LinkRow | undefined;
}

export function assignContactContext(
  input: AssignContactContextInput,
  ctx: ContactAccessContext,
): ContactContextLinkWithContext | null {
  validateAssignContextInput(input);
  assertRoleCapable(canAssignContactContext(ctx), "forbidden", "Cannot assign context to contact");

  const contact = getContactById(input.contact_id);
  const context = getRelationshipContext(input.context_id);
  if (!contact || contact.workspace_id !== input.workspace_id) return null;
  if (!context || context.workspace_id !== input.workspace_id || context.status !== "active") return null;

  if (getActiveLinkForContext(input.contact_id, input.context_id)) return null;

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const rank = input.rank ?? "secondary";
  const effectiveFrom = input.effective_from ?? now;

  if (rank === "primary") {
    demoteOtherPrimaryLinks(input.contact_id, null, now);
  }

  getDatabase()
    .prepare(
      `INSERT INTO contact_context_links (
        link_id, workspace_id, contact_id, context_id, rank, effective_from,
        effective_until, source, created_by_user_id, created_at, updated_at
      ) VALUES (
        @link_id, @workspace_id, @contact_id, @context_id, @rank, @effective_from,
        NULL, @source, @created_by_user_id, @created_at, @updated_at
      )`,
    )
    .run({
      link_id: id,
      workspace_id: input.workspace_id,
      contact_id: input.contact_id,
      context_id: input.context_id,
      rank,
      effective_from: effectiveFrom,
      source: input.source ?? "manual",
      created_by_user_id: input.created_by_user_id,
      created_at: now,
      updated_at: now,
    });

  appendHistory({
    workspace_id: input.workspace_id,
    contact_id: input.contact_id,
    context_id: input.context_id,
    link_id: id,
    action: "assigned",
    reason: input.reason ?? "",
    payload: { rank, source: input.source ?? "manual" },
    created_by_user_id: input.created_by_user_id,
  });

  const link = rowToLink(
    getDatabase()
      .prepare("SELECT * FROM contact_context_links WHERE link_id = ?")
      .get(id) as LinkRow,
  );
  return { ...link, context };
}

export function updateContactContextLink(
  linkId: string,
  input: UpdateContactContextLinkInput,
  ctx: ContactAccessContext,
): ContactContextLinkWithContext | null {
  validateUpdateLinkInput(input);
  assertRoleCapable(canAssignContactContext(ctx), "forbidden", "Cannot update context link");

  const row = getDatabase()
    .prepare("SELECT * FROM contact_context_links WHERE link_id = ?")
    .get(linkId) as LinkRow | undefined;
  if (!row || row.effective_until) return null;

  const context = getRelationshipContext(row.context_id);
  if (!context) return null;

  const now = new Date().toISOString();
  const newRank = input.rank ?? row.rank;

  if (newRank === "primary" && row.rank !== "primary") {
    demoteOtherPrimaryLinks(row.contact_id, linkId, now);
  }

  getDatabase()
    .prepare(
      `UPDATE contact_context_links SET
        rank = @rank,
        effective_from = COALESCE(@effective_from, effective_from),
        updated_at = @updated_at
       WHERE link_id = @link_id`,
    )
    .run({
      link_id: linkId,
      rank: newRank,
      effective_from: input.effective_from ?? null,
      updated_at: now,
    });

  if (input.rank && input.rank !== row.rank) {
    appendHistory({
      workspace_id: row.workspace_id,
      contact_id: row.contact_id,
      context_id: row.context_id,
      link_id: linkId,
      action: "rank_changed",
      reason: input.reason ?? "",
      payload: { from: row.rank, to: input.rank },
      created_by_user_id: ctx.user_id,
    });
  }

  const link = rowToLink(
    getDatabase()
      .prepare("SELECT * FROM contact_context_links WHERE link_id = ?")
      .get(linkId) as LinkRow,
  );
  return { ...link, context };
}

export function endContactContextLink(
  linkId: string,
  input: EndContactContextLinkInput,
  ctx: ContactAccessContext,
): ContactContextLink | null {
  assertRoleCapable(canEndContactContextLink(ctx), "forbidden", "Cannot end context link");

  const row = getDatabase()
    .prepare("SELECT * FROM contact_context_links WHERE link_id = ?")
    .get(linkId) as LinkRow | undefined;
  if (!row || row.effective_until) return null;

  const now = input.effective_until ?? new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_context_links SET effective_until = @until, updated_at = @until WHERE link_id = @link_id`,
    )
    .run({ link_id: linkId, until: now });

  appendHistory({
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    context_id: row.context_id,
    link_id: linkId,
    action: "ended",
    reason: input.reason ?? "",
    payload: { effective_until: now },
    created_by_user_id: input.ended_by_user_id,
  });

  return rowToLink(
    getDatabase()
      .prepare("SELECT * FROM contact_context_links WHERE link_id = ?")
      .get(linkId) as LinkRow,
  );
}

export function mergeRelationshipContexts(
  input: MergeRelationshipContextsInput,
  ctx: ContactAccessContext,
): { to_context: RelationshipContext; links_moved: number } | null {
  validateMergeContextsInput(input);
  assertRoleCapable(canMergeContexts(ctx), "forbidden", "Cannot merge contexts");

  const from = getRelationshipContext(input.from_context_id);
  const to = getRelationshipContext(input.to_context_id);
  if (!from || !to) return null;
  if (from.workspace_id !== input.workspace_id || to.workspace_id !== input.workspace_id) return null;
  if (from.status === "archived") return null;

  const db = getDatabase();
  const activeLinks = db
    .prepare(
      `SELECT * FROM contact_context_links WHERE context_id = ? AND effective_until IS NULL`,
    )
    .all(input.from_context_id) as LinkRow[];

  const now = new Date().toISOString();
  let moved = 0;

  for (const link of activeLinks) {
    const conflict = getActiveLinkForContext(link.contact_id, input.to_context_id);
    if (conflict) {
      db.prepare(
        `UPDATE contact_context_links SET effective_until = @until, updated_at = @until WHERE link_id = @link_id`,
      ).run({ link_id: link.link_id, until: now });
      appendHistory({
        workspace_id: link.workspace_id,
        contact_id: link.contact_id,
        context_id: link.context_id,
        link_id: link.link_id,
        action: "ended",
        reason: input.reason ?? "merge_superseded",
        payload: { merge_to: input.to_context_id },
        created_by_user_id: input.merged_by_user_id,
      });
      continue;
    }
    db.prepare(
      `UPDATE contact_context_links SET context_id = @to_id, updated_at = @now WHERE link_id = @link_id`,
    ).run({ to_id: input.to_context_id, link_id: link.link_id, now });
    appendHistory({
      workspace_id: link.workspace_id,
      contact_id: link.contact_id,
      context_id: input.to_context_id,
      link_id: link.link_id,
      action: "merged",
      reason: input.reason ?? "",
      payload: { from_context_id: input.from_context_id },
      created_by_user_id: input.merged_by_user_id,
    });
    moved += 1;
  }

  db.prepare(
    `INSERT INTO contact_context_merges (
      merge_id, workspace_id, from_context_id, to_context_id, merged_by_user_id, reason, created_at
    ) VALUES (
      @merge_id, @workspace_id, @from_context_id, @to_context_id, @merged_by_user_id, @reason, @created_at
    )`,
  ).run({
    merge_id: crypto.randomUUID(),
    workspace_id: input.workspace_id,
    from_context_id: input.from_context_id,
    to_context_id: input.to_context_id,
    merged_by_user_id: input.merged_by_user_id,
    reason: input.reason ?? "",
    created_at: now,
  });

  db.prepare(
    `UPDATE relationship_contexts SET status = 'archived', updated_at = @now WHERE context_id = @context_id`,
  ).run({ context_id: input.from_context_id, now });

  return { to_context: getRelationshipContext(input.to_context_id)!, links_moved: moved };
}

export function listContactContextView(contactId: string): ContactContextView | null {
  const contact = getContactById(contactId);
  if (!contact) return null;

  const rows = getDatabase()
    .prepare(
      `SELECT l.* FROM contact_context_links l
       WHERE l.contact_id = ? AND l.effective_until IS NULL
       ORDER BY CASE l.rank WHEN 'primary' THEN 0 ELSE 1 END, l.created_at ASC`,
    )
    .all(contactId) as LinkRow[];

  const links: ContactContextLinkWithContext[] = [];
  for (const row of rows) {
    const context = getRelationshipContext(row.context_id);
    if (context && context.status === "active") {
      links.push({ ...rowToLink(row), context });
    }
  }

  return {
    engine_id: CONTACT_CONTEXT_VERSION,
    contact_id: contactId,
    workspace_id: contact.workspace_id,
    links,
  };
}

export function listContactContextHistory(contactId: string): ContactContextLinkHistoryEntry[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM contact_context_link_history
       WHERE contact_id = ?
       ORDER BY created_at DESC`,
    )
    .all(contactId) as Array<{
    history_id: string;
    workspace_id: string;
    contact_id: string;
    context_id: string;
    link_id: string | null;
    action: string;
    reason: string;
    payload_json: string;
    created_by_user_id: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    history_id: row.history_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    context_id: row.context_id,
    link_id: row.link_id ?? undefined,
    action: row.action as ContactContextLinkHistoryEntry["action"],
    reason: row.reason,
    payload_json: row.payload_json,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
  }));
}

export function listContactsByContext(filter: ContactListFilter) {
  if (!filter.context_id) {
    return listContactsBase(filter);
  }

  const db = getDatabase();
  let sql = `
    SELECT DISTINCT c.contact_id FROM contacts c
    INNER JOIN contact_context_links l ON l.contact_id = c.contact_id
    WHERE c.workspace_id = ? AND l.context_id = ? AND l.effective_until IS NULL
  `;
  const params: string[] = [filter.workspace_id, filter.context_id];

  if (filter.context_primary_only) {
    sql += " AND l.rank = 'primary'";
  }
  if (!filter.include_archived) {
    sql += " AND c.archived = 0";
  }

  const joined = db.prepare(sql).all(...params) as { contact_id: string }[];
  const ids = new Set(joined.map((r) => r.contact_id));
  return listContactsBase({
    workspace_id: filter.workspace_id,
    include_archived: filter.include_archived,
    search: filter.search,
    tag: filter.tag,
    email: filter.email,
  }).filter((c) => ids.has(c.contact_id));
}
