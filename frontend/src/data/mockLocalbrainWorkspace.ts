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
  { label: "ENG-COM-001.3", value: "COMPLETE · ENG-PMO-012 · 7/7 advisory · inherited", tone: "positive" as const },
  { label: "Active slice", value: "Communications Office module evaluation", tone: "neutral" as const },
  { label: "V1 launch score", value: "~93% · refresh Program Office", tone: "neutral" as const },
  { label: "Communications Office", value: "90% · behavioral slices COMPLETE · module gate next", tone: "neutral" as const },
] as const;

export const MOCK_SIGNAL_COUNT = MOCK_WORKSPACE_SIGNALS.length;
