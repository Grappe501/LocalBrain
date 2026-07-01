import {
  type ArtifactCustodyEvent,
  type ArtifactCustodyEventType,
  type IdentityRef,
  identityRefMatches,
} from "@localbrain/shared";
import { assertArtifactContentUnchanged } from "./artifactStore.js";
import { getArtifactById } from "./artifactStore.js";
import {
  countArtifactCustodyEvents,
  insertArtifactCustodyEvent,
  listArtifactCustodyEvents,
} from "./artifactCustodyStore.js";
import { validateArtifactCustodyEvent } from "./artifactCustodyValidator.js";

export class ArtifactNotFoundForCustodyError extends Error {
  constructor(artifactId: string) {
    super(`Artifact not found: ${artifactId}`);
    this.name = "ArtifactNotFoundForCustodyError";
  }
}

export class ArtifactCustodyChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArtifactCustodyChainError";
  }
}

export type RecordArtifactCustodyInput = {
  artifact_id: string;
  custody_event: ArtifactCustodyEventType;
  actor: IdentityRef;
  event_at: string;
  previous_custodian: IdentityRef | null;
  new_custodian: IdentityRef | null;
  reason?: string;
};

function buildCustodyEvent(input: RecordArtifactCustodyInput): ArtifactCustodyEvent {
  const recordedAt = new Date().toISOString();
  const draft: ArtifactCustodyEvent = {
    custody_event_id: crypto.randomUUID(),
    artifact_id: input.artifact_id,
    custody_event: input.custody_event,
    actor: input.actor,
    event_at: input.event_at,
    recorded_at: recordedAt,
    previous_custodian: input.previous_custodian,
    new_custodian: input.new_custodian,
    reason: input.reason,
  };
  return validateArtifactCustodyEvent(draft);
}

export function getCurrentArtifactCustodian(artifactId: string): IdentityRef | null {
  const chain = listArtifactCustodyEvents(artifactId);
  if (chain.length === 0) return null;
  return chain[chain.length - 1]!.new_custodian;
}

export function recordArtifactCustodyEvent(input: RecordArtifactCustodyInput): ArtifactCustodyEvent {
  const artifact = getArtifactById(input.artifact_id);
  if (!artifact) {
    throw new ArtifactNotFoundForCustodyError(input.artifact_id);
  }

  const beforeFingerprint = artifact;

  if (input.custody_event === "transfer") {
    const current = getCurrentArtifactCustodian(input.artifact_id);
    if (!current || !identityRefMatches(current, input.previous_custodian!)) {
      throw new ArtifactCustodyChainError(
        "previous_custodian must match current custodian for transfer",
      );
    }
  }

  if (input.custody_event === "release") {
    const current = getCurrentArtifactCustodian(input.artifact_id);
    if (!current || !identityRefMatches(current, input.previous_custodian!)) {
      throw new ArtifactCustodyChainError(
        "previous_custodian must match current custodian for release",
      );
    }
  }

  const event = buildCustodyEvent(input);
  insertArtifactCustodyEvent(event);

  const after = getArtifactById(input.artifact_id);
  if (after) {
    assertArtifactContentUnchanged(beforeFingerprint, after);
  }

  return event;
}

export function recordInitialArtifactCustody(
  artifactId: string,
  custodian: IdentityRef,
  eventAt: string,
): ArtifactCustodyEvent {
  if (countArtifactCustodyEvents(artifactId) > 0) {
    throw new ArtifactCustodyChainError("initial custody already recorded");
  }

  return recordArtifactCustodyEvent({
    artifact_id: artifactId,
    custody_event: "initial_custody",
    actor: custodian,
    event_at: eventAt,
    previous_custodian: null,
    new_custodian: custodian,
  });
}

export function transferArtifactCustody(input: {
  artifact_id: string;
  actor: IdentityRef;
  event_at: string;
  previous_custodian: IdentityRef;
  new_custodian: IdentityRef;
  reason?: string;
}): ArtifactCustodyEvent {
  return recordArtifactCustodyEvent({
    ...input,
    custody_event: "transfer",
    previous_custodian: input.previous_custodian,
    new_custodian: input.new_custodian,
  });
}

export function getArtifactCustodyChain(artifactId: string): ArtifactCustodyEvent[] {
  if (!getArtifactById(artifactId)) {
    throw new ArtifactNotFoundForCustodyError(artifactId);
  }
  return listArtifactCustodyEvents(artifactId);
}
