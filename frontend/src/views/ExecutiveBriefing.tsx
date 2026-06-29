import { Link } from "react-router-dom";
import { useActiveWorkspace } from "../context/ActiveWorkspaceContext";
import { MOCK_BRIEFING_SECTIONS, MOCK_MWI_FOOTER } from "../data/mockBriefing";

export function ExecutiveBriefing() {
  const { workspace, loading } = useActiveWorkspace();
  const wsId = workspace?.workspace_id ?? "localbrain";
  const wsTitle = workspace?.title ?? "LocalBrain";
  const wsFocus = workspace?.current_focus;

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
        <p className="executive-briefing__meta">Executive Briefing · LB-OS-004</p>
      </header>

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

      <footer className="executive-briefing__footer">
        <p>{MOCK_MWI_FOOTER}</p>
      </footer>
    </article>
  );
}
