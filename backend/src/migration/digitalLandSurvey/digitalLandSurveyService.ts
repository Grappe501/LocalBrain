import { getMachineMetrics } from "../../system/healthMonitor.js";
import { listWorkspaces } from "../../workspaces/workspaceRegistry.js";
import { getLatestFilesystemAudit, runFilesystemMappingAudit } from "../fsAudit/auditService.js";
import { buildWorkspaceBlueprint } from "../workspaceArchitecture/blueprintEngine.js";
import { buildDigitalLandSurvey } from "./surveyEngine.js";

export const DIGITAL_LAND_SURVEY_ENGINE_ID = "ENG-DLS-001";

export function getDigitalLandSurvey(options: { refreshAudit?: boolean } = {}) {
  const audit = options.refreshAudit
    ? runFilesystemMappingAudit({ force: true })
    : getLatestFilesystemAudit();

  const workspaces = listWorkspaces();
  const blueprints = workspaces.map((ws) => buildWorkspaceBlueprint(ws, audit));
  const disks = getMachineMetrics().disks;

  return buildDigitalLandSurvey({
    disks,
    audit,
    workspaces,
    blueprints,
  });
}
