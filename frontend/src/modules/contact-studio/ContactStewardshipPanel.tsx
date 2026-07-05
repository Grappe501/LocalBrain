import { useCallback, useEffect, useState } from "react";
import {
  CONTACT_LIFECYCLE_STAGES,
  CONTACT_RELATIONSHIP_STRENGTHS,
  type ContactStewardParticipantRole,
} from "@localbrain/shared";
import {
  addContactStewardParticipantApi,
  assignContactStewardApi,
  endContactStewardParticipantApi,
  fetchContactStewardship,
  updateContactStewardshipApi,
} from "../../api/contactStewardship";

type Props = {
  contactId: string;
  disabled?: boolean;
};

export function ContactStewardshipPanel({ contactId, disabled }: Props) {
  const [view, setView] = useState<Awaited<ReturnType<typeof fetchContactStewardship>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stewardUserId, setStewardUserId] = useState("");
  const [stewardReason, setStewardReason] = useState("");
  const [participantUserId, setParticipantUserId] = useState("");
  const [participantRole, setParticipantRole] = useState<ContactStewardParticipantRole>("contributor");
  const [participantLabel, setParticipantLabel] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchContactStewardship(contactId);
      setView(next);
      setStewardUserId(next.stewardship.steward_user_id ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stewardship");
      setView(null);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

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
      setError(e instanceof Error ? e.message : "Stewardship action failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !view) {
    return <p className="contact-dept__empty">Loading relationship stewardship…</p>;
  }

  return (
    <section className="contact-stewardship">
      <h3>Relationship intelligence</h3>
      <p className="contact-dept__meta">CONTACT-V3-016 · steward · contributors · momentum · health</p>
      {error ? <p className="contact-dept__error">{error}</p> : null}

      {view ? (
        <>
          <div className="contact-stewardship__metrics">
            <div>
              <strong>Steward</strong>
              <span>{view.stewardship.steward_user_id ?? "Unassigned"}</span>
            </div>
            <div>
              <strong>Strength</strong>
              <span>{view.stewardship.strength.replace(/_/g, " ")}</span>
            </div>
            <div>
              <strong>Lifecycle</strong>
              <span>{view.stewardship.lifecycle_stage}</span>
            </div>
            <div>
              <strong>Momentum</strong>
              <span>{view.computed.momentum}</span>
            </div>
            <div>
              <strong>Health</strong>
              <span>
                {view.computed.health_score} — {view.computed.health_label}
              </span>
            </div>
            <div>
              <strong>Last contact</strong>
              <span>
                {view.computed.days_since_meaningful_contact != null
                  ? `${view.computed.days_since_meaningful_contact} days ago`
                  : "None logged"}
              </span>
            </div>
          </div>

          <p className="contact-stewardship__advisory">{view.advisory_summary.summary_text}</p>

          <form
            className="contact-stewardship__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!stewardUserId.trim()) return;
              void runMutation(async () => {
                await assignContactStewardApi(contactId, {
                  steward_user_id: stewardUserId.trim(),
                  reason: stewardReason.trim() || undefined,
                });
                setStewardReason("");
              });
            }}
          >
            <label className="contact-dept__field">
              <span>Assign steward</span>
              <input
                value={stewardUserId}
                disabled={disabled || saving}
                onChange={(e) => setStewardUserId(e.target.value)}
                placeholder="user id"
              />
            </label>
            <label className="contact-dept__field">
              <span>Transition reason</span>
              <input
                value={stewardReason}
                disabled={disabled || saving}
                onChange={(e) => setStewardReason(e.target.value)}
              />
            </label>
            <button type="submit" className="contact-dept__primary" disabled={disabled || saving || !stewardUserId.trim()}>
              Save steward
            </button>
          </form>

          <div className="contact-dept__row">
            <label className="contact-dept__field">
              <span>Strength</span>
              <select
                value={view.stewardship.strength}
                disabled={disabled || saving}
                onChange={(e) =>
                  void runMutation(async () => {
                    await updateContactStewardshipApi(contactId, {
                      strength: e.target.value as (typeof CONTACT_RELATIONSHIP_STRENGTHS)[number],
                    });
                  })
                }
              >
                {CONTACT_RELATIONSHIP_STRENGTHS.map((value) => (
                  <option key={value} value={value}>
                    {value.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="contact-dept__field">
              <span>Lifecycle stage</span>
              <select
                value={view.stewardship.lifecycle_stage}
                disabled={disabled || saving}
                onChange={(e) =>
                  void runMutation(async () => {
                    await updateContactStewardshipApi(contactId, {
                      lifecycle_stage: e.target.value as (typeof CONTACT_LIFECYCLE_STAGES)[number],
                    });
                  })
                }
              >
                {CONTACT_LIFECYCLE_STAGES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="contact-stewardship__participants">
            <h4>Contributors & watchers</h4>
            <ul>
              {[...view.contributors, ...view.watchers].map((participant) => (
                <li key={participant.participant_id}>
                  {participant.role}: {participant.user_id}
                  {participant.label ? ` · ${participant.label}` : ""}
                  <button
                    type="button"
                    className="contact-dept__secondary contact-context__chip-action"
                    disabled={disabled || saving}
                    onClick={() =>
                      void runMutation(async () => {
                        await endContactStewardParticipantApi(contactId, participant.participant_id);
                      })
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!participantUserId.trim()) return;
                void runMutation(async () => {
                  await addContactStewardParticipantApi(contactId, {
                    user_id: participantUserId.trim(),
                    role: participantRole,
                    label: participantLabel.trim() || undefined,
                  });
                  setParticipantUserId("");
                  setParticipantLabel("");
                });
              }}
            >
              <label className="contact-dept__field">
                <span>User id</span>
                <input
                  value={participantUserId}
                  disabled={disabled || saving}
                  onChange={(e) => setParticipantUserId(e.target.value)}
                />
              </label>
              <label className="contact-dept__field">
                <span>Role</span>
                <select
                  value={participantRole}
                  disabled={disabled || saving}
                  onChange={(e) => setParticipantRole(e.target.value as ContactStewardParticipantRole)}
                >
                  <option value="contributor">Contributor</option>
                  <option value="watcher">Watcher</option>
                </select>
              </label>
              <label className="contact-dept__field">
                <span>Label</span>
                <input
                  value={participantLabel}
                  disabled={disabled || saving}
                  onChange={(e) => setParticipantLabel(e.target.value)}
                />
              </label>
              <button type="submit" className="contact-dept__secondary" disabled={disabled || saving || !participantUserId.trim()}>
                Add participant
              </button>
            </form>
          </div>

          {view.transitions.length > 0 ? (
            <details className="contact-stewardship__history">
              <summary>Steward transitions ({view.transitions.length})</summary>
              <ul>
                {view.transitions.map((entry) => (
                  <li key={entry.transition_id}>
                    {entry.from_steward_user_id ?? "none"} → {entry.to_steward_user_id} ·{" "}
                    {entry.created_at.slice(0, 10)} · {entry.reason || "—"}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
