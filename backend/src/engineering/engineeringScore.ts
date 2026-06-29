import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { EngineeringScore } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";
import { getRegisteredModules } from "../core/moduleLoader.js";
import { listProposedActions } from "../actions/proposalStore.js";
import { listDocumentationLibrary } from "../epo/docsLibrary.js";
import { buildEngineeringKnowledgeGraph, countTodoMarkers } from "./knowledgeGraph.js";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function labelFromScore(score: number): EngineeringScore["label"] {
  if (score >= 85) return "strong";
  if (score >= 70) return "solid";
  return "needs_attention";
}

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

export function computeEngineeringScore(): EngineeringScore {
  const root = getRepoRoot();
  const modules = getRegisteredModules();
  const activeModules = modules.filter((m) => m.status === "active").length;
  const stubModules = modules.filter((m) => m.status === "stub").length;
  const docs = listDocumentationLibrary();
  const engDocs = docs.filter(
    (d) =>
      d.category === "Architecture" ||
      d.path.includes("ENGINEERING") ||
      d.path.includes("ARCHITECTURE"),
  );
  const testCount = countTestFiles();
  const todos = countTodoMarkers();
  const pending = listProposedActions("pending").length;
  const graph = buildEngineeringKnowledgeGraph();
  const edgeDensity =
    graph.nodes.length > 0 ? Math.min(100, (graph.edges.length / graph.nodes.length) * 40) : 50;

  const architectureScore = clamp(
    70 + activeModules * 4 - stubModules * 2 + (existsSync(join(root, "backend", "src", "core")) ? 10 : 0),
  );
  const documentationScore = clamp(50 + Math.min(45, engDocs.length * 2) + (existsSync(join(root, "README.md")) ? 10 : 0));
  const testingScore = clamp(40 + Math.min(50, testCount * 2));
  const technicalDebtScore = clamp(100 - Math.min(40, todos * 2) - Math.min(20, pending * 4));
  const performanceScore = clamp(existsSync(join(root, "frontend", "dist")) ? 88 : 75);
  const securityScore = clamp(
    existsSync(join(root, "backend", "src", "safety", "permissionEngine.ts")) ? 94 : 60,
  );
  const deploymentScore = clamp(
    60 +
      (existsSync(join(root, "package.json")) ? 10 : 0) +
      activeModules * 3 +
      (modules.some((m) => m.module_id === "engineering-studio" && m.status === "active") ? 8 : 0),
  );
  const knowledgeCoverageScore = clamp(50 + edgeDensity);

  const factors = [
    {
      id: "architecture",
      name: "Architecture",
      score: architectureScore,
      weight: 0.15,
      detail: `${modules.length} modules · ${activeModules} active`,
    },
    {
      id: "documentation",
      name: "Documentation",
      score: documentationScore,
      weight: 0.12,
      detail: `${engDocs.length} engineering/architecture docs`,
    },
    {
      id: "testing",
      name: "Testing",
      score: testingScore,
      weight: 0.15,
      detail: `${testCount} backend test files`,
    },
    {
      id: "technical_debt",
      name: "Technical Debt",
      score: technicalDebtScore,
      weight: 0.15,
      detail: `${todos} TODO markers · ${pending} pending approvals`,
    },
    {
      id: "performance",
      name: "Performance",
      score: performanceScore,
      weight: 0.1,
      detail: "Build artifact and bundle heuristics",
    },
    {
      id: "security",
      name: "Security",
      score: securityScore,
      weight: 0.13,
      detail: "Permission engine alignment",
    },
    {
      id: "deployment",
      name: "Deployment",
      score: deploymentScore,
      weight: 0.1,
      detail: `${activeModules} active department modules`,
    },
    {
      id: "knowledge_coverage",
      name: "Knowledge Coverage",
      score: knowledgeCoverageScore,
      weight: 0.1,
      detail: `${graph.nodes.length} graph nodes · ${graph.edges.length} edges`,
    },
  ];

  const weightSum = factors.reduce((s, f) => s + f.weight, 0);
  const score = clamp(factors.reduce((sum, f) => sum + f.score * f.weight, 0) / weightSum);
  const label = labelFromScore(score);
  const summary =
    label === "strong"
      ? "Engineering ecosystem is well instrumented and documented."
      : label === "solid"
        ? "Foundation is solid — targeted improvements will raise the score."
        : "Multiple engineering signals need attention before heavy changes.";

  return { score, label, summary, factors };
}
