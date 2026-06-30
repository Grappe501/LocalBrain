import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { ExecutiveOfficeType, PrivacyTier } from "@localbrain/shared";
import { BRAIN_PRODUCT_RULE } from "@localbrain/shared";
import { LiveSurfaceBanner } from "../components/LiveSurfaceBanner";
import {
  exportInstanceConfig,
  fetchInstanceOverview,
  importInstanceConfig,
  updateInstanceProfile,
} from "../api/settings";

const OFFICE_TYPES: { value: ExecutiveOfficeType; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "campaign", label: "Campaign" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "organization", label: "Organization" },
  { value: "custom", label: "Custom" },
];

export function InstanceSettingsView() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [instanceId, setInstanceId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [mission, setMission] = useState("");
  const [officeType, setOfficeType] = useState<ExecutiveOfficeType>("personal");
  const [departments, setDepartments] = useState("");
  const [privacyTier, setPrivacyTier] = useState<PrivacyTier>(1);
  const [packageMode, setPackageMode] = useState<"empty_brain" | "seeded_dev">("empty_brain");
  const [vaultActive, setVaultActive] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const overview = await fetchInstanceOverview();
      const p = overview.profile;
      setInstanceId(p.instance_id);
      setDisplayName(p.display_name);
      setRole(p.role);
      setMission(p.primary_mission);
      setOfficeType(p.executive_office_type);
      setDepartments(p.departments_enabled.join(", "));
      setPrivacyTier(p.default_privacy_tier);
      setPackageMode(overview.package_mode);
      setVaultActive(overview.vault_active);
      setOnboardingDone(overview.onboarding.completed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load instance");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      await updateInstanceProfile({
        display_name: displayName.trim(),
        role: role.trim(),
        primary_mission: mission.trim(),
        executive_office_type: officeType,
        departments_enabled: departments
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        default_privacy_tier: privacyTier,
      });
      setMessage("Instance profile saved.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleExport() {
    setBusy(true);
    setMessage(null);
    try {
      const bundle = await exportInstanceConfig();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `localbrain-config-${instanceId.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Config exported (no secrets).");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleImportFile(file: File) {
    setBusy(true);
    setMessage(null);
    try {
      const text = await file.text();
      const bundle = JSON.parse(text) as Parameters<typeof importInstanceConfig>[0];
      await importInstanceConfig(bundle);
      setMessage("Config imported (profile only — keys remain in vault).");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="prod-settings">
      <LiveSurfaceBanner route="/settings/instance" />
      <header className="prod-settings__header">
        <p className="prod-settings__crumb">
          <Link to="/settings">Settings</Link> / Instance
        </p>
        <h1>Instance Profile &amp; Package</h1>
        <p className="prod-settings__meta">
          LB-OS-PROD-001 · Instance ID {instanceId || "…"} · Package mode: {packageMode}
        </p>
        <p className="prod-settings__rule">{BRAIN_PRODUCT_RULE}</p>
      </header>

      {!onboardingDone && (
        <p className="prod-settings__banner">
          Onboarding not complete —{" "}
          <Link to="/settings/onboarding">Run setup wizard →</Link>
        </p>
      )}

      <section className="prod-settings__section">
        <h2>Executive office profile</h2>
        <div className="prod-form">
          <label>
            Display name
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={busy} />
          </label>
          <label>
            Role
            <input value={role} onChange={(e) => setRole(e.target.value)} disabled={busy} />
          </label>
          <label>
            Primary mission
            <textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={3} disabled={busy} />
          </label>
          <label>
            Executive office type
            <select
              value={officeType}
              onChange={(e) => setOfficeType(e.target.value as ExecutiveOfficeType)}
              disabled={busy}
            >
              {OFFICE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Departments enabled (comma-separated)
            <input value={departments} onChange={(e) => setDepartments(e.target.value)} disabled={busy} />
          </label>
          <label>
            Default privacy tier
            <select
              value={privacyTier}
              onChange={(e) => setPrivacyTier(Number(e.target.value) as PrivacyTier)}
              disabled={busy}
            >
              <option value={0}>0 — Never leaves machine</option>
              <option value={1}>1 — Local model only</option>
              <option value={2}>2 — Redacted external</option>
              <option value={3}>3 — Public-safe</option>
            </select>
          </label>
        </div>
        <button type="button" className="prod-settings__btn" disabled={busy} onClick={() => void save()}>
          Save profile
        </button>
      </section>

      <section className="prod-settings__section">
        <h2>Package / deploy mode</h2>
        <dl className="prod-settings__dl">
          <dt>Mode</dt>
          <dd>{packageMode === "empty_brain" ? "Empty brain (sellable boundary)" : "Seeded dev instance"}</dd>
          <dt>Vault secret</dt>
          <dd>{vaultActive ? "LOCALBRAIN_VAULT_SECRET set" : "Dev default (set LOCALBRAIN_VAULT_SECRET for production)"}</dd>
          <dt>Personal data</dt>
          <dd>None — ingestion reserved until productization gate passes</dd>
        </dl>
        <ul className="prod-settings__list prod-settings__list--muted">
          <li>Install new LocalBrain — active</li>
          <li>Clone template — reserved (LB-OS-027.0)</li>
          <li>Create new instance — reserved (multi-tenant)</li>
        </ul>
      </section>

      <section className="prod-settings__section">
        <h2>Export / import config</h2>
        <p className="prod-settings__note">Exports profile, departments, and provider enable flags only — never API keys.</p>
        <div className="prod-settings__actions">
          <button type="button" className="prod-settings__btn" disabled={busy} onClick={() => void handleExport()}>
            Export config JSON
          </button>
          <button
            type="button"
            className="prod-settings__btn prod-settings__btn--secondary"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            Import config JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </section>

      {message && <p className="prod-settings__success">{message}</p>}
      {error && <p className="prod-settings__error">{error}</p>}
    </article>
  );
}
