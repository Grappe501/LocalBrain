import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { MigrationPlannerOverview, MigrationRiskLevel } from "@localbrain/shared";
import { fetchMigrationPlanner } from "../api/migration";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function riskClass(risk: MigrationRiskLevel): string {
  return `migration-risk migration-risk--${risk}`;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="migration__panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function MigrationPlannerView() {
  const [plan, setPlan] = useState<MigrationPlannerOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      setPlan(await fetchMigrationPlanner());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load migration planner");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !plan) {
    return (
      <div className="migration">
        <p>Loading migration planner…</p>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="migration">
        <p className="migration__error">{error}</p>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="migration">
      <ExecutiveQuestionShell route="/migration" observedAt={plan.observed_at} />

      <header className="migration__header">
        <p className="migration__crumb">
          <Link to="/program-office">Program Office</Link> / Migration Planner
        </p>
        <h1>Drive Architecture &amp; Migration Planner</h1>
        <p className="migration__meta">
          LB-OS-018 · Read-only planning · Updated {new Date(plan.observed_at).toLocaleTimeString()}
        </p>
        <p className="migration__rule">{plan.core_rule}</p>
        <p className="migration__link-row">
          <Link to="/migration/audit">Run LB-OS-019 filesystem mapping audit →</Link>
          {" · "}
          <Link to="/migration/consolidation">Executive Consolidation Briefing (LB-OS-020) →</Link>
          {" · "}
          <Link to="/migration/workspace-architecture">Workspace Architecture (LB-OS-021) →</Link>
          {" · "}
          <Link to="/migration/digital-land-survey">Digital Land Survey (LB-OS-022) →</Link>
          {" · "}
          <Link to="/migration/proof">Migration Proof Engine (LB-OS-023) →</Link>
          {" · "}
          <Link to="/migration/planning">Migration Planning (LB-OS-024) →</Link>
          {plan.inventory_gate ? (
            <span className="migration__gate-ok"> · Inventory gate complete</span>
          ) : null}
        </p>
        <ul className="migration__guardrails">
          {plan.guardrails.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </header>

      <div className="migration__grid">
        <Panel title="C:/ vs H:/ doctrine">
          <dl className="migration__dl">
            <dt>C:</dt>
            <dd>{plan.doctrine.c_drive_role}</dd>
            <dt>H:</dt>
            <dd>{plan.doctrine.h_drive_role}</dd>
            <dt>LocalBrain default</dt>
            <dd>{plan.doctrine.localbrain_default}</dd>
          </dl>
          <ul className="migration__list">
            {plan.doctrine.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Panel>

        <Panel title="Drive volumes">
          <table className="migration__table">
            <thead>
              <tr>
                <th>Drive</th>
                <th>Used</th>
                <th>Free</th>
                <th>Indexed</th>
                <th>Allowed roots</th>
              </tr>
            </thead>
            <tbody>
              {plan.volumes.map((v) => (
                <tr key={v.label}>
                  <td>{v.label}</td>
                  <td>{v.used_percent !== null ? `${v.used_percent}%` : "—"}</td>
                  <td>{formatBytes(v.free_bytes)}</td>
                  <td>
                    {v.indexed_asset_count} ({formatBytes(v.indexed_bytes)})
                  </td>
                  <td>{v.allowed_folder_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Placement audit">
          <p>
            <strong>{plan.placement_audit.misplaced_count}</strong> issue(s) from{" "}
            {plan.placement_audit.total_indexed} indexed assets
          </p>
          {plan.placement_audit.candidates.length === 0 ? (
            <p>No misplaced candidates in current index.</p>
          ) : (
            <table className="migration__table migration__table--compact">
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Path</th>
                  <th>Class</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {plan.placement_audit.candidates.slice(0, 25).map((c) => (
                  <tr key={c.path}>
                    <td>
                      <span className={riskClass(c.risk)}>{c.risk}</span>
                    </td>
                    <td className="migration__path">{c.path}</td>
                    <td>{c.classification}</td>
                    <td>{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel title="Migration arc (018–026)">
          <ol className="migration__arc">
            {plan.migration_arc.map((phase) => (
              <li
                key={phase.slice_id}
                className={`migration__arc-item migration__arc-item--${phase.status}`}
              >
                <strong>{phase.slice_id}</strong> {phase.name}
                <span className="migration__arc-status">{phase.status}</span>
                <p>{phase.description}</p>
              </li>
            ))}
          </ol>
          {!plan.inventory_gate ? (
            <p className="migration__gate">⛔ Inventory gate (LB-OS-019) not complete — no migration execution</p>
          ) : null}
        </Panel>

        <Panel title="H:/ workspace structure proposal">
          <p>Root: {plan.structure_proposal.root}</p>
          <ul className="migration__list">
            {plan.structure_proposal.folders.map((f) => (
              <li key={f.path}>
                <code>{f.path}</code> — {f.purpose}{" "}
                <span className={riskClass(f.risk)}>{f.risk}</span>
              </li>
            ))}
          </ul>
          {plan.structure_proposal.notes.map((n) => (
            <p key={n} className="migration__note">
              {n}
            </p>
          ))}
        </Panel>

        <Panel title="Archive strategy draft">
          <ul className="migration__list">
            {plan.archive_strategy.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          {plan.archive_strategy.candidates.length > 0 ? (
            <table className="migration__table migration__table--compact">
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Strategy</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {plan.archive_strategy.candidates.slice(0, 15).map((c) => (
                  <tr key={`${c.path}-${c.strategy}`}>
                    <td className="migration__path">{c.path}</td>
                    <td>{c.strategy}</td>
                    <td>
                      <span className={riskClass(c.risk)}>{c.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </Panel>

        <Panel title="Approval checklist">
          <ul className="migration__checklist">
            {plan.approval_checklist.map((item) => (
              <li key={item.id} className={item.completed ? "migration__check--done" : ""}>
                <span className={riskClass(item.risk)}>{item.risk}</span>
                <strong>{item.label}</strong>
                {item.required_before_execution ? (
                  <span className="migration__required">required</span>
                ) : null}
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
