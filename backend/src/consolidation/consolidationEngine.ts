import type {
  IntelligenceCardCategory,
  IntelligenceScores,
} from "@localbrain/shared";
import type { ConsolidationFinding } from "./types.js";

const CATEGORY_LABELS: Record<ConsolidationFinding["category"], string> = {
  duplicate_file: "Duplicate File",
  version_chain: "Version Chain",
  folder_consolidation: "Folder Consolidation",
  archive_opportunity: "Archive Candidate",
  workspace_orphan: "Inactive Workspace",
};

export function categoryLabel(category: ConsolidationFinding["category"]): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function toCardCategory(category: ConsolidationFinding["category"]): IntelligenceCardCategory {
  return category;
}

export function computeScores(finding: ConsolidationFinding): IntelligenceScores {
  const riskMap = { low: 15, medium: 45, high: 75 };
  const priorityBoost =
    finding.priority === "critical" ? 15 : finding.priority === "high" ? 10 : finding.priority === "medium" ? 5 : 0;

  return {
    importance: clamp(finding.evidence_percent * 0.6 + priorityBoost + Math.min(20, finding.reclaimable_bytes / (1024 ** 3))),
    confidence: finding.evidence_percent,
    urgency: clamp(
      finding.category === "archive_opportunity" ? 40 : finding.category === "workspace_orphan" ? 55 : 35 + priorityBoost,
    ),
    effort: clamp(100 - finding.estimated_review_minutes * 8),
    expected_benefit: clamp(
      40 +
        Math.min(30, finding.decision_points_eliminated * 5) +
        Math.min(25, finding.reclaimable_bytes / (512 * 1024 ** 2)),
    ),
    decision_friction_reduction: clamp(
      finding.category === "version_chain" || finding.category === "folder_consolidation" ? 85 : 60,
    ),
    risk: riskMap[finding.risk],
  };
}

export function rankFindings(findings: ConsolidationFinding[]): ConsolidationFinding[] {
  return [...findings].sort((a, b) => {
    const scoreA = compositeRank(a);
    const scoreB = compositeRank(b);
    return scoreB - scoreA;
  });
}

function compositeRank(f: ConsolidationFinding): number {
  const scores = computeScores(f);
  return (
    scores.importance * 0.25 +
    scores.confidence * 0.2 +
    scores.decision_friction_reduction * 0.2 +
    scores.expected_benefit * 0.15 +
    f.reclaimable_bytes / (1024 ** 3) +
    (100 - scores.risk) * 0.1
  );
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function riskBand(finding: ConsolidationFinding): "high" | "medium" | "low" {
  return finding.risk;
}
