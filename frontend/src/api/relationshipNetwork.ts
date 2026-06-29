import type {
  RelationshipNetworkOverview,
  RelationshipProfile,
  RelationshipTimelineEvent,
  RelationshipHealthScore,
  NetworkGraph,
  EngagementRecommendation,
} from "@localbrain/shared";

export async function fetchRelationshipOverview(): Promise<RelationshipNetworkOverview> {
  const res = await fetch("/api/relationship-network/overview");
  if (!res.ok) throw new Error("Relationship overview fetch failed");
  return (await res.json()) as RelationshipNetworkOverview;
}

export async function fetchRelationshipScore(): Promise<RelationshipHealthScore> {
  const res = await fetch("/api/relationship-network/score");
  if (!res.ok) throw new Error("Relationship score fetch failed");
  return (await res.json()) as RelationshipHealthScore;
}

export async function fetchNetworkGraph(): Promise<NetworkGraph> {
  const res = await fetch("/api/relationship-network/graph");
  if (!res.ok) throw new Error("Network graph fetch failed");
  return (await res.json()) as NetworkGraph;
}

export async function fetchEngagementRecommendations(): Promise<EngagementRecommendation[]> {
  const res = await fetch("/api/relationship-network/engagement");
  if (!res.ok) throw new Error("Engagement fetch failed");
  const data = (await res.json()) as { recommendations: EngagementRecommendation[] };
  return data.recommendations;
}

export async function fetchPersonProfile(
  personId: string,
): Promise<{ person: RelationshipProfile; timeline: RelationshipTimelineEvent[] }> {
  const res = await fetch(`/api/relationship-network/people/${encodeURIComponent(personId)}`);
  if (!res.ok) throw new Error("Person profile fetch failed");
  return (await res.json()) as {
    person: RelationshipProfile;
    timeline: RelationshipTimelineEvent[];
  };
}
