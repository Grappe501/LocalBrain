import type { IdentityRef } from "./primitives.js";

/** Append-only custody event types — stewardship only, not authenticity. */
export type ArtifactCustodyEventType = "initial_custody" | "transfer" | "release";

export const ARTIFACT_CUSTODY_EVENT_TYPES: readonly ArtifactCustodyEventType[] = [
  "initial_custody",
  "transfer",
  "release",
] as const;

/** Chain-of-custody record — who has been responsible for preserving evidence over time. */
export type ArtifactCustodyEvent = {
  custody_event_id: string;
  artifact_id: string;
  custody_event: ArtifactCustodyEventType;
  actor: IdentityRef;
  event_at: string;
  recorded_at: string;
  previous_custodian: IdentityRef | null;
  new_custodian: IdentityRef | null;
  reason?: string;
};

export const ARTIFACT_CUSTODY_FIELD_KEYS = [
  "custody_event_id",
  "artifact_id",
  "custody_event",
  "actor",
  "event_at",
  "recorded_at",
  "previous_custodian",
  "new_custodian",
  "reason",
] as const;

export type ArtifactCustodyFieldKey = (typeof ARTIFACT_CUSTODY_FIELD_KEYS)[number];

export function serializeArtifactCustodyEvent(event: ArtifactCustodyEvent): string {
  return JSON.stringify(event);
}

export function deserializeArtifactCustodyEvent(json: string): ArtifactCustodyEvent {
  return JSON.parse(json) as ArtifactCustodyEvent;
}

export function artifactCustodyEventsEquivalent(
  a: ArtifactCustodyEvent,
  b: ArtifactCustodyEvent,
): boolean {
  return serializeArtifactCustodyEvent(a) === serializeArtifactCustodyEvent(b);
}
