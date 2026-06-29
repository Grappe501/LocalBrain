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

export function ensureActionStorageDirs(): void {
  for (const dir of [getLocalDataDir(), getBackupDir(), getQuarantineDir()]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
