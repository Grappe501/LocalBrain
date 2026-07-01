export type ContextCardStatus = "complete" | "active" | "planned" | "not_connected";

export type ContextCard = {
  id: string;
  title: string;
  status: ContextCardStatus;
  /** One-line institutional state — refreshed with Wave 1 progress. */
  detail: string;
};

/** Exactly eight context cards — institutional substrates + V1 module posture (LB-OS-002 shell). */
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
    id: "memory-os",
    title: "Memory OS Wave 1",
    status: "active",
    detail: "3/5 slices complete · Reference Slices 001–003 · next Conversation",
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
    detail: "Blocked on Memory OS Wave 1 completion",
  },
] as const;

export const CONTEXT_CARD_COUNT = CONTEXT_CARDS.length;
