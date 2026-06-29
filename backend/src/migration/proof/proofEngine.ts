import type {
  ProofCertificateResult,
  ProofContext,
  ProofProvider,
  ProofScore,
  RecommendationConfidence,
} from "@localbrain/shared";
import {
  PROOF_CERTIFICATION_THRESHOLDS,
  PROOF_DIMENSION_LABELS,
} from "@localbrain/shared";
import { executiveProofProvider } from "./providers/executiveProofProvider.js";
import { performanceProofProvider } from "./providers/performanceProofProvider.js";
import { policyProofProvider } from "./providers/policyProofProvider.js";
import { recoveryProofProvider } from "./providers/recoveryProofProvider.js";
import { referenceProofProvider } from "./providers/referenceProofProvider.js";
import { structuralProofProvider } from "./providers/structuralProofProvider.js";

export const PROOF_PROVIDERS: ProofProvider[] = [
  structuralProofProvider,
  referenceProofProvider,
  recoveryProofProvider,
  performanceProofProvider,
  executiveProofProvider,
  policyProofProvider,
];

export function aggregateProofScore(ctx: ProofContext): ProofScore {
  const dimension_results = PROOF_PROVIDERS.map((p) => p.evaluate(ctx));
  const total_points = dimension_results.reduce((s, d) => s + d.earned_points, 0);
  const max_points = dimension_results.reduce((s, d) => s + d.max_points, 0);
  const percent = max_points > 0 ? Math.round((total_points / max_points) * 100) : 0;

  const certified = percent >= PROOF_CERTIFICATION_THRESHOLDS.certified_min_percent;
  const recommendation_confidence: RecommendationConfidence = certified
    ? "high"
    : percent >= PROOF_CERTIFICATION_THRESHOLDS.conditional_min_percent
      ? "medium"
      : "low";

  return {
    total_points,
    max_points,
    percent,
    dimension_results,
    certified,
    recommendation_confidence,
  };
}

export function certificateResultFromScore(percent: number): ProofCertificateResult {
  if (percent >= PROOF_CERTIFICATION_THRESHOLDS.certified_min_percent) return "certified";
  if (percent >= PROOF_CERTIFICATION_THRESHOLDS.conditional_min_percent) return "conditional";
  return "rejected";
}

export function proofDimensionCatalog() {
  return PROOF_PROVIDERS.map((p) => ({
    id: p.id,
    label: PROOF_DIMENSION_LABELS[p.id],
    max_points: p.max_points,
  }));
}
