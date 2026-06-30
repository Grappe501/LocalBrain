import {
  BRAIN_INSTANCE_ENGINE_ID,
  PRODUCTIZATION_SLICE_ID,
  type ConnectorReadinessEntry,
  type ConnectorReadinessReport,
  type ConnectorReadinessStatus,
} from "@localbrain/shared";
import { getProvidersOverview } from "../providers/manager.js";
import type { AIProviderPublic } from "@localbrain/shared";

function aiReadiness(provider: AIProviderPublic): ConnectorReadinessStatus {
  if (provider.credential_status === "missing") return "missing";
  if (provider.credential_status === "invalid" || provider.credential_status === "expired") {
    return "invalid";
  }
  if (provider.health === "healthy") return "connected";
  if (provider.credential_status === "configured") return "needs_test";
  return "missing";
}

function aiDetail(provider: AIProviderPublic, status: ConnectorReadinessStatus): string {
  if (status === "connected") return `Healthy · ${provider.default_model ?? "default model"}`;
  if (status === "needs_test") return "Credential saved — run connection test";
  if (status === "invalid") return "Credential invalid or verify failed";
  return "API key not configured";
}

const RESERVED_CONNECTORS: Omit<
  ConnectorReadinessEntry,
  "status" | "detail"
>[] = [
  {
    connector_id: "google_workspace",
    label: "Google (Gmail · Calendar · Drive)",
    category: "ingestion",
    settings_route: null,
    test_available: false,
    infrastructure_reserved: true,
  },
  {
    connector_id: "twilio",
    label: "Twilio (SMS · Voice)",
    category: "communications",
    settings_route: null,
    test_available: false,
    infrastructure_reserved: true,
  },
  {
    connector_id: "sendgrid",
    label: "SendGrid (Email outbound)",
    category: "communications",
    settings_route: null,
    test_available: false,
    infrastructure_reserved: true,
  },
  {
    connector_id: "chatgpt_export",
    label: "ChatGPT export import",
    category: "ingestion",
    settings_route: null,
    test_available: false,
    infrastructure_reserved: true,
  },
  {
    connector_id: "local_filesystem",
    label: "Local filesystem (allowed folders)",
    category: "storage",
    settings_route: "/settings",
    test_available: false,
    infrastructure_reserved: false,
  },
  {
    connector_id: "census",
    label: "US Census API",
    category: "data",
    settings_route: null,
    test_available: false,
    infrastructure_reserved: true,
  },
  {
    connector_id: "bls",
    label: "Bureau of Labor Statistics",
    category: "data",
    settings_route: null,
    test_available: false,
    infrastructure_reserved: true,
  },
  {
    connector_id: "reputation_monitor",
    label: "Online reputation monitor",
    category: "ingestion",
    settings_route: null,
    test_available: false,
    infrastructure_reserved: true,
  },
];

export function getConnectorReadinessReport(): ConnectorReadinessReport {
  const overview = getProvidersOverview();
  const aiEntries: ConnectorReadinessEntry[] = overview.providers.map((provider) => {
    const status = aiReadiness(provider);
    return {
      connector_id: provider.id,
      label: provider.label,
      category: "ai",
      status,
      detail: aiDetail(provider, status),
      settings_route: "/settings/providers",
      test_available: true,
      infrastructure_reserved: false,
    };
  });

  const reservedEntries: ConnectorReadinessEntry[] = RESERVED_CONNECTORS.map((c) => ({
    ...c,
    status: "reserved" as const,
    detail: "Reserved — post-Convention · ENC → DPEC → connector · no ingestion until empty brain ships",
  }));

  const connectors = [...aiEntries, ...reservedEntries];
  return {
    slice_id: PRODUCTIZATION_SLICE_ID,
    engine_id: BRAIN_INSTANCE_ENGINE_ID,
    connectors,
    connected_count: connectors.filter((c) => c.status === "connected").length,
    missing_count: connectors.filter((c) => c.status === "missing").length,
    reserved_count: connectors.filter((c) => c.status === "reserved").length,
    observed_at: new Date().toISOString(),
  };
}
