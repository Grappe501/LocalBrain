/**
 * ENG-INT-001 — Executive Intent Graph (LB-OS-026.65)
 * Intent is a goal; Executive Questions are expressions of that goal.
 */

import { PHASE_1_EXECUTIVE_QUESTIONS } from "./executiveQuestion.js";
import {
  CAPABILITY_REGISTRY,
  getAuthoritativeCapabilityForQuestion,
  getCapabilityById,
  type CapabilityEntry,
} from "./capabilityRegistry.js";

export const EXECUTIVE_INTENT_ENGINE_ID = "ENG-INT-001";

export type ExecutiveIntentId =
  | "INT-ORGANIZE"
  | "INT-DECIDE"
  | "INT-LEARN"
  | "INT-REVIEW"
  | "INT-BUILD"
  | "INT-MONITOR"
  | "INT-PLAN";

export interface ExecutiveIntent {
  intent_id: ExecutiveIntentId;
  label: string;
  description: string;
  /** Example questions this intent can generate */
  example_questions: string[];
  /** EQ IDs this intent activates */
  question_ids: string[];
  /** Primary capabilities that serve this intent */
  capability_ids: string[];
  keywords: string[];
  search_terms: string[];
}

export interface ExecutiveIntentGraphNode {
  node_id: string;
  kind: "intent" | "question" | "capability" | "workflow" | "route";
  label: string;
  href?: string;
}

export interface ExecutiveIntentGraphEdge {
  from: string;
  to: string;
  relation: "activates" | "answers" | "serves" | "workflow" | "routes_to";
}

export interface ExecutiveIntentGraph {
  engine_id: typeof EXECUTIVE_INTENT_ENGINE_ID;
  observed_at: string;
  nodes: ExecutiveIntentGraphNode[];
  edges: ExecutiveIntentGraphEdge[];
}

export interface ExecutiveIntentChain {
  engine_id: typeof EXECUTIVE_INTENT_ENGINE_ID;
  intent_id: ExecutiveIntentId;
  intent_label: string;
  question_id: string | null;
  canonical_question: string | null;
  capability_id: string;
  capability_title: string;
  workflow_ids: string[];
  route: string;
  confidence: number;
  rationale: string;
}

export const EXECUTIVE_INTENTS: ExecutiveIntent[] = [
  {
    intent_id: "INT-ORGANIZE",
    label: "Organize",
    description: "Structure workspaces, files, and digital estates",
    example_questions: [
      "How should I organize ContactList?",
      "What is fragmented?",
      "What should I consolidate?",
    ],
    question_ids: ["EQ-004", "EQ-005", "EQ-015", "EQ-014"],
    capability_ids: ["CAP-EWA-001", "CAP-CNS-001", "CAP-MIG-002", "CAP-KX-001", "CAP-DLS-001"],
    keywords: ["organize", "fragmented", "consolidate", "structure", "contactlist", "reorganize"],
    search_terms: [
      "organize my workspace",
      "safely reorganize this project",
      "what is fragmented",
      "how should I organize",
    ],
  },
  {
    intent_id: "INT-DECIDE",
    label: "Decide",
    description: "Authorize, approve, or choose between executive options",
    example_questions: ["Should I approve this migration?", "What actions need my approval?"],
    question_ids: ["EQ-013", "EQ-014"],
    capability_ids: ["CAP-APP-001", "CAP-ACT-001", "CAP-CNS-001"],
    keywords: ["approve", "decide", "authorize", "sign-off", "should I"],
    search_terms: ["should I approve", "what should I approve", "executive approval"],
  },
  {
    intent_id: "INT-LEARN",
    label: "Learn",
    description: "Understand how the platform and pipelines work",
    example_questions: ["How does the migration pipeline work?", "Teach me while we build"],
    question_ids: [],
    capability_ids: ["CAP-LRN-001", "CAP-EPO-001"],
    keywords: ["learn", "how does", "teach", "explain", "understand"],
    search_terms: ["how does the migration pipeline work", "teach me while we build"],
  },
  {
    intent_id: "INT-REVIEW",
    label: "Review",
    description: "Assess what changed and what needs attention",
    example_questions: ["What changed since yesterday?", "What should I do today?"],
    question_ids: ["EQ-001", "EQ-002", "EQ-007"],
    capability_ids: ["CAP-EO-001", "CAP-EPO-001", "CAP-WS-001"],
    keywords: ["review", "changed", "today", "yesterday", "drift", "progress"],
    search_terms: ["what should I do today", "what changed", "how is the build progressing"],
  },
  {
    intent_id: "INT-BUILD",
    label: "Build",
    description: "Advance the platform, engineering work, and delivery",
    example_questions: ["What should Burt work on next?", "How healthy is my engineering work?"],
    question_ids: ["EQ-002", "EQ-010"],
    capability_ids: ["CAP-EPO-001", "CAP-ENG-001"],
    keywords: ["build", "burt", "engineering", "slice", "implement"],
    search_terms: ["what should burt work on", "how healthy is my engineering work"],
  },
  {
    intent_id: "INT-MONITOR",
    label: "Monitor",
    description: "Watch system, platform, and relationship health",
    example_questions: ["Is anything unhealthy?", "How healthy is my system?"],
    question_ids: ["EQ-003", "EQ-006", "EQ-010", "EQ-012"],
    capability_ids: ["CAP-SYS-001", "CAP-REL-001", "CAP-ENG-001", "CAP-DAT-001"],
    keywords: ["monitor", "unhealthy", "health", "system", "status"],
    search_terms: ["is anything unhealthy", "how healthy is my system"],
  },
  {
    intent_id: "INT-PLAN",
    label: "Plan",
    description: "Determine safe next steps in workflows especially migration",
    example_questions: ["What's the next step?", "How should I migrate my world?"],
    question_ids: ["EQ-014", "EQ-015"],
    capability_ids: [
      "CAP-MIG-001",
      "CAP-PLN-001",
      "CAP-PRF-001",
      "CAP-EWA-001",
      "CAP-DLS-001",
    ],
    keywords: ["plan", "next step", "migrate", "planning", "proof", "cutover"],
    search_terms: [
      "what's the next step",
      "migration planning",
      "how should I migrate",
      "move my workspace",
    ],
  },
];

export function getExecutiveIntent(id: ExecutiveIntentId): ExecutiveIntent | undefined {
  return EXECUTIVE_INTENTS.find((i) => i.intent_id === id);
}

export function getIntentsForCapability(capabilityId: string): ExecutiveIntent[] {
  return EXECUTIVE_INTENTS.filter((i) => i.capability_ids.includes(capabilityId));
}

export function getIntentsForQuestion(questionId: string): ExecutiveIntent[] {
  return EXECUTIVE_INTENTS.filter((i) => i.question_ids.includes(questionId));
}

export function buildExecutiveIntentGraph(): ExecutiveIntentGraph {
  const nodes: ExecutiveIntentGraphNode[] = [];
  const edges: ExecutiveIntentGraphEdge[] = [];

  for (const intent of EXECUTIVE_INTENTS) {
    nodes.push({
      node_id: intent.intent_id,
      kind: "intent",
      label: intent.label,
    });
    for (const qid of intent.question_ids) {
      const q = PHASE_1_EXECUTIVE_QUESTIONS.find((x) => x.question_id === qid);
      if (!q) continue;
      const qNode = `question:${qid}`;
      if (!nodes.some((n) => n.node_id === qNode)) {
        nodes.push({
          node_id: qNode,
          kind: "question",
          label: q.canonical_question,
          href: q.primary_route.replace(":workspaceId", "localbrain"),
        });
      }
      edges.push({ from: intent.intent_id, to: qNode, relation: "activates" });
    }
    for (const capId of intent.capability_ids) {
      const cap = getCapabilityById(capId);
      if (!cap) continue;
      if (!nodes.some((n) => n.node_id === capId)) {
        nodes.push({
          node_id: capId,
          kind: "capability",
          label: cap.title,
          href: cap.primary_route.replace(":workspaceId", "localbrain"),
        });
      }
      edges.push({ from: intent.intent_id, to: capId, relation: "serves" });
      for (const wf of cap.workflows) {
        const wfNode = `workflow:${wf}`;
        if (!nodes.some((n) => n.node_id === wfNode)) {
          nodes.push({ node_id: wfNode, kind: "workflow", label: wf });
        }
        edges.push({ from: capId, to: wfNode, relation: "workflow" });
      }
      edges.push({
        from: capId,
        to: `route:${cap.primary_route}`,
        relation: "routes_to",
      });
      if (!nodes.some((n) => n.node_id === `route:${cap.primary_route}`)) {
        nodes.push({
          node_id: `route:${cap.primary_route}`,
          kind: "route",
          label: cap.primary_route,
          href: cap.primary_route.replace(":workspaceId", "localbrain"),
        });
      }
    }
  }

  return {
    engine_id: EXECUTIVE_INTENT_ENGINE_ID,
    observed_at: new Date().toISOString(),
    nodes,
    edges,
  };
}

function routeHref(route: string): string {
  return route.replace(":workspaceId", "localbrain");
}

/** Intent → Question → Capability → Workflow → Route */
export function resolveExecutiveIntentChain(query: string): ExecutiveIntentChain | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  let bestIntent: { intent: ExecutiveIntent; score: number; term: string } | null = null;
  let bestCap: { cap: CapabilityEntry; score: number; term: string } | null = null;

  for (const intent of EXECUTIVE_INTENTS) {
    for (const term of [...intent.search_terms, ...intent.keywords]) {
      const t = term.toLowerCase();
      if (normalized.includes(t) || t.includes(normalized)) {
        const score = t.length;
        if (!bestIntent || score > bestIntent.score) {
          bestIntent = { intent, score, term };
        }
      }
    }
  }

  for (const cap of CAPABILITY_REGISTRY) {
    for (const term of [...cap.search_terms, ...cap.keywords]) {
      const t = term.toLowerCase();
      if (normalized.includes(t) || t.includes(normalized)) {
        const score = t.length + (cap.authority_level === "summary" ? 2 : 0);
        if (!bestCap || score > bestCap.score) {
          bestCap = { cap, score, term };
        }
      }
    }
  }

  if (!bestIntent && !bestCap) return null;

  const intent =
    bestIntent?.intent ??
    (bestCap ? getIntentsForCapability(bestCap.cap.capability_id)[0] : undefined);
  const cap =
    bestCap?.cap ??
    (intent
      ? getCapabilityById(intent.capability_ids[0]!)
      : undefined);

  if (!cap) return null;

  const intentsForCap = getIntentsForCapability(cap.capability_id);
  const resolvedIntent = intent ?? intentsForCap[0];
  if (!resolvedIntent) return null;

  const questionId =
    cap.executive_question_ids.find((q) => resolvedIntent.question_ids.includes(q)) ??
    cap.executive_question_ids[0] ??
    resolvedIntent.question_ids[0] ??
    null;

  const canonical =
    questionId != null
      ? PHASE_1_EXECUTIVE_QUESTIONS.find((q) => q.question_id === questionId)?.canonical_question ??
        null
      : null;

  const term = bestCap?.term ?? bestIntent?.term ?? resolvedIntent.label;

  return {
    engine_id: EXECUTIVE_INTENT_ENGINE_ID,
    intent_id: resolvedIntent.intent_id,
    intent_label: resolvedIntent.label,
    question_id: questionId,
    canonical_question: canonical,
    capability_id: cap.capability_id,
    capability_title: cap.title,
    workflow_ids: cap.workflows,
    route: routeHref(cap.primary_route),
    confidence: Math.min(100, Math.round((bestCap?.score ?? bestIntent?.score ?? 10) * 4)),
    rationale: `Intent ${resolvedIntent.label} via "${term}" → ${cap.title}`,
  };
}

export function resolveIntentForCapability(capabilityId: string): ExecutiveIntent | null {
  return getIntentsForCapability(capabilityId)[0] ?? null;
}

export function resolveCapabilityForQuestion(questionId: string): CapabilityEntry | null {
  return getAuthoritativeCapabilityForQuestion(questionId);
}
