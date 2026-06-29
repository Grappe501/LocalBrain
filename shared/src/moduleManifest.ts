/**
 * Module manifest schema — MODULARITY GATE (LB-OS-106).
 * Every department/studio registers via manifest; no domain hard-coding in kernel.
 * @see docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md
 */

export type ModuleNavPlacement = "department" | "kernel" | "hidden";

export type ModuleStatus = "stub" | "active" | "disabled";

/** Capability declaration with explicit dependencies (engines, modules, or capability ids). */
export interface ModuleCapabilityDeclaration {
  capability_id: string;
  dependencies: string[];
}

export interface ModuleRouteDeclaration {
  /** App path — e.g. `/studio/engineering` */
  path: string;
  /** React Router pattern relative to layout — e.g. `studio/engineering/*` */
  pattern: string;
}

/**
 * Frozen Module foundational object — extended only via manifest fields, not new object types.
 */
export interface ModuleManifest {
  module_id: string;
  name: string;
  domain: string;
  version: string;
  status: ModuleStatus;
  routes: ModuleRouteDeclaration[];
  /** Permission scopes this module may request — e.g. `filesystem:read` */
  permissions: string[];
  /** Tool ids registered by this module */
  tools: string[];
  /** Agent ids scoped to this module */
  agents: string[];
  /** KnowledgeSource ids this module owns */
  data_sources: string[];
  capabilities: ModuleCapabilityDeclaration[];
  /** Module ids and/or engine ids (ENG-*) required before load */
  dependencies: string[];
  nav_placement: ModuleNavPlacement;
  /** Frontend lazy boundary — e.g. `modules/engineering-studio/Entry` */
  lazy_load_boundary: string;
  description?: string;
}

export type ModuleManifestValidationError = {
  module_id: string;
  field: string;
  message: string;
};

export function validateModuleManifest(
  manifest: ModuleManifest,
  knownModuleIds: Set<string> = new Set(),
): ModuleManifestValidationError[] {
  const errors: ModuleManifestValidationError[] = [];
  const id = manifest.module_id || "(missing)";

  if (!manifest.module_id?.trim()) {
    errors.push({ module_id: id, field: "module_id", message: "required" });
  }
  if (!manifest.name?.trim()) {
    errors.push({ module_id: id, field: "name", message: "required" });
  }
  if (!manifest.domain?.trim()) {
    errors.push({ module_id: id, field: "domain", message: "required" });
  }
  if (!manifest.lazy_load_boundary?.trim()) {
    errors.push({ module_id: id, field: "lazy_load_boundary", message: "required" });
  }
  if (!Array.isArray(manifest.routes) || manifest.routes.length === 0) {
    errors.push({ module_id: id, field: "routes", message: "at least one route required" });
  }
  for (const route of manifest.routes ?? []) {
    if (!route.path?.startsWith("/")) {
      errors.push({ module_id: id, field: "routes.path", message: "must start with /" });
    }
    if (!route.pattern?.trim()) {
      errors.push({ module_id: id, field: "routes.pattern", message: "required" });
    }
  }
  if (!Array.isArray(manifest.capabilities)) {
    errors.push({ module_id: id, field: "capabilities", message: "must be an array" });
  } else {
    for (const cap of manifest.capabilities) {
      if (!cap.capability_id?.trim()) {
        errors.push({ module_id: id, field: "capabilities.capability_id", message: "required" });
      }
      if (!Array.isArray(cap.dependencies)) {
        errors.push({
          module_id: id,
          field: "capabilities.dependencies",
          message: "must be an array",
        });
      }
    }
  }
  if (!Array.isArray(manifest.dependencies)) {
    errors.push({ module_id: id, field: "dependencies", message: "must be an array" });
  }
  if (!["department", "kernel", "hidden"].includes(manifest.nav_placement)) {
    errors.push({ module_id: id, field: "nav_placement", message: "invalid placement" });
  }
  return errors;
}

export function validateModuleRegistry(manifests: ModuleManifest[]): ModuleManifestValidationError[] {
  const ids = new Set(manifests.map((m) => m.module_id));
  const errors: ModuleManifestValidationError[] = [];

  for (const manifest of manifests) {
    errors.push(...validateModuleManifest(manifest, ids));
    for (const dep of manifest.dependencies ?? []) {
      if (!dep.startsWith("ENG-") && !dep.startsWith("CAP-") && !ids.has(dep)) {
        errors.push({
          module_id: manifest.module_id,
          field: "dependencies",
          message: `unknown module dependency: ${dep}`,
        });
      }
    }
  }

  const seen = new Set<string>();
  for (const manifest of manifests) {
    if (seen.has(manifest.module_id)) {
      errors.push({
        module_id: manifest.module_id,
        field: "module_id",
        message: "duplicate module_id",
      });
    }
    seen.add(manifest.module_id);
  }

  return errors;
}
