import type { LivingWorkspace } from "@localbrain/shared";
import { computeBuildState } from "../buildState/buildStateEngine.js";
import { getMemoryOsProgressSnapshot } from "../buildState/memoryOsSpecMetrics.js";

/** Overlay authoritative build state onto the localbrain meta workspace. */
export function projectWorkspaceLive(ws: LivingWorkspace): LivingWorkspace {
  if (ws.workspace_id !== "localbrain") {
    return ws;
  }

  const state = computeBuildState();
  const mem = getMemoryOsProgressSnapshot();
  const completed = state.slices.filter((s) => s.status === "complete").map((s) => s.slice_id);
  const activeEngMem = mem.wave1_active_slice
    ? `${mem.wave1_active_slice.slice_code} ${mem.wave1_active_slice.object}`
    : null;

  const foundationComplete = mem.wave1_complete_count >= mem.wave1_slices.length && mem.wave1_slices.length > 0;

  return {
    ...ws,
    status: "active",
    current_focus: foundationComplete
      ? "Institutional Cognition Foundation COMPLETE · Executive Intelligence Era"
      : activeEngMem
        ? `${mem.building_today} · ${state.current_slice_id ?? "LB-OS-027"}`
        : state.current_slice_id
          ? `${state.current_slice_id} — ${state.current_slice_name ?? "in progress"}`
          : ws.current_focus,
    profile: {
      ...ws.profile,
      mission: ws.profile.mission ?? "Build Steve's Executive Operating System",
      current_phase: foundationComplete
        ? `${state.current_phase_label} · Wave 1 5/5 · Foundation COMPLETE`
        : `${state.current_phase_label} · Wave 1 ${mem.wave1_complete_count}/5`,
      completed_slices: completed.slice(-15),
      active_slice: foundationComplete
        ? "Executive Intelligence Era"
        : activeEngMem ?? state.current_slice_id ?? ws.profile.active_slice,
      next_slices:
        foundationComplete
          ? ["Executive Intelligence · retrieval · graph · advisory layer"]
          : state.current_sprint.queued.length > 0
            ? state.current_sprint.queued
            : mem.wave1_active_slice
              ? ["ENG-MEM-001.5 governance arc completion"]
              : (ws.profile.next_slices ?? []),
      chief_of_staff_summary: mem.summary ?? state.gate_text ?? ws.profile.chief_of_staff_summary,
      recommended_next_action: foundationComplete
        ? "Executive Intelligence Era authorized — build advisory cognition over deterministic substrates"
        : mem.wave1_active_slice
          ? `Implement ${mem.wave1_active_slice.slice_code} — completes Institutional Cognition Foundation`
          : state.next_slice_id
            ? `Next slice: ${state.next_slice_id} — ${state.next_slice_name ?? ""}`
            : ws.profile.recommended_next_action,
    },
    updated_at: new Date().toISOString(),
  };
}
