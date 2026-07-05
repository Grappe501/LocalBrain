import type {
  ContactRecordWithAffiliations,
  OrganizationSummary,
  RelationshipAnalyticsContactRow,
  RelationshipAnalyticsDashboard,
  RelationshipAnalyticsExport,
  RelationshipAnalyticsFilter,
  RelationshipAnalyticsPortfolio,
  RelationshipAnalyticsStewardLoad,
} from "@localbrain/shared";
import {
  CONTACT_RELATIONSHIP_ANALYTICS_NOTICE,
  CONTACT_RELATIONSHIP_ANALYTICS_VERSION,
  RELATIONSHIP_ANALYTICS_OVERLOAD_THRESHOLD,
  RELATIONSHIP_ANALYTICS_SOURCE_ENGINES,
} from "@localbrain/shared";
import { buildContactActionView } from "./contactActionRepository.js";
import { listContactsByContext, listContactContextView } from "./contactContextRepository.js";
import { listContactInteractions } from "./contactInteractionRepository.js";
import { listOrganizationsForContact } from "./contactOrganizationRepository.js";
import { buildContactStewardshipView } from "./contactStewardshipRepository.js";
import type { ContactAccessContext } from "./relationshipAnalyticsValidator.js";

const LEADER_ROLES = new Set([
  "president",
  "chair",
  "board_member",
  "officer",
  "pastor",
  "treasurer",
  "secretary",
  "owner",
]);

const VOLUNTEER_STRENGTHS = new Set(["volunteer", "core_volunteer"]);
const DONOR_STRENGTHS = new Set(["donor", "major_donor"]);

const IGNORED_VOLUNTEER_DAYS = 45;
const COLD_DONOR_DAYS = 60;
const INACTIVE_LEADER_DAYS = 30;

function contactHasOrgLeadership(contactId: string, orgSummaries: OrganizationSummary[]): boolean {
  for (const summary of orgSummaries) {
    const membership = summary.memberships.find(
      (entry) => entry.contact_id === contactId && !entry.effective_until,
    );
    if (membership && LEADER_ROLES.has(membership.membership_role)) return true;
    const role = summary.roles.find(
      (entry) =>
        entry.contact_id === contactId && !entry.effective_until && LEADER_ROLES.has(entry.role),
    );
    if (role) return true;
  }
  return false;
}

function isVolunteerProfile(strength: string, lifecycleStage: string): boolean {
  return VOLUNTEER_STRENGTHS.has(strength) || lifecycleStage === "volunteer";
}

function isDonorProfile(strength: string): boolean {
  return DONOR_STRENGTHS.has(strength);
}

function isLeaderProfile(
  strength: string,
  lifecycleStage: string,
  hasOrgLeadership: boolean,
): boolean {
  return strength === "county_leader" || lifecycleStage === "leader" || hasOrgLeadership;
}

function countOverdueTasks(contactId: string, ctx: ContactAccessContext): number {
  const actionView = buildContactActionView(contactId, ctx);
  if (!actionView) return 0;
  const now = Date.now();
  return actionView.open_tasks.filter(
    (task) => task.due_at && Date.parse(task.due_at) < now,
  ).length;
}

function buildAnalyticsRow(
  contact: ContactRecordWithAffiliations,
  ctx: ContactAccessContext,
): RelationshipAnalyticsContactRow | null {
  const stewardship = buildContactStewardshipView(contact.contact_id, ctx);
  if (!stewardship) return null;

  const interactions = listContactInteractions({ contact_id: contact.contact_id, ctx });
  const contextView = listContactContextView(contact.contact_id);
  const orgSummaries = listOrganizationsForContact(contact.contact_id, ctx);
  const actionView = buildContactActionView(contact.contact_id, ctx);

  const hasOrgLeadership = contactHasOrgLeadership(contact.contact_id, orgSummaries);
  const primaryContextLabels = contextView?.links
    .filter((link) => link.rank === "primary")
    .map((link) => link.context.label) ?? [];

  const openActionCount = actionView?.summary.total_open_actions ?? 0;
  const overdueActionCount = countOverdueTasks(contact.contact_id, ctx);

  return {
    contact_id: contact.contact_id,
    display_name: contact.display_name,
    steward_user_id: stewardship.stewardship.steward_user_id,
    strength: stewardship.stewardship.strength,
    lifecycle_stage: stewardship.stewardship.lifecycle_stage,
    momentum: stewardship.computed.momentum,
    health_score: stewardship.computed.health_score,
    health_label: stewardship.computed.health_label,
    days_since_meaningful_contact: stewardship.computed.days_since_meaningful_contact,
    contributor_count: stewardship.contributors.length,
    open_action_count: openActionCount,
    overdue_action_count: overdueActionCount,
    interaction_count: interactions.length,
    primary_context_labels: primaryContextLabels,
    tags: contact.tags,
    has_org_leadership: hasOrgLeadership,
    evidence_summary: `${interactions.length} timeline entries · ${stewardship.computed.momentum} momentum · health ${stewardship.computed.health_label}`,
  };
}

function matchesAnalyticsFilter(
  row: RelationshipAnalyticsContactRow,
  filter: RelationshipAnalyticsFilter,
): boolean {
  if (filter.strength && row.strength !== filter.strength) return false;
  if (filter.momentum && row.momentum !== filter.momentum) return false;
  if (filter.health_label && row.health_label !== filter.health_label) return false;
  return true;
}

function buildPortfolio(rows: RelationshipAnalyticsContactRow[]): RelationshipAnalyticsPortfolio {
  const stewarded = rows.filter((row) => row.steward_user_id);
  const totalContacts = rows.length;
  const stewardCoverage =
    totalContacts === 0 ? 0 : Math.round((stewarded.length / totalContacts) * 100);

  return {
    total_contacts: totalContacts,
    stewarded_count: stewarded.length,
    unowned_count: rows.filter((row) => !row.steward_user_id).length,
    steward_coverage_percent: stewardCoverage,
    momentum_growing: rows.filter((row) => row.momentum === "growing").length,
    momentum_stable: rows.filter((row) => row.momentum === "stable").length,
    momentum_cooling: rows.filter((row) => row.momentum === "cooling").length,
    momentum_dormant: rows.filter((row) => row.momentum === "dormant").length,
    momentum_lost: rows.filter((row) => row.momentum === "lost").length,
    open_actions_total: rows.reduce((sum, row) => sum + row.open_action_count, 0),
    overdue_actions_total: rows.reduce((sum, row) => sum + row.overdue_action_count, 0),
  };
}

function buildOverloadedStewards(rows: RelationshipAnalyticsContactRow[]): RelationshipAnalyticsStewardLoad[] {
  const bySteward = new Map<string, RelationshipAnalyticsContactRow[]>();
  for (const row of rows) {
    if (!row.steward_user_id) continue;
    const bucket = bySteward.get(row.steward_user_id) ?? [];
    bucket.push(row);
    bySteward.set(row.steward_user_id, bucket);
  }

  return [...bySteward.entries()]
    .filter(([, contacts]) => contacts.length >= RELATIONSHIP_ANALYTICS_OVERLOAD_THRESHOLD)
    .map(([stewardUserId, contacts]) => ({
      steward_user_id: stewardUserId,
      contact_count: contacts.length,
      cooling_count: contacts.filter(
        (row) => row.momentum === "cooling" || row.momentum === "dormant",
      ).length,
      without_recent_contact_count: contacts.filter(
        (row) => (row.days_since_meaningful_contact ?? 0) >= INACTIVE_LEADER_DAYS,
      ).length,
    }))
    .sort((a, b) => b.contact_count - a.contact_count);
}

function listFilteredContacts(
  workspaceId: string,
  filter: RelationshipAnalyticsFilter,
): ContactRecordWithAffiliations[] {
  const baseFilter = {
    workspace_id: workspaceId,
    tag: filter.tag,
    context_id: filter.context_id,
  };
  return filter.context_id
    ? listContactsByContext(baseFilter)
    : listContactsByContext({ workspace_id: workspaceId, tag: filter.tag });
}

function composeRows(
  workspaceId: string,
  filter: RelationshipAnalyticsFilter,
  ctx: ContactAccessContext,
): RelationshipAnalyticsContactRow[] {
  const contacts = listFilteredContacts(workspaceId, filter);
  const rows: RelationshipAnalyticsContactRow[] = [];

  for (const contact of contacts) {
    const row = buildAnalyticsRow(contact, ctx);
    if (!row) continue;
    if (!matchesAnalyticsFilter(row, filter)) continue;
    rows.push(row);
  }

  return rows;
}

function composeDashboardFromRows(
  workspaceId: string,
  filter: RelationshipAnalyticsFilter,
  rows: RelationshipAnalyticsContactRow[],
): RelationshipAnalyticsDashboard {
  const portfolio = buildPortfolio(rows);

  const withoutSteward = rows.filter((row) => !row.steward_user_id);
  const contributorsWithoutSteward = rows.filter(
    (row) => !row.steward_user_id && row.contributor_count > 0,
  );
  const cooling = rows.filter(
    (row) => row.momentum === "cooling" || row.momentum === "dormant" || row.momentum === "lost",
  );
  const growing = rows.filter((row) => row.momentum === "growing");

  const ignoredVolunteers = rows.filter((row) => {
    if (!isVolunteerProfile(row.strength, row.lifecycle_stage)) return false;
    return (
      (row.days_since_meaningful_contact ?? 999) >= IGNORED_VOLUNTEER_DAYS ||
      row.momentum === "cooling" ||
      row.momentum === "dormant" ||
      row.momentum === "lost" ||
      !row.steward_user_id
    );
  });

  const coldDonors = rows.filter((row) => {
    if (!isDonorProfile(row.strength)) return false;
    return (
      (row.days_since_meaningful_contact ?? 0) >= COLD_DONOR_DAYS ||
      row.momentum === "cooling" ||
      row.momentum === "dormant" ||
      row.momentum === "lost"
    );
  });

  const inactiveLeaders = rows.filter((row) => {
    if (!isLeaderProfile(row.strength, row.lifecycle_stage, row.has_org_leadership)) return false;
    return (
      (row.days_since_meaningful_contact ?? 0) >= INACTIVE_LEADER_DAYS ||
      row.momentum === "cooling" ||
      row.momentum === "dormant" ||
      row.momentum === "lost"
    );
  });

  const actionBacklog = [...rows]
    .filter((row) => row.open_action_count > 0)
    .sort((a, b) => b.open_action_count - a.open_action_count);

  return {
    engine_id: CONTACT_RELATIONSHIP_ANALYTICS_VERSION,
    workspace_id: workspaceId,
    advisory: true,
    notice: CONTACT_RELATIONSHIP_ANALYTICS_NOTICE,
    computed_at: new Date().toISOString(),
    filters_applied: filter,
    portfolio,
    without_steward: withoutSteward,
    contributors_without_steward: contributorsWithoutSteward,
    cooling,
    growing,
    overloaded_stewards: buildOverloadedStewards(rows),
    ignored_volunteers: ignoredVolunteers,
    cold_donors: coldDonors,
    inactive_leaders: inactiveLeaders,
    action_backlog: actionBacklog,
    source_engines: RELATIONSHIP_ANALYTICS_SOURCE_ENGINES,
  };
}

export function composeRelationshipAnalyticsDashboard(input: {
  workspace_id: string;
  filter: RelationshipAnalyticsFilter;
  ctx: ContactAccessContext;
}): RelationshipAnalyticsDashboard {
  const rows = composeRows(input.workspace_id, input.filter, input.ctx);
  return composeDashboardFromRows(input.workspace_id, input.filter, rows);
}

export function composeRelationshipAnalyticsExport(input: {
  workspace_id: string;
  filter: RelationshipAnalyticsFilter;
  ctx: ContactAccessContext;
}): RelationshipAnalyticsExport {
  const rows = composeRows(input.workspace_id, input.filter, input.ctx);
  return {
    engine_id: CONTACT_RELATIONSHIP_ANALYTICS_VERSION,
    workspace_id: input.workspace_id,
    computed_at: new Date().toISOString(),
    filters_applied: input.filter,
    portfolio: buildPortfolio(rows),
    contacts: rows,
  };
}
