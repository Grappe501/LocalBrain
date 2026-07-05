import crypto from "node:crypto";
import type {
  AddContactStewardParticipantInput,
  AssignContactStewardInput,
  ContactLifecycleStage,
  ContactRelationshipStrength,
  ContactStewardParticipant,
  ContactStewardParticipantRole,
  ContactStewardTransition,
  ContactStewardshipDashboard,
  ContactStewardshipDashboardRow,
  ContactStewardshipRecord,
  ContactStewardshipView,
  UpdateContactStewardshipInput,
} from "@localbrain/shared";
import {
  CONTACT_STEWERSHIP_ADVISORY_NOTICE,
  CONTACT_STEWERSHIP_VERSION,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { listContactContextView } from "./contactContextRepository.js";
import { getContactById, listContacts } from "./contactRepository.js";
import {
  listContactInteractions,
  updateTimelineMeta,
} from "./contactInteractionRepository.js";
import {
  buildStewardshipAdvisorySummary,
  computeStewardshipMetrics,
} from "./contactStewardshipCompute.js";
import type { ContactAccessContext } from "./contactStewardshipValidator.js";
import {
  assertRoleCapable,
  canEditStewardship,
  canViewStewardship,
  validateAddParticipantInput,
  validateAssignStewardInput,
  validateUpdateStewardshipInput,
} from "./contactStewardshipValidator.js";

type StewardshipRow = {
  contact_id: string;
  workspace_id: string;
  steward_user_id: string | null;
  strength: string;
  lifecycle_stage: string;
  updated_at: string;
  updated_by_user_id: string | null;
};

type ParticipantRow = {
  participant_id: string;
  workspace_id: string;
  contact_id: string;
  user_id: string;
  role: string;
  label: string | null;
  effective_until: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

function rowToStewardship(row: StewardshipRow): ContactStewardshipRecord {
  return {
    contact_id: row.contact_id,
    workspace_id: row.workspace_id,
    steward_user_id: row.steward_user_id ?? undefined,
    strength: row.strength as ContactRelationshipStrength,
    lifecycle_stage: row.lifecycle_stage as ContactLifecycleStage,
    updated_at: row.updated_at,
    updated_by_user_id: row.updated_by_user_id ?? undefined,
  };
}

function rowToParticipant(row: ParticipantRow): ContactStewardParticipant {
  return {
    participant_id: row.participant_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    user_id: row.user_id,
    role: row.role as ContactStewardParticipantRole,
    label: row.label ?? undefined,
    effective_until: row.effective_until ?? undefined,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function readTimelineSteward(contactId: string): string | undefined {
  const row = getDatabase()
    .prepare(
      `SELECT relationship_owner_user_id FROM contact_timeline_meta WHERE contact_id = ?`,
    )
    .get(contactId) as { relationship_owner_user_id: string | null } | undefined;
  return row?.relationship_owner_user_id ?? undefined;
}

function ensureStewardshipRow(contactId: string, workspaceId: string): StewardshipRow {
  const db = getDatabase();
  let row = db
    .prepare(`SELECT * FROM contact_stewardship WHERE contact_id = ?`)
    .get(contactId) as StewardshipRow | undefined;

  if (!row) {
    const now = new Date().toISOString();
    const legacySteward = readTimelineSteward(contactId);
    db.prepare(
      `INSERT INTO contact_stewardship (
        contact_id, workspace_id, steward_user_id, strength, lifecycle_stage, updated_at, updated_by_user_id
      ) VALUES (
        @contact_id, @workspace_id, @steward_user_id, 'unknown', 'unknown', @updated_at, NULL
      )`,
    ).run({
      contact_id: contactId,
      workspace_id: workspaceId,
      steward_user_id: legacySteward ?? null,
      updated_at: now,
    });
    row = db
      .prepare(`SELECT * FROM contact_stewardship WHERE contact_id = ?`)
      .get(contactId) as StewardshipRow;
  } else if (!row.steward_user_id) {
    const legacySteward = readTimelineSteward(contactId);
    if (legacySteward) {
      const now = new Date().toISOString();
      db.prepare(
        `UPDATE contact_stewardship SET steward_user_id = @steward, updated_at = @now WHERE contact_id = @contact_id`,
      ).run({ steward: legacySteward, now, contact_id: contactId });
      row.steward_user_id = legacySteward;
    }
  }

  return row!;
}

export function buildContactStewardshipView(
  contactId: string,
  ctx: ContactAccessContext,
): ContactStewardshipView | null {
  assertRoleCapable(canViewStewardship(ctx), "forbidden", "Cannot view stewardship");
  const contact = getContactById(contactId);
  if (!contact) return null;

  const stewardship = rowToStewardship(ensureStewardshipRow(contactId, contact.workspace_id));
  const participants = getDatabase()
    .prepare(
      `SELECT * FROM contact_steward_participants
       WHERE contact_id = ? AND effective_until IS NULL
       ORDER BY role ASC, created_at ASC`,
    )
    .all(contactId) as ParticipantRow[];

  const transitions = listStewardTransitions(contactId);
  const interactions = listContactInteractions({ contact_id: contactId, ctx });
  const computed = computeStewardshipMetrics(interactions);

  const contextView = listContactContextView(contactId);
  const primaryContext = contextView?.links.find((link) => link.rank === "primary");

  const contributors = participants.filter((p) => p.role === "contributor").map(rowToParticipant);
  const watchers = participants.filter((p) => p.role === "watcher").map(rowToParticipant);

  return {
    engine_id: CONTACT_STEWERSHIP_VERSION,
    contact_id: contactId,
    workspace_id: contact.workspace_id,
    stewardship,
    contributors,
    watchers,
    computed,
    transitions,
    advisory_summary: {
      ...buildStewardshipAdvisorySummary({
        steward_user_id: stewardship.steward_user_id,
        contributor_count: contributors.length,
        computed,
        primary_context_label: primaryContext?.context.label,
      }),
      notice: CONTACT_STEWERSHIP_ADVISORY_NOTICE,
    },
  };
}

export function assignContactSteward(
  input: AssignContactStewardInput,
  ctx: ContactAccessContext,
): ContactStewardshipView | null {
  validateAssignStewardInput(input);
  assertRoleCapable(canEditStewardship(ctx), "forbidden", "Cannot assign steward");

  const contact = getContactById(input.contact_id);
  if (!contact || contact.workspace_id !== input.workspace_id) return null;

  const existing = ensureStewardshipRow(input.contact_id, input.workspace_id);
  const now = new Date().toISOString();
  const fromSteward = existing.steward_user_id ?? undefined;

  if (fromSteward !== input.steward_user_id) {
    getDatabase()
      .prepare(
        `INSERT INTO contact_steward_transitions (
          transition_id, workspace_id, contact_id, from_steward_user_id, to_steward_user_id,
          reason, created_by_user_id, created_at
        ) VALUES (
          @transition_id, @workspace_id, @contact_id, @from_steward, @to_steward,
          @reason, @created_by, @created_at
        )`,
      )
      .run({
        transition_id: crypto.randomUUID(),
        workspace_id: input.workspace_id,
        contact_id: input.contact_id,
        from_steward: fromSteward ?? null,
        to_steward: input.steward_user_id,
        reason: input.reason ?? "",
        created_by: input.created_by_user_id,
        created_at: now,
      });
  }

  getDatabase()
    .prepare(
      `UPDATE contact_stewardship SET
        steward_user_id = @steward,
        updated_at = @now,
        updated_by_user_id = @updated_by
       WHERE contact_id = @contact_id`,
    )
    .run({
      steward: input.steward_user_id,
      now,
      updated_by: input.created_by_user_id,
      contact_id: input.contact_id,
    });

  updateTimelineMeta(input.contact_id, {
    relationship_owner_user_id: input.steward_user_id,
  });

  return buildContactStewardshipView(input.contact_id, ctx);
}

export function updateContactStewardship(
  contactId: string,
  input: UpdateContactStewardshipInput,
  ctx: ContactAccessContext,
): ContactStewardshipView | null {
  validateUpdateStewardshipInput(input);
  assertRoleCapable(canEditStewardship(ctx), "forbidden", "Cannot update stewardship");

  const contact = getContactById(contactId);
  if (!contact) return null;
  ensureStewardshipRow(contactId, contact.workspace_id);

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_stewardship SET
        strength = COALESCE(@strength, strength),
        lifecycle_stage = COALESCE(@lifecycle, lifecycle_stage),
        updated_at = @now,
        updated_by_user_id = @updated_by
       WHERE contact_id = @contact_id`,
    )
    .run({
      contact_id: contactId,
      strength: input.strength ?? null,
      lifecycle: input.lifecycle_stage ?? null,
      now,
      updated_by: input.updated_by_user_id,
    });

  return buildContactStewardshipView(contactId, ctx);
}

export function addContactStewardParticipant(
  input: AddContactStewardParticipantInput,
  ctx: ContactAccessContext,
): ContactStewardParticipant | null {
  validateAddParticipantInput(input);
  assertRoleCapable(canEditStewardship(ctx), "forbidden", "Cannot add participant");

  const contact = getContactById(input.contact_id);
  if (!contact || contact.workspace_id !== input.workspace_id) return null;

  const conflict = getDatabase()
    .prepare(
      `SELECT participant_id FROM contact_steward_participants
       WHERE contact_id = ? AND user_id = ? AND role = ? AND effective_until IS NULL`,
    )
    .get(input.contact_id, input.user_id, input.role) as { participant_id: string } | undefined;
  if (conflict) return null;

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO contact_steward_participants (
        participant_id, workspace_id, contact_id, user_id, role, label,
        effective_until, created_by_user_id, created_at, updated_at
      ) VALUES (
        @participant_id, @workspace_id, @contact_id, @user_id, @role, @label,
        NULL, @created_by, @created_at, @updated_at
      )`,
    )
    .run({
      participant_id: id,
      workspace_id: input.workspace_id,
      contact_id: input.contact_id,
      user_id: input.user_id,
      role: input.role,
      label: input.label?.trim() ?? null,
      created_by: input.created_by_user_id,
      created_at: now,
      updated_at: now,
    });

  return rowToParticipant(
    getDatabase()
      .prepare(`SELECT * FROM contact_steward_participants WHERE participant_id = ?`)
      .get(id) as ParticipantRow,
  );
}

export function endContactStewardParticipant(
  participantId: string,
  ctx: ContactAccessContext,
): ContactStewardParticipant | null {
  assertRoleCapable(canEditStewardship(ctx), "forbidden", "Cannot end participant");

  const row = getDatabase()
    .prepare(`SELECT * FROM contact_steward_participants WHERE participant_id = ?`)
    .get(participantId) as ParticipantRow | undefined;
  if (!row || row.effective_until) return null;

  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE contact_steward_participants SET effective_until = @now, updated_at = @now WHERE participant_id = @id`,
    )
    .run({ id: participantId, now });

  return rowToParticipant(
    getDatabase()
      .prepare(`SELECT * FROM contact_steward_participants WHERE participant_id = ?`)
      .get(participantId) as ParticipantRow,
  );
}

export function listStewardTransitions(contactId: string): ContactStewardTransition[] {
  const rows = getDatabase()
    .prepare(
      `SELECT * FROM contact_steward_transitions WHERE contact_id = ? ORDER BY created_at DESC`,
    )
    .all(contactId) as Array<{
    transition_id: string;
    workspace_id: string;
    contact_id: string;
    from_steward_user_id: string | null;
    to_steward_user_id: string;
    reason: string;
    created_by_user_id: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    transition_id: row.transition_id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    from_steward_user_id: row.from_steward_user_id ?? undefined,
    to_steward_user_id: row.to_steward_user_id,
    reason: row.reason,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
  }));
}

export function buildStewardshipDashboard(
  workspaceId: string,
  ctx: ContactAccessContext,
): ContactStewardshipDashboard {
  assertRoleCapable(canViewStewardship(ctx), "forbidden", "Cannot view stewardship dashboard");

  const contacts = listContacts({ workspace_id: workspaceId });
  const cooling: ContactStewardshipDashboardRow[] = [];
  const growing: ContactStewardshipDashboardRow[] = [];
  const withoutSteward: ContactStewardshipDashboardRow[] = [];
  const contributorsWithoutSteward: ContactStewardshipDashboardRow[] = [];

  for (const contact of contacts) {
    const view = buildContactStewardshipView(contact.contact_id, ctx);
    if (!view) continue;

    const row = {
      contact_id: contact.contact_id,
      display_name: contact.display_name,
      steward_user_id: view.stewardship.steward_user_id,
      strength: view.stewardship.strength,
      momentum: view.computed.momentum,
      health_score: view.computed.health_score,
      contributor_count: view.contributors.length,
      days_since_meaningful_contact: view.computed.days_since_meaningful_contact,
    };

    if (!view.stewardship.steward_user_id) withoutSteward.push(row);
    if (!view.stewardship.steward_user_id && view.contributors.length > 0) {
      contributorsWithoutSteward.push(row);
    }
    if (view.computed.momentum === "cooling" || view.computed.momentum === "dormant") {
      cooling.push(row);
    }
    if (view.computed.momentum === "growing") growing.push(row);
  }

  return {
    engine_id: CONTACT_STEWERSHIP_VERSION,
    workspace_id: workspaceId,
    cooling,
    growing,
    without_steward: withoutSteward,
    contributors_without_steward: contributorsWithoutSteward,
  };
}
