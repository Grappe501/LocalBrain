import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSystemUsage } from "../api/system";

const POLL_MS = 20_000;

export function SystemStatusDock() {
  const [usage, setUsage] = useState<(Awaited<ReturnType<typeof fetchSystemUsage>> | null)>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchSystemUsage();
      setUsage(data);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  const attention = usage?.attention_needed ?? error;
  const dockLine =
    usage?.dock_line ??
    (error ? "System metrics unavailable" : "Loading system status…");

  return (
    <Link
      to="/system"
      className={`system-dock ${attention ? "system-dock--attention" : ""}`}
      title="Open System Health & Operations Center (read-only)"
      aria-label="System status dock — open health center"
    >
      {usage?.indexing ? (
        <span className="system-dock__badge" aria-hidden>
          indexing
        </span>
      ) : null}
      {usage && usage.pending_approvals > 0 ? (
        <span className="system-dock__badge system-dock__badge--approvals" aria-hidden>
          {usage.pending_approvals} pending
        </span>
      ) : null}
      <span className="system-dock__line">{dockLine}</span>
    </Link>
  );
}
