import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {
  DepartmentDailyReport,
  ExecutiveOfficeExperience,
  ExecutiveOfficeZone,
} from "@localbrain/shared";
import { useActiveWorkspace } from "../context/ActiveWorkspaceContext";
import { fetchExecutiveOfficeExperience } from "../api/executiveOffice";
import { V1MilestoneBanner } from "../components/V1MilestoneBanner";
import { ExecutiveQuestionHub } from "../components/ExecutiveQuestionHeader";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";
import { fetchV1Acceptance } from "../api/v1Spine";
import type { V1AcceptanceReport } from "@localbrain/shared";

function ScaffoldBanner({ mode }: { mode: ExecutiveOfficeExperience["projection_mode"] }) {
  if (mode !== "scaffold") return null;
  return (
    <div className="executive-office__scaffold" role="status">
      <strong>Scaffold mode</strong> — structural briefing only. No live email, finance, calendar, or
      campaign intelligence. Department reports show readiness and doctrine, not fabricated activity.
    </div>
  );
}

function AttentionBadge({ attention }: { attention: DepartmentDailyReport["attention"] }) {
  return <span className={`executive-office__attention executive-office__attention--${attention}`}>{attention}</span>;
}

function StatusBadge({ status }: { status: DepartmentDailyReport["status"] }) {
  return <span className={`executive-office__status executive-office__status--${status}`}>{status}</span>;
}

function DepartmentReportCard({ report }: { report: DepartmentDailyReport }) {
  const [open, setOpen] = useState(false);
  const readMore =
    report.read_more_route && !report.read_more_route.startsWith("/api")
      ? report.read_more_route
      : null;

  return (
    <article className="executive-office__dept-card" id={report.department_id}>
      <header className="executive-office__dept-header">
        <h3>{report.title}</h3>
        <div className="executive-office__dept-meta">
          <StatusBadge status={report.status} />
          <AttentionBadge attention={report.attention} />
        </div>
      </header>
      <p className="executive-office__dept-summary">{report.summary}</p>
      <button
        type="button"
        className="executive-office__read-more"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Hide delta" : "What changed since yesterday"}
      </button>
      {open ? (
        <ul className="executive-office__dept-delta">
          {report.what_changed_since_yesterday.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
      {readMore ? (
        <p className="executive-office__dept-link">
          <Link to={readMore}>Open capability →</Link>
        </p>
      ) : null}
    </article>
  );
}

function ZoneNav({ zone }: { zone: ExecutiveOfficeZone }) {
  if (zone.zone_id === "briefing") return null;
  return (
    <section className="executive-office__zone" aria-labelledby={`zone-${zone.zone_id}`}>
      <h2 id={`zone-${zone.zone_id}`}>{zone.title}</h2>
      <p className="executive-office__zone-desc">{zone.description}</p>
      <ul className="executive-office__zone-links">
        {zone.items.map((item) => {
          const isHash = item.route.startsWith("/#");
          const hash = isHash ? item.route.slice(2) : null;
          if (isHash && hash) {
            return (
              <li key={item.label}>
                <a href={`#${hash}`}>{item.label}</a>
              </li>
            );
          }
          return (
            <li key={item.label}>
              <Link to={item.route}>{item.label}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ExecutiveBriefing() {
  const { workspace, loading } = useActiveWorkspace();
  const [experience, setExperience] = useState<ExecutiveOfficeExperience | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [v1, setV1] = useState<V1AcceptanceReport | null>(null);
  const wsId = workspace?.workspace_id ?? "localbrain";
  const wsTitle = workspace?.title ?? "LocalBrain";

  useEffect(() => {
    void fetchExecutiveOfficeExperience()
      .then(setExperience)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load office"));
    void fetchV1Acceptance()
      .then(setV1)
      .catch(() => setV1(null));
  }, []);

  const zones = [...(experience?.zones ?? [])].sort((a, b) => a.order - b.order);
  const briefing = experience?.briefing;

  return (
    <article className="executive-office">
      <ExecutiveQuestionShell route="/" showCrossLinks={false} />

      <header className="executive-office__header">
        <p className="executive-office__eyebrow">{experience?.experience_title ?? "Executive Office"}</p>
        <h1>{briefing?.greeting ?? "Good morning, Steve."}</h1>
        <p className="executive-office__workspace">
          Workspace:{" "}
          <Link to={`/workspace/${wsId}`}>
            {loading ? "…" : wsTitle} ({wsId})
          </Link>
        </p>
        {experience ? (
          <p className="executive-office__meta">
            {experience.engine_id} · {experience.slice_id} · {experience.projection_mode} ·{" "}
            <Link to="/program-office">Program Office</Link>
          </p>
        ) : null}
      </header>

      {error ? (
        <p className="executive-office__error" role="alert">
          {error}
        </p>
      ) : null}

      {experience ? <ScaffoldBanner mode={experience.projection_mode} /> : null}

      <V1MilestoneBanner report={v1} />

      <section className="executive-office__cos" aria-labelledby="cos-briefing-title">
        <h2 id="cos-briefing-title">{briefing?.title ?? "Chief of Staff Briefing"}</h2>
        <p className="executive-office__reading">
          Estimated reading time: {briefing?.estimated_reading_minutes ?? "—"} minutes
          {briefing?.executive_attention_score != null
            ? ` · Executive Attention Score: ${briefing.executive_attention_score}`
            : " · Executive Attention Score: not instrumented"}
        </p>
        <div className="executive-office__narrative">
          <p>{briefing?.narrative ?? "Loading briefing synthesis…"}</p>
        </div>
        {briefing?.top_priorities.length ? (
          <div className="executive-office__priorities">
            <h3>Today&apos;s top priorities</h3>
            <ol>
              {briefing.top_priorities.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </div>
        ) : null}
      </section>

      <section
        className="executive-office__departments"
        id="department-reports"
        aria-labelledby="department-reports-title"
      >
        <h2 id="department-reports-title">Department reports</h2>
        <p className="executive-office__departments-intro">
          Departments submit to the Chief of Staff — not directly to you. Reports show readiness and
          structure until live connectors ship.
        </p>
        <div className="executive-office__dept-grid">
          {(experience?.department_reports ?? []).map((report) => (
            <DepartmentReportCard key={report.department_id} report={report} />
          ))}
        </div>
      </section>

      {zones.map((zone) => (
        <ZoneNav key={zone.zone_id} zone={zone} />
      ))}

      <section className="executive-office__questions" id="executive-questions">
        <h2>Executive questions</h2>
        <ExecutiveQuestionHub />
      </section>

      <footer className="executive-office__footer">
        <p>
          Daily questions:{" "}
          {(experience?.daily_questions ?? []).map((q, i) => (
            <span key={q}>
              {i > 0 ? " · " : ""}
              {q}
            </span>
          ))}
        </p>
      </footer>
    </article>
  );
}
