import { useCallback, useEffect, useState } from "react";
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

  const loadTree = useCallback(async (path?: string) => {
    const data = await fetchExplorerTree(path);
    setNodes(data.nodes);
    setCurrentPath(data.parent);
  }, []);

  const refreshIndexStatus = useCallback(async () => {
    const s = await fetchIndexStatus();
    setIndexStatus(
      s.indexing
        ? "Background index running…"
        : s.latest_run
          ? `Index ${s.latest_run.status} · ${s.latest_run.paths_scanned} paths`
          : "Index not started",
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

  async function selectNode(node: ExplorerTreeNode) {
    setSelected(node);
    setWhy(null);
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
          {indexStatus} · Registry first · incremental index · LB-OS-005
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
              onClick={() => void showWhy(explain.path, "understand")}
            >
              Why am I seeing this?
            </button>
          </section>
        ) : null}

        {mode === "executive" ? (
          <section className="ke-explorer__panel">
            <h2>Executive — why it matters today</h2>
            <ul className="ke-explorer__insights">
              {insights.map((ins) => (
                <li key={ins.id} className={`ke-insight ke-insight--${ins.severity}`}>
                  <p>{ins.message}</p>
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
