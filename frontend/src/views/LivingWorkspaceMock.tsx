import { Link } from "react-router-dom";
import {
  LOCALBRAIN_WORKSPACE,
  MOCK_WORKSPACE_SIGNALS,
} from "../data/mockLocalbrainWorkspace";

export function LivingWorkspaceMock() {
  return (
    <article className="living-workspace">
      <header className="living-workspace__header">
        <h1>{LOCALBRAIN_WORKSPACE.name}</h1>
        <p className="living-workspace__id">{LOCALBRAIN_WORKSPACE.id}</p>
        <p className="living-workspace__path">{LOCALBRAIN_WORKSPACE.path}</p>
        <p className="living-workspace__type">{LOCALBRAIN_WORKSPACE.type}</p>
        <p>{LOCALBRAIN_WORKSPACE.description}</p>
        <Link to="/" className="living-workspace__back">
          ← Executive Briefing
        </Link>
      </header>

      <section className="living-workspace__signals">
        <h2>Workspace signals (mock)</h2>
        <ul className="signal-grid">
          {MOCK_WORKSPACE_SIGNALS.map((signal) => (
            <li
              key={signal.label}
              className={`signal-card signal-card--${signal.tone}`}
            >
              <span className="signal-card__label">{signal.label}</span>
              <span className="signal-card__value">{signal.value}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
