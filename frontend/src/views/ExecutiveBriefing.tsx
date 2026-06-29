import { Link } from "react-router-dom";
import { MOCK_BRIEFING_SECTIONS, MOCK_MWI_FOOTER } from "../data/mockBriefing";
import { LOCALBRAIN_WORKSPACE } from "../data/mockLocalbrainWorkspace";

export function ExecutiveBriefing() {
  return (
    <article className="executive-briefing">
      <header className="executive-briefing__header">
        <h1>Good morning, Steve.</h1>
        <p className="executive-briefing__workspace">
          Workspace:{" "}
          <Link to="/project/localbrain">
            {LOCALBRAIN_WORKSPACE.name} ({LOCALBRAIN_WORKSPACE.id})
          </Link>
          · {LOCALBRAIN_WORKSPACE.path}
        </p>
        <p className="executive-briefing__meta">Executive Briefing · mock · LB-OS-002</p>
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
