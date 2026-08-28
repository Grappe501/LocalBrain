import { fetchLiveJson } from "./fetchLive";

export type CompetitorEvidence = {
  name: string;
  category: string;
  pricing_note?: string;
  source_url?: string;
  evidence_status: "market_anchor" | "needs_refresh" | "internal_substitute";
};

export type FoundryProduct = {
  id: string;
  name: string;
  kind: "software" | "platform" | "book" | "service" | "component";
  readiness: number;
  disposition: string;
  annualLow: number;
  annualHigh: number;
  training: boolean;
  capstoneCandidate: boolean;
  sourceRepos: string[];
  competitors: CompetitorEvidence[];
  advantages: string[];
  disadvantages: string[];
  notes?: string;
};

export type MasterBuildPlan = {
  id: string;
  productId: string;
  title: string;
  status: "draft" | "accepted" | "active" | "complete" | "hold";
  purpose: string;
  remainingReadinessPct: number;
  budgetUsd: number;
  capstoneEligible: boolean;
};

export type PhaseValueRecord = {
  phaseId: string;
  masterPlanId: string;
  productId: string;
  title: string;
  budgetUsd: number;
  phaseClass: string;
  status: "planned" | "active" | "submitted" | "accepted" | "rework" | "blocked";
  acceptanceCriteria: string[];
  evidenceRequired: string[];
  acceptedEvidence: string[];
};

export type CompanyFoundrySnapshot = {
  meta: { schemaVersion: string; slice: string; mode: "read-first"; updated: string; cashForecastUntilPaidValidationUsd: number };
  products: FoundryProduct[];
  masterPlans: MasterBuildPlan[];
  phases: PhaseValueRecord[];
  builders: unknown[];
  capstones: unknown[];
  economicRules: {
    companyResidualFloorPct: number;
    capstoneLeadResidualCeilingPct: number;
    apprenticeHourlyRateUsd: number;
    defaultSettlementCadence: "monthly";
    equityIssuanceEnabled: boolean;
    payrollEnabled: boolean;
    moneyMovementEnabled: boolean;
  };
};

export async function fetchCompanyFoundrySnapshot(): Promise<CompanyFoundrySnapshot> {
  return fetchLiveJson<CompanyFoundrySnapshot>("/api/foundry/snapshot");
}

export async function fetchCompanyFoundryProduct(productId: string): Promise<{
  product: FoundryProduct;
  masterPlans: MasterBuildPlan[];
  phases: PhaseValueRecord[];
}> {
  return fetchLiveJson(`/api/foundry/products/${encodeURIComponent(productId)}`);
}

export async function fetchCompanyFoundryValidation(): Promise<{
  valid: boolean;
  errors: string[];
  schemaVersion: string;
  slice: string;
}> {
  return fetchLiveJson("/api/foundry/validation");
}
