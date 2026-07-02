import { createHash } from "node:crypto";
import type {
  ConstitutionalCitation,
  ConstitutionalEvidencePackage,
  ConstitutionalRetrievalRequest,
  ConstitutionalSubstrateKind,
  RetrievalAuditTrail,
  RetrievalCoverageReport,
} from "@localbrain/shared";
import {
  CONSTITUTIONAL_RETRIEVAL_VERSION,
  CONSTITUTIONAL_SUBSTRATE_KINDS,
} from "@localbrain/shared";
import { RETRIEVAL_ORDERING_SPEC } from "./retrievalOrdering.js";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function canonicalSubstrateRefs(
  request: ConstitutionalRetrievalRequest,
): Partial<Record<ConstitutionalSubstrateKind, string[]>> | undefined {
  const refs = request.substrate_refs;
  if (!refs) return undefined;
  const canonical: Partial<Record<ConstitutionalSubstrateKind, string[]>> = {};
  for (const substrate of CONSTITUTIONAL_SUBSTRATE_KINDS) {
    const ids = refs[substrate];
    if (!ids?.length) continue;
    canonical[substrate] = [...ids].sort();
  }
  return Object.keys(canonical).length > 0 ? canonical : undefined;
}

/** Deterministic fingerprint of the retrieval request — independent of ref list order. */
export function buildRequestFingerprint(request: ConstitutionalRetrievalRequest): string {
  const canonical = {
    request_id: request.request_id,
    scope_label: request.scope_label,
    domain: request.domain ?? null,
    substrate_refs: canonicalSubstrateRefs(request) ?? null,
  };
  return sha256Hex(stableStringify(canonical));
}

function coverageForFingerprint(report: RetrievalCoverageReport): Omit<
  RetrievalCoverageReport,
  "retrieval_timestamp"
> {
  const { retrieval_timestamp: _ts, ...rest } = report;
  return rest;
}

/** Deterministic fingerprint of package content — excludes wall-clock audit timestamps. */
export function buildPackageFingerprint(input: {
  requestFingerprint: string;
  status: ConstitutionalEvidencePackage["status"];
  status_reason?: string;
  episodes: ConstitutionalEvidencePackage["episodes"];
  facts: ConstitutionalEvidencePackage["facts"];
  artifacts: ConstitutionalEvidencePackage["artifacts"];
  conversations: ConstitutionalEvidencePackage["conversations"];
  decision_citations: ConstitutionalEvidencePackage["decision_citations"];
  citations: ConstitutionalCitation[];
  coverage_report: RetrievalCoverageReport;
}): string {
  const body = {
    request_fingerprint: input.requestFingerprint,
    retrieval_version: CONSTITUTIONAL_RETRIEVAL_VERSION,
    status: input.status,
    status_reason: input.status_reason ?? null,
    episodes: input.episodes.map((e) => e.episode_id).sort(),
    facts: input.facts.map((f) => f.fact_id).sort(),
    artifacts: input.artifacts.map((a) => a.artifact_id).sort(),
    conversations: input.conversations
      .map((c) => ({
        conversation_id: c.conversation.conversation_id,
        turn_ids: c.turns.map((t) => t.turn_id).sort(),
      }))
      .sort((a, b) => a.conversation_id.localeCompare(b.conversation_id)),
    decision_citations: input.decision_citations.map((d) => d.citation_id).sort(),
    citations: input.citations.map((c) => ({
      citation_ref: c.citation_ref,
      ordering_key: c.ordering_key,
    })),
    coverage_report: coverageForFingerprint(input.coverage_report),
  };
  return sha256Hex(stableStringify(body));
}

export function buildRetrievalAuditTrail(input: {
  request: ConstitutionalRetrievalRequest;
  status: ConstitutionalEvidencePackage["status"];
  status_reason?: string;
  substrates_searched: ConstitutionalSubstrateKind[];
  citations: ConstitutionalCitation[];
  episodes: ConstitutionalEvidencePackage["episodes"];
  facts: ConstitutionalEvidencePackage["facts"];
  artifacts: ConstitutionalEvidencePackage["artifacts"];
  conversations: ConstitutionalEvidencePackage["conversations"];
  decision_citations: ConstitutionalEvidencePackage["decision_citations"];
  coverage_report: RetrievalCoverageReport;
}): RetrievalAuditTrail {
  const request_fingerprint = buildRequestFingerprint(input.request);
  const package_fingerprint = buildPackageFingerprint({
    requestFingerprint: request_fingerprint,
    status: input.status,
    status_reason: input.status_reason,
    episodes: input.episodes,
    facts: input.facts,
    artifacts: input.artifacts,
    conversations: input.conversations,
    decision_citations: input.decision_citations,
    citations: input.citations,
    coverage_report: input.coverage_report,
  });

  return {
    retrieval_version: CONSTITUTIONAL_RETRIEVAL_VERSION,
    request_fingerprint,
    package_fingerprint,
    substrates_searched: input.substrates_searched,
    citation_order: input.citations.map((c) => c.citation_ref),
    ordering_spec: RETRIEVAL_ORDERING_SPEC,
  };
}

export function deterministicPackageId(packageFingerprint: string): string {
  return `pkg-${packageFingerprint.slice(0, 32)}`;
}
