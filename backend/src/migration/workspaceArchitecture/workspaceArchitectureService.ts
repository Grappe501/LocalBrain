import type { ExecutiveWorkspaceArchitectureReport } from "@localbrain/shared";
import { getMachineMetrics } from "../../system/healthMonitor.js";
import { listWorkspaces } from "../../workspaces/workspaceRegistry.js";
import { getLatestFilesystemAudit } from "../fsAudit/auditService.js";
import { buildWorkspaceBlueprint, buildWorkspaceDNA } from "./blueprintEngine.js";
import { getSteveOrganizationTree } from "./organizationTree.js";
import { buildPhysicalWorldSurvey } from "./physicalWorldSurvey.js";

export const WORKSPACE_ARCHITECTURE_ENGINE_ID = "ENG-EWA-001";

export function getExecutiveWorkspaceArchitecture(): ExecutiveWorkspaceArchitectureReport {
  const workspaces = listWorkspaces();
  const audit = getLatestFilesystemAudit();
  const disks = getMachineMetrics().disks;

  const workspace_dna = workspaces.map(buildWorkspaceDNA);
  const blueprints = workspaces.map((ws) => buildWorkspaceBlueprint(ws, audit));

  return {
    slice_id: "LB-OS-021",
    engine_id: WORKSPACE_ARCHITECTURE_ENGINE_ID,
    read_only: true,
    three_worlds_model: "executive_logical_projection_physical",
    organization_tree: getSteveOrganizationTree(workspaces),
    workspace_dna,
    blueprints,
    physical_world: buildPhysicalWorldSurvey(disks, workspaces, audit),
    observed_at: new Date().toISOString(),
  };
}
