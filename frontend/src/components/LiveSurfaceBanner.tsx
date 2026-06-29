import { useEffect, useState } from "react";
import type { LiveSurfaceEntry } from "@localbrain/shared";
import { fetchSurfaceAudit, matchSurface } from "../api/liveSurface";

type Props = {
  route: string;
  observedAt?: string;
};

function modeLabel(mode: LiveSurfaceEntry["mode"]): string {
  if (mode === "live") return "Live";
  if (mode === "partial") return "Partially live";
  return "Planned stub";
}

export function LiveSurfaceBanner({ route, observedAt }: Props) {
  const [surface, setSurface] = useState<LiveSurfaceEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchSurfaceAudit()
      .then((surfaces) => {
        if (!cancelled) setSurface(matchSurface(surfaces, route) ?? null);
      })
      .catch(() => {
        if (!cancelled) setSurface(null);
      });
    return () => {
      cancelled = true;
    };
  }, [route]);

  if (!surface) return null;

  const freshness = observedAt
    ? `Updated ${new Date(observedAt).toLocaleTimeString()}`
    : "Live projection";

  return (
    <aside className={`live-surface live-surface--${surface.mode}`} aria-label="Data freshness">
      <span className={`live-surface__badge live-surface__badge--${surface.mode}`}>
        {modeLabel(surface.mode)}
      </span>
      <span className="live-surface__meta">
        {surface.slice_id} · {freshness} · Sources: {surface.data_sources.slice(0, 2).join(", ")}
        {surface.data_sources.length > 2 ? "…" : ""}
      </span>
      {surface.stub_sections.length > 0 ? (
        <ul className="live-surface__stubs">
          {surface.stub_sections.map((s) => (
            <li key={s.label}>
              <strong>{s.label}</strong> — {s.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
