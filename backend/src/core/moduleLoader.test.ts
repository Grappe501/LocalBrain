import assert from "node:assert/strict";
import test from "node:test";
import type { ModuleManifest } from "@localbrain/shared";
import { validateModuleRegistry } from "@localbrain/shared";
import {
  getDepartmentModules,
  getModuleLoadOrder,
  getRegisteredModules,
  loadModuleManifests,
} from "./moduleLoader.js";

test("module manifests load and validate", () => {
  const modules = loadModuleManifests();
  assert.ok(modules.length >= 7);
  assert.equal(validateModuleRegistry(modules).length, 0);
});

test("department modules have capabilities with dependencies", () => {
  loadModuleManifests();
  for (const mod of getDepartmentModules()) {
    assert.ok(mod.capabilities.length > 0, `${mod.module_id} declares capabilities`);
    for (const cap of mod.capabilities) {
      assert.ok(cap.capability_id.startsWith("CAP-"));
      assert.ok(cap.dependencies.length > 0, `${cap.capability_id} has dependencies`);
    }
  }
});

test("agents and tools are module-scoped arrays", () => {
  loadModuleManifests();
  for (const mod of getRegisteredModules()) {
    assert.ok(Array.isArray(mod.agents));
    assert.ok(Array.isArray(mod.tools));
    assert.ok(Array.isArray(mod.data_sources));
  }
});

test("module load order respects module dependencies", () => {
  loadModuleManifests();
  const order = getModuleLoadOrder();
  assert.ok(order.length >= 7);
  assert.deepEqual(new Set(order).size, order.length);
});

test("duplicate module_id fails validation", () => {
  const dup: ModuleManifest[] = [
    {
      module_id: "a",
      name: "A",
      domain: "test",
      version: "0.0.1",
      status: "stub",
      routes: [{ path: "/a", pattern: "a/*" }],
      permissions: [],
      tools: [],
      agents: [],
      data_sources: [],
      capabilities: [{ capability_id: "CAP-X-001", dependencies: ["ENG-PM-001"] }],
      dependencies: [],
      nav_placement: "hidden",
      lazy_load_boundary: "modules/a/Entry",
    },
    {
      module_id: "a",
      name: "A2",
      domain: "test",
      version: "0.0.1",
      status: "stub",
      routes: [{ path: "/b", pattern: "b/*" }],
      permissions: [],
      tools: [],
      agents: [],
      data_sources: [],
      capabilities: [{ capability_id: "CAP-X-002", dependencies: ["ENG-PM-001"] }],
      dependencies: [],
      nav_placement: "hidden",
      lazy_load_boundary: "modules/b/Entry",
    },
  ];
  const errors = validateModuleRegistry(dup);
  assert.ok(errors.some((e) => e.message === "duplicate module_id"));
});
