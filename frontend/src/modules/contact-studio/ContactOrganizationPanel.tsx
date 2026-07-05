import { useCallback, useEffect, useState } from "react";

import {

  ORGANIZATION_CATEGORIES,

  ORGANIZATION_MEMBERSHIP_ROLES,

  type OrganizationCategory,

  type OrganizationMembershipRole,

  type OrganizationSearchResult,

  type OrganizationSummary,

} from "@localbrain/shared";

import {

  addOrganizationMembershipApi,

  createOrganizationApi,

  endOrganizationMembershipApi,

  fetchContactOrganizations,

  searchOrganizationsApi,

} from "../../api/contactOrganizationEngine";



type Props = {

  contactId: string;

  workspaceId: string;

  disabled?: boolean;

};



export function ContactOrganizationPanel({ contactId, workspaceId, disabled }: Props) {

  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] = useState<OrganizationSearchResult[] | null>(null);

  const [newOrgName, setNewOrgName] = useState("");

  const [newOrgCategory, setNewOrgCategory] = useState<OrganizationCategory>("nonprofit");

  const [joinOrgId, setJoinOrgId] = useState("");

  const [joinRole, setJoinRole] = useState<OrganizationMembershipRole>("member");



  const load = useCallback(async () => {

    setLoading(true);

    setError(null);

    try {

      const next = await fetchContactOrganizations(contactId);

      setOrganizations(next);

    } catch (e) {

      setError(e instanceof Error ? e.message : "Failed to load organizations");

      setOrganizations([]);

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

      setError(e instanceof Error ? e.message : "Organization action failed");

    } finally {

      setSaving(false);

    }

  }



  if (loading && organizations.length === 0) {

    return <p className="contact-dept__empty">Loading organization affiliations…</p>;

  }



  return (

    <section className="contact-organization">

      <h3>Organizations</h3>

      <p className="contact-dept__meta">CONTACT-V3-019 · affiliations · belong, don't flatten</p>

      {error ? <p className="contact-dept__error">{error}</p> : null}



      {organizations.length > 0 ? (

        <ul className="contact-organization__list">

          {organizations.map((entry) => (

            <li key={entry.organization.organization_id}>

              <strong>{entry.organization.name}</strong>

              <span>

                {entry.organization.category.replace(/_/g, " ")} · {entry.metrics.membership_count}{" "}

                member(s) · strength {entry.metrics.strength_score} ({entry.metrics.strength_label})

              </span>

              <span>

                Participation {entry.metrics.participation_score}% · momentum {entry.metrics.momentum}

              </span>

              <ul>

                {entry.memberships

                  .filter((m) => !m.effective_until && m.contact_id === contactId)

                  .map((membership) => (

                    <li key={membership.membership_id}>

                      Role: {membership.membership_role.replace(/_/g, " ")} · status{" "}

                      {membership.membership_status}

                      <button

                        type="button"

                        className="contact-dept__secondary contact-context__chip-action"

                        disabled={disabled || saving}

                        onClick={() =>

                          void runMutation(async () => {

                            await endOrganizationMembershipApi(membership.membership_id);

                          })

                        }

                      >

                        Leave

                      </button>

                    </li>

                  ))}

              </ul>

              {entry.history.length > 0 ? (

                <details>

                  <summary>History ({entry.history.length})</summary>

                  <ul>

                    {entry.history.slice(0, 5).map((item) => (

                      <li key={item.history_id}>

                        {item.created_at.slice(0, 10)} · {item.summary}

                      </li>

                    ))}

                  </ul>

                </details>

              ) : null}

            </li>

          ))}

        </ul>

      ) : (

        <p className="contact-dept__empty">No organization affiliations yet.</p>

      )}



      <form

        className="contact-organization__form"

        onSubmit={(e) => {

          e.preventDefault();

          if (!search.trim()) return;

          void (async () => {

            setSaving(true);

            setError(null);

            try {

              const data = (await searchOrganizationsApi(workspaceId, search.trim())) as {
                organizations: OrganizationSearchResult[];
              };

              setSearchResults(data.organizations);

            } catch (err) {

              setError(err instanceof Error ? err.message : "Search failed");

            } finally {

              setSaving(false);

            }

          })();

        }}

      >

        <label className="contact-dept__field">

          <span>Search organizations</span>

          <input value={search} disabled={disabled || saving} onChange={(e) => setSearch(e.target.value)} />

        </label>

        <button type="submit" className="contact-dept__secondary" disabled={disabled || saving || !search.trim()}>

          Search

        </button>

      </form>



      {searchResults && searchResults.length > 0 ? (

        <ul className="contact-organization__search">

          {searchResults.map((org) => (

            <li key={org.organization_id}>

              {org.name} · {org.membership_count} members

              <button

                type="button"

                className="contact-dept__secondary contact-context__chip-action"

                disabled={disabled || saving}

                onClick={() => {

                  setJoinOrgId(org.organization_id);

                  setSearch(org.name);

                }}

              >

                Select

              </button>

            </li>

          ))}

        </ul>

      ) : null}



      <form

        className="contact-organization__form"

        onSubmit={(e) => {

          e.preventDefault();

          if (!joinOrgId.trim()) return;

          void runMutation(async () => {

            await addOrganizationMembershipApi(joinOrgId.trim(), {

              contact_id: contactId,

              membership_role: joinRole,

            });

            setJoinOrgId("");

            setSearchResults(null);

          });

        }}

      >

        <label className="contact-dept__field">

          <span>Join organization (id)</span>

          <input value={joinOrgId} disabled={disabled || saving} onChange={(e) => setJoinOrgId(e.target.value)} />

        </label>

        <label className="contact-dept__field">

          <span>Role</span>

          <select value={joinRole} disabled={disabled || saving} onChange={(e) => setJoinRole(e.target.value as OrganizationMembershipRole)}>

            {ORGANIZATION_MEMBERSHIP_ROLES.map((role) => (

              <option key={role} value={role}>

                {role.replace(/_/g, " ")}

              </option>

            ))}

          </select>

        </label>

        <button type="submit" className="contact-dept__secondary" disabled={disabled || saving || !joinOrgId.trim()}>

          Join organization

        </button>

      </form>



      <form

        className="contact-organization__form"

        onSubmit={(e) => {

          e.preventDefault();

          if (!newOrgName.trim()) return;

          void runMutation(async () => {

            const created = await createOrganizationApi(workspaceId, {

              name: newOrgName.trim(),

              category: newOrgCategory,

            });

            await addOrganizationMembershipApi(created.organization.organization_id, {

              contact_id: contactId,

              membership_role: "member",

            });

            setNewOrgName("");

          });

        }}

      >

        <label className="contact-dept__field">

          <span>Create organization</span>

          <input value={newOrgName} disabled={disabled || saving} onChange={(e) => setNewOrgName(e.target.value)} />

        </label>

        <label className="contact-dept__field">

          <span>Category</span>

          <select

            value={newOrgCategory}

            disabled={disabled || saving}

            onChange={(e) => setNewOrgCategory(e.target.value as OrganizationCategory)}

          >

            {ORGANIZATION_CATEGORIES.map((category) => (

              <option key={category} value={category}>

                {category.replace(/_/g, " ")}

              </option>

            ))}

          </select>

        </label>

        <button type="submit" className="contact-dept__primary" disabled={disabled || saving || !newOrgName.trim()}>

          Create & join

        </button>

      </form>

    </section>

  );

}

