import type { ExecutiveExperienceCertification, IntegrationAuditReport } from "@localbrain/shared";

const API = "/api";

export async function fetchIntegrationAudit(): Promise<IntegrationAuditReport> {
  const res = await fetch(`${API}/integration/audit`);
  if (!res.ok) throw new Error("Failed to load integration audit");
  return res.json() as Promise<IntegrationAuditReport>;
}

export async function fetchExecutiveExperienceAudit(): Promise<ExecutiveExperienceCertification> {
  const res = await fetch(`${API}/integration/experience-audit`);
  if (!res.ok) throw new Error("Failed to load executive experience audit");
  return res.json() as Promise<ExecutiveExperienceCertification>;
}

export async function fetchQuestionLinks(route: string) {
  const res = await fetch(`${API}/integration/questions/route?route=${encodeURIComponent(route)}`);
  if (!res.ok) return null;
  return res.json() as Promise<{
    question: { question_id: string; canonical_question: string };
    related_links: { href: string; label: string }[];
  }>;
}
