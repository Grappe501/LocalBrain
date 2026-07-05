import { useCallback, useEffect, useMemo, useState } from "react";
import type { ContactContextLinkHistoryEntry, RelationshipContext } from "@localbrain/shared";
import {
  assignContactContextApi,
  createRelationshipContextApi,
  endContactContextLinkApi,
  fetchContactContextHistory,
  fetchContactContextView,
  fetchWorkspaceContexts,
  updateContactContextLinkApi,
} from "../../api/contactContext";
import { ContactContextAssignForm } from "./ContactContextAssignForm";
import { ContactContextChips } from "./ContactContextChips";

type Props = {
  contactId: string;
  workspaceId: string;
  disabled?: boolean;
};

export function ContactContextPanel({ contactId, workspaceId, disabled }: Props) {
  const [contexts, setContexts] = useState<RelationshipContext[]>([]);
  const [view, setView] = useState<Awaited<ReturnType<typeof fetchContactContextView>> | null>(null);
  const [history, setHistory] = useState<ContactContextLinkHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catalog, contextView, entries] = await Promise.all([
        fetchWorkspaceContexts(workspaceId),
        fetchContactContextView(contactId),
        fetchContactContextHistory(contactId),
      ]);
      setContexts(catalog);
      setView(contextView);
      setHistory(entries);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load contexts");
      setView(null);
    } finally {
      setLoading(false);
    }
  }, [contactId, workspaceId]);

  useEffect(() => {
    void load();
  }, [load]);

  const assignedIds = useMemo(
    () => new Set((view?.links ?? []).map((link) => link.context_id)),
    [view],
  );

  async function runMutation(action: () => Promise<void>) {
    setSaving(true);
    setError(null);
    try {
      await action();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Context action failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !view) {
    return <p className="contact-dept__empty">Loading relationship contexts…</p>;
  }

  return (
    <section className="contact-context">
      <h3>Relationship contexts</h3>
      <p className="contact-dept__meta">CONTACT-V3-016.1 · why this relationship exists</p>
      {error ? <p className="contact-dept__error">{error}</p> : null}

      <ContactContextChips
        links={view?.links ?? []}
        disabled={disabled || saving}
        onPromote={(linkId) =>
          void runMutation(async () => {
            await updateContactContextLinkApi(contactId, linkId, {
              rank: "primary",
              reason: "Promoted from profile",
            });
          })
        }
        onEnd={(linkId) =>
          void runMutation(async () => {
            await endContactContextLinkApi(contactId, linkId, { reason: "Ended from profile" });
          })
        }
      />

      <ContactContextAssignForm
        workspaceId={workspaceId}
        contexts={contexts}
        assignedContextIds={assignedIds}
        disabled={disabled || saving}
        onAssign={(input) =>
          runMutation(async () => {
            await assignContactContextApi(contactId, {
              workspace_id: workspaceId,
              ...input,
            });
          })
        }
        onCreateContext={(input) =>
          runMutation(async () => {
            await createRelationshipContextApi({
              workspace_id: workspaceId,
              ...input,
            });
          })
        }
      />

      {history.length > 0 ? (
        <details className="contact-context__history">
          <summary>Assignment history ({history.length})</summary>
          <ul>
            {history.map((entry) => (
              <li key={entry.history_id}>
                {entry.action} · {entry.created_at.slice(0, 16).replace("T", " ")} · {entry.reason || "—"}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
