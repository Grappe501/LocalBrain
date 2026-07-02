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
  { label: "Institutional substrates", value: "Episode · Fact · Artifact · Conversation · DecisionCitation ✓", tone: "neutral" as const },
  { label: "Executive Intelligence Era", value: "ei-doctrine-v1.0 FROZEN · ENG-EI-001 AUTHORIZED", tone: "neutral" as const },
  { label: "V1 launch score", value: "~75% · refresh Program Office", tone: "neutral" as const },
  { label: "Next slice", value: "ENG-EI-001 Constitutional Retrieval", tone: "neutral" as const },
  { label: "Communications Office", value: "Awaiting ENG-EI-001 · doctrine frozen", tone: "neutral" as const },
];

export const MOCK_SIGNAL_COUNT = MOCK_WORKSPACE_SIGNALS.length;
