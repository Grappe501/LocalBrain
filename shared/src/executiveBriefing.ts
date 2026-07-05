/**
 * ENG-EOB-001 — Executive Office experience contract (LB-OS-026.7)
 *
 * LocalBrain home is an Executive Operating Environment — not a dashboard of cards.
 * Chief of Staff synthesizes department reports; departments never speak directly to the executive.
 */

import {
  buildExecutiveOfficeProjection,
  type DepartmentAttentionLevel,
  type DepartmentProjection,
  type ExecutiveOfficeProjection,
} from "./executiveOffice.js";
import { getCapabilityById } from "./capabilityRegistry.js";

export const EXECUTIVE_BRIEFING_ENGINE_ID = "ENG-EOB-001";

/** Chief of Staff editorial decisions on department submissions */
export type CosEditorialAction = "include" | "merge" | "suppress" | "escalate" | "delay";

export type DepartmentReportStatus = "healthy" | "degraded" | "monitoring" | "reserved";

export type ExecutiveOfficeZoneId = "briefing" | "workspace" | "office" | "operations";

export interface ChiefOfStaffBriefing {
  title: string;
  greeting: string;
  /** Single narrative — not widget fragments */
  narrative: string;
  estimated_reading_minutes: number;
  executive_attention_score: number | null;
  top_priorities: string[];
  items_elevated_count: number;
}

export interface DepartmentDailyReport {
  department_id: string;
  title: string;
  status: DepartmentReportStatus;
  attention: DepartmentAttentionLevel;
  /** Narrative summary for briefing — not metrics dashboard */
  summary: string;
  /** Only delta since last briefing — not everything the department knows */
  what_changed_since_yesterday: string[];
  read_more_route: string | null;
  /** CoS editorial state when synthesized (scaffold defaults to include) */
  editorial_action: CosEditorialAction;
}

export interface ExecutiveOfficeZone {
  zone_id: ExecutiveOfficeZoneId;
  title: string;
  description: string;
  /** Shown after briefing in reading order */
  order: number;
  items: { label: string; route: string; capability_id?: string }[];
}

export interface BriefingArchiveEntry {
  briefing_id: string;
  date: string;
  chief_of_staff_title: string;
  chief_of_staff_narrative: string;
  department_ids_included: string[];
  actions_taken: string[];
  outcome: string | null;
  learning: string | null;
}

export interface ExecutiveOfficeExperience {
  engine_id: typeof EXECUTIVE_BRIEFING_ENGINE_ID;
  slice_id: "LB-OS-026.7";
  generated_at: string;
  /** scaffold until live briefing engine and archive ship */
  projection_mode: "scaffold" | "live";
  experience_title: string;
  daily_questions: string[];
  briefing: ChiefOfStaffBriefing;
  department_reports: DepartmentDailyReport[];
  cos_editorial_actions: CosEditorialAction[];
  zones: ExecutiveOfficeZone[];
  archive: BriefingArchiveEntry[];
  office: ExecutiveOfficeProjection;
}

export const EXECUTIVE_DAILY_QUESTIONS = [
  "What deserves my attention?",
  "What decision requires me?",
  "What can safely wait?",
  "What changed that I didn't notice?",
] as const;

export const COS_EDITORIAL_ACTIONS: CosEditorialAction[] = [
  "include",
  "merge",
  "suppress",
  "escalate",
  "delay",
];

/** Real system signals — no fabricated department intelligence */
export interface ExecutiveBriefingSignals {
  v1_overall_pass?: boolean | null;
  v1_failed_checks?: string[];
  consolidation_score?: number | null;
  consolidation_band?: string | null;
  graph_integrity_pass?: boolean | null;
  workspace_id?: string | null;
  workspace_focus?: string | null;
  current_build_slice?: string | null;
  /** Governed platform era — EDD / PRL-4 */
  governed_era_active?: boolean | null;
  platform_readiness_level?: string | null;
  prime_directive?: string | null;
  current_gate?: string | null;
  building_today?: string | null;
}

function departmentStatus(dept: DepartmentProjection): DepartmentReportStatus {
  if (dept.lifecycle === "reserved") return "reserved";
  if (dept.lifecycle === "emerging") return "monitoring";
  if (dept.live_capability_count > 0 && dept.reserved_capability_count === 0) return "healthy";
  return "healthy";
}

function scaffoldSummary(dept: DepartmentProjection): string {
  if (dept.lifecycle === "reserved") {
    return `${dept.title} is reserved — infrastructure and doctrine in place. Intelligence domains (${dept.owned_domains.map((d) => d.title).join(", ")}) await connector slices.`;
  }
  if (dept.synthesis_role) {
    return "Synthesizing department contributions into a single Chief of Staff narrative. Unread counts and volume are not elevation signals.";
  }
  const capNote =
    dept.live_capability_count > 0
      ? `${dept.live_capability_count} live capability${dept.live_capability_count === 1 ? "" : "ies"} reporting.`
      : "Emerging — capabilities wiring in progress.";
  return `${dept.objectives.mission} ${capNote}`;
}

function scaffoldDelta(dept: DepartmentProjection): string[] {
  if (dept.lifecycle === "reserved") {
    return ["Department reserved — no operational delta until connectors ship."];
  }
  return ["Institutional delta tracking activates when daily briefing archive records prior sessions."];
}

function buildZones(): ExecutiveOfficeZone[] {
  return [
    {
      zone_id: "briefing",
      title: "Chief of Staff Briefing",
      description: "Primary entry — narrative synthesis before any workspace or ops surface",
      order: 1,
      items: [],
    },
    {
      zone_id: "workspace",
      title: "Executive Workspace",
      description: "Today's work — after briefing",
      order: 2,
      items: [
        { label: "Living Workspace", route: "/workspace/localbrain" },
        { label: "Program Office", route: "/program-office" },
        { label: "Contact Management", route: "/studio/contacts" },
        { label: "Identity Acquisition (UCIE)", route: "/studio/ingestion" },
        { label: "Volunteer Operations (VOP)", route: "/studio/volunteer" },
        { label: "Executive Questions", route: "/#executive-questions" },
      ],
    },
    {
      zone_id: "office",
      title: "Office",
      description: "Departments, capabilities, directory",
      order: 3,
      items: [
        { label: "Department reports", route: "/#department-reports" },
        { label: "Program Office", route: "/program-office" },
        { label: "Experience maturity", route: "/program-office" },
      ],
    },
    {
      zone_id: "operations",
      title: "Operations",
      description: "Platform background — migration, build, system health",
      order: 4,
      items: [
        { label: "Migration", route: "/migration" },
        { label: "Program Office", route: "/program-office" },
        { label: "System Health", route: "/system" },
      ],
    },
  ];
}

function buildChiefOfStaffBriefing(
  executiveDepts: DepartmentProjection[],
  synthesisDept: DepartmentProjection | undefined,
  signals?: ExecutiveBriefingSignals,
): ChiefOfStaffBriefing {
  const liveCount = executiveDepts.filter(
    (d) => d.lifecycle === "live" || d.lifecycle === "emerging",
  ).length;
  const reservedCount = executiveDepts.filter((d) => d.lifecycle === "reserved").length;

  const narrativeParts: string[] = [
    "Good morning. I reviewed available system signals and the Executive Office roster.",
  ];

  if (signals?.graph_integrity_pass === true) {
    narrativeParts.push("Capability graph integrity is certified PASS.");
  } else if (signals?.graph_integrity_pass === false) {
    narrativeParts.push("Capability graph integrity needs attention before new work ships.");
  }

  if (signals?.v1_overall_pass === true) {
    narrativeParts.push("V1 spine acceptance is passing.");
  } else if (signals?.v1_overall_pass === false) {
    const n = signals.v1_failed_checks?.length ?? 0;
    narrativeParts.push(
      n > 0
        ? `V1 spine has ${n} open check${n === 1 ? "" : "s"} requiring executive awareness.`
        : "V1 spine acceptance is not fully passing.",
    );
  }

  if (signals?.consolidation_score != null) {
    const band = signals.consolidation_band ? ` (${signals.consolidation_band})` : "";
    narrativeParts.push(
      `Consolidation opportunity score is ${signals.consolidation_score}/100${band} — from live registry evidence, not inbox volume.`,
    );
  }

  if (signals?.workspace_focus) {
    narrativeParts.push(`Active workspace focus: ${signals.workspace_focus}.`);
  }

  narrativeParts.push(
    `The office has ${liveCount} departments live or emerging and ${reservedCount} reserved with infrastructure in place. Reserved departments report readiness only — no connector intelligence is claimed.`,
  );

  const top_priorities: string[] = [];
  if (signals?.governed_era_active) {
    if (signals.prime_directive) {
      top_priorities.push(`Prime Directive: ${signals.prime_directive}`);
    }
    if (signals.current_gate) {
      top_priorities.push(`Current gate: ${signals.current_gate}`);
    }
    if (signals.building_today) {
      top_priorities.push(signals.building_today);
    }
    top_priorities.push("Open Program Office for roadmap, capabilities, and evidence scoreboard");
  }
  if (signals?.v1_failed_checks?.length) {
    for (const label of signals.v1_failed_checks.slice(0, 3)) {
      top_priorities.push(`V1 spine: ${label}`);
    }
  }
  if (signals?.consolidation_score != null && signals.consolidation_score >= 50) {
    top_priorities.push("Review consolidation opportunity from live asset registry");
  }
  if (!signals?.governed_era_active && signals?.current_build_slice) {
    top_priorities.push(`Current build slice: ${signals.current_build_slice}`);
  }
  if (top_priorities.length === 0) {
    top_priorities.push("Review department readiness reports below");
    top_priorities.push("Open Program Office for build state and experience maturity");
  }

  const elevated = executiveDepts.filter(
    (d) =>
      d.objectives.attention_level === "elevated" ||
      d.objectives.attention_level === "normal",
  );

  return {
    title: "Chief of Staff Briefing",
    greeting: "Good morning, Steve.",
    narrative: narrativeParts.join(" "),
    estimated_reading_minutes: 6,
    executive_attention_score: null,
    top_priorities,
    items_elevated_count: elevated.length,
  };
}

export function buildDepartmentDailyReports(
  departments: DepartmentProjection[],
  tier: "executive" | "operational" | "all" = "executive",
): DepartmentDailyReport[] {
  const pool =
    tier === "all"
      ? departments
      : tier === "executive"
        ? departments.filter((d) => d.tier === "executive")
        : departments.filter((d) => d.tier === "operational");

  return pool
    .filter((d) => !d.synthesis_role)
    .sort((a, b) => {
      const order: Record<DepartmentAttentionLevel, number> = {
        elevated: 0,
        normal: 1,
        monitoring: 2,
        dormant: 3,
      };
      return order[a.objectives.attention_level] - order[b.objectives.attention_level];
    })
    .map((dept) => ({
      department_id: dept.department_id,
      title: dept.title,
      status: departmentStatus(dept),
      attention: dept.objectives.attention_level,
      summary: scaffoldSummary(dept),
      what_changed_since_yesterday: scaffoldDelta(dept),
      read_more_route:
        dept.live_capability_count > 0
          ? (getCapabilityById(dept.capability_ids[0] ?? "")?.primary_route ?? null)
          : null,
      editorial_action: "include" as CosEditorialAction,
    }));
}

export function buildExecutiveOfficeExperience(
  signals?: ExecutiveBriefingSignals,
): ExecutiveOfficeExperience {
  const office = buildExecutiveOfficeProjection();
  const synthesisDept = office.executive_departments.find((d) => d.synthesis_role);
  const department_reports = buildDepartmentDailyReports(office.departments, "executive");

  return {
    engine_id: EXECUTIVE_BRIEFING_ENGINE_ID,
    slice_id: "LB-OS-026.7",
    generated_at: new Date().toISOString(),
    projection_mode: "scaffold",
    experience_title: "Executive Office",
    daily_questions: [...EXECUTIVE_DAILY_QUESTIONS],
    briefing: buildChiefOfStaffBriefing(office.executive_departments, synthesisDept, signals),
    department_reports,
    cos_editorial_actions: [...COS_EDITORIAL_ACTIONS],
    zones: buildZones(),
    archive: [],
    office,
  };
}

export function renderExecutiveOfficeExperienceMarkdown(exp: ExecutiveOfficeExperience): string {
  const lines: string[] = [
    "# Executive Office Experience",
    "",
    `> **Engine:** ${exp.engine_id} · **Slice:** ${exp.slice_id} · **Mode:** ${exp.projection_mode}`,
    "",
    "## Daily questions",
    "",
    ...exp.daily_questions.map((q, i) => `${i + 1}. ${q}`),
    "",
    "---",
    "",
    `## ${exp.briefing.title}`,
    "",
    exp.briefing.greeting,
    "",
    `*Estimated reading time: ${exp.briefing.estimated_reading_minutes} minutes*`,
    "",
    exp.briefing.narrative,
    "",
    "### Today's top priorities",
    "",
    ...exp.briefing.top_priorities.map((p) => `- ${p}`),
    "",
    "---",
    "",
    "## Department reports",
    "",
  ];

  for (const report of exp.department_reports) {
    lines.push(
      `### ${report.title}`,
      "",
      `| Status | Attention | Editorial |`,
      `| ------ | --------- | --------- |`,
      `| ${report.status} | ${report.attention} | ${report.editorial_action} |`,
      "",
      report.summary,
      "",
      "**What changed since yesterday:**",
      ...report.what_changed_since_yesterday.map((d) => `- ${d}`),
      "",
      "---",
      "",
    );
  }

  lines.push("## Experience zones (reading order)", "");
  for (const zone of exp.zones.sort((a, b) => a.order - b.order)) {
    lines.push(`### ${zone.order}. ${zone.title}`, "", zone.description, "");
    for (const item of zone.items) {
      lines.push(`- ${item.label} → \`${item.route}\``);
    }
    lines.push("");
  }

  return lines.join("\n");
}
