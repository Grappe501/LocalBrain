export type ContextCard = {
  id: string;
  title: string;
  status: "not_connected" | "planned";
};

/** Exactly eight context cards — no Finance/CFO card in LB-OS-002. */
export const CONTEXT_CARDS: readonly ContextCard[] = [
  { id: "storage", title: "Storage Health", status: "not_connected" },
  { id: "performance", title: "Performance Health", status: "not_connected" },
  { id: "drive", title: "Drive Architecture", status: "planned" },
  { id: "cleanup", title: "Cleanup Recommendations", status: "planned" },
  { id: "api", title: "API Performance", status: "not_connected" },
  { id: "token", title: "Token Economy", status: "planned" },
  { id: "ai-provider", title: "AI Provider", status: "not_connected" },
  { id: "neural-lab", title: "Neural Lab", status: "planned" },
] as const;

export const CONTEXT_CARD_COUNT = CONTEXT_CARDS.length;
