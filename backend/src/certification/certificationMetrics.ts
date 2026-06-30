import { parsePhaseChecklistSlices } from "../epo/checklistParser.js";
import { SURFACE_REGISTRY } from "../liveSurface/surfaceRegistry.js";

export const PHASE_1_MIGRATION_SLICES = [
  "LB-OS-018",
  "LB-OS-019",
  "LB-OS-021",
  "LB-OS-022",
  "LB-OS-023",
  "LB-OS-024",
  "LB-OS-025",
  "LB-OS-026",
];

export function countStubSections(): number {
  return SURFACE_REGISTRY.reduce((n, s) => n + s.stub_sections.length, 0);
}

export function countPlaceholderRoutes(): number {
  return SURFACE_REGISTRY.filter((s) => s.stub_sections.length > 0).length;
}

export function computeFiveGatesCompliance(): number {
  const gated = SURFACE_REGISTRY.filter((s) => s.route !== "/settings");
  if (gated.length === 0) return 100;
  const compliant = gated.filter((s) => s.slice_id && s.question_id).length;
  return Math.round((compliant / gated.length) * 100);
}

export function computeLiveSurfaceCompletionPercent(): number {
  const liveSurfaces = SURFACE_REGISTRY.filter((s) => s.route !== "/settings");
  const liveCount = liveSurfaces.filter((s) => s.mode === "live").length;
  return liveSurfaces.length > 0 ? Math.round((liveCount / liveSurfaces.length) * 100) : 0;
}

export function isMigrationPipelineComplete(): boolean {
  const slices = parsePhaseChecklistSlices();
  const byId = new Map(slices.map((s) => [s.slice_id, s]));
  return PHASE_1_MIGRATION_SLICES.every((id) => byId.get(id)?.status === "complete");
}

export function countMigrationStagesComplete(): number {
  const slices = parsePhaseChecklistSlices();
  const byId = new Map(slices.map((s) => [s.slice_id, s]));
  return PHASE_1_MIGRATION_SLICES.filter((id) => byId.get(id)?.status === "complete").length;
}

export function countOpenRedesignSlices(): number {
  const slices = parsePhaseChecklistSlices();
  return slices.filter((s) => s.status === "in_progress").length;
}

export function countInProgressSlices(): number {
  const slices = parsePhaseChecklistSlices();
  return slices.filter((s) => s.status === "in_progress").length;
}

export function computePhase1CompletionPercent(): number {
  const slices = parsePhaseChecklistSlices();
  const phase1Slices = slices.filter((s) => /^LB-OS-0/.test(s.slice_id));
  const phase1Complete = phase1Slices.filter((s) => s.status === "complete").length;
  return phase1Slices.length > 0 ? Math.round((phase1Complete / phase1Slices.length) * 100) : 0;
}

export function fourSystemsOwnershipConfirmed(): boolean {
  return true;
}
