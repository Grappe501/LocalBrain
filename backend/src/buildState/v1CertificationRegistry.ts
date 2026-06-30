import fs from "node:fs";
import path from "node:path";
import type { V1ModuleLaunchStatus } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";

export type V1CertificationRecord = {
  module_id: string;
  certified_at: string;
  locked: boolean;
};

type V1CertificationStore = {
  records: V1CertificationRecord[];
};

const REGISTRY_PATH = path.join(getRepoRoot(), "local_data", "v1-certified-modules.json");

function readStore(): V1CertificationStore {
  try {
    if (!fs.existsSync(REGISTRY_PATH)) return { records: [] };
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8")) as V1CertificationStore;
  } catch {
    return { records: [] };
  }
}

function writeStore(store: V1CertificationStore): void {
  const dir = path.dirname(REGISTRY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(store, null, 2));
}

export function isModuleCertificationLocked(moduleId: string): boolean {
  return readStore().records.some((r) => r.module_id === moduleId && r.locked);
}

export function lockModuleCertification(moduleId: string): void {
  const store = readStore();
  const existing = store.records.find((r) => r.module_id === moduleId);
  const record: V1CertificationRecord = {
    module_id: moduleId,
    certified_at: new Date().toISOString(),
    locked: true,
  };
  if (existing) {
    Object.assign(existing, record);
  } else {
    store.records.push(record);
  }
  writeStore(store);
}

export function listCertifiedModules(): V1CertificationRecord[] {
  return readStore().records.filter((r) => r.locked);
}

export function hasRegression(
  moduleId: string,
  launchStatus: V1ModuleLaunchStatus,
): boolean {
  if (!isModuleCertificationLocked(moduleId)) return false;
  return launchStatus === "needs_work" || launchStatus === "regression";
}

export function countRegressions(
  statuses: Array<{ module_id: string; launch_status: V1ModuleLaunchStatus }>,
): number {
  return statuses.filter((s) => hasRegression(s.module_id, s.launch_status)).length;
}
