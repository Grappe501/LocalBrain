import { useCallback, useEffect, useState } from "react";
import {
  CONTACT_HOUSEHOLD_MEMBER_ROLES,
  CONTACT_HOUSEHOLD_RELATIONSHIP_TYPES,
  type ContactHouseholdMemberRole,
  type ContactHouseholdRelationshipType,
  type ContactHouseholdSummary,
} from "@localbrain/shared";
import {
  addHouseholdMemberApi,
  addHouseholdRelationshipApi,
  createHouseholdApi,
  fetchContactHouseholds,
  removeHouseholdMemberApi,
  transferPrimaryResidenceApi,
} from "../../api/contactHousehold";

type Props = {
  contactId: string;
  workspaceId: string;
  disabled?: boolean;
};

export function ContactHouseholdPanel({ contactId, workspaceId, disabled }: Props) {
  const [households, setHouseholds] = useState<ContactHouseholdSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [memberContactId, setMemberContactId] = useState("");
  const [memberRole, setMemberRole] = useState<ContactHouseholdMemberRole>("relative");
  const [relFromId, setRelFromId] = useState("");
  const [relToId, setRelToId] = useState("");
  const [relType, setRelType] = useState<ContactHouseholdRelationshipType>("other");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchContactHouseholds(contactId);
      setHouseholds(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load households");
      setHouseholds([]);
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
      setError(e instanceof Error ? e.message : "Household action failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading && households.length === 0) {
    return <p className="contact-dept__empty">Loading household relationships…</p>;
  }

  const primary = households[0];

  return (
    <section className="contact-household">
      <h3>Household</h3>
      <p className="contact-dept__meta">CONTACT-V3-018 · members · relationships · group, don't duplicate</p>
      {error ? <p className="contact-dept__error">{error}</p> : null}

      {primary ? (
        <>
          <div className="contact-household__header">
            <strong>{primary.household.name}</strong>
            {primary.household.voting_district ? (
              <span>District {primary.household.voting_district}</span>
            ) : null}
          </div>

          {primary.household.primary_address ? (
            <p className="contact-household__address">
              {[
                primary.household.primary_address.line1,
                primary.household.primary_address.city,
                primary.household.primary_address.state,
                primary.household.primary_address.postal_code,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          ) : null}

          <div className="contact-household__metrics">
            <div>
              <strong>Size</strong>
              <span>{primary.computed.size}</span>
            </div>
            <div>
              <strong>Adults / Minors</strong>
              <span>
                {primary.computed.adults} / {primary.computed.minors}
              </span>
            </div>
            <div>
              <strong>Voters</strong>
              <span>{primary.computed.registered_voters}</span>
            </div>
            <div>
              <strong>Volunteers</strong>
              <span>{primary.computed.volunteers}</span>
            </div>
            <div>
              <strong>Strength</strong>
              <span>
                {primary.computed.strength_score} — {primary.computed.strength_label}
              </span>
            </div>
            <div>
              <strong>Health</strong>
              <span>
                {primary.computed.health_score} — {primary.computed.health_label}
              </span>
            </div>
          </div>

          <p className="contact-household__integration">
            Referenced: {primary.integration.referenced_open_action_count} open action(s) ·{" "}
            {primary.integration.referenced_context_count} context link(s) · stewards:{" "}
            {primary.integration.referenced_steward_user_ids.join(", ") || "none"}
          </p>

          <div className="contact-household__members">
            <h4>Members</h4>
            <ul>
              {primary.members
                .filter((m) => !m.effective_until)
                .map((member) => (
                  <li key={member.member_id}>
                    {member.contact_display_name} · {member.role.replace(/_/g, " ")}
                    {member.is_primary_residence ? " · primary residence" : ""}
                    {member.contact_id !== contactId ? (
                      <button
                        type="button"
                        className="contact-dept__secondary contact-context__chip-action"
                        disabled={disabled || saving}
                        onClick={() =>
                          void runMutation(async () => {
                            await transferPrimaryResidenceApi(
                              primary.household.household_id,
                              member.contact_id,
                            );
                          })
                        }
                      >
                        Set primary
                      </button>
                    ) : null}
                    {member.contact_id !== contactId ? (
                      <button
                        type="button"
                        className="contact-dept__secondary contact-context__chip-action"
                        disabled={disabled || saving}
                        onClick={() =>
                          void runMutation(async () => {
                            await removeHouseholdMemberApi(
                              primary.household.household_id,
                              member.member_id,
                            );
                          })
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </li>
                ))}
            </ul>
          </div>

          {primary.relationships.length > 0 ? (
            <div className="contact-household__relationships">
              <h4>Relationships</h4>
              <ul>
                {primary.relationships.map((rel) => (
                  <li key={rel.relationship_id}>
                    {rel.from_contact_id.slice(0, 8)} → {rel.to_contact_id.slice(0, 8)} ·{" "}
                    {rel.relationship_type.replace(/_/g, " ")}
                    {rel.label ? ` · ${rel.label}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <form
            className="contact-household__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!memberContactId.trim()) return;
              void runMutation(async () => {
                await addHouseholdMemberApi(primary.household.household_id, {
                  contact_id: memberContactId.trim(),
                  role: memberRole,
                });
                setMemberContactId("");
              });
            }}
          >
            <label className="contact-dept__field">
              <span>Add member (contact id)</span>
              <input
                value={memberContactId}
                disabled={disabled || saving}
                onChange={(e) => setMemberContactId(e.target.value)}
              />
            </label>
            <label className="contact-dept__field">
              <span>Role</span>
              <select
                value={memberRole}
                disabled={disabled || saving}
                onChange={(e) => setMemberRole(e.target.value as ContactHouseholdMemberRole)}
              >
                {CONTACT_HOUSEHOLD_MEMBER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="contact-dept__secondary"
              disabled={disabled || saving || !memberContactId.trim()}
            >
              Add member
            </button>
          </form>

          <form
            className="contact-household__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!relFromId.trim() || !relToId.trim()) return;
              void runMutation(async () => {
                await addHouseholdRelationshipApi(primary.household.household_id, {
                  from_contact_id: relFromId.trim(),
                  to_contact_id: relToId.trim(),
                  relationship_type: relType,
                });
                setRelFromId("");
                setRelToId("");
              });
            }}
          >
            <div className="contact-dept__row">
              <label className="contact-dept__field">
                <span>From contact id</span>
                <input value={relFromId} disabled={disabled || saving} onChange={(e) => setRelFromId(e.target.value)} />
              </label>
              <label className="contact-dept__field">
                <span>To contact id</span>
                <input value={relToId} disabled={disabled || saving} onChange={(e) => setRelToId(e.target.value)} />
              </label>
              <label className="contact-dept__field">
                <span>Type</span>
                <select
                  value={relType}
                  disabled={disabled || saving}
                  onChange={(e) => setRelType(e.target.value as ContactHouseholdRelationshipType)}
                >
                  {CONTACT_HOUSEHOLD_RELATIONSHIP_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              className="contact-dept__secondary"
              disabled={disabled || saving || !relFromId.trim() || !relToId.trim()}
            >
              Add relationship
            </button>
          </form>

          {primary.history.length > 0 ? (
            <details className="contact-household__history">
              <summary>Household history ({primary.history.length})</summary>
              <ul>
                {primary.history.map((entry) => (
                  <li key={entry.history_id}>
                    {entry.created_at.slice(0, 10)} · {entry.summary}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </>
      ) : (
        <form
          className="contact-household__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!newHouseholdName.trim()) return;
            void runMutation(async () => {
              await createHouseholdApi(workspaceId, {
                name: newHouseholdName.trim(),
                primary_contact_id: contactId,
              });
              setNewHouseholdName("");
            });
          }}
        >
          <p className="contact-dept__empty">No household linked to this contact.</p>
          <label className="contact-dept__field">
            <span>Create household</span>
            <input
              value={newHouseholdName}
              disabled={disabled || saving}
              onChange={(e) => setNewHouseholdName(e.target.value)}
              placeholder="Household name"
            />
          </label>
          <button
            type="submit"
            className="contact-dept__primary"
            disabled={disabled || saving || !newHouseholdName.trim()}
          >
            Create household
          </button>
        </form>
      )}
    </section>
  );
}
