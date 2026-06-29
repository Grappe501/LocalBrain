import type {
  ConsolidationOpportunitySummary,
  ConsolidationRiskAssessment,
  ExecutiveConsolidationBriefing,
  IntelligenceCardCategory,
  OverallOpportunity,
  WorkspaceSimplificationLevel,
} from "@localbrain/shared";
import type { ConsolidationFinding } from "./types.js";
import { rankFindings, riskBand } from "./consolidationEngine.js";
import { computeConsolidationScore } from "./consolidationScore.js";
import { findingsToCards } from "../intelligence/cardComposer.js";
import type { ConsolidationContext } from "./types.js";
import { collectAllFindings } from "./evidenceEngine.js";

const SAFETY_FOOTER = "Nothing has been changed.";

export function buildExecutiveConsolidationBriefing(
  ctx: ConsolidationContext,
): ExecutiveConsolidationBriefing {
  const rawFindings = collectAllFindings(ctx);
  const activeFindings = rawFindings.filter((f) => !ctx.dismissed_ids.has(f.finding_id));
  const ranked = rankFindings(activeFindings);
  const priority_cards = findingsToCards(ranked.slice(0, 12), ctx.dismissed_ids);

  const totalBytes = ctx.assets.reduce((s, a) => s + (a.size_bytes ?? 0), 0);
  const orphanCount = ctx.assets.filter((a) => !a.workspace_id).length;
  const consolidation_score = computeConsolidationScore(activeFindings, totalBytes, orphanCount);

  const reclaimable = activeFindings.reduce((s, f) => s + f.reclaimable_bytes, 0);
  const avgConfidence =
    activeFindings.length > 0
      ? Math.round(activeFindings.reduce((s, f) => s + f.evidence_percent, 0) / activeFindings.length)
      : 0;
  const reviewMinutes = priority_cards.reduce((s, c) => s + c.estimated_review_minutes, 0);

  const risk_assessment = buildRiskAssessment(activeFindings);
  const overall_opportunity = buildOverallOpportunity(
    reclaimable,
    activeFindings,
    avgConfidence,
    reviewMinutes,
  );

  const card_count_by_category = countByCategory(activeFindings);
  const consolidation_opportunity = buildOpportunitySummary(
    consolidation_score,
    overall_opportunity,
    risk_assessment,
    priority_cards[0]?.decision_friction ?? null,
  );

  return {
    slice_id: "LB-OS-020",
    engine_id: "ENG-CNS-001",
    read_only: true,
    nothing_changed: true,
    safety_footer: SAFETY_FOOTER,
    observed_at: ctx.observed_at,
    inventory_gate: ctx.audit?.inventory_complete ?? false,
    consolidation_score,
    overall_opportunity,
    risk_assessment,
    priority_cards,
    card_count_by_category,
    consolidation_opportunity,
  };
}

function buildRiskAssessment(findings: ConsolidationFinding[]): ConsolidationRiskAssessment {
  return {
    high: findings.filter((f) => riskBand(f) === "high").length,
    medium: findings.filter((f) => riskBand(f) === "medium").length,
    low: findings.filter((f) => riskBand(f) === "low").length,
  };
}

function buildOverallOpportunity(
  reclaimable: number,
  findings: ConsolidationFinding[],
  confidence: number,
  reviewMinutes: number,
): OverallOpportunity {
  const folderCount = findings.filter(
    (f) => f.category === "folder_consolidation" || f.category === "workspace_orphan",
  ).length;

  let simplification: WorkspaceSimplificationLevel = "low";
  if (folderCount >= 5) simplification = "high";
  else if (folderCount >= 2) simplification = "medium";

  const frictionBefore =
    findings.length > 10 ? "Medium" : findings.length > 3 ? "Medium" : "Low";
  const frictionAfter = findings.length > 0 ? "Low" : "Low";

  return {
    reclaimable_storage_bytes: reclaimable,
    workspace_simplification: simplification,
    duplicate_confidence_percent: confidence,
    estimated_review_minutes: Math.max(1, reviewMinutes),
    decision_friction_before: frictionBefore,
    decision_friction_after: frictionAfter,
  };
}

function countByCategory(
  findings: ConsolidationFinding[],
): Record<IntelligenceCardCategory, number> {
  const counts: Record<string, number> = {};
  for (const f of findings) {
    counts[f.category] = (counts[f.category] ?? 0) + 1;
  }
  return counts as Record<IntelligenceCardCategory, number>;
}

function buildOpportunitySummary(
  score: ExecutiveConsolidationBriefing["consolidation_score"],
  opportunity: OverallOpportunity,
  risk: ConsolidationRiskAssessment,
  topPriority: string | null,
): ConsolidationOpportunitySummary {
  return {
    consolidation_score: score.score,
    score_band: score.band,
    trend_label: score.trend_label,
    reclaimable_storage_bytes: opportunity.reclaimable_storage_bytes,
    workspace_simplification: opportunity.workspace_simplification,
    duplicate_confidence_percent: opportunity.duplicate_confidence_percent,
    estimated_review_minutes: opportunity.estimated_review_minutes,
    risk_assessment: risk,
    top_priority_summary: topPriority,
    executive_summary: SAFETY_FOOTER,
    briefing_path: "/migration/consolidation",
  };
}
