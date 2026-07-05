import crypto from "node:crypto";
import type {
  AddContactHouseholdMemberInput,
  AddContactHouseholdRelationshipInput,
  ContactHousehold,
  ContactHouseholdAddress,
  ContactHouseholdHistory,
  ContactHouseholdHistoryAction,
  ContactHouseholdIntegration,
  ContactHouseholdLookupRow,
  ContactHouseholdMember,
  ContactHouseholdMemberView,
  ContactHouseholdRelationship,
  ContactHouseholdSummary,
  CreateContactHouseholdInput,
  MergeContactHouseholdsInput,
  SplitContactHouseholdInput,
  TransferPrimaryResidenceInput,
  UpdateContactHouseholdInput,
} from "@localbrain/shared";
import {
  CONTACT_HOUSEHOLD_ADVISORY_NOTICE,
  CONTACT_HOUSEHOLD_VERSION,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getContactById } from "./contactRepository.js";
import { listContactInteractions } from "./contactInteractionRepository.js";
import { buildContactActionView } from "./contactActionRepository.js";
import { computeHouseholdMetrics } from "./contactHouseholdCompute.js";
import type { ContactAccessContext } from "./contactHouseholdValidator.js";
import {
  assertRoleCapable,
  canEditHouseholds,
  canViewHouseholds,
  validateAddMemberInput,
  validateAddRelationshipInput,
  validateCreateHouseholdInput,
  validateMergeHouseholdsInput,
  validateSplitHouseholdInput,
  validateTransferPrimaryResidenceInput,
  validateUpdateHouseholdInput,
} from "./contactHouseholdValidator.js";

type HouseholdRow = {
  household_id: string;
  workspace_id: string;
  name: string;
  primary_address_json: string | null;
  voting_district: string | null;
  primary_contact_id: string | null;
  status: string;
  merged_into_household_id: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

type MemberRow = {
  member_id: string;
  household_id: string;
  workspace_id: string;
  contact_id: string;
  role: string;
  relationship_label: string | null;
  is_primary_residence: number;
  effective_from: string;
  effective_until: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

type RelationshipRow = {
  relationship_id: string;
  household_id: string;
  workspace_id: string;
  from_contact_id: string;
  to_contact_id: string;
  relationship_type: string;
  label: string | null;
  effective_from: string;
  effective_until: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

type HistoryRow = {
  history_id: string;
  household_id: string;
  workspace_id: string;
  action: string;
  summary: string;
  related_contact_id: string | null;
  related_household_id: string | null;
  detail: string | null;
  changed_by_user_id: string;
  created_at: string;
};

function parseAddress(json: string | null): ContactHouseholdAddress | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as ContactHouseholdAddress;
  } catch {
    return undefined;
  }
}

function serializeAddress(address?: ContactHouseholdAddress | null): string | null {
  if (!address) return null;
  return JSON.stringify(address);
}

function rowToHousehold(row: HouseholdRow): ContactHousehold {
  return {
    household_id: row.household_id,
    workspace_id: row.workspace_id,
    name: row.name,
    primary_address: parseAddress(row.primary_address_json),
    voting_district: row.voting_district ?? undefined,
    primary_contact_id: row.primary_contact_id ?? undefined,
    status: row.status as ContactHousehold["status"],
    merged_into_household_id: row.merged_into_household_id ?? undefined,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToMember(row: MemberRow): ContactHouseholdMember {
  return {
    member_id: row.member_id,
    household_id: row.household_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    role: row.role as ContactHouseholdMember["role"],
    relationship_label: row.relationship_label ?? undefined,
    is_primary_residence: row.is_primary_residence === 1,
    effective_from: row.effective_from,
    effective_until: row.effective_until ?? undefined,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToRelationship(row: RelationshipRow): ContactHouseholdRelationship {
  return {
    relationship_id: row.relationship_id,
    household_id: row.household_id,
    workspace_id: row.workspace_id,
    from_contact_id: row.from_contact_id,
    to_contact_id: row.to_contact_id,
    relationship_type: row.relationship_type as ContactHouseholdRelationship["relationship_type"],
    label: row.label ?? undefined,
    effective_from: row.effective_from,
    effective_until: row.effective_until ?? undefined,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToHistory(row: HistoryRow): ContactHouseholdHistory {
  return {
    history_id: row.history_id,
    household_id: row.household_id,
    workspace_id: row.workspace_id,
    action: row.action as ContactHouseholdHistoryAction,
    summary: row.summary,
    related_contact_id: row.related_contact_id ?? undefined,
    related_household_id: row.related_household_id ?? undefined,
    detail: row.detail ?? undefined,
    changed_by_user_id: row.changed_by_user_id,
    created_at: row.created_at,
  };
}

function appendHistory(options: {
  household_id: string;
  workspace_id: string;
  action: ContactHouseholdHistoryAction;
  summary: string;
  related_contact_id?: string;
  related_household_id?: string;
  detail?: string;
  changed_by_user_id: string;
}): void {
  getDatabase()
    .prepare(
      `INSERT INTO contact_household_history (
        history_id, household_id, workspace_id, action, summary,
        related_contact_id, related_household_id, detail, changed_by_user_id, created_at
      ) VALUES (
        @history_id, @household_id, @workspace_id, @action, @summary,
        @related_contact_id, @related_household_id, @detail, @changed_by_user_id, @created_at
      )`,
    )
    .run({
      history_id: crypto.randomUUID(),
      household_id: options.household_id,
      workspace_id: options.workspace_id,
      action: options.action,
      summary: options.summary,
      related_contact_id: options.related_contact_id ?? null,
      related_household_id: options.related_household_id ?? null,
      detail: options.detail ?? null,
      changed_by_user_id: options.changed_by_user_id,
      created_at: new Date().toISOString(),
    });
}

function getHouseholdRow(householdId: string): HouseholdRow | undefined {
  return getDatabase()
    .prepare(`SELECT * FROM contact_households WHERE household_id = ?`)
    .get(householdId) as HouseholdRow | undefined;
}

export function getHouseholdById(householdId: string): ContactHousehold | null {
  const row = getHouseholdRow(householdId);
  return row ? rowToHousehold(row) : null;
}

function listActiveMembers(householdId: string): MemberRow[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM contact_household_members
       WHERE household_id = ? AND effective_until IS NULL
       ORDER BY is_primary_residence DESC, created_at ASC`,
    )
    .all(householdId) as MemberRow[];
}

function listAllMembers(householdId: string): MemberRow[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM contact_household_members
       WHERE household_id = ?
       ORDER BY effective_until IS NOT NULL, is_primary_residence DESC, created_at ASC`,
    )
    .all(householdId) as MemberRow[];
}

function listActiveRelationships(householdId: string): RelationshipRow[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM contact_household_relationships
       WHERE household_id = ? AND effective_until IS NULL
       ORDER BY created_at ASC`,
    )
    .all(householdId) as RelationshipRow[];
}

function listHouseholdHistory(householdId: string, limit = 50): ContactHouseholdHistory[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM contact_household_history
       WHERE household_id = ? ORDER BY created_at DESC LIMIT ?`,
    )
    .all(householdId, limit) as HistoryRow[];
  return rows.map(rowToHistory);
}

function memberToView(row: MemberRow): ContactHouseholdMemberView {
  const contact = getContactById(row.contact_id);
  return {
    ...rowToMember(row),
    contact_display_name: contact?.display_name ?? row.contact_id,
  };
}

function readStewardUserId(contactId: string): string | undefined {
  const row = getDatabase()
    .prepare(`SELECT steward_user_id FROM contact_stewardship WHERE contact_id = ?`)
    .get(contactId) as { steward_user_id: string | null } | undefined;
  return row?.steward_user_id ?? undefined;
}

function countActiveContexts(contactId: string): number {
  const row = getDatabase()
    .prepare(
      `SELECT COUNT(*) AS count FROM contact_context_links
       WHERE contact_id = ? AND effective_until IS NULL`,
    )
    .get(contactId) as { count: number };
  return row.count;
}

function buildIntegration(
  memberContactIds: readonly string[],
  ctx: ContactAccessContext,
): ContactHouseholdIntegration {
  const stewardIds: string[] = [];
  let openActions = 0;
  let contextCount = 0;

  for (const contactId of memberContactIds) {
    const steward = readStewardUserId(contactId);
    if (steward) stewardIds.push(steward);
    contextCount += countActiveContexts(contactId);
    const actionView = buildContactActionView(contactId, ctx);
    if (actionView) openActions += actionView.summary.total_open_actions;
  }

  return {
    referenced_steward_user_ids: [...new Set(stewardIds)],
    referenced_open_action_count: openActions,
    referenced_context_count: contextCount,
    notice: CONTACT_HOUSEHOLD_ADVISORY_NOTICE,
  };
}

export function buildHouseholdSummary(
  householdId: string,
  ctx: ContactAccessContext,
): ContactHouseholdSummary | null {
  if (!canViewHouseholds(ctx)) return null;
  const household = getHouseholdById(householdId);
  if (!household || household.status !== "active") return null;

  const memberRows = listAllMembers(householdId);
  const members = memberRows.map(memberToView);
  const activeMembers = members.filter((m) => !m.effective_until);
  const relationships = listActiveRelationships(householdId).map(rowToRelationship);

  const contacts = new Map(
    activeMembers
      .map((m) => {
        const contact = getContactById(m.contact_id);
        return contact ? ([m.contact_id, contact] as const) : null;
      })
      .filter(Boolean) as [string, NonNullable<ReturnType<typeof getContactById>>][],
  );

  const recentWindow = new Date();
  recentWindow.setDate(recentWindow.getDate() - 90);
  const recentActivityContactIds: string[] = [];
  for (const member of activeMembers) {
    const interactions = listContactInteractions({
      contact_id: member.contact_id,
      ctx,
    });
    if (interactions.some((i) => new Date(i.occurred_at) >= recentWindow)) {
      recentActivityContactIds.push(member.contact_id);
    }
  }

  const integration = buildIntegration(
    activeMembers.map((m) => m.contact_id),
    ctx,
  );
  const stewardUserIds = integration.referenced_steward_user_ids;

  const computed = computeHouseholdMetrics({
    members,
    relationships,
    contacts,
    activeMemberContactIds: activeMembers.map((m) => m.contact_id),
    recentActivityContactIds,
    openActionCount: integration.referenced_open_action_count,
    stewardUserIds,
  });

  return {
    engine_id: CONTACT_HOUSEHOLD_VERSION,
    household,
    members,
    relationships,
    computed,
    integration,
    history: listHouseholdHistory(householdId),
  };
}

export function createHousehold(
  input: CreateContactHouseholdInput,
  ctx: ContactAccessContext,
): ContactHousehold | null {
  validateCreateHouseholdInput(input);
  assertRoleCapable(canEditHouseholds(ctx), "forbidden", "Insufficient permissions to create households");

  if (input.primary_contact_id) {
    const contact = getContactById(input.primary_contact_id);
    if (!contact || contact.workspace_id !== input.workspace_id) return null;
  }

  const now = new Date().toISOString();
  const householdId = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO contact_households (
        household_id, workspace_id, name, primary_address_json, voting_district,
        primary_contact_id, status, merged_into_household_id,
        created_by_user_id, created_at, updated_at
      ) VALUES (
        @household_id, @workspace_id, @name, @primary_address_json, @voting_district,
        @primary_contact_id, 'active', NULL,
        @created_by_user_id, @created_at, @updated_at
      )`,
    )
    .run({
      household_id: householdId,
      workspace_id: input.workspace_id,
      name: input.name.trim(),
      primary_address_json: serializeAddress(input.primary_address),
      voting_district: input.voting_district ?? null,
      primary_contact_id: input.primary_contact_id ?? null,
      created_by_user_id: input.created_by_user_id,
      created_at: now,
      updated_at: now,
    });

  appendHistory({
    household_id: householdId,
    workspace_id: input.workspace_id,
    action: "created",
    summary: `Household "${input.name.trim()}" created`,
    changed_by_user_id: input.created_by_user_id,
  });

  if (input.primary_contact_id) {
    addHouseholdMember(
      {
        workspace_id: input.workspace_id,
        household_id: householdId,
        contact_id: input.primary_contact_id,
        role: "head",
        is_primary_residence: true,
        created_by_user_id: input.created_by_user_id,
      },
      ctx,
    );
  }

  return getHouseholdById(householdId);
}

export function updateHousehold(
  householdId: string,
  input: UpdateContactHouseholdInput,
  ctx: ContactAccessContext,
): ContactHousehold | null {
  validateUpdateHouseholdInput(input);
  assertRoleCapable(canEditHouseholds(ctx), "forbidden", "Insufficient permissions to update households");

  const existing = getHouseholdById(householdId);
  if (!existing || existing.status !== "active") return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_households SET
        name = @name,
        primary_address_json = @primary_address_json,
        voting_district = @voting_district,
        primary_contact_id = @primary_contact_id,
        updated_at = @updated_at
       WHERE household_id = @household_id`,
    )
    .run({
      household_id: householdId,
      name: input.name?.trim() ?? existing.name,
      primary_address_json:
        input.primary_address === null
          ? null
          : serializeAddress(input.primary_address ?? existing.primary_address),
      voting_district:
        input.voting_district === null
          ? null
          : (input.voting_district ?? existing.voting_district ?? null),
      primary_contact_id:
        input.primary_contact_id === null
          ? null
          : (input.primary_contact_id ?? existing.primary_contact_id ?? null),
      updated_at: now,
    });

  appendHistory({
    household_id: householdId,
    workspace_id: existing.workspace_id,
    action: "updated",
    summary: "Household updated",
    changed_by_user_id: input.updated_by_user_id,
  });

  return getHouseholdById(householdId);
}

export function addHouseholdMember(
  input: AddContactHouseholdMemberInput,
  ctx: ContactAccessContext,
): ContactHouseholdMember | null {
  validateAddMemberInput(input);
  assertRoleCapable(canEditHouseholds(ctx), "forbidden", "Insufficient permissions to add members");

  const household = getHouseholdById(input.household_id);
  if (!household || household.workspace_id !== input.workspace_id || household.status !== "active") {
    return null;
  }

  const contact = getContactById(input.contact_id);
  if (!contact || contact.workspace_id !== input.workspace_id) return null;

  const conflict = getDatabase()
    .prepare(
      `SELECT member_id FROM contact_household_members
       WHERE household_id = ? AND contact_id = ? AND effective_until IS NULL`,
    )
    .get(input.household_id, input.contact_id) as { member_id: string } | undefined;
  if (conflict) return null;

  const now = new Date().toISOString();
  const memberId = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO contact_household_members (
        member_id, household_id, workspace_id, contact_id, role, relationship_label,
        is_primary_residence, effective_from, effective_until,
        created_by_user_id, created_at, updated_at
      ) VALUES (
        @member_id, @household_id, @workspace_id, @contact_id, @role, @relationship_label,
        @is_primary_residence, @effective_from, NULL,
        @created_by_user_id, @created_at, @updated_at
      )`,
    )
    .run({
      member_id: memberId,
      household_id: input.household_id,
      workspace_id: input.workspace_id,
      contact_id: input.contact_id,
      role: input.role,
      relationship_label: input.relationship_label ?? null,
      is_primary_residence: input.is_primary_residence ? 1 : 0,
      effective_from: now,
      created_by_user_id: input.created_by_user_id,
      created_at: now,
      updated_at: now,
    });

  appendHistory({
    household_id: input.household_id,
    workspace_id: input.workspace_id,
    action: "member_added",
    summary: `${contact.display_name} added as ${input.role}`,
    related_contact_id: input.contact_id,
    changed_by_user_id: input.created_by_user_id,
  });

  const row = getDatabase()
    .prepare(`SELECT * FROM contact_household_members WHERE member_id = ?`)
    .get(memberId) as MemberRow;
  return rowToMember(row);
}

export function removeHouseholdMember(
  memberId: string,
  ctx: ContactAccessContext,
  changedByUserId: string,
): ContactHouseholdMember | null {
  assertRoleCapable(canEditHouseholds(ctx), "forbidden", "Insufficient permissions to remove members");

  const row = getDatabase()
    .prepare(`SELECT * FROM contact_household_members WHERE member_id = ?`)
    .get(memberId) as MemberRow | undefined;
  if (!row || row.effective_until) return null;

  const contact = getContactById(row.contact_id);
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_household_members SET effective_until = @until, updated_at = @until WHERE member_id = @member_id`,
    )
    .run({ member_id: memberId, until: now });

  appendHistory({
    household_id: row.household_id,
    workspace_id: row.workspace_id,
    action: "member_removed",
    summary: `${contact?.display_name ?? row.contact_id} removed`,
    related_contact_id: row.contact_id,
    changed_by_user_id: changedByUserId,
  });

  return rowToMember({ ...row, effective_until: now, updated_at: now });
}

export function addHouseholdRelationship(
  input: AddContactHouseholdRelationshipInput,
  ctx: ContactAccessContext,
): ContactHouseholdRelationship | null {
  validateAddRelationshipInput(input);
  assertRoleCapable(canEditHouseholds(ctx), "forbidden", "Insufficient permissions to add relationships");

  const household = getHouseholdById(input.household_id);
  if (!household || household.workspace_id !== input.workspace_id || household.status !== "active") {
    return null;
  }

  for (const contactId of [input.from_contact_id, input.to_contact_id]) {
    const active = getDatabase()
      .prepare(
        `SELECT member_id FROM contact_household_members
         WHERE household_id = ? AND contact_id = ? AND effective_until IS NULL`,
      )
      .get(input.household_id, contactId);
    if (!active) return null;
  }

  const now = new Date().toISOString();
  const relationshipId = crypto.randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO contact_household_relationships (
        relationship_id, household_id, workspace_id, from_contact_id, to_contact_id,
        relationship_type, label, effective_from, effective_until,
        created_by_user_id, created_at, updated_at
      ) VALUES (
        @relationship_id, @household_id, @workspace_id, @from_contact_id, @to_contact_id,
        @relationship_type, @label, @effective_from, NULL,
        @created_by_user_id, @created_at, @updated_at
      )`,
    )
    .run({
      relationship_id: relationshipId,
      household_id: input.household_id,
      workspace_id: input.workspace_id,
      from_contact_id: input.from_contact_id,
      to_contact_id: input.to_contact_id,
      relationship_type: input.relationship_type,
      label: input.label ?? null,
      effective_from: now,
      created_by_user_id: input.created_by_user_id,
      created_at: now,
      updated_at: now,
    });

  appendHistory({
    household_id: input.household_id,
    workspace_id: input.workspace_id,
    action: "relationship_added",
    summary: `Relationship ${input.relationship_type} added`,
    related_contact_id: input.from_contact_id,
    detail: input.to_contact_id,
    changed_by_user_id: input.created_by_user_id,
  });

  const relRow = getDatabase()
    .prepare(`SELECT * FROM contact_household_relationships WHERE relationship_id = ?`)
    .get(relationshipId) as RelationshipRow;
  return rowToRelationship(relRow);
}

export function mergeHouseholds(
  input: MergeContactHouseholdsInput,
  ctx: ContactAccessContext,
): ContactHouseholdSummary | null {
  validateMergeHouseholdsInput(input);
  assertRoleCapable(canEditHouseholds(ctx), "forbidden", "Insufficient permissions to merge households");

  const from = getHouseholdById(input.from_household_id);
  const to = getHouseholdById(input.to_household_id);
  if (!from || !to) return null;
  if (from.workspace_id !== input.workspace_id || to.workspace_id !== input.workspace_id) return null;
  if (from.status !== "active" || to.status !== "active") return null;

  const db = getDatabase();
  const now = new Date().toISOString();
  const fromMembers = listActiveMembers(input.from_household_id);

  for (const member of fromMembers) {
    const exists = db
      .prepare(
        `SELECT member_id FROM contact_household_members
         WHERE household_id = ? AND contact_id = ? AND effective_until IS NULL`,
      )
      .get(input.to_household_id, member.contact_id) as { member_id: string } | undefined;

    db.prepare(
      `UPDATE contact_household_members SET effective_until = @until, updated_at = @until WHERE member_id = @member_id`,
    ).run({ member_id: member.member_id, until: now });

    if (!exists) {
      db.prepare(
        `INSERT INTO contact_household_members (
          member_id, household_id, workspace_id, contact_id, role, relationship_label,
          is_primary_residence, effective_from, effective_until,
          created_by_user_id, created_at, updated_at
        ) VALUES (
          @member_id, @household_id, @workspace_id, @contact_id, @role, @relationship_label,
          @is_primary_residence, @effective_from, NULL,
          @created_by_user_id, @created_at, @updated_at
        )`,
      ).run({
        member_id: crypto.randomUUID(),
        household_id: input.to_household_id,
        workspace_id: input.workspace_id,
        contact_id: member.contact_id,
        role: member.role,
        relationship_label: member.relationship_label,
        is_primary_residence: 0,
        effective_from: now,
        created_by_user_id: input.merged_by_user_id,
        created_at: now,
        updated_at: now,
      });
    }
  }

  const fromRelationships = listActiveRelationships(input.from_household_id);
  for (const rel of fromRelationships) {
    db.prepare(
      `UPDATE contact_household_relationships SET effective_until = @until, updated_at = @until WHERE relationship_id = @id`,
    ).run({ id: rel.relationship_id, until: now });
    addHouseholdRelationship(
      {
        workspace_id: input.workspace_id,
        household_id: input.to_household_id,
        from_contact_id: rel.from_contact_id,
        to_contact_id: rel.to_contact_id,
        relationship_type: rel.relationship_type as AddContactHouseholdRelationshipInput["relationship_type"],
        label: rel.label ?? undefined,
        created_by_user_id: input.merged_by_user_id,
      },
      ctx,
    );
  }

  db.prepare(
    `UPDATE contact_households SET status = 'merged', merged_into_household_id = @to, updated_at = @now WHERE household_id = @from`,
  ).run({ from: input.from_household_id, to: input.to_household_id, now });

  appendHistory({
    household_id: input.from_household_id,
    workspace_id: input.workspace_id,
    action: "merged",
    summary: `Merged into ${to.name}`,
    related_household_id: input.to_household_id,
    detail: input.reason,
    changed_by_user_id: input.merged_by_user_id,
  });
  appendHistory({
    household_id: input.to_household_id,
    workspace_id: input.workspace_id,
    action: "merged",
    summary: `Absorbed household ${from.name}`,
    related_household_id: input.from_household_id,
    detail: input.reason,
    changed_by_user_id: input.merged_by_user_id,
  });

  return buildHouseholdSummary(input.to_household_id, ctx);
}

export function splitHousehold(
  input: SplitContactHouseholdInput,
  ctx: ContactAccessContext,
): { source: ContactHouseholdSummary; created: ContactHouseholdSummary } | null {
  validateSplitHouseholdInput(input);
  assertRoleCapable(canEditHouseholds(ctx), "forbidden", "Insufficient permissions to split households");

  const source = getHouseholdById(input.source_household_id);
  if (!source || source.workspace_id !== input.workspace_id || source.status !== "active") return null;

  const created = createHousehold(
    {
      workspace_id: input.workspace_id,
      name: input.new_household_name.trim(),
      primary_address: source.primary_address,
      voting_district: source.voting_district,
      created_by_user_id: input.split_by_user_id,
    },
    ctx,
  );
  if (!created) return null;

  const db = getDatabase();
  const now = new Date().toISOString();

  for (const contactId of input.member_contact_ids) {
    const member = db
      .prepare(
        `SELECT * FROM contact_household_members
         WHERE household_id = ? AND contact_id = ? AND effective_until IS NULL`,
      )
      .get(input.source_household_id, contactId) as MemberRow | undefined;
    if (!member) continue;

    db.prepare(
      `UPDATE contact_household_members SET effective_until = @until, updated_at = @until WHERE member_id = @member_id`,
    ).run({ member_id: member.member_id, until: now });

    addHouseholdMember(
      {
        workspace_id: input.workspace_id,
        household_id: created.household_id,
        contact_id: contactId,
        role: member.role as AddContactHouseholdMemberInput["role"],
        relationship_label: member.relationship_label ?? undefined,
        is_primary_residence: member.is_primary_residence === 1,
        created_by_user_id: input.split_by_user_id,
      },
      ctx,
    );
  }

  db.prepare(`UPDATE contact_households SET updated_at = @now WHERE household_id = @id`).run({
    id: input.source_household_id,
    now,
  });

  appendHistory({
    household_id: input.source_household_id,
    workspace_id: input.workspace_id,
    action: "split",
    summary: `Split ${input.member_contact_ids.length} member(s) to ${created.name}`,
    related_household_id: created.household_id,
    detail: input.reason,
    changed_by_user_id: input.split_by_user_id,
  });
  appendHistory({
    household_id: created.household_id,
    workspace_id: input.workspace_id,
    action: "split",
    summary: `Created from split of ${source.name}`,
    related_household_id: input.source_household_id,
    detail: input.reason,
    changed_by_user_id: input.split_by_user_id,
  });

  const sourceSummary = buildHouseholdSummary(input.source_household_id, ctx);
  const createdSummary = buildHouseholdSummary(created.household_id, ctx);
  if (!sourceSummary || !createdSummary) return null;
  return { source: sourceSummary, created: createdSummary };
}

export function transferPrimaryResidence(
  input: TransferPrimaryResidenceInput,
  ctx: ContactAccessContext,
): ContactHouseholdSummary | null {
  validateTransferPrimaryResidenceInput(input);
  assertRoleCapable(canEditHouseholds(ctx), "forbidden", "Insufficient permissions to transfer primary residence");

  const household = getHouseholdById(input.household_id);
  if (!household || household.workspace_id !== input.workspace_id || household.status !== "active") {
    return null;
  }

  const member = getDatabase()
    .prepare(
      `SELECT * FROM contact_household_members
       WHERE household_id = ? AND contact_id = ? AND effective_until IS NULL`,
    )
    .get(input.household_id, input.contact_id) as MemberRow | undefined;
  if (!member) return null;

  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE contact_household_members SET is_primary_residence = 0, updated_at = @now
     WHERE household_id = @household_id AND effective_until IS NULL`,
  ).run({ household_id: input.household_id, now });
  db.prepare(
    `UPDATE contact_household_members SET is_primary_residence = 1, updated_at = @now WHERE member_id = @member_id`,
  ).run({ member_id: member.member_id, now });
  db.prepare(
    `UPDATE contact_households SET primary_contact_id = @contact_id, updated_at = @now WHERE household_id = @household_id`,
  ).run({
    household_id: input.household_id,
    contact_id: input.contact_id,
    now,
  });

  const contact = getContactById(input.contact_id);
  appendHistory({
    household_id: input.household_id,
    workspace_id: input.workspace_id,
    action: "primary_residence_changed",
    summary: `Primary residence transferred to ${contact?.display_name ?? input.contact_id}`,
    related_contact_id: input.contact_id,
    changed_by_user_id: input.changed_by_user_id,
  });

  return buildHouseholdSummary(input.household_id, ctx);
}

export function listHouseholdsForContact(
  contactId: string,
  ctx: ContactAccessContext,
): ContactHouseholdSummary[] {
  if (!canViewHouseholds(ctx)) return [];
  const rows = getDatabase()
    .prepare(
      `SELECT DISTINCT h.household_id FROM contact_households h
       JOIN contact_household_members m ON m.household_id = h.household_id
       WHERE m.contact_id = ? AND m.effective_until IS NULL AND h.status = 'active'`,
    )
    .all(contactId) as { household_id: string }[];

  return rows
    .map((row) => buildHouseholdSummary(row.household_id, ctx))
    .filter(Boolean) as ContactHouseholdSummary[];
}

export function searchHouseholds(options: {
  workspace_id: string;
  search?: string;
  ctx: ContactAccessContext;
}): ContactHouseholdLookupRow[] {
  if (!canViewHouseholds(options.ctx)) return [];

  const term = options.search?.trim().toLowerCase();
  let sql = `
    SELECT h.household_id, h.name, h.primary_address_json, h.voting_district,
      (SELECT COUNT(*) FROM contact_household_members m
       WHERE m.household_id = h.household_id AND m.effective_until IS NULL) AS member_count
    FROM contact_households h
    WHERE h.workspace_id = ? AND h.status = 'active'`;
  const params: unknown[] = [options.workspace_id];

  if (term) {
    sql += ` AND (
      LOWER(h.name) LIKE ? OR LOWER(COALESCE(h.voting_district, '')) LIKE ?
      OR LOWER(COALESCE(h.primary_address_json, '')) LIKE ?
      OR EXISTS (
        SELECT 1 FROM contact_household_members m
        JOIN contacts c ON c.contact_id = m.contact_id
        WHERE m.household_id = h.household_id AND m.effective_until IS NULL
          AND (LOWER(c.display_name) LIKE ? OR LOWER(COALESCE(c.first_name, '')) LIKE ?
               OR LOWER(COALESCE(c.last_name, '')) LIKE ?)
      )
    )`;
    const like = `%${term}%`;
    params.push(like, like, like, like, like, like);
  }

  sql += ` ORDER BY h.name ASC LIMIT 100`;
  const rows = getDatabase().prepare(sql).all(...params) as {
    household_id: string;
    name: string;
    primary_address_json: string | null;
    voting_district: string | null;
    member_count: number;
  }[];

  return rows.map((row) => {
    const address = parseAddress(row.primary_address_json);
    const line =
      [address?.line1, address?.city, address?.state].filter(Boolean).join(", ") || undefined;
    return {
      household_id: row.household_id,
      name: row.name,
      member_count: row.member_count,
      primary_address_line: line,
      voting_district: row.voting_district ?? undefined,
    };
  });
}

export function listHouseholdHistoryExport(householdId: string): ContactHouseholdHistory[] {
  return listHouseholdHistory(householdId, 200);
}
