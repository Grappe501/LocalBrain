import type { CommandResponse } from "@localbrain/shared";
import { readFile } from "./readFile.js";
import { fileToolToActionClass, fileToolToIntent, type FileToolKind } from "./fileToolResolver.js";
import {
  summarizeFile,
  summarizeFolder,
  summarizeSelectedAsset,
} from "./summarizeService.js";
import type { CommandRequest } from "../openai/commandOrchestrator.js";
import { isOpenAiKeyConfigured } from "../openai/modelConfig.js";
import { logCommandExchange } from "../openai/safeLog.js";

export async function executeFileToolCommand(
  kind: FileToolKind,
  path: string,
  req: CommandRequest,
): Promise<CommandResponse> {
  const action_class = fileToolToActionClass(kind);
  const intent = fileToolToIntent(kind);
  const keyConfigured = isOpenAiKeyConfigured();

  if (kind === "read_file") {
    const result = readFile(path);
    const preview =
      result.content && result.content.length > 4000
        ? `${result.content.slice(0, 4000)}\n\n[… preview truncated in command response …]`
        : result.content;

    const message = result.allowed
      ? `Source: ${result.normalized_path}\n${result.truncated ? "(file truncated for token cap)\n" : ""}${preview ?? ""}`
      : `Read denied for ${result.normalized_path}: ${result.reason}`;

    logCommandExchange({
      intent,
      action_class,
      user_message: req.message,
      response_message: message.slice(0, 500),
      tokens_estimate: result.chars_returned ? Math.ceil(result.chars_returned / 4) : null,
      model: null,
      key_configured: keyConfigured,
    });

    return {
      intent: result.allowed ? intent : "ERROR",
      action_class,
      message,
      key_configured: keyConfigured,
      model: null,
      tokens_estimate: result.chars_returned ? Math.ceil(result.chars_returned / 4) : null,
      context_used: ["permission_engine", "read_file"],
      recommend_only: true,
      logged: true,
      source_path: result.normalized_path,
      file_read_logged: result.logged,
    };
  }

  let summaryResult;
  switch (kind) {
    case "summarize_folder":
      summaryResult = await summarizeFolder(path, req.message);
      break;
    case "summarize_file":
      summaryResult = await summarizeFile(path, req.message);
      break;
    case "summarize_asset":
    default:
      summaryResult = await summarizeSelectedAsset(path, req.message);
      break;
  }

  const message = summaryResult.allowed
    ? summaryResult.summary
    : `Summarize denied for ${summaryResult.normalized_path}: ${summaryResult.reason}`;

  logCommandExchange({
    intent: summaryResult.allowed ? intent : "ERROR",
    action_class,
    user_message: req.message,
    response_message: message.slice(0, 500),
    tokens_estimate: summaryResult.tokens_estimate,
    model: summaryResult.model,
    key_configured: keyConfigured,
  });

  return {
    intent: summaryResult.allowed ? intent : "ERROR",
    action_class,
    message,
    key_configured: keyConfigured,
    model: summaryResult.model,
    tokens_estimate: summaryResult.tokens_estimate,
    context_used: summaryResult.manifest_only
      ? ["permission_engine", "folder_manifest", "asset_registry"]
      : ["permission_engine", "read_file", "asset_registry"],
    recommend_only: true,
    logged: true,
    source_path: summaryResult.normalized_path,
    file_read_logged: summaryResult.logged,
  };
}
