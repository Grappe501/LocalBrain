import type {
  AiUsagePanel,
  MachineHealthPanel,
  OperationalHealthLabel,
  OperationalHealthScore,
  OperationsPanel,
  StorageHealthPanel,
} from "@localbrain/shared";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function diskScore(volumes: StorageHealthPanel["volumes"]): number {
  const percents = volumes
    .map((v) => v.used_percent)
    .filter((p): p is number => p !== null);
  if (percents.length === 0) return 85;
  const worst = Math.max(...percents);
  if (worst >= 95) return 20;
  if (worst >= 90) return 45;
  if (worst >= 80) return 65;
  return 95;
}

function labelFromScore(score: number): OperationalHealthLabel {
  if (score >= 75) return "healthy";
  if (score >= 50) return "attention";
  return "critical";
}

export function computeOperationalHealthScore(input: {
  machine: MachineHealthPanel;
  storage: StorageHealthPanel;
  ai: AiUsagePanel;
  operations: OperationsPanel;
}): OperationalHealthScore {
  const ram = input.machine.ram_used_percent;
  const cpu = input.machine.cpu_percent ?? 30;

  const machineScore = clamp(100 - Math.max(0, ram - 50) * 1.2 - Math.max(0, cpu - 60) * 0.8);
  const storageScore = diskScore(input.storage.volumes);
  const indexScore =
    input.storage.index_freshness === "fresh"
      ? 95
      : input.storage.index_freshness === "indexing"
        ? 80
        : input.storage.index_freshness === "stale"
          ? 45
          : 60;

  const aiScore =
    input.ai.api_status === "online"
      ? 95
      : input.ai.api_status === "offline"
        ? 40
        : 70;

  const backlogPenalty = Math.min(40, input.operations.pending_approvals * 4);
  const failPenalty = Math.min(30, input.operations.failed_actions * 10);
  const opsScore = clamp(100 - backlogPenalty - failPenalty);

  const factors = [
    {
      id: "machine",
      name: "Machine",
      score: machineScore,
      weight: 0.2,
      detail: `CPU ${cpu}% · RAM ${ram}%`,
    },
    {
      id: "storage",
      name: "Storage",
      score: storageScore,
      weight: 0.15,
      detail: `Registry ${input.storage.registry_asset_count} assets · index ${input.storage.index_freshness}`,
    },
    {
      id: "ai",
      name: "AI",
      score: aiScore,
      weight: 0.15,
      detail: `${input.ai.provider} · ${input.ai.api_status}`,
    },
    {
      id: "operations",
      name: "Operations",
      score: opsScore,
      weight: 0.25,
      detail: `${input.operations.pending_approvals} pending approvals`,
    },
    {
      id: "index",
      name: "Index freshness",
      score: indexScore,
      weight: 0.25,
      detail: input.storage.latest_index_at ?? "never indexed",
    },
  ];

  const score = clamp(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0) / factors.reduce((s, f) => s + f.weight, 0),
  );

  const label = labelFromScore(score);
  const summary =
    label === "healthy"
      ? "Operating environment is within normal bounds."
      : label === "attention"
        ? "One or more areas need review — see panels below."
        : "Multiple signals require attention before heavy operations.";

  return { score, label, summary, factors };
}

export function needsAttention(input: {
  score: number;
  machine: MachineHealthPanel;
  operations: OperationsPanel;
  ai: AiUsagePanel;
}): boolean {
  if (input.score < 75) return true;
  if (input.operations.pending_approvals >= 5) return true;
  if (input.operations.failed_actions > 0) return true;
  if (input.ai.api_status === "offline") return true;
  if (input.machine.ram_used_percent >= 90) return true;
  for (const d of input.machine.disks) {
    if (d.used_percent !== null && d.used_percent >= 90) return true;
  }
  return false;
}
