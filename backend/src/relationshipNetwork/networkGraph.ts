import type { NetworkGraph } from "@localbrain/shared";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { SEED_ORGANIZATIONS, SEED_PEOPLE } from "./seedCatalog.js";

export function buildNetworkGraph(): NetworkGraph {
  const nodes: NetworkGraph["nodes"] = [];
  const edges: NetworkGraph["edges"] = [];

  const steveId = "person:person_steve";
  nodes.push({
    id: steveId,
    kind: "person",
    label: "Steve",
    detail: "Network center",
  });

  for (const p of SEED_PEOPLE) {
    if (p.person_id === "person_steve") continue;
    const id = `person:${p.person_id}`;
    nodes.push({
      id,
      kind: "person",
      label: p.name,
      detail: p.roles.join(", "),
    });
    edges.push({
      from: steveId,
      to: id,
      kind: p.introduced_by ? "introduced" : "knows",
    });
    if (p.introduced_by) {
      edges.push({
        from: `person:${p.introduced_by}`,
        to: id,
        kind: "introduced",
      });
    }
    for (const orgId of p.organization_ids) {
      edges.push({ from: id, to: `org:${orgId}`, kind: "member_of" });
    }
    for (const wsId of p.workspace_ids) {
      edges.push({ from: id, to: `workspace:${wsId}`, kind: "involved_in" });
    }
  }

  for (const o of SEED_ORGANIZATIONS) {
    nodes.push({
      id: `org:${o.org_id}`,
      kind: "organization",
      label: o.name,
      detail: o.kind,
    });
    for (const wsId of o.workspace_ids) {
      edges.push({ from: `org:${o.org_id}`, to: `workspace:${wsId}`, kind: "involved_in" });
    }
  }

  for (const ws of listWorkspaces().filter((w) => !w.flags.hidden)) {
    nodes.push({
      id: `workspace:${ws.workspace_id}`,
      kind: "workspace",
      label: ws.title,
      detail: ws.workspace_type,
    });
    edges.push({ from: steveId, to: `workspace:${ws.workspace_id}`, kind: "involved_in" });
  }

  nodes.push({
    id: "intro:kelly_chris",
    kind: "introduction",
    label: "Kelly → Chris M.",
    detail: "Coalition kickoff",
  });
  edges.push({ from: "person:person_kelly", to: "person:person_chris_m", kind: "introduced" });

  return { nodes, edges, read_only: true };
}
