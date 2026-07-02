export type ContextCardStatus = "complete" | "active" | "planned" | "not_connected";

export type ContextCard = {
  id: string;
  title: string;
  status: ContextCardStatus;
  /** One-line institutional state — synced with Executive Intelligence Era posture. */
  detail: string;
};

/** Ten cards — five substrates · four V1 modules · Executive Intelligence Era. */
export const CONTEXT_CARDS: readonly ContextCard[] = [
  {
    id: "episode",
    title: "Episode · records",
    status: "complete",
    detail: "Reference Slice 001 · 6/6 tests · What happened?",
  },
  {
    id: "fact",
    title: "Fact · accepts",
    status: "complete",
    detail: "Reference Slice 002 · 22/22 tests · What do we know?",
  },
  {
    id: "artifact",
    title: "Artifact · preserves",
    status: "complete",
    detail: "Reference Slice 003 · 17/17 tests · What evidence?",
  },
  {
    id: "conversation",
    title: "Conversation · captures",
    status: "complete",
    detail: "Reference Slice 004 · 16/16 tests · What were people saying?",
  },
  {
    id: "decision-citation",
    title: "DecisionCitation · justifies",
    status: "complete",
    detail: "Reference Slice 005 · 19/19 tests · Why did we act?",
  },
  {
    id: "factory",
    title: "Empty Brain Factory",
    status: "complete",
    detail: "v1.0.0-factory-certified · regression locked",
  },
  {
    id: "convention",
    title: "Theory & Convention",
    status: "complete",
    detail: "Theory v1.0 frozen · Convention closed",
  },
  {
    id: "executive-office",
    title: "Executive Office",
    status: "complete",
    detail: "Module certified · 6/6 dimensions PASS",
  },
  {
    id: "executive-intelligence",
    title: "Executive Intelligence",
    status: "complete",
    detail: "ENG-EI-001 COMPLETE · ENG-PMO-008 · Evidence Package Contract ENG-EI-001.3 · 12/12 tests",
  },
  {
    id: "communications",
    title: "Communications Office",
    status: "planned",
    detail: "Awaiting ENG-EI-002 Executive Brief · Constitutional Retrieval complete",
  },
] as const;

export const CONTEXT_CARD_COUNT = CONTEXT_CARDS.length;
