import type {
  BrainInstanceExportBundle,
  BrainInstanceOverview,
  BrainInstanceProfile,
  ConnectorReadinessReport,
  OnboardingState,
  UpdateBrainInstanceProfileRequest,
} from "@localbrain/shared";
import type { AIProvidersOverview } from "@localbrain/shared";

const API = "/api";

export interface SettingsProvidersResponse {
  readiness: ConnectorReadinessReport;
  ai_providers: AIProvidersOverview;
  observed_at: string;
}

export interface OnboardingResponse {
  onboarding: OnboardingState;
  profile: BrainInstanceProfile;
  observed_at: string;
}

export async function fetchInstanceOverview(): Promise<BrainInstanceOverview> {
  const res = await fetch(`${API}/settings/instance`);
  if (!res.ok) throw new Error("Failed to load instance settings");
  return res.json() as Promise<BrainInstanceOverview>;
}

export async function updateInstanceProfile(
  patch: UpdateBrainInstanceProfileRequest,
): Promise<{ profile: BrainInstanceProfile; observed_at: string }> {
  const res = await fetch(`${API}/settings/instance`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to update instance");
  }
  return res.json() as Promise<{ profile: BrainInstanceProfile; observed_at: string }>;
}

export async function fetchOnboarding(): Promise<OnboardingResponse> {
  const res = await fetch(`${API}/settings/onboarding`);
  if (!res.ok) throw new Error("Failed to load onboarding");
  return res.json() as Promise<OnboardingResponse>;
}

export async function saveOnboardingStep(step: number): Promise<OnboardingState> {
  const res = await fetch(`${API}/settings/onboarding/step`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step }),
  });
  if (!res.ok) throw new Error("Failed to save onboarding step");
  const data = (await res.json()) as { onboarding: OnboardingState };
  return data.onboarding;
}

export async function completeOnboarding(
  profile?: UpdateBrainInstanceProfileRequest,
): Promise<OnboardingResponse> {
  const res = await fetch(`${API}/settings/onboarding/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to complete onboarding");
  }
  return res.json() as Promise<OnboardingResponse & { profile: BrainInstanceProfile }>;
}

export async function resetOnboarding(): Promise<OnboardingState> {
  const res = await fetch(`${API}/settings/onboarding/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset onboarding");
  const data = (await res.json()) as { onboarding: OnboardingState };
  return data.onboarding;
}

export async function fetchSettingsProviders(): Promise<SettingsProvidersResponse> {
  const res = await fetch(`${API}/settings/providers`);
  if (!res.ok) throw new Error("Failed to load provider settings");
  return res.json() as Promise<SettingsProvidersResponse>;
}

export async function exportInstanceConfig(): Promise<BrainInstanceExportBundle> {
  const res = await fetch(`${API}/settings/instance/export`);
  if (!res.ok) throw new Error("Failed to export config");
  return res.json() as Promise<BrainInstanceExportBundle>;
}

export async function importInstanceConfig(
  bundle: BrainInstanceExportBundle,
): Promise<{ profile: BrainInstanceProfile; imported_at: string }> {
  const res = await fetch(`${API}/settings/instance/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bundle),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to import config");
  }
  return res.json() as Promise<{ profile: BrainInstanceProfile; imported_at: string }>;
}
