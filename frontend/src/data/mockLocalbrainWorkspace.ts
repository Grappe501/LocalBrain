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
  { label: "ENG-PMO-013", value: "COMPLETE · Communications Office V1 subsystem earned", tone: "positive" as const },
  { label: "Active gate", value: "Contact Management V1 · PMO module evaluation (ENG-PMO-014 or successor)", tone: "neutral" as const },
  { label: "V1 launch score", value: "~97% · live from Program Office API", tone: "positive" as const },
  { label: "Communications Office", value: "100% · ENG-PMO-013 COMPLETE · V1 subsystem", tone: "positive" as const },
  { label: "Contact Management", value: "90% · ENG-CONTACT-001.4 COMPLETE · COM draft linking live · 23/23 tests", tone: "positive" as const },
] as const;

export const MOCK_SIGNAL_COUNT = MOCK_WORKSPACE_SIGNALS.length;
