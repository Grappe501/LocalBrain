/** UCIE-109 — Connector framework. */

export const UCIE_CONNECTOR_TYPES = [
  "google_contacts",
  "apple_contacts",
  "outlook",
  "gmail",
  "icloud_export",
  "android_export",
  "csv",
  "excel",
] as const;

export type UcieConnectorType = (typeof UCIE_CONNECTOR_TYPES)[number];

export const UCIE_CONNECTOR_SESSION_STATUSES = [
  "pending",
  "connected",
  "imported",
  "disconnected",
  "failed",
] as const;

export type UcieConnectorSessionStatus = (typeof UCIE_CONNECTOR_SESSION_STATUSES)[number];

export type ConnectorDefinition = {
  connector_type: UcieConnectorType;
  label: string;
  description: string;
  supports_temporary_import: true;
  supports_permanent_sync: false;
};

export type ConnectorSession = {
  connector_session_id: string;
  workspace_id: string;
  connector_type: UcieConnectorType;
  status: UcieConnectorSessionStatus;
  import_session_id?: string;
  connected_by_user_id: string;
  connected_at: string;
  disconnected_at?: string;
};

export type StartConnectorSessionInput = {
  workspace_id: string;
  connector_type: UcieConnectorType;
  connected_by_user_id: string;
};
