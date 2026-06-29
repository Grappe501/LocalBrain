/**
 * Executive Question Registry — ENG-EQ-001 (LB-OS-020.5)
 */

export interface ExecutiveQuestion {
  question_id: string;
  canonical_question: string;
  owner_department: string;
  primary_route: string;
  supporting_engines: string[];
  supporting_workspaces: string[];
  answer_surface: "briefing" | "eic_stack" | "dashboard" | "scoreboard";
  answer_confidence: number;
  summary_only_routes: string[];
}

export interface CrossRouteLink {
  link_id: string;
  from_question_id: string;
  to_question_id: string;
  href: string;
  label: string;
}

export interface IntegrationAuditMetrics {
  cross_route_links: number;
  orphan_pages: number;
  duplicate_executive_summaries: number;
  eic_surfaces: number;
  shell_consistency_percent: number;
  questions_with_authoritative_route: number;
  total_questions: number;
}

export interface IntegrationAuditTargets {
  cross_route_links_min: number;
  orphan_pages_max: number;
  duplicate_summaries_max: number;
  eic_surfaces_min: number;
  shell_consistency_percent_min: number;
  questions_authoritative_percent_min: number;
}

export interface IntegrationAuditReport {
  slice_id: "LB-OS-020.5";
  engine_id: "ENG-EQ-001";
  read_only: true;
  observed_at: string;
  metrics: IntegrationAuditMetrics;
  targets: IntegrationAuditTargets;
  targets_met: boolean;
  gate_open_for_021: boolean;
  questions: ExecutiveQuestion[];
  cross_links: CrossRouteLink[];
  orphan_routes: string[];
  duplicate_summary_violations: string[];
  eic_routes: string[];
  shell_routes: string[];
}

export const INTEGRATION_TARGETS: IntegrationAuditTargets = {
  cross_route_links_min: 90,
  orphan_pages_max: 0,
  duplicate_summaries_max: 0,
  eic_surfaces_min: 4,
  shell_consistency_percent_min: 100,
  questions_authoritative_percent_min: 100,
};

export const PHASE_1_EXECUTIVE_QUESTIONS: ExecutiveQuestion[] = [
  {
    question_id: "EQ-001",
    canonical_question: "What should I do today?",
    owner_department: "Chief of Staff",
    primary_route: "/",
    supporting_engines: ["ENG-CS-003", "ENG-EO-004"],
    supporting_workspaces: [],
    answer_surface: "briefing",
    answer_confidence: 55,
    summary_only_routes: [],
  },
  {
    question_id: "EQ-002",
    canonical_question: "How is the build progressing?",
    owner_department: "Program Office",
    primary_route: "/program-office",
    supporting_engines: ["ENG-BLD-001"],
    supporting_workspaces: ["localbrain"],
    answer_surface: "dashboard",
    answer_confidence: 92,
    summary_only_routes: ["/system"],
  },
  {
    question_id: "EQ-003",
    canonical_question: "How healthy is my system?",
    owner_department: "System Health",
    primary_route: "/system",
    supporting_engines: ["ENG-HL-001"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 88,
    summary_only_routes: ["/"],
  },
  {
    question_id: "EQ-004",
    canonical_question: "Where is my information?",
    owner_department: "Knowledge Explorer",
    primary_route: "/explorer",
    supporting_engines: ["ENG-KP-001", "ENG-DAI-001"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 85,
    summary_only_routes: [],
  },
  {
    question_id: "EQ-005",
    canonical_question: "What should I consolidate?",
    owner_department: "Consolidation",
    primary_route: "/migration/consolidation",
    supporting_engines: ["ENG-CNS-001", "ENG-EIC-001"],
    supporting_workspaces: [],
    answer_surface: "eic_stack",
    answer_confidence: 90,
    summary_only_routes: ["/"],
  },
  {
    question_id: "EQ-006",
    canonical_question: "What relationships need attention?",
    owner_department: "Relationships",
    primary_route: "/studio/relationships",
    supporting_engines: ["ENG-REL-001"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 45,
    summary_only_routes: [],
  },
  {
    question_id: "EQ-007",
    canonical_question: "What projects are drifting?",
    owner_department: "Living Workspaces",
    primary_route: "/workspace/:workspaceId",
    supporting_engines: ["ENG-CS-002"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 60,
    summary_only_routes: [],
  },
  {
    question_id: "EQ-013",
    canonical_question: "What actions need my approval?",
    owner_department: "Actions",
    primary_route: "/actions",
    supporting_engines: ["ENG-TL-001"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 95,
    summary_only_routes: ["/"],
  },
  {
    question_id: "EQ-014",
    canonical_question: "How should I migrate my world?",
    owner_department: "Migration Planner",
    primary_route: "/migration",
    supporting_engines: ["ENG-MIG-001", "ENG-EWA-001"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 88,
    summary_only_routes: ["/migration/workspace-architecture", "/migration/proof"],
  },
  {
    question_id: "EQ-015",
    canonical_question: "What is on my H: drive?",
    owner_department: "Migration Audit",
    primary_route: "/migration/audit",
    supporting_engines: ["ENG-MIG-002", "ENG-DLS-001"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 90,
    summary_only_routes: ["/migration/digital-land-survey"],
  },
  {
    question_id: "EQ-010",
    canonical_question: "How healthy is my engineering work?",
    owner_department: "Engineering",
    primary_route: "/studio/engineering",
    supporting_engines: ["ENG-ENG-001"],
    supporting_workspaces: ["localbrain"],
    answer_surface: "dashboard",
    answer_confidence: 75,
    summary_only_routes: ["/program-office"],
  },
  {
    question_id: "EQ-011",
    canonical_question: "What is my writing pipeline?",
    owner_department: "Writing",
    primary_route: "/studio/writing",
    supporting_engines: ["ENG-WRT-001"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 50,
    summary_only_routes: [],
  },
  {
    question_id: "EQ-012",
    canonical_question: "What data sources am I missing?",
    owner_department: "Data & Intelligence",
    primary_route: "/studio/data",
    supporting_engines: ["ENG-DI-001"],
    supporting_workspaces: [],
    answer_surface: "dashboard",
    answer_confidence: 55,
    summary_only_routes: [],
  },
];

export const QUESTION_RELATED_IDS: Record<string, string[]> = {
  "EQ-001": ["EQ-002", "EQ-003", "EQ-004", "EQ-005", "EQ-013", "EQ-007", "EQ-010"],
  "EQ-002": ["EQ-001", "EQ-010", "EQ-003", "EQ-014", "EQ-015", "EQ-005", "EQ-013"],
  "EQ-003": ["EQ-001", "EQ-002", "EQ-013", "EQ-004", "EQ-010", "EQ-011", "EQ-012"],
  "EQ-004": ["EQ-001", "EQ-005", "EQ-007", "EQ-013", "EQ-010", "EQ-011", "EQ-012"],
  "EQ-005": ["EQ-014", "EQ-015", "EQ-004", "EQ-002", "EQ-001", "EQ-007", "EQ-013"],
  "EQ-006": ["EQ-001", "EQ-007", "EQ-004", "EQ-013", "EQ-002", "EQ-010", "EQ-011"],
  "EQ-007": ["EQ-001", "EQ-004", "EQ-010", "EQ-011", "EQ-012", "EQ-005", "EQ-013"],
  "EQ-010": ["EQ-002", "EQ-007", "EQ-004", "EQ-013", "EQ-001", "EQ-011", "EQ-012"],
  "EQ-011": ["EQ-007", "EQ-004", "EQ-001", "EQ-013", "EQ-006", "EQ-010", "EQ-012"],
  "EQ-012": ["EQ-004", "EQ-010", "EQ-011", "EQ-007", "EQ-002", "EQ-001", "EQ-013"],
  "EQ-013": ["EQ-001", "EQ-003", "EQ-004", "EQ-005", "EQ-007", "EQ-010", "EQ-014"],
  "EQ-014": ["EQ-015", "EQ-005", "EQ-002", "EQ-004", "EQ-001", "EQ-013", "EQ-007"],
  "EQ-015": ["EQ-014", "EQ-005", "EQ-004", "EQ-002", "EQ-001", "EQ-013", "EQ-007"],
};

export function buildCrossRouteLinks(questions = PHASE_1_EXECUTIVE_QUESTIONS): CrossRouteLink[] {
  const byId = new Map(questions.map((q) => [q.question_id, q]));
  const links: CrossRouteLink[] = [];
  for (const [fromId, related] of Object.entries(QUESTION_RELATED_IDS)) {
    if (!byId.has(fromId)) continue;
    for (const toId of related) {
      const to = byId.get(toId);
      if (!to) continue;
      links.push({
        link_id: `${fromId}->${toId}`,
        from_question_id: fromId,
        to_question_id: toId,
        href: to.primary_route.replace(":workspaceId", "localbrain"),
        label: to.canonical_question,
      });
    }
  }
  return links;
}

export function matchQuestionForRoute(
  route: string,
  questions = PHASE_1_EXECUTIVE_QUESTIONS,
): ExecutiveQuestion | null {
  const normalized = route.split("?")[0];
  for (const q of questions) {
    if (q.primary_route.includes(":")) {
      const prefix = q.primary_route.split(":")[0];
      if (normalized.startsWith(prefix)) return q;
    } else if (
      normalized === q.primary_route ||
      q.summary_only_routes.includes(normalized)
    ) {
      return q;
    }
  }
  return null;
}

export function getRelatedLinksForRoute(
  route: string,
  questions = PHASE_1_EXECUTIVE_QUESTIONS,
): { href: string; label: string }[] {
  const q = matchQuestionForRoute(route, questions);
  if (!q) return [];
  return buildCrossRouteLinks(questions)
    .filter((l) => l.from_question_id === q.question_id)
    .map((l) => ({ href: l.href, label: l.label }));
}
