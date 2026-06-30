/** Experience Maturity — how useful a surface is, not just whether it is live. */

export type ExperienceMaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const EXPERIENCE_MATURITY_LABELS: Record<ExperienceMaturityLevel, string> = {
  0: "Wireframe",
  1: "Live data",
  2: "Interactive",
  3: "Chief of Staff insights",
  4: "Predictive",
  5: "Executive quality",
};

export function maturityLabel(level: ExperienceMaturityLevel): string {
  return EXPERIENCE_MATURITY_LABELS[level];
}

export function maturityCode(level: ExperienceMaturityLevel): string {
  return `L${level}`;
}

export interface ExperienceMaturityRow {
  route: string;
  label: string;
  surface_mode: "live" | "partial" | "stub";
  maturity_level: ExperienceMaturityLevel;
  maturity_label: string;
  target_level: ExperienceMaturityLevel;
  next_upgrade_slice: string | null;
  next_upgrade_summary: string;
  /** ENG-CAP-001 sync — null when surface-only */
  capability_id?: string | null;
  last_verified_slice?: string | null;
}
