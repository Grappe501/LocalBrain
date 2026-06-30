import {
  buildExecutiveOfficeExperience,
  renderExecutiveOfficeExperienceMarkdown,
} from "@localbrain/shared";

export function getExecutiveOfficeExperience() {
  const experience = buildExecutiveOfficeExperience();
  const markdown = renderExecutiveOfficeExperienceMarkdown(experience);
  return { experience, markdown };
}
