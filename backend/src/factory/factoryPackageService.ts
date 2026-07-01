import { createHash, randomUUID } from "node:crypto";
import {
  buildExecutiveOfficeProjection,
  CAPABILITY_REGISTRY,
  EXECUTIVE_OFFICE_ENGINE_ID,
  type FactoryPackage,
  type FactoryPackageProfileTemplate,
  FACTORY_CONTRACT_VERSION,
  FACTORY_PACKAGE_VERSION,
} from "@localbrain/shared";
import { runGraphIntegrityCertification } from "../integration/executiveExperienceAudit.js";
import {
  buildManifest,
  writeEmptyInstitutionState,
} from "./factoryCore.js";

function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const sorted: Record<string, unknown> = {};
      for (const k of Object.keys(val as object).sort()) {
        sorted[k] = (val as Record<string, unknown>)[k];
      }
      return sorted;
    }
    return val;
  });
}

export function canonicalPackagePayload(): Omit<
  FactoryPackage,
  "package_id" | "built_at" | "integrity_hash" | "structural_hash"
> {
  const office = buildExecutiveOfficeProjection();
  const graph = runGraphIntegrityCertification();
  const manifest = buildManifest();

  const profile_template: FactoryPackageProfileTemplate = {
    owner_type: "custom",
    display_name: "Executive Institution",
    role: "Executive",
    primary_mission: "",
    executive_office_type: "organization",
    departments_enabled: [...manifest.departments_template],
    default_privacy_tier: 1,
  };

  return {
    package_version: FACTORY_PACKAGE_VERSION,
    factory_contract_version: FACTORY_CONTRACT_VERSION,
    slice_id: "LB-OS-PROD-010",
    engine_id: "ENG-FAC-001",
    manifest,
    profile_template,
    convention_contracts: { ...manifest.convention_contracts },
    constitution_version: manifest.constitution_version,
    executive_office: {
      engine_id: EXECUTIVE_OFFICE_ENGINE_ID,
      slice_id: office.slice_id,
      department_count: office.executive_departments.length,
      domain_count: office.intelligence_domains.length,
      synthesis_department_id: office.synthesis_department_id,
    },
    capability_graph: {
      capability_count: CAPABILITY_REGISTRY.length,
      graph_certified: graph.certified,
    },
  };
}

export function computeStructuralHash(
  payload: Omit<FactoryPackage, "package_id" | "built_at" | "integrity_hash" | "structural_hash">,
): string {
  return createHash("sha256").update(stableStringify(payload)).digest("hex");
}

/** Build a sealed empty-institution appliance package (Download). */
export function buildFactoryPackage(): FactoryPackage {
  const payload = canonicalPackagePayload();
  const structural_hash = computeStructuralHash(payload);
  const package_id = `PKG-${randomUUID()}`;
  const built_at = new Date().toISOString();

  const integrity_hash = createHash("sha256")
    .update(stableStringify({ ...payload, package_id, built_at, structural_hash }))
    .digest("hex");

  return {
    ...payload,
    package_id,
    built_at,
    structural_hash,
    integrity_hash,
  };
}

export function verifyPackageIntegrity(pkg: FactoryPackage): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const { package_id, built_at, integrity_hash, structural_hash, ...payload } = pkg;

  const expectedStructural = computeStructuralHash(payload);
  if (structural_hash !== expectedStructural) {
    violations.push("structural_hash_mismatch");
  }

  const expectedIntegrity = createHash("sha256")
    .update(stableStringify({ ...payload, package_id, built_at, structural_hash }))
    .digest("hex");

  if (integrity_hash !== expectedIntegrity) {
    violations.push("integrity_hash_mismatch");
  }

  if (pkg.package_version !== FACTORY_PACKAGE_VERSION) {
    violations.push("unsupported_package_version");
  }

  if (pkg.factory_contract_version !== FACTORY_CONTRACT_VERSION) {
    violations.push("factory_contract_version_mismatch");
  }

  return { valid: violations.length === 0, violations };
}

export type FactoryInstallResult = {
  install_id: string;
  package_id: string;
  structural_hash: string;
  profile_instance_id: string;
  package_mode: "empty_brain";
  observed_at: string;
};

/** Install a sealed package into the local instance (Install → Launch). */
export function installFactoryPackage(pkg: FactoryPackage): FactoryInstallResult {
  const verification = verifyPackageIntegrity(pkg);
  if (!verification.valid) {
    throw new Error(`Package integrity failed: ${verification.violations.join(", ")}`);
  }

  const instanceId = randomUUID();
  const now = new Date().toISOString();
  writeEmptyInstitutionState(instanceId, pkg.profile_template, now);

  return {
    install_id: `INS-${randomUUID()}`,
    package_id: pkg.package_id,
    structural_hash: pkg.structural_hash,
    profile_instance_id: instanceId,
    package_mode: "empty_brain",
    observed_at: now,
  };
}
