import type { LivingWorkspace } from "@localbrain/shared";
import { computeBuildState } from "../buildState/buildStateEngine.js";
import { getExecutiveIntelligenceEraSnapshot } from "../buildState/executiveIntelligenceEraMetrics.js";
import { getMemoryOsProgressSnapshot } from "../buildState/memoryOsSpecMetrics.js";

/** Overlay authoritative build state onto the localbrain meta workspace. */
export function projectWorkspaceLive(ws: LivingWorkspace): LivingWorkspace {
  if (ws.workspace_id !== "localbrain") {
    return ws;
  }

  const state = computeBuildState();
  const mem = getMemoryOsProgressSnapshot();
  const ei = getExecutiveIntelligenceEraSnapshot();
  const completed = state.slices.filter((s) => s.status === "complete").map((s) => s.slice_id);
  const activeEngMem = mem.wave1_active_slice
    ? `${mem.wave1_active_slice.slice_code} ${mem.wave1_active_slice.object}`
    : null;

  const foundationComplete = mem.wave1_complete_count >= mem.wave1_slices.length && mem.wave1_slices.length > 0;

  return {
    ...ws,
    status: "active",
    current_focus: foundationComplete
      ? ei.building_today
      : activeEngMem
        ? `${mem.building_today} · ${state.current_slice_id ?? "LB-OS-027"}`
        : state.current_slice_id
          ? `${state.current_slice_id} — ${state.current_slice_name ?? "in progress"}`
          : ws.current_focus,
    profile: {
      ...ws.profile,
      mission: ws.profile.mission ?? "Build Steve's Executive Operating System",
      current_phase: foundationComplete
        ? ei.retrieval_complete
          ? `Executive Intelligence Era · ENG-EI-001 COMPLETE · ENG-EI-002 Executive Brief`
          : ei.implementation_started
            ? `Executive Intelligence Era · ENG-EI-001 ${ei.implementation_phase} phase · ${ei.impl_slices_complete.join(" · ")} COMPLETE`
            : ei.doctrine_frozen
              ? `Executive Intelligence Era · ei-doctrine-v1.0 FROZEN · ENG-EI-001 AUTHORIZED`
              : `Executive Intelligence Era · ${ei.pre_impl_progress_percent}% pre-implementation`
        : `Institutional Cognition Foundation · ${mem.wave1_complete_count}/5 substrates`,
      completed_slices: completed.slice(-15),
      active_slice: foundationComplete
        ? ei.smallest_next_slice
        : activeEngMem ?? state.current_slice_id ?? ws.profile.active_slice,
      next_slices: foundationComplete
        ? ei.retrieval_complete
          ? ["ENG-EI-002 Executive Brief", "Communications Office"]
          : ei.implementation_started
            ? ["ENG-EI-001 charter acceptance (A1–A9)", "Communications Office"]
            : ei.doctrine_frozen
              ? ["ENG-EI-001.1 Constitutional Retrieval", "Communications Office"]
              : ["EI-001 doctrine freeze (ei-doctrine-v1.0)", "ENG-EI-001 Constitutional Retrieval"]
        : state.current_sprint.queued.length > 0
          ? state.current_sprint.queued
          : mem.wave1_active_slice
            ? ["ENG-MEM-001.5 governance arc completion"]
            : (ws.profile.next_slices ?? []),
      chief_of_staff_summary: foundationComplete
        ? ei.summary
        : mem.summary ?? state.gate_text ?? ws.profile.chief_of_staff_summary,
      recommended_next_action: foundationComplete
        ? ei.smallest_next_slice
        : mem.wave1_active_slice
          ? `Implement ${mem.wave1_active_slice.slice_code} — completes Institutional Cognition Foundation`
          : state.next_slice_id
            ? `Next slice: ${state.next_slice_id} — ${state.next_slice_name ?? ""}`
            : ws.profile.recommended_next_action,
    },
    updated_at: new Date().toISOString(),
  };
}
