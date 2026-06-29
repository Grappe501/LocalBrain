import type { EngineeringExplainResponse, EngineeringRecommendation } from "@localbrain/shared";
import { getWorkspace } from "../workspaces/workspaceRegistry.js";
import { BINDING_DECISIONS } from "../context/bindingDecisions.js";
import { parsePhaseChecklistSlices } from "../epo/checklistParser.js";
import { computeEngineeringScore } from "./engineeringScore.js";
import { buildEngineeringKnowledgeGraph, countTodoMarkers } from "./knowledgeGraph.js";
import { getSystemUsage } from "../system/systemService.js";

function recommendation(
  what: string,
  why: string,
  confidence: EngineeringRecommendation["confidence"],
  ifApproved: string,
): EngineeringRecommendation {
  return { what, why, confidence, if_approved: ifApproved };
}

export function explainProject(workspaceId: string): EngineeringExplainResponse | null {
  const ws = getWorkspace(workspaceId);
  if (!ws) return null;

  const score = computeEngineeringScore();
  const usage = getSystemUsage();
  const graph = buildEngineeringKnowledgeGraph();
  const slices = parsePhaseChecklistSlices();
  const current =
    slices.find((s) => s.status === "in_progress") ??
    slices.find((s) => s.slice_id === "LB-OS-012" && s.status !== "complete") ??
    slices.find((s) => s.status === "spec_locked");

  const moduleNodes = graph.nodes.filter((n) => n.kind === "module").map((n) => n.label);
  const deps = ws.filesystem_roots.length
    ? ws.filesystem_roots
    : ["Platform repo", ...moduleNodes.slice(0, 4)];

  const todos = countTodoMarkers();
  const risks: string[] = [];
  if (todos > 15) risks.push(`${todos} TODO markers across platform source`);
  if (score.factors.find((f) => f.id === "testing")!.score < 80) {
    risks.push("Test coverage heuristics below target — run full suite before large refactors");
  }
  if (usage.operational_health_score < 75) {
    risks.push("Operational health below 75 — review System Health before heavy engineering");
  }

  return {
    workspace_id: ws.workspace_id,
    workspace_title: ws.title,
    mission: ws.executive_context || ws.success_definition || ws.description || "No mission set.",
    architecture: `Engineering Knowledge Graph: ${graph.nodes.length} nodes. Modules: ${moduleNodes.join(", ") || "none registered"}.`,
    health: `Engineering Score ${score.score}/100 (${score.label}) · Operational Health ${usage.operational_health_score}/100.`,
    current_sprint: ws.current_focus || current?.name || "No active sprint focus",
    major_risks: risks.length ? risks : ["No critical risks flagged by heuristics"],
    dependencies: deps,
    open_decisions: BINDING_DECISIONS.map((d) => `${d.id}: ${d.title}`),
    technical_debt: [
      `${todos} TODO markers in src`,
      `${graph.node_counts.test} test nodes indexed`,
      "Full impact analysis available via Engineering → Architecture",
    ],
    recommended_next_step: recommendation(
      current ? `Complete ${current.slice_id}: ${current.name}` : "Set workspace current_focus",
      "EPO gate and checklist drive V1 delivery order",
      "high",
      "Open Program Office scoreboard to confirm dependencies, then generate a Burt packet preview",
    ),
    read_only: true,
  };
}
