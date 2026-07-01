/**
 * V1 Phase Forecast — module, phase, and program completion from evidence (ENG-BLD-001-PFCST)
 */

import type { V1CriticalPathStep } from "./v1CommandCenter.js";

export const V1_PHASE_FORECAST_ENGINE_ID = "ENG-BLD-001-PFCST";

export type V1PhaseForecastStatus = "complete" | "in_progress" | "not_started";

export interface V1PhaseWorkUnit {
  unit_id: string;
  label: string;
  estimated_days: number;
  predicted_days: number;
  status: V1PhaseForecastStatus;
}

export interface V1PhaseForecastRow {
  phase_id: string;
  step_id: V1CriticalPathStep;
  label: string;
  status: V1PhaseForecastStatus;
  progress_percent: number;
  finishability_percent: number;
  /** Remaining days for this phase (null when complete). */
  estimated_days: number | null;
  predicted_days: number | null;
  /** Calendar date when this phase is predicted to finish. */
  predicted_completion_date: string | null;
  work_units: V1PhaseWorkUnit[];
}

export interface V1PhaseDayChange {
  phase_id: string;
  label: string;
  yesterday_predicted_days: number;
  today_predicted_days: number;
  delta_days: number;
  reason: string;
}

export interface V1MegaPhaseSummary {
  mega_phase_id: string;
  label: string;
  progress_percent: number;
  estimated_days_remaining: number;
  predicted_days_remaining: number;
  predicted_completion_date: string | null;
  finishability_percent: number;
}

/** CEO morning hierarchy — top KPIs in order. */
export interface V1PhaseForecast {
  engine_id: typeof V1_PHASE_FORECAST_ENGINE_ID;
  /** 1 — Days to Commercial Beta */
  days_to_commercial_beta: number | null;
  predicted_v1_beta_date: string | null;
  /** 2 — Current module ETA (days) */
  current_module_label: string | null;
  current_module_eta_days: number | null;
  /** 3 — Current mega-phase ETA */
  current_mega_phase: V1MegaPhaseSummary;
  /** 4 — Next mega-phase ETA */
  next_mega_phase: V1MegaPhaseSummary | null;
  /** 5 — Overall V1 confidence */
  confidence_percent: number;
  /** 6 — Why forecast changed */
  reasons: string[];
  /** Per roadmap step forecast + finishability */
  phases: V1PhaseForecastRow[];
  /** Day-over-day phase ETA deltas */
  todays_changes: V1PhaseDayChange[];
  observed_at: string;
}

/** Display labels aligned to frozen V1 roadmap. */
export const V1_PHASE_DISPLAY_LABELS: Record<string, string> = {
  executive_office_cert: "Executive Office",
  session_4: "Practitioner Review",
  session_5: "Skeptic Review",
  theory_freeze: "Theory Freeze",
  convention: "Convention",
  empty_brain_factory: "Empty Brain Factory",
  memory_os: "Memory OS",
  communications_office: "Communications Office",
  commercial_beta: "Commercial Beta",
};

/** Remaining work breakdown — sums to 1.0 per phase; drives expandable ETA detail. */
export const V1_PHASE_WORK_UNITS: Partial<
  Record<V1CriticalPathStep, { unit_id: string; label: string; weight: number }[]>
> = {
  peer_review_session_4: [
    { unit_id: "pr-s4-001", label: "Attention attack surface", weight: 0.2 },
    { unit_id: "pr-s4-002", label: "Decision utility", weight: 0.2 },
    { unit_id: "pr-s4-003", label: "Organizational realism", weight: 0.2 },
    { unit_id: "pr-s4-004", label: "Time pressure", weight: 0.2 },
    { unit_id: "pr-s4-005", label: "Accountability", weight: 0.2 },
  ],
  peer_review_session_5: [
    { unit_id: "pr-s5-001", label: "Assume theory wrong", weight: 0.25 },
    { unit_id: "pr-s5-002", label: "Weakest construct hunt", weight: 0.25 },
    { unit_id: "pr-s5-003", label: "Hidden dependency audit", weight: 0.25 },
    { unit_id: "pr-s5-004", label: "Failure mode synthesis", weight: 0.25 },
  ],
  theory_v1_freeze: [
    { unit_id: "tf-gate", label: "Five gate questions", weight: 0.6 },
    { unit_id: "tf-record", label: "Peer review record", weight: 0.4 },
  ],
  executive_epistemology_convention: [
    { unit_id: "conv-s1", label: "Convention Session 1", weight: 0.2 },
    { unit_id: "conv-s2", label: "Convention Session 2", weight: 0.2 },
    { unit_id: "conv-s3", label: "Convention Session 3", weight: 0.2 },
    { unit_id: "conv-s4", label: "Memory Provenance", weight: 0.2 },
    { unit_id: "conv-s5", label: "Ontology freeze", weight: 0.2 },
  ],
  empty_brain_factory: [
    { unit_id: "fac-package", label: "Package assembly", weight: 0.2 },
    { unit_id: "fac-birth", label: "Birth certificate", weight: 0.15 },
    { unit_id: "fac-authority", label: "Authority stack", weight: 0.2 },
    { unit_id: "fac-install", label: "Native installer", weight: 0.2 },
    { unit_id: "fac-cert", label: "PMO certification (10 gates)", weight: 0.25 },
  ],
  memory_os: [
    { unit_id: "mem-design", label: "MAR-1 design package (Vol 1–7)", weight: 0.12 },
    { unit_id: "mem-t1t2", label: "MEM-008 T1–T2 Factory & layers", weight: 0.06 },
    { unit_id: "mem-t3t9", label: "MEM-008 T3–T9 canonical models", weight: 0.22 },
    { unit_id: "mem-t10", label: "MEM-008 T10 DecisionCitation", weight: 0.04 },
    { unit_id: "mem-t11t14", label: "MEM-008 T11–T14 freeze gates", weight: 0.1 },
    { unit_id: "mem-freeze", label: "MEM-008 freeze + manifest lock", weight: 0.06 },
    { unit_id: "mem-w1-episode", label: "ENG-MEM-001.1 Episode (Reference Slice 001)", weight: 0.1 },
    { unit_id: "mem-w1-fact", label: "ENG-MEM-001.2 Fact (Reference Slice 002)", weight: 0.1 },
    { unit_id: "mem-w1-artifact", label: "ENG-MEM-001.3 Artifact (Reference Slice 003)", weight: 0.08 },
    { unit_id: "mem-w1-conversation", label: "ENG-MEM-001.4 Conversation", weight: 0.06 },
    { unit_id: "mem-w1-citation", label: "ENG-MEM-001.5 DecisionCitation", weight: 0.06 },
  ],
  communications_office: [
    { unit_id: "com-email", label: "Email integration", weight: 0.25 },
    { unit_id: "com-cal", label: "Calendar", weight: 0.2 },
    { unit_id: "com-rel", label: "Relationships", weight: 0.2 },
    { unit_id: "com-brief", label: "CoS briefing feed", weight: 0.2 },
    { unit_id: "com-cert", label: "Certification", weight: 0.15 },
  ],
  commercial_beta: [
    { unit_id: "beta-docs", label: "Documentation", weight: 0.3 },
    { unit_id: "beta-kelly", label: "Kelly onboarding", weight: 0.3 },
    { unit_id: "beta-customer", label: "Trusted customers", weight: 0.25 },
    { unit_id: "beta-launch", label: "Launch gate", weight: 0.15 },
  ],
};

/** Baseline finishability — how well remaining work is understood (not progress). */
export const V1_PHASE_FINISHABILITY_BASE: Partial<Record<V1CriticalPathStep, number>> = {
  executive_office_polish: 100,
  peer_review_session_4: 92,
  peer_review_session_5: 88,
  theory_v1_freeze: 95,
  executive_epistemology_convention: 63,
  empty_brain_factory: 100,
  memory_os: 99,
  communications_office: 25,
  commercial_beta: 70,
};

export const V1_MEGA_PHASES: {
  id: string;
  label: string;
  steps: V1CriticalPathStep[];
}[] = [
  {
    id: "platform_construction",
    label: "Phase 1 — Platform Construction",
    steps: ["executive_office_polish"],
  },
  {
    id: "theory_validation",
    label: "Phase 2 — Theory Validation",
    steps: [
      "peer_review_session_4",
      "peer_review_session_5",
      "theory_v1_freeze",
      "executive_epistemology_convention",
    ],
  },
  {
    id: "cognitive_construction",
    label: "Phase 3 — Cognitive Construction",
    steps: ["empty_brain_factory", "memory_os", "communications_office", "commercial_beta"],
  },
];
