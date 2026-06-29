/** Binding decision snippets for CoS prompts — metadata only, no doc reads. */

export const BINDING_DECISIONS = [
  {
    id: "DEC-WR-001",
    title: "LivingWorkspace replaces Project Registry",
    summary: "Workspaces are the primary organizational unit; project registry is deprecated.",
  },
  {
    id: "DEC-KE-001",
    title: "Knowledge Explorer replaces Explorer",
    summary: "Browse / Understand / Executive modes read the Digital Asset Registry first.",
  },
  {
    id: "DEC-DA-001",
    title: "Digital Asset Registry before intelligence",
    summary: "LB-OS-006 registry · LB-OS-007 intelligence · cleanup is recommend-only until LB-OS-010+.",
  },
];

export function decisionsAsContextText(): string {
  return BINDING_DECISIONS.map((d) => `${d.id}: ${d.title} — ${d.summary}`).join("\n");
}
