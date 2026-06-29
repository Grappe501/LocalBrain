import { randomUUID } from "node:crypto";
import type { AICapability, AIProviderId } from "@localbrain/shared";
import type { AdapterChatResult, ChatMessage } from "./adapterTypes.js";
import { ProviderAdapterError } from "./adapterTypes.js";
import { isAnyProviderConfigured } from "./credentials.js";
import {
  appendFlightRecord,
  updateProviderHealth,
} from "./flightRecorder.js";
import {
  getProviderAdapter,
  getWorkspaceProviderOverride,
  listEnabledRoutableProviders,
} from "./manager.js";

export type RouteContext = {
  capability: AICapability;
  messages: ChatMessage[];
  workspace_id?: string;
  department_id?: string;
  agent_id?: string;
  job_profile?: string;
};

export type RouteResult = {
  content: string;
  model: string;
  provider_id: AIProviderId;
  capability: AICapability;
  routing_reason: string;
  usage?: AdapterChatResult["usage"];
  latency_ms: number;
};

const CAPABILITY_PROFILE: Record<AICapability, string> = {
  reasoning: "deep",
  fast_summary: "fast",
  code: "code",
  writing: "writing",
  embeddings: "local",
  local_private: "local",
};

const CAPABILITY_ORDER: Record<AICapability, AIProviderId[]> = {
  reasoning: ["openai", "anthropic", "xai", "google", "openrouter"],
  fast_summary: ["openai", "openrouter", "google", "ollama"],
  code: ["openai", "anthropic", "openrouter"],
  writing: ["openai", "anthropic"],
  embeddings: ["ollama", "local_gpu", "openai"],
  local_private: ["ollama", "local_gpu"],
};

function estimateCostUsd(totalTokens: number | undefined): number | null {
  if (!totalTokens) return null;
  const perM = Number(process.env.LOCALBRAIN_COST_PER_1M_TOKENS ?? 0.15);
  return Math.round((totalTokens / 1_000_000) * perM * 10000) / 10000;
}

export function selectProviderForCapability(
  capability: AICapability,
  workspaceId?: string,
): { providerId: AIProviderId; routingReason: string } | null {
  const routable = listEnabledRoutableProviders();
  if (routable.length === 0) return null;

  const override = workspaceId ? getWorkspaceProviderOverride(workspaceId) : null;

  if (override?.force_local) {
    const local = routable.find((p) => p.id === "ollama" || p.id === "local_gpu");
    if (local) {
      return {
        providerId: local.id,
        routingReason: `workspace ${workspaceId} force_local override`,
      };
    }
    return null;
  }

  if (override?.preferred_provider_id) {
    const preferred = routable.find((p) => p.id === override.preferred_provider_id);
    if (preferred && preferred.capabilities.includes(capability)) {
      return {
        providerId: preferred.id,
        routingReason: `workspace ${workspaceId} preferred provider ${preferred.id}`,
      };
    }
  }

  const order = CAPABILITY_ORDER[capability];
  for (const id of order) {
    const match = routable.find((p) => p.id === id && p.capabilities.includes(capability));
    if (match) {
      return {
        providerId: match.id,
        routingReason: `capability ${capability} → profile ${CAPABILITY_PROFILE[capability]} → provider ${match.id} (priority ${match.routing_priority})`,
      };
    }
  }

  const fallback = routable.find((p) => p.capabilities.includes(capability)) ?? routable[0];
  if (!fallback) return null;
  return {
    providerId: fallback.id,
    routingReason: `capability ${capability} fallback → ${fallback.id}`,
  };
}

export function isAiRoutingAvailable(): boolean {
  return isAnyProviderConfigured();
}

export async function routeCompletion(ctx: RouteContext): Promise<RouteResult> {
  const requestId = randomUUID();
  const started = Date.now();
  const jobProfile = ctx.job_profile ?? CAPABILITY_PROFILE[ctx.capability];

  const selection = selectProviderForCapability(ctx.capability, ctx.workspace_id);
  if (!selection) {
    appendFlightRecord({
      request_id: requestId,
      capability: ctx.capability,
      job_profile: jobProfile,
      routing_reason: "no configured provider",
      provider_id: "openai",
      model_id: "none",
      latency_ms: Date.now() - started,
      success: false,
      error_class: "missing_credential",
      workspace_id: ctx.workspace_id ?? null,
      department_id: ctx.department_id ?? null,
      agent_id: ctx.agent_id ?? null,
    });
    throw new ProviderAdapterError("No AI provider configured", "openai");
  }

  const adapter = getProviderAdapter(selection.providerId);
  const providerRow = listEnabledRoutableProviders().find((p) => p.id === selection.providerId);
  const modelOverride = providerRow?.default_model ?? null;

  try {
    const result = await adapter.chat(ctx.messages, modelOverride);
    const latency = Date.now() - started;
    const totalTokens = result.usage?.total_tokens ?? null;

    appendFlightRecord({
      request_id: requestId,
      capability: ctx.capability,
      job_profile: jobProfile,
      routing_reason: selection.routingReason,
      provider_id: selection.providerId,
      model_id: result.model,
      prompt_tokens: result.usage?.prompt_tokens ?? null,
      completion_tokens: result.usage?.completion_tokens ?? null,
      total_tokens: totalTokens,
      estimated_cost_usd: estimateCostUsd(totalTokens ?? undefined),
      latency_ms: latency,
      success: true,
      workspace_id: ctx.workspace_id ?? null,
      department_id: ctx.department_id ?? null,
      agent_id: ctx.agent_id ?? null,
    });

    updateProviderHealth(selection.providerId, "healthy", latency, true);

    return {
      content: result.content,
      model: result.model,
      provider_id: selection.providerId,
      capability: ctx.capability,
      routing_reason: selection.routingReason,
      usage: result.usage,
      latency_ms: latency,
    };
  } catch (e) {
    const latency = Date.now() - started;
    const message = e instanceof Error ? e.message : "Provider error";
    appendFlightRecord({
      request_id: requestId,
      capability: ctx.capability,
      job_profile: jobProfile,
      routing_reason: selection.routingReason,
      provider_id: selection.providerId,
      model_id: modelOverride ?? "unknown",
      latency_ms: latency,
      success: false,
      error_class: message.slice(0, 120),
      workspace_id: ctx.workspace_id ?? null,
      department_id: ctx.department_id ?? null,
      agent_id: ctx.agent_id ?? null,
    });
    updateProviderHealth(selection.providerId, "offline", latency, false);
    throw new ProviderAdapterError(message, selection.providerId);
  }
}

export function previewRouting(
  capability: AICapability,
  workspaceId?: string,
): { provider_id: AIProviderId | null; routing_reason: string } {
  const selection = selectProviderForCapability(capability, workspaceId);
  if (!selection) {
    return { provider_id: null, routing_reason: "no configured provider" };
  }
  return {
    provider_id: selection.providerId,
    routing_reason: selection.routingReason,
  };
}
