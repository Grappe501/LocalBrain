import type {
  DigitalLandSurveyReport,
  ExecutiveWorkspaceArchitectureReport,
  FilesystemMappingAudit,
  MigrationPlannerOverview,
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
