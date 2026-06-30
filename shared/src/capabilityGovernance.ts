/** Connector governance guardrails — LB-OS-026.66 */

export interface CapabilityGovernancePolicy {
  read_first: boolean;
  recommend_second: boolean;
  draft_third: boolean;
  act_requires_approval: boolean;
  no_automatic_send: boolean;
  no_automatic_calendar_write: boolean;
  no_automatic_money_movement: boolean;
}

/** Gmail, Calendar, finance: read → recommend → draft → act with approval only */
export const EXECUTIVE_CONNECTOR_GOVERNANCE: CapabilityGovernancePolicy = {
  read_first: true,
  recommend_second: true,
  draft_third: true,
  act_requires_approval: true,
  no_automatic_send: true,
  no_automatic_calendar_write: true,
  no_automatic_money_movement: true,
};

/** Media / digital-world monitors: ingest and score only — briefing and recommendations, no autonomous publishing */
export const EXECUTIVE_MEDIA_GOVERNANCE: CapabilityGovernancePolicy = {
  read_first: true,
  recommend_second: true,
  draft_third: true,
  act_requires_approval: true,
  no_automatic_send: true,
  no_automatic_calendar_write: true,
  no_automatic_money_movement: true,
};

/** Personal voice cloning — consent, local-first, synthetic indicator, approval before outbound use */
export interface PersonalVoiceGovernancePolicy {
  consent_required: boolean;
  local_first_storage_preferred: boolean;
  no_unauthorized_impersonation: boolean;
  synthetic_voice_indicator_required: boolean;
  approval_before_outbound_audio: boolean;
}

export const PERSONAL_VOICE_GOVERNANCE: PersonalVoiceGovernancePolicy = {
  consent_required: true,
  local_first_storage_preferred: true,
  no_unauthorized_impersonation: true,
  synthetic_voice_indicator_required: true,
  approval_before_outbound_audio: true,
};

/** Privacy doctrine — minimize disclosure; govern every external data flow */
export interface PrivacyExposureGovernancePolicy {
  minimize_off_machine_data: boolean;
  mask_unnecessary_identity: boolean;
  local_models_when_possible: boolean;
  route_sensitive_work_locally: boolean;
  sanitized_context_to_external_ai_only: boolean;
  log_every_external_ai_disclosure: boolean;
  /** LocalBrain never sends whole-world context externally */
  minimum_packet_only: boolean;
  never_whole_world_context: boolean;
}

export const PRIVACY_EXPOSURE_GOVERNANCE: PrivacyExposureGovernancePolicy = {
  minimize_off_machine_data: true,
  mask_unnecessary_identity: true,
  local_models_when_possible: true,
  route_sensitive_work_locally: true,
  sanitized_context_to_external_ai_only: true,
  log_every_external_ai_disclosure: true,
  minimum_packet_only: true,
  never_whole_world_context: true,
};

/** LB-OS-03X-ENC — encryption and key material (build from the start) */
export interface SovereignEncryptionPolicy {
  encryption_at_rest: boolean;
  encrypted_database_fields: boolean;
  encrypted_local_file_vault: boolean;
  encrypted_credential_vault: boolean;
  per_workspace_encryption_keys: boolean;
  encrypted_backups: boolean;
}

export const SOVEREIGN_ENCRYPTION_POLICY: SovereignEncryptionPolicy = {
  encryption_at_rest: true,
  encrypted_database_fields: true,
  encrypted_local_file_vault: true,
  encrypted_credential_vault: true,
  per_workspace_encryption_keys: true,
  encrypted_backups: true,
};

/** Privacy tiers — CoS / classifier assigns before any provider call */
export type PrivacyTier = 0 | 1 | 2 | 3;

export const PRIVACY_TIER_DEFINITIONS: Record<
  PrivacyTier,
  { label: string; routing: string; examples: string }
> = {
  0: {
    label: "Never leaves machine",
    routing: "Local only · no external API",
    examples: "Health, finance, passwords, private family, raw strategy",
  },
  1: {
    label: "Local model only",
    routing: "On-prem / local LLM",
    examples: "Sensitive drafts, internal campaign strategy, private memory",
  },
  2: {
    label: "Redacted external AI allowed",
    routing: "Sanitized minimum packet · logged disclosure",
    examples: "Generic coding, sanitized summaries, non-sensitive analysis",
  },
  3: {
    label: "Public-safe",
    routing: "External OK · still logged",
    examples: "Published content, press releases, public docs",
  },
};

/** Binding core rule for LB-OS-03X Sovereign Privacy Layer */
export const SOVEREIGN_PRIVACY_CORE_RULE =
  "LocalBrain never sends whole-world context externally. External AI sees only the smallest approved packet needed for the task.";

export const SOVEREIGN_PRIVACY_OPERATIONAL_RULE =
  "Send less, sanitize more, log everything, keep sensitive reasoning local.";
