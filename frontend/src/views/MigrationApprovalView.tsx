import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {
  MigrationApprovalOverview,
  MigrationApprovalPackage,
  MigrationPlanOverview,
  SignOffChecklistItem,
} from "@localbrain/shared";
import {
  createMigrationApprovalFromPlan,
  fetchMigrationApprovals,
  fetchMigrationPlans,
  rejectMigrationApproval,
  signMigrationApproval,
} from "../api/migration";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";

function ApprovalStatusBadge({ approval }: { approval: MigrationApprovalPackage }) {
  const cls = `approval-badge approval-badge--${approval.status}`;
  return <span className={cls}>{approval.status}</span>;
}

export function MigrationApprovalView() {
  const [overview, setOverview] = useState<MigrationApprovalOverview | null>(null);
  const [planOverview, setPlanOverview] = useState<MigrationPlanOverview | null>(null);
  const [selected, setSelected] = useState<MigrationApprovalPackage | null>(null);
  const [checklist, setChecklist] = useState<SignOffChecklistItem[]>([]);
  const [riskAck, setRiskAck] = useState(false);
  const [rollbackAck, setRollbackAck] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [approvalOverview, plansOverview] = await Promise.all([
        fetchMigrationApprovals(),
        fetchMigrationPlans(),
      ]);
      setOverview(approvalOverview);
      setPlanOverview(plansOverview);
      const pending =
        approvalOverview.recent_approvals.find((a) => a.status === "pending") ??
        approvalOverview.recent_approvals[0] ??
        null;
      setSelected(pending);
      if (pending) {
        setChecklist(pending.checklist);
        setRiskAck(pending.risk_acknowledgement.acknowledged);
        setRollbackAck(pending.rollback_acknowledgement.acknowledged);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selectApproval = (approval: MigrationApprovalPackage) => {
    setSelected(approval);
    setChecklist(approval.checklist);
    setRiskAck(approval.risk_acknowledgement.acknowledged);
    setRollbackAck(approval.rollback_acknowledgement.acknowledged);
    setError(null);
  };

  const handleCreateFromPlan = async (planId: string) => {
    setActing(true);
    setError(null);
    try {
      const { approval } = await createMigrationApprovalFromPlan(planId, "steve");
      setOverview(await fetchMigrationApprovals());
      selectApproval(approval);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create approval failed");
    } finally {
      setActing(false);
    }
  };

  const toggleChecklist = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.item_id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleSign = async () => {
    if (!selected || selected.status !== "pending") return;
    setActing(true);
    setError(null);
    try {
      const signed = await signMigrationApproval(selected.approval_id, {
        signed_by: "steve",
        checklist: checklist.map((item) => ({
          item_id: item.item_id,
          checked: item.checked,
        })),
        risk_acknowledged: riskAck,
        rollback_acknowledged: rollbackAck,
      });
      setOverview(await fetchMigrationApprovals());
      selectApproval(signed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign failed");
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!selected || selected.status !== "pending") return;
    setActing(true);
    setError(null);
    try {
      const rejected = await rejectMigrationApproval(selected.approval_id, {
        reason: "Executive rejected cutover",
        rejected_by: "steve",
      });
      setOverview(await fetchMigrationApprovals());
      selectApproval(rejected);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reject failed");
    } finally {
      setActing(false);
    }
  };

  const readyPlans =
    planOverview?.recent_plans.filter((p) => p.ready_for_proposal) ?? [];

  if (loading && !overview) {
    return (
      <div className="migration">
        <p>Loading executive approval…</p>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="migration approval">
      <ExecutiveQuestionShell route="/migration/approval" observedAt={overview.observed_at} />

      <header className="migration__header">
        <p className="migration__crumb">
          <Link to="/program-office">Program Office</Link> /{" "}
          <Link to="/migration">Migration</Link> / Approval
        </p>
        <h1>Executive Approval</h1>
        <p className="migration__meta">
          {overview.slice_id} · {overview.engine_id} · {overview.actions_engine_ref} · Pending{" "}
          {overview.pending_count} · Signed {overview.signed_count} · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
        <p className="migration__rule">{overview.core_rule}</p>
        <p className="migration__link-row">
          <Link to="/migration/planning">Planning (024) →</Link>
          {" · "}
          <Link to="/migration/cutover">Cutover (026) →</Link>
          {" · "}
          <Link to="/migration/proof">Proof (023) →</Link>
        </p>
        <ul className="migration__guardrails">
          {overview.guardrails.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </header>

      {error ? <p className="migration__error">{error}</p> : null}

      {readyPlans.length > 0 ? (
        <section className="approval-create">
          <h2>Create approval from plan</h2>
          <ul className="approval-create__list">
            {readyPlans.map((plan) => (
              <li key={plan.plan_id}>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => void handleCreateFromPlan(plan.plan_id)}
                >
                  {plan.variant_label} — {plan.plan_id} (Q{plan.plan_quality.percent})
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="approval-create__empty">
          No ready-for-proposal plans — generate plans in Planning first.
        </p>
      )}

      {overview.recent_approvals.length > 0 ? (
        <section className="approval-list">
          <h2>Approval packages</h2>
          <ul className="approval-list__items">
            {overview.recent_approvals.map((a) => (
              <li key={a.approval_id}>
                <button
                  type="button"
                  className={selected?.approval_id === a.approval_id ? "approval-list__active" : ""}
                  onClick={() => selectApproval(a)}
                >
                  {a.approval_id} · {a.plan_id} · <ApprovalStatusBadge approval={a} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {selected ? (
        <div className="migration__grid approval-detail">
          <section className="migration__panel approval-detail__summary">
            <h2>Approval package</h2>
            <p className="approval-detail__title">{selected.title}</p>
            <ApprovalStatusBadge approval={selected} />
            <dl className="approval-detail__metrics">
              <div>
                <dt>Ready for cutover</dt>
                <dd>{selected.ready_for_cutover ? "YES" : "NO"}</dd>
              </div>
              <div>
                <dt>Plan</dt>
                <dd>{selected.plan_id}</dd>
              </div>
              <div>
                <dt>Quality</dt>
                <dd>{selected.plan_summary.plan_quality_percent}</dd>
              </div>
              <div>
                <dt>Risk</dt>
                <dd>{selected.plan_summary.risk_label}</dd>
              </div>
              <div>
                <dt>Operations</dt>
                <dd>{selected.plan_summary.total_operations}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{selected.plan_summary.estimated_duration_minutes} min</dd>
              </div>
            </dl>
            {selected.action_id ? (
              <p className="approval-detail__action">
                Linked action: <code>{selected.action_id}</code>
              </p>
            ) : null}
          </section>

          <section className="migration__panel">
            <h2>Provenance</h2>
            <ul className="migration__list approval-provenance">
              <li>Audit: {selected.provenance.audit_ref ?? "—"}</li>
              <li>Survey: {selected.provenance.survey_ref ?? "—"}</li>
              <li>Certificate: {selected.provenance.certificate_id}</li>
              <li>Simulation: {selected.provenance.simulation_id}</li>
              <li>Plan: {selected.provenance.plan_id}</li>
              <li>Approval: {selected.provenance.approval_id}</li>
            </ul>
          </section>

          <section className="migration__panel approval-checklist">
            <h2>Sign-off checklist</h2>
            <ul className="approval-checklist__items">
              {checklist.map((item) => (
                <li key={item.item_id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      disabled={selected.status !== "pending" || acting}
                      onChange={() => toggleChecklist(item.item_id)}
                    />
                    {item.label}
                    {item.required ? <span className="approval-checklist__req">required</span> : null}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section className="migration__panel approval-ack">
            <h2>Risk acknowledgement</h2>
            <p>
              Risk level: <strong>{selected.risk_acknowledgement.risk_label}</strong> · Quality{" "}
              {selected.risk_acknowledgement.plan_quality_percent}% ·{" "}
              {selected.risk_acknowledgement.total_operations} operations ·{" "}
              {selected.risk_acknowledgement.estimated_duration_minutes} min estimated
            </p>
            <label>
              <input
                type="checkbox"
                checked={riskAck}
                disabled={selected.status !== "pending" || acting}
                onChange={(e) => setRiskAck(e.target.checked)}
              />
              I acknowledge the migration risk profile for this plan
            </label>

            <h3>Rollback acknowledgement</h3>
            <p>
              Rollback duration: {selected.rollback_acknowledgement.rollback_duration_minutes} min ·{" "}
              {selected.rollback_acknowledgement.rollback_step_count} rollback steps
            </p>
            <label>
              <input
                type="checkbox"
                checked={rollbackAck}
                disabled={selected.status !== "pending" || acting}
                onChange={(e) => setRollbackAck(e.target.checked)}
              />
              I have reviewed the rollback plan embedded in the migration plan
            </label>
          </section>

          {selected.status === "pending" ? (
            <section className="migration__panel approval-actions">
              <h2>Executive decision</h2>
              <div className="migration__actions-bar">
                <button type="button" disabled={acting} onClick={() => void handleSign()}>
                  {acting ? "Signing…" : "Sign approval (approve cutover)"}
                </button>
                <button
                  type="button"
                  className="approval-actions__reject"
                  disabled={acting}
                  onClick={() => void handleReject()}
                >
                  Reject
                </button>
              </div>
            </section>
          ) : null}

          {selected.status === "signed" ? (
            <section className="migration__panel approval-signed">
              <h2>Signed</h2>
              <p>
                Signed by {selected.signed_by} at{" "}
                {selected.signed_at ? new Date(selected.signed_at).toLocaleString() : "—"}
              </p>
              <p className="approval-signed__gate">
                Ready for cutover: <strong>{selected.ready_for_cutover ? "YES" : "NO"}</strong>
              </p>
            </section>
          ) : null}

          {selected.status === "rejected" ? (
            <section className="migration__panel approval-rejected">
              <h2>Rejected</h2>
              <p>{selected.rejection_reason ?? "No reason recorded"}</p>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
