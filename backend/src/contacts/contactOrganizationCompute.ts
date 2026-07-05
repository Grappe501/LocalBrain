import type {
  OrganizationMembershipView,
  OrganizationMetrics,
  OrganizationRole,
} from "@localbrain/shared";

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

const VOLUNTEER_ROLES = new Set(["volunteer", "member", "supporter", "attendee"]);

function labelFromScore(score: number, bands: [number, string][]): string {
  for (const [threshold, label] of bands) {
    if (score >= threshold) return label;
  }
  return bands[bands.length - 1]![1];
}

export function computeOrganizationMetrics(options: {
  memberships: readonly OrganizationMembershipView[];
  roles: readonly OrganizationRole[];
  stewardUserIds: readonly string[];
  healthScores: readonly number[];
  openActionCount: number;
  recentMemberContactIds: readonly string[];
  sharedHouseholdCount: number;
}): OrganizationMetrics {
  const active = options.memberships.filter((m) => !m.effective_until && m.membership_status === "active");
  const membershipCount = active.length;

  const volunteerCount = active.filter((m) => VOLUNTEER_ROLES.has(m.membership_role)).length;

  const leaderRoleIds = new Set(
    options.roles.filter((r) => !r.effective_until && LEADER_ROLES.has(r.role)).map((r) => r.contact_id),
  );
  const leaderCount = active.filter(
    (m) => leaderRoleIds.has(m.contact_id) || LEADER_ROLES.has(m.membership_role),
  ).length;

  const stewardCount = new Set(options.stewardUserIds.filter(Boolean)).size;

  const averageHealth =
    options.healthScores.length === 0
      ? 0
      : Math.round(
          options.healthScores.reduce((sum, score) => sum + score, 0) / options.healthScores.length,
        );

  const recentSet = new Set(options.recentMemberContactIds);
  const engaged = active.filter((m) => recentSet.has(m.contact_id)).length;
  const participationScore = membershipCount === 0 ? 0 : Math.round((engaged / membershipCount) * 100);

  const strengthScore = Math.min(
    100,
    20 +
      Math.min(30, membershipCount * 3) +
      Math.min(20, leaderCount * 5) +
      Math.min(15, volunteerCount * 2) +
      Math.min(15, averageHealth / 10),
  );

  let momentum: OrganizationMetrics["momentum"] = "stable";
  if (participationScore >= 60 && membershipCount >= 3) momentum = "growing";
  else if (participationScore < 25 || membershipCount <= 1) momentum = "cooling";

  return {
    membership_count: membershipCount,
    volunteer_count: volunteerCount,
    leader_count: leaderCount,
    steward_count: stewardCount,
    average_health_score: averageHealth,
    open_action_count: options.openActionCount,
    strength_score: strengthScore,
    strength_label: labelFromScore(strengthScore, [
      [80, "strong"],
      [60, "established"],
      [40, "developing"],
      [0, "emerging"],
    ]),
    participation_score: participationScore,
    participation_label: labelFromScore(participationScore, [
      [75, "high"],
      [50, "moderate"],
      [25, "low"],
      [0, "minimal"],
    ]),
    momentum,
    shared_household_count: options.sharedHouseholdCount,
  };
}
