import type {
  DigitalLandSurveyReport,
  ExecutiveWorkspaceArchitectureReport,
  FilesystemMappingAudit,
  MigrationPlannerOverview,
  MigrationProofOverview,
  MigrationProofSimulateResponse,
} from "@localbrain/shared";

const API = "/api";

export async function fetchMigrationPlanner(): Promise<MigrationPlannerOverview> {
  const res = await fetch(`${API}/migration/planner`);
  if (!res.ok) throw new Error("Failed to load migration planner");
  return res.json() as Promise<MigrationPlannerOverview>;
}

export async function fetchFilesystemAudit(refresh = false): Promise<FilesystemMappingAudit> {
  const q = refresh ? "?refresh=1" : "";
  const res = await fetch(`${API}/migration/audit${q}`);
  if (!res.ok) throw new Error("Failed to run filesystem audit");
  return res.json() as Promise<FilesystemMappingAudit>;
}

export function auditExportUrl(refresh = false): string {
  return `${API}/migration/audit/export${refresh ? "?refresh=1" : ""}`;
}

export async function fetchWorkspaceArchitecture(): Promise<ExecutiveWorkspaceArchitectureReport> {
  const res = await fetch(`${API}/migration/workspace-architecture`);
  if (!res.ok) throw new Error("Failed to load workspace architecture");
  return res.json() as Promise<ExecutiveWorkspaceArchitectureReport>;
}

export async function fetchDigitalLandSurvey(refresh = false): Promise<DigitalLandSurveyReport> {
  const q = refresh ? "?refresh=1" : "";
  const res = await fetch(`${API}/migration/digital-land-survey${q}`);
  if (!res.ok) throw new Error("Failed to load digital land survey");
  return res.json() as Promise<DigitalLandSurveyReport>;
}

export async function fetchMigrationProof(): Promise<MigrationProofOverview> {
  const res = await fetch(`${API}/migration/proof`);
  if (!res.ok) throw new Error("Failed to load migration proof");
  return res.json() as Promise<MigrationProofOverview>;
}

export async function simulateMigrationProof(
  workspaceIds?: string[],
): Promise<MigrationProofSimulateResponse> {
  const res = await fetch(`${API}/migration/proof/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workspaceIds?.length ? { workspace_ids: workspaceIds } : {}),
  });
  if (!res.ok) throw new Error("Failed to run proof simulation");
  return res.json() as Promise<MigrationProofSimulateResponse>;
}
