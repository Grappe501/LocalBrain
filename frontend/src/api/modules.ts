import type { ModuleManifest } from "@localbrain/shared";

export type ModulesResponse = {
  modules: ModuleManifest[];
  department_modules: ModuleManifest[];
  load_order: string[];
};

export async function fetchModules(): Promise<ModulesResponse> {
  const res = await fetch("/api/modules");
  if (!res.ok) throw new Error(`Modules fetch failed: ${res.status}`);
  return (await res.json()) as ModulesResponse;
}

export async function fetchModule(moduleId: string): Promise<ModuleManifest> {
  const res = await fetch(`/api/modules/${encodeURIComponent(moduleId)}`);
  if (!res.ok) throw new Error(`Module ${moduleId} not found`);
  const data = (await res.json()) as { module: ModuleManifest };
  return data.module;
}
