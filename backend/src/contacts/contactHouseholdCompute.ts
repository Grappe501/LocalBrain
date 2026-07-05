import type {
  ContactHouseholdComputed,
  ContactHouseholdMemberView,
  ContactHouseholdRelationship,
  ContactRecord,
} from "@localbrain/shared";

const VOTER_TAGS = new Set(["registered_voter", "voter", "rv"]);
const MINOR_TAGS = new Set(["minor", "under_18"]);
const VOLUNTEER_TAGS = new Set(["volunteer", "active_volunteer"]);
const VOLUNTEER_LIFECYCLE = new Set(["volunteer", "leader", "advocate", "champion"]);

function hasTag(contact: ContactRecord, tags: Set<string>): boolean {
  return contact.tags.some((tag) => tags.has(tag.toLowerCase()));
}

function labelFromScore(score: number, bands: [number, string][]): string {
  for (const [threshold, label] of bands) {
    if (score >= threshold) return label;
  }
  return bands[bands.length - 1]![1];
}

export function computeHouseholdMetrics(options: {
  members: readonly ContactHouseholdMemberView[];
  relationships: readonly ContactHouseholdRelationship[];
  contacts: ReadonlyMap<string, ContactRecord>;
  activeMemberContactIds: readonly string[];
  recentActivityContactIds: readonly string[];
  openActionCount: number;
  stewardUserIds: readonly string[];
}): ContactHouseholdComputed {
  const activeMembers = options.members.filter((m) => !m.effective_until);
  const size = activeMembers.length;

  let adults = 0;
  let minors = 0;
  let registeredVoters = 0;
  let volunteers = 0;

  for (const member of activeMembers) {
    const contact = options.contacts.get(member.contact_id);
    if (!contact) continue;
    const isMinor = member.role === "child" || hasTag(contact, MINOR_TAGS);
    if (isMinor) minors += 1;
    else adults += 1;
    if (hasTag(contact, VOTER_TAGS)) registeredVoters += 1;
    if (hasTag(contact, VOLUNTEER_TAGS)) volunteers += 1;
  }

  const relationshipBonus = Math.min(20, options.relationships.filter((r) => !r.effective_until).length * 5);
  const sizeBonus = Math.min(25, size * 5);
  const voterBonus = Math.min(15, registeredVoters * 5);
  const volunteerBonus = Math.min(20, volunteers * 10);
  const strengthScore = Math.min(100, 30 + sizeBonus + relationshipBonus + voterBonus + volunteerBonus);
  const strengthLabel = labelFromScore(strengthScore, [
    [80, "strong"],
    [60, "established"],
    [40, "developing"],
    [0, "emerging"],
  ]);

  const activeSet = new Set(options.activeMemberContactIds);
  const recentSet = new Set(options.recentActivityContactIds);
  const engaged = activeMembers.filter((m) => recentSet.has(m.contact_id)).length;
  const participationScore =
    size === 0 ? 0 : Math.round((engaged / size) * 100);
  const participationLabel = labelFromScore(participationScore, [
    [75, "high"],
    [50, "moderate"],
    [25, "low"],
    [0, "minimal"],
  ]);

  let healthScore = strengthScore;
  if (participationScore < 30) healthScore -= 15;
  if (options.openActionCount > 0) healthScore -= Math.min(10, options.openActionCount * 3);
  if (size === 0) healthScore = 0;
  healthScore = Math.max(0, Math.min(100, healthScore));
  const healthLabel = labelFromScore(healthScore, [
    [75, "healthy"],
    [50, "attention"],
    [25, "at risk"],
    [0, "inactive"],
  ]);

  return {
    size,
    adults,
    minors,
    registered_voters: registeredVoters,
    volunteers,
    strength_score: strengthScore,
    strength_label: strengthLabel,
    participation_score: participationScore,
    participation_label: participationLabel,
    health_score: healthScore,
    health_label: healthLabel,
    open_action_count: options.openActionCount,
    steward_user_ids: [...new Set(options.stewardUserIds.filter(Boolean))],
  };
}
