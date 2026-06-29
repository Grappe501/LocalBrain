import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";

export function getLocalDataDir(): string {
  return path.join(getRepoRoot(), "local_data");
}

export function getBackupDir(): string {
  return path.join(getLocalDataDir(), "backups");
}

export function getQuarantineDir(): string {
  return path.join(getLocalDataDir(), "quarantine");
}

export function getCutoverRunsDir(): string {
  return path.join(getLocalDataDir(), "cutover_runs");
}

export function ensureActionStorageDirs(): void {
  for (const dir of [getLocalDataDir(), getBackupDir(), getQuarantineDir(), getCutoverRunsDir()]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
