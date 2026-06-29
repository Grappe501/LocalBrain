import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ConsolidationOpportunitySummary, V1AcceptanceReport } from "@localbrain/shared";
import { useActiveWorkspace } from "../context/ActiveWorkspaceContext";
import { MOCK_BRIEFING_SECTIONS, MOCK_MWI_FOOTER } from "../data/mockBriefing";
import { fetchV1Acceptance } from "../api/v1Spine";
import { fetchConsolidationOpportunity } from "../api/consolidation";
import { V1MilestoneBanner } from "../components/V1MilestoneBanner";

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function ConsolidationOpportunitySection({ opp }: { opp: ConsolidationOpportunitySummary }) {
  return (
    <section className="briefing-section">
      <h2 className="briefing-section__title">Consolidation opportunity</h2>
      <ul className="briefing-section__lines">
        <li>
          Consolidation Score: {opp.consolidation_score}/100 {opp.score_band}
          {opp.trend_label ? ` · ${opp.trend_label}` : ""}
        </li>
        <li>
          {formatBytes(opp.reclaimable_storage_bytes)} reclaimable · {opp.estimated_review_minutes}{" "}
          min review · {opp.workspace_simplification} simplification
        </li>
        {opp.top_priority_summary ? <li>{opp.top_priority_summary}</li> : null}
        <li>
          Risk: {opp.risk_assessment.high} high · {opp.risk_assessment.medium} medium ·{" "}
          {opp.risk_assessment.low} low · {opp.executive_summary}
        </li>
        <li>
          <Link to="/migration/consolidation">Open Executive Consolidation Briefing →</Link>
        </li>
      </ul>
    </section>
  );
}

export function ExecutiveBriefing() {
  const { workspace, loading } = useActiveWorkspace();
  const [v1, setV1] = useState<V1AcceptanceReport | null>(null);
  const [consolidation, setConsolidation] = useState<ConsolidationOpportunitySummary | null>(null);
  const wsId = workspace?.workspace_id ?? "localbrain";
  const wsTitle = workspace?.title ?? "LocalBrain";
  const wsFocus = workspace?.current_focus;

  useEffect(() => {
    void fetchV1Acceptance()
      .then(setV1)
      .catch(() => setV1(null));
    void fetchConsolidationOpportunity()
      .then(setConsolidation)
      .catch(() => setConsolidation(null));
  }, []);

  return (
    <article className="executive-briefing">
      <header className="executive-briefing__header">
        <h1>Good morning, Steve.</h1>
        <p className="executive-briefing__workspace">
          Workspace:{" "}
          <Link to={`/workspace/${wsId}`}>
            {loading ? "…" : wsTitle} ({wsId})
          </Link>
          {wsFocus ? (
            <>
              {" "}
              · Current focus: <strong>{wsFocus}</strong>
            </>
          ) : null}
        </p>
        <p className="executive-briefing__meta">
          Executive Briefing · Executive OS V1 ·{" "}
          <Link to="/program-office">Program Office</Link>
        </p>
      </header>

      <V1MilestoneBanner report={v1} />

      {MOCK_BRIEFING_SECTIONS.map((section) => (
        <section key={section.title} className="briefing-section">
          <h2 className="briefing-section__title">{section.title}</h2>
          <ul className="briefing-section__lines">
            {section.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ))}

      {consolidation ? <ConsolidationOpportunitySection opp={consolidation} /> : null}

      {v1 && !v1.overall_pass ? (
        <section className="briefing-section briefing-section--attention">
          <h2 className="briefing-section__title">V1 spine checks</h2>
          <ul className="briefing-section__lines">
            {v1.checks
              .filter((c) => !c.passed)
              .map((c) => (
                <li key={c.id}>
                  {c.label}: {c.detail}
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <footer className="executive-briefing__footer">
        <p>{MOCK_MWI_FOOTER}</p>
      </footer>
    </article>
  );
}
