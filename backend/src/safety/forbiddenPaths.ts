/** Safety Model §6 — forbidden path prefixes and patterns. */
export const FORBIDDEN_PATH_PREFIXES = [
  "C:\\Windows",
  "C:\\Program Files",
  "C:\\Program Files (x86)",
  "C:\\Users\\User\\AppData",
  "C:\\Users\\User\\.ssh",
  "C:\\Users\\User\\.aws",
  "C:\\Users\\User\\.azure",
  "C:\\Users\\User\\.config",
  "C:\\Users\\User\\.docker",
] as const;

export const FORBIDDEN_PATH_SEGMENTS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
] as const;

export const FORBIDDEN_SECRET_NAMES = [
  ".env",
  ".env.local",
  ".env.production",
  "credentials.json",
  "token.json",
  "id_rsa",
  "id_ed25519",
] as const;

export const FORBIDDEN_SECRET_GLOBS = ["*.pem", "*.key", "*.p12", "*.pfx"] as const;

export function listForbiddenRules(): {
  prefixes: readonly string[];
  segments: readonly string[];
  secretNames: readonly string[];
  secretGlobs: readonly string[];
} {
  return {
    prefixes: FORBIDDEN_PATH_PREFIXES,
    segments: FORBIDDEN_PATH_SEGMENTS,
    secretNames: FORBIDDEN_SECRET_NAMES,
    secretGlobs: FORBIDDEN_SECRET_GLOBS,
  };
}
