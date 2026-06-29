import { useCallback, useEffect, useState } from "react";
import type {
  BurtPacketPreview,
  EngineeringExplainResponse,
  EngineeringImpactResult,
  EngineeringOverview,
  EngineeringScore,
} from "@localbrain/shared";
import {
  fetchEngineeringImpact,
  fetchEngineeringOverview,
  fetchExplainProject,
  previewBurtPacket,
} from "../../api/engineering";

type TabId = "overview" | "architecture" | "projects" | "burt" | "knowledge" | "learn";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "projects", label: "Projects" },
  { id: "burt", label: "Burt" },
  { id: "knowledge", label: "Knowledge" },
  { id: "learn", label: "Learn" },
];

function ScoreHero({ score }: { score: EngineeringScore }) {
  return (
    <section
      className={`system-health__score eng-score eng-score--${score.label}`}
      aria-label="Engineering score"
    >
      <div className="eng-score__main">
        <span className="system-health__score-value">{score.score}</span>
        <span className="system-health__score-label">Engineering Score</span>
        <p className="system-health__score-summary">{score.summary}</p>
      </div>
      <div className="eng-score__factors">
        {score.factors.map((f) => (
          <div key={f.id} className="eng-score__factor">
            <div className="eng-score__factor-head">
              <span>{f.name}</span>
              <strong>{f.score}</strong>
            </div>
            <div className="epo-coverage__track">
              <div className="epo-coverage__fill" style={{ width: `${f.score}%` }} />
            </div>
            <span className="eng-score__factor-detail">{f.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Recommendation({ r }: { r: { what: string; why: string; confidence: string; if_approved: string } }) {
  return (
    <div className="eng-rec">
      <p>
        <strong>What:</strong> {r.what}
      </p>
      <p>
        <strong>Why:</strong> {r.why}
      </p>
      <p>
        <strong>Confidence:</strong> {r.confidence}
      </p>
      <p>
        <strong>If approved:</strong> {r.if_approved}
      </p>
    </div>
  );
}

export function EngineeringDepartmentView() {
  const [tab, setTab] = useState<TabId>("overview");
  const [overview, setOverview] = useState<EngineeringOverview | null>(null);
  const [explain, setExplain] = useState<EngineeringExplainResponse | null>(null);
  const [impactQuery, setImpactQuery] = useState("ENG-PM-001");
  const [impact, setImpact] = useState<EngineeringImpactResult | null>(null);
  const [burtSliceId, setBurtSliceId] = useState("LB-OS-013");
  const [burtTitle, setBurtTitle] = useState("Writing Department");
  const [burtPreview, setBurtPreview] = useState<BurtPacketPreview | null>(null);
  const [selectedProject, setSelectedProject] = useState("localbrain");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      const ov = await fetchEngineeringOverview();
      setOverview(ov);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Engineering Department");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (tab !== "projects" && tab !== "overview") return;
    void fetchExplainProject(selectedProject)
      .then(setExplain)
      .catch(() => setExplain(null));
  }, [tab, selectedProject]);

  async function runImpact() {
    try {
      const result = await fetchEngineeringImpact(impactQuery);
      setImpact(result);
    } catch {
      setImpact(null);
    }
  }

  async function runBurtPreview() {
    try {
      const p = await previewBurtPacket({ slice_id: burtSliceId, title: burtTitle });
      setBurtPreview(p);
    } catch {
      setBurtPreview(null);
    }
  }

  if (loading && !overview) {
    return (
      <div className="eng-dept">
        <p>Loading Engineering Department…</p>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="eng-dept">
        <p className="eng-dept__error">{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  const graph = overview.graph_summary;

  return (
    <div className="eng-dept">
      <header className="eng-dept__header">
        <h1>Engineering Department</h1>
        <p className="eng-dept__meta">
          Read-only intelligence · Engineering Chief · LB-OS-012 · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
      </header>

      <nav className="eng-dept__tabs" aria-label="Engineering tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`eng-dept__tab ${tab === t.id ? "eng-dept__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="eng-dept__panel">
          <ScoreHero score={overview.engineering_score} />
          <dl className="eng-dept__stats">
            <div>
              <dt>Current sprint</dt>
              <dd>{overview.current_sprint}</dd>
            </div>
            <div>
              <dt>Current slice</dt>
              <dd>
                {overview.current_slice_id
                  ? `${overview.current_slice_id} — ${overview.current_slice_name}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>Tests</dt>
              <dd>{overview.test_status.detail}</dd>
            </div>
            <div>
              <dt>Operational Health</dt>
              <dd>{overview.operational_health_score}</dd>
            </div>
          </dl>
          <section>
            <h2>Chief recommendation</h2>
            <Recommendation r={overview.chief_recommendation} />
          </section>
          <section>
            <h2>Technical debt</h2>
            <ul>
              {overview.technical_debt.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
          {explain && (
            <section>
              <h2>Explain this project — {explain.workspace_title}</h2>
              <Recommendation r={explain.recommended_next_step} />
            </section>
          )}
        </div>
      )}

      {tab === "architecture" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Engineering Knowledge Graph</h2>
            <p className="eng-dept__hint">
              Self-aware department map — repositories, modules, engines, capabilities, workspaces,
              decisions, Burt packets, tests, and slices.
            </p>
            <dl className="eng-dept__graph-counts">
              {Object.entries(graph.node_counts).map(([kind, count]) => (
                <div key={kind}>
                  <dt>{kind.replace(/_/g, " ")}</dt>
                  <dd>{count}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section>
            <h2>Kernel &amp; engines</h2>
            <ul className="eng-dept__node-list">
              {graph.nodes
                .filter((n) => n.kind === "engine")
                .map((n) => (
                  <li key={n.id}>
                    <code>{n.id}</code> {n.label} — <span>{n.status}</span>
                  </li>
                ))}
            </ul>
          </section>
          <section>
            <h2>Modules &amp; capabilities</h2>
            <ul className="eng-dept__node-list">
              {graph.nodes
                .filter((n) => n.kind === "module" || n.kind === "capability")
                .map((n) => (
                  <li key={n.id}>
                    <code>{n.id}</code> {n.label}
                  </li>
                ))}
            </ul>
          </section>
          <section>
            <h2>Impact Analysis</h2>
            <p className="eng-dept__hint">
              Query an engine, module, or path fragment — graph traversal, not LLM inference.
            </p>
            <div className="eng-dept__impact-form">
              <input
                value={impactQuery}
                onChange={(e) => setImpactQuery(e.target.value)}
                placeholder="e.g. ENG-PM-001 or permissionEngine"
                aria-label="Impact query"
              />
              <button type="button" onClick={() => void runImpact()}>
                Analyze
              </button>
            </div>
            {impact && (
              <div className="eng-dept__impact-result">
                <p>
                  Matched {impact.matched_nodes.length} · Affected {impact.affected_nodes.length}
                </p>
                {impact.affected_nodes.length > 0 && (
                  <ul>
                    {impact.affected_nodes.map((n) => (
                      <li key={n.id}>
                        [{n.kind}] {n.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {tab === "projects" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Engineering LivingWorkspaces</h2>
            <ul className="eng-dept__project-list">
              {overview.projects.map((p) => (
                <li key={p.workspace_id}>
                  <button
                    type="button"
                    className={
                      selectedProject === p.workspace_id ? "eng-dept__project--active" : ""
                    }
                    onClick={() => setSelectedProject(p.workspace_id)}
                  >
                    {p.title} <span>({p.workspace_type})</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          {explain && (
            <section className="eng-dept__explain">
              <h2>Explain this project</h2>
              <dl>
                <dt>Mission</dt>
                <dd>{explain.mission}</dd>
                <dt>Architecture</dt>
                <dd>{explain.architecture}</dd>
                <dt>Health</dt>
                <dd>{explain.health}</dd>
                <dt>Current sprint</dt>
                <dd>{explain.current_sprint}</dd>
              </dl>
              <h3>Major risks</h3>
              <ul>
                {explain.major_risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <h3>Dependencies</h3>
              <ul>
                {explain.dependencies.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <h3>Open decisions</h3>
              <ul>
                {explain.open_decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <h3>Recommended next step</h3>
              <Recommendation r={explain.recommended_next_step} />
            </section>
          )}
        </div>
      )}

      {tab === "burt" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Generate packet preview</h2>
            <p className="eng-dept__hint">Read-only preview — export via approval queue when write path opens.</p>
            <div className="eng-dept__burt-form">
              <label>
                Slice ID
                <input value={burtSliceId} onChange={(e) => setBurtSliceId(e.target.value)} />
              </label>
              <label>
                Title
                <input value={burtTitle} onChange={(e) => setBurtTitle(e.target.value)} />
              </label>
              <button type="button" onClick={() => void runBurtPreview()}>
                Preview
              </button>
            </div>
            {burtPreview && (
              <pre className="eng-dept__burt-preview">{burtPreview.markdown}</pre>
            )}
          </section>
          <section>
            <h2>History</h2>
            <ul className="eng-dept__burt-history">
              {overview.burt_history.map((p) => (
                <li key={p.path}>
                  <code>{p.slice_id ?? "—"}</code> {p.title}{" "}
                  <span className={`epo-status epo-status--${p.status.replace(".", "-")}`}>
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "knowledge" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Engineering documentation</h2>
            <ul className="eng-dept__doc-list">
              {overview.knowledge_docs.map((d) => (
                <li key={d.path}>
                  <span className="eng-dept__doc-cat">{d.category}</span>
                  <strong>{d.title}</strong>
                  <code>{d.path}</code>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Specialists (routing stub)</h2>
            <ul className="eng-dept__specialists">
              {overview.specialists.map((s) => (
                <li key={s.id}>
                  <code>{s.id}</code> — {s.name}: {s.focus}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "learn" && (
        <div className="eng-dept__panel">
          <section>
            <h2>OJT — Engineering track</h2>
            <p className="eng-dept__hint">
              Full teach mode ships with OJT Academy (LB-OS-026+). Toggle Learn in Settings.
            </p>
            <dl className="eng-dept__learn">
              <div>
                <dt>Current level</dt>
                <dd>{overview.learn.current_level}</dd>
              </div>
              <div>
                <dt>Progress</dt>
                <dd>{overview.learn.progress_percent}%</dd>
              </div>
              <div>
                <dt>Suggested lesson</dt>
                <dd>{overview.learn.suggested_lesson}</dd>
              </div>
              <div>
                <dt>Practice challenge</dt>
                <dd>{overview.learn.practice_challenge}</dd>
              </div>
            </dl>
            <h3>Concepts learned</h3>
            <ul>
              {overview.learn.concepts_learned.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
