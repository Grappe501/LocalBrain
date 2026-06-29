import type { WorkspaceEvent } from "@localbrain/shared";

type Props = {
  events: WorkspaceEvent[];
};

export function WorkspaceEventTimeline({ events }: Props) {
  return (
    <section className="workspace-card">
      <h2>Timeline</h2>
      <p className="workspace-card__muted">Event-driven history — audit trail for CoS and AI summaries.</p>
      <ol className="workspace-timeline">
        {events.map((ev) => (
          <li key={ev.id} className="workspace-timeline__item">
            <span className="workspace-timeline__type">{ev.event_type.replace(/_/g, " ")}</span>
            <strong>{ev.title}</strong>
            {ev.detail ? <p>{ev.detail}</p> : null}
            <time className="workspace-timeline__time">{ev.created_at}</time>
          </li>
        ))}
      </ol>
    </section>
  );
}
