import type {
  OrganizationProfile,
  RelationshipProfile,
  RelationshipTimelineEvent,
} from "@localbrain/shared";

/** Brain-scoped stub catalog — illustrative seeds for V1 read model (not a live CRM import). */

export const SEED_ORGANIZATIONS: OrganizationProfile[] = [
  {
    org_id: "org_stand_up_arkansas",
    name: "Stand Up Arkansas",
    kind: "nonprofit",
    description: "Civic coalition and community organizing.",
    member_person_ids: ["person_chris_m", "person_sarah_k"],
    workspace_ids: ["reddirt"],
  },
  {
    org_id: "org_naaca",
    name: "NAACP — Pulaski Chapter",
    kind: "coalition",
    description: "Civil rights and voter engagement partner.",
    member_person_ids: ["person_marcus_t"],
    workspace_ids: ["reddirt", "countyworkbench"],
  },
  {
    org_id: "org_kelly_campaign",
    name: "Kelly Campaign",
    kind: "campaign",
    description: "Field, fundraising, and voter contact.",
    member_person_ids: ["person_kelly", "person_chris_m"],
    workspace_ids: ["reddirt"],
  },
  {
    org_id: "org_benton_county",
    name: "Benton County",
    kind: "government",
    description: "County government stakeholder map.",
    member_person_ids: ["person_benton_liaison"],
    workspace_ids: ["countyworkbench"],
  },
  {
    org_id: "org_local_media",
    name: "Local Media Coalition",
    kind: "media",
    description: "Press and editorial relationships.",
    member_person_ids: ["person_press_editor"],
    workspace_ids: ["reddirt"],
  },
];

export const SEED_PEOPLE: RelationshipProfile[] = [
  {
    person_id: "person_steve",
    name: "Steve",
    roles: ["Executive", "Builder"],
    organization_ids: [],
    workspace_ids: ["localbrain", "reddirt"],
    interests: ["LocalBrain", "campaigns", "writing"],
    relationship_strength: 100,
    last_touch_days_ago: 0,
    status: "active",
    introduced_by: null,
    summary: "Center of the network — Chief of Staff apex.",
  },
  {
    person_id: "person_kelly",
    name: "Kelly",
    roles: ["Candidate", "Campaign lead"],
    organization_ids: ["org_kelly_campaign"],
    workspace_ids: ["reddirt"],
    interests: ["Field ops", "fundraising", "messaging"],
    relationship_strength: 95,
    last_touch_days_ago: 2,
    status: "active",
    introduced_by: null,
    summary: "Primary campaign partner — daily coordination.",
  },
  {
    person_id: "person_chris_m",
    name: "Chris M.",
    roles: ["Organizer", "Coalition partner"],
    organization_ids: ["org_stand_up_arkansas", "org_kelly_campaign"],
    workspace_ids: ["reddirt"],
    interests: ["Coalition building", "volunteers"],
    relationship_strength: 82,
    last_touch_days_ago: 21,
    status: "warm",
    introduced_by: "person_kelly",
    summary: "Stand Up Arkansas bridge — follow-up overdue.",
  },
  {
    person_id: "person_sarah_k",
    name: "Sarah K.",
    roles: ["Nonprofit director"],
    organization_ids: ["org_stand_up_arkansas"],
    workspace_ids: ["reddirt"],
    interests: ["Grants", "policy"],
    relationship_strength: 74,
    last_touch_days_ago: 45,
    status: "dormant",
    introduced_by: "person_chris_m",
    summary: "Introduction promised follow-through — open loop.",
  },
  {
    person_id: "person_marcus_t",
    name: "Marcus T.",
    roles: ["Chapter president"],
    organization_ids: ["org_naaca"],
    workspace_ids: ["countyworkbench"],
    interests: ["Voter engagement", "precinct organizing"],
    relationship_strength: 88,
    last_touch_days_ago: 7,
    status: "active",
    introduced_by: "person_kelly",
    summary: "Strong NAACP connector for county work.",
  },
  {
    person_id: "person_benton_liaison",
    name: "Benton County Liaison",
    roles: ["Government contact"],
    organization_ids: ["org_benton_county"],
    workspace_ids: ["countyworkbench"],
    interests: ["County grants", "intergovernmental"],
    relationship_strength: 70,
    last_touch_days_ago: 14,
    status: "warm",
    introduced_by: null,
    summary: "CountyWorkbench stakeholder — quarterly touch.",
  },
  {
    person_id: "person_donor_x",
    name: "Donor X",
    roles: ["Major donor"],
    organization_ids: ["org_kelly_campaign"],
    workspace_ids: ["reddirt"],
    interests: ["Education policy"],
    relationship_strength: 65,
    last_touch_days_ago: 60,
    status: "dormant",
    introduced_by: "person_kelly",
    summary: "Met twice at fundraisers — reconnect before next cycle.",
  },
  {
    person_id: "person_press_editor",
    name: "Regional Press Editor",
    roles: ["Media"],
    organization_ids: ["org_local_media"],
    workspace_ids: ["reddirt"],
    interests: ["Investigative stories", "RedDirt"],
    relationship_strength: 78,
    last_touch_days_ago: 10,
    status: "active",
    introduced_by: null,
    summary: "Media relationship for campaign narrative.",
  },
];

export const SEED_TIMELINES: RelationshipTimelineEvent[] = [
  {
    id: "tl-1",
    person_id: "person_chris_m",
    event_type: "met",
    title: "Met at coalition kickoff",
    detail: "Introduced through Kelly at Stand Up Arkansas launch.",
    occurred_at: "2025-11-12",
  },
  {
    id: "tl-2",
    person_id: "person_chris_m",
    event_type: "worked_together",
    title: "Volunteer training session",
    detail: "Co-led precinct captain training for RedDirt.",
    occurred_at: "2026-01-20",
  },
  {
    id: "tl-3",
    person_id: "person_chris_m",
    event_type: "meeting",
    title: "Coalition planning call",
    detail: "Discussed Benton County expansion.",
    occurred_at: "2026-03-05",
  },
  {
    id: "tl-4",
    person_id: "person_chris_m",
    event_type: "introduction",
    title: "Introduced Sarah K.",
    detail: "Promised follow-up intro email — still open.",
    occurred_at: "2026-02-14",
  },
  {
    id: "tl-5",
    person_id: "person_chris_m",
    event_type: "status",
    title: "Relationship cooling",
    detail: "21 days since last touch — Chief recommends call.",
    occurred_at: "2026-06-08",
  },
  {
    id: "tl-6",
    person_id: "person_donor_x",
    event_type: "met",
    title: "Fundraiser reception",
    detail: "Kelly introduced at spring fundraiser.",
    occurred_at: "2025-09-18",
  },
  {
    id: "tl-7",
    person_id: "person_donor_x",
    event_type: "meeting",
    title: "Second meeting",
    detail: "Coffee follow-up on education policy.",
    occurred_at: "2025-11-02",
  },
  {
    id: "tl-8",
    person_id: "person_donor_x",
    event_type: "project",
    title: "Linked to RedDirt workspace",
    detail: "Tagged as major donor prospect in campaign workspace.",
    occurred_at: "2025-11-03",
  },
];

export function getPerson(personId: string): RelationshipProfile | undefined {
  return SEED_PEOPLE.find((p) => p.person_id === personId);
}

export function getOrganization(orgId: string): OrganizationProfile | undefined {
  return SEED_ORGANIZATIONS.find((o) => o.org_id === orgId);
}

export function getTimelineForPerson(personId: string): RelationshipTimelineEvent[] {
  return SEED_TIMELINES.filter((e) => e.person_id === personId).sort((a, b) =>
    b.occurred_at.localeCompare(a.occurred_at),
  );
}
