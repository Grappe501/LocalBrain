import type { ExecutiveExperienceCertification, IntegrationAuditReport } from "@localbrain/shared";
import { fetchLiveJson } from "./fetchLive";

const API = "/api";

export async function fetchIntegrationAudit(): Promise<IntegrationAuditReport> {
  return fetchLiveJson<IntegrationAuditReport>(`${API}/integration/audit`);
}

export async function fetchExecutiveExperienceAudit(): Promise<ExecutiveExperienceCertification> {
  return fetchLiveJson<ExecutiveExperienceCertification>(`${API}/integration/experience-audit`);
}

export async function fetchQuestionLinks(route: string) {
  const res = await fetch(`${API}/integration/questions/route?route=${encodeURIComponent(route)}`);
  if (!res.ok) return null;
  return res.json() as Promise<{
    question: { question_id: string; canonical_question: string };
    related_links: { href: string; label: string }[];
  }>;
}
