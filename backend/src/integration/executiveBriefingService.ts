import { buildExecutiveOfficeExperience } from "@localbrain/shared";
import { computeBuildState } from "../buildState/buildStateEngine.js";
import { getGovernedPlatformSnapshot, isGovernedPlatformEraActive } from "../buildState/governedPlatformMetrics.js";
import { getConsolidationBriefing } from "../consolidation/consolidationService.js";
import { runGraphIntegrityCertification } from "../integration/executiveExperienceAudit.js";
import { runV1Acceptance } from "../v1/v1SpineVerifier.js";
import {
  getActiveWorkspaceId,
  getWorkspace,
} from "../workspaces/workspaceRegistry.js";
import { projectWorkspaceLive } from "../liveSurface/workspaceProjection.js";
import type { ExecutiveBriefingSignals } from "@localbrain/shared";

export function collectExecutiveBriefingSignals(): ExecutiveBriefingSignals {
  const v1 = runV1Acceptance();
  const graph = runGraphIntegrityCertification();
  let consolidation_score: number | null = null;
  let consolidation_band: string | null = null;
  try {
    const opp = getConsolidationBriefing().consolidation_opportunity;
    consolidation_score = opp.consolidation_score;
    consolidation_band = opp.score_band;
  } catch {
    consolidation_score = null;
  }

  const wsId = getActiveWorkspaceId();
  const rawWs = wsId ? getWorkspace(wsId) : null;
  const ws = rawWs ? projectWorkspaceLive(rawWs) : null;
  const build = computeBuildState();
  const governed = isGovernedPlatformEraActive() ? getGovernedPlatformSnapshot() : null;

  return {
    v1_overall_pass: v1.overall_pass,
    v1_failed_checks: v1.checks.filter((c) => !c.passed).map((c) => c.label),
    consolidation_score,
    consolidation_band,
    graph_integrity_pass: graph.certified,
    workspace_id: ws?.workspace_id ?? null,
    workspace_focus: ws?.current_focus ?? null,
    current_build_slice: build.current_slice_id,
    governed_era_active: governed?.era_active ?? false,
    platform_readiness_level: governed?.platform_readiness_level ?? null,
    prime_directive: governed ? "Protect the evidence." : null,
    current_gate: governed ? "PRL-4 — Internal Operator Validated" : null,
    building_today: governed?.building_today ?? null,
  };
}

export function getExecutiveOfficeExperience() {
  const signals = collectExecutiveBriefingSignals();
  const experience = buildExecutiveOfficeExperience(signals);
  return { experience, signals, read_only: true };
}
