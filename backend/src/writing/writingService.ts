import type { WritingOverview } from "@localbrain/shared";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { WRITING_MODES, modesForWorkspaceType } from "./writingModes.js";
import { WRITING_VOICES } from "./voiceLibrary.js";
import { computeWritingScore, buildNarrativeCatalog } from "./writingScore.js";
import { WRITING_SPECIALISTS } from "./specialistRegistry.js";

export const WRITING_GUARDRAILS = [
  "No auto-publishing",
  "No social posting",
  "No email sending",
  "No file writes without approval (LB-OS-010)",
  "Draft and preview only in V1",
  "Source-aware when using files — permission engine enforced",
];

export function getWritingOverview(): WritingOverview {
  const score = computeWritingScore();
  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);

  const projects = workspaces
    .filter((w) =>
      ["novel", "campaign", "personal", "executive", "meta", "research"].includes(
        w.workspace_type,
      ),
    )
    .map((w) => ({
      workspace_id: w.workspace_id,
      title: w.title,
      workspace_type: w.workspace_type,
      status: w.status,
      current_focus: w.current_focus,
      suggested_modes: modesForWorkspaceType(w.workspace_type),
    }));

  return {
    writing_score: score,
    guardrails: WRITING_GUARDRAILS,
    chief_recommendation: {
      what: "Pick a mode + voice, preview a draft, then approve any save",
      why: "Writing Department is narrative engine first — publishing stays outside V1",
      confidence: "high",
      if_approved: "Propose file save via Actions queue when draft is ready",
    },
    modes: WRITING_MODES,
    voices: WRITING_VOICES,
    projects,
    narrative_catalog: buildNarrativeCatalog(),
    active_draft_count: 0,
    read_only: true,
    observed_at: new Date().toISOString(),
  };
}

export { previewDraft } from "./draftPreview.js";
export { listWritingSources } from "./writingSources.js";
export { computeWritingScore } from "./writingScore.js";
export { WRITING_MODES, WRITING_VOICES };
