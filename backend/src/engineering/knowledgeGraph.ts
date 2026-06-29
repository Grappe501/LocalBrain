import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import type {
  EngGraphEdge,
  EngGraphNode,
  EngGraphNodeKind,
  EngineeringKnowledgeGraph,
} from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";
import { getRegisteredModules } from "../core/moduleLoader.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { BINDING_DECISIONS } from "../context/bindingDecisions.js";
import { parsePhaseChecklistSlices } from "../epo/checklistParser.js";
import { SLICE_DEPENDENCIES } from "../epo/epoData.js";
import { KERNEL_ENGINE_SEEDS, KNOWLEDGE_SOURCE_SEEDS } from "./engineGraphData.js";

function countByKind(nodes: EngGraphNode[]): Record<EngGraphNodeKind, number> {
  const counts: Record<EngGraphNodeKind, number> = {
    repository: 0,
    module: 0,
    engine: 0,
    capability: 0,
    knowledge_source: 0,
    workspace: 0,
    decision: 0,
    burt_packet: 0,
    test: 0,
    slice: 0,
  };
  for (const n of nodes) counts[n.kind] += 1;
  return counts;
}

function walkTestFiles(dir: string, acc: string[]): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") {
      walkTestFiles(full, acc);
    } else if (entry.isFile() && entry.name.endsWith(".test.ts")) {
      acc.push(relative(getRepoRoot(), full).replace(/\\/g, "/"));
    }
  }
}

export function buildEngineeringKnowledgeGraph(): EngineeringKnowledgeGraph {
  const root = getRepoRoot();
  const nodes: EngGraphNode[] = [];
  const edges: EngGraphEdge[] = [];

  const repoId = "repo:localbrain";
  nodes.push({
    id: repoId,
    kind: "repository",
    label: "LocalBrain Platform",
    detail: root,
    status: "active",
  });

  for (const eng of KERNEL_ENGINE_SEEDS) {
    nodes.push({
      id: eng.id,
      kind: "engine",
      label: eng.label,
      detail: eng.detail,
      status: eng.status,
    });
    edges.push({ from: eng.id, to: repoId, kind: "belongs_to" });
    for (const dep of eng.depends_on) {
      edges.push({ from: eng.id, to: dep, kind: "depends_on" });
    }
  }

  for (const mod of getRegisteredModules()) {
    const id = `module:${mod.module_id}`;
    nodes.push({
      id,
      kind: "module",
      label: mod.name,
      detail: mod.description ?? mod.domain,
      status: mod.status,
    });
    edges.push({ from: id, to: repoId, kind: "belongs_to" });
    for (const cap of mod.capabilities) {
      const capId = `cap:${cap.capability_id}`;
      if (!nodes.some((n) => n.id === capId)) {
        nodes.push({
          id: capId,
          kind: "capability",
          label: cap.capability_id,
          detail: cap.dependencies.join(", "),
          status: mod.status,
        });
      }
      edges.push({ from: id, to: capId, kind: "implements" });
      for (const dep of cap.dependencies) {
        edges.push({ from: capId, to: dep, kind: "depends_on" });
      }
    }
    for (const dep of mod.dependencies) {
      if (dep.startsWith("ENG-")) {
        edges.push({ from: id, to: dep, kind: "depends_on" });
      }
    }
  }

  for (const ks of KNOWLEDGE_SOURCE_SEEDS) {
    nodes.push({
      id: ks.id,
      kind: "knowledge_source",
      label: ks.label,
      detail: ks.detail,
      status: ks.status,
    });
    edges.push({ from: ks.id, to: repoId, kind: "belongs_to" });
  }
  edges.push({ from: "ENG-KE-001", to: "KS-EXPLORER", kind: "uses" });
  edges.push({ from: "ENG-DA-001", to: "KS-ASSET-REG", kind: "uses" });
  edges.push({ from: "ENG-EPO-001", to: "KS-DOCS", kind: "uses" });

  for (const ws of listWorkspaces()) {
    const id = `workspace:${ws.workspace_id}`;
    nodes.push({
      id,
      kind: "workspace",
      label: ws.title,
      detail: ws.workspace_type,
      status: ws.status,
    });
    edges.push({ from: id, to: repoId, kind: "belongs_to" });
    if (ws.workspace_type === "engineering" || ws.workspace_id === "localbrain") {
      edges.push({ from: id, to: "module:engineering-studio", kind: "uses" });
    }
  }

  for (const d of BINDING_DECISIONS) {
    const id = `decision:${d.id}`;
    nodes.push({
      id,
      kind: "decision",
      label: d.title,
      detail: d.summary,
      status: "binding",
    });
    edges.push({ from: id, to: repoId, kind: "belongs_to" });
  }

  const slices = parsePhaseChecklistSlices();
  for (const s of slices) {
    const id = `slice:${s.slice_id}`;
    nodes.push({
      id,
      kind: "slice",
      label: s.name,
      detail: s.status,
      status: s.status,
    });
    edges.push({ from: id, to: repoId, kind: "belongs_to" });
    for (const dep of SLICE_DEPENDENCIES[s.slice_id] ?? []) {
      edges.push({ from: id, to: `slice:${dep}`, kind: "depends_on" });
    }
    if (s.burt_packet_path) {
      const packetId = `burt:${s.slice_id}`;
      if (!nodes.some((n) => n.id === packetId)) {
        nodes.push({
          id: packetId,
          kind: "burt_packet",
          label: s.slice_id,
          detail: s.burt_packet_path,
          status: s.status,
        });
      }
      edges.push({ from: packetId, to: id, kind: "documents" });
      edges.push({ from: id, to: packetId, kind: "introduced_by" });
    }
  }

  const packetsDir = join(root, "docs", "burt_packets");
  if (existsSync(packetsDir)) {
    for (const file of readdirSync(packetsDir).filter((f) => f.endsWith(".md"))) {
      const sliceMatch = file.match(/LB-OS-[\d.]+/);
      const sliceId = sliceMatch?.[0] ?? null;
      const packetId = sliceId ? `burt:${sliceId}` : `burt:file:${file}`;
      if (!nodes.some((n) => n.id === packetId)) {
        nodes.push({
          id: packetId,
          kind: "burt_packet",
          label: file.replace(".md", ""),
          detail: `docs/burt_packets/${file}`,
          status: "on_disk",
        });
        edges.push({ from: packetId, to: repoId, kind: "belongs_to" });
      }
    }
  }

  const testFiles: string[] = [];
  walkTestFiles(join(root, "backend", "src"), testFiles);
  for (const tf of testFiles.slice(0, 40)) {
    const id = `test:${tf}`;
    nodes.push({
      id,
      kind: "test",
      label: tf.split("/").pop() ?? tf,
      detail: tf,
      status: "present",
    });
    edges.push({ from: id, to: repoId, kind: "belongs_to" });
    const segment = tf.split("/")[2];
    if (segment) {
      const eng = KERNEL_ENGINE_SEEDS.find((e) => e.path?.includes(segment));
      if (eng) edges.push({ from: id, to: eng.id, kind: "tests" });
    }
  }

  return {
    nodes,
    edges,
    node_counts: countByKind(nodes),
    read_only: true,
  };
}

export function countTodoMarkers(): number {
  const root = getRepoRoot();
  let count = 0;
  function walk(dir: string): void {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        const text = readFileSync(full, "utf8");
        const matches = text.match(/\bTODO\b/g);
        if (matches) count += matches.length;
      }
    }
  }
  walk(join(root, "backend", "src"));
  walk(join(root, "frontend", "src"));
  return count;
}
