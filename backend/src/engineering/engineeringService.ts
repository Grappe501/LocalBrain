import type { EngineeringOverview } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { getSystemUsage } from "../system/systemService.js";
import { listDocumentationLibrary } from "../epo/docsLibrary.js";
import { parsePhaseChecklistSlices } from "../epo/checklistParser.js";
import { computeEngineeringScore } from "./engineeringScore.js";
import { buildEngineeringKnowledgeGraph, countTodoMarkers } from "./knowledgeGraph.js";
import { listBurtPacketHistory } from "./burtPacketProposer.js";
import { ENGINEERING_SPECIALISTS } from "./specialistRegistry.js";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

function countTestFiles(): number {
  const root = getRepoRoot();
  let count = 0;
  function walk(dir: string): void {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules") walk(full);
      else if (entry.isFile() && entry.name.endsWith(".test.ts")) count += 1;
    }
  }
  walk(join(root, "backend", "src"));
  return count;
}

export function getEngineeringScore() {
  return computeEngineeringScore();
}

export function getEngineeringOverview(): EngineeringOverview {
  const score = computeEngineeringScore();
  const usage = getSystemUsage();
  const graph = buildEngineeringKnowledgeGraph();
  const slices = parsePhaseChecklistSlices();
  const current =
    slices.find((s) => s.status === "in_progress") ??
    slices.find((s) => s.slice_id === "LB-OS-012" && s.status !== "complete") ??
    slices.find((s) => s.status === "spec_locked");
  const next = slices.find(
    (s) => s.status === "planned" || (s.status === "spec_locked" && s.slice_id !== current?.slice_id),
  );

  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);
  const engineeringProjects = workspaces.filter(
    (w) =>
      w.workspace_type === "engineering" ||
      w.workspace_type === "meta" ||
      w.workspace_id === "localbrain",
  );

  const projects =
    engineeringProjects.length > 0
      ? engineeringProjects
      : workspaces.filter((w) => w.workspace_id === "localbrain");

  const engDocs = listDocumentationLibrary()
    .filter(
      (d) =>
        d.category === "Architecture" ||
        d.category === "Database" ||
        d.path.includes("ENGINEERING") ||
        d.path.includes("API") ||
        d.path.includes("SCHEMA") ||
        d.path.includes("MODULE"),
    )
    .slice(0, 40)
    .map((d) => ({ path: d.path, title: d.title, category: d.category }));

  const todos = countTodoMarkers();
  const testCount = countTestFiles();
  const root = getRepoRoot();

  return {
    engineering_score: score,
    current_slice_id: current?.slice_id ?? null,
    current_slice_name: current?.name ?? null,
    current_sprint: current
      ? `${current.slice_id}: ${current.name}`
      : next
        ? `Next: ${next.slice_id}`
        : "V1 tail",
    active_repositories: [
      { id: "localbrain", label: "LocalBrain Platform", path: root },
    ],
    test_status: {
      test_file_count: testCount,
      last_run: null,
      passing: null,
      detail: `${testCount} test files indexed · run npm run test for live status`,
    },
    technical_debt: [
      `${todos} TODO markers in backend/frontend src`,
      `${graph.node_counts.slice} build slices tracked`,
      "Impact analysis: query engines, modules, or file names",
    ],
    chief_recommendation: {
      what: current ? `Ship ${current.slice_id}` : "Define next slice in EPO",
      why: "Program Office gate drives V1; Engineering graph tracks dependencies",
      confidence: "high",
      if_approved: "Generate Burt packet preview → export via Actions when write path opens",
    },
    projects: projects.map((w) => ({
      workspace_id: w.workspace_id,
      title: w.title,
      workspace_type: w.workspace_type,
      status: w.status,
      current_focus: w.current_focus,
      health_score: w.health_score,
      filesystem_roots: w.filesystem_roots,
    })),
    graph_summary: graph,
    burt_history: listBurtPacketHistory().slice(0, 20),
    knowledge_docs: engDocs,
    learn: {
      concepts_learned: ["Module loader", "LivingWorkspace", "Approval engine", "EPO scoreboard"],
      current_level: "Builder — V1 Executive OS",
      suggested_lesson: "Engineering Knowledge Graph — how Platform objects connect",
      practice_challenge: "Use Impact Analysis to trace ENG-PM-001 dependents",
      progress_percent: Math.min(100, score.score),
      teach_mode_available: true,
    },
    specialists: [...ENGINEERING_SPECIALISTS],
    operational_health_score: usage.operational_health_score,
    read_only: true,
    observed_at: new Date().toISOString(),
  };
}

export { buildEngineeringKnowledgeGraph } from "./knowledgeGraph.js";
export { analyzeImpact } from "./impactAnalysis.js";
export { explainProject } from "./explainProject.js";
export { previewBurtPacket, listBurtPacketHistory } from "./burtPacketProposer.js";
