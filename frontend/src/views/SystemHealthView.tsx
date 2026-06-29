import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SystemHealthResponse } from "@localbrain/shared";
import { fetchSystemHealth } from "../api/system";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="system-health__panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function SystemHealthView() {
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      setHealth(await fetchSystemHealth());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load system health");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 20_000);
    return () => window.clearInterval(id);
  }, [load]);

  if (loading && !health) {
    return (
      <div className="system-health">
        <p>Loading system health…</p>
      </div>
    );
  }

  if (error && !health) {
    return (
      <div className="system-health">
        <p className="system-health__error">{error}</p>
      </div>
    );
  }

  if (!health) return null;

  const score = health.operational_health_score;

  return (
    <div className="system-health">
      <ExecutiveQuestionShell route="/system" observedAt={health.observed_at} />

      <header className="system-health__header">
        <h1>System Health &amp; Operations Center</h1>
        <p className="system-health__meta">
          Read-only · observe &amp; display · LB-OS-011 · Updated {new Date(health.observed_at).toLocaleTimeString()}
        </p>
        <div
          className={`system-health__score system-health__score--${score.label}`}
          role="status"
        >
          <span className="system-health__score-value">{score.score}</span>
          <span className="system-health__score-label">Operational Health</span>
          <p className="system-health__score-summary">{score.summary}</p>
        </div>
      </header>

      <div className="system-health__grid">
        <Panel title="Machine">
          <dl className="system-health__dl">
            <dt>CPU</dt>
            <dd>{health.machine.cpu_percent !== null ? `${health.machine.cpu_percent}%` : "Sampling…"}</dd>
            <dt>RAM</dt>
            <dd>
              {health.machine.ram_used_percent}% ({formatBytes(health.machine.ram_used_bytes)} /{" "}
              {formatBytes(health.machine.ram_total_bytes)})
            </dd>
            <dt>Uptime</dt>
            <dd>{formatUptime(health.machine.uptime_seconds)}</dd>
            <dt>Host</dt>
            <dd>{health.machine.hostname}</dd>
            <dt>Platform</dt>
            <dd>{health.machine.platform}</dd>
          </dl>
        </Panel>

        <Panel title="Storage">
          <dl className="system-health__dl">
            {health.storage.volumes.map((v) => (
              <div key={v.label} className="system-health__volume-row">
                <span className="system-health__volume-label">Disk {v.label}</span>
                <span>
                  {v.available && v.used_percent !== null
                    ? `${v.used_percent}% used · ${formatBytes(v.free_bytes)} free`
                    : "Unavailable"}
                </span>
              </div>
            ))}
            <dt>Registry assets</dt>
            <dd>{health.storage.registry_asset_count.toLocaleString()}</dd>
            <dt>Index freshness</dt>
            <dd>{health.storage.index_freshness}</dd>
            <dt>Last index</dt>
            <dd>{health.storage.latest_index_at ?? "—"}</dd>
          </dl>
        </Panel>

        <Panel title="AI usage">
          <p className="system-health__link-row">
            <Link to="/system/providers">Open AI Providers →</Link>
          </p>
          <dl className="system-health__dl">
            <dt>Provider</dt>
            <dd>{health.ai.primary_provider_label || health.ai.provider}</dd>
            <dt>Model</dt>
            <dd>{health.ai.model}</dd>
            <dt>API status</dt>
            <dd>{health.ai.api_status}</dd>
            <dt>Tokens today</dt>
            <dd>{health.ai.tokens_today.toLocaleString()}</dd>
            <dt>Est. cost today</dt>
            <dd>${health.ai.estimated_cost_usd_today.toFixed(2)}</dd>
            <dt>Commands today</dt>
            <dd>{health.ai.command_count_today}</dd>
          </dl>
        </Panel>

        <Panel title="Operations">
          <dl className="system-health__dl">
            <dt>Indexing</dt>
            <dd>{health.operations.indexing_active ? "Active" : "Idle"}</dd>
            <dt>Last index status</dt>
            <dd>{health.operations.latest_index_status ?? "—"}</dd>
            <dt>Pending approvals</dt>
            <dd>{health.operations.pending_approvals}</dd>
            <dt>Approved (not executed)</dt>
            <dd>{health.operations.approved_pending_execution}</dd>
            <dt>Failed actions</dt>
            <dd>{health.operations.failed_actions}</dd>
            <dt>Backups on record</dt>
            <dd>{health.operations.backup_count}</dd>
          </dl>
        </Panel>

        <Panel title="Build progress">
          <p className="system-health__link-row">
            Slice status and gate live on Program Office — authoritative for EQ-002.
          </p>
          <p className="system-health__link-row">
            <Link to="/program-office">How is the build progressing? →</Link>
          </p>
        </Panel>
      </div>
    </div>
  );
}
