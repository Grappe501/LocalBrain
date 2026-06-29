import { parsePhaseSections } from "./checklistParser.js";
import { parseSliceRegistry } from "../buildState/sliceRegistry.js";

/** @deprecated Use parseSliceRegistry().dependencies */
export function getSliceDependencies(): Record<string, string[]> {
  return parseSliceRegistry().dependencies;
}

export const SLICE_DEPENDENCIES: Record<string, string[]> = new Proxy(
  {} as Record<string, string[]>,
  {
    get(_target, prop: string) {
      return parseSliceRegistry().dependencies[prop] ?? [];
    },
  },
);

/** @deprecated Use parsePhaseSections() from checklistParser */
export const EPO_PHASES = parsePhaseSections().map((p) => ({
  phase_id: p.phase_id,
  label: p.label,
  slice_ids: p.slice_ids,
  objectives: p.gate_text ?? p.label,
}));
