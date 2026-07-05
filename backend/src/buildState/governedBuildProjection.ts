import type { BuildStateSnapshot } from "./buildStateEngine.js";
import { getGovernedPlatformSnapshot, isGovernedPlatformEraActive } from "./governedPlatformMetrics.js";

/** Override EPO slice/phase fields when governed platform era is active. */
export function applyGovernedBuildOverrides(state: BuildStateSnapshot): BuildStateSnapshot {
  if (!isGovernedPlatformEraActive()) {
    return state;
  }

  const gp = getGovernedPlatformSnapshot();

  return {
    ...state,
    current_phase_label: `${gp.phase_label} · ${gp.platform_readiness_level} · Gate: PRL-4`,
    current_slice_id: "PRL-4",
    current_slice_name: "Internal Operator Validated (OPERATOR-WALKTHROUGH-001)",
    next_slice_id: "PRL-4-EXIT-CONTRACT",
    next_slice_name: "PRL-4 Exit Contract Assessment",
    gate_text: gp.critical_path_detail,
    current_sprint: {
      completed: [
        "OPERATOR-WALKTHROUGH-001",
        "CONTACT-V3-021",
        "CONTACT-V3-100",
        "CPAT-v1.0",
      ],
      in_progress: ["PRL-4"],
      queued: [
        "PRL-4-EXIT-CONTRACT",
        "COMMERCIAL-BETA-PREP",
        "PRL-5",
        "PRL-6",
      ],
    },
  };
}
