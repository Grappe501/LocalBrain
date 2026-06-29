import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { V1AcceptanceReport } from "@localbrain/shared";
import { useActiveWorkspace } from "../context/ActiveWorkspaceContext";
import { MOCK_BRIEFING_SECTIONS, MOCK_MWI_FOOTER } from "../data/mockBriefing";
import { fetchV1Acceptance } from "../api/v1Spine";
import { V1MilestoneBanner } from "../components/V1MilestoneBanner";

export function ExecutiveBriefing() {
  const { workspace, loading } = useActiveWorkspace();
  const [v1, setV1] = useState<V1AcceptanceReport | null>(null);
  const wsId = workspace?.workspace_id ?? "localbrain";
  const wsTitle = workspace?.title ?? "LocalBrain";
  const wsFocus = workspace?.current_focus;

  useEffect(() => {
    void fetchV1Acceptance()
      .then(setV1)
      .catch(() => setV1(null));
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
