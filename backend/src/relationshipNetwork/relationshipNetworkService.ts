import type { RelationshipNetworkOverview } from "@localbrain/shared";
import { computeRelationshipHealthScore } from "./relationshipHealthScore.js";
import { SEED_ORGANIZATIONS, SEED_PEOPLE } from "./seedCatalog.js";
import { buildNetworkGraph } from "./networkGraph.js";
import { generateEngagementRecommendations } from "./engagementRecommendations.js";

export const RELATIONSHIP_GUARDRAILS = [
  "Recommendations only — no automated calls, emails, or posts",
  "No Google Contacts / Gmail / Calendar sync in V1",
  "No CRM writes without approval",
  "Social Knowledge — the relationship is the fundamental object",
  "All future imports permission-gated",
];

export const RELATIONSHIP_PHILOSOPHY =
  "The fundamental object is not a person — it is a relationship. People, organizations, workspaces, and communications connect through relationships.";

export function getRelationshipNetworkOverview(): RelationshipNetworkOverview {
  const score = computeRelationshipHealthScore();
  const people = SEED_PEOPLE.filter((p) => p.person_id !== "person_steve");
  const engagement = generateEngagementRecommendations();

  const strongest = [...people]
    .sort((a, b) => b.relationship_strength - a.relationship_strength)
    .slice(0, 5)
    .map((p) => ({
      person_id: p.person_id,
      name: p.name,
      strength: p.relationship_strength,
    }));

  const dormant = people
    .filter((p) => p.status === "dormant" || (p.last_touch_days_ago ?? 0) > 30)
    .map((p) => ({
      person_id: p.person_id,
      name: p.name,
      last_touch_days_ago: p.last_touch_days_ago,
    }));

  const followUpsDue = people.filter(
    (p) => (p.last_touch_days_ago ?? 0) >= 14 && p.person_id !== "person_steve",
  ).length;

  return {
    relationship_health_score: score,
    active_relationships: people.filter((p) => p.status === "active").length,
    follow_ups_due: followUpsDue,
    strongest_connections: strongest,
    dormant_relationships: dormant,
    chief_recommendation: {
      what: engagement[0]?.action ?? "Review network graph for outreach priorities",
      why: engagement[0]?.reason ?? "Chief of Staff uses social knowledge for who to work with next",
      confidence: engagement[0]?.confidence ?? "medium",
      if_approved: "Log touch manually or propose CRM note via Actions when write path opens",
    },
    people: SEED_PEOPLE,
    organizations: SEED_ORGANIZATIONS,
    network_graph: buildNetworkGraph(),
    engagement_recommendations: engagement,
    learn: {
      concepts: [
        "Social Knowledge",
        "Relationship timeline",
        "Stakeholder mapping",
        "Coalition building",
        "Introduction ledger",
      ],
      current_level: "Mapper — stub catalog + recommendations",
      suggested_lesson: "Why the relationship — not the contact row — is the foundational object",
      practice_challenge: "Trace Kelly → Chris → Stand Up Arkansas in the Network Graph",
      progress_percent: Math.min(100, score.score),
    },
    guardrails: RELATIONSHIP_GUARDRAILS,
    philosophy: RELATIONSHIP_PHILOSOPHY,
    read_only: true,
    observed_at: new Date().toISOString(),
  };
}

export { computeRelationshipHealthScore } from "./relationshipHealthScore.js";
export { buildNetworkGraph } from "./networkGraph.js";
export { getTimelineForPerson, getPerson, getOrganization } from "./seedCatalog.js";
export { generateEngagementRecommendations } from "./engagementRecommendations.js";
