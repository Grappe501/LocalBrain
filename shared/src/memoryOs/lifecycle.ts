/** Convention S2 lifecycle states — Memory OS implements, does not amend. */
export type LifecycleState =
  | "Observed"
  | "Captured"
  | "Verified"
  | "Referenced"
  | "Strengthened"
  | "Dormant"
  | "Archived"
  | "Forgotten"
  | "Dismissed"
  | "Rejected"
  | "Superseded"
  | "Expired";

const ALLOWED: ReadonlySet<string> = new Set([
  "Observed->Captured",
  "Observed->Dismissed",
  "Captured->Verified",
  "Captured->Rejected",
  "Verified->Referenced",
  "Verified->Superseded",
  "Verified->Expired",
  "Referenced->Strengthened",
  "Referenced->Dormant",
  "Referenced->Expired",
  "Strengthened->Dormant",
  "Strengthened->Expired",
  "Dormant->Referenced",
  "Dormant->Archived",
  "Dormant->Expired",
  "Archived->Forgotten",
  "Expired->Referenced",
]);

export class LifecycleTransitionError extends Error {
  readonly from: LifecycleState;
  readonly to: LifecycleState;

  constructor(from: LifecycleState, to: LifecycleState) {
    super(`Forbidden lifecycle transition: ${from} -> ${to}`);
    this.name = "LifecycleTransitionError";
    this.from = from;
    this.to = to;
  }
}

export function assertLifecycleTransitionAllowed(
  from: LifecycleState,
  to: LifecycleState,
): void {
  if (from === to) return;
  const key = `${from}->${to}`;
  if (!ALLOWED.has(key)) {
    throw new LifecycleTransitionError(from, to);
  }
}

export function isLifecycleTransitionAllowed(
  from: LifecycleState,
  to: LifecycleState,
): boolean {
  if (from === to) return true;
  return ALLOWED.has(`${from}->${to}`);
}

/** Initial state for persisted Episode writes (S2 Captured). */
export const EPISODE_INITIAL_LIFECYCLE: LifecycleState = "Captured";

/** Initial state for persisted Fact writes (S2 Captured). */
export const FACT_INITIAL_LIFECYCLE: LifecycleState = "Captured";

/** Initial state for persisted Artifact writes (S2 Captured). */
export const ARTIFACT_INITIAL_LIFECYCLE: LifecycleState = "Captured";
