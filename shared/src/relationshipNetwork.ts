/** Relationship & Network Intelligence Department — LB-OS-015 (read-only) */

export type RelationshipStatus = "active" | "warm" | "dormant" | "new";

export type OrganizationKind =
  | "nonprofit"
  | "campaign"
  | "government"
  | "media"
  | "vendor"
  | "coalition"
  | "other";

export interface RelationshipProfile {
  person_id: string;
  name: string;
  roles: string[];
  organization_ids: string[];
  workspace_ids: string[];
  interests: string[];
  relationship_strength: number;
  last_touch_days_ago: number | null;
  status: RelationshipStatus;
  introduced_by: string | null;
  summary: string;
}

export interface OrganizationProfile {
  org_id: string;
  name: string;
  kind: OrganizationKind;
  description: string;
  member_person_ids: string[];
  workspace_ids: string[];
}

export interface RelationshipTimelineEvent {
  id: string;
  person_id: string;
  event_type:
    | "met"
    | "worked_together"
    | "email"
    | "meeting"
    | "project"
    | "introduction"
    | "status";
  title: string;
  detail: string;
  occurred_at: string;
}

export type NetworkNodeKind = "person" | "organization" | "workspace" | "introduction";

export interface NetworkGraphNode {
  id: string;
  kind: NetworkNodeKind;
  label: string;
  detail: string | null;
}

export interface NetworkGraphEdge {
  from: string;
  to: string;
  kind: "knows" | "member_of" | "introduced" | "involved_in" | "works_with";
}

export interface NetworkGraph {
  nodes: NetworkGraphNode[];
  edges: NetworkGraphEdge[];
  read_only: true;
}

export interface EngagementRecommendation {
  id: string;
  priority: "high" | "medium" | "low";
  action: string;
  reason: string;
  related_person_id: string | null;
  related_org_id: string | null;
  confidence: "high" | "medium" | "low";
  automation_blocked: true;
}

export interface RelationshipHealthFactor {
  id: string;
  name: string;
  score: number;
  weight: number;
  detail: string;
}

export interface RelationshipHealthScore {
  score: number;
  label: "strong" | "solid" | "needs_attention";
  summary: string;
  factors: RelationshipHealthFactor[];
}

export interface RelationshipChiefRecommendation {
  what: string;
  why: string;
  confidence: "high" | "medium" | "low";
  if_approved: string;
}

export interface RelationshipLearnStub {
  concepts: string[];
  current_level: string;
  suggested_lesson: string;
  practice_challenge: string;
  progress_percent: number;
}

export interface RelationshipNetworkOverview {
  relationship_health_score: RelationshipHealthScore;
  active_relationships: number;
  follow_ups_due: number;
  strongest_connections: { person_id: string; name: string; strength: number }[];
  dormant_relationships: { person_id: string; name: string; last_touch_days_ago: number | null }[];
  chief_recommendation: RelationshipChiefRecommendation;
  people: RelationshipProfile[];
  organizations: OrganizationProfile[];
  network_graph: NetworkGraph;
  engagement_recommendations: EngagementRecommendation[];
  learn: RelationshipLearnStub;
  guardrails: string[];
  philosophy: string;
  read_only: true;
  observed_at: string;
}
