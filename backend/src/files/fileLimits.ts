export const DEFAULT_MAX_READ_BYTES = 512 * 1024;
export const DEFAULT_MAX_READ_CHARS = 24_000;

export function getMaxReadBytes(): number {
  const env = Number(process.env.LOCALBRAIN_MAX_READ_BYTES);
  return Number.isFinite(env) && env > 0 ? env : DEFAULT_MAX_READ_BYTES;
}

export function getMaxReadChars(): number {
  const env = Number(process.env.LOCALBRAIN_MAX_READ_CHARS);
  return Number.isFinite(env) && env > 0 ? env : DEFAULT_MAX_READ_CHARS;
}

export const DEFAULT_FOLDER_MANIFEST_LIMIT = 100;

export function getFolderManifestLimit(): number {
  const env = Number(process.env.LOCALBRAIN_FOLDER_MANIFEST_LIMIT);
  return Number.isFinite(env) && env > 0 ? env : DEFAULT_FOLDER_MANIFEST_LIMIT;
}

const TEXT_EXTENSIONS = new Set([
  ".txt",
  ".md",
  ".json",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".rs",
  ".go",
  ".sql",
  ".yaml",
  ".yml",
  ".toml",
  ".xml",
  ".html",
  ".css",
  ".csv",
  ".env.example",
]);

export function isLikelyTextFile(name: string): boolean {
  const lower = name.toLowerCase();
  if (TEXT_EXTENSIONS.has(lower.slice(lower.lastIndexOf(".")))) return true;
  if (lower.endsWith(".example")) return true;
  return lower === "dockerfile" || lower === "makefile" || !lower.includes(".");
}

export function truncateContent(content: string, maxChars: number): { text: string; truncated: boolean } {
  if (content.length <= maxChars) return { text: content, truncated: false };
  return {
    text: content.slice(0, maxChars) + "\n\n[… truncated for token safety …]",
    truncated: true,
  };
}
