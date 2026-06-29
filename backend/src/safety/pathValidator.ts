import path from "node:path";

/** Normalize and resolve to absolute path (Windows-safe). */
export function normalizeAndResolve(inputPath: string, baseDir?: string): string {
  const trimmed = inputPath.trim();
  if (!trimmed) {
    return path.resolve(baseDir ?? process.cwd(), ".");
  }

  const normalized = path.normalize(trimmed);
  if (path.isAbsolute(normalized)) {
    return path.resolve(normalized);
  }

  return path.resolve(baseDir ?? process.cwd(), normalized);
}

export function isWithinRoot(resolvedPath: string, root: string): boolean {
  const resolved = path.resolve(resolvedPath);
  const allowedRoot = path.resolve(root);
  const rel = path.relative(allowedRoot, resolved);
  if (rel === "") return true;
  if (rel.startsWith("..")) return false;
  return !path.isAbsolute(rel);
}

export function matchesForbiddenPrefix(resolvedPath: string, prefixes: readonly string[]): string | null {
  const normalized = path.resolve(resolvedPath);
  for (const prefix of prefixes) {
    const forbiddenRoot = path.resolve(prefix);
    if (isWithinRoot(normalized, forbiddenRoot) || normalized.toLowerCase() === forbiddenRoot.toLowerCase()) {
      return prefix;
    }
    if (normalized.toLowerCase().startsWith(forbiddenRoot.toLowerCase())) {
      return prefix;
    }
  }
  return null;
}
