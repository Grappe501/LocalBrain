/** PSA-001 Platform State Audit — shared contracts for workbench self-explanation. */

import { PRIME_DIRECTIVE } from "./evidenceGovernance.js";
import type { PlatformRoadmapStep } from "./platformRoadmap.js";

export const PSA_AUDIT_ID = "PSA-001" as const;
export const PSA_ENGINE_ID = "ENG-PSA-001" as const;

export type PlatformStateFindingSeverity = "info" | "warn" | "error";

export type PlatformStateFinding = {
  severity: PlatformStateFindingSeverity;
  code: string;
  message: string;
  entity_id?: string;
};

export type PlatformStateAuditLayer = {
  layer_id: string;
  layer_name: string;
  question: string;
  passed: boolean;
  score_percent: number;
  findings: readonly PlatformStateFinding[];
};

export type CanonicalPlatformState = {
  audit_id: typeof PSA_AUDIT_ID;
  observed_at: string;
  current_sprint: {
    completed: readonly string[];
    in_progress: readonly string[];
    queued: readonly string[];
  };
  current_phase: string;
  prl_level: string;
  cpat_status: string;
  prime_directive: string;
  next_operator_action: string;
  building_today: string;
  active_walkthrough_id: string;
};

export type DriftItem = {
  field: string;
  source_a: string;
  value_a: string;
  source_b: string;
  value_b: string;
  severity: PlatformStateFindingSeverity;
};

export type CapabilityProgressRow = {
  subsystem_id: string;
  label: string;
  readiness_percent: number;
  progress_bar: string;
  status: "certified" | "in_progress" | "planned" | "partial";
};

export type NextHorizonStep = {
  step_id: string;
  label: string;
  status: PlatformRoadmapStep["status"];
  phase: string;
};

export type DashboardSurfaceCheck = {
  surface_id: string;
  label: string;
  expected_route: string | null;
  status: "present" | "partial" | "missing";
  discovery_note: string;
};

export type CapabilityInventoryItem = {
  inventory_key: string;
  label: string;
  registry_kind: "capability" | "subsystem" | "bundled";
  capability_ids: readonly string[];
  routes: readonly string[];
  status: "certified" | "partial" | "missing" | "duplicate";
  note: string;
};

export type GovernanceVisibilityCheck = {
  artifact_id: string;
  label: string;
  visible_in_workbench: boolean;
  locations: readonly string[];
  buried: boolean;
};

export type PlatformCoherenceScore = {
  score_percent: number;
  label: "coherent" | "mostly_coherent" | "drifting" | "incoherent";
  checks_passed: number;
  checks_total: number;
  drift_count: number;
  questions: readonly { question: string; passed: boolean; detail: string }[];
};

export type PlatformStateReport = {
  audit_id: typeof PSA_AUDIT_ID;
  engine_id: typeof PSA_ENGINE_ID;
  observed_at: string;
  platform_coherence: PlatformCoherenceScore;
  canonical_state: CanonicalPlatformState;
  drift_report: readonly DriftItem[];
  capability_progress: readonly CapabilityProgressRow[];
  next_horizon: readonly NextHorizonStep[];
  layers: readonly PlatformStateAuditLayer[];
  capability_inventory: readonly CapabilityInventoryItem[];
  dashboard_surfaces: readonly DashboardSurfaceCheck[];
  governance_visibility: readonly GovernanceVisibilityCheck[];
};

/** Certified capability inventory keys — each must appear exactly once in PSA Layer 2. */
export const PSA_CERTIFIED_INVENTORY: readonly {
  inventory_key: string;
  label: string;
  capability_ids: readonly string[];
  routes: readonly string[];
  registry_kind: CapabilityInventoryItem["registry_kind"];
}[] = [
  {
    inventory_key: "ucie",
    label: "UCIE (Identity Acquisition)",
    capability_ids: ["CAP-UCIE-100"],
    routes: ["/studio/ingestion"],
    registry_kind: "capability",
  },
  {
    inventory_key: "contact_platform",
    label: "Contact Platform",
    capability_ids: ["CAP-CONTACT-001"],
    routes: ["/studio/contacts"],
    registry_kind: "capability",
  },
  {
    inventory_key: "import",
    label: "Import",
    capability_ids: ["CAP-UCIE-100"],
    routes: ["/studio/ingestion"],
    registry_kind: "bundled",
  },
  {
    inventory_key: "context",
    label: "Context",
    capability_ids: ["CAP-CONTACT-001"],
    routes: ["/studio/contacts"],
    registry_kind: "subsystem",
  },
  {
    inventory_key: "stewardship",
    label: "Stewardship",
    capability_ids: ["CAP-CONTACT-001"],
    routes: ["/studio/contacts"],
    registry_kind: "subsystem",
  },
  {
    inventory_key: "households",
    label: "Households",
    capability_ids: ["CAP-CONTACT-001"],
    routes: ["/studio/contacts"],
    registry_kind: "subsystem",
  },
  {
    inventory_key: "organizations",
    label: "Organizations",
    capability_ids: ["CAP-CONTACT-001"],
    routes: ["/studio/contacts"],
    registry_kind: "subsystem",
  },
  {
    inventory_key: "actions",
    label: "Actions",
    capability_ids: ["CAP-ACT-001", "CAP-CONTACT-001"],
    routes: ["/actions", "/studio/contacts"],
    registry_kind: "subsystem",
  },
  {
    inventory_key: "ai",
    label: "AI Briefs",
    capability_ids: ["CAP-CONTACT-001", "CAP-AI-001"],
    routes: ["/studio/contacts", "/system/providers"],
    registry_kind: "subsystem",
  },
  {
    inventory_key: "analytics",
    label: "Analytics",
    capability_ids: ["CAP-CONTACT-001", "CAP-REL-001"],
    routes: ["/studio/contacts", "/studio/relationships"],
    registry_kind: "subsystem",
  },
  {
    inventory_key: "work_marketplace",
    label: "Work Marketplace",
    capability_ids: ["CAP-VOP-001", "CAP-UCIE-100"],
    routes: ["/studio/volunteer", "/studio/ingestion"],
    registry_kind: "capability",
  },
];

/** Operator-facing dashboard surfaces — Layer 3 discovery audit. */
export const PSA_DASHBOARD_SURFACES: readonly {
  surface_id: string;
  label: string;
  expected_route: string | null;
}[] = [
  { surface_id: "executive_dashboard", label: "Executive Dashboard", expected_route: "/" },
  { surface_id: "command_center", label: "Command Center", expected_route: "/program-office" },
  { surface_id: "building_today", label: "Building Today", expected_route: "/program-office" },
  { surface_id: "operator_readiness", label: "Operator Readiness", expected_route: "/program-office" },
  { surface_id: "ucie", label: "UCIE", expected_route: "/studio/ingestion" },
  {
    surface_id: "relationship_platform",
    label: "Relationship Platform",
    expected_route: "/studio/contacts",
  },
  { surface_id: "volunteer_workspace", label: "Volunteer Workspace", expected_route: "/studio/volunteer" },
  { surface_id: "manager_dashboard", label: "Manager Dashboard", expected_route: "/studio/volunteer" },
];

/** Governance artifacts — Layer 5 visibility audit. */
export const PSA_GOVERNANCE_ARTIFACTS: readonly {
  artifact_id: string;
  label: string;
  workbench_locations: readonly string[];
}[] = [
  {
    artifact_id: "prime_directive",
    label: "Prime Directive",
    workbench_locations: ["/", "/program-office"],
  },
  {
    artifact_id: "prl",
    label: "Platform Readiness Level (PRL)",
    workbench_locations: ["/", "/program-office"],
  },
  {
    artifact_id: "cpat",
    label: "CPAT v1.0",
    workbench_locations: ["/program-office"],
  },
  {
    artifact_id: "edd",
    label: "Evidence-Driven Development (EDD)",
    workbench_locations: ["/", "/program-office"],
  },
  {
    artifact_id: "certified_doctrine",
    label: "Certified Implementation Doctrine",
    workbench_locations: ["/program-office"],
  },
  {
    artifact_id: "operator_readiness",
    label: "Operator Readiness",
    workbench_locations: ["/program-office"],
  },
  {
    artifact_id: "execution_charter",
    label: "Execution Charter",
    workbench_locations: ["/program-office"],
  },
];

/** Next Horizon chain — Layer 7 executive path (not sprint list). */
export const PSA_NEXT_HORIZON_CHAIN: readonly {
  step_id: string;
  label: string;
  phase: string;
}[] = [
  { step_id: "PRL-4", label: "PRL-4 — Internal Operator Validated", phase: "Operator Validation" },
  { step_id: "WT1-FREEZE", label: "Freeze Walkthrough #1", phase: "Operator Regression" },
  { step_id: "EDD-HARDEN", label: "Connector Hardening", phase: "Evidence-Driven Development" },
  { step_id: "EDD-PERF", label: "Performance & Observability", phase: "Evidence-Driven Development" },
  { step_id: "PRL5-EXEC", label: "External Pilot", phase: "PRL-5 External Pilot" },
  { step_id: "PRL-5", label: "PRL-5 — External Pilot Validated", phase: "PRL-5 External Pilot" },
  { step_id: "PRL6-LAUNCH", label: "Production", phase: "PRL-6 Production Ready" },
];

export function formatProgressBar(percent: number, width = 10): string {
  const filled = Math.round((Math.max(0, Math.min(100, percent)) / 100) * width);
  return `${"█".repeat(filled)}${"░".repeat(width - filled)}`;
}

export function computePsCapabilityProgress(input: {
  ucie_certified: boolean;
  contact_v3_certified: boolean;
  operator_readiness_percent: number;
  launch_score_percent: number;
}): CapabilityProgressRow[] {
  const identity = input.ucie_certified ? 100 : 94;
  const relationship = input.contact_v3_certified ? 100 : 94;
  const operator = Math.min(100, input.operator_readiness_percent);
  const connector = 20;
  const production = Math.min(100, Math.round(input.launch_score_percent * 0.35 + 10));

  return [
    {
      subsystem_id: "identity_platform",
      label: "Identity Platform",
      readiness_percent: identity,
      progress_bar: formatProgressBar(identity),
      status: identity >= 100 ? "certified" : "partial",
    },
    {
      subsystem_id: "relationship_platform",
      label: "Relationship Platform",
      readiness_percent: relationship,
      progress_bar: formatProgressBar(relationship),
      status: relationship >= 100 ? "certified" : "partial",
    },
    {
      subsystem_id: "operator_readiness",
      label: "Operator Readiness",
      readiness_percent: operator,
      progress_bar: formatProgressBar(operator),
      status: operator >= 90 ? "certified" : operator >= 40 ? "in_progress" : "partial",
    },
    {
      subsystem_id: "connector_hardening",
      label: "Connector Hardening",
      readiness_percent: connector,
      progress_bar: formatProgressBar(connector),
      status: "planned",
    },
    {
      subsystem_id: "production_readiness",
      label: "Production Readiness",
      readiness_percent: production,
      progress_bar: formatProgressBar(production),
      status: production >= 80 ? "in_progress" : "planned",
    },
  ];
}

export function formatPlatformStateReportMarkdown(report: PlatformStateReport): string {
  const lines: string[] = [
    `# ${report.audit_id} Platform State Report`,
    "",
    `> **Can the workbench accurately explain itself?**`,
    "",
    `Engine: \`${report.engine_id}\` · Observed: ${report.observed_at}`,
    "",
    `## Platform Coherence — ${report.platform_coherence.score_percent}% (${report.platform_coherence.label})`,
    "",
    `${report.platform_coherence.checks_passed}/${report.platform_coherence.checks_total} coherence checks passed · ${report.platform_coherence.drift_count} drift item(s)`,
    "",
    "---",
    "",
    "## 1. Canonical State",
    "",
    "| Field | Value |",
    "| --- | --- |",
    `| Phase | ${report.canonical_state.current_phase} |`,
    `| PRL | ${report.canonical_state.prl_level} |`,
    `| CPAT | ${report.canonical_state.cpat_status} |`,
    `| Prime Directive | ${report.canonical_state.prime_directive} |`,
    `| Building today | ${report.canonical_state.building_today} |`,
    `| Next operator action | ${report.canonical_state.next_operator_action} |`,
    `| Active walkthrough | ${report.canonical_state.active_walkthrough_id} |`,
    "",
    "**Current sprint**",
    "",
    `- Completed: ${report.canonical_state.current_sprint.completed.join(", ") || "—"}`,
    `- In progress: ${report.canonical_state.current_sprint.in_progress.join(", ") || "—"}`,
    `- Queued: ${report.canonical_state.current_sprint.queued.join(", ") || "—"}`,
    "",
    "---",
    "",
    "## 2. Drift Report",
    "",
  ];

  if (report.drift_report.length === 0) {
    lines.push("_No cross-surface drift detected._", "");
  } else {
    for (const d of report.drift_report) {
      lines.push(
        `- **${d.field}** (${d.severity}): \`${d.source_a}\` = "${d.value_a}" vs \`${d.source_b}\` = "${d.value_b}"`,
      );
    }
    lines.push("");
  }

  lines.push("---", "", "## 3. Capability Progress", "", "```text");
  for (const row of report.capability_progress) {
    lines.push(`${row.label}`);
    lines.push(`${row.progress_bar} ${row.readiness_percent}%`);
    lines.push("");
  }
  lines.push("```", "", "---", "", "## 4. Next Horizon", "", "```text");

  for (let i = 0; i < report.next_horizon.length; i++) {
    lines.push(report.next_horizon[i]!.label);
    if (i < report.next_horizon.length - 1) lines.push("↓");
  }
  lines.push("```", "", "---", "", "## Audit Layers", "");

  for (const layer of report.layers) {
    lines.push(`### ${layer.layer_name}`, "", `_${layer.question}_`, "");
    lines.push(
      `**${layer.passed ? "PASS" : "NEEDS WORK"}** · ${layer.score_percent}% · ${layer.findings.length} finding(s)`,
      "",
    );
    for (const f of layer.findings.slice(0, 8)) {
      lines.push(`- [${f.severity}] ${f.message}`);
    }
    if (layer.findings.length > 8) {
      lines.push(`- _…and ${layer.findings.length - 8} more_`);
    }
    lines.push("");
  }

  lines.push(
    "---",
    "",
    `_Generated by ${PSA_ENGINE_ID}. Re-run \`GET /api/epo/platform-state-audit\` for live state._`,
    "",
  );

  return lines.join("\n");
}
