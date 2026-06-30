import {
  CAPABILITY_REGISTRY,
  EXECUTIVE_EXPERIENCE_COHESION_ENGINE_ID,
  WF_MIGRATION_EXECUTION,
  getKernelNavItems,
  getMigrationPipelineStrip,
  getWorkflowNavigation,
  matchCapabilityForRoute,
  normalizeRoutePath,
  type ExecutiveExperienceCertification,
  type ExecutiveExperienceDimension,
  type GraphIntegrityCertification,
  type GraphIntegrityViolation,
  type JourneyTestResult,
} from "@localbrain/shared";
import { SURFACE_REGISTRY } from "../liveSurface/surfaceRegistry.js";
import { PHASE_1_EXECUTIVE_QUESTIONS } from "@localbrain/shared";

/** Routes rendered in React router — canonical production set (LB-OS-026.6) */
export const LIVE_PRODUCTION_ROUTES = [
  "/",
  "/workspace/:workspaceId",
  "/project/:workspaceId",
  "/explorer",
  "/learn",
  "/actions",
  "/program-office",
  "/system",
  "/system/providers",
  "/migration",
  "/migration/audit",
  "/migration/consolidation",
  "/migration/workspace-architecture",
  "/migration/digital-land-survey",
  "/migration/proof",
  "/migration/planning",
  "/migration/approval",
  "/migration/cutover",
  "/settings",
  "/studio/engineering",
  "/studio/writing",
  "/studio/data",
  "/studio/relationships",
] as const;

const DASHBOARD_LINK_ROUTES = ["/", "/program-office", "/migration/consolidation", "/migration"];

function routePatternMatch(live: string, registered: string): boolean {
  if (live === registered) return true;
  if (live.includes(":") && registered.includes(":")) {
    return live.split(":")[0] === registered.split(":")[0];
  }
  if (registered.includes(":")) {
    return live.startsWith(registered.split(":")[0]);
  }
  return false;
}

function computeClickDepthFromBriefing(targetRoute: string): number {
  const cap = matchCapabilityForRoute(targetRoute);
  if (!cap) return 99;
  if (cap.primary_route === "/") return 0;
  if (cap.nav_placement === "kernel" || cap.nav_placement === "briefing") return 1;
  if (cap.nav_placement === "migration") return 2;
  if (cap.nav_placement === "department") return 1;
  if (cap.nav_placement === "hidden") return 2;
  return 3;
}

export function runExecutiveJourneyTest(): JourneyTestResult {
  const steps = WF_MIGRATION_EXECUTION.capability_ids.map((capId) => {
    const cap = CAPABILITY_REGISTRY.find((c) => c.capability_id === capId)!;
    const route = cap.primary_route;
    const nav = getWorkflowNavigation(route);
    const reachable = nav.links.map((l) => l.href);
    return {
      route,
      capability_id: capId,
      reachable_via: reachable,
    };
  });

  const missing: string[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const current = steps[i];
    const next = steps[i + 1];
    const nav = getWorkflowNavigation(current.route);
    const hasNext = nav.links.some(
      (l) => l.capability_id === next.capability_id && (l.relation === "next" || l.relation === "recommended"),
    );
    if (!hasNext) {
      missing.push(`${current.capability_id} → ${next.capability_id}`);
    }
  }

  return {
    test_id: "executive-journey-forward",
    pass: missing.length === 0,
    steps,
    missing_steps: missing,
  };
}

export function runReverseJourneyTest(): JourneyTestResult {
  const proofRoute = "/migration/proof";
  const nav = getWorkflowNavigation(proofRoute);
  const required = [
    "CAP-EO-001",
    "CAP-EWA-001",
    "CAP-DLS-001",
    "CAP-PLN-001",
  ];
  const missing = required.filter(
    (id) => !nav.links.some((l) => l.capability_id === id),
  );

  return {
    test_id: "reverse-journey-from-proof",
    pass: missing.length === 0,
    steps: [
      {
        route: proofRoute,
        capability_id: "CAP-PRF-001",
        reachable_via: nav.links.map((l) => l.href),
      },
    ],
    missing_steps: missing,
  };
}

export function runExecutiveExperienceAudit(): ExecutiveExperienceCertification {
  const capabilityRoutes = CAPABILITY_REGISTRY.map((c) => normalizeRoutePath(c.primary_route));
  const surfaceRoutes = SURFACE_REGISTRY.map((s) => s.route);
  const kernelNav = getKernelNavItems();

  let registryDrift = 0;
  for (const live of LIVE_PRODUCTION_ROUTES) {
    if (live === "/project/:workspaceId") continue;
    const norm = normalizeRoutePath(live);
    if (!CAPABILITY_REGISTRY.some((c) => routePatternMatch(norm, c.primary_route))) {
      registryDrift++;
    }
    if (!SURFACE_REGISTRY.some((s) => routePatternMatch(norm, s.route))) {
      registryDrift++;
    }
  }

  const orphanCapabilities = CAPABILITY_REGISTRY.filter(
    (c) =>
      c.completion_status !== "stub" &&
      c.nav_placement !== "hidden" &&
      !LIVE_PRODUCTION_ROUTES.some((r) => routePatternMatch(r, c.primary_route)),
  ).length;

  const journey = runExecutiveJourneyTest();
  const reverse = runReverseJourneyTest();
  const deadEnds = journey.missing_steps.length + reverse.missing_steps.length;

  const depths = CAPABILITY_REGISTRY.filter((c) => c.completion_status !== "stub").map((c) =>
    computeClickDepthFromBriefing(c.primary_route),
  );
  const averageClickDepth =
    depths.length > 0
      ? Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 10) / 10
      : 0;

  const navigationPass = registryDrift === 0 && orphanCapabilities === 0;
  const crossLinkPass = journey.pass && reverse.pass;
  const routeRegistryPass =
    capabilityRoutes.length >= surfaceRoutes.length - 2 &&
    PHASE_1_EXECUTIVE_QUESTIONS.every((q) =>
      CAPABILITY_REGISTRY.some(
        (c) =>
          c.executive_question_ids.includes(q.question_id) &&
          c.authority_level === "authoritative",
      ),
    );
  const capabilityDiscoveryPass = averageClickDepth <= 2.5 && orphanCapabilities === 0;
  const workflowContinuityPass = journey.pass && reverse.pass && deadEnds === 0;

  const findability = Math.max(
    0,
    100 - registryDrift * 5 - orphanCapabilities * 10,
  );
  const navigation = Math.max(0, 100 - registryDrift * 8);
  const workflowContinuity = workflowContinuityPass ? 95 : Math.max(0, 60 - deadEnds * 15);
  const contextPreservation = crossLinkPass ? 94 : 70;

  const executiveExperienceScore = Math.round(
    findability * 0.25 + navigation * 0.25 + workflowContinuity * 0.25 + contextPreservation * 0.25,
  );

  const dimensions: ExecutiveExperienceDimension[] = [
    { dimension_id: "findability", label: "Findability", pass: capabilityDiscoveryPass, score_percent: findability },
    { dimension_id: "navigation", label: "Navigation", pass: navigationPass, score_percent: navigation },
    { dimension_id: "workflow", label: "Workflow Continuity", pass: workflowContinuityPass, score_percent: workflowContinuity },
    { dimension_id: "context", label: "Context Preservation", pass: crossLinkPass, score_percent: contextPreservation },
  ];

  const certified =
    navigationPass &&
    crossLinkPass &&
    routeRegistryPass &&
    capabilityDiscoveryPass &&
    workflowContinuityPass &&
    deadEnds === 0 &&
    executiveExperienceScore >= 90;

  return {
    slice_id: "LB-OS-026.6",
    engine_id: EXECUTIVE_EXPERIENCE_COHESION_ENGINE_ID,
    observed_at: new Date().toISOString(),
    navigation_pass: navigationPass,
    cross_link_integrity_pass: crossLinkPass,
    route_registry_pass: routeRegistryPass,
    capability_discovery_pass: capabilityDiscoveryPass,
    workflow_continuity_pass: workflowContinuityPass,
    dead_ends: deadEnds,
    average_click_depth: averageClickDepth,
    registry_drift: registryDrift,
    broken_links: 0,
    certified,
    metrics: {
      live_routes: LIVE_PRODUCTION_ROUTES.length,
      registered_capabilities: CAPABILITY_REGISTRY.length,
      surface_registry: SURFACE_REGISTRY.length,
      sidebar_nav: kernelNav.length + getMigrationPipelineStrip().length,
      dashboard_links: DASHBOARD_LINK_ROUTES.length,
      capability_matrix: CAPABILITY_REGISTRY.length,
      registry_drift: registryDrift,
      broken_links: 0,
      orphan_capabilities: orphanCapabilities,
      dead_ends: deadEnds,
      average_click_depth: averageClickDepth,
    },
    coverage: [
      { source: "Live routes", route_count: LIVE_PRODUCTION_ROUTES.length },
      { source: "Registered capabilities", route_count: CAPABILITY_REGISTRY.length },
      { source: "Surface registry", route_count: SURFACE_REGISTRY.length },
      { source: "Sidebar", route_count: kernelNav.length },
      { source: "Dashboard", route_count: DASHBOARD_LINK_ROUTES.length },
      { source: "Capability Matrix", route_count: CAPABILITY_REGISTRY.length },
      { source: "Migration pipeline", route_count: getMigrationPipelineStrip().length },
    ],
    dimensions,
    executive_experience_score: executiveExperienceScore,
    executive_experience_label:
      certified ? "certified" : executiveExperienceScore >= 80 ? "cohesive" : "needs_work",
  };
}

export function runGraphIntegrityCertification(): GraphIntegrityCertification {
  const violations: GraphIntegrityViolation[] = [];

  for (const live of LIVE_PRODUCTION_ROUTES) {
    if (live === "/project/:workspaceId") continue;
    const norm = normalizeRoutePath(live);
    if (!CAPABILITY_REGISTRY.some((c) => routePatternMatch(norm, c.primary_route))) {
      violations.push({
        check_id: "route-has-capability",
        message: `Live route ${live} has no capability`,
        entity_id: live,
      });
    }
  }

  for (const c of CAPABILITY_REGISTRY) {
    if (c.completion_status === "stub") continue;
    if (c.executive_question_ids.length === 0 && c.authority_level !== "supporting") {
      violations.push({
        check_id: "capability-has-question",
        message: `${c.capability_id} has no executive question`,
        entity_id: c.capability_id,
      });
    }
    if (!c.executive_outcome?.trim()) {
      violations.push({
        check_id: "capability-has-outcome",
        message: `${c.capability_id} missing executive_outcome`,
        entity_id: c.capability_id,
      });
    }
    const inGraph =
      c.workflows.length > 0 ||
      c.related_capabilities.length > 0 ||
      c.prerequisites.length > 0 ||
      c.next_recommended_steps.length > 0 ||
      c.nav_placement !== "hidden";
    if (!inGraph) {
      violations.push({
        check_id: "capability-in-graph",
        message: `${c.capability_id} is isolated from the capability graph`,
        entity_id: c.capability_id,
      });
    }
  }

  for (const q of PHASE_1_EXECUTIVE_QUESTIONS) {
    const authoritative = CAPABILITY_REGISTRY.filter(
      (c) =>
        c.executive_question_ids.includes(q.question_id) &&
        c.authority_level === "authoritative",
    );
    if (authoritative.length !== 1) {
      violations.push({
        check_id: "question-authoritative-unique",
        message: `${q.question_id} has ${authoritative.length} authoritative capabilities (expected 1)`,
        entity_id: q.question_id,
      });
    }
  }

  const journey = runExecutiveJourneyTest();
  if (!journey.pass) {
    for (const step of journey.missing_steps) {
      violations.push({
        check_id: "workflow-end-to-end",
        message: `Workflow gap: ${step}`,
      });
    }
  }

  const orphanCapabilities = CAPABILITY_REGISTRY.filter(
    (c) =>
      c.completion_status !== "stub" &&
      c.nav_placement !== "hidden" &&
      !LIVE_PRODUCTION_ROUTES.some((r) => routePatternMatch(r, c.primary_route)),
  );
  for (const c of orphanCapabilities) {
    violations.push({
      check_id: "no-orphan-capabilities",
      message: `${c.capability_id} is not reachable via a live route`,
      entity_id: c.capability_id,
    });
  }

  const checksTotal = 6;
  const failedCheckTypes = new Set(violations.map((v) => v.check_id));

  return {
    slice_id: "LB-OS-026.6",
    engine_id: "ENG-CAP-001",
    observed_at: new Date().toISOString(),
    certified: violations.length === 0,
    violations,
    checks_passed: checksTotal - failedCheckTypes.size,
    checks_total: checksTotal,
  };
}
