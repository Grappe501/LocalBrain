import fs from "node:fs";
import type { FileSummarizeMode, FileSummarizeResult } from "@localbrain/shared";
import { getAssetByPath } from "../digitalAssets/assetRegistry.js";
import { getAssetIntelligenceForPath } from "../digitalAssets/intelligenceEngine.js";
import { chatCompletion } from "../openai/openaiClient.js";
import { estimateTokens } from "../openai/actionClassifier.js";
import { isOpenAiKeyConfigured, getModelConfig } from "../openai/modelConfig.js";
import { logFileAccess } from "./fileReadLog.js";
import { buildFolderManifest, manifestToText } from "./folderManifest.js";
import { readFileContentForSummarize } from "./readFile.js";

const SUMMARIZE_SYSTEM = `You are the LocalBrain Chief of Staff summarizer (LB-OS-009).
Summarize using ONLY the provided file content or folder manifest metadata.
Always cite the source path in your first sentence.
Do not suggest file moves, deletes, or edits. Read-only analysis only.`;

function offlineSummary(label: string, body: string, sourcePath: string): string {
  const excerpt = body.slice(0, 1200);
  return `[Offline — OPENAI_API_KEY not set] ${label} at ${sourcePath}:\n${excerpt}${body.length > 1200 ? "…" : ""}`;
}

async function summarizeText(options: {
  mode: FileSummarizeMode;
  sourcePath: string;
  normalizedPath: string;
  body: string;
  truncated: boolean;
  manifestOnly: boolean;
  userPrompt?: string;
}): Promise<{ summary: string; model: string | null; tokens_estimate: number | null }> {
  const userTask =
    options.userPrompt?.trim() ||
    (options.manifestOnly
      ? "Summarize this folder manifest. Describe structure and notable assets."
      : "Summarize this file. Highlight purpose, key points, and relevance to Steve's workspaces.");

  const payload = [
    `Source path: ${options.normalizedPath}`,
    options.manifestOnly ? "Mode: folder manifest (metadata only — no file contents read)" : "Mode: file content",
    options.truncated ? "Note: content was truncated for token safety." : "",
    "---",
    options.body,
  ]
    .filter(Boolean)
    .join("\n");

  if (!isOpenAiKeyConfigured()) {
    return {
      summary: offlineSummary(
        options.manifestOnly ? "Folder manifest" : "File excerpt",
        options.body,
        options.normalizedPath,
      ),
      model: null,
      tokens_estimate: estimateTokens(payload),
    };
  }

  const result = await chatCompletion([
    { role: "system", content: SUMMARIZE_SYSTEM },
    {
      role: "user",
      content: `${userTask}\n\n${payload}`,
    },
  ]);

  return {
    summary: result.content,
    model: result.model,
    tokens_estimate: result.usage?.total_tokens ?? estimateTokens(payload + result.content),
  };
}

export async function summarizeFile(
  pathInput: string,
  userPrompt?: string,
): Promise<FileSummarizeResult> {
  const read = readFileContentForSummarize(pathInput);
  if (!read.ok) {
    logFileAccess({
      path: pathInput,
      normalized_path: read.normalized_path,
      action: "summarize",
      allowed: false,
      reason: read.reason,
    });
    return {
      mode: "file",
      source_path: pathInput,
      normalized_path: read.normalized_path,
      summary: `Cannot summarize: ${read.reason}`,
      allowed: false,
      reason: read.reason,
      truncated: false,
      tokens_estimate: null,
      model: null,
      key_configured: isOpenAiKeyConfigured(),
      manifest_only: false,
      logged: true,
    };
  }

  const { summary, model, tokens_estimate } = await summarizeText({
    mode: "file",
    sourcePath: pathInput,
    normalizedPath: read.normalized_path,
    body: read.content,
    truncated: read.truncated,
    manifestOnly: false,
    userPrompt,
  });

  logFileAccess({
    path: pathInput,
    normalized_path: read.normalized_path,
    action: "summarize",
    allowed: true,
    bytes_read: read.size_bytes,
    chars_returned: read.content.length,
    truncated: read.truncated,
    reason: "summarize_file_ok",
  });

  return {
    mode: "file",
    source_path: pathInput,
    normalized_path: read.normalized_path,
    summary,
    allowed: true,
    reason: "summarize_file_ok",
    truncated: read.truncated,
    tokens_estimate,
    model,
    key_configured: isOpenAiKeyConfigured(),
    manifest_only: false,
    logged: true,
  };
}

export async function summarizeSelectedAsset(
  pathInput: string,
  userPrompt?: string,
): Promise<FileSummarizeResult> {
  const asset = getAssetByPath(pathInput);
  const normalized = asset?.path ?? pathInput;

  let isDirectory = asset?.is_directory === 1;
  if (asset === null) {
    try {
      isDirectory = fs.statSync(pathInput).isDirectory();
    } catch {
      return {
        mode: "asset",
        source_path: pathInput,
        normalized_path: pathInput,
        summary: "Asset not found in registry and path not accessible.",
        allowed: false,
        reason: "not_found",
        truncated: false,
        tokens_estimate: null,
        model: null,
        key_configured: isOpenAiKeyConfigured(),
        manifest_only: false,
        logged: true,
      };
    }
  }

  if (isDirectory) {
    const folderResult = await summarizeFolder(pathInput, userPrompt);
    return { ...folderResult, mode: "asset" };
  }

  const intel = getAssetIntelligenceForPath(normalized);
  const fileResult = await summarizeFile(pathInput, userPrompt);
  if (intel && fileResult.allowed) {
    const intelNote = [
      `Registry: kind=${asset?.kind ?? "—"} lifecycle=${asset?.lifecycle_stage ?? "—"} health=${intel.health_score}`,
      intel.recommendations[0]?.message ?? "",
    ]
      .filter(Boolean)
      .join(" · ");
    fileResult.summary = `${fileResult.summary}\n\nAsset intelligence: ${intelNote}`;
  }
  return { ...fileResult, mode: "asset" };
}

export async function summarizeFolder(
  pathInput: string,
  userPrompt?: string,
): Promise<FileSummarizeResult> {
  const manifest = buildFolderManifest(pathInput);
  if (!manifest.allowed) {
    return {
      mode: "folder",
      source_path: pathInput,
      normalized_path: manifest.normalized_path,
      summary: `Cannot summarize folder: ${manifest.reason}`,
      allowed: false,
      reason: manifest.reason,
      truncated: false,
      tokens_estimate: null,
      model: null,
      key_configured: isOpenAiKeyConfigured(),
      manifest_only: true,
      logged: true,
    };
  }

  const body = manifestToText(manifest);
  const { summary, model, tokens_estimate } = await summarizeText({
    mode: "folder",
    sourcePath: pathInput,
    normalizedPath: manifest.normalized_path,
    body,
    truncated: false,
    manifestOnly: true,
    userPrompt,
  });

  logFileAccess({
    path: pathInput,
    normalized_path: manifest.normalized_path,
    action: "summarize",
    allowed: true,
    chars_returned: body.length,
    reason: "summarize_folder_ok",
  });

  return {
    mode: "folder",
    source_path: pathInput,
    normalized_path: manifest.normalized_path,
    summary,
    allowed: true,
    reason: "summarize_folder_ok",
    truncated: false,
    tokens_estimate,
    model: model ?? (isOpenAiKeyConfigured() ? getModelConfig().model : null),
    key_configured: isOpenAiKeyConfigured(),
    manifest_only: true,
    logged: true,
  };
}
