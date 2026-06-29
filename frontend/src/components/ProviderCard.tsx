import type { AIProviderPublic } from "@localbrain/shared";

function healthBadge(health: AIProviderPublic["health"]): string {
  switch (health) {
    case "healthy":
      return "🟢";
    case "degraded":
      return "🟡";
    case "rate_limited":
      return "🟠";
    case "offline":
      return "🔴";
    default:
      return "⚪";
  }
}

type Props = {
  provider: AIProviderPublic;
  onToggle: (enabled: boolean) => void;
  onSaveKey: (apiKey: string) => Promise<void>;
  onVerify: () => Promise<void>;
  busy: boolean;
};

export function ProviderCard({ provider, onToggle, onSaveKey, onVerify, busy }: Props) {
  return (
    <article className="provider-card">
      <header className="provider-card__header">
        <h3>
          {healthBadge(provider.health)} {provider.label}
        </h3>
        <label className="provider-card__toggle">
          <input
            type="checkbox"
            checked={provider.enabled}
            disabled={busy}
            onChange={(e) => onToggle(e.target.checked)}
          />
          Enabled
        </label>
      </header>

      <dl className="provider-card__dl">
        <dt>Credential</dt>
        <dd>{provider.credential_status}</dd>
        <dt>Default model</dt>
        <dd>{provider.default_model ?? "—"}</dd>
        <dt>Health</dt>
        <dd>{provider.health}</dd>
        <dt>Latency (p50)</dt>
        <dd>{provider.latency_p50_ms !== null ? `${provider.latency_p50_ms} ms` : "—"}</dd>
        <dt>Monthly spend</dt>
        <dd>${provider.monthly_spend_usd.toFixed(2)}</dd>
        <dt>Capabilities</dt>
        <dd>{provider.capabilities.join(", ") || "—"}</dd>
      </dl>

      <form
        className="provider-card__credential"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const key = String(fd.get("api_key") ?? "").trim();
          if (!key) return;
          void onSaveKey(key).then(() => {
            e.currentTarget.reset();
          });
        }}
      >
        <label>
          API key
          <input
            name="api_key"
            type="password"
            autoComplete="off"
            placeholder={provider.credential_status === "configured" ? "Replace key…" : "Paste key…"}
            disabled={busy}
          />
        </label>
        <div className="provider-card__actions">
          <button type="submit" disabled={busy}>
            Save credential
          </button>
          <button type="button" disabled={busy} onClick={() => void onVerify()}>
            Verify connection
          </button>
        </div>
        <p className="provider-card__note">Keys are encrypted at rest and never shown after save.</p>
      </form>
    </article>
  );
}
