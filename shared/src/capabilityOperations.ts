/**
 * Capability operations — states, readiness, dependency health, recommendations (LB-OS-026.65)
 */

import {
  CAPABILITY_REGISTRY,
  WF_MIGRATION_EXECUTION,
  getCapabilityById,
  isPlannedCapability,
  type CapabilityEntry,
  type CapabilityHealth,
} from "./capabilityRegistry.js";
import { getIntentsForCapability } from "./executiveIntent.js";
import { PHASE_1_EXECUTIVE_QUESTIONS } from "./executiveQuestion.js";

export const CAPABILITY_OPERATIONS_ENGINE_ID = "ENG-COP-001";

export type CapabilityOperationalState =
  | "available"
  | "healthy"
  | "awaiting_prerequisite"
  | "degraded"
  | "blocked"
  | "failed"
  | "completed"
  | "deprecated"
  | "stub"
  | "planned";

export type ReadinessConfidence = "high" | "medium" | "low";

export interface CapabilityIdentity {
  why_exist: string;
  outcome: string;
  depends_on: string[];
  dependents: string[];
}

export interface CapabilityReadiness {
  capability_id: string;
  ready_percent: number;
  blocking_issues: number;
  dependencies_satisfied: boolean;
  confidence: ReadinessConfidence;
  operational_state: CapabilityOperationalState;
}

export interface CapabilityStateSnapshot {
  capability_id: string;
  title: string;
  operational_state: CapabilityOperationalState;
  base_health: CapabilityHealth;
  readiness: CapabilityReadiness;
  identity: CapabilityIdentity;
}

export interface DependencyHealthNode {
  capability_id: string;
  title: string;
  operational_state: CapabilityOperationalState;
  ready_percent: number;
  downstream_impact: CapabilityOperationalState | null;
}

export interface DependencyHealthGraph {
  engine_id: typeof CAPABILITY_OPERATIONS_ENGINE_ID;
  observed_at: string;
  workflow_id: string;
  nodes: DependencyHealthNode[];
  /** When upstream fails, downstream states after propagation */
  propagation_edges: { from: string; to: string; effect: string }[];
}

export interface ExecutiveRecommendation {
  recommendation_id: string;
  capability_id: string;
  title: string;
  route: string;
  rationale: string;
  executive_value_score: number;
  intent_label: string | null;
}

export interface RecommendationGraph {
  engine_id: typeof CAPABILITY_OPERATIONS_ENGINE_ID;
  observed_at: string;
  current_states: CapabilityOperationalState[];
  available_actions: ExecutiveRecommendation[];
  recommended_actions: ExecutiveRecommendation[];
  highest_value: ExecutiveRecommendation | null;
}

/** Optional runtime overlay from backend services */
export interface CapabilityHealthSignal {
  capability_id: string;
  healthy: boolean;
  completed?: boolean;
  detail?: string;
}

function routeHref(route: string): string {
  return route.replace(":workspaceId", "localbrain");
}

function computeDependents(capabilityId: string): string[] {
  const dependents: string[] = [];
  for (const cap of CAPABILITY_REGISTRY) {
    if (cap.prerequisites.includes(capabilityId)) {
      dependents.push(cap.capability_id);
    }
    if (cap.next_recommended_steps.includes(capabilityId)) {
      dependents.push(cap.capability_id);
    }
    if (cap.related_capabilities.some((r) => r.target_capability_id === capabilityId)) {
      dependents.push(cap.capability_id);
    }
  }
  return [...new Set(dependents)];
}

export function getCapabilityIdentity(cap: CapabilityEntry): CapabilityIdentity {
  return {
    why_exist: cap.description,
    outcome: cap.executive_outcome,
    depends_on: [...cap.prerequisites],
    dependents: computeDependents(cap.capability_id),
  };
}

function baseOperationalState(
  cap: CapabilityEntry,
  signal?: CapabilityHealthSignal,
): CapabilityOperationalState {
  if (isPlannedCapability(cap)) return "planned";
  if (cap.completion_status === "stub") return "stub";
  if (signal?.completed) return "completed";
  if (signal && !signal.healthy) return "failed";
  if (cap.maturity.health === "stub") return "stub";
  if (cap.maturity.health === "degraded") return "degraded";
  return cap.completion_status === "production" ? "healthy" : "available";
}

function prerequisitesSatisfied(
  cap: CapabilityEntry,
  states: Map<string, CapabilityOperationalState>,
): boolean {
  return cap.prerequisites.every((id) => {
    const s = states.get(id);
    return s === "healthy" || s === "completed" || s === "available";
  });
}

export function computeCapabilityReadiness(
  cap: CapabilityEntry,
  states: Map<string, CapabilityOperationalState>,
  signal?: CapabilityHealthSignal,
): CapabilityReadiness {
  let operational = baseOperationalState(cap, signal);
  let blocking = 0;

  if (cap.prerequisites.length > 0 && !prerequisitesSatisfied(cap, states)) {
    if (operational === "healthy" || operational === "available") {
      operational = "awaiting_prerequisite";
    }
    blocking += cap.prerequisites.filter((id) => {
      const s = states.get(id);
      return s === "failed" || s === "blocked" || s === "degraded";
    }).length;
  }

  if (blocking > 0 && operational !== "failed" && operational !== "stub") {
    operational = blocking > 0 && cap.prerequisites.some((id) => states.get(id) === "failed")
      ? "blocked"
      : "degraded";
  }

  const depsOk = prerequisitesSatisfied(cap, states);
  const readyPercent = Math.max(
    0,
    Math.min(
      100,
      cap.maturity.completion_percent -
        blocking * 15 -
        (operational === "blocked" ? 40 : 0) -
        (operational === "awaiting_prerequisite" ? 20 : 0),
    ),
  );

  const confidence: ReadinessConfidence =
    readyPercent >= 85 && depsOk ? "high" : readyPercent >= 60 ? "medium" : "low";

  return {
    capability_id: cap.capability_id,
    ready_percent: Math.round(readyPercent),
    blocking_issues: blocking,
    dependencies_satisfied: depsOk,
    confidence,
    operational_state: operational,
  };
}

export function buildCapabilityStateSnapshots(
  signals: CapabilityHealthSignal[] = [],
): CapabilityStateSnapshot[] {
  const signalMap = new Map(signals.map((s) => [s.capability_id, s]));
  const baseStates = new Map<string, CapabilityOperationalState>();
  for (const cap of CAPABILITY_REGISTRY) {
    baseStates.set(
      cap.capability_id,
      baseOperationalState(cap, signalMap.get(cap.capability_id)),
    );
  }

  return CAPABILITY_REGISTRY.map((cap) => {
    const readiness = computeCapabilityReadiness(cap, baseStates, signalMap.get(cap.capability_id));
    return {
      capability_id: cap.capability_id,
      title: cap.title,
      operational_state: readiness.operational_state,
      base_health: cap.maturity.health,
      readiness,
      identity: getCapabilityIdentity(cap),
    };
  });
}

/** Propagate failed/degraded upstream states through workflow + prerequisites */
export function buildDependencyHealthGraph(
  signals: CapabilityHealthSignal[] = [],
): DependencyHealthGraph {
  const snapshots = buildCapabilityStateSnapshots(signals);
  const stateMap = new Map(snapshots.map((s) => [s.capability_id, s]));

  const workflowIds = WF_MIGRATION_EXECUTION.capability_ids;
  const propagation_edges: DependencyHealthGraph["propagation_edges"] = [];
  const nodes: DependencyHealthNode[] = [];

  for (const capId of workflowIds) {
    const snap = stateMap.get(capId);
    const cap = getCapabilityById(capId);
    if (!snap || !cap) continue;

    let downstream: CapabilityOperationalState | null = null;
    const idx = workflowIds.indexOf(capId);
    if (idx < workflowIds.length - 1) {
      const nextId = workflowIds[idx + 1];
      const nextSnap = stateMap.get(nextId);
      if (
        snap.operational_state === "failed" ||
        snap.operational_state === "degraded"
      ) {
        downstream =
          snap.operational_state === "failed" ? "blocked" : "degraded";
        propagation_edges.push({
          from: capId,
          to: nextId!,
          effect: `${snap.operational_state} → ${downstream}`,
        });
      } else if (nextSnap) {
        downstream = nextSnap.operational_state;
      }
    }

    nodes.push({
      capability_id: capId,
      title: cap.title,
      operational_state: snap.operational_state,
      ready_percent: snap.readiness.ready_percent,
      downstream_impact: downstream,
    });
  }

  return {
    engine_id: CAPABILITY_OPERATIONS_ENGINE_ID,
    observed_at: new Date().toISOString(),
    workflow_id: WF_MIGRATION_EXECUTION.workflow_id,
    nodes,
    propagation_edges,
  };
}

export function buildRecommendationGraph(
  signals: CapabilityHealthSignal[] = [],
): RecommendationGraph {
  const snapshots = buildCapabilityStateSnapshots(signals);
  const available: ExecutiveRecommendation[] = [];
  const recommended: ExecutiveRecommendation[] = [];

  for (const snap of snapshots) {
    const cap = getCapabilityById(snap.capability_id);
    if (!cap || cap.completion_status === "stub" || isPlannedCapability(cap)) continue;
    if (
      snap.operational_state === "blocked" ||
      snap.operational_state === "failed" ||
      snap.operational_state === "deprecated"
    ) {
      continue;
    }

    const intents = getIntentsForCapability(cap.capability_id);
    const intentLabel = intents[0]?.label ?? null;
    const valueBase = snap.readiness.ready_percent;
    const valueBonus =
      snap.operational_state === "awaiting_prerequisite" ? 25 : 0;
    const execValue = Math.min(100, valueBase + valueBonus);

    const rec: ExecutiveRecommendation = {
      recommendation_id: `rec-${cap.capability_id}`,
      capability_id: cap.capability_id,
      title: cap.title,
      route: routeHref(cap.primary_route),
      rationale:
        snap.operational_state === "awaiting_prerequisite"
          ? `Prerequisites pending — ${cap.title} is the logical next step`
          : cap.executive_outcome,
      executive_value_score: execValue,
      intent_label: intentLabel,
    };

    available.push(rec);

    if (
      snap.operational_state === "awaiting_prerequisite" ||
      (snap.readiness.dependencies_satisfied && snap.readiness.ready_percent >= 70)
    ) {
      recommended.push(rec);
    }
  }

  recommended.sort((a, b) => b.executive_value_score - a.executive_value_score);
  const highest = recommended[0] ?? null;

  return {
    engine_id: CAPABILITY_OPERATIONS_ENGINE_ID,
    observed_at: new Date().toISOString(),
    current_states: snapshots.map((s) => s.operational_state),
    available_actions: available,
    recommended_actions: recommended.slice(0, 7),
    highest_value: highest,
  };
}

export function getQuestionsForCapability(cap: CapabilityEntry): string[] {
  return cap.executive_question_ids
    .map((id) => PHASE_1_EXECUTIVE_QUESTIONS.find((q) => q.question_id === id)?.canonical_question)
    .filter((q): q is string => Boolean(q));
}
