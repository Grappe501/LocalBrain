import { getDatabase } from "../db/database.js";
import { getModelConfig } from "../openai/modelConfig.js";
import { isProviderCredentialConfigured } from "../providers/credentials.js";
import { getTodayFlightStats } from "../providers/flightRecorder.js";
import { getProvidersOverview } from "../providers/manager.js";
import type { AiUsagePanel, ApiStatus } from "@localbrain/shared";

/** Rough USD per 1M tokens — flight log also stores per-request estimates */
function costPerMillionTokens(): number {
  const raw = process.env.LOCALBRAIN_COST_PER_1M_TOKENS;
  if (raw) {
    const n = Number(raw);
    if (!Number.isNaN(n) && n >= 0) return n;
  }
  return 0.15;
}

export function getAiUsageToday(): AiUsagePanel {
  const overview = getProvidersOverview();
  const { model } = getModelConfig();
  const configured = isProviderCredentialConfigured("openai");
  const flight = getTodayFlightStats();

  const commandRow = getDatabase()
    .prepare(
      `SELECT COUNT(*) AS commands
       FROM command_log
       WHERE date(created_at) = date('now')`,
    )
    .get() as { commands: number };

  const tokensToday =
    flight.tokens > 0
      ? flight.tokens
      : (
          getDatabase()
            .prepare(
              `SELECT COALESCE(SUM(tokens_estimate), 0) AS tokens
               FROM command_log
               WHERE date(created_at) = date('now')`,
            )
            .get() as { tokens: number }
        ).tokens;

  const cost =
    flight.cost > 0
      ? flight.cost
      : (tokensToday / 1_000_000) * costPerMillionTokens();

  const primary = overview.providers.find((p) => p.id === overview.primary_provider_id);

  let api_status: ApiStatus = "not_configured";
  if (overview.any_configured) {
    api_status = primary?.health === "healthy" || primary?.health === "degraded" ? "online" : "offline";
    if (primary?.credential_status === "configured" && primary.health === "not_configured") {
      api_status = "online";
    }
  }

  return {
    openai_configured: configured,
    provider: overview.primary_provider_id ?? "openai",
    primary_provider_id: overview.primary_provider_id,
    primary_provider_label: primary?.label ?? "—",
    providers_configured: overview.providers.filter((p) => p.credential_status === "configured")
      .length,
    model,
    api_status,
    tokens_today: tokensToday,
    estimated_cost_usd_today: Math.round(cost * 100) / 100,
    command_count_today: Math.max(commandRow.commands ?? 0, flight.requests),
  };
}

export function formatCostUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatTokenCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
