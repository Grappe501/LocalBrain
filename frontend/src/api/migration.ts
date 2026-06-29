import type {
  DigitalLandSurveyReport,
  ExecutiveWorkspaceArchitectureReport,
  FilesystemMappingAudit,
  MigrationPlan,
  MigrationPlanGenerateResponse,
  MigrationPlanOverview,
  MigrationPlannerOverview,
  MigrationProofOverview,
  MigrationProofSimulateResponse,
  PlanVariantStrategy,
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

export async function fetchMigrationPlans(): Promise<MigrationPlanOverview> {
  const res = await fetch(`${API}/migration/plans`);
  if (!res.ok) throw new Error("Failed to load migration plans");
  return res.json() as Promise<MigrationPlanOverview>;
}

export async function generateMigrationPlans(
  certificateId: string,
  variants?: PlanVariantStrategy[],
): Promise<MigrationPlanGenerateResponse> {
  const res = await fetch(`${API}/migration/plans/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ certificate_id: certificateId, variants }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to generate migration plans");
  }
  return res.json() as Promise<MigrationPlanGenerateResponse>;
}

export async function fetchMigrationPlanById(planId: string): Promise<MigrationPlan> {
  const res = await fetch(`${API}/migration/plans/${encodeURIComponent(planId)}`);
  if (!res.ok) throw new Error("Failed to load migration plan");
  return res.json() as Promise<MigrationPlan>;
}
