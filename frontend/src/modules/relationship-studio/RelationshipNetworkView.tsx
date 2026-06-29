import { useCallback, useEffect, useState } from "react";
import { LiveSurfaceBanner } from "../../components/LiveSurfaceBanner";
import type {
  RelationshipHealthScore,
  RelationshipNetworkOverview,
  RelationshipProfile,
  RelationshipTimelineEvent,
} from "@localbrain/shared";
import { fetchPersonProfile, fetchRelationshipOverview } from "../../api/relationshipNetwork";

type TabId = "overview" | "people" | "organizations" | "network" | "engagement" | "learn";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "people", label: "People" },
  { id: "organizations", label: "Organizations" },
  { id: "network", label: "Network Graph" },
  { id: "engagement", label: "Engagement" },
  { id: "learn", label: "Learn" },
];

function ScoreHero({ score }: { score: RelationshipHealthScore }) {
  return (
    <section className={`eng-score eng-score--${score.label}`}>
      <div className="eng-score__main">
        <span className="system-health__score-value">{score.score}</span>
        <span className="system-health__score-label">Relationship Health Score</span>
        <p className="system-health__score-summary">{score.summary}</p>
      </div>
      <div className="eng-score__factors">
        {score.factors.map((f) => (
          <div key={f.id} className="eng-score__factor">
            <div className="eng-score__factor-head">
              <span>{f.name}</span>
              <strong>{f.score}</strong>
            </div>
            <div className="epo-coverage__track">
              <div className="epo-coverage__fill" style={{ width: `${f.score}%` }} />
            </div>
            <span className="eng-score__factor-detail">{f.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function statusBadge(status: string): string {
  return `rel-dept__status rel-dept__status--${status}`;
}

export function RelationshipNetworkView() {
  const [tab, setTab] = useState<TabId>("overview");
  const [overview, setOverview] = useState<RelationshipNetworkOverview | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [personDetail, setPersonDetail] = useState<{
    person: RelationshipProfile;
    timeline: RelationshipTimelineEvent[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      setOverview(await fetchRelationshipOverview());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Relationships");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!selectedPerson) {
      setPersonDetail(null);
      return;
    }
    void fetchPersonProfile(selectedPerson)
      .then(setPersonDetail)
      .catch(() => setPersonDetail(null));
  }, [selectedPerson]);

  if (loading && !overview) {
    return (
      <div className="rel-dept">
        <p>Loading Relationship &amp; Network Intelligence…</p>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="rel-dept">
        <p className="rel-dept__error">{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  const graph = overview.network_graph;
  const people = overview.people.filter((p) => p.person_id !== "person_steve");

  return (
    <div className="rel-dept">
      <header className="rel-dept__header">
        <h1>Relationship &amp; Network Intelligence</h1>
        <p className="rel-dept__meta">
          Social Knowledge · not a CRM · Relationship Chief · LB-OS-015 · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
        <p className="rel-dept__philosophy">{overview.philosophy}</p>
      </header>

      <LiveSurfaceBanner route="/studio/relationships" observedAt={overview.observed_at} />

      <aside className="writing-dept__guardrails">
        {overview.guardrails.map((g) => (
          <span key={g} className="writing-dept__guardrail-pill">
            {g}
          </span>
        ))}
      </aside>

      <nav className="eng-dept__tabs" aria-label="Relationship tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`eng-dept__tab ${tab === t.id ? "eng-dept__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="eng-dept__panel">
          <ScoreHero score={overview.relationship_health_score} />
          <dl className="eng-dept__stats">
            <div>
              <dt>Active relationships</dt>
              <dd>{overview.active_relationships}</dd>
            </div>
            <div>
              <dt>Follow-ups due</dt>
              <dd>{overview.follow_ups_due}</dd>
            </div>
          </dl>
          <section>
            <h2>Strongest connections</h2>
            <ul>
              {overview.strongest_connections.map((c) => (
                <li key={c.person_id}>
                  {c.name} — strength {c.strength}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Dormant relationships</h2>
            <ul>
              {overview.dormant_relationships.map((d) => (
                <li key={d.person_id}>
                  {d.name}
                  {d.last_touch_days_ago != null ? ` — ${d.last_touch_days_ago}d ago` : ""}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Chief recommendation</h2>
            <div className="eng-rec">
              <p>
                <strong>What:</strong> {overview.chief_recommendation.what}
              </p>
              <p>
                <strong>Why:</strong> {overview.chief_recommendation.why}
              </p>
              <p>
                <strong>If approved:</strong> {overview.chief_recommendation.if_approved}
              </p>
            </div>
          </section>
        </div>
      )}

      {tab === "people" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Relationship Profiles</h2>
            <p className="eng-dept__hint">
              Not contact rows — profiles with orgs, workspaces, introductions, and timeline.
            </p>
            <ul className="rel-dept__people-list">
              {people.map((p) => (
                <li key={p.person_id}>
                  <button
                    type="button"
                    className={
                      selectedPerson === p.person_id ? "eng-dept__project--active" : ""
                    }
                    onClick={() => setSelectedPerson(p.person_id)}
                  >
                    {p.name}
                  </button>
                  <span className={statusBadge(p.status)}>{p.status}</span>
                  <span className="rel-dept__strength">· {p.relationship_strength}</span>
                </li>
              ))}
            </ul>
          </section>
          {personDetail && (
            <section className="rel-dept__profile-detail">
              <h2>{personDetail.person.name}</h2>
              <p>{personDetail.person.summary}</p>
              <dl>
                <dt>Roles</dt>
                <dd>{personDetail.person.roles.join(", ")}</dd>
                <dt>Workspaces</dt>
                <dd>{personDetail.person.workspace_ids.join(", ") || "—"}</dd>
                <dt>Introduced by</dt>
                <dd>{personDetail.person.introduced_by ?? "—"}</dd>
              </dl>
              <h3>Relationship Timeline</h3>
              <ol className="rel-dept__timeline">
                {personDetail.timeline.map((e) => (
                  <li key={e.id}>
                    <time>{e.occurred_at}</time>
                    <strong>{e.title}</strong>
                    <span className="rel-dept__event-type">{e.event_type}</span>
                    <p>{e.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      )}

      {tab === "organizations" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Organizations</h2>
            <ul className="rel-dept__org-list">
              {overview.organizations.map((o) => (
                <li key={o.org_id} className="rel-dept__org-card">
                  <h3>{o.name}</h3>
                  <span className="rel-dept__org-kind">{o.kind}</span>
                  <p>{o.description}</p>
                  <p>
                    <strong>Members:</strong> {o.member_person_ids.length} ·{" "}
                    <strong>Workspaces:</strong> {o.workspace_ids.join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "network" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Network Graph</h2>
            <p className="eng-dept__hint">
              Steve → people → organizations → workspaces. Future: &quot;Who knows someone
              at…?&quot;
            </p>
            <p>
              {graph.nodes.length} nodes · {graph.edges.length} edges
            </p>
            <h3>People</h3>
            <ul className="eng-dept__node-list">
              {graph.nodes
                .filter((n) => n.kind === "person")
                .map((n) => (
                  <li key={n.id}>{n.label}</li>
                ))}
            </ul>
            <h3>Organizations</h3>
            <ul className="eng-dept__node-list">
              {graph.nodes
                .filter((n) => n.kind === "organization")
                .map((n) => (
                  <li key={n.id}>{n.label}</li>
                ))}
            </ul>
            <h3>Sample path</h3>
            <pre className="rel-dept__path">Steve → Kelly → Campaign → County → Volunteer → Organization</pre>
          </section>
        </div>
      )}

      {tab === "engagement" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Engagement recommendations</h2>
            <p className="eng-dept__hint">Chief of Staff outreach — recommendations only, no automation.</p>
            <ul className="rel-dept__engagement">
              {overview.engagement_recommendations.map((r) => (
                <li key={r.id} className={`rel-dept__engagement--${r.priority}`}>
                  <strong>{r.action}</strong>
                  <p>{r.reason}</p>
                  <span>
                    Priority: {r.priority} · Confidence: {r.confidence}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "learn" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Learn — Relationship OJT</h2>
            <dl className="eng-dept__learn">
              <div>
                <dt>Level</dt>
                <dd>{overview.learn.current_level}</dd>
              </div>
              <div>
                <dt>Lesson</dt>
                <dd>{overview.learn.suggested_lesson}</dd>
              </div>
              <div>
                <dt>Challenge</dt>
                <dd>{overview.learn.practice_challenge}</dd>
              </div>
            </dl>
            <ul>
              {overview.learn.concepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="eng-dept__hint">
              Networking · stakeholder mapping · coalition building · CRM concepts — full track
              in OJT Academy.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
