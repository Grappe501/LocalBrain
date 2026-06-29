import type { ConsolidationSimulationResult, ExecutiveIntelligenceCard } from "@localbrain/shared";

function formatBytes(bytes: number | null): string {
  if (bytes === null || bytes === 0) return "—";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function priorityClass(p: ExecutiveIntelligenceCard["priority"]): string {
  return `eic__priority eic__priority--${p}`;
}

function stageLabel(status: string): string {
  switch (status) {
    case "complete":
      return "✓";
    case "available":
      return "Available";
    case "not_generated":
      return "Not generated";
    case "not_applicable":
      return "—";
    default:
      return status;
  }
}

type Props = {
  card: ExecutiveIntelligenceCard;
  onSimulate?: (cardId: string) => void;
  onDismiss?: (cardId: string) => void;
  simulating?: boolean;
  simulation?: ConsolidationSimulationResult | null;
};

export function ExecutiveIntelligenceCardView({
  card,
  onSimulate,
  onDismiss,
  simulating,
  simulation,
}: Props) {
  return (
    <article className="eic" data-card-id={card.card_id}>
      <header className="eic__header">
        <h3 className="eic__title">{card.title}</h3>
        <span className={priorityClass(card.priority)}>{card.priority}</span>
      </header>

      <p className="eic__meta">
        <span className="eic__category">{card.category_label}</span>
        <span className="eic__source">{card.source}</span>
      </p>

      <div className="eic__scores">
        <div className="eic__score-grid">
          <span>Importance {card.scores.importance}</span>
          <span>Confidence {card.scores.confidence}%</span>
          <span>Urgency {card.scores.urgency}</span>
          <span>Effort {card.scores.effort}</span>
          <span>Benefit {card.scores.expected_benefit}</span>
          <span>Friction ↓ {card.scores.decision_friction_reduction}</span>
          <span>Risk {card.scores.risk}</span>
        </div>
      </div>

      <p className="eic__impact">
        <strong>Executive impact:</strong> {card.executive_impact}
      </p>
      <p className="eic__friction">{card.decision_friction}</p>

      <p className="eic__estimate">
        Estimated time: {card.estimated_review_minutes} min · Benefit: {card.estimated_benefit}
        {card.reclaimable_bytes ? ` · ${formatBytes(card.reclaimable_bytes)} reclaimable` : null}
      </p>

      <div className="eic__pipeline">
        <span>Recommendation {stageLabel(card.pipeline.recommendation)}</span>
        <span>Simulation {stageLabel(card.pipeline.simulation)}</span>
        <span>Proposal {stageLabel(card.pipeline.proposal)}</span>
      </div>

      {simulation ? (
        <p className="eic__sim-result">{simulation.summary}</p>
      ) : null}

      <div className="eic__actions">
        {onSimulate ? (
          <button type="button" disabled={simulating} onClick={() => onSimulate(card.card_id)}>
            {simulating ? "Simulating…" : "Simulate"}
          </button>
        ) : null}
        {onDismiss ? (
          <button type="button" className="eic__dismiss" onClick={() => onDismiss(card.card_id)}>
            Dismiss
          </button>
        ) : null}
      </div>

      {card.related_paths.length > 0 ? (
        <ul className="eic__paths">
          {card.related_paths.slice(0, 4).map((p) => (
            <li key={p} className="eic__path">
              {p}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
