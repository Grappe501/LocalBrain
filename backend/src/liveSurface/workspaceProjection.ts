import type { LivingWorkspace } from "@localbrain/shared";
import { computeBuildState } from "../buildState/buildStateEngine.js";

/** Overlay authoritative build state onto the localbrain meta workspace. */
export function projectWorkspaceLive(ws: LivingWorkspace): LivingWorkspace {
  if (ws.workspace_id !== "localbrain") {
    return ws;
  }

  const state = computeBuildState();
  const completed = state.slices.filter((s) => s.status === "complete").map((s) => s.slice_id);

  return {
    ...ws,
    status: "active",
    current_focus: state.current_slice_id
      ? `${state.current_slice_id} — ${state.current_slice_name ?? "in progress"}`
      : ws.current_focus,
    profile: {
      ...ws.profile,
      mission: ws.profile.mission ?? "Build Steve's Executive Operating System",
      current_phase: state.current_phase_label,
      completed_slices: completed.slice(-15),
      active_slice: state.current_slice_id ?? ws.profile.active_slice,
      next_slices:
        state.current_sprint.queued.length > 0
          ? state.current_sprint.queued
          : (ws.profile.next_slices ?? []),
      chief_of_staff_summary:
        state.gate_text ?? ws.profile.chief_of_staff_summary,
      recommended_next_action: state.next_slice_id
        ? `Next slice: ${state.next_slice_id} — ${state.next_slice_name ?? ""}`
        : ws.profile.recommended_next_action,
    },
    updated_at: new Date().toISOString(),
  };
}
