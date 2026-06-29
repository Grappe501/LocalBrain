import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import type {
  AICapability,
  AIFlightRecordPublic,
  AIProviderId,
} from "@localbrain/shared";

export type FlightLogInput = {
  request_id?: string;
  capability: AICapability;
  job_profile: string;
  routing_reason: string;
  provider_id: AIProviderId;
  model_id: string;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
  estimated_cost_usd?: number | null;
  latency_ms: number;
  success: boolean;
  error_class?: string | null;
  workspace_id?: string | null;
  department_id?: string | null;
  agent_id?: string | null;
};

export function appendFlightRecord(input: FlightLogInput): void {
  const requestId = input.request_id ?? randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO ai_flight_log (
        request_id, capability, job_profile, routing_reason,
        provider_id, model_id, prompt_tokens, completion_tokens, total_tokens,
        estimated_cost_usd, latency_ms, success, error_class,
        workspace_id, department_id, agent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      requestId,
      input.capability,
      input.job_profile,
      input.routing_reason,
      input.provider_id,
      input.model_id,
      input.prompt_tokens ?? null,
      input.completion_tokens ?? null,
      input.total_tokens ?? null,
      input.estimated_cost_usd ?? null,
      input.latency_ms,
      input.success ? 1 : 0,
      input.error_class ?? null,
      input.workspace_id ?? null,
      input.department_id ?? null,
      input.agent_id ?? null,
    );
}

type FlightRow = {
  id: number;
  request_id: string;
  capability: AIFlightRecordPublic["capability"];
  job_profile: string;
  routing_reason: string;
  provider_id: AIProviderId;
  model_id: string;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
  estimated_cost_usd: number | null;
  latency_ms: number;
  success: number;
  workspace_id: string | null;
  department_id: string | null;
  created_at: string;
};

export function listFlightRecords(limit = 50): AIFlightRecordPublic[] {
  const rows = getDatabase()
    .prepare(
      `SELECT id, request_id, capability, job_profile, routing_reason,
              provider_id, model_id, prompt_tokens, completion_tokens, total_tokens,
              estimated_cost_usd, latency_ms, success, workspace_id, department_id, created_at
       FROM ai_flight_log
       ORDER BY id DESC
       LIMIT ?`,
    )
    .all(limit) as FlightRow[];

  return rows.map((r) => ({
    id: r.id,
    request_id: r.request_id,
    capability: r.capability,
    job_profile: r.job_profile,
    routing_reason: r.routing_reason,
    provider_id: r.provider_id,
    model_id: r.model_id,
    prompt_tokens: r.prompt_tokens,
    completion_tokens: r.completion_tokens,
    total_tokens: r.total_tokens,
    estimated_cost_usd: r.estimated_cost_usd,
    latency_ms: r.latency_ms,
    success: r.success === 1,
    workspace_id: r.workspace_id,
    department_id: r.department_id,
    created_at: r.created_at,
  }));
}

export function getTodayFlightStats(): {
  tokens: number;
  cost: number;
  requests: number;
} {
  const row = getDatabase()
    .prepare(
      `SELECT
        COALESCE(SUM(total_tokens), 0) AS tokens,
        COALESCE(SUM(estimated_cost_usd), 0) AS cost,
        COUNT(*) AS requests
       FROM ai_flight_log
       WHERE date(created_at) = date('now') AND success = 1`,
    )
    .get() as { tokens: number; cost: number; requests: number };

  return {
    tokens: row.tokens ?? 0,
    cost: row.cost ?? 0,
    requests: row.requests ?? 0,
  };
}

export function getMonthlySpend(providerId?: AIProviderId): number {
  const sql = providerId
    ? `SELECT COALESCE(SUM(estimated_cost_usd), 0) AS spend
       FROM ai_flight_log
       WHERE provider_id = ? AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
    : `SELECT COALESCE(SUM(estimated_cost_usd), 0) AS spend
       FROM ai_flight_log
       WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`;
  const row = (providerId
    ? getDatabase().prepare(sql).get(providerId)
    : getDatabase().prepare(sql).get()) as { spend: number };
  return row.spend ?? 0;
}

export function updateProviderHealth(
  providerId: AIProviderId,
  health: string,
  latencyMs: number | null,
  success: boolean,
): void {
  getDatabase()
    .prepare(
      `UPDATE ai_providers SET
        health = ?,
        latency_p50_ms = COALESCE(?, latency_p50_ms),
        last_success_at = CASE WHEN ? = 1 THEN datetime('now') ELSE last_success_at END,
        updated_at = datetime('now')
       WHERE provider_id = ?`,
    )
    .run(health, latencyMs, success ? 1 : 0, providerId);
}
