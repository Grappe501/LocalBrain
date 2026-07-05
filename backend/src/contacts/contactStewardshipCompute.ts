import type {
  ContactInteraction,
  ContactRelationshipMomentum,
  ContactStewardshipComputed,
  ContactStewardshipHealthFactor,
} from "@localbrain/shared";

const MEANINGFUL_TYPES = new Set([
  "call",
  "text",
  "email",
  "meeting",
  "door_knock",
  "event",
  "volunteer_shift",
  "donation",
  "commitment",
  "follow_up",
]);

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function meaningfulInteractions(interactions: readonly ContactInteraction[]): ContactInteraction[] {
  return [...interactions]
    .filter((item) => MEANINGFUL_TYPES.has(item.type))
    .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}

export function computeStewardshipMetrics(
  interactions: readonly ContactInteraction[],
  now = new Date(),
): ContactStewardshipComputed {
  const meaningful = meaningfulInteractions(interactions);
  const latest = meaningful[0];
  const daysSince = latest ? daysBetween(new Date(latest.occurred_at), now) : undefined;

  const recentWindowStart = new Date(now);
  recentWindowStart.setDate(recentWindowStart.getDate() - 30);
  const priorWindowStart = new Date(now);
  priorWindowStart.setDate(priorWindowStart.getDate() - 60);

  const recentCount = meaningful.filter(
    (item) => new Date(item.occurred_at) >= recentWindowStart,
  ).length;
  const priorCount = meaningful.filter((item) => {
    const at = new Date(item.occurred_at);
    return at >= priorWindowStart && at < recentWindowStart;
  }).length;

  let momentum: ContactRelationshipMomentum = "stable";
  if (!latest || (daysSince !== undefined && daysSince >= 90)) momentum = "lost";
  else if (daysSince !== undefined && daysSince >= 60) momentum = "dormant";
  else if (daysSince !== undefined && daysSince >= 30) momentum = "cooling";
  else if (recentCount > priorCount + 1) momentum = "growing";
  else if (recentCount === 0 && priorCount === 0 && daysSince !== undefined && daysSince >= 14)
    momentum = "cooling";

  const openFollowUps = interactions.filter(
    (item) => item.follow_up_required && item.follow_up_due_at,
  ).length;

  const factors: ContactStewardshipHealthFactor[] = [];
  let healthScore = 92;

  if (latest) {
    factors.push({
      code: "meaningful_contact",
      label: "Meaningful contact",
      impact: "positive",
      detail: `${daysSince ?? 0} days ago — ${latest.summary}`,
    });
    if (daysSince !== undefined && daysSince >= 30) {
      healthScore -= 10;
      factors.push({
        code: "stale_30",
        label: "Staleness",
        impact: "negative",
        detail: "No meaningful contact in 30+ days",
      });
    }
    if (daysSince !== undefined && daysSince >= 60) healthScore -= 15;
    if (daysSince !== undefined && daysSince >= 90) healthScore -= 20;
  } else {
    healthScore = 35;
    factors.push({
      code: "no_contact",
      label: "No meaningful contact logged",
      impact: "negative",
      detail: "Timeline has no qualifying interactions",
    });
  }

  if (openFollowUps > 0) {
    healthScore -= Math.min(15, openFollowUps * 5);
    factors.push({
      code: "open_followups",
      label: "Open follow-ups",
      impact: "neutral",
      detail: `${openFollowUps} follow-up item(s) on timeline`,
    });
  }

  const positiveRecent = meaningful
    .slice(0, 3)
    .some((item) => item.sentiment === "positive");
  if (positiveRecent) {
    factors.push({
      code: "positive_sentiment",
      label: "Recent response",
      impact: "positive",
      detail: "Recent interactions include positive sentiment",
    });
    healthScore += 5;
  }

  healthScore = Math.max(0, Math.min(100, healthScore));
  const healthLabel =
    healthScore >= 80 ? "Healthy" : healthScore >= 55 ? "Needs attention" : "At risk";

  return {
    momentum,
    health_score: healthScore,
    health_label: healthLabel,
    factors,
    last_meaningful_contact_at: latest?.occurred_at,
    last_meaningful_contact_summary: latest?.summary,
    days_since_meaningful_contact: daysSince,
    open_follow_up_count: openFollowUps,
  };
}

export function buildStewardshipAdvisorySummary(input: {
  steward_user_id?: string;
  contributor_count: number;
  computed: ContactStewardshipComputed;
  primary_context_label?: string;
}): {
  advisory: true;
  notice: string;
  summary_text: string;
  uncertainty_notes: string[];
  live_ai_wired: false;
} {
  const parts: string[] = [];
  if (input.steward_user_id) {
    parts.push(
      `${input.steward_user_id} appears to be the primary steward based on assignment history.`,
    );
  } else {
    parts.push("No steward is currently assigned to this relationship.");
  }
  if (input.primary_context_label) {
    parts.push(`Primary context: ${input.primary_context_label}.`);
  }
  if (input.contributor_count > 0) {
    parts.push(`${input.contributor_count} contributor(s) are associated with this contact.`);
  }
  parts.push(`Momentum is ${input.computed.momentum}.`);
  return {
    advisory: true,
    notice: "Advisory only — stewardship summary cites timeline and assignment history. AI cannot create facts.",
    summary_text: parts.join(" "),
    uncertainty_notes:
      input.steward_user_id || input.computed.last_meaningful_contact_at
        ? []
        : ["Limited timeline evidence — stewardship advisory may be incomplete."],
    live_ai_wired: false,
  };
}
