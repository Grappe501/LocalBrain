import path from "node:path";
import type { ConsolidationContext, ConsolidationFinding, EvidenceSignal } from "../types.js";

const FOLDER_SUFFIX =
  /\s+(old|backup|copy|archive|archived|\d{4}|202\d)\s*$/i;

function siblingFolderGroups(ctx: ConsolidationContext): Map<string, string[]> {
  const dirs = ctx.assets.filter((a) => a.is_directory === 1);
  const parentMap = new Map<string, string[]>();

  for (const dir of dirs) {
    const parent = path.dirname(dir.path).toLowerCase();
    const name = path.basename(dir.path);
    const list = parentMap.get(parent) ?? [];
    list.push(name);
    parentMap.set(parent, list);
  }

  const groups = new Map<string, string[]>();
  for (const dir of dirs) {
    const name = path.basename(dir.path);
    const parent = path.dirname(dir.path);
    const siblings = parentMap.get(parent.toLowerCase()) ?? [];
    const base = name.replace(FOLDER_SUFFIX, "").trim();
    const related = siblings.filter(
      (s) =>
        s !== name &&
        (s.replace(FOLDER_SUFFIX, "").trim().toLowerCase() === base.toLowerCase() ||
          FOLDER_SUFFIX.test(s) ||
          FOLDER_SUFFIX.test(name)),
    );
    if (related.length === 0) continue;
    const fullPaths = [dir.path, ...related.map((r) => path.join(parent, r))];
    const key = `${parent.toLowerCase()}::${base.toLowerCase()}`;
    if (!groups.has(key)) groups.set(key, [...new Set(fullPaths)]);
  }
  return groups;
}

export const folderEvidenceProvider = {
  id: "folder-evidence",
  category: "folder_consolidation" as const,
  collect(ctx: ConsolidationContext): ConsolidationFinding[] {
    const findings: ConsolidationFinding[] = [];
    let idx = 0;

    for (const [, paths] of siblingFolderGroups(ctx)) {
      if (paths.length < 2) continue;
      const primary = paths[0];
      const label = path.basename(primary);
      const signals: EvidenceSignal[] = [
        { signal: "path_proximity", weight: "high", detail: "Sibling folders under same parent" },
        { signal: "filename", weight: "medium", detail: "Naming pattern suggests copies/old versions" },
      ];

      findings.push({
        finding_id: `fld-${++idx}-${label.toLowerCase().slice(0, 16)}`,
        category: "folder_consolidation",
        title: `Merge ${paths.length} related folders near ${label}`,
        priority: paths.length >= 3 ? "high" : "medium",
        evidence_percent: Math.min(95, 68 + paths.length * 6),
        evidence_signals: signals,
        executive_impact: "High workspace simplification",
        decision_friction: `Which folder is current for "${label}"? Consolidating reduces search and navigation overhead.`,
        estimated_review_minutes: paths.length * 2,
        estimated_benefit: `Simplifies ${paths.length} workspace roots into one logical location`,
        reclaimable_bytes: 0,
        decision_points_eliminated: paths.length - 1,
        risk: "medium",
        related_paths: paths,
        source: "Migration · FolderEvidenceProvider",
      });
    }

    const audit = ctx.audit;
    if (audit) {
      for (const unclaimed of (audit.unclaimed_folders ?? []).slice(0, 5)) {
        findings.push({
          finding_id: `fld-unclaimed-${++idx}`,
          category: "workspace_orphan",
          title: `Inactive workspace root: ${unclaimed.path}`,
          priority: "medium",
          evidence_percent: 72,
          evidence_signals: [{ signal: "workspace", weight: "medium", detail: "No LivingWorkspace claim" }],
          executive_impact: "Clarifies workspace ownership",
          decision_friction: unclaimed.reason,
          estimated_review_minutes: 5,
          estimated_benefit: "Links or archives orphan root to a LivingWorkspace",
          reclaimable_bytes: unclaimed.size_bytes ?? 0,
          decision_points_eliminated: 1,
          risk: "low",
          related_paths: [unclaimed.path],
          source: "Migration · FolderEvidenceProvider",
        });
      }

      for (const dup of (audit.duplicate_workspace_candidates ?? []).slice(0, 3)) {
        findings.push({
          finding_id: `fld-dupws-${++idx}`,
          category: "folder_consolidation",
          title: `Duplicate workspace roots: ${dup.workspace_ids.join(" / ")}`,
          priority: "high",
          evidence_percent: 80,
          evidence_signals: [{ signal: "workspace", weight: "high", detail: dup.reason }],
          executive_impact: "Reduces workspace fragmentation",
          decision_friction: dup.reason,
          estimated_review_minutes: 8,
          estimated_benefit: "One canonical workspace root per project",
          reclaimable_bytes: 0,
          decision_points_eliminated: dup.workspace_ids.length - 1,
          risk: "medium",
          related_paths: dup.overlapping_paths,
          source: "Migration · FolderEvidenceProvider",
        });
      }

      for (const stale of (audit.stale_candidates ?? []).filter((s) => (s.days_since_activity ?? 0) > 540).slice(0, 5)) {
        findings.push({
          finding_id: `arc-${++idx}`,
          category: "archive_opportunity",
          title: `Archive candidate: ${stale.folder_path}`,
          priority: "low",
          evidence_percent: 85,
          evidence_signals: [
            { signal: "modified", weight: "high", detail: `${stale.days_since_activity} days since activity` },
          ],
          executive_impact: "Long-term storage efficiency",
          decision_friction: "Stale folders add noise when browsing H: — archive candidates reduce clutter.",
          estimated_review_minutes: 3,
          estimated_benefit: `Archive ${formatBytes(stale.size_bytes ?? 0)} with low reference risk`,
          reclaimable_bytes: stale.size_bytes ?? 0,
          decision_points_eliminated: 1,
          risk: "low",
          related_paths: [stale.folder_path],
          source: "Migration · FolderEvidenceProvider",
        });
      }
    }

    return findings;
  },
};

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
