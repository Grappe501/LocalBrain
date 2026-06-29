import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { getMachineMetrics } from "./healthMonitor.js";
import { computeOperationalHealthScore } from "./operationalScore.js";
import { getSystemHealth, getSystemUsage, formatDockLine } from "./systemService.js";

test("getMachineMetrics returns RAM and disk volumes", () => {
  const m = getMachineMetrics();
  assert.ok(m.ram_total_bytes > 0);
  assert.ok(m.ram_used_percent >= 0 && m.ram_used_percent <= 100);
  assert.ok(m.disks.some((d) => d.label === "C:"));
  assert.ok(m.disks.some((d) => d.label === "H:"));
});

test("getSystemHealth is read-only with operational score", () => {
  bootstrapApp();
  const health = getSystemHealth();
  assert.equal(health.read_only, true);
  assert.ok(health.operational_health_score.score >= 0);
  assert.ok(health.operational_health_score.score <= 100);
  assert.ok(["healthy", "attention", "critical"].includes(health.operational_health_score.label));
  assert.ok(health.machine.hostname.length > 0);
  assert.ok(health.operations.pending_approvals >= 0);
});

test("getSystemUsage includes dock line format", () => {
  bootstrapApp();
  const usage = getSystemUsage();
  const line = formatDockLine(usage);
  assert.match(line, /CPU/);
  assert.match(line, /RAM/);
  assert.match(line, /Disk C/);
  assert.match(line, /tokens/);
  assert.ok(typeof usage.attention_needed === "boolean");
});

test("operational score factors sum to weighted score", () => {
  bootstrapApp();
  const health = getSystemHealth();
  const score = computeOperationalHealthScore({
    machine: health.machine,
    storage: health.storage,
    ai: health.ai,
    operations: health.operations,
  });
  assert.equal(score.factors.length, 5);
});

test.after(() => {
  closeDatabase();
});
