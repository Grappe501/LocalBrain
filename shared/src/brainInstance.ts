/** LB-OS-PROD-001 — Empty brain / instance productization */

import type { PrivacyTier } from "./capabilityGovernance.js";

export const BRAIN_INSTANCE_ENGINE_ID = "ENG-INST-001";
export const PRODUCTIZATION_SLICE_ID = "LB-OS-PROD-001";

export type BrainOwnerType = "steve" | "kelly" | "chris" | "organization" | "custom";

export type ExecutiveOfficeType =
  | "personal"
  | "campaign"
  | "nonprofit"
  | "organization"
  | "custom";

export interface BrainInstanceProfile {
  instance_id: string;
  owner_type: BrainOwnerType;
  display_name: string;
  role: string;
  primary_mission: string;
  executive_office_type: ExecutiveOfficeType;
  departments_enabled: string[];
  default_privacy_tier: PrivacyTier;
  created_at: string;
  updated_at: string;
}

export type ConnectorReadinessStatus =
  | "connected"
  | "missing"
  | "invalid"
  | "needs_test"
  | "reserved";

export type ConnectorCategory =
  | "ai"
  | "communications"
  | "storage"
  | "data"
  | "ingestion";

export interface ConnectorReadinessEntry {
  connector_id: string;
  label: string;
  category: ConnectorCategory;
  status: ConnectorReadinessStatus;
  detail: string;
  settings_route: string | null;
  test_available: boolean;
  infrastructure_reserved: boolean;
}

export interface ConnectorReadinessReport {
  slice_id: typeof PRODUCTIZATION_SLICE_ID;
  engine_id: typeof BRAIN_INSTANCE_ENGINE_ID;
  connectors: ConnectorReadinessEntry[];
  connected_count: number;
  missing_count: number;
  reserved_count: number;
  observed_at: string;
}

export interface OnboardingState {
  completed: boolean;
  completed_at: string | null;
  current_step: number;
  total_steps: number;
}

export interface BrainInstanceOverview {
  slice_id: typeof PRODUCTIZATION_SLICE_ID;
  engine_id: typeof BRAIN_INSTANCE_ENGINE_ID;
  profile: BrainInstanceProfile;
  onboarding: OnboardingState;
  vault_active: boolean;
  product_rule: string;
  package_mode: "empty_brain" | "seeded_dev";
  observed_at: string;
}

export interface BrainInstanceExportBundle {
  export_version: 1;
  exported_at: string;
  profile: Omit<BrainInstanceProfile, "instance_id" | "created_at" | "updated_at">;
  departments_enabled: string[];
  /** Never includes API keys or credential blobs */
  provider_flags: { provider_id: string; enabled: boolean }[];
  onboarding_completed: boolean;
}

export interface UpdateBrainInstanceProfileRequest {
  owner_type?: BrainOwnerType;
  display_name?: string;
  role?: string;
  primary_mission?: string;
  executive_office_type?: ExecutiveOfficeType;
  departments_enabled?: string[];
  default_privacy_tier?: PrivacyTier;
}

export const BRAIN_PRODUCT_RULE =
  "No person-specific information enters permanent Memory OS until LocalBrain ships as an empty installable brain.";
