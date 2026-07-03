import crypto from "node:crypto";
import type {
  ContactDraftLink,
  ContactOutreachAuditEntry,
  ContactOutreachStatus,
  ContactRecipientRef,
  TraceableDraftGenerationResult,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getContactById, updateContact } from "./contactRepository.js";
import { ContactValidationError } from "./contactValidator.js";

type ContactDraftLinkRow = {
  link_id: string;
  workspace_id: string;
  contact_id: string;
  draft_id: string;
  request_id: string;
  intent_label: string;
  audience_label: string | null;
  body_preview: string;
  draft_json: string;
  recipient_snapshot_json: string;
  linked_at: string;
};

type ContactOutreachAuditRow = {
  audit_id: string;
  workspace_id: string;
  contact_id: string;
  outreach_status: string;
  note: string;
  draft_link_id: string | null;
  created_at: string;
};

function rowToLink(row: ContactDraftLinkRow): ContactDraftLink {
  const snapshot = JSON.parse(row.recipient_snapshot_json) as ContactDraftLink["recipient_snapshot"];
  return {
    link_id: row.link_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    draft_id: row.draft_id,
    request_id: row.request_id,
    intent_label: row.intent_label,
    audience_label: row.audience_label ?? undefined,
    body_preview: row.body_preview,
    linked_at: row.linked_at,
    recipient_snapshot: snapshot,
  };
}

function rowToAudit(row: ContactOutreachAuditRow): ContactOutreachAuditEntry {
  return {
    audit_id: row.audit_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    outreach_status: row.outreach_status as ContactOutreachStatus,
    note: row.note,
    draft_link_id: row.draft_link_id ?? undefined,
    created_at: row.created_at,
  };
}

export function createContactDraftLinks(options: {
  workspace_id: string;
  draft: TraceableDraftGenerationResult;
  request_id: string;
  intent_label: string;
  audience_label?: string;
  recipient_snapshots: readonly ContactDraftLink["recipient_snapshot"][];
}): ContactDraftLink[] {
  const bodyPreview = options.draft.draft.body_text.slice(0, 240);
  const draftJson = JSON.stringify(options.draft);
  const insert = getDatabase().prepare(
    `INSERT INTO contact_draft_links (
      link_id, workspace_id, contact_id, draft_id, request_id, intent_label,
      audience_label, body_preview, draft_json, recipient_snapshot_json
    ) VALUES (
      @link_id, @workspace_id, @contact_id, @draft_id, @request_id, @intent_label,
      @audience_label, @body_preview, @draft_json, @recipient_snapshot_json
    )`,
  );

  const links: ContactDraftLink[] = [];
  for (const snapshot of options.recipient_snapshots) {
    const linkId = crypto.randomUUID();
    insert.run({
      link_id: linkId,
      workspace_id: options.workspace_id,
      contact_id: snapshot.contact_id,
      draft_id: options.draft.draft.draft_id,
      request_id: options.request_id,
      intent_label: options.intent_label,
      audience_label: options.audience_label ?? null,
      body_preview: bodyPreview,
      draft_json: draftJson,
      recipient_snapshot_json: JSON.stringify(snapshot),
    });
    links.push({
      link_id: linkId,
      workspace_id: options.workspace_id,
      contact_id: snapshot.contact_id,
      draft_id: options.draft.draft.draft_id,
      request_id: options.request_id,
      intent_label: options.intent_label,
      audience_label: options.audience_label,
      body_preview: bodyPreview,
      linked_at: new Date().toISOString(),
      recipient_snapshot: snapshot,
    });
  }
  return links;
}

export function listContactDraftLinks(contactId: string): ContactDraftLink[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM contact_draft_links
       WHERE contact_id = ?
       ORDER BY linked_at DESC`,
    )
    .all(contactId) as ContactDraftLinkRow[];
  return rows.map(rowToLink);
}

export function getContactDraftLinkById(linkId: string): (ContactDraftLink & { draft: TraceableDraftGenerationResult }) | null {
  const row = getDatabase()
    .prepare("SELECT * FROM contact_draft_links WHERE link_id = ?")
    .get(linkId) as ContactDraftLinkRow | undefined;
  if (!row) return null;
  return {
    ...rowToLink(row),
    draft: JSON.parse(row.draft_json) as TraceableDraftGenerationResult,
  };
}

export function appendContactOutreachAudit(options: {
  workspace_id: string;
  contact_id: string;
  outreach_status: ContactOutreachStatus;
  note: string;
  draft_link_id?: string;
}): ContactOutreachAuditEntry {
  const auditId = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO contact_outreach_audit (
        audit_id, workspace_id, contact_id, outreach_status, note, draft_link_id
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      auditId,
      options.workspace_id,
      options.contact_id,
      options.outreach_status,
      options.note.trim(),
      options.draft_link_id ?? null,
    );
  return {
    audit_id: auditId,
    workspace_id: options.workspace_id,
    contact_id: options.contact_id,
    outreach_status: options.outreach_status,
    note: options.note.trim(),
    draft_link_id: options.draft_link_id,
    created_at: new Date().toISOString(),
  };
}

export function listContactOutreachAudit(contactId: string): ContactOutreachAuditEntry[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM contact_outreach_audit
       WHERE contact_id = ?
       ORDER BY created_at DESC`,
    )
    .all(contactId) as ContactOutreachAuditRow[];
  return rows.map(rowToAudit);
}

export function resolveRecipientSnapshots(
  workspaceId: string,
  contactId: string | undefined,
  recipientRefs: readonly ContactRecipientRef[] | undefined,
): ContactDraftLink["recipient_snapshot"][] {
  const ids = new Set<string>();
  if (contactId?.trim()) ids.add(contactId.trim());
  for (const ref of recipientRefs ?? []) {
    if (ref.contact_id?.trim()) ids.add(ref.contact_id.trim());
  }
  if (ids.size === 0) {
    throw new ContactValidationError("required_field", "At least one contact recipient is required");
  }

  const snapshots: ContactDraftLink["recipient_snapshot"][] = [];
  for (const id of ids) {
    const contact = getContactById(id);
    if (!contact || contact.workspace_id !== workspaceId) {
      throw new ContactValidationError("contact_not_found", `Contact ${id} not found in workspace`);
    }
    if (contact.archived) {
      throw new ContactValidationError("contact_archived", `Contact ${id} is archived`);
    }
    snapshots.push({
      contact_id: contact.contact_id,
      display_name: contact.display_name,
      email: contact.emails[0]?.email,
    });
  }
  return snapshots;
}

export function updateContactOutreachWithAudit(
  contactId: string,
  input: { outreach_status: ContactOutreachStatus; note: string; draft_link_id?: string },
) {
  const note = input.note.trim();
  if (!note) {
    throw new ContactValidationError("required_field", "Audit note is required for outreach updates");
  }

  const contact = getContactById(contactId);
  if (!contact) return null;

  const updated = updateContact(contactId, { outreach_status: input.outreach_status });
  if (!updated) return null;

  appendContactOutreachAudit({
    workspace_id: contact.workspace_id,
    contact_id: contactId,
    outreach_status: input.outreach_status,
    note,
    draft_link_id: input.draft_link_id,
  });

  return getContactById(contactId);
}
