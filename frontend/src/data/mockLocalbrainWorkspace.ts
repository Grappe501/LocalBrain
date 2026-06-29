export const LOCALBRAIN_WORKSPACE = {
  id: "localbrain",
  name: "LocalBrain",
  path: "H:/localAgent",
  type: "meta / self-build",
  description:
    "Meta workspace — teaches LocalBrain to build itself. First living workspace.",
} as const;

export const MOCK_WORKSPACE_SIGNALS = [
  { label: "Build health", value: "LB-OS-002 in progress", tone: "neutral" as const },
  { label: "Open slices", value: "003 permissions next", tone: "neutral" as const },
  { label: "Engines stubbed", value: "CM · ID · CF · KP", tone: "neutral" as const },
  { label: "Modularity gate", value: "LB-OS-106 pending", tone: "warn" as const },
  { label: "Self-build path", value: "LB-OS-011 target", tone: "neutral" as const },
];

export const MOCK_SIGNAL_COUNT = 4;
