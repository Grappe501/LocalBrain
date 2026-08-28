import { fetchLiveJson } from "./fetchLive";

export type CompetitorEvidence = { name: string; category: string; pricing_note?: string; source_url?: string; evidence_status: "market_anchor" | "needs_refresh" | "internal_substitute" };
export type FoundryProduct = { id: string; name: string; kind: "software" | "platform" | "book" | "service" | "component"; readiness: number; disposition: string; annualLow: number; annualHigh: number; training: boolean; capstoneCandidate: boolean; sourceRepos: string[]; competitors: CompetitorEvidence[]; advantages: string[]; disadvantages: string[]; notes?: string };
export type MasterBuildPlan = { id: string; productId: string; title: string; status: "draft" | "accepted" | "active" | "complete" | "hold"; purpose: string; remainingReadinessPct: number; budgetUsd: number; capstoneEligible: boolean };
export type PhaseValueRecord = { phaseId: string; masterPlanId: string; productId: string; title: string; budgetUsd: number; phaseClass: string; status: "planned" | "active" | "submitted" | "accepted" | "rework" | "blocked"; acceptanceCriteria: string[]; evidenceRequired: string[]; acceptedEvidence: string[] };
export type FoundryProposalKind = "product_change" | "builder_application" | "phase_submission" | "capstone_application" | "master_plan_proposal" | "registry_change";
export type FoundryProposalStatus = "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "withdrawn";
export type FoundryProposalRecord = { id: string; kind: FoundryProposalKind; subject_id: string | null; submitted_by: string; title: string; summary: string; payload_json: string; status: FoundryProposalStatus; created_at: string; updated_at: string };
export type FoundryEvidenceRecord = { id: string; proposal_id: string; evidence_type: string; label: string; uri: string | null; content_hash: string | null; notes: string | null; created_at: string };
export type FoundryAcceptanceRecord = { id: string; proposal_id: string; reviewer_id: string; decision: "accepted" | "rejected" | "rework"; rationale: string; created_at: string };
export type CompanyFoundrySnapshot = { meta: { schemaVersion: string; slice: string; mode: "read-first"; updated: string; cashForecastUntilPaidValidationUsd: number }; products: FoundryProduct[]; masterPlans: MasterBuildPlan[]; phases: PhaseValueRecord[]; builders: unknown[]; capstones: unknown[]; economicRules: { companyResidualFloorPct: number; capstoneLeadResidualCeilingPct: number; apprenticeHourlyRateUsd: number; defaultSettlementCadence: "monthly"; equityIssuanceEnabled: boolean; payrollEnabled: boolean; moneyMovementEnabled: boolean } };

async function postFoundry<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error ?? `Foundry request failed (${response.status})`);
  return data as T;
}

export async function fetchCompanyFoundrySnapshot(): Promise<CompanyFoundrySnapshot> { return fetchLiveJson<CompanyFoundrySnapshot>("/api/foundry/snapshot"); }
export async function fetchCompanyFoundryProduct(productId: string) { return fetchLiveJson<{ product: FoundryProduct; masterPlans: MasterBuildPlan[]; phases: PhaseValueRecord[] }>(`/api/foundry/products/${encodeURIComponent(productId)}`); }
export async function fetchCompanyFoundryValidation() { return fetchLiveJson<{ valid: boolean; errors: string[]; schemaVersion: string; slice: string }>("/api/foundry/validation"); }
export async function fetchFoundryProposals(): Promise<FoundryProposalRecord[]> { return (await fetchLiveJson<{ proposals: FoundryProposalRecord[] }>("/api/foundry/proposals")).proposals; }
export async function fetchFoundryProposalDetail(proposalId: string) { return fetchLiveJson<{ proposal: FoundryProposalRecord; evidence: FoundryEvidenceRecord[]; reviews: FoundryAcceptanceRecord[] }>(`/api/foundry/proposals/${encodeURIComponent(proposalId)}`); }
export async function createFoundryProposal(input: { kind: FoundryProposalKind; subjectId?: string; submittedBy: string; title: string; summary: string; payload?: unknown }): Promise<FoundryProposalRecord> { return (await postFoundry<{ proposal: FoundryProposalRecord }>("/api/foundry/proposals", input)).proposal; }
export async function submitFoundryProposal(proposalId: string, actorId: string): Promise<FoundryProposalRecord> { return (await postFoundry<{ proposal: FoundryProposalRecord }>(`/api/foundry/proposals/${encodeURIComponent(proposalId)}/submit`, { actorId })).proposal; }
export async function addFoundryProposalEvidence(proposalId: string, input: { actorId: string; evidenceType: string; label: string; uri?: string; contentHash?: string; notes?: string }): Promise<FoundryEvidenceRecord> { return (await postFoundry<{ evidence: FoundryEvidenceRecord }>(`/api/foundry/proposals/${encodeURIComponent(proposalId)}/evidence`, input)).evidence; }
export async function reviewFoundryProposal(proposalId: string, input: { reviewerId: string; decision: "accepted" | "rejected" | "rework"; rationale: string }): Promise<FoundryAcceptanceRecord> { return (await postFoundry<{ review: FoundryAcceptanceRecord }>(`/api/foundry/proposals/${encodeURIComponent(proposalId)}/review`, input)).review; }
export async function applyFoundryProposalEffect(proposalId: string, actorId: string): Promise<{ ok: boolean; effectType?: string; subjectId?: string }> { return postFoundry(`/api/foundry/proposals/${encodeURIComponent(proposalId)}/apply-effect`, { actorId }); }
export async function fetchFoundryBuilders(): Promise<unknown[]> { return (await fetchLiveJson<{ builders: unknown[] }>("/api/foundry/builders")).builders; }
export async function fetchFoundryCapabilityEvents(builderId?: string): Promise<unknown[]> { const q = builderId ? `?builderId=${encodeURIComponent(builderId)}` : ""; return (await fetchLiveJson<{ events: unknown[] }>(`/api/foundry/capability-events${q}`)).events; }
export async function fetchFoundryCohorts(): Promise<unknown[]> { return (await fetchLiveJson<{ cohorts: unknown[] }>("/api/foundry/cohorts")).cohorts; }
export async function fetchAdmittedFoundryMasterPlans(): Promise<unknown[]> { return (await fetchLiveJson<{ masterPlans: unknown[] }>("/api/foundry/admitted-master-plans")).masterPlans; }
export async function fetchFoundryAudit(limit = 100): Promise<unknown[]> { return (await fetchLiveJson<{ events: unknown[] }>(`/api/foundry/audit?limit=${limit}`)).events; }
export async function fetchFoundryWriteCapabilities(): Promise<Record<string, boolean>> { return fetchLiveJson<Record<string, boolean>>("/api/foundry/write-capabilities"); }
