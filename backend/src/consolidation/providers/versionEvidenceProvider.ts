import path from "node:path";
import type { ConsolidationContext, ConsolidationFinding, EvidenceSignal } from "../types.js";

const VERSION_PATTERN =
  /(_v\d+|[-_]v\d+|_final\d*|\s*\(\d+\)|[-_]copy|\s+copy|\s+old|\s+backup|FINAL\d*|NEW|draft)/i;

function baseStem(filename: string): string {
  const ext = path.extname(filename);
  let stem = path.basename(filename, ext);
  let prev = "";
  while (stem !== prev) {
    prev = stem;
    stem = stem.replace(VERSION_PATTERN, "").trim();
  }
  return stem.toLowerCase();
}

function hasVersionMarker(filename: string): boolean {
  return VERSION_PATTERN.test(filename);
}

export const versionEvidenceProvider = {
  id: "version-evidence",
  category: "version_chain" as const,
  collect(ctx: ConsolidationContext): ConsolidationFinding[] {
    const files = ctx.assets.filter((a) => a.is_directory === 0);
    const byDirStem = new Map<string, typeof files>();

    for (const file of files) {
      const dir = path.dirname(file.path).toLowerCase();
      const stem = baseStem(file.name);
      if (!stem) continue;
      const key = `${dir}::${stem}`;
      const list = byDirStem.get(key) ?? [];
      list.push(file);
      byDirStem.set(key, list);
    }

    const findings: ConsolidationFinding[] = [];
    let idx = 0;

    for (const [, members] of byDirStem) {
      if (members.length < 2) continue;
      const versionMarked = members.filter((m) => hasVersionMarker(m.name));
      if (versionMarked.length === 0 && members.length < 3) continue;

      members.sort((a, b) => (b.modified_at ?? "").localeCompare(a.modified_at ?? ""));
      const keeper = members[0];
      const dir = path.dirname(keeper.path);
      const projectName = path.basename(dir);
      const signals: EvidenceSignal[] = [
        { signal: "filename", weight: "high", detail: "Version suffix patterns detected" },
        { signal: "modified", weight: "medium", detail: "Modified date ordering suggests chain" },
        { signal: "workspace", weight: "medium", detail: "Same directory scope" },
      ];
      const evidence_percent = Math.min(98, 75 + members.length * 5);

      findings.push({
        finding_id: `ver-${++idx}-${baseStem(keeper.name).slice(0, 20)}`,
        category: "version_chain",
        title:
          projectName.toLowerCase().includes("contactlistsos")
            ? `Consolidate ${projectName} Versions`
            : `Version chain: ${baseStem(keeper.name)} (${members.length} files)`,
        priority: members.length >= 3 ? "high" : "medium",
        evidence_percent,
        evidence_signals: signals,
        executive_impact: "Reduces future decision friction",
        decision_friction: `Every time you search for this project, you decide which "${baseStem(keeper.name)}" file is current. Consolidating establishes one keeper (${keeper.name}).`,
        estimated_review_minutes: Math.max(2, members.length),
        estimated_benefit: `Eliminates ${members.length - 1} duplicate decision points`,
        reclaimable_bytes: members.slice(1).reduce((s, m) => s + (m.size_bytes ?? 0), 0),
        decision_points_eliminated: members.length - 1,
        risk: "medium",
        related_paths: members.map((m) => m.path),
        source: "Migration · VersionEvidenceProvider",
      });
    }

    return findings.sort((a, b) => b.decision_points_eliminated - a.decision_points_eliminated);
  },
};
