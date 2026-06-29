import type { CommandActionClass, CommandIntent, CommandResponse, CommandStatusResponse } from "@localbrain/shared";
import { isOrchestratedAction } from "../cos/capabilityRouter.js";
import { runOrchestrationPipeline } from "../cos/orchestrationPipeline.js";
import { executeFileToolCommand } from "../files/fileCommandBridge.js";
import { resolveFileToolRequest } from "../files/fileToolResolver.js";
import { ProviderAdapterError } from "../providers/adapterTypes.js";
import { isAiRoutingAvailable, routeCompletion } from "../providers/router.js";
import { getProvidersOverview } from "../providers/manager.js";
import {
  actionClassToIntent,
  classifyCommand,
  estimateTokens,
} from "./actionClassifier.js";
import { buildCommandContext, buildOfflineAnswer } from "./contextBuilder.js";
import { getModelConfig, isOpenAiKeyConfigured } from "./modelConfig.js";
import { logCommandExchange } from "./safeLog.js";

function actionClassToCapability(actionClass: CommandActionClass): "reasoning" | "fast_summary" {
  if (actionClass === "briefing_summary" || actionClass === "general_query") {
    return "reasoning";
  }
  return "fast_summary";
}

export type CommandRequest = {
  message: string;
  workspace_id?: string;
  asset_path?: string;
  file_path?: string;
  tool?: "read_file" | "summarize_file" | "summarize_asset" | "summarize_folder";
  /** LB-OS-010.5: create pending proposals in Actions queue (never executes) */
  create_proposals?: boolean;
  orchestration_id?: string;
  recommendation_ids?: string[];
};

export function getCommandStatus(): CommandStatusResponse {
  const { model } = getModelConfig();
  const overview = getProvidersOverview();
  const keyConfigured = isOpenAiKeyConfigured();
  return {
    key_configured: keyConfigured,
    model,
    ready: overview.any_configured,
    provider: overview.primary_provider_id ?? "openai",
  };
}

export async function executeCommand(req: CommandRequest): Promise<CommandResponse> {
  const message = req.message.trim();
  if (!message) {
    return {
      intent: "ERROR",
      action_class: "general_query",
      message: "Please enter a command for the Chief of Staff.",
      key_configured: isOpenAiKeyConfigured(),
      model: null,
      tokens_estimate: null,
      context_used: [],
      recommend_only: true,
      logged: false,
    };
  }

  const fileTool = resolveFileToolRequest(req);
  if (fileTool) {
    return executeFileToolCommand(fileTool.kind, fileTool.path, req);
  }

  const { action_class } = classifyCommand(message);

  if (isOrchestratedAction(action_class)) {
    const keyConfigured = isOpenAiKeyConfigured();
    const pipeline = runOrchestrationPipeline({
      message,
      actionClass: action_class,
      workspaceId: req.workspace_id,
      assetPath: req.asset_path,
      create_proposals: req.create_proposals,
      orchestration_id: req.orchestration_id,
      recommendation_ids: req.recommendation_ids,
    });

    logCommandExchange({
      intent: pipeline.intent,
      action_class,
      user_message: message,
      response_message: pipeline.message,
      tokens_estimate: estimateTokens(pipeline.message),
      model: null,
      key_configured: keyConfigured,
    });

    return {
      intent: pipeline.intent,
      action_class,
      message: pipeline.message,
      key_configured: keyConfigured,
      model: keyConfigured ? getModelConfig().model : null,
      tokens_estimate: estimateTokens(pipeline.message),
      context_used: pipeline.context_used,
      recommend_only: true,
      logged: true,
      orchestration: pipeline.orchestration,
      proposed_action_ids:
        pipeline.proposed_action_ids.length > 0 ? pipeline.proposed_action_ids : undefined,
      actions_queue_path:
        pipeline.proposed_action_ids.length > 0 ? "/actions" : undefined,
    };
  }

  const intent = actionClassToIntent(action_class);
  const keyConfigured = isOpenAiKeyConfigured();
  const { systemPrompt, contextUsed } = buildCommandContext({
    actionClass: action_class,
    workspaceId: req.workspace_id,
    assetPath: req.asset_path,
  });

  const { model } = getModelConfig();
  let responseMessage: string;
  let tokensEstimate: number | null = estimateTokens(systemPrompt + message);
  let usedModel: string | null = null;
  let finalIntent: CommandIntent = intent;

  if (!keyConfigured) {
    finalIntent = "MISSING_KEY";
    responseMessage = buildOfflineAnswer({
      actionClass: action_class,
      workspaceId: req.workspace_id,
    });
  } else if (!isAiRoutingAvailable()) {
    finalIntent = "MISSING_KEY";
    responseMessage = buildOfflineAnswer({
      actionClass: action_class,
      workspaceId: req.workspace_id,
    });
  } else {
    try {
      const capability = actionClassToCapability(action_class);
      const result = await routeCompletion({
        capability,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        workspace_id: req.workspace_id,
        agent_id: "chief_of_staff",
      });
      responseMessage = result.content;
      usedModel = result.model;
      tokensEstimate =
        result.usage?.total_tokens ?? estimateTokens(systemPrompt + message + result.content);
    } catch (e) {
      finalIntent = "ERROR";
      if (e instanceof ProviderAdapterError) {
        responseMessage = `Chief of Staff could not reach AI provider: ${e.message}`;
      } else {
        responseMessage = "Chief of Staff encountered an unexpected error.";
      }
    }
  }

  logCommandExchange({
    intent: finalIntent,
    action_class,
    user_message: message,
    response_message: responseMessage,
    tokens_estimate: tokensEstimate,
    model: usedModel ?? model,
    key_configured: keyConfigured,
  });

  return {
    intent: finalIntent,
    action_class,
    message: responseMessage,
    key_configured: keyConfigured,
    model: usedModel ?? (keyConfigured ? model : null),
    tokens_estimate: tokensEstimate,
    context_used: contextUsed,
    recommend_only: true,
    logged: true,
  };
}
