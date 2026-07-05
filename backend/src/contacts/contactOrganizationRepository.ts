import crypto from "node:crypto";
import type {
  AddOrganizationMembershipInput,
  AssignOrganizationRoleInput,
  CreateOrganizationInput,
  MergeOrganizationsInput,
  Organization,
  OrganizationHistory,
  OrganizationHistoryAction,
  OrganizationMembership,
  OrganizationMembershipView,
  OrganizationRole,
  OrganizationSearchResult,
  OrganizationSummary,
  UpdateOrganizationInput,
  UpdateOrganizationMembershipInput,
} from "@localbrain/shared";
import {
  CONTACT_ORGANIZATION_ADVISORY_NOTICE,
  CONTACT_ORGANIZATION_VERSION,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getContactById } from "./contactRepository.js";
import { listContactInteractions } from "./contactInteractionRepository.js";
import { buildContactActionView } from "./contactActionRepository.js";
import { buildContactStewardshipView } from "./contactStewardshipRepository.js";
import { listHouseholdsForContact } from "./contactHouseholdRepository.js";
import { computeOrganizationMetrics } from "./contactOrganizationCompute.js";
import type { ContactAccessContext } from "./contactOrganizationValidator.js";
import {
  assertRoleCapable,
  canEditOrganizations,
  canViewOrganizations,
  validateAddMembershipInput,
  validateAssignRoleInput,
  validateCreateOrganizationInput,
  validateMergeOrganizationsInput,
  validateUpdateMembershipInput,
  validateUpdateOrganizationInput,
} from "./contactOrganizationValidator.js";

type OrgRow = {
  organization_id: string;
  workspace_id: string;
  name: string;
  category: string | null;
  description: string | null;
  status: string | null;
  archived: number;
  merged_into_organization_id: string | null;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

type MemberRow = {
  membership_id: string;
  workspace_id: string;
  organization_id: string;
  contact_id: string;
  membership_role: string;
  membership_status: string;
  custom_role_label: string | null;
  started_at: string | null;
  ended_at: string | null;
  effective_from: string;
  effective_until: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

type RoleRow = {
  role_id: string;
  membership_id: string;
  workspace_id: string;
  organization_id: string;
  contact_id: string;
  role: string;
  label: string | null;
  effective_from: string;
  effective_until: string | null;
  created_by_user_id: string;
  created_at: string;
};

type HistoryRow = {
  history_id: string;
  organization_id: string;
  workspace_id: string;
  action: string;
  summary: string;
  related_contact_id: string | null;
  related_organization_id: string | null;
  detail: string | null;
  changed_by_user_id: string;
  created_at: string;
};

function rowToOrganization(row: OrgRow): Organization {
  return {
    organization_id: row.organization_id,
    workspace_id: row.workspace_id,
    name: row.name,
    category: (row.category ?? "unknown") as Organization["category"],
    description: row.description ?? undefined,
    status: (row.status ?? (row.archived ? "archived" : "active")) as Organization["status"],
    archived: row.archived === 1,
    merged_into_organization_id: row.merged_into_organization_id ?? undefined,
    created_by_user_id: row.created_by_user_id ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToMembership(row: MemberRow): OrganizationMembership {
  return {
    membership_id: row.membership_id,
    workspace_id: row.workspace_id,
    organization_id: row.organization_id,
    contact_id: row.contact_id,
    membership_role: row.membership_role as OrganizationMembership["membership_role"],
    membership_status: row.membership_status as OrganizationMembership["membership_status"],
    custom_role_label: row.custom_role_label ?? undefined,
    started_at: row.started_at ?? undefined,
    ended_at: row.ended_at ?? undefined,
    effective_from: row.effective_from,
    effective_until: row.effective_until ?? undefined,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToRole(row: RoleRow): OrganizationRole {
  return {
    role_id: row.role_id,
    membership_id: row.membership_id,
    workspace_id: row.workspace_id,
    organization_id: row.organization_id,
    contact_id: row.contact_id,
    role: row.role as OrganizationRole["role"],
    label: row.label ?? undefined,
    effective_from: row.effective_from,
    effective_until: row.effective_until ?? undefined,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
  };
}

function rowToHistory(row: HistoryRow): OrganizationHistory {
  return {
    history_id: row.history_id,
    organization_id: row.organization_id,
    workspace_id: row.workspace_id,
    action: row.action as OrganizationHistoryAction,
    summary: row.summary,
    related_contact_id: row.related_contact_id ?? undefined,
    related_organization_id: row.related_organization_id ?? undefined,
    detail: row.detail ?? undefined,
    changed_by_user_id: row.changed_by_user_id,
    created_at: row.created_at,
  };
}

function appendHistory(options: {
  organization_id: string;
  workspace_id: string;
  action: OrganizationHistoryAction;
  summary: string;
  related_contact_id?: string;
  related_organization_id?: string;
  detail?: string;
  changed_by_user_id: string;
}): void {
  getDatabase()
    .prepare(
      `INSERT INTO contact_organization_history (
        history_id, organization_id, workspace_id, action, summary,
        related_contact_id, related_organization_id, detail, changed_by_user_id, created_at
      ) VALUES (
        @history_id, @organization_id, @workspace_id, @action, @summary,
        @related_contact_id, @related_organization_id, @detail, @changed_by_user_id, @created_at
      )`,
    )
    .run({
      history_id: crypto.randomUUID(),
      organization_id: options.organization_id,
      workspace_id: options.workspace_id,
      action: options.action,
      summary: options.summary,
      related_contact_id: options.related_contact_id ?? null,
      related_organization_id: options.related_organization_id ?? null,
      detail: options.detail ?? null,
      changed_by_user_id: options.changed_by_user_id,
      created_at: new Date().toISOString(),
    });
}

function syncLegacyLink(membership: OrganizationMembership): void {
  getDatabase()
    .prepare(
      `INSERT INTO contact_organization_links (contact_id, organization_id, role_label)
       VALUES (@contact_id, @organization_id, @role_label)
       ON CONFLICT(contact_id, organization_id) DO UPDATE SET role_label = excluded.role_label`,
    )
    .run({
      contact_id: membership.contact_id,
      organization_id: membership.organization_id,
      role_label: membership.custom_role_label ?? membership.membership_role,
    });
}

function removeLegacyLink(contactId: string, organizationId: string): void {
  getDatabase()
    .prepare(`DELETE FROM contact_organization_links WHERE contact_id = ? AND organization_id = ?`)
    .run(contactId, organizationId);
}

export function getOrganizationById(organizationId: string): Organization | null {
  const row = getDatabase()
    .prepare(`SELECT * FROM contact_organizations WHERE organization_id = ?`)
    .get(organizationId) as OrgRow | undefined;
  return row ? rowToOrganization(row) : null;
}

function memberToView(row: MemberRow): OrganizationMembershipView {
  const contact = getContactById(row.contact_id);
  return { ...rowToMembership(row), contact_display_name: contact?.display_name ?? row.contact_id };
}

function listMembershipRows(organizationId: string): MemberRow[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM contact_organization_members
       WHERE organization_id = ?
       ORDER BY effective_until IS NOT NULL, membership_status = 'active' DESC, created_at ASC`,
    )
    .all(organizationId) as MemberRow[];
}

function listActiveRoleRows(organizationId: string): RoleRow[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM contact_organization_roles
       WHERE organization_id = ? AND effective_until IS NULL
       ORDER BY created_at ASC`,
    )
    .all(organizationId) as RoleRow[];
}

function listOrganizationHistory(organizationId: string, limit = 50): OrganizationHistory[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM contact_organization_history
       WHERE organization_id = ? ORDER BY created_at DESC LIMIT ?`,
    )
    .all(organizationId, limit) as HistoryRow[];
  return rows.map(rowToHistory);
}

function countSharedHouseholds(contactIds: readonly string[]): number {
  if (contactIds.length < 2) return 0;
  const db = getDatabase();
  const householdSets = contactIds.map((contactId) => {
    const rows = db
      .prepare(
        `SELECT household_id FROM contact_household_members
         WHERE contact_id = ? AND effective_until IS NULL`,
      )
      .all(contactId) as { household_id: string }[];
    return new Set(rows.map((r) => r.household_id));
  });
  let shared = 0;
  const seen = new Set<string>();
  for (const set of householdSets) {
    for (const id of set) {
      if (seen.has(id)) continue;
      const count = householdSets.filter((s) => s.has(id)).length;
      if (count >= 2) {
        shared += 1;
        seen.add(id);
      }
    }
  }
  return shared;
}

function buildIntegration(contactIds: readonly string[], ctx: ContactAccessContext) {
  const stewardIds: string[] = [];
  let openActions = 0;
  let contextCount = 0;
  let householdCount = 0;
  const healthScores: number[] = [];

  for (const contactId of contactIds) {
    const stewardship = buildContactStewardshipView(contactId, ctx);
    if (stewardship?.stewardship.steward_user_id) {
      stewardIds.push(stewardship.stewardship.steward_user_id);
    }
    if (stewardship) healthScores.push(stewardship.computed.health_score);

    const actionView = buildContactActionView(contactId, ctx);
    if (actionView) openActions += actionView.summary.total_open_actions;

    const contextRow = getDatabase()
      .prepare(
        `SELECT COUNT(*) AS count FROM contact_context_links
         WHERE contact_id = ? AND effective_until IS NULL`,
      )
      .get(contactId) as { count: number };
    contextCount += contextRow.count;

    householdCount += listHouseholdsForContact(contactId, ctx).length;
  }

  return {
    stewardIds,
    openActions,
    contextCount,
    householdCount,
    healthScores,
    integration: {
      referenced_steward_user_ids: [...new Set(stewardIds)],
      referenced_open_action_count: openActions,
      referenced_context_count: contextCount,
      referenced_household_count: householdCount,
      notice: CONTACT_ORGANIZATION_ADVISORY_NOTICE,
    },
  };
}

export function buildOrganizationSummary(
  organizationId: string,
  ctx: ContactAccessContext,
): OrganizationSummary | null {
  if (!canViewOrganizations(ctx)) return null;
  const organization = getOrganizationById(organizationId);
  if (!organization || organization.status !== "active") return null;

  const memberships = listMembershipRows(organizationId).map(memberToView);
  const roles = listActiveRoleRows(organizationId).map(rowToRole);
  const activeMembers = memberships.filter((m) => !m.effective_until);
  const activeContactIds = activeMembers.map((m) => m.contact_id);

  const recentWindow = new Date();
  recentWindow.setDate(recentWindow.getDate() - 90);

  const recentActivityContactIds: string[] = [];
  for (const member of activeMembers) {
    const interactions = listContactInteractions({ contact_id: member.contact_id, ctx });
    if (interactions.some((i) => new Date(i.occurred_at) >= recentWindow)) {
      recentActivityContactIds.push(member.contact_id);
    }
  }

  const refs = buildIntegration(activeContactIds, ctx);
  const sharedHouseholdCount = countSharedHouseholds(activeContactIds);

  const metrics = computeOrganizationMetrics({
    memberships,
    roles,
    stewardUserIds: refs.stewardIds,
    healthScores: refs.healthScores,
    openActionCount: refs.openActions,
    recentMemberContactIds: recentActivityContactIds,
    sharedHouseholdCount,
  });

  return {
    engine_id: CONTACT_ORGANIZATION_VERSION,
    organization,
    memberships,
    roles,
    metrics,
    integration: refs.integration,
    history: listOrganizationHistory(organizationId),
  };
}

export function createOrganizationRecord(
  input: CreateOrganizationInput,
  ctx: ContactAccessContext,
): Organization | null {
  validateCreateOrganizationInput(input);
  assertRoleCapable(canEditOrganizations(ctx), "forbidden", "Insufficient permissions to create organizations");

  const now = new Date().toISOString();
  const organizationId = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO contact_organizations (
        organization_id, workspace_id, name, category, description, status, archived,
        merged_into_organization_id, created_by_user_id, created_at, updated_at
      ) VALUES (
        @organization_id, @workspace_id, @name, @category, @description, 'active', 0,
        NULL, @created_by_user_id, @created_at, @updated_at
      )`,
    )
    .run({
      organization_id: organizationId,
      workspace_id: input.workspace_id,
      name: input.name.trim(),
      category: input.category ?? "unknown",
      description: input.description?.trim() ?? null,
      created_by_user_id: input.created_by_user_id,
      created_at: now,
      updated_at: now,
    });

  appendHistory({
    organization_id: organizationId,
    workspace_id: input.workspace_id,
    action: "created",
    summary: `Organization "${input.name.trim()}" created`,
    changed_by_user_id: input.created_by_user_id,
  });

  return getOrganizationById(organizationId);
}

export function updateOrganizationRecord(
  organizationId: string,
  input: UpdateOrganizationInput,
  ctx: ContactAccessContext,
): Organization | null {
  validateUpdateOrganizationInput(input);
  assertRoleCapable(canEditOrganizations(ctx), "forbidden", "Insufficient permissions to update organizations");

  const existing = getOrganizationById(organizationId);
  if (!existing || existing.status !== "active") return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_organizations SET
        name = @name, category = @category, description = @description, updated_at = @updated_at
       WHERE organization_id = @organization_id`,
    )
    .run({
      organization_id: organizationId,
      name: input.name?.trim() ?? existing.name,
      category: input.category ?? existing.category,
      description:
        input.description === null ? null : (input.description ?? existing.description ?? null),
      updated_at: now,
    });

  appendHistory({
    organization_id: organizationId,
    workspace_id: existing.workspace_id,
    action: "updated",
    summary: "Organization updated",
    changed_by_user_id: input.updated_by_user_id,
  });

  return getOrganizationById(organizationId);
}

export function archiveOrganizationRecord(
  organizationId: string,
  ctx: ContactAccessContext,
  changedByUserId: string,
): Organization | null {
  assertRoleCapable(canEditOrganizations(ctx), "forbidden", "Insufficient permissions to archive organizations");
  const existing = getOrganizationById(organizationId);
  if (!existing || existing.status !== "active") return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_organizations SET archived = 1, status = 'archived', updated_at = @now WHERE organization_id = @id`,
    )
    .run({ id: organizationId, now });

  appendHistory({
    organization_id: organizationId,
    workspace_id: existing.workspace_id,
    action: "archived",
    summary: `Organization "${existing.name}" archived`,
    changed_by_user_id: changedByUserId,
  });

  return getOrganizationById(organizationId);
}

export function addOrganizationMembership(
  input: AddOrganizationMembershipInput,
  ctx: ContactAccessContext,
): OrganizationMembership | null {
  validateAddMembershipInput(input);
  assertRoleCapable(canEditOrganizations(ctx), "forbidden", "Insufficient permissions to add memberships");

  const organization = getOrganizationById(input.organization_id);
  if (!organization || organization.workspace_id !== input.workspace_id || organization.status !== "active") {
    return null;
  }

  const contact = getContactById(input.contact_id);
  if (!contact || contact.workspace_id !== input.workspace_id) return null;

  const conflict = getDatabase()
    .prepare(
      `SELECT membership_id FROM contact_organization_members
       WHERE organization_id = ? AND contact_id = ? AND effective_until IS NULL`,
    )
    .get(input.organization_id, input.contact_id) as { membership_id: string } | undefined;
  if (conflict) return null;

  const now = new Date().toISOString();
  const membershipId = crypto.randomUUID();
  const membership: OrganizationMembership = {
    membership_id: membershipId,
    workspace_id: input.workspace_id,
    organization_id: input.organization_id,
    contact_id: input.contact_id,
    membership_role: input.membership_role ?? "member",
    membership_status: input.membership_status ?? "active",
    custom_role_label: input.custom_role_label,
    started_at: input.started_at ?? now,
    effective_from: now,
    created_by_user_id: input.created_by_user_id,
    created_at: now,
    updated_at: now,
  };

  getDatabase()
    .prepare(
      `INSERT INTO contact_organization_members (
        membership_id, workspace_id, organization_id, contact_id, membership_role, membership_status,
        custom_role_label, started_at, ended_at, effective_from, effective_until,
        created_by_user_id, created_at, updated_at
      ) VALUES (
        @membership_id, @workspace_id, @organization_id, @contact_id, @membership_role, @membership_status,
        @custom_role_label, @started_at, NULL, @effective_from, NULL,
        @created_by_user_id, @created_at, @updated_at
      )`,
    )
    .run({
      membership_id: membership.membership_id,
      workspace_id: membership.workspace_id,
      organization_id: membership.organization_id,
      contact_id: membership.contact_id,
      membership_role: membership.membership_role,
      membership_status: membership.membership_status,
      custom_role_label: membership.custom_role_label ?? null,
      started_at: membership.started_at ?? null,
      effective_from: membership.effective_from,
      created_by_user_id: membership.created_by_user_id,
      created_at: membership.created_at,
      updated_at: membership.updated_at,
    });

  syncLegacyLink(membership);

  appendHistory({
    organization_id: input.organization_id,
    workspace_id: input.workspace_id,
    action: "membership_added",
    summary: `${contact.display_name} joined as ${membership.membership_role}`,
    related_contact_id: input.contact_id,
    changed_by_user_id: input.created_by_user_id,
  });

  return membership;
}

export function updateOrganizationMembership(
  membershipId: string,
  input: UpdateOrganizationMembershipInput,
  ctx: ContactAccessContext,
): OrganizationMembership | null {
  validateUpdateMembershipInput(input);
  assertRoleCapable(canEditOrganizations(ctx), "forbidden", "Insufficient permissions to update memberships");

  const row = getDatabase()
    .prepare(`SELECT * FROM contact_organization_members WHERE membership_id = ?`)
    .get(membershipId) as MemberRow | undefined;
  if (!row || row.effective_until) return null;

  const now = new Date().toISOString();
  const nextRole = input.membership_role ?? row.membership_role;
  const nextStatus = input.membership_status ?? row.membership_status;

  getDatabase()
    .prepare(
      `UPDATE contact_organization_members SET
        membership_role = @membership_role,
        membership_status = @membership_status,
        custom_role_label = @custom_role_label,
        started_at = @started_at,
        updated_at = @updated_at
       WHERE membership_id = @membership_id`,
    )
    .run({
      membership_id: membershipId,
      membership_role: nextRole,
      membership_status: nextStatus,
      custom_role_label:
        input.custom_role_label === null
          ? null
          : (input.custom_role_label ?? row.custom_role_label),
      started_at: input.started_at === null ? null : (input.started_at ?? row.started_at),
      updated_at: now,
    });

  const updated = rowToMembership({
    ...row,
    membership_role: nextRole,
    membership_status: nextStatus,
    updated_at: now,
  });
  syncLegacyLink(updated);

  if (nextRole !== row.membership_role) {
    appendHistory({
      organization_id: row.organization_id,
      workspace_id: row.workspace_id,
      action: "promoted",
      summary: `Role changed to ${nextRole}`,
      related_contact_id: row.contact_id,
      changed_by_user_id: input.updated_by_user_id,
    });
  }

  return updated;
}

export function endOrganizationMembership(
  membershipId: string,
  ctx: ContactAccessContext,
  changedByUserId: string,
): OrganizationMembership | null {
  assertRoleCapable(canEditOrganizations(ctx), "forbidden", "Insufficient permissions to end memberships");

  const row = getDatabase()
    .prepare(`SELECT * FROM contact_organization_members WHERE membership_id = ?`)
    .get(membershipId) as MemberRow | undefined;
  if (!row || row.effective_until) return null;

  const contact = getContactById(row.contact_id);
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_organization_members SET
        effective_until = @until, ended_at = @until, membership_status = 'former', updated_at = @until
       WHERE membership_id = @membership_id`,
    )
    .run({ membership_id: membershipId, until: now });

  removeLegacyLink(row.contact_id, row.organization_id);

  appendHistory({
    organization_id: row.organization_id,
    workspace_id: row.workspace_id,
    action: "membership_ended",
    summary: `${contact?.display_name ?? row.contact_id} membership ended`,
    related_contact_id: row.contact_id,
    changed_by_user_id: changedByUserId,
  });

  return rowToMembership({ ...row, effective_until: now, ended_at: now, membership_status: "former", updated_at: now });
}

export function assignOrganizationRole(
  input: AssignOrganizationRoleInput,
  ctx: ContactAccessContext,
): OrganizationRole | null {
  validateAssignRoleInput(input);
  assertRoleCapable(canEditOrganizations(ctx), "forbidden", "Insufficient permissions to assign roles");

  const membership = getDatabase()
    .prepare(`SELECT * FROM contact_organization_members WHERE membership_id = ? AND effective_until IS NULL`)
    .get(input.membership_id) as MemberRow | undefined;
  if (!membership || membership.organization_id !== input.organization_id) return null;

  const now = new Date().toISOString();
  const roleId = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO contact_organization_roles (
        role_id, membership_id, workspace_id, organization_id, contact_id, role, label,
        effective_from, effective_until, created_by_user_id, created_at
      ) VALUES (
        @role_id, @membership_id, @workspace_id, @organization_id, @contact_id, @role, @label,
        @effective_from, NULL, @created_by_user_id, @created_at
      )`,
    )
    .run({
      role_id: roleId,
      membership_id: input.membership_id,
      workspace_id: input.workspace_id,
      organization_id: input.organization_id,
      contact_id: input.contact_id,
      role: input.role,
      label: input.label ?? null,
      effective_from: now,
      created_by_user_id: input.created_by_user_id,
      created_at: now,
    });

  appendHistory({
    organization_id: input.organization_id,
    workspace_id: input.workspace_id,
    action: "role_assigned",
    summary: `${input.role} role assigned`,
    related_contact_id: input.contact_id,
    changed_by_user_id: input.created_by_user_id,
  });

  const roleRow = getDatabase()
    .prepare(`SELECT * FROM contact_organization_roles WHERE role_id = ?`)
    .get(roleId) as RoleRow;
  return rowToRole(roleRow);
}

export function mergeOrganizations(
  input: MergeOrganizationsInput,
  ctx: ContactAccessContext,
): OrganizationSummary | null {
  validateMergeOrganizationsInput(input);
  assertRoleCapable(canEditOrganizations(ctx), "forbidden", "Insufficient permissions to merge organizations");

  const from = getOrganizationById(input.from_organization_id);
  const to = getOrganizationById(input.to_organization_id);
  if (!from || !to) return null;
  if (from.workspace_id !== input.workspace_id || to.workspace_id !== input.workspace_id) return null;
  if (from.status !== "active" || to.status !== "active") return null;

  const db = getDatabase();
  const now = new Date().toISOString();
  const fromMembers = db
    .prepare(
      `SELECT * FROM contact_organization_members
       WHERE organization_id = ? AND effective_until IS NULL`,
    )
    .all(input.from_organization_id) as MemberRow[];

  for (const member of fromMembers) {
    db.prepare(
      `UPDATE contact_organization_members SET effective_until = @until, updated_at = @until WHERE membership_id = @id`,
    ).run({ id: member.membership_id, until: now });

    const exists = db
      .prepare(
        `SELECT membership_id FROM contact_organization_members
         WHERE organization_id = ? AND contact_id = ? AND effective_until IS NULL`,
      )
      .get(input.to_organization_id, member.contact_id);
    if (!exists) {
      addOrganizationMembership(
        {
          workspace_id: input.workspace_id,
          organization_id: input.to_organization_id,
          contact_id: member.contact_id,
          membership_role: member.membership_role as AddOrganizationMembershipInput["membership_role"],
          membership_status: member.membership_status as AddOrganizationMembershipInput["membership_status"],
          custom_role_label: member.custom_role_label ?? undefined,
          created_by_user_id: input.merged_by_user_id,
        },
        ctx,
      );
    } else {
      removeLegacyLink(member.contact_id, input.from_organization_id);
    }
  }

  db.prepare(
    `UPDATE contact_organizations SET status = 'merged', merged_into_organization_id = @to, archived = 1, updated_at = @now
     WHERE organization_id = @from`,
  ).run({ from: input.from_organization_id, to: input.to_organization_id, now });

  appendHistory({
    organization_id: input.from_organization_id,
    workspace_id: input.workspace_id,
    action: "merged",
    summary: `Merged into ${to.name}`,
    related_organization_id: input.to_organization_id,
    detail: input.reason,
    changed_by_user_id: input.merged_by_user_id,
  });
  appendHistory({
    organization_id: input.to_organization_id,
    workspace_id: input.workspace_id,
    action: "merged",
    summary: `Absorbed organization ${from.name}`,
    related_organization_id: input.from_organization_id,
    detail: input.reason,
    changed_by_user_id: input.merged_by_user_id,
  });

  return buildOrganizationSummary(input.to_organization_id, ctx);
}

export function listOrganizationsForContact(
  contactId: string,
  ctx: ContactAccessContext,
): OrganizationSummary[] {
  if (!canViewOrganizations(ctx)) return [];
  const rows = getDatabase()
    .prepare(
      `SELECT DISTINCT m.organization_id FROM contact_organization_members m
       JOIN contact_organizations o ON o.organization_id = m.organization_id
       WHERE m.contact_id = ? AND m.effective_until IS NULL AND o.status = 'active'`,
    )
    .all(contactId) as { organization_id: string }[];

  return rows
    .map((row) => buildOrganizationSummary(row.organization_id, ctx))
    .filter(Boolean) as OrganizationSummary[];
}

export function searchOrganizations(options: {
  workspace_id: string;
  search?: string;
  category?: string;
  ctx: ContactAccessContext;
}): OrganizationSearchResult[] {
  if (!canViewOrganizations(options.ctx)) return [];

  const term = options.search?.trim().toLowerCase();
  let sql = `
    SELECT o.organization_id, o.name, o.category, o.status,
      (SELECT COUNT(*) FROM contact_organization_members m
       WHERE m.organization_id = o.organization_id AND m.effective_until IS NULL) AS membership_count
    FROM contact_organizations o
    WHERE o.workspace_id = ? AND o.status = 'active'`;
  const params: unknown[] = [options.workspace_id];

  if (options.category?.trim()) {
    sql += ` AND o.category = ?`;
    params.push(options.category.trim());
  }

  if (term) {
    sql += ` AND (
      LOWER(o.name) LIKE ? OR LOWER(COALESCE(o.description, '')) LIKE ?
      OR EXISTS (
        SELECT 1 FROM contact_organization_members m
        JOIN contacts c ON c.contact_id = m.contact_id
        WHERE m.organization_id = o.organization_id AND m.effective_until IS NULL
          AND (LOWER(c.display_name) LIKE ? OR LOWER(COALESCE(m.membership_role, '')) LIKE ?
               OR LOWER(COALESCE(m.custom_role_label, '')) LIKE ?)
      )
    )`;
    const like = `%${term}%`;
    params.push(like, like, like, like, like);
  }

  sql += ` ORDER BY o.name ASC LIMIT 100`;
  const rows = getDatabase().prepare(sql).all(...params) as {
    organization_id: string;
    name: string;
    category: string | null;
    status: string;
    membership_count: number;
  }[];

  return rows.map((row) => ({
    organization_id: row.organization_id,
    name: row.name,
    category: (row.category ?? "unknown") as OrganizationSearchResult["category"],
    membership_count: row.membership_count,
    status: row.status as OrganizationSearchResult["status"],
  }));
}

export function listOrganizationHistoryExport(organizationId: string): OrganizationHistory[] {
  return listOrganizationHistory(organizationId, 200);
}

export function listOrganizationContacts(
  organizationId: string,
  ctx: ContactAccessContext,
): OrganizationMembershipView[] {
  if (!canViewOrganizations(ctx)) return [];
  return listMembershipRows(organizationId)
    .filter((row) => !row.effective_until)
    .map(memberToView);
}
