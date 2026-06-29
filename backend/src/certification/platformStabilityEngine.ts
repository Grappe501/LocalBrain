import type { PlatformStabilityReport } from "@localbrain/shared";
import { parsePhaseChecklistSlices } from "../epo/checklistParser.js";
import { SURFACE_REGISTRY } from "../liveSurface/surfaceRegistry.js";

const PHASE_1_MIGRATION_SLICES = [
  "LB-OS-018",
  "LB-OS-019",
  "LB-OS-021",
  "LB-OS-022",
  "LB-OS-023",
  "LB-OS-024",
  "LB-OS-025",
  "LB-OS-026",
];

export function computePlatformStability(): PlatformStabilityReport {
  const slices = parsePhaseChecklistSlices();
  const byId = new Map(slices.map((s) => [s.slice_id, s]));

  const migrationComplete = PHASE_1_MIGRATION_SLICES.every(
    (id) => byId.get(id)?.status === "complete",
  );

  const phase1Slices = slices.filter((s) => /^LB-OS-0/.test(s.slice_id));
  const phase1Complete = phase1Slices.filter((s) => s.status === "complete").length;
  const phase1Percent =
    phase1Slices.length > 0 ? Math.round((phase1Complete / phase1Slices.length) * 100) : 0;

  const stubCount = SURFACE_REGISTRY.reduce((n, s) => n + s.stub_sections.length, 0);
  const openRedesign = slices.filter(
    (s) => s.status === "in_progress" || s.status === "spec_locked",
  ).length;

  let stability: number;
  if (migrationComplete) {
    stability = 97 - Math.min(12, Math.floor(stubCount / 2) + openRedesign);
  } else {
    stability = 65 + Math.round(phase1Percent * 0.1) - Math.min(15, stubCount * 2);
  }
  stability = Math.max(0, Math.min(100, stability));

  let debtLabel: PlatformStabilityReport["architecture_debt_label"] = "low";
  if (stubCount > 10 || openRedesign > 5) debtLabel = "medium";
  if (stubCount > 18 || openRedesign > 12) debtLabel = "high";

  return {
    engine_id: "ENG-PST-001",
    slice_id: "LB-OS-019.5",
    stability_percent: stability,
    foundational_objects_locked: true,
    architecture_debt_label: debtLabel,
    open_redesign_items: openRedesign,
    phase_1_completion_percent: phase1Percent,
    certification_pipeline_complete: migrationComplete,
    observed_at: new Date().toISOString(),
    summary: migrationComplete
      ? "Phase 1 migration arc complete — architecture stable for v1.0 freeze"
      : "Phase 1 closing — monitor open slices and stub surfaces",
  };
}
