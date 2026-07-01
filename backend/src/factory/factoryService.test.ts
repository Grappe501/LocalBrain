import test from "node:test";
import assert from "node:assert/strict";
import { institutionStructureMatches } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { exportBrainInstanceConfig } from "../settings/brainInstanceService.js";
import {
  manufactureEmptyInstitution,
  verifyManufacturedInstitution,
} from "./factoryService.js";

test("manufacture produces empty brain with birth certificate", () => {
  bootstrapApp();
  try {
    const result = manufactureEmptyInstitution();
    assert.ok(result.manufacture_id.startsWith("MFG-"));
    assert.equal(result.engine_id, "ENG-FAC-001");
    assert.equal(result.package_mode, "empty_brain");
    assert.equal(result.contract_version, "FAC-2026-07");
    assert.equal(result.birth_certificate.manufacturer, "LocalBrain Factory");
    assert.equal(result.birth_certificate.constitution_version, "1.0");
    assert.equal(result.profile.display_name, "Executive Institution");
    assert.equal(result.profile.owner_type, "custom");
    assert.equal(result.onboarding.completed, false);

    const verification = verifyManufacturedInstitution(result);
    assert.equal(verification.valid, true, verification.violations.join(", "));

    const bundle = exportBrainInstanceConfig();
    const serialized = JSON.stringify(bundle);
    assert.ok(!serialized.includes("api_key"));
    assert.ok(!serialized.includes("credential"));
    assert.ok(!serialized.includes("steve"));
  } finally {
    shutdownApp();
  }
});

test("two manufactures produce institution structure parity", () => {
  bootstrapApp();
  try {
    const first = manufactureEmptyInstitution();
    const second = manufactureEmptyInstitution();

    assert.ok(
      institutionStructureMatches(first.manifest, second.manifest),
      "manifests must match",
    );
    assert.equal(
      first.birth_certificate.constitution_version,
      second.birth_certificate.constitution_version,
    );
    assert.equal(first.birth_certificate.office_pack, second.birth_certificate.office_pack);
    assert.equal(
      first.birth_certificate.convention_contracts.ontology,
      second.birth_certificate.convention_contracts.ontology,
    );
    assert.notEqual(first.profile.instance_id, second.profile.instance_id);
    assert.notEqual(
      first.birth_certificate.identity.passport_id,
      second.birth_certificate.identity.passport_id,
    );
  } finally {
    shutdownApp();
  }
});

test("manufacture excludes person-specific and ingestion content", () => {
  bootstrapApp();
  try {
    const result = manufactureEmptyInstitution();
    assert.ok(result.manifest.structure_excluded.includes("memory_ingestion"));
    assert.ok(result.manifest.structure_excluded.includes("gmail"));
    assert.ok(result.manifest.structure_excluded.includes("steve_specific_seeds"));
    assert.ok(result.manifest.structure_included.includes("executive_office"));
    assert.ok(result.manifest.structure_included.includes("memory_os_framework"));
    assert.ok(!result.manifest.structure_included.includes("personal_data"));
  } finally {
    shutdownApp();
  }
});
