/**
 * Navigation Intelligence — graph projections from ENG-CAP-001 (LB-OS-026.6)
 */

import { PHASE_1_EXECUTIVE_QUESTIONS } from "./executiveQuestion.js";
import {
  CAPABILITY_REGISTRY,
  CAPABILITY_REGISTRY_ENGINE_ID,
  WORKFLOW_REGISTRY,
  WF_MIGRATION_EXECUTION,
  getAuthoritativeCapabilityForQuestion,
  getCapabilityById,
  matchCapabilityForRoute,
  normalizeRoutePath,
  type CapabilityEntry,
  type CapabilityRelationType,
  type WorkflowDefinition,
} from "./capabilityRegistry.js";

export const NAVIGATION_INTELLIGENCE_ENGINE_ID = "ENG-NAV-001";

export interface GraphNode {
  node_id: string;
  kind: "capability" | "question" | "route" | "workflow";
  label: string;
  href?: string;
  metadata?: Record<string, string | number>;
}

export interface GraphEdge {
  edge_id: string;
  from: string;
  to: string;
  relation: CapabilityRelationType | "answers" | "routes_to" | "workflow_next" | "nav";
  label?: string;
}

export interface NavigationGraph {
  engine_id: string;
  observed_at: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface WorkflowNavigationLink {
  capability_id: string;
  title: string;
  href: string;
  relation: "previous" | "next" | "prerequisite" | "recommended" | "related";
  reason?: string;
}

export interface WorkflowNavigationProjection {
  capability_id: string;
  route: string;
  workflow_id: string | null;
  workflow_title: string | null;
  position_in_workflow: number | null;
  links: WorkflowNavigationLink[];
  breadcrumbs: { label: string; href: string }[];
}

export interface IntentResolution {
  engine_id: string;
  query: string;
  matched_capability_id: string;
  matched_question_id: string | null;
  authoritative_route: string;
  confidence: number;
  rationale: string;
}

export interface BreadcrumbSegment {
  label: string;
  href: string;
  capability_id?: string;
}

function routeHref(route: string): string {
  return route.replace(":workspaceId", "localbrain");
}

export function buildCapabilityDependencyGraph(): NavigationGraph {
  const nodes: GraphNode[] = CAPABILITY_REGISTRY.map((c) => ({
    node_id: c.capability_id,
    kind: "capability",
    label: c.title,
    href: routeHref(c.primary_route),
  }));
  const edges: GraphEdge[] = [];
  for (const cap of CAPABILITY_REGISTRY) {
    for (const prereq of cap.prerequisites) {
      edges.push({
        edge_id: `${prereq}->${cap.capability_id}:prereq`,
        from: prereq,
        to: cap.capability_id,
        relation: "supports",
        label: "prerequisite",
      });
    }
    for (const rel of cap.related_capabilities) {
      edges.push({
        edge_id: `${cap.capability_id}->${rel.target_capability_id}:${rel.relation_type}`,
        from: cap.capability_id,
        to: rel.target_capability_id,
        relation: rel.relation_type,
        label: rel.label,
      });
    }
  }
  return {
    engine_id: CAPABILITY_REGISTRY_ENGINE_ID,
    observed_at: new Date().toISOString(),
    nodes,
    edges,
  };
}

export function buildWorkflowGraph(workflow: WorkflowDefinition = WF_MIGRATION_EXECUTION): NavigationGraph {
  const nodes: GraphNode[] = [
    {
      node_id: workflow.workflow_id,
      kind: "workflow",
      label: workflow.title,
    },
    ...workflow.capability_ids.map((id) => {
      const cap = getCapabilityById(id)!;
      return {
        node_id: id,
        kind: "capability" as const,
        label: cap.title,
        href: routeHref(cap.primary_route),
      };
    }),
  ];
  const edges: GraphEdge[] = [];
  for (let i = 0; i < workflow.capability_ids.length - 1; i++) {
    const from = workflow.capability_ids[i];
    const to = workflow.capability_ids[i + 1];
    edges.push({
      edge_id: `${from}->${to}:workflow`,
      from,
      to,
      relation: "workflow_next",
    });
  }
  for (const id of workflow.capability_ids) {
    edges.push({
      edge_id: `${workflow.workflow_id}->${id}:member`,
      from: workflow.workflow_id,
      to: id,
      relation: "nav",
    });
  }
  return {
    engine_id: NAVIGATION_INTELLIGENCE_ENGINE_ID,
    observed_at: new Date().toISOString(),
    nodes,
    edges,
  };
}

export function buildExecutiveQuestionGraph(): NavigationGraph {
  const nodes: GraphNode[] = [
    ...PHASE_1_EXECUTIVE_QUESTIONS.map((q) => ({
      node_id: q.question_id,
      kind: "question" as const,
      label: q.canonical_question,
      href: routeHref(q.primary_route),
    })),
    ...CAPABILITY_REGISTRY.map((c) => ({
      node_id: c.capability_id,
      kind: "capability" as const,
      label: c.title,
      href: routeHref(c.primary_route),
    })),
  ];
  const edges: GraphEdge[] = [];
  for (const q of PHASE_1_EXECUTIVE_QUESTIONS) {
    const auth = getAuthoritativeCapabilityForQuestion(q.question_id);
    if (auth) {
      edges.push({
        edge_id: `${q.question_id}->${auth.capability_id}:authoritative`,
        from: q.question_id,
        to: auth.capability_id,
        relation: "answers",
      });
    }
    for (const cap of CAPABILITY_REGISTRY) {
      if (
        cap.executive_question_ids.includes(q.question_id) &&
        cap.capability_id !== auth?.capability_id
      ) {
        edges.push({
          edge_id: `${q.question_id}->${cap.capability_id}:summary`,
          from: q.question_id,
          to: cap.capability_id,
          relation: "routes_to",
          label: "summary surface",
        });
      }
    }
  }
  return {
    engine_id: NAVIGATION_INTELLIGENCE_ENGINE_ID,
    observed_at: new Date().toISOString(),
    nodes,
    edges,
  };
}

export function buildRouteGraph(): NavigationGraph {
  const nodes: GraphNode[] = CAPABILITY_REGISTRY.map((c) => ({
    node_id: normalizeRoutePath(c.primary_route),
    kind: "route",
    label: c.title,
    href: routeHref(c.primary_route),
    metadata: { capability_id: c.capability_id },
  }));
  const edges: GraphEdge[] = [];
  for (const cap of CAPABILITY_REGISTRY) {
    for (const nextId of cap.next_recommended_steps) {
      const next = getCapabilityById(nextId);
      if (!next) continue;
      edges.push({
        edge_id: `${cap.capability_id}->${nextId}:next`,
        from: normalizeRoutePath(cap.primary_route),
        to: normalizeRoutePath(next.primary_route),
        relation: "workflow_next",
      });
    }
  }
  return {
    engine_id: NAVIGATION_INTELLIGENCE_ENGINE_ID,
    observed_at: new Date().toISOString(),
    nodes,
    edges,
  };
}

export function buildNavigationGraph(): NavigationGraph {
  const dep = buildCapabilityDependencyGraph();
  const wf = buildWorkflowGraph();
  const eq = buildExecutiveQuestionGraph();
  const route = buildRouteGraph();
  return {
    engine_id: NAVIGATION_INTELLIGENCE_ENGINE_ID,
    observed_at: new Date().toISOString(),
    nodes: [...dep.nodes, ...wf.nodes.filter((n) => n.kind === "workflow"), ...eq.nodes.filter((n) => n.kind === "question")],
    edges: [...dep.edges, ...wf.edges, ...eq.edges, ...route.edges],
  };
}

export function getWorkflowForCapability(capabilityId: string): WorkflowDefinition | null {
  return (
    WORKFLOW_REGISTRY.find((w) => w.capability_ids.includes(capabilityId)) ?? null
  );
}

function capabilityLink(
  cap: CapabilityEntry,
  relation: WorkflowNavigationLink["relation"],
  reason?: string,
): WorkflowNavigationLink {
  return {
    capability_id: cap.capability_id,
    title: cap.title,
    href: routeHref(cap.primary_route),
    relation,
    reason,
  };
}

export function getWorkflowNavigation(route: string): WorkflowNavigationProjection {
  const cap = matchCapabilityForRoute(route);
  if (!cap) {
    return {
      capability_id: "",
      route,
      workflow_id: null,
      workflow_title: null,
      position_in_workflow: null,
      links: [],
      breadcrumbs: [{ label: "Executive Briefing", href: "/" }],
    };
  }

  const workflow = getWorkflowForCapability(cap.capability_id);
  const links: WorkflowNavigationLink[] = [];
  const breadcrumbs: BreadcrumbSegment[] = [{ label: "Executive Briefing", href: "/" }];

  if (cap.nav_placement === "migration" || cap.workflows.length > 0) {
    breadcrumbs.push({ label: "Program Office", href: "/program-office" });
    breadcrumbs.push({
      label: "Migration",
      href: "/migration",
      capability_id: "CAP-MIG-001",
    });
    breadcrumbs.push({
      label: cap.title,
      href: routeHref(cap.primary_route),
      capability_id: cap.capability_id,
    });
  } else if (cap.nav_placement === "briefing") {
    breadcrumbs.push({ label: cap.title, href: "/" });
  } else {
    breadcrumbs.push({ label: cap.title, href: routeHref(cap.primary_route), capability_id: cap.capability_id });
  }

  if (workflow) {
    const idx = workflow.capability_ids.indexOf(cap.capability_id);
    if (idx > 0) {
      const prev = getCapabilityById(workflow.capability_ids[idx - 1]);
      if (prev) links.push(capabilityLink(prev, "previous"));
    }
    if (idx >= 0 && idx < workflow.capability_ids.length - 1) {
      const next = getCapabilityById(workflow.capability_ids[idx + 1]);
      if (next) links.push(capabilityLink(next, "next"));
    }
  }

  for (const prereqId of cap.prerequisites) {
    const prereq = getCapabilityById(prereqId);
    if (prereq) {
      links.push(
        capabilityLink(
          prereq,
          "prerequisite",
          `Complete ${prereq.title} first`,
        ),
      );
    }
  }

  for (const nextId of cap.next_recommended_steps) {
    if (links.some((l) => l.capability_id === nextId)) continue;
    const next = getCapabilityById(nextId);
    if (next) links.push(capabilityLink(next, "recommended"));
  }

  for (const rel of cap.related_capabilities) {
    if (links.some((l) => l.capability_id === rel.target_capability_id)) continue;
    const related = getCapabilityById(rel.target_capability_id);
    if (related) {
      links.push(
        capabilityLink(related, "related", rel.label ?? rel.relation_type),
      );
    }
  }

  links.push(capabilityLink(getCapabilityById("CAP-EO-001")!, "related", "Dashboard"));

  return {
    capability_id: cap.capability_id,
    route: normalizeRoutePath(route),
    workflow_id: workflow?.workflow_id ?? null,
    workflow_title: workflow?.title ?? null,
    position_in_workflow: workflow
      ? workflow.capability_ids.indexOf(cap.capability_id)
      : null,
    links,
    breadcrumbs,
  };
}

/** Intent → Executive Question → Capability → Route */
export function resolveExecutiveIntent(query: string): IntentResolution | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  let best: { cap: CapabilityEntry; score: number; term: string } | null = null;

  for (const cap of CAPABILITY_REGISTRY) {
    const terms = [...cap.search_terms, ...cap.keywords];
    for (const term of terms) {
      const t = term.toLowerCase();
      if (normalized.includes(t) || t.includes(normalized)) {
        const score = t.length + (cap.authority_level === "summary" ? 2 : 0);
        if (!best || score > best.score) {
          best = { cap, score, term };
        }
      }
    }
  }

  if (!best) return null;

  const questionId = best.cap.executive_question_ids[0] ?? null;

  return {
    engine_id: NAVIGATION_INTELLIGENCE_ENGINE_ID,
    query,
    matched_capability_id: best.cap.capability_id,
    matched_question_id: questionId,
    authoritative_route: routeHref(best.cap.primary_route),
    confidence: Math.min(100, Math.round(best.score * 100)),
    rationale: `Matched "${best.term}" → ${best.cap.title}`,
  };
}

export function resolveRouteForQuestion(questionId: string): string | null {
  const auth = getAuthoritativeCapabilityForQuestion(questionId);
  return auth ? routeHref(auth.primary_route) : null;
}

/** Cross-links for EQ header — derived from capability related graph + question registry */
export function getCapabilityNavigationLinks(route: string): WorkflowNavigationLink[] {
  const projection = getWorkflowNavigation(route);
  return projection.links.filter((l) => l.capability_id !== "CAP-EO-001");
}

export function getMigrationPipelineStrip(): { label: string; href: string; capability_id: string }[] {
  return WF_MIGRATION_EXECUTION.capability_ids.map((id) => {
    const cap = getCapabilityById(id)!;
    return {
      label: cap.title.replace(/^Executive |^Migration /, ""),
      href: routeHref(cap.primary_route),
      capability_id: id,
    };
  });
}
