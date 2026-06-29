import type { LivingWorkspace, OrganizationTreeNode } from "@localbrain/shared";

/** Steve canonical organization tree — Logical World (no drive letters on nodes). */
const CATEGORY_CAMPAIGNS: OrganizationTreeNode = {
  node_id: "campaigns",
  label: "Campaigns",
  kind: "category",
  children: [
    { node_id: "ws-reddirt", label: "RedDirt", kind: "workspace", workspace_id: "reddirt" },
    { node_id: "ws-countyworkbench", label: "CountyWorkbench", kind: "workspace", workspace_id: "countyworkbench" },
  ],
};

const CATEGORY_CREATIVE: OrganizationTreeNode = {
  node_id: "creative",
  label: "Creative",
  kind: "category",
  children: [],
};

const CATEGORY_RESEARCH: OrganizationTreeNode = {
  node_id: "research",
  label: "Research",
  kind: "category",
  children: [
    { node_id: "ws-votematch", label: "VoteMatch", kind: "workspace", workspace_id: "votematch" },
  ],
};

const CATEGORY_BUSINESS: OrganizationTreeNode = {
  node_id: "business",
  label: "Business",
  kind: "category",
  children: [
    { node_id: "ws-localbrain", label: "LocalBrain", kind: "workspace", workspace_id: "localbrain" },
    { node_id: "ws-acu", label: "ACU", kind: "workspace", workspace_id: "acu" },
  ],
};

export function getSteveOrganizationTree(workspaces: LivingWorkspace[]): OrganizationTreeNode {
  const tree = structuredClone({
    node_id: "steve",
    label: "Steve",
    kind: "root" as const,
    children: [
      {
        node_id: "projects",
        label: "Projects",
        kind: "category" as const,
        children: [CATEGORY_CAMPAIGNS, CATEGORY_CREATIVE, CATEGORY_RESEARCH, CATEGORY_BUSINESS],
      },
      {
        node_id: "education",
        label: "Education",
        kind: "category" as const,
        children: [],
      },
      {
        node_id: "archives",
        label: "Archives",
        kind: "archive" as const,
        children: [],
      },
      {
        node_id: "shared",
        label: "Shared",
        kind: "collection" as const,
        children: [
          {
            node_id: "ws-general",
            label: "General Files",
            kind: "workspace" as const,
            workspace_id: "general",
          },
        ],
      },
      {
        node_id: "system",
        label: "System",
        kind: "category" as const,
        children: [],
      },
    ],
  }) as OrganizationTreeNode;

  const linked = new Set<string>();
  collectWorkspaceIds(tree, linked);

  const unlinked = workspaces.filter((ws) => !ws.flags.hidden && !linked.has(ws.workspace_id));
  if (unlinked.length > 0) {
    const projects = tree.children?.find((c) => c.node_id === "projects");
    let other = projects?.children?.find((c) => c.node_id === "other");
    if (!other && projects) {
      other = { node_id: "other", label: "Other", kind: "category", children: [] };
      projects.children = [...(projects.children ?? []), other];
    }
    if (other) {
      other.children = [
        ...(other.children ?? []),
        ...unlinked.map(
          (ws): OrganizationTreeNode => ({
            node_id: `ws-${ws.workspace_id}`,
            label: ws.title,
            kind: "workspace",
            workspace_id: ws.workspace_id,
          }),
        ),
      ];
    }
  }

  return tree;
}

function collectWorkspaceIds(node: OrganizationTreeNode, ids: Set<string>): void {
  if (node.workspace_id) ids.add(node.workspace_id);
  for (const child of node.children ?? []) {
    collectWorkspaceIds(child, ids);
  }
}

export function missionCategoryForWorkspace(ws: LivingWorkspace): string {
  const map: Record<string, string> = {
    campaign: "Campaigns",
    engineering: "Business",
    meta: "Business",
    novel: "Creative",
    photography: "Creative",
    podcast: "Creative",
    research: "Research",
    database: "Business",
    finance: "Business",
    learning: "Education",
    personal: "Shared",
    executive: "System",
  };
  return map[ws.workspace_type] ?? "Projects";
}

export function primaryDepartmentForWorkspace(ws: LivingWorkspace): string | null {
  const map: Record<string, string> = {
    meta: "Engineering",
    engineering: "Engineering",
    campaign: "Relationships",
    novel: "Writing",
    photography: "Photography",
    podcast: "Podcast",
    research: "Data & Intelligence",
    database: "Data & Intelligence",
    finance: "Finance",
    learning: "Academy",
    personal: "Chief of Staff",
    executive: "Chief of Staff",
  };
  return map[ws.workspace_type] ?? null;
}
