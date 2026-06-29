import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AIProvidersOverview, AIFlightRecordPublic } from "@localbrain/shared";
import {
  fetchFlightLog,
  fetchProvidersOverview,
  saveProviderCredential,
  updateProvider,
  verifyProvider,
} from "../api/providers";
import { ProviderCard } from "../components/ProviderCard";
import { LiveSurfaceBanner } from "../components/LiveSurfaceBanner";

export function AiProvidersView() {
  const [overview, setOverview] = useState<AIProvidersOverview | null>(null);
  const [flight, setFlight] = useState<AIFlightRecordPublic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [providers, records] = await Promise.all([
        fetchProvidersOverview(),
        fetchFlightLog(25),
      ]);
      setOverview(providers);
      setFlight(records);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load providers");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error && !overview) {
    return (
      <div className="ai-providers">
        <p className="ai-providers__error">{error}</p>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="ai-providers">
        <p>Loading AI providers…</p>
      </div>
    );
  }

  return (
    <div className="ai-providers">
      <LiveSurfaceBanner route="/system/providers" />

      <header className="ai-providers__header">
        <p className="ai-providers__crumb">
          <Link to="/system">System</Link> / AI Providers
        </p>
        <h1>AI Provider Management</h1>
        <p className="ai-providers__meta">
          LB-OS-017 · Capability routing · encrypted credentials · flight recorder ·{" "}
          {overview.any_configured ? "configured" : "not configured"}
        </p>
        <p className="ai-providers__rule">
          Chief of Staff → Capability Router → AI Provider Manager → Provider Adapter → vendor
        </p>
        <p className="ai-providers__eq-link">
          Machine and ops health: <Link to="/system">How healthy is my system? (EQ-003)</Link>
        </p>
      </header>

      <div className="ai-providers__grid">
        {overview.providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            busy={busy}
            onToggle={async (enabled) => {
              setBusy(true);
              try {
                await updateProvider(provider.id, { enabled });
                await load();
              } finally {
                setBusy(false);
              }
            }}
            onSaveKey={async (apiKey) => {
              setBusy(true);
              try {
                await saveProviderCredential(provider.id, apiKey);
                await load();
              } finally {
                setBusy(false);
              }
            }}
            onVerify={async () => {
              setBusy(true);
              try {
                await verifyProvider(provider.id);
                await load();
              } finally {
                setBusy(false);
              }
            }}
          />
        ))}
      </div>

      <section className="ai-providers__flight">
        <h2>AI Flight Recorder</h2>
        <p className="ai-providers__meta">Recent routed requests — capability, provider, cost, latency</p>
        {flight.length === 0 ? (
          <p>No flight records yet.</p>
        ) : (
          <table className="ai-providers__table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Capability</th>
                <th>Provider</th>
                <th>Model</th>
                <th>Tokens</th>
                <th>Cost</th>
                <th>Latency</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {flight.map((row) => (
                <tr key={row.id}>
                  <td>{new Date(row.created_at).toLocaleTimeString()}</td>
                  <td>{row.capability}</td>
                  <td>{row.provider_id}</td>
                  <td>{row.model_id}</td>
                  <td>{row.total_tokens ?? "—"}</td>
                  <td>
                    {row.estimated_cost_usd !== null ? `$${row.estimated_cost_usd.toFixed(4)}` : "—"}
                  </td>
                  <td>{row.latency_ms} ms</td>
                  <td className="ai-providers__reason">{row.routing_reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
