import type {
  ConsolidationCategory,
  ConsolidationCategoryResponse,
  ConsolidationOpportunitySummary,
  ConsolidationSimulationResult,
  ExecutiveConsolidationBriefing,
} from "@localbrain/shared";

const API = "/api";

export async function fetchConsolidationBriefing(): Promise<ExecutiveConsolidationBriefing> {
  const res = await fetch(`${API}/consolidation/briefing`);
  if (!res.ok) throw new Error("Failed to load consolidation briefing");
  return res.json() as Promise<ExecutiveConsolidationBriefing>;
}

export async function fetchConsolidationOpportunity(): Promise<ConsolidationOpportunitySummary> {
  const res = await fetch(`${API}/consolidation/opportunity`);
  if (!res.ok) throw new Error("Failed to load consolidation opportunity");
  return res.json() as Promise<ConsolidationOpportunitySummary>;
}

export async function fetchConsolidationCategory(
  category: ConsolidationCategory,
): Promise<ConsolidationCategoryResponse> {
  const res = await fetch(`${API}/consolidation/${category}`);
  if (!res.ok) throw new Error(`Failed to load ${category} consolidation data`);
  return res.json() as Promise<ConsolidationCategoryResponse>;
}

export async function simulateConsolidation(
  cardIds?: string[],
): Promise<ConsolidationSimulationResult> {
  const res = await fetch(`${API}/consolidation/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ card_ids: cardIds }),
  });
  if (!res.ok) throw new Error("Simulation failed");
  return res.json() as Promise<ConsolidationSimulationResult>;
}

export async function dismissConsolidationCard(cardId: string): Promise<void> {
  const res = await fetch(`${API}/consolidation/dismiss`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ card_id: cardId }),
  });
  if (!res.ok) throw new Error("Failed to dismiss card");
}
