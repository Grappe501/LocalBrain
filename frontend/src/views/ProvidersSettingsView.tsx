import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ConnectorReadinessStatus } from "@localbrain/shared";
import { LiveSurfaceBanner } from "../components/LiveSurfaceBanner";
import { ProviderCard } from "../components/ProviderCard";
import { fetchSettingsProviders } from "../api/settings";
import {
  saveProviderCredential,
  updateProvider,
  verifyProvider,
} from "../api/providers";

function statusBadge(status: ConnectorReadinessStatus): string {
  switch (status) {
    case "connected":
      return "🟢 Connected";
    case "needs_test":
      return "🟡 Needs test";
    case "missing":
      return "⚪ Missing";
    case "invalid":
      return "🔴 Invalid";
    case "reserved":
      return "🔒 Reserved";
    default:
      return status;
  }
}

export function ProvidersSettingsView() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSettingsProviders>> | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await fetchSettingsProviders());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load providers");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error && !data) {
    return (
      <article className="prod-settings">
        <p className="prod-settings__error">{error}</p>
      </article>
    );
  }

  if (!data) {
    return (
      <article className="prod-settings">
        <p>Loading provider vault…</p>
      </article>
    );
  }

  const { readiness, ai_providers: overview } = data;

  return (
    <article className="prod-settings prod-providers">
      <LiveSurfaceBanner route="/settings/providers" />
      <header className="prod-settings__header">
        <p className="prod-settings__crumb">
          <Link to="/settings">Settings</Link> / Provider Vault
        </p>
        <h1>API Key Settings Vault</h1>
        <p className="prod-settings__meta">
          LB-OS-PROD-001 · AES-256-GCM encrypted credentials · {overview.any_configured ? "configured" : "not configured"}
        </p>
        <p className="prod-settings__rule">
          Chief of Staff → Capability Router → Provider vault → adapter. ENC → DPEC → connector for all future ingestion.
        </p>
        <p className="prod-settings__note">
          Legacy route: <Link to="/system/providers">System / AI Providers</Link> (same vault)
        </p>
      </header>

      <section id="readiness" className="prod-settings__section">
        <h2>Connector readiness</h2>
        <p className="prod-settings__meta">
          {readiness.connected_count} connected · {readiness.missing_count} missing · {readiness.reserved_count}{" "}
          reserved
        </p>
        <table className="prod-readiness__table">
          <thead>
            <tr>
              <th>Connector</th>
              <th>Category</th>
              <th>Status</th>
              <th>Detail</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {readiness.connectors.map((c) => (
              <tr key={c.connector_id}>
                <td>{c.label}</td>
                <td>{c.category}</td>
                <td>{statusBadge(c.status)}</td>
                <td className="prod-readiness__detail">{c.detail}</td>
                <td>
                  {c.settings_route && c.status !== "reserved" ? (
                    <Link to={c.settings_route}>Configure</Link>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="prod-settings__section">
        <h2>AI providers (encrypted vault)</h2>
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
      </section>

      <section className="prod-settings__section prod-settings__section--muted">
        <h2>Reserved providers</h2>
        <ul className="prod-settings__list">
          <li>Twilio · SendGrid — communications (post-Convention)</li>
          <li>Google Workspace — Gmail, Calendar, Drive ingestion (CAP-FUT-GAC/GML/CAL)</li>
          <li>Census · BLS — data intelligence connectors</li>
          <li>ChatGPT export · local filesystem · reputation monitor — ingestion arc post-Memory OS gate</li>
        </ul>
      </section>

      {error && <p className="prod-settings__error">{error}</p>}
    </article>
  );
}
