import {
  CAPABILITY_REGISTRY,
  PLATFORM_ROADMAP_AHEAD,
  PRIME_DIRECTIVE,
  PSA_CERTIFIED_INVENTORY,
  PSA_DASHBOARD_SURFACES,
  PSA_ENGINE_ID,
  PSA_GOVERNANCE_ARTIFACTS,
  PSA_NEXT_HORIZON_CHAIN,
  computePsCapabilityProgress,
  type CapabilityInventoryItem,
  type CanonicalPlatformState,
  type DashboardSurfaceCheck,
  type DriftItem,
  type GovernanceVisibilityCheck,
  type NextHorizonStep,
  type PlatformCoherenceScore,
  type PlatformStateAuditLayer,
  type PlatformStateFinding,
  type PlatformStateReport,
} from "@localbrain/shared";
import { computeBuildState } from "../buildState/buildStateEngine.js";
import {
  getGovernedPlatformSnapshot,
  getOperatorValidationProgress,
  isGovernedPlatformEraActive,
} from "../buildState/governedPlatformMetrics.js";
import { computeV1CommandCenter } from "../buildState/v1CommandCenterEngine.js";
import { getProjectState } from "../buildState/projectStateEngine.js";
import { collectExecutiveBriefingSignals } from "../integration/executiveBriefingService.js";
import { getEpoOverview } from "../epo/epoService.js";
import {
  LIVE_PRODUCTION_ROUTES,
  runExecutiveExperienceAudit,
  runGraphIntegrityCertification,
} from "../integration/executiveExperienceAudit.js";
import { runIntegrationAudit } from "../integration/integrationAudit.js";

function routeExists(route: string | null): boolean {
  if (!route) return false;
  return LIVE_PRODUCTION_ROUTES.some((live) => {
    if (live === route) return true;
    if (live.includes(":") && route.includes(":")) {
      return live.split(":")[0] === route.split(":")[0];
    }
    if (live.includes(":")) return route.startsWith(live.split(":")[0]!);
    return false;
  });
}

function normalizeForCompare(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function containsPhase(value: string, needle: string): boolean {
  return normalizeForCompare(value).includes(normalizeForCompare(needle));
}

function buildLayer1BuildState(
  state: ReturnType<typeof computeBuildState>,
  governed: ReturnType<typeof getGovernedPlatformSnapshot> | null,
): { canonical: CanonicalPlatformState; layer: PlatformStateAuditLayer } {
  const findings: PlatformStateFinding[] = [];
  const era = governed?.era_active ?? false;

  if (!era) {
    findings.push({
      severity: "error",
      code: "governed-era-inactive",
      message: "Governed platform era is not active — canonical state may reflect legacy slices",
    });
  }

  if (governed && !governed.cpat_accepted) {
    findings.push({
      severity: "warn",
      code: "cpat-pending",
      message: "CPAT v1.0 acceptance not detected in doctrine docs",
    });
  }

  if (governed && !governed.walkthrough_test_present) {
    findings.push({
      severity: "error",
      code: "walkthrough-test-missing",
      message: "OPERATOR-WALKTHROUGH-001 automated test file not found",
    });
  }

  const canonical: CanonicalPlatformState = {
    audit_id: "PSA-001",
    observed_at: new Date().toISOString(),
    current_sprint: state.current_sprint,
    current_phase: state.current_phase_label,
    prl_level: governed?.platform_readiness_level ?? "unknown",
    cpat_status: governed?.cpat_accepted ? "ACCEPTED · automated passing" : "pending",
    prime_directive: PRIME_DIRECTIVE,
    next_operator_action: governed?.smallest_next_slice ?? state.next_slice_name ?? "—",
    building_today: governed?.building_today ?? state.current_slice_name ?? "—",
    active_walkthrough_id: governed?.operator_walkthrough_id ?? "OPERATOR-WALKTHROUGH-001",
  };

  const score =
    findings.filter((f) => f.severity === "error").length === 0
      ? findings.some((f) => f.severity === "warn")
        ? 85
        : 100
      : 60;

  return {
    canonical,
    layer: {
      layer_id: "L1",
      layer_name: "Build State",
      question: "Does the system know what state it is actually in?",
      passed: score >= 85,
      score_percent: score,
      findings,
    },
  };
}

function buildLayer2CapabilityRegistry(): PlatformStateAuditLayer {
  const findings: PlatformStateFinding[] = [];
  const inventory: CapabilityInventoryItem[] = [];
  const graph = runGraphIntegrityCertification();

  for (const v of graph.violations) {
    findings.push({
      severity: v.check_id.includes("orphan") ? "warn" : "error",
      code: v.check_id,
      message: v.message,
      entity_id: v.entity_id,
    });
  }

  const capIdCapabilityKeys = new Map<string, string[]>();
  for (const item of PSA_CERTIFIED_INVENTORY) {
    if (item.registry_kind !== "capability") continue;
    for (const capId of item.capability_ids) {
      const list = capIdCapabilityKeys.get(capId) ?? [];
      list.push(item.inventory_key);
      capIdCapabilityKeys.set(capId, list);
    }
  }

  for (const item of PSA_CERTIFIED_INVENTORY) {
    const capsExist = item.capability_ids.every((id) =>
      CAPABILITY_REGISTRY.some((c) => c.capability_id === id),
    );
    const routesLive =
      item.routes.length === 0 || item.routes.some((r) => routeExists(r));
    const duplicateCap =
      item.registry_kind === "capability" &&
      item.capability_ids.some((id) => (capIdCapabilityKeys.get(id)?.length ?? 0) > 1);

    let status: CapabilityInventoryItem["status"] = "certified";
    if (!capsExist) status = "missing";
    else if (!routesLive && item.registry_kind === "capability") status = "partial";
    else if (duplicateCap) status = "duplicate";

    if (status === "missing") {
      findings.push({
        severity: "error",
        code: "inventory-missing",
        message: `${item.label} — capability registry entry not found`,
        entity_id: item.inventory_key,
      });
    }

    inventory.push({
      inventory_key: item.inventory_key,
      label: item.label,
      registry_kind: item.registry_kind,
      capability_ids: item.capability_ids,
      routes: item.routes,
      status,
      note:
        item.registry_kind === "bundled"
          ? "Bundled under parent capability — not a separate CAP entry"
          : item.registry_kind === "subsystem"
            ? "Certified engine under Contact v3 — surfaced via Relationship Platform"
            : "Standalone certified capability",
    });
  }

  const standaloneCaps = PSA_CERTIFIED_INVENTORY.filter((i) => i.registry_kind === "capability");
  const score = Math.round(
    ((standaloneCaps.filter((i) => inventory.find((x) => x.inventory_key === i.inventory_key)?.status === "certified")
      .length /
      Math.max(standaloneCaps.length, 1)) *
      70 +
      (graph.violations.length === 0 ? 30 : Math.max(0, 30 - graph.violations.length * 5))),
  );

  return {
    layer_id: "L2",
    layer_name: "Capability Registry",
    question: "Does every certified capability appear exactly once?",
    passed: graph.certified && findings.filter((f) => f.severity === "error").length === 0,
    score_percent: Math.min(100, score),
    findings,
  };
}

function buildLayer3DashboardSurfaces(): {
  layer: PlatformStateAuditLayer;
  surfaces: DashboardSurfaceCheck[];
} {
  const findings: PlatformStateFinding[] = [];
  const surfaces: DashboardSurfaceCheck[] = PSA_DASHBOARD_SURFACES.map((s) => {
    if (s.expected_route === null) {
      findings.push({
        severity: "warn",
        code: "surface-missing",
        message: `${s.label} has no dedicated workbench route`,
        entity_id: s.surface_id,
      });
      return {
        surface_id: s.surface_id,
        label: s.label,
        expected_route: null,
        status: "missing" as const,
        discovery_note: "No dedicated surface — capability may exist as embedded panel only",
      };
    }

    const present = routeExists(s.expected_route);
    const partial =
      s.surface_id === "building_today" ||
      s.surface_id === "operator_readiness" ||
      s.surface_id === "manager_dashboard";

    if (!present && !partial) {
      findings.push({
        severity: "error",
        code: "surface-route-missing",
        message: `${s.label} route ${s.expected_route} is not in live production routes`,
        entity_id: s.surface_id,
      });
    }

    return {
      surface_id: s.surface_id,
      label: s.label,
      expected_route: s.expected_route,
      status: present ? "present" : partial ? "partial" : "missing",
      discovery_note: present
        ? "Reachable via registered live route"
        : partial
          ? "Partial — embedded in Command Center / Contact Studio panels"
          : "Not discoverable as standalone surface",
    };
  });

  const presentCount = surfaces.filter((s) => s.status === "present" || s.status === "partial").length;
  const score = Math.round((presentCount / surfaces.length) * 100);

  return {
    surfaces,
    layer: {
      layer_id: "L3",
      layer_name: "Dashboard Surfaces",
      question: "Can the operator discover every capability?",
      passed: surfaces.filter((s) => s.status === "missing").length <= 2,
      score_percent: score,
      findings,
    },
  };
}

function buildLayer4Navigation(): PlatformStateAuditLayer {
  const experience = runExecutiveExperienceAudit();
  const integration = runIntegrationAudit();
  const findings: PlatformStateFinding[] = [];

  if (experience.dead_ends > 0) {
    findings.push({
      severity: "error",
      code: "nav-dead-ends",
      message: `${experience.dead_ends} navigation dead-end(s) detected`,
    });
  }
  if (experience.average_click_depth > 2.5) {
    findings.push({
      severity: "warn",
      code: "nav-click-depth",
      message: `Average click depth ${experience.average_click_depth} exceeds 2.5 target`,
    });
  }
  if (integration.metrics.orphan_pages > 0) {
    findings.push({
      severity: "warn",
      code: "nav-orphan-pages",
      message: `${integration.metrics.orphan_pages} orphan page(s) without executive question binding`,
    });
  }
  if (experience.registry_drift > 0) {
    findings.push({
      severity: "warn",
      code: "nav-registry-drift",
      message: `Registry drift: ${experience.registry_drift} route/capability mismatch(es)`,
    });
  }

  findings.push({
    severity: "info",
    code: "nav-metrics",
    message: `Avg clicks ${experience.average_click_depth} · cross-links ${integration.metrics.cross_route_links} · shell ${integration.metrics.shell_consistency_percent}%`,
  });

  return {
    layer_id: "L4",
    layer_name: "Navigation",
    question: "Can a new operator find everything?",
    passed: experience.dead_ends === 0 && experience.executive_experience_score >= 85,
    score_percent: experience.executive_experience_score,
    findings,
  };
}

function buildLayer5Governance(): {
  layer: PlatformStateAuditLayer;
  visibility: GovernanceVisibilityCheck[];
} {
  const findings: PlatformStateFinding[] = [];
  const overview = getEpoOverview();
  const hasGovernedStrip = overview.governed_platform !== null;

  const visibility: GovernanceVisibilityCheck[] = PSA_GOVERNANCE_ARTIFACTS.map((artifact) => {
    const locations = [...artifact.workbench_locations];
    let visible = locations.length > 0;

    if (artifact.artifact_id === "cpat" || artifact.artifact_id === "certified_doctrine") {
      visible = hasGovernedStrip;
    }
    if (artifact.artifact_id === "execution_charter") {
      visible = false;
      findings.push({
        severity: "warn",
        code: "governance-buried",
        message: "Execution Charter is docs-only — not linked from Command Center",
        entity_id: artifact.artifact_id,
      });
    }
    if (artifact.artifact_id === "operator_readiness" && hasGovernedStrip) {
      visible = true;
    }

    const buried = !visible || (artifact.artifact_id === "cpat" && !overview.governed_platform);

    if (buried && artifact.artifact_id !== "execution_charter") {
      findings.push({
        severity: "warn",
        code: "governance-visibility",
        message: `${artifact.label} is not prominently visible in the workbench`,
        entity_id: artifact.artifact_id,
      });
    }

    return {
      artifact_id: artifact.artifact_id,
      label: artifact.label,
      visible_in_workbench: visible && !buried,
      locations,
      buried,
    };
  });

  const visibleCount = visibility.filter((v) => v.visible_in_workbench).length;
  const score = Math.round((visibleCount / visibility.length) * 100);

  return {
    visibility,
    layer: {
      layer_id: "L5",
      layer_name: "Governance",
      question: "Does the workbench explain itself?",
      passed: visibleCount >= 5,
      score_percent: score,
      findings,
    },
  };
}

function buildLayer6CapabilityProgress(
  governed: ReturnType<typeof getGovernedPlatformSnapshot> | null,
  launchScore: number,
): PlatformStateAuditLayer {
  const operatorPercent = computeOperatorReadinessPercent(governed);
  const progress = computePsCapabilityProgress({
    ucie_certified: governed?.ucie_certified ?? false,
    contact_v3_certified: governed?.contact_v3_certified ?? false,
    operator_readiness_percent: operatorPercent,
    launch_score_percent: launchScore,
  });

  return {
    layer_id: "L6",
    layer_name: "Capability Progress",
    question: "What is capability completion by subsystem?",
    passed: progress.filter((p) => p.readiness_percent >= 90).length >= 2,
    score_percent: Math.round(
      progress.reduce((sum, p) => sum + p.readiness_percent, 0) / progress.length,
    ),
    findings: progress.map((p) => ({
      severity: "info" as const,
      code: "capability-progress",
      message: `${p.label}: ${p.progress_bar} ${p.readiness_percent}%`,
      entity_id: p.subsystem_id,
    })),
  };
}

function computeOperatorReadinessPercent(
  governed: ReturnType<typeof getGovernedPlatformSnapshot> | null,
): number {
  if (!governed?.era_active) return getOperatorValidationProgress();

  let score = getOperatorValidationProgress();
  if (governed.cpat_accepted) score += 15;
  if (governed.walkthrough_test_present) score += 10;
  if (governed.governed_tests_count >= 50) score += 15;
  return Math.min(100, score);
}

function buildLayer7NextHorizon(): NextHorizonStep[] {
  const roadmapById = new Map(PLATFORM_ROADMAP_AHEAD.map((s) => [s.step_id, s]));

  return PSA_NEXT_HORIZON_CHAIN.map((chain) => {
    const match = roadmapById.get(chain.step_id);
    return {
      step_id: chain.step_id,
      label: chain.label,
      phase: chain.phase,
      status: match?.status ?? (chain.step_id.startsWith("PRL-") ? "in_progress" : "planned"),
    };
  });
}

function buildDriftReport(input: {
  buildState: ReturnType<typeof computeBuildState>;
  governed: ReturnType<typeof getGovernedPlatformSnapshot> | null;
  briefingSignals: ReturnType<typeof collectExecutiveBriefingSignals>;
  projectState: ReturnType<typeof getProjectState>;
}): DriftItem[] {
  const drift: DriftItem[] = [];
  const overview = getEpoOverview();

  if (input.governed) {
    if (
      !containsPhase(input.buildState.current_phase_label, input.governed.phase_label) ||
      !containsPhase(input.buildState.current_phase_label, "PRL")
    ) {
      drift.push({
        field: "current_phase",
        source_a: "build_state.current_phase_label",
        value_a: input.buildState.current_phase_label,
        source_b: "governed.phase_label",
        value_b: input.governed.phase_label,
        severity: "error",
      });
    }

    if (
      normalizeForCompare(input.briefingSignals.building_today) !==
      normalizeForCompare(input.governed.building_today)
    ) {
      drift.push({
        field: "building_today",
        source_a: "executive_briefing.signals",
        value_a: input.briefingSignals.building_today ?? "—",
        source_b: "governed.building_today",
        value_b: input.governed.building_today,
        severity: "warn",
      });
    }

    if (overview.governed_platform) {
      if (
        overview.governed_platform.building_today !== input.governed.building_today
      ) {
        drift.push({
          field: "building_today",
          source_a: "epo.governed_platform",
          value_a: overview.governed_platform.building_today,
          source_b: "governed.snapshot",
          value_b: input.governed.building_today,
          severity: "error",
        });
      }

      const gpPrl = overview.governed_platform.platform_readiness_level;
      if (gpPrl !== input.governed.platform_readiness_level) {
        drift.push({
          field: "prl_level",
          source_a: "epo.governed_platform",
          value_a: gpPrl,
          source_b: "governed.snapshot",
          value_b: input.governed.platform_readiness_level ?? "—",
          severity: "error",
        });
      }
    }

    const launchPhase = input.projectState.launch_countdown.current_phase;
    if (!containsPhase(launchPhase, input.governed.phase_label)) {
      drift.push({
        field: "launch_countdown_phase",
        source_a: "project_state.launch_countdown",
        value_a: launchPhase,
        source_b: "governed.phase_label",
        value_b: input.governed.phase_label,
        severity: "warn",
      });
    }
  }

  if (
    input.briefingSignals.platform_readiness_level &&
    input.governed?.platform_readiness_level &&
    input.briefingSignals.platform_readiness_level !== input.governed.platform_readiness_level
  ) {
    drift.push({
      field: "prl_level",
      source_a: "executive_briefing.signals",
      value_a: input.briefingSignals.platform_readiness_level,
      source_b: "governed.snapshot",
      value_b: input.governed.platform_readiness_level,
      severity: "error",
    });
  }

  return drift;
}

function buildPlatformCoherence(
  drift: readonly DriftItem[],
  layers: readonly PlatformStateAuditLayer[],
): PlatformCoherenceScore {
  const questions = [
    {
      question: "Does every dashboard report the same phase?",
      passed: !drift.some((d) => d.field === "current_phase" || d.field === "launch_countdown_phase"),
      detail: drift.filter((d) => d.field.includes("phase")).length
        ? "Phase labels diverge across surfaces"
        : "Phase labels align",
    },
    {
      question: "Does every module know the current PRL?",
      passed: !drift.some((d) => d.field === "prl_level"),
      detail: drift.some((d) => d.field === "prl_level")
        ? "PRL level inconsistent"
        : "PRL-3 / PRL-4 gate consistent",
    },
    {
      question: "Do progress indicators match canonical building_today?",
      passed: !drift.some((d) => d.field === "building_today"),
      detail: drift.some((d) => d.field === "building_today")
        ? "building_today diverges"
        : "building_today aligned",
    },
    {
      question: "Does the capability graph certify without violations?",
      passed: layers.find((l) => l.layer_id === "L2")?.passed ?? false,
      detail: "Graph integrity certification",
    },
    {
      question: "Can operators navigate without dead ends?",
      passed: layers.find((l) => l.layer_id === "L4")?.passed ?? false,
      detail: "Executive experience navigation",
    },
    {
      question: "Is governance visible without digging into docs?",
      passed: layers.find((l) => l.layer_id === "L5")?.passed ?? false,
      detail: "Prime Directive · PRL · EDD visibility",
    },
  ];

  const checksPassed = questions.filter((q) => q.passed).length;
  const score = Math.round((checksPassed / questions.length) * 100);
  const label: PlatformCoherenceScore["label"] =
    score >= 95 ? "coherent" : score >= 80 ? "mostly_coherent" : score >= 60 ? "drifting" : "incoherent";

  return {
    score_percent: score,
    label,
    checks_passed: checksPassed,
    checks_total: questions.length,
    drift_count: drift.length,
    questions,
  };
}

export function runPlatformStateAudit(): PlatformStateReport {
  const buildState = computeBuildState();
  const governed = isGovernedPlatformEraActive() ? getGovernedPlatformSnapshot() : null;
  const commandCenter = computeV1CommandCenter(buildState);
  const projectState = getProjectState();
  const briefingSignals = collectExecutiveBriefingSignals();

  const { canonical, layer: layer1 } = buildLayer1BuildState(buildState, governed);
  const layer2 = buildLayer2CapabilityRegistry();
  const { layer: layer3, surfaces } = buildLayer3DashboardSurfaces();
  const layer4 = buildLayer4Navigation();
  const { layer: layer5, visibility } = buildLayer5Governance();
  const layer6 = buildLayer6CapabilityProgress(governed, commandCenter.v1_launch_score_percent);
  const nextHorizon = buildLayer7NextHorizon();
  const capabilityProgress = computePsCapabilityProgress({
    ucie_certified: governed?.ucie_certified ?? false,
    contact_v3_certified: governed?.contact_v3_certified ?? false,
    operator_readiness_percent: computeOperatorReadinessPercent(governed),
    launch_score_percent: commandCenter.v1_launch_score_percent,
  });

  const layers = [layer1, layer2, layer3, layer4, layer5, layer6, {
    layer_id: "L7",
    layer_name: "Next Horizon",
    question: "Where are we going?",
    passed: nextHorizon.some((s) => s.status === "in_progress"),
    score_percent: 100,
    findings: nextHorizon.map((s) => ({
      severity: "info" as const,
      code: "horizon-step",
      message: `${s.label} (${s.status})`,
      entity_id: s.step_id,
    })),
  }];

  const drift = buildDriftReport({
    buildState,
    governed,
    briefingSignals,
    projectState,
  });

  const platform_coherence = buildPlatformCoherence(drift, layers);

  const inventory: CapabilityInventoryItem[] = PSA_CERTIFIED_INVENTORY.map((item) => {
    const capsExist = item.capability_ids.every((id) =>
      CAPABILITY_REGISTRY.some((c) => c.capability_id === id),
    );
    const routesLive = item.routes.length === 0 || item.routes.some((r) => routeExists(r));
    let status: CapabilityInventoryItem["status"] = "certified";
    if (!capsExist) status = "missing";
    else if (!routesLive && item.registry_kind === "capability") status = "partial";

    return {
      inventory_key: item.inventory_key,
      label: item.label,
      registry_kind: item.registry_kind,
      capability_ids: item.capability_ids,
      routes: item.routes,
      status,
      note:
        item.registry_kind === "bundled"
          ? "Bundled under parent capability"
          : item.registry_kind === "subsystem"
            ? "Certified Contact v3 engine"
            : "Standalone capability",
    };
  });

  return {
    audit_id: "PSA-001",
    engine_id: PSA_ENGINE_ID,
    observed_at: canonical.observed_at,
    platform_coherence,
    canonical_state: canonical,
    drift_report: drift,
    capability_progress: capabilityProgress,
    next_horizon: nextHorizon,
    layers,
    capability_inventory: inventory,
    dashboard_surfaces: surfaces,
    governance_visibility: visibility,
  };
}
