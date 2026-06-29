import type { ExecutiveIntelligenceCard, EvidenceSignalPublic } from "@localbrain/shared";
import type { ConsolidationFinding } from "../consolidation/types.js";
import {
  categoryLabel,
  computeScores,
  toCardCategory,
} from "../consolidation/consolidationEngine.js";

export function findingToCard(
  finding: ConsolidationFinding,
  dismissed: boolean,
): ExecutiveIntelligenceCard {
  return {
    card_id: finding.finding_id,
    title: finding.title,
    category: toCardCategory(finding.category),
    category_label: categoryLabel(finding.category),
    source: finding.source,
    priority: finding.priority,
    scores: computeScores(finding),
    evidence_percent: finding.evidence_percent,
    evidence_signals: finding.evidence_signals.map(
      (s): EvidenceSignalPublic => ({
        signal: s.signal,
        weight: s.weight,
        detail: s.detail,
      }),
    ),
    executive_impact: finding.executive_impact,
    decision_friction: finding.decision_friction,
    estimated_review_minutes: finding.estimated_review_minutes,
    estimated_benefit: finding.estimated_benefit,
    reclaimable_bytes: finding.reclaimable_bytes > 0 ? finding.reclaimable_bytes : null,
    decision_points_eliminated: finding.decision_points_eliminated,
    pipeline: {
      recommendation: "complete",
      simulation: "available",
      proposal: "not_generated",
      approval: "not_applicable",
      execution: "not_applicable",
      verification: "not_applicable",
      learning: "not_applicable",
    },
    read_only: true,
    related_paths: finding.related_paths,
    dismissed,
  };
}

export function findingsToCards(
  findings: ConsolidationFinding[],
  dismissedIds: Set<string>,
): ExecutiveIntelligenceCard[] {
  return findings.map((f) => findingToCard(f, dismissedIds.has(f.finding_id)));
}
