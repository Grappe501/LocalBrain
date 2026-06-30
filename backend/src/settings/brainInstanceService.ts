import { randomUUID } from "node:crypto";
import {
  BRAIN_INSTANCE_ENGINE_ID,
  BRAIN_PRODUCT_RULE,
  PRODUCTIZATION_SLICE_ID,
  type BrainInstanceExportBundle,
  type BrainInstanceOverview,
  type BrainInstanceProfile,
  type BrainOwnerType,
  type ExecutiveOfficeType,
  type OnboardingState,
  type PrivacyTier,
  type UpdateBrainInstanceProfileRequest,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import { getProvidersOverview } from "../providers/manager.js";
import { isVaultConfigured } from "../providers/vault.js";

const PROFILE_KEY = "brain_instance_profile";
const ONBOARDING_KEY = "brain_onboarding";

const DEFAULT_DEPARTMENTS = [
  "Chief of Staff",
  "Communications",
  "Engineering",
  "Knowledge Explorer",
];

function readSetting(key: string): string | null {
  const row = getDatabase()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

function writeSetting(key: string, value: string): void {
  getDatabase()
    .prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .run(key, value);
}

function defaultProfile(): BrainInstanceProfile {
  const now = new Date().toISOString();
  return {
    instance_id: randomUUID(),
    owner_type: "custom",
    display_name: "New Executive Office",
    role: "Executive",
    primary_mission: "",
    executive_office_type: "personal",
    departments_enabled: [...DEFAULT_DEPARTMENTS],
    default_privacy_tier: 1,
    created_at: now,
    updated_at: now,
  };
}

export function getBrainInstanceProfile(): BrainInstanceProfile {
  const raw = readSetting(PROFILE_KEY);
  if (!raw) {
    const profile = defaultProfile();
    writeSetting(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }
  return JSON.parse(raw) as BrainInstanceProfile;
}

export function updateBrainInstanceProfile(
  patch: UpdateBrainInstanceProfileRequest,
): BrainInstanceProfile {
  const current = getBrainInstanceProfile();
  const updated: BrainInstanceProfile = {
    ...current,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  writeSetting(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}

export function getOnboardingState(): OnboardingState {
  const raw = readSetting(ONBOARDING_KEY);
  if (!raw) {
    return { completed: false, completed_at: null, current_step: 0, total_steps: 5 };
  }
  return JSON.parse(raw) as OnboardingState;
}

export function saveOnboardingProgress(step: number): OnboardingState {
  const state = getOnboardingState();
  const next = { ...state, current_step: Math.max(0, Math.min(step, state.total_steps - 1)) };
  writeSetting(ONBOARDING_KEY, JSON.stringify(next));
  return next;
}

export function completeOnboarding(profilePatch?: UpdateBrainInstanceProfileRequest): OnboardingState {
  if (profilePatch) updateBrainInstanceProfile(profilePatch);
  const state: OnboardingState = {
    completed: true,
    completed_at: new Date().toISOString(),
    current_step: 4,
    total_steps: 5,
  };
  writeSetting(ONBOARDING_KEY, JSON.stringify(state));
  return state;
}

export function resetOnboarding(): OnboardingState {
  const state: OnboardingState = {
    completed: false,
    completed_at: null,
    current_step: 0,
    total_steps: 5,
  };
  writeSetting(ONBOARDING_KEY, JSON.stringify(state));
  return state;
}

export function getBrainInstanceOverview(): BrainInstanceOverview {
  const profile = getBrainInstanceProfile();
  const onboarding = getOnboardingState();
  const displayName = profile.display_name.trim().toLowerCase();
  const package_mode =
    displayName === "new executive office" && !onboarding.completed ? "empty_brain" : "seeded_dev";

  return {
    slice_id: PRODUCTIZATION_SLICE_ID,
    engine_id: BRAIN_INSTANCE_ENGINE_ID,
    profile,
    onboarding,
    vault_active: isVaultConfigured(),
    product_rule: BRAIN_PRODUCT_RULE,
    package_mode,
    observed_at: new Date().toISOString(),
  };
}

export function exportBrainInstanceConfig(): BrainInstanceExportBundle {
  const profile = getBrainInstanceProfile();
  const onboarding = getOnboardingState();
  const providers = getProvidersOverview();

  return {
    export_version: 1,
    exported_at: new Date().toISOString(),
    profile: {
      owner_type: profile.owner_type,
      display_name: profile.display_name,
      role: profile.role,
      primary_mission: profile.primary_mission,
      executive_office_type: profile.executive_office_type,
      departments_enabled: profile.departments_enabled,
      default_privacy_tier: profile.default_privacy_tier,
    },
    departments_enabled: profile.departments_enabled,
    provider_flags: providers.providers.map((p) => ({
      provider_id: p.id,
      enabled: p.enabled,
    })),
    onboarding_completed: onboarding.completed,
  };
}

export function importBrainInstanceConfig(bundle: BrainInstanceExportBundle): BrainInstanceProfile {
  if (bundle.export_version !== 1) {
    throw new Error("Unsupported export version");
  }
  return updateBrainInstanceProfile({
    owner_type: bundle.profile.owner_type,
    display_name: bundle.profile.display_name,
    role: bundle.profile.role,
    primary_mission: bundle.profile.primary_mission,
    executive_office_type: bundle.profile.executive_office_type,
    departments_enabled: bundle.departments_enabled,
    default_privacy_tier: bundle.profile.default_privacy_tier,
  });
}

export { BRAIN_INSTANCE_ENGINE_ID, PRODUCTIZATION_SLICE_ID };
