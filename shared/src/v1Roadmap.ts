/**
 * Frozen V1 roadmap — definition of success. Everything else → VERSION2_BACKLOG.
 */

import type { V1CriticalPathStep } from "./v1CommandCenter.js";

export const V1_ROADMAP_ITEMS: {
  id: string;
  label: string;
  critical_path_step: V1CriticalPathStep;
}[] = [
  { id: "executive_office_cert", label: "Executive Office Certification", critical_path_step: "executive_office_polish" },
  { id: "session_4", label: "Session 4", critical_path_step: "peer_review_session_4" },
  { id: "session_5", label: "Session 5", critical_path_step: "peer_review_session_5" },
  { id: "theory_freeze", label: "Theory Freeze", critical_path_step: "theory_v1_freeze" },
  { id: "convention", label: "Convention", critical_path_step: "executive_epistemology_convention" },
  { id: "empty_brain_factory", label: "Empty Brain Factory", critical_path_step: "empty_brain_factory" },
  { id: "memory_os", label: "Memory OS", critical_path_step: "memory_os" },
  { id: "communications_office", label: "Communications Office", critical_path_step: "communications_office" },
  { id: "commercial_beta", label: "Commercial Beta", critical_path_step: "commercial_beta" },
];

export type V1RoadmapItemStatus = "complete" | "in_progress" | "not_started";

export interface V1RoadmapItemRow {
  id: string;
  label: string;
  status: V1RoadmapItemStatus;
}

export const V2_SCOPE_RULE =
  "Everything not on the V1 roadmap → docs/VERSION2_BACKLOG.md. If it does not shorten the path to beta, defer it.";

/** PMO operating principle — prevents feature creep by good ideas during V1 execution. */
export const V1_PMO_DEFERRAL_RULE =
  "If a proposed change does not shorten the critical path, improve certification quality, reduce launch risk, or fix a defect, it waits for V2.";

/** From Commercial Beta: every piece of work falls into exactly one of four buckets — no fifth category. */
export const V1_PMO_WORK_BUCKETS = [
  { id: "critical_path", label: "Advances the critical path", allowed: true },
  { id: "certification", label: "Required for module certification", allowed: true },
  { id: "defect", label: "Fixes a defect/regression", allowed: true },
  {
    id: "everything_else",
    label: "Everything else → docs/VERSION2_BACKLOG.md",
    allowed: false,
  },
] as const;

/** PMO is frozen until Commercial Beta unless one of these is true. */
export const V1_PMO_FROZEN_UNLESS =
  "Stop PMO enhancements unless: (1) a certification gate cannot be evaluated, (2) the forecast is inaccurate because of a bug, (3) Program Office is missing information needed for a launch decision.";

export const BURT_SESSION_START_INSTRUCTION =
  "Begin every work session with the session-start brief below. Do not ask what to build. If the smallest next executable slice is unclear, stop and ask.";

export const BURT_SESSION_START_LABELS = [
  "Current Critical Path",
  "Current Module",
  "Certification Status",
  "Blocking Issues",
  "Smallest Next Executable Slice",
] as const;

export interface BurtSessionStartBrief {
  current_critical_path: string;
  current_module: string | null;
  certification_status: string;
  blocking_issues: string | null;
  smallest_next_executable_slice: string | null;
  instruction: string;
}

export const KELLY_SANDBOX_GOLDEN_TEST =
  "Every completed module must pass: Does this work correctly against Kelly Sandbox? If yes, certify. If no, it is not complete.";

export const DAYS_TO_BETA_RULE =
  "Days to Beta is the project heartbeat — every decision must answer: Does this shorten the path to beta?";

/** Pin at top of every Burt packet during V1 implementation mode. */
export const BURT_PACKET_V1_ROADMAP_BLOCK = `> **LOCALBRAIN V1 ROADMAP** · Architecture FROZEN · Implementation mode
>
> \`\`\`txt
> □ Executive Office Certification
> □ Session 4
> □ Session 5
> □ Theory Freeze
> □ Convention
> □ Empty Brain Factory
> □ Memory OS
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
> \`\`\`
`;

import type { V1ModuleCertificationCard } from "./v1ModuleCertification.js";
import type { V1PhaseForecast } from "./v1PhaseForecast.js";

export interface CeoModeBrief {
  module_finishing_today: string | null;
  current_module_id: string | null;
  blocks_v1_most: string | null;
  wait_until_v2: string;
  completed_since_yesterday: string[];
  launch_closer_than_yesterday: boolean | null;
  launch_momentum_label: string;
  days_to_beta: number | null;
  v1_roadmap: V1RoadmapItemRow[];
  current_module_certification: V1ModuleCertificationCard | null;
  phase_forecast: V1PhaseForecast;
  burt_session_start: BurtSessionStartBrief;
  burt_mission: string;
  module_review_instruction: string;
}
