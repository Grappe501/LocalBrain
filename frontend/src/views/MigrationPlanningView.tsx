import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {
  MigrationPlan,
  MigrationPlanOverview,
  MigrationProofOverview,
  PlanVariantStrategy,
} from "@localbrain/shared";
import {
  fetchMigrationPlans,
  fetchMigrationProof,
  generateMigrationPlans,
} from "../api/migration";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";

function PlanExecutiveCard({
  plan,
  recommended,
  selected,
  onSelect,
}: {
  plan: MigrationPlan;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`plan-card plan-card--${plan.variant_strategy} ${selected ? "plan-card--selected" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <header className="plan-card__header">
        <h3>{plan.variant_label}</h3>
        {recommended ? <span className="plan-card__badge">Recommended</span> : null}
      </header>
      <dl className="plan-card__metrics">
        <div>
          <dt>Quality</dt>
          <dd>{plan.plan_quality.percent}</dd>
        </div>
        <div>
          <dt>Risk</dt>
          <dd>{plan.plan_quality.risk_label}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{plan.estimated_duration_minutes} min</dd>
        </div>
        <div>
          <dt>Rollback</dt>
          <dd>{plan.rollback_duration_minutes} min</dd>
        </div>
        <div>
          <dt>Operations</dt>
          <dd>{plan.total_operations}</dd>
        </div>
        <div>
          <dt>Ready for Proposal</dt>
          <dd>{plan.ready_for_proposal ? "YES" : "NO"}</dd>
        </div>
      </dl>
      <p className="plan-card__id">{plan.plan_id}</p>
    </article>
  );
}

export function MigrationPlanningView() {
  const [overview, setOverview] = useState<MigrationPlanOverview | null>(null);
  const [proof, setProof] = useState<MigrationProofOverview | null>(null);
  const [plans, setPlans] = useState<MigrationPlan[]>([]);
  const [recommendedId, setRecommendedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [planOverview, proofOverview] = await Promise.all([
        fetchMigrationPlans(),
        fetchMigrationProof(),
      ]);
      setOverview(planOverview);
      setProof(proofOverview);
      if (planOverview.recent_plans.length > 0) {
        setPlans(planOverview.recent_plans.slice(0, 3));
        setSelectedId(planOverview.recent_plans[0].plan_id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load planning");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleGenerate = async () => {
    const cert = proof?.latest_certificates.find((c) => c.plan_eligible);
    if (!cert) {
      setError("No plan-eligible certificate — run proof simulation first");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const result = await generateMigrationPlans(cert.certificate_id);
      setPlans(result.plans);
      setRecommendedId(result.recommended_plan_id);
      setSelectedId(result.recommended_plan_id ?? result.plans[0]?.plan_id ?? null);
      setOverview(await fetchMigrationPlans());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Plan generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const selected = plans.find((p) => p.plan_id === selectedId) ?? plans[0] ?? null;

  if (loading && !overview) {
    return (
      <div className="migration">
        <p>Loading migration planning…</p>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="migration planning">
      <ExecutiveQuestionShell route="/migration/planning" observedAt={overview.observed_at} />

      <header className="migration__header">
        <p className="migration__crumb">
          <Link to="/program-office">Program Office</Link> /{" "}
          <Link to="/migration">Migration</Link> / Planning
        </p>
        <h1>Migration Planning Engine</h1>
        <p className="migration__meta">
          {overview.slice_id} · {overview.engine_id} · {overview.planning_engine_id} · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
        <p className="migration__rule">{overview.core_rule}</p>
        <p className="migration__link-row">
          <Link to="/migration/proof">Proof Engine (023) →</Link>
          {" · "}
          <Link to="/migration/digital-land-survey">Land Survey (022) →</Link>
          {" · "}
          <Link to="/migration/approval">Executive Approval (025) →</Link>
        </p>
        <div className="migration__actions-bar">
          <button type="button" disabled={generating} onClick={() => void handleGenerate()}>
            {generating ? "Generating plans…" : "Generate plans from latest certificate"}
          </button>
        </div>
        <ul className="migration__guardrails">
          {overview.guardrails.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </header>

      {error ? <p className="migration__error">{error}</p> : null}

      {plans.length > 0 ? (
        <section className="plan-executive">
          <h2 className="plan-executive__title">Plan variants</h2>
          <div className="plan-executive__cards">
            {plans.map((p) => (
              <PlanExecutiveCard
                key={p.plan_id}
                plan={p}
                recommended={p.plan_id === recommendedId}
                selected={p.plan_id === selectedId}
                onSelect={() => setSelectedId(p.plan_id)}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="plan-executive__empty">No plans yet — certify proof then generate plans.</p>
      )}

      {selected ? (
        <div className="migration__grid">
          <section className="migration__panel">
            <h2>Provenance</h2>
            <ul className="migration__list">
              <li>Audit: {selected.provenance.audit_ref ?? "—"}</li>
              <li>Survey: {selected.provenance.survey_ref ?? "—"}</li>
              <li>Certificate: {selected.provenance.certificate_id}</li>
              <li>Simulation: {selected.provenance.simulation_id}</li>
              <li>Plan: {selected.provenance.plan_id}</li>
            </ul>
          </section>

          <section className="migration__panel">
            <h2>Constraints</h2>
            <ul className="migration__list">
              {selected.constraints.map((c) => (
                <li key={c.constraint_id} className={`plan-constraint plan-constraint--${c.status}`}>
                  {c.status === "pass" ? "✓" : c.status === "warn" ? "~" : "✗"} {c.label} — {c.detail}
                </li>
              ))}
            </ul>
          </section>

          <section className="migration__panel">
            <h2>Objectives</h2>
            <ul className="migration__list">
              {selected.objectives.map((o) => (
                <li key={o.objective_id}>
                  <strong>{o.priority}</strong>: {o.label} — {o.fulfillment_percent}%
                </li>
              ))}
            </ul>
          </section>

          <section className="migration__panel">
            <h2>Execution order</h2>
            <ol className="plan-ops">
              {selected.operations.slice(0, 20).map((op) => (
                <li key={op.operation_id}>
                  {op.sequence_order}. {op.label}{" "}
                  <span className="plan-ops__ws">{op.workspace_id}</span>
                </li>
              ))}
              {selected.operations.length > 20 ? (
                <li>… {selected.operations.length - 20} more operations</li>
              ) : null}
            </ol>
          </section>
        </div>
      ) : null}
    </div>
  );
}
