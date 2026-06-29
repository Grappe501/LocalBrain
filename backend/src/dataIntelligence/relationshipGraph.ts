import type { DataRelationshipGraph } from "@localbrain/shared";
import { buildKnowledgeSourceCatalog } from "./knowledgeSourceCatalog.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { getRegisteredModules } from "../core/moduleLoader.js";
import { BINDING_DECISIONS } from "../context/bindingDecisions.js";
import { getRegistryStats } from "../digitalAssets/assetRegistry.js";

export function buildDataRelationshipGraph(): DataRelationshipGraph {
  const nodes: DataRelationshipGraph["nodes"] = [];
  const edges: DataRelationshipGraph["edges"] = [];

  const root = "brain:steve";
  nodes.push({
    id: root,
    kind: "workspace",
    label: "Steve Brain",
    detail: "Platform-scoped data graph",
  });

  for (const ws of listWorkspaces().filter((w) => !w.flags.hidden)) {
    const id = `workspace:${ws.workspace_id}`;
    nodes.push({
      id,
      kind: "workspace",
      label: ws.title,
      detail: ws.workspace_type,
    });
    edges.push({ from: id, to: root, kind: "scopes" });
  }

  for (const src of buildKnowledgeSourceCatalog()) {
    const id = `source:${src.source_id}`;
    nodes.push({
      id,
      kind: "knowledge_source",
      label: src.title,
      detail: src.kind,
    });
    edges.push({ from: id, to: root, kind: "feeds" });
    if (src.workspace_id) {
      edges.push({ from: id, to: `workspace:${src.workspace_id}`, kind: "scopes" });
    }
  }

  const registry = getRegistryStats();
  const assetId = "registry:digital_assets";
  nodes.push({
    id: assetId,
    kind: "digital_asset",
    label: "Digital Asset Registry",
    detail: `${registry.total_assets} assets`,
  });
  edges.push({ from: "source:filesystem_index", to: assetId, kind: "indexes" });
  edges.push({ from: "source:digital_asset_registry", to: assetId, kind: "indexes" });

  for (const mod of getRegisteredModules()) {
    const id = `module:${mod.module_id}`;
    nodes.push({ id, kind: "module", label: mod.name, detail: mod.domain });
    edges.push({ from: id, to: root, kind: "depends_on" });
    for (const ds of mod.data_sources) {
      edges.push({ from: id, to: `source:${ds}`, kind: "feeds" });
    }
  }

  for (const d of BINDING_DECISIONS) {
    const id = `decision:${d.id}`;
    nodes.push({ id, kind: "decision", label: d.title, detail: d.summary });
    edges.push({ from: id, to: root, kind: "documents" });
  }

  nodes.push({
    id: "engine:knowledge_explorer",
    kind: "engine",
    label: "Knowledge Explorer",
    detail: "ENG-KE-001",
  });
  edges.push({ from: "engine:knowledge_explorer", to: "source:filesystem_index", kind: "indexes" });

  return { nodes, edges, read_only: true };
}
