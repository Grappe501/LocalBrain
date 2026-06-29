import type { MigrationPlannerOverview } from "@localbrain/shared";

const API = "/api";

export async function fetchMigrationPlanner(): Promise<MigrationPlannerOverview> {
  const res = await fetch(`${API}/migration/planner`);
  if (!res.ok) throw new Error("Failed to load migration planner");
  return res.json() as Promise<MigrationPlannerOverview>;
}
