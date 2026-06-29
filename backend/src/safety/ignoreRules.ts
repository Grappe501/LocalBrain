import path from "node:path";
import {
  FORBIDDEN_PATH_SEGMENTS,
  FORBIDDEN_SECRET_GLOBS,
  FORBIDDEN_SECRET_NAMES,
} from "./forbiddenPaths.js";

function matchesGlob(name: string, glob: string): boolean {
  if (!glob.startsWith("*.")) return false;
  const ext = glob.slice(1);
  return name.toLowerCase().endsWith(ext.toLowerCase());
}

export function hasIgnoredSegment(resolvedPath: string): string | null {
  const segments = resolvedPath.split(/[/\\]/).filter(Boolean);
  for (const segment of segments) {
    const lower = segment.toLowerCase();
    if (FORBIDDEN_PATH_SEGMENTS.some((s) => lower === s.toLowerCase())) {
      return segment;
    }
  }
  return null;
}

export function matchesSecretName(resolvedPath: string): string | null {
  const base = path.basename(resolvedPath);
  const lower = base.toLowerCase();

  for (const name of FORBIDDEN_SECRET_NAMES) {
    if (lower === name.toLowerCase()) {
      return name;
    }
  }

  for (const glob of FORBIDDEN_SECRET_GLOBS) {
    if (matchesGlob(base, glob)) {
      return glob;
    }
  }

  return null;
}
