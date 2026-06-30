import type {
  LiveSurfaceSmokeResult,
  PlatformMetricHeadline,
  PlatformReadinessReport,
  PlatformReadinessScore,
  PlatformSystemOwnershipRow,
  ReadinessDashboardRow,
} from "@localbrain/shared";
import {
  EXECUTIVE_OS_V1_FREEZE_POLICY,
  PLATFORM_READINESS_CORE_RULE,
  PLATFORM_READINESS_ENGINE_ID,
  RECOMMENDED_PHASE_2_SEQUENCE,
} from "@localbrain/shared";
import { listDocumentationLibrary } from "../epo/docsLibrary.js";
import { parsePhaseChecklistSlices } from "../epo/checklistParser.js";
import { countTestFiles } from "../buildState/gitMetrics.js";
import { runIntegrationAudit, EXECUTIVE_SHELL_ROUTES } from "../integration/integrationAudit.js";
import { getMigrationApprovalsOverview } from "../migration/approval/executiveApprovalService.js";
import { getMigrationCutoverOverview } from "../migration/cutover/cutoverService.js";
import { getMigrationPlansOverview } from "../migration/planning/migrationPlanService.js";
import { getMigrationProofOverview } from "../migration/proof/migrationProofService.js";
import { getMigrationPlannerOverview } from "../migration/migrationService.js";
import { getDigitalLandSurvey } from "../migration/digitalLandSurvey/digitalLandSurveyService.js";
import { getExecutiveWorkspaceArchitecture } from "../migration/workspaceArchitecture/workspaceArchitectureService.js";
import { runFilesystemMappingAudit } from "../migration/fsAudit/auditService.js";
import { getConsolidationBriefing } from "../consolidation/consolidationService.js";
import { runLiveSurfaceSmoke } from "../liveSurface/liveSurfaceService.js";
import { SURFACE_REGISTRY } from "../liveSurface/surfaceRegistry.js";
import { computeArchitectureVolatility } from "./architectureVolatilityEngine.js";
import {
  computeFiveGatesCompliance,
  computeLiveSurfaceCompletionPercent,
  countPlaceholderRoutes,
} from "./certificationMetrics.js";
import { computeExecutiveMaturity } from "./executiveMaturityEngine.js";
import { computePlatformStability } from "./platformStabilityEngine.js";

const MIGRATION_PIPELINE_SLICES = [
  { stage_id: "evidence", label: "Evidence / Audit", slice_id: "LB-OS-019" },
  { stage_id: "architecture", label: "Workspace Architecture", slice_id: "LB-OS-021" },
  { stage_id: "survey", label: "Digital Land Survey", slice_id: "LB-OS-022" },
  { stage_id: "proof", label: "Proof + Certification", slice_id: "LB-OS-023" },
  { stage_id: "planning", label: "Migration Planning", slice_id: "LB-OS-024" },
  { stage_id: "approval", label: "Executive Approval", slice_id: "LB-OS-025" },
  { stage_id: "cutover", label: "Execution + Verification", slice_id: "LB-OS-026" },
];

function smokeRoute(
  route: string,
  endpoint: string,
  fn: () => unknown,
  keys: string[],
): LiveSurfaceSmokeResult {
  try {
    const payload = fn();
    if (!payload || typeof payload !== "object") {
      return {
        route,
        endpoint,
        ok: false,
        status_code: 200,
        error: "empty payload",
        keys_present: [],
      };
    }
    const keys_present = keys.filter((k) => k in (payload as object));
    const ok = keys_present.length === keys.length;
    return {
      route,
      endpoint,
      ok,
      status_code: 200,
      error: ok
        ? null
        : `missing keys: ${keys.filter((k) => !keys_present.includes(k)).join(", ")}`,
      keys_present,
    };
  } catch (e) {
    return {
      route,
      endpoint,
      ok: false,
      status_code: null,
      error: e instanceof Error ? e.message : "unknown error",
      keys_present: [],
    };
  }
}

function runExtendedRouteSmoke(): ReturnType<typeof runLiveSurfaceSmoke> {
  const base = runLiveSurfaceSmoke();
  const migrationResults: LiveSurfaceSmokeResult[] = [
    smokeRoute("/migration", "/api/migration/planner", () => getMigrationPlannerOverview(), [
      "slice_id",
      "guardrails",
    ]),
    smokeRoute("/migration/audit", "/api/migration/audit", () => runFilesystemMappingAudit({ force: false }), [
      "run_id",
      "mapping_confidence",
    ]),
    smokeRoute("/migration/consolidation", "/api/consolidation/opportunity", () => {
      const briefing = getConsolidationBriefing();
      return briefing.consolidation_opportunity;
    }, ["consolidation_score", "executive_summary"]),
    smokeRoute(
      "/migration/workspace-architecture",
      "/api/migration/workspace-architecture",
      () => getExecutiveWorkspaceArchitecture(),
      ["slice_id", "blueprints"],
    ),
    smokeRoute("/migration/digital-land-survey", "/api/migration/digital-land-survey", () =>
      getDigitalLandSurvey(), ["slice_id", "migration_complexity", "storage_topology"]),
    smokeRoute("/migration/proof", "/api/migration/proof", () => getMigrationProofOverview(), [
      "slice_id",
      "engine_id",
    ]),
    smokeRoute("/migration/planning", "/api/migration/plans", () => getMigrationPlansOverview(), [
      "slice_id",
      "planning_engine_id",
    ]),
    smokeRoute("/migration/approval", "/api/migration/approvals", () => getMigrationApprovalsOverview(), [
      "slice_id",
      "engine_id",
    ]),
    smokeRoute("/migration/cutover", "/api/migration/cutover", () => getMigrationCutoverOverview(), [
      "slice_id",
      "engine_id",
    ]),
  ];

  const results = [...base.results, ...migrationResults];
  const passed = results.filter((r) => r.ok).length;
  return {
    results,
    passed,
    failed: results.length - passed,
    observed_at: new Date().toISOString(),
  };
}

function computeDocumentationCoverage(): number {
  const docs = listDocumentationLibrary();
  if (docs.length === 0) return 0;
  const bindingOrActive = docs.filter(
    (d) => d.status === "binding" || d.status === "active",
  ).length;
  return Math.min(100, Math.round((bindingOrActive / docs.length) * 100));
}

function computeTestCoveragePercent(): number {
  const testCount = countTestFiles();
  const targetTests = 32;
  return Math.min(100, Math.round((testCount / targetTests) * 100));
}

function buildMigrationPipeline(): {
  complete: boolean;
  stages: PlatformReadinessReport["migration_pipeline_stages"];
} {
  const slices = parsePhaseChecklistSlices();
  const byId = new Map(slices.map((s) => [s.slice_id, s]));
  const stages = MIGRATION_PIPELINE_SLICES.map((stage) => {
    const slice = byId.get(stage.slice_id);
    const complete = slice?.status === "complete";
    return { ...stage, complete };
  });
  return { complete: stages.every((s) => s.complete), stages };
}

function buildPlatformSystems(): PlatformSystemOwnershipRow[] {
  return [
    {
      system_id: "executive_os",
      label: "Executive OS",
      status: "complete",
      implemented_features: [
        "Live Surface",
        "Living Workspaces",
        "Actions approval gate",
        "Program Office",
        "Migration lifecycle",
        "Department studios",
      ],
      owner_confirmed: true,
    },
    {
      system_id: "executive_memory",
      label: "Executive Memory OS",
      status: "planned",
      implemented_features: ["Knowledge Explorer browse", "Digital Asset Registry"],
      owner_confirmed: true,
    },
    {
      system_id: "executive_intelligence",
      label: "Executive Intelligence",
      status: "partial",
      implemented_features: ["Consolidation briefing (EIC)", "CoS orchestration stub"],
      owner_confirmed: true,
    },
    {
      system_id: "executive_evolution",
      label: "Executive Evolution",
      status: "planned",
      implemented_features: ["Outcome logging (LB-OS-010 actions)"],
      owner_confirmed: true,
    },
  ];
}

function buildPlaceholderRoutes(): PlatformReadinessReport["placeholder_routes"] {
  return SURFACE_REGISTRY
    .filter((s) => s.stub_sections.length > 0)
    .map((s) => ({
      route: s.route,
      label: s.label,
      stub_sections: s.stub_sections.map((st) => st.label),
      clearly_marked: s.stub_sections.every((st) => st.reason.length > 0),
    }));
}

function statusDisplay(status: ReadinessDashboardRow["status"]): string {
  switch (status) {
    case "complete":
      return "✅";
    case "partial":
      return "◐";
    case "planned":
      return "Planned";
    case "blocked":
      return "Blocked";
    default:
      return "—";
  }
}

function buildReadinessDashboard(
  docCoverage: number,
  testCoverage: number,
  placeholderCount: number,
  stabilityPercent: number,
  readinessPercent: number,
  maturityPercent: number,
  volatilityPercent: number,
  fiveGates: number,
  migrationComplete: boolean,
): ReadinessDashboardRow[] {
  return [
    {
      area_id: "executive_os",
      label: "Executive OS",
      status: "complete",
      display: statusDisplay("complete"),
      detail: "Shell, workspaces, actions, migration arc shipped",
    },
    {
      area_id: "executive_memory",
      label: "Executive Memory OS",
      status: "planned",
      display: statusDisplay("planned"),
      detail: "Phase 2 — LB-OS-028+",
    },
    {
      area_id: "executive_intelligence",
      label: "Executive Intelligence",
      status: "partial",
      display: statusDisplay("partial"),
      detail: "Consolidation EIC live; full mission stack Phase 2",
    },
    {
      area_id: "executive_evolution",
      label: "Executive Evolution",
      status: "planned",
      display: statusDisplay("planned"),
      detail: "LB-OS-035 System Evolution",
    },
    {
      area_id: "migration_lifecycle",
      label: "Migration Lifecycle",
      status: migrationComplete ? "complete" : "partial",
      display: migrationComplete ? statusDisplay("complete") : statusDisplay("partial"),
      detail: migrationComplete ? "Evidence → Cutover complete" : "Pipeline stages incomplete",
    },
    {
      area_id: "ai_provider_layer",
      label: "AI Provider Layer",
      status: "complete",
      display: statusDisplay("complete"),
      detail: "LB-OS-017 provider spine",
    },
    {
      area_id: "department_framework",
      label: "Department Framework",
      status: "complete",
      display: statusDisplay("complete"),
      detail: "Engineering, Writing, Data, Relationships",
    },
    {
      area_id: "executive_office",
      label: "Executive Office",
      status: "complete",
      display: statusDisplay("complete"),
      detail: "Briefing, CoS, Executive Questions",
    },
    {
      area_id: "program_office",
      label: "Program Office",
      status: "complete",
      display: statusDisplay("complete"),
      detail: "ENG-BLD-001 build state live",
    },
    {
      area_id: "documentation_coverage",
      label: "Documentation Coverage",
      status: docCoverage >= 90 ? "complete" : "partial",
      display: `${docCoverage}%`,
      detail: "Docs library binding/active ratio",
    },
    {
      area_id: "test_coverage",
      label: "Test Coverage",
      status: testCoverage >= 80 ? "complete" : "partial",
      display: `${testCoverage}%`,
      detail: "Backend test file heuristic vs Phase 1 target",
    },
    {
      area_id: "placeholder_routes",
      label: "Placeholder Routes",
      status: placeholderCount <= 8 ? "complete" : "partial",
      display: `${placeholderCount} remaining`,
      detail: "Stub sections clearly marked in surface registry",
    },
    {
      area_id: "platform_stability",
      label: "Platform Stability",
      status: stabilityPercent >= 90 ? "complete" : "partial",
      display: `${stabilityPercent}%`,
      detail: "ENG-PST-001 — is the architecture fundamentally sound?",
    },
    {
      area_id: "platform_readiness",
      label: "Platform Readiness",
      status: readinessPercent >= 80 ? "complete" : "partial",
      display: `${readinessPercent}%`,
      detail: "ENG-PRS-001 — ready for daily operational use?",
    },
    {
      area_id: "executive_maturity",
      label: "Executive Maturity",
      status: maturityPercent >= 50 ? "partial" : "planned",
      display: `${maturityPercent}%`,
      detail: "ENG-EMT-001 — intelligence systems Phase 2+",
    },
    {
      area_id: "architecture_volatility",
      label: "Architecture Volatility",
      status: volatilityPercent <= 10 ? "complete" : "partial",
      display: `${volatilityPercent}%`,
      detail: "ENG-AV-001 — redesign risk if development stopped today",
    },
    {
      area_id: "five_gates",
      label: "Five Gates Compliance",
      status: fiveGates >= 95 ? "complete" : "partial",
      display: `${fiveGates}%`,
      detail: "Surfaces declare slice_id + question_id",
    },
  ];
}

function computePrs(
  docCoverage: number,
  testCoverage: number,
  liveSurfacePercent: number,
  integrationPercent: number,
  placeholderRouteCount: number,
  orphanCount: number,
  smokeFailed: number,
  migrationComplete: boolean,
  integrationTargetsMet: boolean,
): PlatformReadinessScore {
  const placeholderRemoval = Math.max(0, 100 - placeholderRouteCount * 8);
  const openCriticalBugsInverse = Math.max(0, 100 - orphanCount * 15 - smokeFailed * 8);
  const integrationQuality = integrationTargetsMet
    ? Math.min(100, integrationPercent + 5)
    : Math.max(0, integrationPercent - 10);

  const components = {
    live_surface_completion: liveSurfacePercent,
    placeholder_removal: placeholderRemoval,
    documentation_coverage: docCoverage,
    test_health: testCoverage,
    ux_cohesion: integrationPercent,
    integration_quality: integrationQuality,
    open_critical_bugs_inverse: openCriticalBugsInverse,
  };

  const percent = Math.round(
    components.live_surface_completion * 0.2 +
      components.placeholder_removal * 0.15 +
      components.documentation_coverage * 0.1 +
      components.test_health * 0.15 +
      components.ux_cohesion * 0.15 +
      components.integration_quality * 0.15 +
      components.open_critical_bugs_inverse * 0.1,
  );

  let label: PlatformReadinessScore["label"] = "not_ready";
  if (
    percent >= 85 &&
    migrationComplete &&
    integrationTargetsMet &&
    smokeFailed === 0
  ) {
    label = "daily_use_ready";
  } else if (percent >= 75 && migrationComplete) {
    label = "release_candidate";
  }

  const summary =
    label === "daily_use_ready"
      ? "Platform Readiness Score indicates daily-use readiness — Phase 1 release candidate"
      : label === "release_candidate"
        ? "Release candidate — address blockers before declaring daily-use ready"
        : "Not ready for daily use — complete certification gaps";

  return { percent, label, components, summary };
}

function buildPlatformMetricHeadlines(
  stabilityPercent: number,
  readinessPercent: number,
  maturityPercent: number,
  volatilityPercent: number,
): PlatformMetricHeadline[] {
  return [
    {
      metric_id: "platform_stability",
      label: "Platform Stability",
      percent: stabilityPercent,
      meaning: "Is the architecture fundamentally sound?",
    },
    {
      metric_id: "platform_readiness",
      label: "Platform Readiness",
      percent: readinessPercent,
      meaning: "Is it ready for daily operational use?",
    },
    {
      metric_id: "executive_maturity",
      label: "Executive Maturity",
      percent: maturityPercent,
      meaning: "How much executive intelligence exists?",
    },
    {
      metric_id: "architecture_volatility",
      label: "Architecture Volatility",
      percent: volatilityPercent,
      meaning: "How much redesign risk remains?",
    },
  ];
}

export function getPlatformReadinessReport(): PlatformReadinessReport {
  const integration = runIntegrationAudit();
  const routeSmoke = runExtendedRouteSmoke();
  const smokePassRate =
    routeSmoke.results.length > 0
      ? Math.round((routeSmoke.passed / routeSmoke.results.length) * 100)
      : 100;
  const stability = computePlatformStability({
    smokePassRate,
    integrationTargetsMet: integration.targets_met,
  });
  const executiveMaturity = computeExecutiveMaturity();
  const architectureVolatility = computeArchitectureVolatility();
  const docCoverage = computeDocumentationCoverage();
  const testCoverage = computeTestCoveragePercent();
  const fiveGates = computeFiveGatesCompliance();
  const migration = buildMigrationPipeline();
  const placeholders = buildPlaceholderRoutes();

  const liveSurfacePercent = computeLiveSurfaceCompletionPercent();
  const placeholderRouteCount = countPlaceholderRoutes();

  const prs = computePrs(
    docCoverage,
    testCoverage,
    liveSurfacePercent,
    integration.metrics.shell_consistency_percent,
    placeholderRouteCount,
    integration.metrics.orphan_pages,
    routeSmoke.failed,
    migration.complete,
    integration.targets_met,
  );

  const dashboard = buildReadinessDashboard(
    docCoverage,
    testCoverage,
    placeholders.length,
    stability.stability_percent,
    prs.percent,
    executiveMaturity.overall_percent,
    architectureVolatility.volatility_percent,
    fiveGates,
    migration.complete,
  );

  const certificationPassed =
    prs.label !== "not_ready" &&
    stability.stability_percent >= 90 &&
    routeSmoke.failed === 0 &&
    integration.targets_met &&
    migration.complete &&
    integration.metrics.orphan_pages === 0;

  const platformMetricHeadlines = buildPlatformMetricHeadlines(
    stability.stability_percent,
    prs.percent,
    executiveMaturity.overall_percent,
    architectureVolatility.volatility_percent,
  );

  return {
    slice_id: "LB-OS-026.5",
    engine_id: PLATFORM_READINESS_ENGINE_ID,
    stability_engine_id: "ENG-PST-001",
    maturity_engine_id: "ENG-EMT-001",
    volatility_engine_id: "ENG-AV-001",
    read_only: true,
    core_rule: PLATFORM_READINESS_CORE_RULE,
    executive_os_version: "v1.0-rc",
    freeze_policy: EXECUTIVE_OS_V1_FREEZE_POLICY,
    platform_metric_headlines: platformMetricHeadlines,
    platform_stability: stability,
    platform_readiness_score: prs,
    executive_maturity: executiveMaturity,
    architecture_volatility: architectureVolatility,
    readiness_dashboard: dashboard,
    route_smoke: routeSmoke,
    integration_targets_met: integration.targets_met,
    orphan_routes: integration.orphan_routes,
    migration_pipeline_complete: migration.complete,
    migration_pipeline_stages: migration.stages,
    placeholder_routes: placeholders,
    placeholder_route_count: placeholders.length,
    documentation_coverage_percent: docCoverage,
    test_coverage_percent: testCoverage,
    five_gates_compliance_percent: fiveGates,
    platform_systems: buildPlatformSystems(),
    executive_questions_total: integration.metrics.total_questions,
    executive_questions_authoritative: integration.metrics.questions_with_authoritative_route,
    recommended_phase_2_sequence: RECOMMENDED_PHASE_2_SEQUENCE,
    certification_passed: certificationPassed,
    observed_at: new Date().toISOString(),
  };
}

/** Shell routes registered for integration audit cross-check. */
export function getExecutiveShellRouteCount(): number {
  return EXECUTIVE_SHELL_ROUTES.length;
}
