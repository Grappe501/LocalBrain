import crypto from "node:crypto";
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

    CREATE TABLE IF NOT EXISTS contact_interactions (
      interaction_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      type TEXT NOT NULL,
      summary TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      occurred_at TEXT NOT NULL,
      created_by_user_id TEXT NOT NULL,
      assigned_to_user_id TEXT,
      visibility TEXT NOT NULL DEFAULT 'campaign',
      sentiment TEXT NOT NULL DEFAULT 'unknown',
      follow_up_required INTEGER NOT NULL DEFAULT 0,
      follow_up_due_at TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE TABLE IF NOT EXISTS contact_timeline_meta (
      contact_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      manual_summary TEXT NOT NULL DEFAULT '',
      relationship_owner_user_id TEXT,
      pinned_next_step TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE INDEX IF NOT EXISTS idx_contact_interactions_contact ON contact_interactions(contact_id);
    CREATE INDEX IF NOT EXISTS idx_contact_interactions_workspace ON contact_interactions(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_contact_interactions_follow_up ON contact_interactions(follow_up_required, follow_up_due_at);

    CREATE TABLE IF NOT EXISTS relationship_contexts (
      context_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      label TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      status TEXT NOT NULL DEFAULT 'active',
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_context_links (
      link_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      context_id TEXT NOT NULL,
      rank TEXT NOT NULL DEFAULT 'secondary',
      effective_from TEXT NOT NULL,
      effective_until TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id),
      FOREIGN KEY (context_id) REFERENCES relationship_contexts(context_id)
    );

    CREATE TABLE IF NOT EXISTS contact_context_link_history (
      history_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      context_id TEXT NOT NULL,
      link_id TEXT,
      action TEXT NOT NULL,
      reason TEXT NOT NULL DEFAULT '',
      payload_json TEXT NOT NULL DEFAULT '{}',
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_context_merges (
      merge_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      from_context_id TEXT NOT NULL,
      to_context_id TEXT NOT NULL,
      merged_by_user_id TEXT NOT NULL,
      reason TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_relationship_contexts_workspace ON relationship_contexts(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_contact_context_links_contact ON contact_context_links(contact_id);
    CREATE INDEX IF NOT EXISTS idx_contact_context_links_context ON contact_context_links(context_id);
    CREATE INDEX IF NOT EXISTS idx_contact_context_links_active ON contact_context_links(contact_id, effective_until);

    CREATE TABLE IF NOT EXISTS contact_stewardship (
      contact_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      steward_user_id TEXT,
      strength TEXT NOT NULL DEFAULT 'unknown',
      lifecycle_stage TEXT NOT NULL DEFAULT 'unknown',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_by_user_id TEXT,
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE TABLE IF NOT EXISTS contact_steward_participants (
      participant_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      label TEXT,
      effective_until TEXT,
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE TABLE IF NOT EXISTS contact_steward_transitions (
      transition_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      from_steward_user_id TEXT,
      to_steward_user_id TEXT NOT NULL,
      reason TEXT NOT NULL DEFAULT '',
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE INDEX IF NOT EXISTS idx_contact_stewardship_workspace ON contact_stewardship(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_contact_steward_participants_contact ON contact_steward_participants(contact_id);
    CREATE INDEX IF NOT EXISTS idx_contact_steward_transitions_contact ON contact_steward_transitions(contact_id);

    CREATE TABLE IF NOT EXISTS contact_action_tasks (
      task_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      title TEXT NOT NULL,
      details TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      priority TEXT NOT NULL DEFAULT 'normal',
      assigned_to_user_id TEXT,
      due_at TEXT,
      interaction_id TEXT,
      context_id TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      completed_by_user_id TEXT,
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE TABLE IF NOT EXISTS contact_action_task_history (
      history_id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      from_status TEXT,
      to_status TEXT NOT NULL,
      note TEXT,
      changed_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (task_id) REFERENCES contact_action_tasks(task_id)
    );

    CREATE INDEX IF NOT EXISTS idx_contact_action_tasks_workspace ON contact_action_tasks(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_contact_action_tasks_contact ON contact_action_tasks(contact_id);
    CREATE INDEX IF NOT EXISTS idx_contact_action_tasks_status ON contact_action_tasks(workspace_id, status);
    CREATE INDEX IF NOT EXISTS idx_contact_action_tasks_assigned ON contact_action_tasks(assigned_to_user_id, status);
    CREATE INDEX IF NOT EXISTS idx_contact_action_task_history_contact ON contact_action_task_history(contact_id);

    CREATE TABLE IF NOT EXISTS contact_households (
      household_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      primary_address_json TEXT,
      voting_district TEXT,
      primary_contact_id TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      merged_into_household_id TEXT,
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_household_members (
      member_id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      role TEXT NOT NULL,
      relationship_label TEXT,
      is_primary_residence INTEGER NOT NULL DEFAULT 0,
      effective_from TEXT NOT NULL,
      effective_until TEXT,
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (household_id) REFERENCES contact_households(household_id),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE TABLE IF NOT EXISTS contact_household_relationships (
      relationship_id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      from_contact_id TEXT NOT NULL,
      to_contact_id TEXT NOT NULL,
      relationship_type TEXT NOT NULL,
      label TEXT,
      effective_from TEXT NOT NULL,
      effective_until TEXT,
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (household_id) REFERENCES contact_households(household_id)
    );

    CREATE TABLE IF NOT EXISTS contact_household_history (
      history_id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      action TEXT NOT NULL,
      summary TEXT NOT NULL,
      related_contact_id TEXT,
      related_household_id TEXT,
      detail TEXT,
      changed_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (household_id) REFERENCES contact_households(household_id)
    );

    CREATE INDEX IF NOT EXISTS idx_contact_households_workspace ON contact_households(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_contact_household_members_contact ON contact_household_members(contact_id);
    CREATE INDEX IF NOT EXISTS idx_contact_household_members_household ON contact_household_members(household_id);
    CREATE INDEX IF NOT EXISTS idx_contact_household_history_household ON contact_household_history(household_id);

    CREATE TABLE IF NOT EXISTS contact_organization_members (
      membership_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      membership_role TEXT NOT NULL DEFAULT 'member',
      membership_status TEXT NOT NULL DEFAULT 'active',
      custom_role_label TEXT,
      started_at TEXT,
      ended_at TEXT,
      effective_from TEXT NOT NULL,
      effective_until TEXT,
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (organization_id) REFERENCES contact_organizations(organization_id),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );

    CREATE TABLE IF NOT EXISTS contact_organization_roles (
      role_id TEXT PRIMARY KEY,
      membership_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      role TEXT NOT NULL,
      label TEXT,
      effective_from TEXT NOT NULL,
      effective_until TEXT,
      created_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (membership_id) REFERENCES contact_organization_members(membership_id)
    );

    CREATE TABLE IF NOT EXISTS contact_organization_history (
      history_id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      action TEXT NOT NULL,
      summary TEXT NOT NULL,
      related_contact_id TEXT,
      related_organization_id TEXT,
      detail TEXT,
      changed_by_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (organization_id) REFERENCES contact_organizations(organization_id)
    );

    CREATE INDEX IF NOT EXISTS idx_contact_org_members_org ON contact_organization_members(organization_id);
    CREATE INDEX IF NOT EXISTS idx_contact_org_members_contact ON contact_organization_members(contact_id);
    CREATE INDEX IF NOT EXISTS idx_contact_org_history_org ON contact_organization_history(organization_id);

    CREATE TABLE IF NOT EXISTS contact_brief_cache (
      contact_id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      generated_by_user_id TEXT NOT NULL,
      regeneration_count INTEGER NOT NULL DEFAULT 0,
      operator_approved INTEGER NOT NULL DEFAULT 0,
      operator_approved_by_user_id TEXT,
      operator_approved_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
    );
  `);

  const alterColumns = [
    `ALTER TABLE contact_organizations ADD COLUMN category TEXT NOT NULL DEFAULT 'unknown'`,
    `ALTER TABLE contact_organizations ADD COLUMN description TEXT`,
    `ALTER TABLE contact_organizations ADD COLUMN status TEXT NOT NULL DEFAULT 'active'`,
    `ALTER TABLE contact_organizations ADD COLUMN merged_into_organization_id TEXT`,
    `ALTER TABLE contact_organizations ADD COLUMN created_by_user_id TEXT`,
  ];
  for (const sql of alterColumns) {
    try {
      getDatabase().exec(sql);
    } catch {
      /* column exists */
    }
  }

  migrateLegacyOrganizationLinks();

  try {
    getDatabase().exec(`ALTER TABLE contact_interactions ADD COLUMN context_id TEXT REFERENCES relationship_contexts(context_id)`);
  } catch {
    /* column exists */
  }
}

function migrateLegacyOrganizationLinks(): void {
  const db = getDatabase();
  const links = db.prepare(`SELECT * FROM contact_organization_links`).all() as {
    contact_id: string;
    organization_id: string;
    role_label: string | null;
    created_at: string;
  }[];

  for (const link of links) {
    const exists = db
      .prepare(
        `SELECT membership_id FROM contact_organization_members
         WHERE organization_id = ? AND contact_id = ?`,
      )
      .get(link.organization_id, link.contact_id);
    if (exists) continue;

    const org = db
      .prepare(`SELECT workspace_id FROM contact_organizations WHERE organization_id = ?`)
      .get(link.organization_id) as { workspace_id: string } | undefined;
    if (!org) continue;

    const now = link.created_at ?? new Date().toISOString();
    db.prepare(
      `INSERT INTO contact_organization_members (
        membership_id, workspace_id, organization_id, contact_id, membership_role, membership_status,
        custom_role_label, started_at, ended_at, effective_from, effective_until,
        created_by_user_id, created_at, updated_at
      ) VALUES (
        @membership_id, @workspace_id, @organization_id, @contact_id, 'member', 'active',
        @custom_role_label, @started_at, NULL, @effective_from, NULL,
        'legacy-migration', @created_at, @updated_at
      )`,
    ).run({
      membership_id: crypto.randomUUID(),
      workspace_id: org.workspace_id,
      organization_id: link.organization_id,
      contact_id: link.contact_id,
      custom_role_label: link.role_label,
      started_at: now,
      effective_from: now,
      created_at: now,
      updated_at: now,
    });
  }
}
