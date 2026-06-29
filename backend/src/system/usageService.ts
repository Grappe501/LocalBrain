import { getDatabase } from "../db/database.js";
import { getModelConfig, isOpenAiKeyConfigured } from "../openai/modelConfig.js";
import type { AiUsagePanel, ApiStatus } from "@localbrain/shared";

/** Rough USD per 1M tokens — override via env for billing accuracy */
function costPerMillionTokens(): number {
  const raw = process.env.LOCALBRAIN_COST_PER_1M_TOKENS;
  if (raw) {
    const n = Number(raw);
    if (!Number.isNaN(n) && n >= 0) return n;
  }
  return 0.15;
}

export function getAiUsageToday(): AiUsagePanel {
  const configured = isOpenAiKeyConfigured();
  const { model } = getModelConfig();

  const row = getDatabase()
    .prepare(
      `SELECT
        COALESCE(SUM(tokens_estimate), 0) AS tokens,
        COUNT(*) AS commands
       FROM command_log
       WHERE date(created_at) = date('now')`,
    )
    .get() as { tokens: number; commands: number };

  const tokensToday = row.tokens ?? 0;
  const cost = (tokensToday / 1_000_000) * costPerMillionTokens();

  let api_status: ApiStatus = "not_configured";
  if (configured) {
    api_status = "online";
  }

  return {
    openai_configured: configured,
    provider: "openai",
    model,
    api_status,
    tokens_today: tokensToday,
    estimated_cost_usd_today: Math.round(cost * 100) / 100,
    command_count_today: row.commands ?? 0,
  };
}

export function formatCostUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatTokenCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
