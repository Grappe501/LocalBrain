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
