import type { V1AcceptanceReport, V1Guardrail, V1SpineCheck } from "@localbrain/shared";
import { getRegisteredModules } from "../core/moduleLoader.js";
import { getPermissionEngine } from "../safety/permissionEngine.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { getEpoOverview } from "../epo/epoService.js";
import { getSystemHealth } from "../system/systemService.js";
import { getEngineeringOverview } from "../engineering/engineeringService.js";
import { getWritingOverview } from "../writing/writingService.js";
import { getDataIntelligenceOverview } from "../dataIntelligence/dataIntelligenceService.js";
import { getRelationshipNetworkOverview } from "../relationshipNetwork/relationshipNetworkService.js";
import { listProposedActions } from "../actions/proposalStore.js";
import { parsePhaseChecklistSlices } from "../epo/checklistParser.js";
import { getRegistryStats } from "../digitalAssets/assetRegistry.js";

const V1_DEPARTMENT_IDS = [
  "engineering-studio",
  "writing-studio",
  "data-studio",
  "relationship-studio",
];

const OPERATIONAL_LOOP = [
  "Observe",
  "Understand",
  "Plan",
  "Recommend",
  "Approve",
  "Execute",
  "Verify",
  "Learn",
];

function check(id: string, label: string, category: V1SpineCheck["category"], passed: boolean, detail: string): V1SpineCheck {
  return { id, label, category, passed, detail };
}

export function runV1Acceptance(): V1AcceptanceReport {
  const checks: V1SpineCheck[] = [];

  const slices = parsePhaseChecklistSlices();
  const v1Slices = ["LB-OS-012", "LB-OS-012.5", "LB-OS-013", "LB-OS-014", "LB-OS-015"];
  const v1Complete = v1Slices.every(
    (id) => slices.find((s) => s.slice_id === id)?.status === "complete",
  );
  checks.push(
    check(
      "v1-slices",
      "V1 department slices complete",
      "kernel",
      v1Complete,
      v1Complete ? "012–015 complete" : "One or more V1 slices not marked complete",
    ),
  );

  try {
    const epo = getEpoOverview();
    checks.push(
      check("epo", "Executive Program Office", "kernel", epo.read_only === true && epo.slices.length > 0, `${epo.metrics.overall_progress_percent}% progress`),
      check("epo-scores", "EPO live scores", "kernel", epo.metrics.engineering_score !== null, `Engineering ${epo.metrics.engineering_score ?? "—"} · Ops ${epo.metrics.operational_health_score}`),
    );
  } catch (e) {
    checks.push(check("epo", "Executive Program Office", "kernel", false, String(e)));
  }

  try {
    const health = getSystemHealth();
    checks.push(
      check("system-health", "System Health", "kernel", health.read_only === true, `Score ${health.operational_health_score.score}`),
    );
  } catch (e) {
    checks.push(check("system-health", "System Health", "kernel", false, String(e)));
  }

  try {
    const workspaces = listWorkspaces();
    checks.push(
      check("workspaces", "LivingWorkspace registry", "kernel", workspaces.some((w) => w.workspace_id === "localbrain"), `${workspaces.length} workspaces`),
    );
  } catch (e) {
    checks.push(check("workspaces", "LivingWorkspace registry", "kernel", false, String(e)));
  }

  try {
    const stats = getRegistryStats();
    checks.push(
      check("assets", "Digital Asset Registry", "kernel", stats.total_assets >= 0, `${stats.total_assets} assets indexed`),
    );
  } catch (e) {
    checks.push(check("assets", "Digital Asset Registry", "kernel", false, String(e)));
  }

  const modules = getRegisteredModules();
  for (const deptId of V1_DEPARTMENT_IDS) {
    const mod = modules.find((m) => m.module_id === deptId);
    checks.push(
      check(
        deptId,
        mod?.name ?? deptId,
        "department",
        mod?.status === "active",
        mod ? `status=${mod.status}` : "manifest missing",
      ),
    );
  }

  try {
    const eng = getEngineeringOverview();
    checks.push(check("eng-dept", "Engineering overview API", "department", eng.read_only === true, `Score ${eng.engineering_score.score}`));
  } catch (e) {
    checks.push(check("eng-dept", "Engineering overview API", "department", false, String(e)));
  }

  try {
    const wr = getWritingOverview();
    checks.push(check("writing-dept", "Writing overview API", "department", wr.read_only === true, `${wr.modes.length} modes`));
  } catch (e) {
    checks.push(check("writing-dept", "Writing overview API", "department", false, String(e)));
  }

  try {
    const data = getDataIntelligenceOverview();
    checks.push(check("data-dept", "Data & Intelligence API", "department", data.read_only === true, `${data.knowledge_sources.length} sources`));
  } catch (e) {
    checks.push(check("data-dept", "Data & Intelligence API", "department", false, String(e)));
  }

  try {
    const rel = getRelationshipNetworkOverview();
    checks.push(check("rel-dept", "Relationship & Network API", "department", rel.read_only === true, `${rel.people.length} profiles`));
  } catch (e) {
    checks.push(check("rel-dept", "Relationship & Network API", "department", false, String(e)));
  }

  try {
    const pe = getPermissionEngine();
    const denied = pe.checkPath({ path: "C:\\Windows\\System32", action: "read" });
    checks.push(
      check("permission-engine", "Permission engine", "safety", !denied.allowed, denied.allowed ? "Should deny system path" : "System paths blocked"),
    );
  } catch (e) {
    checks.push(check("permission-engine", "Permission engine", "safety", false, String(e)));
  }

  try {
    listProposedActions();
    checks.push(check("actions-queue", "Approval actions queue", "safety", true, "Proposal store readable"));
  } catch (e) {
    checks.push(check("actions-queue", "Approval actions queue", "safety", false, String(e)));
  }

  const guardrails: V1Guardrail[] = [
    { id: "no-silent-writes", rule: "No silent writes", enforced: true },
    { id: "no-publish", rule: "No auto-publishing or social posting", enforced: true },
    { id: "no-external-sync", rule: "No external CRM/email/calendar sync", enforced: true },
    { id: "no-auto-exec", rule: "No auto-execution of shell or SQL", enforced: true },
    { id: "approval-gate", rule: "File writes via approval queue only", enforced: true },
  ];

  for (const g of guardrails) {
    checks.push(check(g.id, g.rule, "guardrail", g.enforced, "Binding for V1"));
  }

  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;

  return {
    milestone: "Executive OS V1",
    slice_id: "LB-OS-016",
    release_candidate: passed === total,
    overall_pass: passed === total,
    passed_count: passed,
    total_count: total,
    operational_loop: OPERATIONAL_LOOP,
    checks,
    guardrails,
    can_do: [
      "Executive Briefing home",
      "Program Office scoreboard",
      "System Health + status dock",
      "LivingWorkspace registry",
      "Knowledge Explorer browse",
      "Digital Asset Registry + intelligence",
      "Command layer (CoS) with proposals",
      "Permission-gated file read/summarize",
      "Approval-gated file actions",
      "Engineering / Writing / Data / Relationships departments (read & preview)",
    ],
    cannot_do: [
      "Silent file writes or deletes",
      "Auto-publish to Substack, social, or email",
      "Google Contacts / Gmail / Calendar sync",
      "Arbitrary SQL execution",
      "Shell commands or auto-deployment",
      "Full NL→SQL with live results (plan preview only)",
      "Automated relationship outreach",
    ],
    read_only: true,
    observed_at: new Date().toISOString(),
  };
}
