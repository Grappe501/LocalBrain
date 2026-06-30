/**
 * Executive Capability Atlas — auto-generated encyclopedia (LB-OS-026.65)
 */

import {
  CAPABILITY_REGISTRY,
  CAPABILITY_REGISTRY_ENGINE_ID,
  WORKFLOW_REGISTRY,
  isPlannedCapability,
} from "./capabilityRegistry.js";
import {
  buildCapabilityStateSnapshots,
  getCapabilityIdentity,
  getQuestionsForCapability,
  type CapabilityHealthSignal,
  type CapabilityStateSnapshot,
} from "./capabilityOperations.js";
import { EXECUTIVE_INTENTS, getIntentsForCapability } from "./executiveIntent.js";
import type { CapabilityGovernancePolicy } from "./capabilityGovernance.js";

export const CAPABILITY_ATLAS_ENGINE_ID = "ENG-ATL-001";

export interface CapabilityAtlasEntry {
  capability_id: string;
  title: string;
  intents: string[];
  executive_questions: string[];
  outcome: string;
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  dependents: string[];
  readiness_percent: number;
  operational_state: string;
  confidence: string;
  entry_vectors: string[];
  primary_route: string;
  secondary_routes: string[];
  workflows: string[];
  slice_id: string;
  lifecycle: "live" | "planned";
  infrastructure_reserved: boolean;
  atlas_status: string;
  governance_policy?: CapabilityGovernancePolicy;
  identity: {
    why_exist: string;
    outcome: string;
    depends_on: string[];
    dependents: string[];
  };
}

export interface ExecutiveCapabilityAtlas {
  engine_id: typeof CAPABILITY_ATLAS_ENGINE_ID;
  registry_engine_id: typeof CAPABILITY_REGISTRY_ENGINE_ID;
  slice_id: "LB-OS-026.66";
  generated_at: string;
  live_capability_count: number;
  planned_capability_count: number;
  capability_count: number;
  intent_count: number;
  workflow_count: number;
  entries: CapabilityAtlasEntry[];
}

function capabilityInputs(capId: string): string[] {
  const cap = CAPABILITY_REGISTRY.find((c) => c.capability_id === capId);
  if (!cap) return [];
  return cap.prerequisites.map((id) => {
    const p = CAPABILITY_REGISTRY.find((c) => c.capability_id === id);
    return p ? `${id} (${p.title})` : id;
  });
}

function capabilityOutputs(capId: string): string[] {
  const cap = CAPABILITY_REGISTRY.find((c) => c.capability_id === capId);
  if (!cap) return [];
  return [
    cap.executive_outcome,
    ...cap.next_recommended_steps.map((id) => {
      const n = CAPABILITY_REGISTRY.find((c) => c.capability_id === id);
      return n ? `Enables ${n.title}` : id;
    }),
  ];
}

export function buildExecutiveCapabilityAtlas(
  signals: CapabilityHealthSignal[] = [],
): ExecutiveCapabilityAtlas {
  const snapshots = new Map(
    buildCapabilityStateSnapshots(signals).map((s) => [s.capability_id, s]),
  );

  const entries: CapabilityAtlasEntry[] = CAPABILITY_REGISTRY.map((cap) => {
    const snap = snapshots.get(cap.capability_id);
    const identity = getCapabilityIdentity(cap);
    return {
      capability_id: cap.capability_id,
      title: cap.title,
      intents: getIntentsForCapability(cap.capability_id).map((i) => i.label),
      executive_questions: getQuestionsForCapability(cap),
      outcome: cap.executive_outcome,
      inputs: capabilityInputs(cap.capability_id),
      outputs: capabilityOutputs(cap.capability_id),
      dependencies: cap.prerequisites,
      dependents: identity.dependents,
      readiness_percent: snap?.readiness.ready_percent ?? cap.maturity.completion_percent,
      operational_state: snap?.operational_state ?? "available",
      confidence: snap?.readiness.confidence ?? "medium",
      entry_vectors: cap.entry_vectors,
      primary_route: cap.primary_route.replace(":workspaceId", "localbrain"),
      secondary_routes: cap.secondary_routes,
      workflows: cap.workflows,
      slice_id: cap.slice_id,
      lifecycle: isPlannedCapability(cap) ? "planned" : "live",
      infrastructure_reserved: cap.infrastructure_reserved === true,
      atlas_status: isPlannedCapability(cap)
        ? "Future / Planned · Not Live · Infrastructure Reserved"
        : "Live",
      governance_policy: cap.governance_policy,
      identity,
    };
  });

  const liveEntries = entries.filter((e) => e.lifecycle === "live");
  const plannedEntries = entries.filter((e) => e.lifecycle === "planned");

  return {
    engine_id: CAPABILITY_ATLAS_ENGINE_ID,
    registry_engine_id: CAPABILITY_REGISTRY_ENGINE_ID,
    slice_id: "LB-OS-026.66",
    generated_at: new Date().toISOString(),
    live_capability_count: liveEntries.length,
    planned_capability_count: plannedEntries.length,
    capability_count: entries.length,
    intent_count: EXECUTIVE_INTENTS.length,
    workflow_count: WORKFLOW_REGISTRY.length,
    entries,
  };
}

export function renderCapabilityAtlasMarkdown(atlas: ExecutiveCapabilityAtlas): string {
  const lines: string[] = [
    "# Executive Capability Atlas",
    "",
    "> **Auto-generated** — do not edit by hand. Regenerate via `GET /api/integration/atlas` or `npm run atlas:generate`.",
    `> **Engine:** ${atlas.engine_id} · **Slice:** ${atlas.slice_id} · **Generated:** ${atlas.generated_at}`,
    "",
    `${atlas.live_capability_count} live · ${atlas.planned_capability_count} planned (infrastructure reserved) · ${atlas.intent_count} executive intents · ${atlas.workflow_count} workflows`,
    "",
    "### Connector guardrail (Gmail, Calendar, finance)",
    "",
    "```txt",
    "Read first → Recommend second → Draft third → Act only with approval",
    "No automatic sends · No automatic calendar changes · No automatic money movement",
    "```",
    "",
    "---",
    "",
    "## Intent → Capability map",
    "",
    "| Intent | Capabilities |",
    "| ------ | ------------ |",
  ];

  for (const intent of EXECUTIVE_INTENTS) {
    const caps = intent.capability_ids
      .map((id) => CAPABILITY_REGISTRY.find((c) => c.capability_id === id)?.title ?? id)
      .join(" · ");
    lines.push(`| ${intent.label} | ${caps} |`);
  }

  lines.push("", "---", "", "## Future / Planned — Infrastructure Reserved", "", "> Not live routes. Reserved for Executive OS expansion (LB-OS-026.66).", "");

  const planned = atlas.entries.filter((e) => e.lifecycle === "planned");
  for (const entry of planned) {
    lines.push(...renderAtlasEntry(entry));
  }

  lines.push("", "---", "", "## Live capabilities", "");

  const live = atlas.entries.filter((e) => e.lifecycle === "live");
  for (const entry of live) {
    lines.push(...renderAtlasEntry(entry));
  }

  return lines.join("\n");
}

function renderAtlasEntry(entry: CapabilityAtlasEntry): string[] {
  const lines: string[] = [
    `## ${entry.capability_id} — ${entry.title}`,
    "",
    "| Field | Value |",
    "| ----- | ----- |",
    `| **Intents** | ${entry.intents.join(", ") || "—"} |`,
    `| **Executive Questions** | ${entry.executive_questions.join(" · ") || "—"} |`,
    `| **Outcome** | ${entry.outcome} |`,
    `| **State** | ${entry.operational_state} |`,
    `| **Readiness** | ${entry.readiness_percent}% (${entry.confidence}) |`,
    `| **Route** | \`${entry.primary_route}\` |`,
    `| **Workflows** | ${entry.workflows.join(", ") || "—"} |`,
    `| **Slice** | ${entry.slice_id} |`,
    `| **Atlas status** | ${entry.atlas_status} |`,
  ];
  if (entry.governance_policy) {
    lines.push(`| **Governance** | Read-first · approval-gated actions |`);
  }
  lines.push(
    "",
    "### Identity",
    "",
    `- **Why do I exist?** ${entry.identity.why_exist}`,
    `- **What outcome do I produce?** ${entry.identity.outcome}`,
    `- **What do I depend on?** ${entry.identity.depends_on.join(", ") || "None"}`,
    `- **Who depends on me?** ${entry.identity.dependents.join(", ") || "None"}`,
    "",
    "### Inputs / Outputs",
    "",
    "**Inputs:**",
    "",
  );
  for (const i of entry.inputs.length ? entry.inputs : ["—"]) {
    lines.push(`- ${i}`);
  }
  lines.push("", "**Outputs:**", "");
  for (const o of entry.outputs) {
    lines.push(`- ${o}`);
  }
  lines.push(
    "",
    "**Entry vectors:**",
    entry.entry_vectors.join(", ") || "—",
    "",
    "---",
    "",
  );
  return lines;
}

export function formatAtlasEntrySummary(entry: CapabilityAtlasEntry): string {
  return `${entry.capability_id}: ${entry.title} [${entry.operational_state}] ${entry.readiness_percent}%`;
}

export type { CapabilityStateSnapshot };
