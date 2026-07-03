export const LOCALBRAIN_WORKSPACE = {
  id: "localbrain",
  name: "LocalBrain",
  path: "H:/localAgent",
  type: "meta / self-build",
  description:
    "Meta workspace — teaches LocalBrain to build itself. First living workspace.",
} as const;

export const MOCK_WORKSPACE_SIGNALS = [
  { label: "Institutional Cognition Foundation V1", value: "5/5 COMPLETE · memory-spec-v1.0 · 100%", tone: "neutral" as const },
  { label: "Inherited capabilities", value: "Traceability · Uncertainty · contracts · doctrine", tone: "neutral" as const },
  { label: "ENG-PMO-013", value: "PENDING · Communications Office module evaluation", tone: "neutral" as const },
  { label: "Active gate", value: "Module evaluation — inherited baseline committed", tone: "neutral" as const },
  { label: "V1 launch score", value: "~93% · refresh Program Office", tone: "neutral" as const },
  { label: "Communications Office", value: "90% · ENG-PMO-013 pending · engineering closed", tone: "neutral" as const },
] as const;

export const MOCK_SIGNAL_COUNT = MOCK_WORKSPACE_SIGNALS.length;
