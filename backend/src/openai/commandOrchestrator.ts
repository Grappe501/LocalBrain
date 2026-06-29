import type { CommandIntent, CommandResponse, CommandStatusResponse } from "@localbrain/shared";
import { executeFileToolCommand } from "../files/fileCommandBridge.js";
import { resolveFileToolRequest } from "../files/fileToolResolver.js";
import {
  actionClassToIntent,
  classifyCommand,
  estimateTokens,
} from "./actionClassifier.js";
import { buildCommandContext, buildOfflineAnswer } from "./contextBuilder.js";
import { chatCompletion, OpenAiClientError } from "./openaiClient.js";
import { getModelConfig, isOpenAiKeyConfigured } from "./modelConfig.js";
import { logCommandExchange } from "./safeLog.js";

export type CommandRequest = {
  message: string;
  workspace_id?: string;
  asset_path?: string;
  file_path?: string;
  tool?: "read_file" | "summarize_file" | "summarize_asset" | "summarize_folder";
};

export function getCommandStatus(): CommandStatusResponse {
  const { model } = getModelConfig();
  const keyConfigured = isOpenAiKeyConfigured();
  return {
    key_configured: keyConfigured,
    model,
    ready: keyConfigured,
    provider: "openai",
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
  } else {
    try {
      const result = await chatCompletion([
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ]);
      responseMessage = result.content;
      usedModel = result.model;
      tokensEstimate = result.usage?.total_tokens ?? estimateTokens(systemPrompt + message + result.content);
    } catch (e) {
      finalIntent = "ERROR";
      if (e instanceof OpenAiClientError) {
        responseMessage = `Chief of Staff could not reach OpenAI: ${e.message}`;
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
