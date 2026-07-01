import type { CreateEpisodeInput } from "./episodeService.js";
import { createEpisode } from "./episodeService.js";
import type { CreateFactInput } from "./factService.js";
import { createFact } from "./factService.js";
import type { Episode, Fact } from "@localbrain/shared";

/** Vol 3 write path — Wave 1: validate → provenance → persist → audit (no index/recall). */
export type EpisodeWriteResult = {
  episode: Episode;
  engine_id: "ENG-MEM-001";
};

export type FactWriteResult = {
  fact: Fact;
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
