export type BriefingSection = {
  title: string;
  lines: string[];
};

export const MOCK_BRIEFING_SECTIONS: BriefingSection[] = [
  {
    title: "Today's priorities",
    lines: [
      "1. LocalBrain — LB-OS-002 shell (self-build meta)",
      "2. Review PSP closeout and assign LB-OS-003",
      "3. Engine registry alignment for Burt packets",
    ],
  },
  {
    title: "Calendar",
    lines: ["10:00 Deep work block · 3h free — shell + permission engine"],
  },
  {
    title: "Email requiring attention",
    lines: ["2 unread flagged · mock thread · reply suggested"],
  },
  {
    title: "Projects at risk",
    lines: ["LocalBrain: awaiting LB-OS-003 permission engine"],
  },
  {
    title: "Recent accomplishments",
    lines: ["LB-OS-001 scaffold complete · PSP approved"],
  },
  {
    title: "Pending approvals",
    lines: ["None — filesystem tools disabled until LB-OS-003+"],
  },
  {
    title: "Token spend",
    lines: ["Yesterday: $0.00 (mock) · Month: $0.00 · Not connected"],
  },
  {
    title: "Finance & CFO",
    lines: [
      "LocalBrain: self-build budget on track (mock)",
      "Household: on budget (mock)",
      "Action: expense classifications after CFO module (LB-OS-101)",
    ],
  },
  {
    title: "System health",
    lines: ["Metrics not connected · planned LB-OS-007"],
  },
  {
    title: "Suggested deep-work block",
    lines: ["8:00–11:00 — LocalBrain shell hardening"],
  },
];

export const MOCK_MWI_FOOTER =
  "Meaningful Work Index: not measured yet — mock footer (LB-OS-095)";
