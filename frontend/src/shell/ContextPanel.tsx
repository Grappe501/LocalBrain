import { CONTEXT_CARDS, type ContextCardStatus } from "../data/contextCards";

function statusLabel(status: ContextCardStatus): string {
  switch (status) {
    case "complete":
      return "Complete";
    case "active":
      return "Active";
    case "planned":
      return "Planned";
    case "not_connected":
      return "Not connected";
    default:
      return status;
  }
}

function statusClass(status: ContextCardStatus): string {
  if (status === "not_connected") return "context-panel__status context-panel__status--muted";
  if (status === "complete") return "context-panel__status context-panel__status--complete";
  if (status === "active") return "context-panel__status context-panel__status--active";
  return "context-panel__status";
}

export function ContextPanel() {
  return (
    <aside className="context-panel" aria-label="System context">
      <h2 className="context-panel__title">Context</h2>
      <p className="context-panel__count">{CONTEXT_CARDS.length} cards · Institutional Cognition Foundation</p>
      <ul className="context-panel__cards">
        {CONTEXT_CARDS.map((card) => (
          <li key={card.id} className="context-panel__card">
            <h3 className="context-panel__card-title">{card.title}</h3>
            <p className="context-panel__card-detail">{card.detail}</p>
            <span className={statusClass(card.status)}>{statusLabel(card.status)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
