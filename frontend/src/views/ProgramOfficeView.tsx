import { useCallback, useEffect, useState } from "react";
import type {
  EpoCoverageBars,
  EpoOverview,
  EpoSliceDetail,
  EpoDocEntry,
  IntegrationAuditReport,
  PlatformReadinessReport,
} from "@localbrain/shared";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";
import {
  fetchEpoDocs,
  fetchEpoOverview,
  fetchEpoSlice,
  fetchEpoWhy,
  fetchPlatformReadiness,
} from "../api/epo";
import { fetchIntegrationAudit } from "../api/integration";

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="epo-coverage__row">
      <span className="epo-coverage__label">{label}</span>
      <div className="epo-coverage__track">
        <div className="epo-coverage__fill" style={{ width: `${value}%` }} />
      </div>
      <span className="epo-coverage__pct">{value}%</span>
    </div>
  );
}

function CoveragePanel({ coverage }: { coverage: EpoCoverageBars }) {
  return (
    <div className="epo-coverage">
      <ProgressBar label="Implementation" value={coverage.implementation} />
      <ProgressBar label="Tests" value={coverage.tests} />
      <ProgressBar label="Documentation" value={coverage.documentation} />
      <ProgressBar label="User Guide" value={coverage.user_guide} />
      <ProgressBar label="OJT Lesson" value={coverage.ojt_lesson} />
    </div>
  );
}

function statusClass(status: string): string {
  return `epo-status epo-status--${status.replace(".", "-")}`;
}

export function ProgramOfficeView() {
  const [overview, setOverview] = useState<EpoOverview | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<EpoSliceDetail | null>(null);
  const [whyText, setWhyText] = useState<string | null>(null);
  const [docs, setDocs] = useState<EpoDocEntry[]>([]);
  const [docQuery, setDocQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null);
  const [integration, setIntegration] = useState<IntegrationAuditReport | null>(null);
  const [readiness, setReadiness] = useState<PlatformReadinessReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [ov, docList, integ, ready] = await Promise.all([
        fetchEpoOverview(),
        fetchEpoDocs(),
        fetchIntegrationAudit().catch(() => null),
        fetchPlatformReadiness().catch(() => null),
      ]);
      setOverview(ov);
      setDocs(docList);
      setIntegration(integ);
      setReadiness(ready);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Program Office");
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
    if (!docQuery.trim()) {
      void fetchEpoDocs().then(setDocs).catch(() => {});
      return;
    }
    const t = window.setTimeout(() => {
      void fetchEpoDocs(docQuery).then(setDocs).catch(() => {});
    }, 300);
    return () => window.clearTimeout(t);
  }, [docQuery]);

  async function selectSlice(id: string) {
    setSelectedId(id);
    setWhyText(null);
    try {
      const d = await fetchEpoSlice(id);
      setDetail(d);
    } catch {
      setDetail(null);
    }
  }

  async function askWhy(id: string) {
    try {
      const w = await fetchEpoWhy(id);
      setWhyText(w.explanation);
    } catch {
      setWhyText("Could not load explanation.");
    }
  }

  if (loading && !overview) {
    return (
      <div className="epo">
        <p>Loading Executive Program Office…</p>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="epo">
        <p className="epo__error">{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  const m = overview.metrics;
  const filteredSlices = phaseFilter
    ? overview.slices.filter((s) =>
        overview.phases.find((p) => p.phase_id === phaseFilter)?.slice_ids.includes(s.slice_id),
      )
    : overview.slices;

  return (
    <div className="epo">
      <header className="epo__header">
        <h1>Executive Program Office</h1>
        <p className="epo__meta">
          Read-only mission control · {overview.build_state_engine_id} · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
      </header>

      <ExecutiveQuestionShell route="/program-office" observedAt={overview.observed_at} />

      {readiness ? (
        <section className="epo-readiness" aria-label="LocalBrain V1 Readiness Dashboard">
          <header className="epo-readiness__header">
            <h2>LocalBrain V1 Readiness Dashboard</h2>
            <p className="epo-readiness__meta">
              {readiness.slice_id} · {readiness.engine_id} · {readiness.executive_os_version} ·{" "}
              {readiness.certification_passed ? "Certification passed" : "Certification in progress"}
            </p>
            <p className="epo-readiness__rule">{readiness.core_rule}</p>
          </header>

          <div className="epo-readiness__prs">
            <div className="epo-readiness__prs-score">
              <span className="epo-readiness__prs-label">Platform Readiness Score</span>
              <strong>{readiness.platform_readiness_score.percent}</strong>
              <span className="epo-readiness__prs-band">
                {readiness.platform_readiness_score.label.replace(/_/g, " ")}
              </span>
            </div>
            <p className="epo-readiness__prs-summary">
              {readiness.platform_readiness_score.summary}
            </p>
            <div className="epo-readiness__prs-components">
              <ProgressBar
                label="Architecture stability"
                value={readiness.platform_readiness_score.components.architecture_stability}
              />
              <ProgressBar
                label="Test health"
                value={readiness.platform_readiness_score.components.test_health}
              />
              <ProgressBar
                label="Documentation"
                value={readiness.platform_readiness_score.components.documentation_completeness}
              />
              <ProgressBar
                label="Live surface"
                value={readiness.platform_readiness_score.components.live_surface_coverage}
              />
              <ProgressBar
                label="Integration cohesion"
                value={readiness.platform_readiness_score.components.integration_cohesion}
              />
            </div>
          </div>

          <p className="epo-readiness__freeze">{readiness.freeze_policy}</p>

          <table className="epo-readiness__table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {readiness.readiness_dashboard.map((row) => (
                <tr key={row.area_id}>
                  <td>{row.label}</td>
                  <td>{row.display}</td>
                  <td className="epo-readiness__detail">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="epo-readiness__grid">
            <section>
              <h3>Migration pipeline</h3>
              <ul>
                {readiness.migration_pipeline_stages.map((s) => (
                  <li key={s.stage_id}>
                    {s.complete ? "✓" : "○"} {s.label} ({s.slice_id})
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Four Platform Systems</h3>
              <ul>
                {readiness.platform_systems.map((s) => (
                  <li key={s.system_id}>
                    {s.label}: {s.status}
                    {s.owner_confirmed ? " · owner confirmed" : ""}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Route smoke</h3>
              <p>
                {readiness.route_smoke.passed} passed · {readiness.route_smoke.failed} failed
              </p>
            </section>
          </div>
        </section>
      ) : null}

      {integration ? (
        <section className="epo-integration" aria-label="Phase 1 integration gate">
          <h2>Executive Question Cohesion</h2>
          <p className="epo-integration__meta">
            {integration.engine_id} · {integration.slice_id} ·{" "}
            {integration.targets_met ? "Gate open for LB-OS-021" : "Gate not met"}
          </p>
          <dl className="epo-integration__metrics">
            <dt>Cross-route links</dt>
            <dd>
              {integration.metrics.cross_route_links} / {integration.targets.cross_route_links_min}+
            </dd>
            <dt>Orphan priority pages</dt>
            <dd>{integration.metrics.orphan_pages}</dd>
            <dt>Duplicate executive summaries</dt>
            <dd>{integration.metrics.duplicate_executive_summaries}</dd>
            <dt>EIC executive surfaces</dt>
            <dd>{integration.metrics.eic_surfaces}</dd>
            <dt>Shell consistency</dt>
            <dd>{integration.metrics.shell_consistency_percent}%</dd>
            <dt>Questions with authoritative route</dt>
            <dd>
              {integration.metrics.questions_with_authoritative_route} /{" "}
              {integration.metrics.total_questions}
            </dd>
          </dl>
        </section>
      ) : null}

      <section className="epo-maturity" aria-label="Experience maturity roadmap">
        <h2>Experience Maturity</h2>
        <p className="epo-maturity__intro">
          {overview.experience_maturity_engine_id} — every route is live <em>and</em> maturing toward
          executive-quality usefulness. Badges visible in development builds only.
        </p>
        <div className="epo-maturity__table-wrap">
          <table className="epo-maturity__table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Surface</th>
                <th>Maturity</th>
                <th>Target</th>
                <th>Next upgrade</th>
                <th>Upgrade path</th>
              </tr>
            </thead>
            <tbody>
              {overview.experience_maturity.map((row) => (
                <tr key={row.route}>
                  <td>
                    <code>{row.route}</code>
                  </td>
                  <td>
                    <span className={`epo-maturity__mode epo-maturity__mode--${row.surface_mode}`}>
                      {row.surface_mode}
                    </span>
                  </td>
                  <td>
                    <strong>L{row.maturity_level}</strong>
                    <span className="epo-maturity__label">{row.maturity_label}</span>
                  </td>
                  <td>L{row.target_level}</td>
                  <td>{row.next_upgrade_slice ?? "—"}</td>
                  <td className="epo-maturity__summary">{row.next_upgrade_summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="epo-dashboard" aria-label="Program dashboard">
        <div className="epo-dashboard__progress">
          <span className="epo-dashboard__label">Overall Progress</span>
          <div className="epo-dashboard__bar">
            <div
              className="epo-dashboard__fill"
              style={{ width: `${m.overall_progress_percent}%` }}
            />
          </div>
          <span className="epo-dashboard__pct">{m.overall_progress_percent}%</span>
        </div>
        <dl className="epo-dashboard__stats">
          <div>
            <dt>Current Phase</dt>
            <dd>{overview.current_phase_label}</dd>
          </div>
          <div>
            <dt>Current Slice</dt>
            <dd>
              {overview.current_slice_id
                ? `${overview.current_slice_id} — ${overview.current_slice_name}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt>Next Slice</dt>
            <dd>
              {overview.next_slice_id
                ? `${overview.next_slice_id} — ${overview.next_slice_name}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt>Operational Health</dt>
            <dd>{m.operational_health_score}</dd>
          </div>
          <div>
            <dt>Engineering Score</dt>
            <dd>{m.engineering_score ?? "—"}</dd>
          </div>
          <div>
            <dt>Completed / Remaining</dt>
            <dd>
              {m.completed_slices} / {m.remaining_slices}
            </dd>
          </div>
          <div>
            <dt>API today</dt>
            <dd>${m.api_cost_today_usd.toFixed(2)} · {m.tokens_today.toLocaleString()} tokens</dd>
          </div>
        </dl>
      </section>

      <section className="epo-sprint" aria-label="Current sprint">
        <h2>Current Sprint</h2>
        <div className="epo-sprint__cols">
          <div>
            <h3>Completed</h3>
            <ul>
              {overview.current_sprint.completed.map((id) => (
                <li key={id}>
                  <button type="button" onClick={() => void selectSlice(id)}>
                    {id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>In Progress</h3>
            <ul>
              {overview.current_sprint.in_progress.length > 0 ? (
                overview.current_sprint.in_progress.map((id) => (
                  <li key={id}>
                    <button type="button" onClick={() => void selectSlice(id)}>
                      {id}
                    </button>
                  </li>
                ))
              ) : (
                <li className="epo-sprint__empty">—</li>
              )}
            </ul>
          </div>
          <div>
            <h3>Queued</h3>
            <ul>
              {overview.current_sprint.queued.map((id) => (
                <li key={id}>
                  <button type="button" onClick={() => void selectSlice(id)}>
                    {id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="epo-velocity" aria-label="Build velocity">
        <h2>Build Velocity</h2>
        <p className="epo-velocity__period">Last {overview.build_velocity.period_days} days</p>
        <dl className="epo-velocity__dl">
          <div>
            <dt>Slices completed</dt>
            <dd>{overview.build_velocity.slices_completed}</dd>
          </div>
          <div>
            <dt>Commits</dt>
            <dd>{overview.build_velocity.commits_count}</dd>
          </div>
          <div>
            <dt>Documents changed</dt>
            <dd>{overview.build_velocity.documents_changed}</dd>
          </div>
          <div>
            <dt>LOC (TS)</dt>
            <dd>{overview.build_velocity.loc_count.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Tests</dt>
            <dd>{overview.build_velocity.tests_count}</dd>
          </div>
          <div>
            <dt>Avg slice duration</dt>
            <dd>
              {overview.build_velocity.average_slice_duration_days != null
                ? `${overview.build_velocity.average_slice_duration_days} days`
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="epo-phases">
        <h2>Phase Navigator</h2>
        <div className="epo-phases__grid">
          {overview.phases.map((p) => (
            <button
              key={p.phase_id}
              type="button"
              className={`epo-phase ${phaseFilter === p.phase_id ? "epo-phase--active" : ""}`}
              onClick={() => setPhaseFilter(phaseFilter === p.phase_id ? null : p.phase_id)}
            >
              <span className="epo-phase__label">{p.label}</span>
              <div className="epo-phase__bar">
                <div className="epo-phase__fill" style={{ width: `${p.progress_percent}%` }} />
              </div>
              <span className="epo-phase__pct">{p.progress_percent}%</span>
              <p className="epo-phase__obj">{p.objectives}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="epo-body">
        <section className="epo-slices">
          <h2>Slice Scoreboard</h2>
          <ul className="epo-slice-list">
            {filteredSlices.map((s) => (
              <li key={s.slice_id}>
                <button
                  type="button"
                  className={`epo-slice-row ${selectedId === s.slice_id ? "epo-slice-row--selected" : ""}`}
                  onClick={() => void selectSlice(s.slice_id)}
                >
                  <span className={statusClass(s.status)}>{s.status}</span>
                  <strong>{s.slice_id}</strong>
                  <span>{s.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="epo-detail">
          {detail ? (
            <>
              <h2>{detail.slice_id}</h2>
              <p className="epo-detail__name">{detail.name}</p>
              {detail.mission ? <p className="epo-detail__mission">{detail.mission}</p> : null}
              <CoveragePanel coverage={detail.coverage} />
              {detail.blocker_explanation ? (
                <p className="epo-detail__blocker">{detail.blocker_explanation}</p>
              ) : null}
              <button
                type="button"
                className="epo-detail__why-btn"
                onClick={() => void askWhy(detail.slice_id)}
              >
                Why aren&apos;t we here yet?
              </button>
              {whyText ? <p className="epo-detail__why">{whyText}</p> : null}
              {detail.objectives.length > 0 ? (
                <>
                  <h3>Objectives</h3>
                  <ul>
                    {detail.objectives.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {detail.burt_packet_path ? (
                <p>
                  <strong>Burt packet:</strong> {detail.burt_packet_path}
                </p>
              ) : null}
            </>
          ) : (
            <p className="epo-detail__empty">Select a slice from the scoreboard.</p>
          )}
        </section>
      </div>

      <section className="epo-graph">
        <h2>Build Graph</h2>
        <ol className="epo-graph__list">
          {overview.build_graph.map((n) => (
            <li key={n.slice_id} className={`epo-graph__node epo-graph__node--${n.status}`}>
              <button type="button" onClick={() => void selectSlice(n.slice_id)}>
                {n.slice_id}
              </button>
              <span>{n.status}</span>
              {n.depends_on.length > 0 ? (
                <span className="epo-graph__deps">← {n.depends_on.join(", ")}</span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="epo-decisions">
        <h2>Decision Timeline</h2>
        <ul className="epo-decision-list">
          {overview.decisions.map((d) => (
            <li key={d.id}>
              <time>{d.date}</time>
              <strong>{d.title}</strong>
              <p>{d.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="epo-commits">
        <h2>Commit Timeline</h2>
        <ul className="epo-commit-list">
          {overview.commit_timeline.map((c) => (
            <li key={c.hash}>
              <time>{c.date}</time>
              <code>{c.hash}</code>
              <span>{c.subject}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="epo-docs">
        <h2>Documentation Library</h2>
        <input
          type="search"
          className="epo-docs__search"
          placeholder="Search doctrine, architecture, burt packets…"
          value={docQuery}
          onChange={(e) => setDocQuery(e.target.value)}
        />
        <ul className="epo-doc-list">
          {docs.slice(0, 40).map((d) => (
            <li key={d.path}>
              <span className="epo-doc-list__cat">{d.category}</span>
              <strong>{d.title}</strong>
              <span className="epo-doc-list__path">{d.path}</span>
              <p>{d.quick_summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="epo-metrics">
        <h2>Live Metrics</h2>
        <dl className="epo-metrics__dl">
          <dt>Documents</dt>
          <dd>{m.document_count}</dd>
          <dt>Modules</dt>
          <dd>{m.module_count}</dd>
          <dt>Workspaces</dt>
          <dd>{m.workspace_count}</dd>
          <dt>V1 slices</dt>
          <dd>{m.total_v1_slices}</dd>
        </dl>
        {overview.gate_text ? <p className="epo__gate">{overview.gate_text}</p> : null}
      </section>
    </div>
  );
}
