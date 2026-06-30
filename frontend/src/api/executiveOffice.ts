import type { ExecutiveOfficeExperience } from "@localbrain/shared";

const API = "/api";

export type ExecutiveOfficeExperienceResponse = {
  experience: ExecutiveOfficeExperience;
  read_only: boolean;
};

export async function fetchExecutiveOfficeExperience(): Promise<ExecutiveOfficeExperience> {
  const res = await fetch(`${API}/integration/office/experience`);
  if (!res.ok) throw new Error("Failed to load Executive Office experience");
  const data = (await res.json()) as ExecutiveOfficeExperienceResponse;
  return data.experience;
}
