import { useCallback, useEffect, useState } from "react";
import { LiveSurfaceBanner } from "../../components/LiveSurfaceBanner";
import type {
  DataHealthScore,
  DataIntelligenceOverview,
  DataLineageResult,
  QueryPlanPreview,
} from "@localbrain/shared";
import {
  fetchDataLineage,
  fetchDataOverview,
  previewDataQuery,
} from "../../api/dataIntelligence";

type TabId = "overview" | "sources" | "query" | "relationships" | "insights" | "learn";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "sources", label: "Knowledge Sources" },
  { id: "query", label: "Query Studio" },
  { id: "relationships", label: "Relationships" },
  { id: "insights", label: "Insights" },
  { id: "learn", label: "Learn" },
];

function ScoreHero({ score }: { score: DataHealthScore }) {
  return (
    <section className={`eng-score eng-score--${score.label}`}>
      <div className="eng-score__main">
        <span className="system-health__score-value">{score.score}</span>
        <span className="system-health__score-label">Data Health Score</span>
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

function healthClass(h: string): string {
  return `data-dept__health data-dept__health--${h}`;
}

export function DataIntelligenceView() {
  const [tab, setTab] = useState<TabId>("overview");
  const [overview, setOverview] = useState<DataIntelligenceOverview | null>(null);
  const [question, setQuestion] = useState("Show active workspaces");
  const [plan, setPlan] = useState<QueryPlanPreview | null>(null);
  const [lineage, setLineage] = useState<DataLineageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      setOverview(await fetchDataOverview());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Data & Intelligence");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(id);
  }, [load]);

  async function runQueryPreview() {
    try {
      const p = await previewDataQuery(question);
      setPlan(p);
      const lin = await fetchDataLineage(question, p.sources_used[0]);
      setLineage(lin);
    } catch {
      setPlan(null);
      setLineage(null);
    }
  }

  if (loading && !overview) {
    return (
      <div className="data-dept">
        <p>Loading Data &amp; Intelligence Department…</p>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="data-dept">
        <p className="data-dept__error">{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  const graph = overview.relationship_graph;

  return (
    <div className="data-dept">
      <header className="data-dept__header">
        <h1>Data &amp; Intelligence Department</h1>
        <p className="data-dept__meta">
          What we know · where it comes from · what we learn · Data Chief · LB-OS-014 · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
      </header>

      <LiveSurfaceBanner route="/studio/data" observedAt={overview.observed_at} />

      <aside className="writing-dept__guardrails">
        {overview.guardrails.map((g) => (
          <span key={g} className="writing-dept__guardrail-pill">
            {g}
          </span>
        ))}
      </aside>

      <nav className="eng-dept__tabs" aria-label="Data tabs">
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
          <ScoreHero score={overview.data_health_score} />
          <dl className="eng-dept__stats">
            <div>
              <dt>Connected sources</dt>
              <dd>
                {overview.knowledge_sources.filter((s) => s.status === "active").length} active
              </dd>
            </div>
            <div>
              <dt>Active queries</dt>
              <dd>{overview.active_queries} (plan-only in V1)</dd>
            </div>
          </dl>
          <section>
            <h2>Chief recommendation</h2>
            <div className="eng-rec">
              <p>
                <strong>What:</strong> {overview.chief_recommendation.what}
              </p>
              <p>
                <strong>Why:</strong> {overview.chief_recommendation.why}
              </p>
              <p>
                <strong>If approved:</strong> {overview.chief_recommendation.if_approved}
              </p>
            </div>
          </section>
          <section>
            <h2>Data quality</h2>
            <ul>
              {overview.data_quality_summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "sources" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Knowledge Sources</h2>
            <p className="eng-dept__hint">
              Every origin of truth — active connections and planned imports.
            </p>
            <table className="data-dept__source-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Kind</th>
                  <th>Status</th>
                  <th>Records</th>
                  <th>Health</th>
                  <th>Permissions</th>
                </tr>
              </thead>
              <tbody>
                {overview.knowledge_sources.map((s) => (
                  <tr key={s.source_id}>
                    <td>
                      <strong>{s.title}</strong>
                      <br />
                      <code className="data-dept__source-id">{s.source_id}</code>
                    </td>
                    <td>{s.kind}</td>
                    <td>{s.status}</td>
                    <td>{s.record_count ?? "—"}</td>
                    <td>
                      <span className={healthClass(s.health)}>{s.health}</span>
                    </td>
                    <td>{s.permissions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}

      {tab === "query" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Query Studio</h2>
            <p className="eng-dept__hint">
              Natural language → query plan → SQL/API preview. Execution blocked until approval.
            </p>
            <div className="eng-dept__impact-form">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Show me everyone in Pulaski County who..."
                aria-label="Natural language question"
                style={{ flex: 1, minWidth: 240 }}
              />
              <button type="button" onClick={() => void runQueryPreview()}>
                Plan query
              </button>
            </div>
            {plan && (
              <>
                <p className="writing-dept__publish-blocked">Execution blocked — plan preview only</p>
                <h3>Plan steps</h3>
                <ol>
                  {plan.plan_steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p>{plan.explanation}</p>
                {plan.suggested_sql && (
                  <>
                    <h3>Suggested SQL</h3>
                    <pre className="eng-dept__burt-preview">{plan.suggested_sql}</pre>
                  </>
                )}
                {plan.suggested_api && (
                  <>
                    <h3>Suggested API</h3>
                    <pre className="eng-dept__burt-preview">{plan.suggested_api}</pre>
                  </>
                )}
                <h3>Sources used</h3>
                <ul>
                  {plan.sources_used.map((s) => (
                    <li key={s}>
                      <code>{s}</code>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {lineage && (
              <section>
                <h3>Data lineage</h3>
                <ol className="data-dept__lineage">
                  {lineage.steps.map((step) => (
                    <li key={step.stage}>
                      <strong>{step.label}</strong> — {step.detail}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </section>
        </div>
      )}

      {tab === "relationships" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Data relationships</h2>
            <p className="eng-dept__hint">
              Workspace → Knowledge Source → Digital Assets → Modules → Decisions
            </p>
            <p>
              {graph.nodes.length} nodes · {graph.edges.length} edges
            </p>
            <h3>Knowledge sources</h3>
            <ul className="eng-dept__node-list">
              {graph.nodes
                .filter((n) => n.kind === "knowledge_source")
                .map((n) => (
                  <li key={n.id}>
                    {n.label} <span>({n.detail})</span>
                  </li>
                ))}
            </ul>
            <h3>Workspaces</h3>
            <ul className="eng-dept__node-list">
              {graph.nodes
                .filter((n) => n.kind === "workspace")
                .map((n) => (
                  <li key={n.id}>{n.label}</li>
                ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "insights" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Insights</h2>
            <ul className="data-dept__insights">
              {overview.insights.map((i) => (
                <li key={i.id} className={`data-dept__insight data-dept__insight--${i.severity}`}>
                  <strong>{i.title}</strong>
                  <p>{i.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "learn" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Learn — Data &amp; SQL OJT</h2>
            <dl className="eng-dept__learn">
              <div>
                <dt>Level</dt>
                <dd>{overview.learn.current_level}</dd>
              </div>
              <div>
                <dt>Progress</dt>
                <dd>{overview.learn.progress_percent}%</dd>
              </div>
              <div>
                <dt>Lesson</dt>
                <dd>{overview.learn.suggested_lesson}</dd>
              </div>
              <div>
                <dt>Challenge</dt>
                <dd>{overview.learn.practice_challenge}</dd>
              </div>
            </dl>
            <h3>Concepts</h3>
            <ul>
              {overview.learn.concepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="eng-dept__hint">
              SQL · indexes · joins · APIs · normalization · data modeling — full OJT in LB-OS-026+.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
