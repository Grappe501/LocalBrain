import type { CreateEpisodeInput } from "./episodeService.js";
import { createEpisode } from "./episodeService.js";
import type { CreateFactInput, SupersedeFactInput } from "./factService.js";
import { createFact, explainFact, supersedeFact } from "./factService.js";
import type { CreateArtifactInput } from "./artifactService.js";
import { createArtifact } from "./artifactService.js";
import {
  getArtifactCustodyChain,
  transferArtifactCustody,
} from "./artifactCustodyService.js";
import type { Episode, Fact, Artifact, ArtifactCustodyEvent, IdentityRef } from "@localbrain/shared";
import type { FactExplanation } from "./factExplainability.js";

/** Vol 3 write path — Wave 1: validate → provenance → persist → audit (no index/recall). */
export type EpisodeWriteResult = {
  episode: Episode;
  engine_id: "ENG-MEM-001";
};

export type FactWriteResult = {
  fact: Fact;
  engine_id: "ENG-MEM-001";
};

export type FactSupersessionWriteResult = {
  prior: Fact;
  successor: Fact;
  engine_id: "ENG-MEM-001";
};

export type ArtifactWriteResult = {
  artifact: Artifact;
  engine_id: "ENG-MEM-001";
};

export type ArtifactCustodyWriteResult = {
  custody_event: ArtifactCustodyEvent;
  engine_id: "ENG-MEM-001";
};

export type ArtifactCustodyChainResult = {
  chain: ArtifactCustodyEvent[];
  engine_id: "ENG-MEM-001";
};

export function writeEpisode(input: CreateEpisodeInput): EpisodeWriteResult {
  const episode = createEpisode(input);
  return { episode, engine_id: "ENG-MEM-001" };
}

export function writeFact(input: CreateFactInput): FactWriteResult {
  const fact = createFact(input);
  return { fact, engine_id: "ENG-MEM-001" };
}

export function writeFactSupersession(input: SupersedeFactInput): FactSupersessionWriteResult {
  const result = supersedeFact(input);
  return { ...result, engine_id: "ENG-MEM-001" };
}

export function writeArtifact(input: CreateArtifactInput): ArtifactWriteResult {
  const artifact = createArtifact(input);
  return { artifact, engine_id: "ENG-MEM-001" };
}

export function writeArtifactCustodyTransfer(input: {
  artifact_id: string;
  actor: IdentityRef;
  event_at: string;
  previous_custodian: IdentityRef;
  new_custodian: IdentityRef;
  reason?: string;
}): ArtifactCustodyWriteResult {
  const custody_event = transferArtifactCustody(input);
  return { custody_event, engine_id: "ENG-MEM-001" };
}

export function readArtifactCustodyChain(artifactId: string): ArtifactCustodyChainResult {
  return { chain: getArtifactCustodyChain(artifactId), engine_id: "ENG-MEM-001" };
}

export function writeExplainFact(factId: string): { explanation: FactExplanation; engine_id: "ENG-MEM-001" } {
  return { explanation: explainFact(factId), engine_id: "ENG-MEM-001" };
}
