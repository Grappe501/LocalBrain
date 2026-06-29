import type { WritingScore } from "@localbrain/shared";
import { WRITING_MODES } from "./writingModes.js";
import { WRITING_VOICES } from "./voiceLibrary.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { modesForWorkspaceType } from "./writingModes.js";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function labelFromScore(score: number): WritingScore["label"] {
  if (score >= 85) return "strong";
  if (score >= 70) return "solid";
  return "needs_attention";
}

export function computeWritingScore(): WritingScore {
  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);
  const writingProjects = workspaces.filter((w) =>
    ["novel", "campaign", "personal", "executive", "meta"].includes(w.workspace_type),
  );

  const modeCoverage = clamp((WRITING_MODES.length / 6) * 100);
  const voiceLibrary = clamp((WRITING_VOICES.length / 7) * 100);
  const projectLinkage = clamp(Math.min(100, writingProjects.length * 20));
  const rootsConfigured = clamp(
    workspaces.filter((w) => w.filesystem_roots.length > 0).length * 25,
  );
  const focusSet = clamp(workspaces.filter((w) => w.current_focus.trim()).length * 20);
  const safetyPosture = 100;

  const factors = [
    {
      id: "mode_coverage",
      name: "Writing Modes",
      score: modeCoverage,
      weight: 0.15,
      detail: `${WRITING_MODES.length} modes cataloged`,
    },
    {
      id: "voice_library",
      name: "Voice Library",
      score: voiceLibrary,
      weight: 0.2,
      detail: `${WRITING_VOICES.length} voices defined`,
    },
    {
      id: "project_linkage",
      name: "Project Linkage",
      score: projectLinkage,
      weight: 0.15,
      detail: `${writingProjects.length} writing-relevant workspaces`,
    },
    {
      id: "source_awareness",
      name: "Source Awareness",
      score: rootsConfigured,
      weight: 0.15,
      detail: "Filesystem roots + Knowledge Explorer integration",
    },
    {
      id: "draft_pipeline",
      name: "Draft Pipeline",
      score: focusSet,
      weight: 0.15,
      detail: "Preview cockpit ready — approval-gated saves only",
    },
    {
      id: "safety",
      name: "Publish Safety",
      score: safetyPosture,
      weight: 0.2,
      detail: "No auto-publish · no social · no email · no silent writes",
    },
  ];

  const weightSum = factors.reduce((s, f) => s + f.weight, 0);
  const score = clamp(factors.reduce((sum, f) => sum + f.score * f.weight, 0) / weightSum);
  const label = labelFromScore(score);

  return {
    score,
    label,
    summary:
      label === "strong"
        ? "Narrative engine, voices, and draft cockpit are ready for high-value writing work."
        : label === "solid"
          ? "Writing Department foundation is in place — connect more project roots for source-aware drafts."
          : "Configure workspaces and sources before heavy drafting.",
    factors,
  };
}

export function buildNarrativeCatalog() {
  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);
  const entries = [
    ...WRITING_MODES.map((m) => ({
      id: m.id,
      kind: "mode" as const,
      label: m.label,
      links: m.example_outputs,
    })),
    ...WRITING_VOICES.map((v) => ({
      id: v.id,
      kind: "voice" as const,
      label: v.label,
      links: v.best_for,
    })),
    ...workspaces.map((w) => ({
      id: w.workspace_id,
      kind: "workspace" as const,
      label: w.title,
      links: modesForWorkspaceType(w.workspace_type),
    })),
  ];
  return entries;
}
