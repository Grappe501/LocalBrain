import { useState } from "react";
import type { ContactContextRank, RelationshipContext } from "@localbrain/shared";
import { CONTACT_CONTEXT_CATEGORIES } from "@localbrain/shared";

type Props = {
  workspaceId: string;
  contexts: RelationshipContext[];
  assignedContextIds: Set<string>;
  disabled?: boolean;
  onAssign: (input: { context_id: string; rank: ContactContextRank; reason?: string }) => Promise<void>;
  onCreateContext: (input: { label: string; category: RelationshipContext["category"] }) => Promise<void>;
};

export function ContactContextAssignForm({
  workspaceId,
  contexts,
  assignedContextIds,
  disabled,
  onAssign,
  onCreateContext,
}: Props) {
  const [contextId, setContextId] = useState("");
  const [rank, setRank] = useState<ContactContextRank>("secondary");
  const [reason, setReason] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState<RelationshipContext["category"]>("other");
  const [showCreate, setShowCreate] = useState(false);

  const available = contexts.filter((c) => !assignedContextIds.has(c.context_id));

  async function handleAssign(event: React.FormEvent) {
    event.preventDefault();
    if (!contextId) return;
    await onAssign({ context_id: contextId, rank, reason: reason.trim() || undefined });
    setContextId("");
    setReason("");
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!newLabel.trim()) return;
    await onCreateContext({ label: newLabel.trim(), category: newCategory });
    setNewLabel("");
    setShowCreate(false);
  }

  return (
    <div className="contact-context__assign">
      <form onSubmit={(e) => void handleAssign(e)}>
        <label className="contact-dept__field">
          <span>Assign context</span>
          <select
            value={contextId}
            disabled={disabled || available.length === 0}
            onChange={(e) => setContextId(e.target.value)}
          >
            <option value="">Select context…</option>
            {available.map((ctx) => (
              <option key={ctx.context_id} value={ctx.context_id}>
                {ctx.label} ({ctx.category})
              </option>
            ))}
          </select>
        </label>
        <label className="contact-dept__field">
          <span>Rank</span>
          <select
            value={rank}
            disabled={disabled}
            onChange={(e) => setRank(e.target.value as ContactContextRank)}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
          </select>
        </label>
        <label className="contact-dept__field">
          <span>Reason (optional)</span>
          <input value={reason} disabled={disabled} onChange={(e) => setReason(e.target.value)} />
        </label>
        <button type="submit" className="contact-dept__primary" disabled={disabled || !contextId}>
          Assign context
        </button>
      </form>

      <div className="contact-context__catalog">
        <button
          type="button"
          className="contact-dept__secondary"
          disabled={disabled}
          onClick={() => setShowCreate((open) => !open)}
        >
          {showCreate ? "Cancel new context" : "New workspace context"}
        </button>
        {showCreate ? (
          <form onSubmit={(e) => void handleCreate(e)}>
            <p className="contact-dept__meta">Workspace {workspaceId}</p>
            <label className="contact-dept__field">
              <span>Label</span>
              <input
                required
                value={newLabel}
                disabled={disabled}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </label>
            <label className="contact-dept__field">
              <span>Category</span>
              <select
                value={newCategory}
                disabled={disabled}
                onChange={(e) => setNewCategory(e.target.value as RelationshipContext["category"])}
              >
                {CONTACT_CONTEXT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="contact-dept__primary" disabled={disabled || !newLabel.trim()}>
              Create context
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
