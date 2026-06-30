import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { BrainOwnerType, ExecutiveOfficeType, PrivacyTier } from "@localbrain/shared";
import { BRAIN_PRODUCT_RULE } from "@localbrain/shared";
import { LiveSurfaceBanner } from "../components/LiveSurfaceBanner";
import {
  completeOnboarding,
  fetchOnboarding,
  saveOnboardingStep,
} from "../api/settings";

const OWNER_OPTIONS: { value: BrainOwnerType; label: string }[] = [
  { value: "steve", label: "Steve" },
  { value: "kelly", label: "Kelly" },
  { value: "chris", label: "Chris" },
  { value: "organization", label: "Organization" },
  { value: "custom", label: "Custom / Other" },
];

const OFFICE_TYPES: { value: ExecutiveOfficeType; label: string }[] = [
  { value: "personal", label: "Personal Executive Office" },
  { value: "campaign", label: "Campaign" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "organization", label: "Organization" },
  { value: "custom", label: "Custom" },
];

const DEPARTMENT_OPTIONS = [
  "Chief of Staff",
  "Communications",
  "Engineering",
  "Knowledge Explorer",
  "Campaign",
  "Finance",
];

const STEPS = [
  "Who is this brain for?",
  "Provider keys",
  "Connector readiness",
  "Profile & office",
  "Package & finish",
];

export function OnboardingWizardView() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [ownerType, setOwnerType] = useState<BrainOwnerType>("custom");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("Executive");
  const [mission, setMission] = useState("");
  const [officeType, setOfficeType] = useState<ExecutiveOfficeType>("personal");
  const [departments, setDepartments] = useState<string[]>([
    "Chief of Staff",
    "Communications",
    "Engineering",
    "Knowledge Explorer",
  ]);
  const [privacyTier, setPrivacyTier] = useState<PrivacyTier>(1);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchOnboarding();
      if (data.onboarding.completed) {
        setCompleted(true);
        setStep(data.onboarding.total_steps - 1);
      } else {
        setStep(data.onboarding.current_step);
      }
      setOwnerType(data.profile.owner_type);
      setDisplayName(data.profile.display_name);
      setRole(data.profile.role);
      setMission(data.profile.primary_mission);
      setOfficeType(data.profile.executive_office_type);
      setDepartments(data.profile.departments_enabled);
      setPrivacyTier(data.profile.default_privacy_tier);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load onboarding");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function goTo(next: number) {
    setBusy(true);
    try {
      await saveOnboardingStep(next);
      setStep(next);
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    setBusy(true);
    try {
      await completeOnboarding({
        owner_type: ownerType,
        display_name: displayName.trim() || "New Executive Office",
        role: role.trim() || "Executive",
        primary_mission: mission.trim(),
        executive_office_type: officeType,
        departments_enabled: departments,
        default_privacy_tier: privacyTier,
      });
      setCompleted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to complete onboarding");
    } finally {
      setBusy(false);
    }
  }

  function toggleDepartment(name: string) {
    setDepartments((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name],
    );
  }

  if (error && !displayName) {
    return (
      <article className="prod-settings">
        <p className="prod-settings__error">{error}</p>
      </article>
    );
  }

  return (
    <article className="prod-settings prod-onboarding">
      <LiveSurfaceBanner route="/settings/onboarding" />
      <header className="prod-settings__header">
        <p className="prod-settings__crumb">
          <Link to="/settings">Settings</Link> / Instance Setup Wizard
        </p>
        <h1>Instance Setup Wizard</h1>
        <p className="prod-settings__meta">
          LB-OS-PROD-001 · ENG-INST-001 · Empty brain onboarding · no personal data ingestion
        </p>
        <p className="prod-settings__rule">{BRAIN_PRODUCT_RULE}</p>
      </header>

      <ol className="prod-onboarding__steps">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={
              i === step ? "prod-onboarding__step prod-onboarding__step--active" : "prod-onboarding__step"
            }
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {completed ? (
        <section className="prod-onboarding__panel">
          <h2>Onboarding complete</h2>
          <p>This LocalBrain instance is configured as an empty installable brain.</p>
          <div className="prod-settings__actions">
            <Link to="/settings/instance" className="prod-settings__btn">
              Instance profile
            </Link>
            <Link to="/settings/providers" className="prod-settings__btn prod-settings__btn--secondary">
              Provider vault
            </Link>
            <button type="button" className="prod-settings__btn" onClick={() => navigate("/")}>
              Open Executive Office
            </button>
          </div>
        </section>
      ) : (
        <>
          {step === 0 && (
            <section className="prod-onboarding__panel">
              <h2>Who is this brain for?</h2>
              <p>Select the owner archetype. Each person gets an isolated instance — memory, keys, office, permissions.</p>
              <div className="prod-onboarding__choices">
                {OWNER_OPTIONS.map((opt) => (
                  <label key={opt.value} className="prod-onboarding__choice">
                    <input
                      type="radio"
                      name="owner"
                      checked={ownerType === opt.value}
                      onChange={() => {
                        setOwnerType(opt.value);
                        if (opt.value !== "custom" && opt.value !== "organization") {
                          setDisplayName(`${opt.label}'s Executive Office`);
                        } else if (opt.value === "organization") {
                          setDisplayName("Organization Executive Office");
                        }
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="prod-onboarding__panel">
              <h2>API key settings vault</h2>
              <p>
                Configure provider keys in the encrypted vault before any ingestion. Keys never leave this machine
                unencrypted.
              </p>
              <ul className="prod-settings__list">
                <li>OpenAI · Anthropic · Google (AI)</li>
                <li>Twilio · SendGrid · Census · BLS — reserved post-Convention</li>
              </ul>
              <Link to="/settings/providers" className="prod-settings__btn">
                Open provider vault →
              </Link>
            </section>
          )}

          {step === 2 && (
            <section className="prod-onboarding__panel">
              <h2>Connector readiness</h2>
              <p>Review connected, missing, invalid, and reserved connectors before enabling departments.</p>
              <Link to="/settings/providers#readiness" className="prod-settings__btn">
                View connector readiness →
              </Link>
            </section>
          )}

          {step === 3 && (
            <section className="prod-onboarding__panel">
              <h2>Profile &amp; office setup</h2>
              <div className="prod-form">
                <label>
                  Display name
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </label>
                <label>
                  Role
                  <input value={role} onChange={(e) => setRole(e.target.value)} />
                </label>
                <label>
                  Primary mission
                  <textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={3} />
                </label>
                <label>
                  Executive office type
                  <select
                    value={officeType}
                    onChange={(e) => setOfficeType(e.target.value as ExecutiveOfficeType)}
                  >
                    {OFFICE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <fieldset>
                  <legend>Departments enabled</legend>
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <label key={d} className="prod-onboarding__check">
                      <input
                        type="checkbox"
                        checked={departments.includes(d)}
                        onChange={() => toggleDepartment(d)}
                      />
                      {d}
                    </label>
                  ))}
                </fieldset>
                <label>
                  Default privacy tier
                  <select
                    value={privacyTier}
                    onChange={(e) => setPrivacyTier(Number(e.target.value) as PrivacyTier)}
                  >
                    <option value={0}>0 — Never leaves machine</option>
                    <option value={1}>1 — Local model only</option>
                    <option value={2}>2 — Redacted external</option>
                    <option value={3}>3 — Public-safe</option>
                  </select>
                </label>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="prod-onboarding__panel">
              <h2>Package &amp; deploy mode</h2>
              <p>This instance ships as an <strong>empty brain</strong> — no Steve/Kelly/Chris personal data.</p>
              <ul className="prod-settings__list">
                <li>Install new LocalBrain — current flow</li>
                <li>Clone template — reserved</li>
                <li>Export / import config — available on Instance settings</li>
              </ul>
              <p className="prod-settings__note">
                Multi-brain workspace sharing (LocalBrain-to-LocalBrain spoke, CoS update packets) is reserved at
                LB-OS-027.1 — not built in this slice.
              </p>
            </section>
          )}

          <div className="prod-settings__actions">
            {step > 0 && (
              <button type="button" className="prod-settings__btn prod-settings__btn--secondary" disabled={busy} onClick={() => void goTo(step - 1)}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" className="prod-settings__btn" disabled={busy} onClick={() => void goTo(step + 1)}>
                Continue
              </button>
            ) : (
              <button type="button" className="prod-settings__btn" disabled={busy} onClick={() => void finish()}>
                Complete setup
              </button>
            )}
          </div>
        </>
      )}

      {error && <p className="prod-settings__error">{error}</p>}
    </article>
  );
}
