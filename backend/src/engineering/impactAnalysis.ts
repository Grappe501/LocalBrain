import type { EngineeringImpactResult, EngGraphNode } from "@localbrain/shared";
import { buildEngineeringKnowledgeGraph } from "./knowledgeGraph.js";

function matchesQuery(node: EngGraphNode, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    node.id.toLowerCase().includes(lower) ||
    node.label.toLowerCase().includes(lower) ||
    (node.detail?.toLowerCase().includes(lower) ?? false)
  );
}

function collectAffected(
  graph: ReturnType<typeof buildEngineeringKnowledgeGraph>,
  startIds: Set<string>,
): EngGraphNode[] {
  const affected = new Map<string, EngGraphNode>();
  const queue = [...startIds];

  while (queue.length > 0) {
    const id = queue.shift()!;
    const node = graph.nodes.find((n) => n.id === id);
    if (node) affected.set(id, node);

    for (const edge of graph.edges) {
      if (edge.from === id && !affected.has(edge.to)) {
        if (edge.kind === "depends_on" || edge.kind === "uses" || edge.kind === "tests") {
          queue.push(edge.to);
        }
      }
      if (edge.to === id && !affected.has(edge.from)) {
        if (edge.kind === "depends_on" || edge.kind === "implements") {
          queue.push(edge.from);
        }
      }
    }
  }

  return [...affected.values()].filter((n) => !startIds.has(n.id));
}

export function analyzeImpact(query: string): EngineeringImpactResult {
  const graph = buildEngineeringKnowledgeGraph();
  const q = query.trim();
  if (!q) {
    return {
      query: q,
      matched_nodes: [],
      affected_nodes: [],
      paths: [],
      read_only: true,
    };
  }

  const matched = graph.nodes.filter((n) => matchesQuery(n, q));
  const matchedIds = new Set(matched.map((n) => n.id));
  const affected = collectAffected(graph, matchedIds);

  const paths: string[][] = [];
  for (const m of matched.slice(0, 5)) {
    for (const edge of graph.edges) {
      if (edge.from === m.id) {
        const target = graph.nodes.find((n) => n.id === edge.to);
        if (target) paths.push([m.label, edge.kind, target.label]);
      }
    }
  }

  return {
    query: q,
    matched_nodes: matched,
    affected_nodes: affected.slice(0, 24),
    paths: paths.slice(0, 12),
    read_only: true,
  };
}
