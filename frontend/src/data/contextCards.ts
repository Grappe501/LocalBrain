export type ContextCardStatus = "complete" | "active" | "planned" | "not_connected";

export type ContextCard = {
  id: string;
  title: string;
  status: ContextCardStatus;
  /** One-line institutional state — refreshed with Wave 1 progress. */
  detail: string;
};

/** Nine cards — five Institutional Cognition substrates + four V1 module posture cards. */
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
    id: "communications",
    title: "Communications Office",
    status: "planned",
    detail: "Unblocked — Executive Intelligence Era authorized (ENG-PMO-005)",
  },
] as const;

export const CONTEXT_CARD_COUNT = CONTEXT_CARDS.length;
