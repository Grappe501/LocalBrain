import {
  FORBIDDEN_PATH_PREFIXES,
  listForbiddenRules,
} from "./forbiddenPaths.js";
import { hasIgnoredSegment, matchesSecretName } from "./ignoreRules.js";
import {
  isWithinRoot,
  matchesForbiddenPrefix,
  normalizeAndResolve,
} from "./pathValidator.js";
import type { PathCheckInput, PathCheckResult, PermissionAction } from "./types.js";

const WRITE_ACTIONS: PermissionAction[] = ["write", "delete"];

export type PermissionEngineOptions = {
  allowedRoots: string[];
  logDecision?: (path: string, action: PermissionAction, result: PathCheckResult) => void;
};

export function createPermissionEngine(options: PermissionEngineOptions) {
  const { allowedRoots, logDecision } = options;

  function checkPath(input: PathCheckInput): PathCheckResult {
    const action: PermissionAction = input.action ?? "read";
    const raw = input.path?.trim() ?? "";

    if (!raw) {
      const result: PathCheckResult = {
        allowed: false,
        level: "FORBIDDEN",
        reason: "Path is empty",
      };
      logDecision?.("", action, result);
      return result;
    }

    let resolved: string;
    try {
      resolved = normalizeAndResolve(raw);
    } catch {
      const result: PathCheckResult = {
        allowed: false,
        level: "FORBIDDEN",
        reason: "Path could not be resolved",
      };
      logDecision?.(raw, action, result);
      return result;
    }

    if (WRITE_ACTIONS.includes(action)) {
      const result: PathCheckResult = {
        allowed: false,
        level: "FORBIDDEN",
        reason: "Write and delete tools not enabled until LB-OS-010+",
        normalizedPath: resolved,
      };
      logDecision?.(resolved, action, result);
      return result;
    }

    const forbiddenPrefix = matchesForbiddenPrefix(resolved, FORBIDDEN_PATH_PREFIXES);
    if (forbiddenPrefix) {
      const result: PathCheckResult = {
        allowed: false,
        level: "FORBIDDEN",
        reason: `Path is inside forbidden location: ${forbiddenPrefix}`,
        normalizedPath: resolved,
      };
      logDecision?.(resolved, action, result);
      return result;
    }

    const ignored = hasIgnoredSegment(resolved);
    if (ignored) {
      const result: PathCheckResult = {
        allowed: false,
        level: "FORBIDDEN",
        reason: `Path contains ignored segment: ${ignored}`,
        normalizedPath: resolved,
      };
      logDecision?.(resolved, action, result);
      return result;
    }

    const secret = matchesSecretName(resolved);
    if (secret) {
      const result: PathCheckResult = {
        allowed: false,
        level: "FORBIDDEN",
        reason: `Forbidden secret pattern: ${secret}`,
        normalizedPath: resolved,
      };
      logDecision?.(resolved, action, result);
      return result;
    }

    if (allowedRoots.length === 0) {
      const result: PathCheckResult = {
        allowed: false,
        level: "FORBIDDEN",
        reason: "No allowed folders configured",
        normalizedPath: resolved,
      };
      logDecision?.(resolved, action, result);
      return result;
    }

    const insideAllowed = allowedRoots.some((root) => isWithinRoot(resolved, root));
    if (!insideAllowed) {
      const result: PathCheckResult = {
        allowed: false,
        level: "FORBIDDEN",
        reason: "Path is outside all allowed folder roots",
        normalizedPath: resolved,
      };
      logDecision?.(resolved, action, result);
      return result;
    }

    const result: PathCheckResult = {
      allowed: true,
      level: "READ_ONLY",
      reason: `Allowed for ${action} (permission engine v2)`,
      normalizedPath: resolved,
    };
    logDecision?.(resolved, action, result);
    return result;
  }

  function validateFilesystemRoot(inputPath: string): PathCheckResult {
    return checkPath({ path: inputPath, action: "list" });
  }

  /** Register a new workspace root — forbidden/secret checks only (not yet in allowed list). */
  function validateNewFilesystemRoot(inputPath: string): PathCheckResult {
    const raw = inputPath?.trim() ?? "";
    if (!raw) {
      return { allowed: false, level: "FORBIDDEN", reason: "Path is empty" };
    }

    let resolved: string;
    try {
      resolved = normalizeAndResolve(raw);
    } catch {
      return { allowed: false, level: "FORBIDDEN", reason: "Path could not be resolved" };
    }

    const forbiddenPrefix = matchesForbiddenPrefix(resolved, FORBIDDEN_PATH_PREFIXES);
    if (forbiddenPrefix) {
      return {
        allowed: false,
        level: "FORBIDDEN",
        reason: `Path is inside forbidden location: ${forbiddenPrefix}`,
        normalizedPath: resolved,
      };
    }

    const ignored = hasIgnoredSegment(resolved);
    if (ignored) {
      return {
        allowed: false,
        level: "FORBIDDEN",
        reason: `Path contains ignored segment: ${ignored}`,
        normalizedPath: resolved,
      };
    }

    const secret = matchesSecretName(resolved);
    if (secret) {
      return {
        allowed: false,
        level: "FORBIDDEN",
        reason: `Forbidden secret pattern: ${secret}`,
        normalizedPath: resolved,
      };
    }

    return {
      allowed: true,
      level: "READ_ONLY",
      reason: "Valid filesystem root for workspace registration",
      normalizedPath: resolved,
    };
  }

  return { checkPath, validateFilesystemRoot, validateNewFilesystemRoot };
}

let defaultEngine: ReturnType<typeof createPermissionEngine> | null = null;

export function getPermissionEngine() {
  if (!defaultEngine) {
    throw new Error("Permission engine not initialized — call initPermissionEngine first");
  }
  return defaultEngine;
}

export function initPermissionEngine(allowedRoots: string[]): void {
  defaultEngine = createPermissionEngine({ allowedRoots });
}

export function getForbiddenRuleCount(): number {
  const rules = listForbiddenRules();
  return (
    rules.prefixes.length +
    rules.segments.length +
    rules.secretNames.length +
    rules.secretGlobs.length
  );
}
