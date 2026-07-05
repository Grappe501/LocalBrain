import { useCallback, useEffect, useState } from "react";
import type {
  RelationshipAnalyticsContactRow,
  RelationshipAnalyticsDashboard,
  RelationshipAnalyticsFilter,
} from "@localbrain/shared";
import {
  CONTACT_RELATIONSHIP_STRENGTHS,
  CONTACT_RELATIONSHIP_MOMENTUM,
} from "@localbrain/shared";
import type { RelationshipContext } from "@localbrain/shared";
import {
  fetchRelationshipAnalyticsDashboard,
  fetchRelationshipAnalyticsExport,
} from "../../api/relationshipAnalytics";

type Props = {
  workspaceId: string;
  contexts: readonly RelationshipContext[];
  onSelectContact?: (contactId: string) => void;
};

function BucketTable({
  title,
  rows,
  onSelectContact,
}: {
  title: string;
  rows: readonly RelationshipAnalyticsContactRow[];
  onSelectContact?: (contactId: string) => void;
}) {
  if (rows.length === 0) {
    return (
      <section className="rel-analytics__bucket">
        <h3>{title}</h3>
        <p className="contact-dept__empty">No contacts in this bucket for current filters.</p>
      </section>
    );
  }

  return (
    <section className="rel-analytics__bucket">
      <h3>
        {title} <span className="rel-analytics__count">{rows.length}</span>
      </h3>
      <table className="rel-analytics__table">
        <thead>
          <tr>
            <th>Contact</th>
            <th>Steward</th>
            <th>Momentum</th>
            <th>Health</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 12).map((row) => (
            <tr key={row.contact_id}>
              <td>
                {onSelectContact ? (
                  <button type="button" className="rel-analytics__link" onClick={() => onSelectContact(row.contact_id)}>
                    {row.display_name}
                  </button>
                ) : (
                  row.display_name
                )}
              </td>
              <td>{row.steward_user_id ?? "—"}</td>
              <td>{row.momentum}</td>
              <td>{row.health_label}</td>
              <td className="rel-analytics__evidence">{row.evidence_summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 12 ? <p className="contact-dept__meta">Showing 12 of {rows.length}</p> : null}
    </section>
  );
}

export function RelationshipAnalyticsDashboardPanel({
  workspaceId,
  contexts,
  onSelectContact,
}: Props) {
  const [dashboard, setDashboard] = useState<RelationshipAnalyticsDashboard | null>(null);
  const [filter, setFilter] = useState<RelationshipAnalyticsFilter>({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDashboard(await fetchRelationshipAnalyticsDashboard(workspaceId, filter));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const exportView = await fetchRelationshipAnalyticsExport(workspaceId, filter);
      const blob = new Blob([JSON.stringify(exportView, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `relationship-analytics-${workspaceId}-${exportView.computed_at.slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  if (loading && !dashboard) {
    return <p className="contact-dept__empty">Loading relationship analytics…</p>;
  }

  if (!dashboard) {
    return error ? <p className="contact-dept__error">{error}</p> : null;
  }

  const portfolio = dashboard.portfolio;

  return (
    <div className="rel-analytics">
      <header className="rel-analytics__header">
        <div>
          <h2>Campaign relationship health</h2>
          <p className="contact-dept__meta">
            CONTACT-V3-021 · computed {new Date(dashboard.computed_at).toLocaleString()} · advisory only
          </p>
          <p className="rel-analytics__notice">{dashboard.notice}</p>
        </div>
        <button type="button" className="contact-dept__secondary" disabled={exporting} onClick={() => void handleExport()}>
          Export JSON
        </button>
      </header>

      {error ? <p className="contact-dept__error">{error}</p> : null}

      <section className="rel-analytics__filters">
        <label>
          <span>County / team tag</span>
          <input
            type="text"
            value={filter.tag ?? ""}
            placeholder="e.g. county:benton"
            onChange={(event) => setFilter((prev) => ({ ...prev, tag: event.target.value || undefined }))}
          />
        </label>
        <label>
          <span>Context</span>
          <select
            value={filter.context_id ?? ""}
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, context_id: event.target.value || undefined }))
            }
          >
            <option value="">All contexts</option>
            {contexts.map((context) => (
              <option key={context.context_id} value={context.context_id}>
                {context.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Strength</span>
          <select
            value={filter.strength ?? ""}
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                strength: (event.target.value || undefined) as RelationshipAnalyticsFilter["strength"],
              }))
            }
          >
            <option value="">All strengths</option>
            {CONTACT_RELATIONSHIP_STRENGTHS.map((strength) => (
              <option key={strength} value={strength}>
                {strength}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Momentum</span>
          <select
            value={filter.momentum ?? ""}
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                momentum: (event.target.value || undefined) as RelationshipAnalyticsFilter["momentum"],
              }))
            }
          >
            <option value="">All momentum</option>
            {CONTACT_RELATIONSHIP_MOMENTUM.map((momentum) => (
              <option key={momentum} value={momentum}>
                {momentum}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Health label</span>
          <input
            type="text"
            value={filter.health_label ?? ""}
            placeholder="e.g. needs_attention"
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, health_label: event.target.value || undefined }))
            }
          />
        </label>
        <button type="button" className="contact-dept__primary" onClick={() => void load()}>
          Apply filters
        </button>
      </section>

      <section className="rel-analytics__portfolio">
        <article>
          <strong>{portfolio.total_contacts}</strong>
          <span>Total contacts</span>
        </article>
        <article>
          <strong>{portfolio.steward_coverage_percent}%</strong>
          <span>Steward coverage</span>
        </article>
        <article>
          <strong>{portfolio.unowned_count}</strong>
          <span>Unowned</span>
        </article>
        <article>
          <strong>{portfolio.momentum_growing}</strong>
          <span>Growing</span>
        </article>
        <article>
          <strong>{portfolio.momentum_cooling + portfolio.momentum_dormant}</strong>
          <span>Cooling / dormant</span>
        </article>
        <article>
          <strong>{portfolio.open_actions_total}</strong>
          <span>Open actions</span>
        </article>
        <article>
          <strong>{portfolio.overdue_actions_total}</strong>
          <span>Overdue actions</span>
        </article>
      </section>

      {dashboard.overloaded_stewards.length > 0 ? (
        <section className="rel-analytics__bucket">
          <h3>
            Overloaded stewards{" "}
            <span className="rel-analytics__count">{dashboard.overloaded_stewards.length}</span>
          </h3>
          <ul className="rel-analytics__steward-load">
            {dashboard.overloaded_stewards.map((row) => (
              <li key={row.steward_user_id}>
                <strong>{row.steward_user_id}</strong> — {row.contact_count} contacts · {row.cooling_count}{" "}
                cooling · {row.without_recent_contact_count} stale
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="rel-analytics__grid">
        <BucketTable title="Without steward" rows={dashboard.without_steward} onSelectContact={onSelectContact} />
        <BucketTable title="Contributors without steward" rows={dashboard.contributors_without_steward} onSelectContact={onSelectContact} />
        <BucketTable title="Cooling relationships" rows={dashboard.cooling} onSelectContact={onSelectContact} />
        <BucketTable title="Growing relationships" rows={dashboard.growing} onSelectContact={onSelectContact} />
        <BucketTable title="Ignored volunteers" rows={dashboard.ignored_volunteers} onSelectContact={onSelectContact} />
        <BucketTable title="Cold donors" rows={dashboard.cold_donors} onSelectContact={onSelectContact} />
        <BucketTable title="Inactive leaders" rows={dashboard.inactive_leaders} onSelectContact={onSelectContact} />
        <BucketTable title="Action backlog" rows={dashboard.action_backlog} onSelectContact={onSelectContact} />
      </div>
    </div>
  );
}
