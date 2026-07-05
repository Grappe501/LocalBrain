import type {
  RelationshipAnalyticsDashboard,
  RelationshipAnalyticsExport,
  RelationshipAnalyticsFilter,
} from "@localbrain/shared";
import {
  composeRelationshipAnalyticsDashboard,
  composeRelationshipAnalyticsExport,
} from "./relationshipAnalyticsComposer.js";
import type { ContactAccessContext } from "./relationshipAnalyticsValidator.js";
import {
  assertRoleCapable,
  canViewRelationshipAnalytics,
} from "./relationshipAnalyticsValidator.js";

function parseFilter(query: Record<string, unknown>): RelationshipAnalyticsFilter {
  const filter: RelationshipAnalyticsFilter = {};
  if (typeof query.tag === "string" && query.tag.trim()) filter.tag = query.tag.trim();
  if (typeof query.context_id === "string" && query.context_id.trim()) {
    filter.context_id = query.context_id.trim();
  }
  if (typeof query.strength === "string" && query.strength.trim()) {
    filter.strength = query.strength.trim() as RelationshipAnalyticsFilter["strength"];
  }
  if (typeof query.momentum === "string" && query.momentum.trim()) {
    filter.momentum = query.momentum.trim() as RelationshipAnalyticsFilter["momentum"];
  }
  if (typeof query.health_label === "string" && query.health_label.trim()) {
    filter.health_label = query.health_label.trim();
  }
  return filter;
}

export function buildRelationshipAnalyticsDashboard(
  workspaceId: string,
  ctx: ContactAccessContext,
  query: Record<string, unknown> = {},
): RelationshipAnalyticsDashboard {
  assertRoleCapable(
    canViewRelationshipAnalytics(ctx),
    "forbidden",
    "Insufficient permissions to view relationship analytics",
  );
  return composeRelationshipAnalyticsDashboard({
    workspace_id: workspaceId,
    filter: parseFilter(query),
    ctx,
  });
}

export function buildRelationshipAnalyticsExport(
  workspaceId: string,
  ctx: ContactAccessContext,
  query: Record<string, unknown> = {},
): RelationshipAnalyticsExport {
  assertRoleCapable(
    canViewRelationshipAnalytics(ctx),
    "forbidden",
    "Insufficient permissions to export relationship analytics",
  );
  return composeRelationshipAnalyticsExport({
    workspace_id: workspaceId,
    filter: parseFilter(query),
    ctx,
  });
}
