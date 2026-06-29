import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ModuleManifest } from "@localbrain/shared";
import { validateModuleRegistry } from "@localbrain/shared";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFESTS_DIR = join(__dirname, "../modules/manifests");

let registeredModules: ModuleManifest[] = [];
let loadErrors: string[] = [];

export function loadModuleManifests(): ModuleManifest[] {
  const files = readdirSync(MANIFESTS_DIR).filter((f) => f.endsWith(".json"));
  const manifests: ModuleManifest[] = [];

  for (const file of files) {
    const raw = readFileSync(join(MANIFESTS_DIR, file), "utf8");
    manifests.push(JSON.parse(raw) as ModuleManifest);
  }

  const validationErrors = validateModuleRegistry(manifests);
  if (validationErrors.length > 0) {
    loadErrors = validationErrors.map((e) => `${e.module_id}.${e.field}: ${e.message}`);
    throw new Error(`Module manifest validation failed:\n${loadErrors.join("\n")}`);
  }

  registeredModules = manifests.sort((a, b) => a.name.localeCompare(b.name));
  loadErrors = [];
  return registeredModules;
}

export function getRegisteredModules(): ModuleManifest[] {
  return registeredModules;
}

export function getModuleById(moduleId: string): ModuleManifest | undefined {
  return registeredModules.find((m) => m.module_id === moduleId);
}

export function getDepartmentModules(): ModuleManifest[] {
  return registeredModules.filter(
    (m) => m.nav_placement === "department" && m.status !== "disabled",
  );
}

export function getModuleLoadErrors(): string[] {
  return loadErrors;
}

/** Resolve module load order by declared dependencies (modules only). */
export function getModuleLoadOrder(): string[] {
  const ids = registeredModules.map((m) => m.module_id);
  const order: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(moduleId: string): void {
    if (visited.has(moduleId)) return;
    if (visiting.has(moduleId)) {
      throw new Error(`Circular module dependency: ${moduleId}`);
    }
    visiting.add(moduleId);
    const manifest = getModuleById(moduleId);
    if (manifest) {
      for (const dep of manifest.dependencies) {
        if (ids.includes(dep)) visit(dep);
      }
    }
    visiting.delete(moduleId);
    visited.add(moduleId);
    order.push(moduleId);
  }

  for (const id of ids) visit(id);
  return order;
}
