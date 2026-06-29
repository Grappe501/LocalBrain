import fs from "node:fs";
import path from "node:path";
import type { FileReadResult } from "@localbrain/shared";
import { getPermissionEngine } from "../safety/permissionEngine.js";
import {
  getMaxReadBytes,
  getMaxReadChars,
  isLikelyTextFile,
  truncateContent,
} from "./fileLimits.js";
import { logFileAccess } from "./fileReadLog.js";

function deniedResult(
  rawPath: string,
  normalizedPath: string,
  reason: string,
  isDirectory = false,
): FileReadResult {
  logFileAccess({
    path: rawPath,
    normalized_path: normalizedPath,
    action: "read",
    allowed: false,
    reason,
  });
  return {
    path: rawPath,
    normalized_path: normalizedPath,
    allowed: false,
    reason,
    content: null,
    truncated: false,
    size_bytes: null,
    chars_returned: 0,
    is_directory: isDirectory,
    logged: true,
  };
}

/** Permission-gated read of a single file — no directories, no secrets. */
export function readFile(pathInput: string): FileReadResult {
  const rawPath = pathInput.trim();
  const check = getPermissionEngine().checkPath({ path: rawPath, action: "read" });
  const normalized = check.normalizedPath ?? rawPath;

  if (!check.allowed) {
    return deniedResult(rawPath, normalized, check.reason);
  }

  let stats: fs.Stats;
  try {
    stats = fs.statSync(normalized);
  } catch {
    return deniedResult(rawPath, normalized, "File not found or not accessible");
  }

  if (stats.isDirectory()) {
    return deniedResult(rawPath, normalized, "Path is a directory — use folder manifest summarize", true);
  }

  const maxBytes = getMaxReadBytes();
  if (stats.size > maxBytes) {
    return deniedResult(
      rawPath,
      normalized,
      `File exceeds read cap (${stats.size} bytes > ${maxBytes} bytes)`,
    );
  }

  const name = path.basename(normalized);
  if (!isLikelyTextFile(name)) {
    return deniedResult(rawPath, normalized, "Binary or unsupported file type — text files only in LB-OS-009");
  }

  let content: string;
  try {
    content = fs.readFileSync(normalized, "utf8");
  } catch {
    return deniedResult(rawPath, normalized, "Could not read file as UTF-8 text");
  }

  const { text, truncated } = truncateContent(content, getMaxReadChars());

  logFileAccess({
    path: rawPath,
    normalized_path: normalized,
    action: "read",
    allowed: true,
    bytes_read: stats.size,
    chars_returned: text.length,
    truncated,
    reason: "read_ok",
  });

  return {
    path: rawPath,
    normalized_path: normalized,
    allowed: true,
    reason: "read_ok",
    content: text,
    truncated,
    size_bytes: stats.size,
    chars_returned: text.length,
    is_directory: false,
    logged: true,
  };
}

export function readFileContentForSummarize(pathInput: string): {
  ok: true;
  content: string;
  truncated: boolean;
  normalized_path: string;
  size_bytes: number;
} | {
  ok: false;
  reason: string;
  normalized_path: string;
} {
  const result = readFile(pathInput);
  if (!result.allowed || result.content === null) {
    return { ok: false, reason: result.reason, normalized_path: result.normalized_path };
  }
  return {
    ok: true,
    content: result.content,
    truncated: result.truncated,
    normalized_path: result.normalized_path,
    size_bytes: result.size_bytes ?? 0,
  };
}
