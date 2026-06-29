/** Engineering specialist routing stub — LB-OS-012 */

export const ENGINEERING_SPECIALISTS = [
  { id: "engineering_chief", name: "Engineering Chief", focus: "Triage, synthesis, score, Explain this project" },
  { id: "eng_architecture", name: "Architecture", focus: "Structure, boundaries, module graph" },
  { id: "eng_code_generation", name: "Code Generation", focus: "Drafts and patches (proposal-only)" },
  { id: "eng_code_review", name: "Code Review", focus: "Diff review, standards, risk" },
  { id: "eng_testing", name: "Testing", focus: "Test plans, coverage gaps" },
  { id: "eng_documentation", name: "Documentation", focus: "README, ADRs, inline docs" },
  { id: "eng_security", name: "Security", focus: "Secrets, permissions, threat surface" },
  { id: "eng_performance", name: "Performance", focus: "Hot paths, benchmarks" },
  { id: "eng_deployment", name: "Deployment", focus: "Release readiness" },
  { id: "eng_database", name: "Database", focus: "Schema, migrations" },
  { id: "eng_devops", name: "DevOps", focus: "CI, environment" },
  { id: "eng_build_planning", name: "Build Planning", focus: "Slices, sprint breakdown" },
  { id: "burt_script_writer", name: "Burt Packet Generator", focus: "Generate → preview → approve → export" },
] as const;

export function routeSpecialist(intent: string): string {
  const lower = intent.toLowerCase();
  if (lower.includes("burt") || lower.includes("packet")) return "burt_script_writer";
  if (lower.includes("test")) return "eng_testing";
  if (lower.includes("architect") || lower.includes("module")) return "eng_architecture";
  if (lower.includes("security") || lower.includes("permission")) return "eng_security";
  if (lower.includes("deploy")) return "eng_deployment";
  if (lower.includes("doc")) return "eng_documentation";
  return "engineering_chief";
}
