import type { RelationshipHealthScore } from "@localbrain/shared";
import { SEED_PEOPLE } from "./seedCatalog.js";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function labelFromScore(score: number): RelationshipHealthScore["label"] {
  if (score >= 85) return "strong";
  if (score >= 70) return "solid";
  return "needs_attention";
}

export function computeRelationshipHealthScore(): RelationshipHealthScore {
  const people = SEED_PEOPLE.filter((p) => p.person_id !== "person_steve");
  const active = people.filter((p) => p.status === "active").length;
  const dormant = people.filter((p) => p.status === "dormant").length;
  const avgStrength =
    people.length > 0
      ? people.reduce((s, p) => s + p.relationship_strength, 0) / people.length
      : 70;
  const avgRecency =
    people.filter((p) => p.last_touch_days_ago !== null).length > 0
      ? people
          .filter((p) => p.last_touch_days_ago !== null)
          .reduce((s, p) => s + (p.last_touch_days_ago ?? 0), 0) /
        people.filter((p) => p.last_touch_days_ago !== null).length
      : 30;
  const withProjects = people.filter((p) => p.workspace_ids.length > 0).length;
  const withIntros = people.filter((p) => p.introduced_by).length;

  const communication = clamp(100 - Math.min(40, avgRecency));
  const recency = communication;
  const strength = clamp(avgStrength);
  const projects = clamp((withProjects / Math.max(1, people.length)) * 100);
  const sharedWork = projects;
  const introductions = clamp(50 + withIntros * 8);
  const followThrough = clamp(100 - dormant * 15);
  const engagement = clamp(active * 12 + 20);

  const factors = [
    {
      id: "communication",
      name: "Communication",
      score: communication,
      weight: 0.14,
      detail: `Avg ${Math.round(avgRecency)} days since touch`,
    },
    {
      id: "recency",
      name: "Recency",
      score: recency,
      weight: 0.14,
      detail: `${active} active relationships`,
    },
    {
      id: "strength",
      name: "Strength",
      score: strength,
      weight: 0.16,
      detail: `Avg strength ${Math.round(avgStrength)}`,
    },
    {
      id: "projects",
      name: "Projects",
      score: projects,
      weight: 0.12,
      detail: `${withProjects} people linked to workspaces`,
    },
    {
      id: "shared_work",
      name: "Shared work",
      score: sharedWork,
      weight: 0.12,
      detail: "LivingWorkspace involvement",
    },
    {
      id: "introductions",
      name: "Introductions",
      score: introductions,
      weight: 0.1,
      detail: `${withIntros} introduction chains tracked`,
    },
    {
      id: "follow_through",
      name: "Follow-through",
      score: followThrough,
      weight: 0.12,
      detail: `${dormant} dormant relationships`,
    },
    {
      id: "engagement",
      name: "Engagement",
      score: engagement,
      weight: 0.1,
      detail: "Chief engagement recommendations ready",
    },
  ];

  const weightSum = factors.reduce((s, f) => s + f.weight, 0);
  const score = clamp(factors.reduce((sum, f) => sum + f.score * f.weight, 0) / weightSum);

  return {
    score,
    label: labelFromScore(score),
    summary:
      labelFromScore(score) === "strong"
        ? "Relationship network is active — Chief can recommend high-value outreach."
        : labelFromScore(score) === "solid"
          ? "Good foundation — address dormant ties and open introductions."
          : "Several relationships need attention — review Engagement tab.",
    factors,
  };
}
