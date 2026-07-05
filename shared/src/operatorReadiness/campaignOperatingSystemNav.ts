/** Campaign Institution Operating System — Executive Navigation Model (live + reserved). */

export type WorkbenchNavLink = {
  label: string;
  executive_question?: string;
  route?: string;
  doc_path?: string;
  status: "live" | "reserved" | "gate";
  summary: string;
};

/** Authoritative executive navigation — questions, not modules. */
export const EXECUTIVE_NAVIGATION: readonly {
  executive_question: string;
  trust_domain: string;
  route: string;
}[] = [
  { executive_question: "Who is this?", trust_domain: "Identity Trust", route: "/studio/ingestion" },
  {
    executive_question: "How do we know them?",
    trust_domain: "Relationship Trust",
    route: "/studio/contacts",
  },
  {
    executive_question: "Who is doing the work?",
    trust_domain: "Operational Trust",
    route: "/studio/volunteer",
  },
  {
    executive_question: "Can the platform explain itself?",
    trust_domain: "Program Office · institution cockpit",
    route: "/program-office",
  },
] as const;

/** Three certified trust domains + Program Office cockpit. */
export const CAMPAIGN_TRUST_DOMAINS: readonly WorkbenchNavLink[] = [
  {
    label: "Identity Trust · UCIE",
    executive_question: "Who is this?",
    route: "/studio/ingestion",
    doc_path: "docs/ucie/UCIE-README.md",
    status: "live",
    summary: "Who is this? · Stage, don't commit · provenance on commit",
  },
  {
    label: "Relationship Trust · Contact v3",
    executive_question: "How do we know them?",
    route: "/studio/contacts",
    doc_path: "docs/contact-management/slices/CONTACT-V3-README.md",
    status: "live",
    summary: "How do we know them? · Context · stewardship · household · org · actions",
  },
  {
    label: "Operational Trust · VOP",
    executive_question: "Who is doing the work?",
    route: "/studio/volunteer",
    doc_path: "docs/vop/VOP-README.md",
    status: "live",
    summary: "Who is doing the work? · Marketplace · queue · supervisor dashboard",
  },
  {
    label: "Program Office · institution cockpit",
    executive_question: "Can the platform explain itself?",
    route: "/program-office",
    doc_path: "docs/operator-readiness/OPERATOR-BRIEFING-FRAME.md",
    status: "live",
    summary: "Can the workbench explain itself? · PRL-4 gate · evidence scoreboard",
  },
] as const;

/** Reserved post-PRL-4 — visual institution map (not a sitemap). Do not implement before operator evidence. */
export const INSTITUTION_MAP_RESERVATION = {
  label: "Institution Map",
  doc_path: "docs/platform/EXECUTIVE-NAVIGATION-MODEL.md",
  status: "reserved" as const,
  summary:
    "Visual OS explanation · purpose · doctrine · maturity · readiness · evidence per node — post-PRL-4 only",
};

/** Reserved — not built during PRL-4. */
export const CAMPAIGN_RESERVED_SUBSYSTEMS: readonly WorkbenchNavLink[] = [
  {
    label: "Platform Constitution",
    doc_path: "docs/platform/PLATFORM-CONSTITUTION.md",
    status: "reserved",
    summary: "Six articles · sovereignty before synchronization · amendment discipline",
  },
  {
    label: "First Principles Stack",
    doc_path: "docs/platform/FIRST-PRINCIPLES-STACK.md",
    status: "reserved",
    summary: "Person → LocalBrain → Institution → Universe → Workspace → Services → Ledgers → Governance",
  },
  {
    label: "FED-001 · Federation",
    doc_path: "docs/federation/FED-001-RESERVATION.md",
    status: "reserved",
    summary: "Trusted universes · sponsorship graph · campaign institution isolation",
  },
  {
    label: "WSP-001 · Sovereign Workspace",
    doc_path: "docs/collaboration/WSP-001-RESERVATION.md",
    status: "reserved",
    summary: "Workspace Ledger · GitHub canonical ledger · preserve the work",
  },
  {
    label: "ILG-001 · Institutional Ledger",
    doc_path: "docs/institution/ILG-001-RESERVATION.md",
    status: "reserved",
    summary: "Organization memory · provenance · institutional reasoning",
  },
  {
    label: "EPO-001 · Platform Governance",
    doc_path: "docs/epo/EPO-001-RESERVATION.md",
    status: "reserved",
    summary: "Governance Trust · is the institution healthy?",
  },
] as const;

/** Next valid work — not a new module. */
export const CAMPAIGN_NEXT_VALID_INPUT: WorkbenchNavLink = {
  label: "PRL-4 Operator Validation",
  route: "/program-office",
  doc_path: "docs/operator-readiness/PRL-4-EXIT-CONTRACT.md",
  status: "gate",
  summary:
    "Kelly → Chris → third operator · Evidence → Pattern → Interpretation → Smallest change → CPAT/doctrine check · Protect the evidence · Protect the pace",
};

export const CAMPAIGN_WORKBENCH_QUICK_ROUTES: readonly { label: string; route: string }[] = [
  { label: "Executive Office", route: "/" },
  { label: "Program Office", route: "/program-office" },
  { label: "Living Workspace", route: "/workspace/localbrain" },
  { label: "Contacts", route: "/studio/contacts" },
  { label: "Identity Acquisition", route: "/studio/ingestion" },
  { label: "Volunteer Operations", route: "/studio/volunteer" },
  { label: "Relationships", route: "/studio/relationships" },
  { label: "Knowledge Explorer", route: "/explorer" },
  { label: "System Health", route: "/system" },
] as const;

/** Normalize parameterized routes for workbench links. */
export function workbenchRouteHref(route: string): string {
  if (route.includes(":workspaceId")) return "/workspace/localbrain";
  return route;
}

export function workbenchDocHref(docPath: string): string {
  return `/docs/view?path=${encodeURIComponent(docPath)}`;
}
