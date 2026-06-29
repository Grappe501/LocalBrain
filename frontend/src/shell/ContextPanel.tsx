import { CONTEXT_CARDS } from "../data/contextCards";

function statusLabel(status: "not_connected" | "planned"): string {
  return status === "not_connected" ? "Not connected" : "Planned";
}

export function ContextPanel() {
  return (
    <aside className="context-panel" aria-label="System context">
      <h2 className="context-panel__title">Context</h2>
      <p className="context-panel__count">{CONTEXT_CARDS.length} cards</p>
      <ul className="context-panel__cards">
        {CONTEXT_CARDS.map((card) => (
          <li key={card.id} className="context-panel__card">
            <h3 className="context-panel__card-title">{card.title}</h3>
            <span
              className={
                card.status === "not_connected"
                  ? "context-panel__status context-panel__status--muted"
                  : "context-panel__status"
              }
            >
              {statusLabel(card.status)}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
