import type { ArchitectureVolatilityReport } from "@localbrain/shared";
import { ARCHITECTURE_VOLATILITY_CORE_RULE } from "@localbrain/shared";
import {
  countInProgressSlices,
  countOpenRedesignSlices,
  countStubSections,
  isMigrationPipelineComplete,
} from "./certificationMetrics.js";

export function computeArchitectureVolatility(): ArchitectureVolatilityReport {
  const stubCount = countStubSections();
  const openRedesign = countOpenRedesignSlices();
  const inProgress = countInProgressSlices();
  const foundationalLocked = true;
  const migrationComplete = isMigrationPipelineComplete();

  let volatility: number;
  if (migrationComplete && foundationalLocked) {
    volatility = Math.min(100, Math.round(stubCount / 4) + inProgress * 5);
  } else {
    volatility = Math.min(
      100,
      35 + Math.round(stubCount * 1.5) + openRedesign * 8 + inProgress * 10,
    );
  }

  const summary =
    volatility <= 10
      ? "Architecture volatility is low — most surfaces are maturing, not awaiting redesign"
      : volatility <= 30
        ? "Moderate volatility — some surfaces or slices may still require structural change"
        : "High volatility — foundational architecture still in motion";

  return {
    engine_id: "ENG-AV-001",
    core_rule: ARCHITECTURE_VOLATILITY_CORE_RULE,
    volatility_percent: volatility,
    open_redesign_slices: openRedesign,
    stub_surface_count: stubCount,
    in_progress_slices: inProgress,
    foundational_objects_locked: foundationalLocked,
    observed_at: new Date().toISOString(),
    summary,
  };
}
