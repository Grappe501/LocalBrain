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
}

export const PRIVACY_EXPOSURE_GOVERNANCE: PrivacyExposureGovernancePolicy = {
  minimize_off_machine_data: true,
  mask_unnecessary_identity: true,
  local_models_when_possible: true,
  route_sensitive_work_locally: true,
  sanitized_context_to_external_ai_only: true,
  log_every_external_ai_disclosure: true,
};
