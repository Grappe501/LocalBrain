import type { SystemHealthResponse, SystemUsageSnapshot } from "@localbrain/shared";
import { computeOperationalHealthScore, needsAttention } from "./operationalScore.js";
import { getMachinePanel, getOperationsPanel, getStoragePanel } from "./operationsSnapshot.js";
import { getAiUsageToday, formatCostUsd, formatTokenCount } from "./usageService.js";
import { primeCpuSampler } from "./healthMonitor.js";

let cpuPrimed = false;

function ensureCpuPrimed(): void {
  if (!cpuPrimed) {
    cpuPrimed = true;
    primeCpuSampler();
  }
}

export function getSystemHealth(): SystemHealthResponse {
  ensureCpuPrimed();
  const machine = getMachinePanel();
  const storage = getStoragePanel(machine.disks);
  const ai = getAiUsageToday();
  const operations = getOperationsPanel();
  const operational_health_score = computeOperationalHealthScore({
    machine,
    storage,
    ai,
    operations,
  });

  return {
    machine,
    storage,
    ai,
    operations,
    operational_health_score,
    observed_at: new Date().toISOString(),
    read_only: true,
  };
}

export function getSystemUsage(): SystemUsageSnapshot {
  const health = getSystemHealth();
  const diskC = health.machine.disks.find((d) => d.label === "C:");
  const diskH = health.machine.disks.find((d) => d.label === "H:");

  return {
    cpu_percent: health.machine.cpu_percent,
    ram_percent: health.machine.ram_used_percent,
    disk_c_percent: diskC?.used_percent ?? null,
    disk_h_percent: diskH?.used_percent ?? null,
    indexing: health.operations.indexing_active,
    pending_approvals: health.operations.pending_approvals,
    api_status: health.ai.api_status,
    tokens_today: health.ai.tokens_today,
    cost_usd_today: health.ai.estimated_cost_usd_today,
    model: health.ai.model,
    operational_health_score: health.operational_health_score.score,
    attention_needed: needsAttention({
      score: health.operational_health_score.score,
      machine: health.machine,
      operations: health.operations,
      ai: health.ai,
    }),
    observed_at: health.observed_at,
  };
}

export function formatDockLine(usage: SystemUsageSnapshot): string {
  const cpu = usage.cpu_percent !== null ? `${usage.cpu_percent}%` : "—";
  const ram = `${usage.ram_percent}%`;
  const diskC = usage.disk_c_percent !== null ? `${usage.disk_c_percent}%` : "—";
  const diskH = usage.disk_h_percent !== null ? `${usage.disk_h_percent}%` : "—";
  const cost = `$${usage.cost_usd_today.toFixed(2)}`;
  const tokens = formatTokenCount(usage.tokens_today);

  return `CPU ${cpu} · RAM ${ram} · Disk C ${diskC} · Disk H ${diskH} · API ${cost} today · ${tokens} tokens`;
}

export { formatCostUsd, formatTokenCount };
