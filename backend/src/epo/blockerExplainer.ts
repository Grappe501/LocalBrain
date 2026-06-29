import type { BuildGraphNodeStatus, SliceStatus } from "@localbrain/shared";
import type { ParsedSlice } from "./checklistParser.js";

export function explainBlocker(
  slice: ParsedSlice,
  allSlices: Map<string, ParsedSlice>,
  dependencies: Record<string, string[]>,
): string | null {
  if (slice.status === "complete") return null;

  const deps = dependencies[slice.slice_id] ?? [];
  const incomplete = deps.filter((d) => {
    const dep = allSlices.get(d);
    return !dep || dep.status !== "complete";
  });

  if (incomplete.length > 0) {
    const names = incomplete
      .map((id) => {
        const s = allSlices.get(id);
        return s ? `${id} (${s.name})` : id;
      })
      .join(", ");
    return `Waiting on prerequisite slice(s): ${names}. Complete dependencies before starting ${slice.slice_id}.`;
  }

  if (slice.status === "spec_locked") {
    return `Spec is locked for ${slice.slice_id} — ready to implement when you assign the build. Dependencies are satisfied.`;
  }

  if (slice.status === "planned" || slice.status === "not_started") {
    return `${slice.slice_id} is planned but not started. Dependencies are satisfied — next actionable slice when prior work is complete.`;
  }

  if (slice.status === "in_progress") {
    return `${slice.slice_id} is in progress. Check Burt packet and completion criteria in the Program Office slice detail.`;
  }

  return null;
}

export function toLifecycleStatus(
  slice: ParsedSlice,
  allSlices: Map<string, ParsedSlice>,
  dependencies: Record<string, string[]>,
  currentSliceId: string | null,
  hasTests: boolean,
): BuildGraphNodeStatus {
  const blocked = isBlocked(slice.slice_id, allSlices, dependencies);

  if (slice.status === "complete") {
    return "released";
  }
  if (blocked) return "planned";
  if (slice.slice_id === currentSliceId || slice.status === "in_progress") {
    return hasTests ? "testing" : "in_progress";
  }
  if (slice.status === "spec_locked") {
    return "ready";
  }
  return "planned";
}

export function isBlocked(
  sliceId: string,
  allSlices: Map<string, ParsedSlice>,
  dependencies: Record<string, string[]>,
): boolean {
  const deps = dependencies[sliceId] ?? [];
  return deps.some((d) => {
    const dep = allSlices.get(d);
    return !dep || dep.status !== "complete";
  });
}

/** @deprecated Use toLifecycleStatus */
export function toGraphStatus(
  status: SliceStatus,
  blocked: boolean,
): BuildGraphNodeStatus {
  if (status === "complete") return "released";
  if (blocked) return "planned";
  if (status === "in_progress") return "in_progress";
  if (status === "spec_locked") return "ready";
  return "planned";
}
