import type { ExecutiveBriefingSignals, ExecutiveOfficeExperience } from "@localbrain/shared";

const API = "/api";

export type ExecutiveOfficeExperienceResponse = {
  experience: ExecutiveOfficeExperience;
  signals?: ExecutiveBriefingSignals;
  read_only: boolean;
};

export async function fetchExecutiveOfficeExperienceFull(): Promise<ExecutiveOfficeExperienceResponse> {
  const res = await fetch(`${API}/integration/office/experience`);
  if (!res.ok) throw new Error("Failed to load Executive Office experience");
  return (await res.json()) as ExecutiveOfficeExperienceResponse;
}

export async function fetchExecutiveOfficeExperience(): Promise<ExecutiveOfficeExperience> {
  const data = await fetchExecutiveOfficeExperienceFull();
  return data.experience;
}
