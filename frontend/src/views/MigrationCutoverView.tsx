import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {
  CutoverPreflightResult,
  MigrationApprovalOverview,
  MigrationCutoverOverview,
  MigrationCutoverRun,
} from "@localbrain/shared";
import {
  fetchMigrationApprovals,
  fetchMigrationCutover,
  rollbackMigrationCutover,
  runMigrationCutover,
  runMigrationCutoverPreflight,
} from "../api/migration";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";

export function MigrationCutoverView() {
  const [overview, setOverview] = useState<MigrationCutoverOverview | null>(null);
  const [approvals, setApprovals] = useState<MigrationApprovalOverview | null>(null);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [preflight, setPreflight] = useState<CutoverPreflightResult | null>(null);
  const [run, setRun] = useState<MigrationCutoverRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [cutoverOverview, approvalOverview] = await Promise.all([
        fetchMigrationCutover(),
        fetchMigrationApprovals(),
      ]);
      setOverview(cutoverOverview);
      setApprovals(approvalOverview);
      const signed = approvalOverview.recent_approvals.find(
        (a) => a.ready_for_cutover && a.status === "signed",
      );
      if (signed) setSelectedApprovalId(signed.approval_id);
      if (cutoverOverview.recent_runs[0]) setRun(cutoverOverview.recent_runs[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cutover");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handlePreflight = async () => {
    if (!selectedApprovalId) return;
    setActing(true);
    setError(null);
    try {
      setPreflight(await runMigrationCutoverPreflight(selectedApprovalId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Preflight failed");
    } finally {
      setActing(false);
    }
  };

  const handleRun = async () => {
    if (!selectedApprovalId) return;
    setActing(true);
    setError(null);
    try {
      const result = await runMigrationCutover(selectedApprovalId);
      setRun(result);
      setOverview(await fetchMigrationCutover());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cutover failed");
    } finally {
      setActing(false);
    }
  };

  const handleRollback = async () => {
    if (!run) return;
    setActing(true);
    setError(null);
    try {
      const rolled = await rollbackMigrationCutover(run.cutover_id, "Executive rollback");
      setRun(rolled);
      setOverview(await fetchMigrationCutover());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rollback failed");
    } finally {
      setActing(false);
    }
  };

  const signedApprovals =
    approvals?.recent_approvals.filter((a) => a.ready_for_cutover && a.status === "signed") ?? [];

  if (loading && !overview) {
    return (
      <div className="migration">
        <p>Loading migration cutover…</p>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="migration cutover">
      <ExecutiveQuestionShell route="/migration/cutover" observedAt={overview.observed_at} />

      <header className="migration__header">
        <p className="migration__crumb">
          <Link to="/program-office">Program Office</Link> /{" "}
          <Link to="/migration">Migration</Link> / Cutover
        </p>
        <h1>Migration Cutover — Execution + Verification</h1>
        <p className="migration__meta">
          {overview.slice_id} · {overview.engine_id} · Completed {overview.completed_count} · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
        <p className="migration__rule">{overview.core_rule}</p>
        <p className="migration__rule cutover__verification-rule">{overview.verification_rule}</p>
        <p className="migration__link-row">
          <Link to="/migration/approval">Approval (025) →</Link>
          {" · "}
          <Link to="/migration/planning">Planning (024) →</Link>
        </p>
        <ul className="migration__guardrails">
          {overview.guardrails.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </header>

      {error ? <p className="migration__error">{error}</p> : null}

      <section className="cutover-controls">
        <h2>Cutover controls</h2>
        {signedApprovals.length > 0 ? (
          <label>
            Signed approval
            <select
              value={selectedApprovalId ?? ""}
              onChange={(e) => setSelectedApprovalId(e.target.value)}
            >
              {signedApprovals.map((a) => (
                <option key={a.approval_id} value={a.approval_id}>
                  {a.approval_id} · {a.plan_id}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="cutover-controls__empty">No signed ready-for-cutover approvals.</p>
        )}
        <div className="migration__actions-bar">
          <button type="button" disabled={acting || !selectedApprovalId} onClick={() => void handlePreflight()}>
            {acting ? "Running…" : "Preflight checks"}
          </button>
          <button type="button" disabled={acting || !selectedApprovalId} onClick={() => void handleRun()}>
            {acting ? "Executing…" : "Run cutover"}
          </button>
          {run?.status === "failed" ? (
            <button
              type="button"
              className="approval-actions__reject"
              disabled={acting}
              onClick={() => void handleRollback()}
            >
              Rollback
            </button>
          ) : null}
        </div>
      </section>

      {preflight ? (
        <section className="migration__panel">
          <h2>Preflight</h2>
          <p>Ready: {preflight.ready ? "YES" : "NO"}</p>
          <ul className="migration__list">
            {preflight.checks.map((c) => (
              <li key={c.check_id} className={`cutover-check cutover-check--${c.status}`}>
                {c.status === "pass" ? "✓" : c.status === "warn" ? "~" : "✗"} {c.label} — {c.detail}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {run ? (
        <div className="migration__grid">
          <section className="migration__panel">
            <h2>Run {run.cutover_id}</h2>
            <p>Status: <strong>{run.status}</strong></p>
            <p>Recovery: {run.failure_recovery_status}</p>
            <p>Projections updated: {run.projections_updated ? "YES" : "NO"}</p>
            <ul className="migration__list approval-provenance">
              <li>Audit: {run.provenance.audit_ref ?? "—"}</li>
              <li>Survey: {run.provenance.survey_ref ?? "—"}</li>
              <li>Certificate: {run.provenance.certificate_id}</li>
              <li>Plan: {run.provenance.plan_id}</li>
              <li>Approval: {run.provenance.approval_id}</li>
              <li>Cutover: {run.provenance.cutover_id}</li>
            </ul>
          </section>

          <section className="migration__panel">
            <h2>Execution log</h2>
            <ol className="plan-ops">
              {run.execution_log.map((step) => (
                <li key={step.operation_id} className={`cutover-step cutover-step--${step.status}`}>
                  {step.step_index + 1}. {step.label} — {step.status}
                </li>
              ))}
            </ol>
          </section>

          <section className="migration__panel">
            <h2>Verification</h2>
            <ul className="migration__list">
              {run.verification_checks.map((c) => (
                <li key={c.check_id} className={`cutover-check cutover-check--${c.status}`}>
                  {c.status === "pass" ? "✓" : c.status === "warn" ? "~" : "✗"} {c.label}
                </li>
              ))}
            </ul>
          </section>

          <section className="migration__panel">
            <h2>Personal OS launch checklist</h2>
            <ul className="approval-checklist__items">
              {run.personal_os_launch_checklist.map((item) => (
                <li key={item.item_id}>
                  {item.complete ? "✓" : "○"} {item.label}
                </li>
              ))}
            </ul>
          </section>

          {run.phase_1_launch_report ? (
            <section className="migration__panel cutover-launch-report">
              <h2>Phase 1 launch report</h2>
              <p className="cutover-launch-report__ready">
                Personal OS ready:{" "}
                <strong>{run.phase_1_launch_report.personal_os_ready ? "YES" : "NO"}</strong>
              </p>
              <p>{run.phase_1_launch_report.summary}</p>
              <dl className="approval-detail__metrics">
                <div>
                  <dt>Ops completed</dt>
                  <dd>{run.phase_1_launch_report.operations_completed}</dd>
                </div>
                <div>
                  <dt>Projections</dt>
                  <dd>{run.phase_1_launch_report.projections_updated}</dd>
                </div>
              </dl>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
