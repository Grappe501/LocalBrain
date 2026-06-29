export type SafetyStatus = {
  engine: string;
  active: boolean;
  allowedFolderCount: number;
  forbiddenRuleCount: number;
  dbConnected: boolean;
  fileToolsEnabled: boolean;
  message: string;
};

export type AllowedFolder = {
  id: number;
  path: string;
  label: string;
  created_at: string;
};

export type ForbiddenRules = {
  prefixes: readonly string[];
  segments: readonly string[];
  secretNames: readonly string[];
  secretGlobs: readonly string[];
};

export type PathCheckResult = {
  allowed: boolean;
  level: string;
  reason: string;
  normalizedPath?: string;
};

export async function fetchSafetyStatus(): Promise<SafetyStatus> {
  const res = await fetch("/api/safety/status");
  if (!res.ok) throw new Error(`Safety status failed: ${res.status}`);
  return res.json() as Promise<SafetyStatus>;
}

export async function fetchAllowedFolders(): Promise<AllowedFolder[]> {
  const res = await fetch("/api/safety/allowed");
  if (!res.ok) throw new Error(`Allowed folders failed: ${res.status}`);
  const data = (await res.json()) as { folders: AllowedFolder[] };
  return data.folders;
}

export async function fetchForbiddenRules(): Promise<ForbiddenRules> {
  const res = await fetch("/api/safety/forbidden");
  if (!res.ok) throw new Error(`Forbidden rules failed: ${res.status}`);
  return res.json() as Promise<ForbiddenRules>;
}

export async function testPath(
  path: string,
  action: "read" | "list" | "write" | "delete" = "read",
): Promise<PathCheckResult> {
  const res = await fetch("/api/safety/test-path", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, action }),
  });
  if (!res.ok) {
    const err = (await res.json()) as { error?: string };
    throw new Error(err.error ?? `test-path failed: ${res.status}`);
  }
  return res.json() as Promise<PathCheckResult>;
}
