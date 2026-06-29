import { useCallback, useEffect, useState } from "react";
import type { ActionLogEntry, BackupRecord, ExecuteResult, ProposedAction } from "@localbrain/shared";
import {
  approveActionApi,
  executeActionApi,
  fetchActionLog,
  fetchBackups,
  fetchProposedActions,
  rejectActionApi,
  restoreBackupApi,
} from "../api/actions";

type Tab = "pending" | "approved" | "history";

export function ActionsView() {
  const [tab, setTab] = useState<Tab>("pending");
  const [actions, setActions] = useState<ProposedAction[]>([]);
  const [log, setLog] = useState<ActionLogEntry[]>([]);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [selected, setSelected] = useState<ProposedAction | null>(null);
  const [lastResult, setLastResult] = useState<ExecuteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      const status = tab === "pending" ? "pending" : tab === "approved" ? "approved" : undefined;
      const [acts, logEntries, backupRows] = await Promise.all([
        fetchProposedActions(status),
        fetchActionLog(),
        fetchBackups(),
      ]);
      setActions(acts);
      setLog(logEntries);
      setBackups(backupRows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load actions");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    void load();
  }, [load]);

  async function approve(id: string) {
    await approveActionApi(id);
    await load();
  }

  async function reject(id: string) {
    await rejectActionApi(id, "Rejected from Actions UI");
    await load();
  }

  async function execute(id: string, dryRun: boolean) {
    const result = await executeActionApi(id, dryRun);
    setLastResult(result);
    await load();
  }

  async function restore(backupId: string) {
    const result = await restoreBackupApi(backupId);
    setLastResult({
      action_id: backupId,
      dry_run: false,
      success: result.success,
      message: result.message,
      backup_id: backupId,
      source_path: null,
      target_path: null,
    });
    await load();
  }

  if (loading) {
    return <article className="actions-view"><p>Loading actions…</p></article>;
  }

  return (
    <article className="actions-view">
      <header className="actions-view__header">
        <h1>Actions</h1>
        <p className="actions-view__meta">
          AI proposes · you approve · backend executes · LB-OS-010 · quarantine only · no silent writes
        </p>
      </header>

      {error ? <p className="safety-panel__error">{error}</p> : null}

      <div className="actions-view__tabs" role="tablist">
        {(["pending", "approved", "history"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "actions-view__tab actions-view__tab--active" : "actions-view__tab"}
            onClick={() => setTab(t)}
          >
            {t === "pending" ? "Pending" : t === "approved" ? "Approved" : "All / history"}
          </button>
        ))}
      </div>

      {lastResult ? (
        <aside className="actions-view__result" role="status">
          <strong>{lastResult.dry_run ? "Dry run" : "Executed"}:</strong> {lastResult.message}
        </aside>
      ) : null}

      <div className="actions-view__body">
        <section className="actions-view__list-pane">
          <h2>Proposed actions</h2>
          {actions.length === 0 ? <p>No actions in this view.</p> : null}
          <ul className="actions-view__list">
            {actions.map((a) => (
              <li key={a.action_id}>
                <button
                  type="button"
                  className={
                    selected?.action_id === a.action_id
                      ? "actions-view__item actions-view__item--selected"
                      : "actions-view__item"
                  }
                  onClick={() => setSelected(a)}
                >
                  <span className={`actions-view__status actions-view__status--${a.status}`}>
                    {a.status}
                  </span>
                  <strong>{a.title}</strong>
                  <span>{a.action_type}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {selected ? (
          <section className="actions-view__detail">
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <dl className="actions-view__meta-dl">
              <dt>Type</dt>
              <dd>{selected.action_type}</dd>
              <dt>Status</dt>
              <dd>{selected.status}</dd>
              {selected.source_path ? (
                <>
                  <dt>Source</dt>
                  <dd><code>{selected.source_path}</code></dd>
                </>
              ) : null}
              {selected.target_path ? (
                <>
                  <dt>Target</dt>
                  <dd><code>{selected.target_path}</code></dd>
                </>
              ) : null}
            </dl>

            {selected.diff_preview ? (
              <>
                <h3>Diff preview</h3>
                <pre className="actions-view__diff">{selected.diff_preview}</pre>
              </>
            ) : null}

            <div className="actions-view__buttons">
              {selected.status === "pending" ? (
                <>
                  <button type="button" onClick={() => void approve(selected.action_id)}>
                    Approve
                  </button>
                  <button type="button" onClick={() => void reject(selected.action_id)}>
                    Reject
                  </button>
                </>
              ) : null}
              {selected.status === "approved" ? (
                <>
                  <button type="button" onClick={() => void execute(selected.action_id, true)}>
                    Dry run
                  </button>
                  <button type="button" onClick={() => void execute(selected.action_id, false)}>
                    Execute
                  </button>
                </>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>

      <section className="actions-view__history">
        <h2>Action log</h2>
        <ul>
          {log.slice(0, 20).map((entry) => (
            <li key={entry.id}>
              <code>{entry.event_type}</code> · {entry.detail} · {entry.created_at}
            </li>
          ))}
        </ul>
      </section>

      <section className="actions-view__history">
        <h2>Backups</h2>
        <ul>
          {backups.slice(0, 10).map((b) => (
            <li key={b.backup_id}>
              <code>{b.source_path}</code>
              <button type="button" onClick={() => void restore(b.backup_id)}>
                Restore
              </button>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
