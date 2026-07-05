import { useCallback, useEffect, useState } from "react";
import { CONTACT_TASK_PRIORITIES, type ContactTaskPriority } from "@localbrain/shared";
import {
  completeContactActionTaskApi,
  createContactActionTaskApi,
  fetchContactActions,
} from "../../api/contactAction";

type Props = {
  contactId: string;
  disabled?: boolean;
  onSummaryChange?: (totalOpen: number) => void;
};

export function ContactActionPanel({ contactId, disabled, onSummaryChange }: Props) {
  const [view, setView] = useState<Awaited<ReturnType<typeof fetchContactActions>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState<ContactTaskPriority>("normal");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchContactActions(contactId);
      setView(next);
      onSummaryChange?.(next.summary.total_open_actions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load actions");
      setView(null);
      onSummaryChange?.(0);
    } finally {
      setLoading(false);
    }
  }, [contactId, onSummaryChange]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runMutation(action: () => Promise<void>) {
    setSaving(true);
    setError(null);
    try {
      await action();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !view) {
    return <p className="contact-dept__empty">Loading action queue…</p>;
  }

  return (
    <section className="contact-action">
      <h3>Action queue</h3>
      <p className="contact-dept__meta">CONTACT-V3-017 · tasks · follow-ups · open work</p>
      {error ? <p className="contact-dept__error">{error}</p> : null}

      {view ? (
        <>
          <div className="contact-action__summary">
            <span>{view.summary.open_task_count} open task(s)</span>
            <span>{view.summary.open_follow_up_count} timeline follow-up(s)</span>
            <strong>{view.summary.total_open_actions} total open</strong>
          </div>

          <form
            className="contact-action__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              void runMutation(async () => {
                await createContactActionTaskApi(contactId, {
                  title: title.trim(),
                  assigned_to_user_id: assignedTo.trim() || undefined,
                  due_at: dueAt ? new Date(dueAt).toISOString() : undefined,
                  priority,
                });
                setTitle("");
                setDueAt("");
              });
            }}
          >
            <label className="contact-dept__field">
              <span>New task</span>
              <input
                value={title}
                disabled={disabled || saving}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to happen next?"
              />
            </label>
            <div className="contact-dept__row">
              <label className="contact-dept__field">
                <span>Assign to</span>
                <input
                  value={assignedTo}
                  disabled={disabled || saving}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="user id"
                />
              </label>
              <label className="contact-dept__field">
                <span>Due</span>
                <input
                  type="date"
                  value={dueAt}
                  disabled={disabled || saving}
                  onChange={(e) => setDueAt(e.target.value)}
                />
              </label>
              <label className="contact-dept__field">
                <span>Priority</span>
                <select
                  value={priority}
                  disabled={disabled || saving}
                  onChange={(e) => setPriority(e.target.value as ContactTaskPriority)}
                >
                  {CONTACT_TASK_PRIORITIES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button type="submit" className="contact-dept__primary" disabled={disabled || saving || !title.trim()}>
              Add task
            </button>
          </form>

          {view.open_tasks.length > 0 ? (
            <ul className="contact-action__tasks">
              {view.open_tasks.map((task) => (
                <li key={task.task_id}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>
                      {task.priority}
                      {task.due_at ? ` · due ${task.due_at.slice(0, 10)}` : ""}
                      {task.assigned_to_user_id ? ` · ${task.assigned_to_user_id}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="contact-dept__secondary contact-context__chip-action"
                    disabled={disabled || saving}
                    onClick={() =>
                      void runMutation(async () => {
                        await completeContactActionTaskApi(task.task_id);
                      })
                    }
                  >
                    Complete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="contact-dept__empty">No open tasks for this contact.</p>
          )}
        </>
      ) : null}
    </section>
  );
}
