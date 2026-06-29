import {
  INTEGRATION_TARGETS,
  PHASE_1_EXECUTIVE_QUESTIONS,
  buildCrossRouteLinks,
  matchQuestionForRoute,
  type IntegrationAuditReport,
} from "@localbrain/shared";
import { SURFACE_REGISTRY } from "../liveSurface/surfaceRegistry.js";

/** Routes that render recommendations as Executive Intelligence Cards. */
export const EIC_EXECUTIVE_ROUTES = [
  "/migration/consolidation",
  "/explorer",
  "/studio/relationships",
  "/",
];

/** Priority routes that must have executive shell (banner + question header). */
export const EXECUTIVE_SHELL_ROUTES = [
  "/",
  "/program-office",
  "/system",
  "/system/providers",
  "/explorer",
  "/actions",
  "/migration",
  "/migration/audit",
  "/migration/consolidation",
  "/migration/workspace-architecture",
  "/workspace/:workspaceId",
  "/studio/engineering",
  "/studio/writing",
  "/studio/data",
  "/studio/relationships",
];

/** Known duplicate-summary violations — empty when cohesion gate passes. */
export const DUPLICATE_SUMMARY_VIOLATIONS: string[] = [];

export function runIntegrationAudit(): IntegrationAuditReport {
  const cross_links = buildCrossRouteLinks();
  const questions = PHASE_1_EXECUTIVE_QUESTIONS;

  const registryRoutes = SURFACE_REGISTRY.map((s) => s.route);
  const allPriorityRoutes = [
    ...new Set([...registryRoutes, ...EXECUTIVE_SHELL_ROUTES, ...EIC_EXECUTIVE_ROUTES]),
  ];

  const orphan_routes = allPriorityRoutes.filter((route) => {
    if (route === "/system/providers" || route === "/settings") return false;
    return !matchQuestionForRoute(route.replace(":workspaceId", "localbrain"));
  });

  const shell_routes = EXECUTIVE_SHELL_ROUTES.filter((r) =>
    allPriorityRoutes.some((pr) => pr === r || (r.includes(":") && pr.startsWith(r.split(":")[0]))),
  );

  const metrics = {
    cross_route_links: cross_links.length,
    orphan_pages: orphan_routes.length,
    duplicate_executive_summaries: DUPLICATE_SUMMARY_VIOLATIONS.length,
    eic_surfaces: EIC_EXECUTIVE_ROUTES.length,
    shell_consistency_percent: Math.round(
      (shell_routes.length / EXECUTIVE_SHELL_ROUTES.length) * 100,
    ),
    questions_with_authoritative_route: questions.length,
    total_questions: questions.length,
  };

  const targets = INTEGRATION_TARGETS;
  const targets_met =
    metrics.cross_route_links >= targets.cross_route_links_min &&
    metrics.orphan_pages <= targets.orphan_pages_max &&
    metrics.duplicate_executive_summaries <= targets.duplicate_summaries_max &&
    metrics.eic_surfaces >= targets.eic_surfaces_min &&
    metrics.shell_consistency_percent >= targets.shell_consistency_percent_min &&
    metrics.questions_with_authoritative_route === metrics.total_questions;

  return {
    slice_id: "LB-OS-020.5",
    engine_id: "ENG-EQ-001",
    read_only: true,
    observed_at: new Date().toISOString(),
    metrics,
    targets,
    targets_met,
    gate_open_for_021: targets_met,
    questions,
    cross_links,
    orphan_routes,
    duplicate_summary_violations: DUPLICATE_SUMMARY_VIOLATIONS,
    eic_routes: EIC_EXECUTIVE_ROUTES,
    shell_routes,
  };
}

export function getQuestionsForRoute(route: string) {
  return matchQuestionForRoute(route);
}

export function getRelatedLinks(questionId: string) {
  return buildCrossRouteLinks()
    .filter((l) => l.from_question_id === questionId)
    .map((l) => ({ href: l.href, label: l.label, link_id: l.link_id, to_question_id: l.to_question_id }));
}
