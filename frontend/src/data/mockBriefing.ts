export type BriefingSection = {
  title: string;
  lines: string[];
};

export const MOCK_BRIEFING_SECTIONS: BriefingSection[] = [
  {
    title: "Today's priorities",
    lines: [
      "1. Review Program Office — V1 spine status",
      "2. Engineering / Writing / Data / Relationships departments",
      "3. Clear pending approvals in Actions queue",
    ],
  },
  {
    title: "Executive OS V1",
    lines: [
      "Release candidate hardening — LB-OS-016",
      "Operational loop: Observe → Understand → Plan → Recommend → Approve → Execute → Verify → Learn",
      "Four foundational departments online",
    ],
  },
  {
    title: "Pending approvals",
    lines: ["Check Actions queue — all file writes approval-gated"],
  },
  {
    title: "System health",
    lines: ["Status dock (bottom-right) · full panels at /system"],
  },
  {
    title: "Finance & CFO",
    lines: ["Briefing section only in V1 — CFO module deferred"],
  },
  {
    title: "Suggested deep-work block",
    lines: ["Use Command layer (Ctrl+Space) for CoS intents · departments for domain work"],
  },
];

export const MOCK_MWI_FOOTER =
  "Executive OS V1 — Meaningful Work Index ships post-milestone (LB-OS-095)";
