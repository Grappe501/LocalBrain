/** Governed platform roadmap — next steps, phases, and live capability categories. */

import type { PlatformReadinessLevel } from "./platformReadiness.js";
import { EVIDENCE_SCOREBOARD_METRICS } from "./evidenceGovernance.js";
import { PRIME_DIRECTIVE } from "./evidenceGovernance.js";

export type PlatformRoadmapStepStatus =
  | "complete"
  | "in_progress"
  | "queued"
  | "planned";

export type PlatformRoadmapStep = {
  step_id: string;
  label: string;
  phase: string;
  status: PlatformRoadmapStepStatus;
  detail: string;
};

export type PlatformCapabilityCategory = {
  category_id: string;
  title: string;
  status: "production" | "partial" | "planned" | "reserved";
  readiness_percent: number;
  primary_routes: readonly string[];
  capability_ids: readonly string[];
  summary: string;
};

/** Authoritative next 15 steps from current PRL-3 / PRL-4 gate. */
export const PLATFORM_ROADMAP_AHEAD: readonly PlatformRoadmapStep[] = [
  {
    step_id: "PRL4-OP-001",
    label: "Kelly operator session",
    phase: "PRL-4 Operator Validation",
    status: "in_progress",
    detail: "OPERATOR-WALKTHROUGH-001 · briefing frame · facilitator card · evidence scribe",
  },
  {
    step_id: "PRL4-OP-002",
    label: "Chris operator session",
    phase: "PRL-4 Operator Validation",
    status: "queued",
    detail: "Second internal operator · independent evidence package",
  },
  {
    step_id: "PRL4-OP-003",
    label: "Third internal operator session",
    phase: "PRL-4 Operator Validation",
    status: "queued",
    detail: "Minimum 3 operators per PRL-4 Exit Contract",
  },
  {
    step_id: "PRL4-OEC",
    label: "OEC disposition review",
    phase: "PRL-4 Operator Validation",
    status: "queued",
    detail: "All operational evidence candidates analyzed and dispositioned",
  },
  {
    step_id: "PRL4-EXIT",
    label: "PRL-4 Exit Contract Assessment",
    phase: "PRL-4 Operator Validation",
    status: "queued",
    detail: "Readiness ≥90% · no dimension <85% · session integrity confirmed",
  },
  {
    step_id: "PRL4-CERT",
    label: "Advance to PRL-4 certified",
    phase: "PRL-4 Operator Validation",
    status: "queued",
    detail: "Platform Readiness Level → Internal Operator Validated",
  },
  {
    step_id: "WT1-FREEZE",
    label: "Freeze Walkthrough #1",
    phase: "Operator Regression",
    status: "planned",
    detail: "OPERATOR-WALKTHROUGH-001 immutable · permanent operator regression suite",
  },
  {
    step_id: "EDD-HARDEN",
    label: "Bounded EDD hardening",
    phase: "Evidence-Driven Development",
    status: "planned",
    detail: "Connectors · OCR · performance · accessibility · observability · onboarding docs",
  },
  {
    step_id: "BETA-PREP",
    label: "Commercial Beta preparation",
    phase: "Commercial Beta",
    status: "planned",
    detail: "ENG-BETA-001 · product surfaces · release governance",
  },
  {
    step_id: "BETA-SANDBOX",
    label: "Kelly sandbox golden test",
    phase: "Commercial Beta",
    status: "planned",
    detail: "Every module passes Kelly Sandbox isolation rule",
  },
  {
    step_id: "PRL5-PLAN",
    label: "External pilot planning",
    phase: "PRL-5 External Pilot",
    status: "planned",
    detail: "Selected external campaign teams · pilot evidence plan",
  },
  {
    step_id: "WT2-DESIGN",
    label: "Walkthrough #2 design",
    phase: "Operator Regression",
    status: "planned",
    detail: "New scenario · new evidence domain · do not change Walkthrough #1",
  },
  {
    step_id: "WT3-DESIGN",
    label: "Walkthrough #3 design",
    phase: "Operator Regression",
    status: "planned",
    detail: "Third canonical operator scenario for longitudinal readiness",
  },
  {
    step_id: "PRL5-EXEC",
    label: "External pilot execution",
    phase: "PRL-5 External Pilot",
    status: "planned",
    detail: "External operators · pilot evidence · no unresolved PRL-4 blockers",
  },
  {
    step_id: "PRL6-LAUNCH",
    label: "Production readiness / launch decision",
    phase: "PRL-6 Production Ready",
    status: "planned",
    detail: "Launch decision from converged operator evidence pipeline",
  },
] as const;

/** Live production capability categories for dashboard legibility. */
export const PLATFORM_CAPABILITY_CATEGORIES: readonly PlatformCapabilityCategory[] = [
  {
    category_id: "executive_os",
    title: "Executive Operating System",
    status: "partial",
    readiness_percent: 72,
    primary_routes: ["/", "/program-office", "/workspace/:workspaceId"],
    capability_ids: ["CAP-EO-001", "CAP-EPO-001", "CAP-WS-001"],
    summary: "Home · Program Office · Living Workspaces — V1 spine passing · PRL-4 polish pending",
  },
  {
    category_id: "institutional_cognition",
    title: "Institutional Cognition",
    status: "production",
    readiness_percent: 100,
    primary_routes: ["/explorer"],
    capability_ids: ["CAP-KX-001", "CAP-LRN-001"],
    summary: "Memory OS Wave 1 complete · Executive Intelligence pipeline closed · evidence packages",
  },
  {
    category_id: "communications",
    title: "Communications Office",
    status: "production",
    readiness_percent: 100,
    primary_routes: [],
    capability_ids: ["CAP-COM-001"],
    summary: "Traceability · uncertainty preservation · advisory restraint — module certified",
  },
  {
    category_id: "identity_acquisition",
    title: "Identity Acquisition (UCIE)",
    status: "production",
    readiness_percent: 94,
    primary_routes: ["/studio/ingestion"],
    capability_ids: ["CAP-UCIE-100"],
    summary: "CSV · OCR · manual intake · staged resolution · provenance on commit",
  },
  {
    category_id: "relationship_platform",
    title: "Relationship Platform (Contact v3)",
    status: "production",
    readiness_percent: 94,
    primary_routes: ["/studio/contacts", "/studio/relationships"],
    capability_ids: ["CAP-CONTACT-001", "CAP-REL-001"],
    summary: "Context · stewardship · household · org · actions · AI briefs · analytics",
  },
  {
    category_id: "volunteer_operations",
    title: "Volunteer Operations (VOP)",
    status: "partial",
    readiness_percent: 55,
    primary_routes: ["/studio/volunteer"],
    capability_ids: ["CAP-VOP-001"],
    summary: "VOP-001 Reference Pattern Certified · marketplace · queue · supervisor · quality flags",
  },
  {
    category_id: "migration",
    title: "Migration & Personal OS",
    status: "production",
    readiness_percent: 100,
    primary_routes: [
      "/migration",
      "/migration/digital-land-survey",
      "/migration/proof",
      "/migration/planning",
      "/migration/approval",
      "/migration/cutover",
    ],
    capability_ids: [
      "CAP-MIG-001",
      "CAP-MIG-002",
      "CAP-DLS-001",
      "CAP-PRF-001",
      "CAP-PLN-001",
      "CAP-APP-001",
      "CAP-CTO-001",
    ],
    summary: "Full migration lifecycle · proof · plan · approval · cutover",
  },
  {
    category_id: "operations",
    title: "Operations & Safety",
    status: "production",
    readiness_percent: 88,
    primary_routes: ["/system", "/system/providers", "/actions", "/settings"],
    capability_ids: ["CAP-SYS-001", "CAP-ACT-001", "CAP-SET-001", "CAP-AI-001"],
    summary: "System health · approval-gated actions · permissions · AI provider vault",
  },
  {
    category_id: "studios",
    title: "Department Studios",
    status: "partial",
    readiness_percent: 75,
    primary_routes: ["/studio/engineering", "/studio/writing", "/studio/data"],
    capability_ids: ["CAP-ENG-001", "CAP-WRT-001", "CAP-DAT-001"],
    summary: "Engineering · Writing · Data studios — scaffold with live registry hooks",
  },
  {
    category_id: "institution_os_reserved",
    title: "Institution OS (Reserved)",
    status: "reserved",
    readiness_percent: 0,
    primary_routes: [],
    capability_ids: ["FED-001", "WSP-001", "ILG-001", "EPO-001"],
    summary:
      "Constitution complete · FED · WSP · ILG · EPO reserved — no implementation until PRL-4 evidence",
  },
] as const;

export type GovernedPlatformDashboard = {
  era_active: boolean;
  prime_directive: typeof PRIME_DIRECTIVE;
  platform_readiness_level: PlatformReadinessLevel;
  current_gate: string;
  phase_label: string;
  building_today: string;
  active_milestone_id: string;
  active_milestone_name: string;
  next_milestone_id: string;
  next_milestone_name: string;
  critical_path_detail: string;
  operator_walkthrough_id: string;
  roadmap_steps: readonly PlatformRoadmapStep[];
  capability_categories: readonly PlatformCapabilityCategory[];
  evidence_scoreboard_metric_ids: readonly string[];
};

export function buildGovernedPlatformDashboard(input: {
  era_active: boolean;
  platform_readiness_level: PlatformReadinessLevel;
  phase_label: string;
  building_today: string;
  smallest_next_slice: string;
  critical_path_detail: string;
  operator_walkthrough_id: string;
}): GovernedPlatformDashboard | null {
  if (!input.era_active) return null;

  return {
    era_active: true,
    prime_directive: PRIME_DIRECTIVE,
    platform_readiness_level: input.platform_readiness_level,
    current_gate: "PRL-4 — Internal Operator Validated",
    phase_label: input.phase_label,
    building_today: input.building_today,
    active_milestone_id: "PRL-4",
    active_milestone_name: "Internal Operator Validated (OPERATOR-WALKTHROUGH-001)",
    next_milestone_id: "PRL-4-EXIT-CONTRACT",
    next_milestone_name: "PRL-4 Exit Contract Assessment",
    critical_path_detail: input.critical_path_detail,
    operator_walkthrough_id: input.operator_walkthrough_id,
    roadmap_steps: PLATFORM_ROADMAP_AHEAD,
    capability_categories: PLATFORM_CAPABILITY_CATEGORIES,
    evidence_scoreboard_metric_ids: EVIDENCE_SCOREBOARD_METRICS.map((m) => m.metric_id),
  };
}
