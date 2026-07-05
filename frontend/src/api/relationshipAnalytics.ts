import type {
  RelationshipAnalyticsDashboard,
  RelationshipAnalyticsExport,
  RelationshipAnalyticsFilter,
} from "@localbrain/shared";

const CONTACT_USER_HEADERS = {
  "X-Contact-User-Id": "local-user",
  "X-Contact-User-Role": "admin",
} as const;

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string; error?: string };
    return body.message ?? body.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

function filterQuery(filter: RelationshipAnalyticsFilter): string {
  const params = new URLSearchParams();
  if (filter.tag) params.set("tag", filter.tag);
  if (filter.context_id) params.set("context_id", filter.context_id);
  if (filter.strength) params.set("strength", filter.strength);
  if (filter.momentum) params.set("momentum", filter.momentum);
  if (filter.health_label) params.set("health_label", filter.health_label);
  const suffix = params.toString();
  return suffix ? `&${suffix}` : "";
}

export async function fetchRelationshipAnalyticsDashboard(
  workspaceId: string,
  filter: RelationshipAnalyticsFilter = {},
): Promise<RelationshipAnalyticsDashboard> {
  const res = await fetch(
    `/api/contacts/analytics/dashboard?workspace_id=${encodeURIComponent(workspaceId)}${filterQuery(filter)}`,
    { headers: CONTACT_USER_HEADERS },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { dashboard: RelationshipAnalyticsDashboard };
  return data.dashboard;
}

export async function fetchRelationshipAnalyticsExport(
  workspaceId: string,
  filter: RelationshipAnalyticsFilter = {},
): Promise<RelationshipAnalyticsExport> {
  const res = await fetch(
    `/api/contacts/analytics/export?workspace_id=${encodeURIComponent(workspaceId)}${filterQuery(filter)}`,
    { headers: CONTACT_USER_HEADERS },
  );
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { export: RelationshipAnalyticsExport };
  return data.export;
}
