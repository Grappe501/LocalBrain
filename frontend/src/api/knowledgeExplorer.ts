export type ExplorerOverlayBadge = {
  kind: string;
  label: string;
  tone: "good" | "warn" | "muted";
};

export type ExplorerTreeNode = {
  path: string;
  name: string;
  is_directory: boolean;
  size_bytes: number | null;
  mtime: string | null;
  workspace_id: string | null;
  workspace_title: string | null;
  overlay: ExplorerOverlayBadge[];
  asset_id: string | null;
  kind: string | null;
  lifecycle_stage: string | null;
  health_score: number | null;
  in_registry: boolean;
};

export type ExplainFolderResult = {
  path: string;
  name: string;
  purpose: string;
  workspace: {
    workspace_id: string;
    title: string;
    executive_context: string;
    current_focus: string;
    health_score: number | null;
    success_definition: string;
  } | null;
  important_files: { name: string; path: string; size_bytes: number | null }[];
  recent_activity: { title: string; detail: string; created_at: string }[];
  recommendations: string[];
  duplicate_risks: string[];
  stale_hint: string | null;
  index_status: string;
  asset: {
    asset_id: string;
    kind: string;
    lifecycle_stage: string;
    health_score: number | null;
    hash: string | null;
    size_bytes: number | null;
    created_at: string | null;
    modified_at: string | null;
    workspace_id: string | null;
    in_registry: boolean;
  } | null;
  collections: { collection_id: string; title: string; asset_count: number | null }[];
  intelligence: {
    health_signals: {
      fresh: boolean;
      referenced_recently: boolean;
      active_workspace: boolean;
      has_backup: boolean;
      no_duplicates: boolean;
      indexed: boolean;
      tagged: boolean;
      understood: boolean;
    };
    health_score: number;
    duplicate_candidates: {
      group_id: string;
      match_reason: string;
      candidate_only: true;
      assets: { path: string; name: string }[];
    }[];
    recommendations: {
      id: string;
      title: string;
      message: string;
      risk: "low" | "medium" | "high";
      recommend_only: true;
      why: string[];
    }[];
  } | null;
};

export type ExecutiveInsight = {
  id: string;
  severity: "info" | "warn" | "priority";
  message: string;
  path?: string;
  workspace_id?: string;
  why: string;
  recommend_only?: boolean;
  risk?: "low" | "medium" | "high";
  title?: string;
  asset_count?: number;
  bytes_estimate?: number;
};

export type WhySeeingThisResult = {
  path: string;
  surfaced_because: string[];
  workspace: ExplainFolderResult["workspace"];
  what_changed: string[];
  decision_facing: string | null;
};

export type SearchResultItem = {
  kind: "file" | "workspace" | "insight";
  title: string;
  subtitle: string;
  path?: string;
  workspace_id?: string;
};

export async function fetchExplorerTree(path?: string): Promise<{
  nodes: ExplorerTreeNode[];
  parent: string | null;
}> {
  const url = path
    ? `/api/knowledge-explorer/tree?path=${encodeURIComponent(path)}`
    : "/api/knowledge-explorer/tree";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Tree fetch failed");
  return (await res.json()) as { nodes: ExplorerTreeNode[]; parent: string | null };
}

export async function fetchExplain(path: string): Promise<ExplainFolderResult> {
  const res = await fetch(
    `/api/knowledge-explorer/explain?path=${encodeURIComponent(path)}`,
  );
  if (!res.ok) throw new Error("Explain failed");
  const data = (await res.json()) as { explain: ExplainFolderResult };
  return data.explain;
}

export async function fetchWhy(path: string, context?: string): Promise<WhySeeingThisResult> {
  const params = new URLSearchParams({ path });
  if (context) params.set("context", context);
  const res = await fetch(`/api/knowledge-explorer/why?${params}`);
  if (!res.ok) throw new Error("Why failed");
  const data = (await res.json()) as { why: WhySeeingThisResult };
  return data.why;
}

export async function fetchExecutiveInsights(path?: string): Promise<ExecutiveInsight[]> {
  const url = path
    ? `/api/knowledge-explorer/executive?path=${encodeURIComponent(path)}`
    : "/api/knowledge-explorer/executive";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Executive insights failed");
  const data = (await res.json()) as { insights: ExecutiveInsight[] };
  return data.insights;
}

export async function fetchExplorerSearch(q: string): Promise<SearchResultItem[]> {
  const res = await fetch(`/api/knowledge-explorer/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("Search failed");
  const data = (await res.json()) as { results: SearchResultItem[] };
  return data.results;
}

export async function fetchIndexStatus(): Promise<{
  indexing: boolean;
  latest_run: { status: string; paths_scanned: number } | null;
  registry?: {
    total_assets: number;
    by_lifecycle: Record<string, number>;
    dormant_bytes_estimate: number;
    collections_count: number;
  };
}> {
  const res = await fetch("/api/knowledge-explorer/index/status");
  if (!res.ok) throw new Error("Index status failed");
  return (await res.json()) as {
    indexing: boolean;
    latest_run: { status: string; paths_scanned: number } | null;
    registry?: {
      total_assets: number;
      by_lifecycle: Record<string, number>;
      dormant_bytes_estimate: number;
      collections_count: number;
    };
  };
}
