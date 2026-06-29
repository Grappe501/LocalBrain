import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {
  MigrationProofOverview,
  MigrationProofSimulateResponse,
  ProofCertificate,
  ProofDimensionResult,
} from "@localbrain/shared";
import { fetchMigrationProof, simulateMigrationProof } from "../api/migration";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="migration__panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function DimensionCard({ dim }: { dim: ProofDimensionResult }) {
  return (
    <article className={`proof-dim proof-dim--${dim.status}`}>
      <header className="proof-dim__header">
        <h3>{dim.label}</h3>
        <span className="proof-dim__score">
          {dim.earned_points}/{dim.max_points} · {dim.status.toUpperCase()}
        </span>
      </header>
      <ul className="proof-dim__checks">
        {dim.checks.map((c) => (
          <li key={c.check_id} className={`proof-check proof-check--${c.status}`}>
            <strong>{c.label}</strong> — {c.detail}
          </li>
        ))}
      </ul>
    </article>
  );
}

function CertificateCard({ cert }: { cert: ProofCertificate }) {
  return (
    <article className={`proof-cert proof-cert--${cert.result}`}>
      <header className="proof-cert__header">
        <h3>{cert.certificate_id}</h3>
        <span className="proof-cert__result">{cert.result}</span>
      </header>
      <p>
        Simulation: <code>{cert.simulation_id}</code> · Proof:{" "}
        <strong>{cert.proof_score.percent}/100</strong> · Recommendation:{" "}
        {cert.proof_score.recommendation_confidence}
      </p>
      <p className="proof-cert__meta">
        Evidence audit: {cert.evidence.audit_run_id?.slice(0, 8) ?? "—"} · Survey:{" "}
        {cert.evidence.survey_observed_at
          ? new Date(cert.evidence.survey_observed_at).toLocaleDateString()
          : "—"}
      </p>
      <p>
        Proposal eligible:{" "}
        <strong>
          {cert.plan_eligible ? "Plan eligible (024)" : "No"} ·{" "}
          {cert.proposal_eligible ? "Proposal path open after plan (025)" : "Re-proof required"}
        </strong>
      </p>
      <div className="proof-cert__dims">
        {cert.proof_score.dimension_results.map((d) => (
          <DimensionCard key={d.dimension_id} dim={d} />
        ))}
      </div>
    </article>
  );
}

export function MigrationProofView() {
  const [overview, setOverview] = useState<MigrationProofOverview | null>(null);
  const [result, setResult] = useState<MigrationProofSimulateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setOverview(await fetchMigrationProof());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load migration proof");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSimulate = async () => {
    setSimulating(true);
    setError(null);
    try {
      const res = await simulateMigrationProof();
      setResult(res);
      setOverview(await fetchMigrationProof());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulation failed");
    } finally {
      setSimulating(false);
    }
  };

  if (loading && !overview) {
    return (
      <div className="migration">
        <p>Loading migration proof…</p>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="migration">
        <p className="migration__error">{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="migration proof">
      <ExecutiveQuestionShell route="/migration/proof" observedAt={overview.observed_at} />

      <header className="migration__header">
        <p className="migration__crumb">
          <Link to="/program-office">Program Office</Link> /{" "}
          <Link to="/migration">Migration</Link> / Proof Engine
        </p>
        <h1>Migration Proof Engine</h1>
        <p className="migration__meta">
          {overview.slice_id} · {overview.engine_id} · Evidence confidence{" "}
          {overview.evidence_confidence_percent ?? "—"}% · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
        <p className="migration__rule">{overview.core_rule}</p>
        <p className="migration__link-row">
          <Link to="/migration/digital-land-survey">Digital Land Survey (022) →</Link>
          {" · "}
          <Link to="/migration/workspace-architecture">Workspace Architecture (021) →</Link>
          {" · "}
          <Link to="/migration/planning">Migration Planning (024) →</Link>
        </p>
        <div className="migration__actions-bar">
          <button type="button" disabled={simulating} onClick={() => void handleSimulate()}>
            {simulating ? "Running proof simulation…" : "Run proof simulation (dry-run)"}
          </button>
        </div>
        <ul className="migration__guardrails">
          {overview.guardrails.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </header>

      {error ? <p className="migration__error">{error}</p> : null}

      <div className="migration__grid">
        <Panel title="Proof dimensions (deterministic)">
          <ul className="migration__list">
            {overview.proof_dimensions.map((d) => (
              <li key={d.id}>
                <strong>{d.label}</strong> — max {d.max_points} pts
              </li>
            ))}
          </ul>
          <p className="proof__thresholds">
            Certified ≥ {overview.certification_thresholds.certified_min_percent}% · Conditional ≥
            {overview.certification_thresholds.conditional_min_percent}%
          </p>
        </Panel>

        {result ? (
          <Panel title="Latest proof certificate">
            <CertificateCard cert={result.certificate} />
            <h3 className="proof__subhead">Simulation {result.simulation.simulation_id}</h3>
            <p>
              {result.simulation.batches.length} batch(es) ·{" "}
              {result.simulation.impact_summary.files_affected} files ·{" "}
              {result.simulation.impact_summary.projections_changed} projection change(s)
            </p>
            <ul className="migration__list">
              {result.simulation.rollback_preview.slice(0, 8).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Panel>
        ) : null}

        <Panel title="Recent certificates">
          {overview.latest_certificates.length === 0 ? (
            <p>No certificates yet — run proof simulation.</p>
          ) : (
            overview.latest_certificates.map((c) => <CertificateCard key={c.certificate_id} cert={c} />)
          )}
        </Panel>
      </div>
    </div>
  );
}
