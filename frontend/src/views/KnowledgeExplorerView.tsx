import { useCallback, useEffect, useState } from "react";
import { sendCommand } from "../api/command";
import {
  fetchExecutiveInsights,
  fetchExplain,
  fetchExplorerSearch,
  fetchExplorerTree,
  fetchIndexStatus,
  fetchWhy,
  type ExecutiveInsight,
  type ExplainFolderResult,
  type ExplorerTreeNode,
  type SearchResultItem,
  type WhySeeingThisResult,
} from "../api/knowledgeExplorer";

type ExplorerMode = "browse" | "understand" | "executive";

function overlayIcon(badge: ExplorerTreeNode["overlay"][0]): string {
  if (badge.kind === "health" && badge.tone === "good") return "🟢";
  if (badge.kind === "focus") return "🎯";
  if (badge.label === "Pinned") return "📌";
  if (badge.label === "Dormant" || badge.label === "Archive candidate") return "🟡";
  if (badge.tone === "warn") return "⚠";
  return "·";
}

export function KnowledgeExplorerView() {
  const [mode, setMode] = useState<ExplorerMode>("browse");
  const [nodes, setNodes] = useState<ExplorerTreeNode[]>([]);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [selected, setSelected] = useState<ExplorerTreeNode | null>(null);
  const [explain, setExplain] = useState<ExplainFolderResult | null>(null);
  const [insights, setInsights] = useState<ExecutiveInsight[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [why, setWhy] = useState<WhySeeingThisResult | null>(null);
  const [indexStatus, setIndexStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cosResponse, setCosResponse] = useState<string | null>(null);
  const [cosLoading, setCosLoading] = useState(false);

  const loadTree = useCallback(async (path?: string) => {
    const data = await fetchExplorerTree(path);
    setNodes(data.nodes);
    setCurrentPath(data.parent);
  }, []);

  const refreshIndexStatus = useCallback(async () => {
    const s = await fetchIndexStatus();
    const registryLine = s.registry
      ? ` · ${s.registry.total_assets} assets in registry`
      : "";
    setIndexStatus(
      s.indexing
        ? `Background sync running…${registryLine}`
        : s.latest_run
          ? `Index ${s.latest_run.status} · ${s.latest_run.paths_scanned} paths${registryLine}`
          : `Digital Asset Registry${registryLine || " · ready"}`,
    );
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setError(null);
        await loadTree();
        await refreshIndexStatus();
        const ins = await fetchExecutiveInsights();
        setInsights(ins);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load Knowledge Explorer");
      } finally {
        setLoading(false);
      }
    }
    void init();
    const t = setInterval(() => void refreshIndexStatus(), 8000);
    return () => clearInterval(t);
  }, [loadTree, refreshIndexStatus]);

  async function askCosAboutAsset(path: string) {
    setCosLoading(true);
    setCosResponse(null);
    try {
      const res = await sendCommand({
        message: "Summarize this selected asset (read-only, permission-gated).",
        asset_path: path,
        tool: "summarize_asset",
      });
      setCosResponse(
        res.source_path
          ? `Source: ${res.source_path}\n\n${res.message}`
          : res.message,
      );
    } catch (e) {
      setCosResponse(e instanceof Error ? e.message : "CoS request failed");
    } finally {
      setCosLoading(false);
    }
  }

  async function selectNode(node: ExplorerTreeNode) {
    setSelected(node);
    setWhy(null);
    setCosResponse(null);
    if (mode === "understand" || mode === "executive") {
      try {
        const ex = await fetchExplain(node.path);
        setExplain(ex);
      } catch {
        setExplain(null);
      }
    }
    if (node.is_directory) {
      await loadTree(node.path);
    }
  }

  async function goUp() {
    if (!currentPath) return;
    const parts = currentPath.replace(/\\/g, "/").split("/");
    parts.pop();
    const parent = parts.join("/") || undefined;
    if (!parent) {
      await loadTree();
      setSelected(null);
      setExplain(null);
      return;
    }
    await loadTree(parent);
  }

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const results = await fetchExplorerSearch(searchQ);
    setSearchResults(results);
  }

  async function showWhy(path: string, context?: string) {
    const w = await fetchWhy(path, context);
    setWhy(w);
  }

  if (loading) {
    return <article className="ke-explorer"><p>Loading Knowledge Explorer…</p></article>;
  }

  if (error) {
    return <article className="ke-explorer"><p className="safety-panel__error">{error}</p></article>;
  }

  return (
    <article className="ke-explorer">
      <header className="ke-explorer__header">
        <h1>Knowledge Explorer</h1>
        <p className="ke-explorer__meta">
          {indexStatus} · Read-only file tools · LB-OS-009
        </p>
      </header>

      <div className="ke-explorer__modes" role="tablist">
        {(["browse", "understand", "executive"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            className={mode === m ? "ke-explorer__mode ke-explorer__mode--active" : "ke-explorer__mode"}
            onClick={() => setMode(m)}
          >
            {m === "browse" ? "Browse" : m === "understand" ? "Understand" : "Executive"}
          </button>
        ))}
      </div>

      <form className="ke-explorer__search" onSubmit={runSearch}>
        <input
          type="search"
          placeholder="file: · workspace: · focus: · stale: · duplicate: …"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          aria-label="Knowledge Explorer search"
        />
        <button type="submit">Search</button>
      </form>

      {searchResults.length > 0 ? (
        <ul className="ke-explorer__search-results">
          {searchResults.map((r) => (
            <li key={`${r.kind}-${r.title}-${r.subtitle}`}>
              <button
                type="button"
                className="ke-explorer__search-hit"
                onClick={() => r.path && void showWhy(r.path, "search")}
              >
                <strong>{r.title}</strong>
                <span>{r.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="ke-explorer__body">
        <section className="ke-explorer__tree-pane">
          {currentPath ? (
            <button type="button" className="ke-explorer__up" onClick={() => void goUp()}>
              ↑ Up
            </button>
          ) : null}
          <ul className="ke-explorer__tree">
            {nodes.map((node) => (
              <li key={node.path}>
                <button
                  type="button"
                  className={
                    selected?.path === node.path
                      ? "ke-explorer__node ke-explorer__node--selected"
                      : "ke-explorer__node"
                  }
                  onClick={() => void selectNode(node)}
                >
                  <span className="ke-explorer__node-name">
                    {node.is_directory ? "📁" : "📄"} {node.name}
                  </span>
                  {node.overlay.length > 0 ? (
                    <span className="ke-explorer__overlay">
                      {node.overlay.slice(0, 3).map((b) => (
                        <span key={b.label} title={b.label}>
                          {overlayIcon(b)} {b.label}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {mode === "understand" && explain ? (
          <section className="ke-explorer__panel">
            <h2>Understand — {explain.name}</h2>
            <p>{explain.purpose}</p>
            {explain.asset ? (
              <div className="ke-explorer__asset-block">
                <h3>Digital Asset Registry</h3>
                <dl className="ke-explorer__fingerprint">
                  <dt>Kind</dt>
                  <dd>{explain.asset.kind}</dd>
                  <dt>Lifecycle</dt>
                  <dd>{explain.asset.lifecycle_stage}</dd>
                  <dt>Health</dt>
                  <dd>{explain.intelligence?.health_score ?? explain.asset.health_score ?? "—"}</dd>
                  <dt>Size</dt>
                  <dd>{explain.asset.size_bytes ?? "—"}</dd>
                  <dt>Modified</dt>
                  <dd>{explain.asset.modified_at ?? "—"}</dd>
                  <dt>Created</dt>
                  <dd>{explain.asset.created_at ?? "—"}</dd>
                  <dt>Hash</dt>
                  <dd>{explain.asset.hash ?? "—"}</dd>
                  <dt>Workspace</dt>
                  <dd>{explain.asset.workspace_id ?? explain.workspace?.title ?? "—"}</dd>
                </dl>
                {explain.intelligence ? (
                  <>
                    <h4>Health signals</h4>
                    <ul className="ke-explorer__signals">
                      {Object.entries(explain.intelligence.health_signals).map(([k, v]) => (
                        <li key={k}>
                          {v ? "✓" : "·"} {k.replace(/_/g, " ")}
                        </li>
                      ))}
                    </ul>
                    {explain.intelligence.duplicate_candidates.length > 0 ? (
                      <>
                        <h4>Duplicate candidates</h4>
                        <p className="ke-explorer__meta">Candidates only — no dedupe actions.</p>
                        <ul>
                          {explain.intelligence.duplicate_candidates.map((g) => (
                            <li key={g.group_id}>
                              {g.match_reason}: {g.assets.map((a) => a.name).join(", ")}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                    {explain.intelligence.recommendations.length > 0 ? (
                      <>
                        <h4>Recommendations</h4>
                        <ul className="ke-explorer__recs">
                          {explain.intelligence.recommendations.map((r) => (
                            <li key={r.id} className={`ke-rec ke-rec--${r.risk}`}>
                              <strong>{r.title}</strong> — {r.message}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </>
                ) : null}
                <p className="ke-explorer__meta">{explain.index_status}</p>
              </div>
            ) : selected && !selected.in_registry ? (
              <p className="ke-explorer__meta">Not yet in Digital Asset Registry — sync pending.</p>
            ) : null}
            {explain.workspace ? (
              <div className="ke-explorer__workspace-block">
                <h3>{explain.workspace.title}</h3>
                <p>
                  <strong>Focus:</strong> {explain.workspace.current_focus || "—"}
                </p>
                <p>
                  <strong>Health:</strong> {explain.workspace.health_score ?? "—"}
                </p>
                <p className="ke-explorer__context">{explain.workspace.executive_context}</p>
              </div>
            ) : null}
            {explain.collections.length > 0 ? (
              <>
                <h3>Collections</h3>
                <ul className="ke-explorer__collections">
                  {explain.collections.map((c) => (
                    <li key={c.collection_id}>
                      {c.title} — {c.asset_count ?? 0} assets
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {explain.important_files.length > 0 ? (
              <>
                <h3>Important files</h3>
                <ul>
                  {explain.important_files.map((f) => (
                    <li key={f.path}>
                      <code>{f.name}</code>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {explain.recommendations.length > 0 ? (
              <>
                <h3>Recommendations</h3>
                <ul>
                  {explain.recommendations.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </>
            ) : null}
            <button
              type="button"
              className="ke-explorer__why-btn"
              onClick={() => void askCosAboutAsset(explain.path)}
              disabled={cosLoading}
            >
              {cosLoading ? "Asking CoS…" : "Ask CoS about this asset"}
            </button>
            {cosResponse ? (
              <div className="ke-explorer__cos-response">
                <h3>Chief of Staff</h3>
                <pre>{cosResponse}</pre>
              </div>
            ) : null}
            <button
              type="button"
              className="ke-explorer__why-btn"
              onClick={() => void showWhy(explain.path, "understand")}
            >
              Why am I seeing this?
            </button>
          </section>
        ) : null}

        {mode === "executive" ? (
          <section className="ke-explorer__panel">
            <h2>Executive — cleanup recommendations</h2>
            <p className="ke-explorer__meta">Recommend only · no archive, delete, or move actions</p>
            <ul className="ke-explorer__insights">
              {insights.map((ins) => (
                <li key={ins.id} className={`ke-insight ke-insight--${ins.severity}`}>
                  {ins.title ? <h3 className="ke-insight__title">{ins.title}</h3> : null}
                  <p>{ins.message}</p>
                  {ins.asset_count != null ? (
                    <p className="ke-insight__meta">
                      {ins.asset_count} assets
                      {ins.bytes_estimate != null
                        ? ` · ${Math.round(ins.bytes_estimate / (1024 * 1024))} MB`
                        : null}
                      {ins.risk ? ` · risk ${ins.risk}` : null}
                      {ins.recommend_only ? " · recommend only" : null}
                    </p>
                  ) : null}
                  <p className="ke-insight__why">{ins.why}</p>
                  {ins.path ? (
                    <button
                      type="button"
                      className="ke-explorer__why-btn"
                      onClick={() => void showWhy(ins.path!, "executive")}
                    >
                      Why am I seeing this?
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {why ? (
        <aside className="ke-explorer__why-panel" role="dialog" aria-label="Why am I seeing this">
          <h2>Why am I seeing this?</h2>
          <ul>
            {why.surfaced_because.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {why.what_changed.length > 0 ? (
            <>
              <h3>What changed</h3>
              <ul>
                {why.what_changed.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          ) : null}
          {why.decision_facing ? (
            <p>
              <strong>Decision facing:</strong> {why.decision_facing}
            </p>
          ) : null}
          <button type="button" onClick={() => setWhy(null)}>
            Close
          </button>
        </aside>
      ) : null}
    </article>
  );
}
