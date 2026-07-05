/** Operational Evidence Candidate (OEC) lifecycle — standard states. */

export const OEC_LIFECYCLE_STATES = [
  "observed",
  "replicated",
  "analyzed",
  "dispositioned",
  "closed",
] as const;

export type OecLifecycleState = (typeof OEC_LIFECYCLE_STATES)[number];

export const OEC_LIFECYCLE_STATE_LABELS: Record<OecLifecycleState, string> = {
  observed: "Observed",
  replicated: "Replicated",
  analyzed: "Analyzed",
  dispositioned: "Dispositioned",
  closed: "Closed",
};

export const OEC_DISPOSITION_OUTCOMES = [
  "no_change",
  "training_change",
  "implementation_change",
  "architecture_review",
  "rejected",
  "deferred",
] as const;

export type OecDispositionOutcome = (typeof OEC_DISPOSITION_OUTCOMES)[number];

export type OperationalEvidenceCandidate = {
  oec_id: string;
  title: string;
  lifecycle_state: OecLifecycleState;
  source_walkthrough_id: string;
  subsystem: "ucie" | "contact_v3" | "intelligence" | "platform";
  observed_at: string;
  observation: string;
  governance_question: string;
  disposition?: OecDispositionOutcome;
  disposition_note?: string;
  closed_at?: string;
};
