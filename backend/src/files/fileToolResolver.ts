import type { CommandActionClass } from "@localbrain/shared";

export type FileToolRequest = {
  message: string;
  asset_path?: string;
  file_path?: string;
  tool?: "read_file" | "summarize_file" | "summarize_asset" | "summarize_folder";
};

export type FileToolKind = "read_file" | "summarize_file" | "summarize_asset" | "summarize_folder";

export function resolveFileToolRequest(req: FileToolRequest): {
  kind: FileToolKind;
  path: string;
} | null {
  const path = req.asset_path?.trim() || req.file_path?.trim();
  if (!path) return null;

  const msg = req.message.toLowerCase();
  const explicitTool = req.tool;

  if (explicitTool === "read_file" || /\bread (this )?(file|asset|content)\b/i.test(msg)) {
    return { kind: "read_file", path };
  }

  if (
    explicitTool === "summarize_folder" ||
    /\bsummarize (this )?folder\b/i.test(msg) ||
    /\bfolder manifest\b/i.test(msg)
  ) {
    return { kind: "summarize_folder", path };
  }

  if (
    explicitTool === "summarize_asset" ||
    /\b(ask cos about|summarize (this )?(asset|file|selected)|about this asset)\b/i.test(msg)
  ) {
    return { kind: "summarize_asset", path };
  }

  if (explicitTool === "summarize_file" || /\bsummarize (this )?file\b/i.test(msg)) {
    return { kind: "summarize_file", path };
  }

  return null;
}

export function fileToolToActionClass(kind: FileToolKind): CommandActionClass {
  return kind === "read_file" ? "file_read" : "file_summarize";
}

export function fileToolToIntent(kind: FileToolKind): "FILE_READ" | "FILE_SUMMARIZE" {
  return kind === "read_file" ? "FILE_READ" : "FILE_SUMMARIZE";
}
