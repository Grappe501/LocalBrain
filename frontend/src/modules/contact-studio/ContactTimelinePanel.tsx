import { useCallback, useEffect, useMemo, useState } from "react";
import type { ContactFollowUpItem, ContactInteractionType, ContactTimelineView } from "@localbrain/shared";
import { CONTACT_INTERACTION_TYPES } from "@localbrain/shared";
import { fetchContactContextView } from "../../api/contactContext";
import {
  createContactInteractionApi,
  fetchContactTimeline,
  updateContactTimelineMetaApi,
} from "../../api/contactTimeline";
import { ContactContextSelector } from "./ContactContextSelector";

type Props = {
  contactId: string;
  workspaceId: string;
  contactName: string;
  disabled?: boolean;
};

type QuickLogPreset = {
  label: string;
  type: ContactInteractionType;
};

const QUICK_LOG: QuickLogPreset[] = [
  { label: "Log call", type: "call" },
  { label: "Log text", type: "text" },
  { label: "Add note", type: "note" },
  { label: "Schedule follow-up", type: "follow_up" },
  { label: "Record commitment", type: "commitment" },
];

export function ContactTimelinePanel({ contactId, workspaceId, contactName, disabled }: Props) {
  const [timeline, setTimeline] = useState<ContactTimelineView | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logType, setLogType] = useState<ContactInteractionType>("note");
  const [logSummary, setLogSummary] = useState("");
  const [logDetails, setLogDetails] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDue, setFollowUpDue] = useState("");
  const [manualSummary, setManualSummary] = useState("");
  const [pinnedNextStep, setPinnedNextStep] = useState("");
  const [relationshipOwner, setRelationshipOwner] = useState("");
  const [logContextId, setLogContextId] = useState("");
  const [contextLinks, setContextLinks] = useState<
    Awaited<ReturnType<typeof fetchContactContextView>>["links"]
  >([]);

  const contextLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const link of contextLinks) {
      map.set(link.context_id, link.context.label);
    }
    return map;
  }, [contextLinks]);

  const loadContextLinks = useCallback(async () => {
    try {
      const view = await fetchContactContextView(contactId);
      setContextLinks(view.links);
    } catch {
      setContextLinks([]);
    }
  }, [contactId]);

  const loadTimeline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const view = await fetchContactTimeline(contactId, {
        type: typeFilter || undefined,
      });
      setTimeline(view);
      setManualSummary(view.pinned.manual_summary);
      setPinnedNextStep(view.pinned.pinned_next_step);
      setRelationshipOwner(view.pinned.relationship_owner_user_id ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load timeline");
      setTimeline(null);
    } finally {
      setLoading(false);
    }
  }, [contactId, typeFilter]);

  useEffect(() => {
    void loadTimeline();
  }, [loadTimeline]);

  useEffect(() => {
    void loadContextLinks();
  }, [loadContextLinks]);

  const filteredInteractions = useMemo(() => timeline?.interactions ?? [], [timeline]);

  async function handleQuickLog(preset: QuickLogPreset) {
    setLogType(preset.type);
    if (preset.type === "follow_up") {
      setFollowUpRequired(true);
    }
  }

  async function handleSubmitInteraction(event: React.FormEvent) {
    event.preventDefault();
    if (!logSummary.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createContactInteractionApi(contactId, {
        workspace_id: workspaceId,
        type: logType,
        summary: logSummary.trim(),
        details: logDetails.trim(),
        visibility: "campaign",
        follow_up_required: followUpRequired,
        follow_up_due_at: followUpRequired && followUpDue ? new Date(followUpDue).toISOString() : undefined,
        context_id: logContextId || undefined,
      });
      setLogSummary("");
      setLogDetails("");
      setLogContextId("");
      setFollowUpRequired(false);
      setFollowUpDue("");
      await loadTimeline();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to log interaction");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePinnedSummary() {
    setSaving(true);
    setError(null);
    try {
      await updateContactTimelineMetaApi(contactId, {
        manual_summary: manualSummary.trim(),
        pinned_next_step: pinnedNextStep.trim(),
        relationship_owner_user_id: relationshipOwner.trim() || null,
      });
      await loadTimeline();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save summary");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !timeline) {
    return <p className="contact-dept__empty">Loading timeline…</p>;
  }

  return (
    <div className="contact-timeline">
      <h3>Timeline — {contactName}</h3>
      <p className="contact-dept__meta">CONTACT-V3-014 · campaign memory · human-logged · no automatic outreach</p>
      <p className="contact-dept__meta">CONTACT-V3-016.1 · optional context on each interaction</p>

      {error ? <p className="contact-dept__error">{error}</p> : null}

      <section className="contact-timeline__pinned">
        <h4>Pinned summary</h4>
        <label className="contact-dept__field">
          <span>Manual summary</span>
          <textarea
            rows={2}
            value={manualSummary}
            disabled={disabled || saving}
            onChange={(e) => setManualSummary(e.target.value)}
          />
        </label>
        <div className="contact-dept__row">
          <label className="contact-dept__field">
            <span>Relationship owner</span>
            <input
              value={relationshipOwner}
              disabled={disabled || saving}
              onChange={(e) => setRelationshipOwner(e.target.value)}
              placeholder="user id"
            />
          </label>
          <label className="contact-dept__field">
            <span>Next step</span>
            <input
              value={pinnedNextStep}
              disabled={disabled || saving}
              onChange={(e) => setPinnedNextStep(e.target.value)}
            />
          </label>
        </div>
        <p className="contact-timeline__meta">
          Last contact:{" "}
          {timeline?.pinned.last_contact_summary
            ? `${timeline.pinned.last_contact_summary} (${timeline.pinned.last_contact_at?.slice(0, 10) ?? "—"})`
            : "None logged"}
        </p>
        <button
          type="button"
          className="contact-dept__secondary"
          disabled={disabled || saving}
          onClick={() => void handleSavePinnedSummary()}
        >
          Save pinned summary
        </button>
      </section>

      {timeline?.advisory_summary ? (
        <section className="contact-timeline__advisory">
          <h4>Advisory summary</h4>
          <p className="contact-timeline__advisory-badge">Advisory only · cites timeline entries · no live AI</p>
          <p>{timeline.advisory_summary.summary_text}</p>
          <p>
            <strong>Suggested next step:</strong> {timeline.advisory_summary.suggested_next_step}
          </p>
          {timeline.advisory_summary.uncertainty_notes.length > 0 ? (
            <ul>
              {timeline.advisory_summary.uncertainty_notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
          {timeline.advisory_summary.citations.length > 0 ? (
            <details>
              <summary>Citations ({timeline.advisory_summary.citations.length})</summary>
              <ul>
                {timeline.advisory_summary.citations.map((c) => (
                  <li key={c.interaction_id}>
                    {c.summary} · {c.occurred_at.slice(0, 10)}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </section>
      ) : null}

      <section className="contact-timeline__followups">
        <h4>Follow-up panel</h4>
        <div className="contact-timeline__followup-columns">
          <div>
            <h5>Overdue</h5>
            <FollowUpList items={timeline?.follow_ups.overdue ?? []} />
          </div>
          <div>
            <h5>Due today</h5>
            <FollowUpList items={timeline?.follow_ups.due_today ?? []} />
          </div>
          <div>
            <h5>Upcoming</h5>
            <FollowUpList items={timeline?.follow_ups.upcoming ?? []} />
          </div>
        </div>
      </section>

      <section className="contact-timeline__quick-log">
        <h4>Quick log</h4>
        <div className="contact-timeline__quick-buttons">
          {QUICK_LOG.map((preset) => (
            <button
              key={preset.type}
              type="button"
              className="contact-dept__secondary"
              disabled={disabled || saving}
              onClick={() => void handleQuickLog(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => void handleSubmitInteraction(e)}>
          <ContactContextSelector
            links={contextLinks}
            value={logContextId}
            disabled={disabled || saving}
            onChange={setLogContextId}
          />
          <label className="contact-dept__field">
            <span>Type</span>
            <select
              value={logType}
              disabled={disabled || saving}
              onChange={(e) => setLogType(e.target.value as ContactInteractionType)}
            >
              {CONTACT_INTERACTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="contact-dept__field">
            <span>Summary</span>
            <input
              required
              value={logSummary}
              disabled={disabled || saving}
              onChange={(e) => setLogSummary(e.target.value)}
            />
          </label>
          <label className="contact-dept__field">
            <span>Details</span>
            <textarea
              rows={2}
              value={logDetails}
              disabled={disabled || saving}
              onChange={(e) => setLogDetails(e.target.value)}
            />
          </label>
          <label className="contact-dept__checkbox">
            <input
              type="checkbox"
              checked={followUpRequired}
              disabled={disabled || saving}
              onChange={(e) => setFollowUpRequired(e.target.checked)}
            />
            Follow-up required
          </label>
          {followUpRequired ? (
            <label className="contact-dept__field">
              <span>Follow-up due</span>
              <input
                type="datetime-local"
                value={followUpDue}
                disabled={disabled || saving}
                onChange={(e) => setFollowUpDue(e.target.value)}
              />
            </label>
          ) : null}
          <button type="submit" className="contact-dept__primary" disabled={disabled || saving || !logSummary.trim()}>
            Log interaction
          </button>
        </form>
      </section>

      <section className="contact-timeline__feed">
        <div className="contact-timeline__feed-header">
          <h4>Interaction feed</h4>
          <label className="contact-dept__field contact-timeline__filter">
            <span>Filter type</span>
            <select
              value={typeFilter}
              disabled={disabled || saving}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All types</option>
              {CONTACT_INTERACTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
        </div>
        {filteredInteractions.length === 0 ? (
          <p className="contact-dept__empty">No interactions logged yet.</p>
        ) : (
          <ul className="contact-timeline__cards">
            {filteredInteractions.map((item) => (
              <li key={item.id} className="contact-timeline__card">
                <header>
                  <strong>{item.type.replace(/_/g, " ")}</strong>
                  <span>{item.occurred_at.slice(0, 16).replace("T", " ")}</span>
                </header>
                <p>{item.summary}</p>
                {item.details ? <p className="contact-timeline__details">{item.details}</p> : null}
                <footer>
                  <span>By {item.created_by_user_id}</span>
                  <span>{item.visibility}</span>
                  {item.context_id ? (
                    <span className="contact-context__feed-tag">
                      {contextLabelById.get(item.context_id) ?? item.context_id}
                    </span>
                  ) : null}
                  {item.follow_up_required ? (
                    <span className="contact-timeline__follow-flag">
                      Follow-up{item.follow_up_due_at ? ` · ${item.follow_up_due_at.slice(0, 10)}` : ""}
                    </span>
                  ) : null}
                </footer>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function FollowUpList({ items }: { items: readonly ContactFollowUpItem[] }) {
  if (items.length === 0) return <p className="contact-dept__empty">None</p>;
  return (
    <ul>
      {items.map((item) => (
        <li key={item.interaction.id}>
          {item.interaction.summary}
          {item.interaction.follow_up_due_at
            ? ` · ${item.interaction.follow_up_due_at.slice(0, 10)}`
            : ""}
        </li>
      ))}
    </ul>
  );
}
