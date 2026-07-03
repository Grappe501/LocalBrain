/**
 * ENG-COM-001.1 — Traceable Draft Generation.
 * Evidence Package in. CommunicationsDraft + CitationMapping out.
 */

import type {
  CommunicationsDraftRequest,
  ConstitutionalEvidencePackage,
  TraceableDraftGenerationResult,
  TraceableDraftProposal,
} from "@localbrain/shared";
import { isAnyProviderConfigured } from "../providers/credentials.js";
import {
  assembleTraceableCommunicationsDraft,
  assembleWithheldCommunicationsDraft,
} from "./communicationsDraftAssembler.js";
import { proposeFixtureTraceableDraft } from "./fixtureTraceableDraftAdapter.js";
import { proposeLlmTraceableDraft } from "./llmTraceableDraftAdapter.js";

export type TraceableDraftAdapter = (
  pkg: ConstitutionalEvidencePackage,
  request: CommunicationsDraftRequest,
) => Promise<TraceableDraftProposal>;

export type GenerateTraceableDraftOptions = {
  /** Explicit adapter — required in tests. Defaults to LLM when configured. */
  adapter?: TraceableDraftAdapter;
};

async function defaultAdapter(
  pkg: ConstitutionalEvidencePackage,
  request: CommunicationsDraftRequest,
): Promise<TraceableDraftProposal> {
  if (isAnyProviderConfigured()) {
    return proposeLlmTraceableDraft(pkg, request);
  }
  return proposeFixtureTraceableDraft(pkg, request);
}

export async function generateTraceableCommunicationsDraft(
  pkg: ConstitutionalEvidencePackage,
  request: CommunicationsDraftRequest,
  options: GenerateTraceableDraftOptions = {},
): Promise<TraceableDraftGenerationResult> {
  if (pkg.status !== "complete") {
    return assembleWithheldCommunicationsDraft(pkg, request);
  }

  const adapter = options.adapter ?? defaultAdapter;
  const proposal = await adapter(pkg, request);
  return assembleTraceableCommunicationsDraft(pkg, request, proposal);
}
