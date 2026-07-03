import { getDatabase } from "../db/database.js";

export function migrateContactTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS contact_organizations (
      organization_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contacts (
      contact_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      display_name TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      emails_json TEXT NOT NULL DEFAULT '[]',
      phones_json TEXT NOT NULL DEFAULT '[]',
      addresses_json TEXT NOT NULL DEFAULT '[]',
      tags_json TEXT NOT NULL DEFAULT '[]',
      notes TEXT NOT NULL DEFAULT '',
      outreach_status TEXT NOT NULL DEFAULT 'none',
      archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_organization_links (
      contact_id TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      role_label TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (contact_id, organization_id),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id),
      FOREIGN KEY (organization_id) REFERENCES contact_organizations(organization_id)
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_workspace ON contacts(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_contacts_workspace_archived ON contacts(workspace_id, archived);
    CREATE INDEX IF NOT EXISTS idx_contact_orgs_workspace ON contact_organizations(workspace_id);

    CREATE TABLE IF NOT EXISTS contact_draft_links (
      link_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      draft_id TEXT NOT NULL,
      request_id TEXT NOT NULL,
      intent_label TEXT NOT NULL,
      audience_label TEXT,
      body_preview TEXT NOT NULL DEFAULT '',
      draft_json TEXT NOT NULL,
      recipient_snapshot_json TEXT NOT NULL,
      linked_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE TABLE IF NOT EXISTS contact_outreach_audit (
      audit_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      outreach_status TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      draft_link_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE INDEX IF NOT EXISTS idx_contact_draft_links_contact ON contact_draft_links(contact_id);
    CREATE INDEX IF NOT EXISTS idx_contact_draft_links_workspace ON contact_draft_links(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_contact_outreach_audit_contact ON contact_outreach_audit(contact_id);
  `);
}
