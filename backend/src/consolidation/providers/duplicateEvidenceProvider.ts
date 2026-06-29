import path from "node:path";
import type { ConsolidationContext, ConsolidationFinding, EvidenceSignal } from "../types.js";

function fileAssets(ctx: ConsolidationContext) {
  return ctx.assets.filter((a) => a.is_directory === 0 && a.size_bytes !== null);
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function buildFinding(
  members: ConsolidationContext["assets"],
  idx: number,
  hasHash: boolean,
): ConsolidationFinding {
  const reclaimable = members.slice(1).reduce((sum, m) => sum + (m.size_bytes ?? 0), 0);
  const evidence_percent = hasHash
    ? Math.min(99, 85 + members.length * 3)
    : Math.min(92, 70 + members.length * 4);
  const signals: EvidenceSignal[] = [];
  if (hasHash) signals.push({ signal: "hash", weight: "high", detail: "Identical content hash" });
  signals.push({ signal: "filename", weight: "medium", detail: "Matching filename" });
  signals.push({ signal: "size", weight: "medium", detail: "Matching file size" });

  return {
    finding_id: `dup-${idx}-${members[0].name.toLowerCase().slice(0, 24)}`,
    category: "duplicate_file",
    title: `${members.length} duplicate copies of ${members[0].name}`,
    priority: reclaimable > 500 * 1024 * 1024 ? "high" : members.length > 3 ? "medium" : "low",
    evidence_percent,
    evidence_signals: signals,
    executive_impact: `Recover ${formatBytes(reclaimable)} by consolidating identical files`,
    decision_friction: `Searching for "${members[0].name}" returns ${members.length} identical copies — you must choose which path is authoritative.`,
    estimated_review_minutes: Math.max(1, Math.ceil(members.length / 2)),
    estimated_benefit: `Eliminates ${members.length - 1} duplicate decision points · ${formatBytes(reclaimable)} reclaimable`,
    reclaimable_bytes: reclaimable,
    decision_points_eliminated: members.length - 1,
    risk: hasHash ? "low" : "medium",
    related_paths: members.map((m) => m.path).slice(0, 8),
    source: "Migration · DuplicateEvidenceProvider",
  };
}

export const duplicateEvidenceProvider = {
  id: "duplicate-evidence",
  category: "duplicate_file" as const,
  collect(ctx: ConsolidationContext): ConsolidationFinding[] {
    const files = fileAssets(ctx);
    const usedIds = new Set<string>();
    const findings: ConsolidationFinding[] = [];
    let idx = 0;

    const hashBuckets = new Map<string, typeof files>();
    for (const asset of files) {
      if (!asset.hash) continue;
      const list = hashBuckets.get(asset.hash) ?? [];
      list.push(asset);
      hashBuckets.set(asset.hash, list);
    }

    for (const [, members] of hashBuckets) {
      if (members.length < 2) continue;
      for (const m of members) usedIds.add(m.asset_id);
      findings.push(buildFinding(members, ++idx, true));
    }

    const nameBuckets = new Map<string, typeof files>();
    for (const asset of files) {
      if (usedIds.has(asset.asset_id)) continue;
      const key = `${asset.name.toLowerCase()}::${asset.size_bytes}`;
      const list = nameBuckets.get(key) ?? [];
      list.push(asset);
      nameBuckets.set(key, list);
    }

    for (const [, members] of nameBuckets) {
      if (members.length < 2) continue;
      findings.push(buildFinding(members, ++idx, false));
    }

    return findings.sort((a, b) => b.reclaimable_bytes - a.reclaimable_bytes);
  },
};
