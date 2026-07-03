/**
 * ENG-COM-001.1 — Assemble CommunicationsDraft + CitationMapping from validated proposal.
 */

import { createHash } from "node:crypto";
import type {
  CommunicationsDraft,
  CommunicationsDraftCitationEntry,
  CommunicationsDraftCitationMapping,
  CommunicationsDraftRequest,
  CommunicationsDraftStatement,
  ConstitutionalCitation,
  ConstitutionalEvidencePackage,
  TraceableDraftGenerationResult,
  TraceableDraftProposal,
} from "@localbrain/shared";
import {
  COMMUNICATIONS_DRAFT_ADVISORY_NOTICE,
  COMMUNICATIONS_DRAFT_VERSION,
} from "@localbrain/shared";
import {
  assertCitationMappingComplete,
  validateTraceableDraftProposal,
} from "./communicationsDraftValidator.js";
import {
  buildUncertaintyNote,
  extractCitationEpistemicProfile,
  requiredEpistemicForCitationRefs,
} from "./communicationsDraftEpistemics.js";
import {
  validateAdvisoryRestraintDraftProposal,
} from "./communicationsDraftAdvisoryRestraintValidator.js";
import {
  validateCitationMappingUncertainty,
  validateUncertaintyDraftProposal,
} from "./communicationsDraftUncertaintyValidator.js";

export function validateComposedDraftProposal(
  pkg: ConstitutionalEvidencePackage,
  request: CommunicationsDraftRequest,
  proposal: TraceableDraftProposal,
): void {
  validateTraceableDraftProposal(pkg, proposal);
  validateUncertaintyDraftProposal(pkg, proposal);
  validateAdvisoryRestraintDraftProposal(request, proposal);
}

function draftFingerprint(packageFingerprint: string, requestId: string): string {
  return createHash("sha256")
    .update(
      `communications-draft\0${packageFingerprint}\0${requestId}\0${COMMUNICATIONS_DRAFT_VERSION}`,
      "utf8",
    )
    .digest("hex");
}

function citationSummary(
  pkg: ConstitutionalEvidencePackage,
  citation: ConstitutionalCitation,
): string {
  switch (citation.substrate) {
    case "episode": {
      const record = pkg.episodes.find((e) => e.episode_id === citation.record_id);
      return record?.title ?? record?.source_ref ?? citation.citation_ref;
    }
    case "fact": {
      const record = pkg.facts.find((f) => f.fact_id === citation.record_id);
      return record?.statement ?? citation.citation_ref;
    }
    case "artifact": {
      const record = pkg.artifacts.find((a) => a.artifact_id === citation.record_id);
      return record?.title ?? record?.storage_ref ?? citation.citation_ref;
    }
    case "conversation": {
      const record = pkg.conversations.find(
        (c) => c.conversation.conversation_id === citation.record_id,
      );
      return record?.conversation.source_ref ?? citation.citation_ref;
    }
    case "decision_citation": {
      const record = pkg.decision_citations.find(
        (d) => d.citation_id === citation.record_id,
      );
      return record?.outcome_summary ?? citation.citation_ref;
    }
    default:
      return citation.citation_ref;
  }
}

function buildCitationMapping(
  draft: CommunicationsDraft,
  pkg: ConstitutionalEvidencePackage,
  statements: CommunicationsDraftStatement[],
): CommunicationsDraftCitationMapping {
  const byRef = new Map<string, CommunicationsDraftCitationEntry>();

  for (const statement of statements) {
    if (!statement.text.trim()) continue;
    for (const ref of statement.citation_refs) {
      const citation = pkg.citations.find((c) => c.citation_ref === ref);
      if (!citation) continue;
      const existing = byRef.get(ref);
      if (existing) {
        if (!existing.statement_ids.includes(statement.statement_id)) {
          byRef.set(ref, {
            ...existing,
            statement_ids: [...existing.statement_ids, statement.statement_id],
          });
        }
      } else {
        const profile = extractCitationEpistemicProfile(pkg, ref);
        byRef.set(ref, {
          citation_ref: ref,
          substrate: citation.substrate,
          record_id: citation.record_id,
          summary: citationSummary(pkg, citation),
          statement_ids: [statement.statement_id],
          source_epistemic_level: profile.required_level,
          uncertainty_context: profile.package_uncertainty_note,
        });
      }
    }
  }

  const substantiveIds = statements
    .filter((s) => s.text.trim().length > 0)
    .map((s) => s.statement_id);
  const mappedStatementIds = new Set(
    [...byRef.values()].flatMap((e) => e.statement_ids),
  );
  const unmapped = substantiveIds.filter((id) => !mappedStatementIds.has(id));

  assertCitationMappingComplete(substantiveIds, [...mappedStatementIds]);

  return {
    mapping_id: `cdm-${draft.draft_id}`,
    draft_id: draft.draft_id,
    package_id: pkg.package_id,
    package_fingerprint: pkg.retrieval_audit.package_fingerprint,
    entries: [...byRef.values()].sort((a, b) => a.citation_ref.localeCompare(b.citation_ref)),
    unmapped_statement_ids: unmapped,
  };
}

export function assembleTraceableCommunicationsDraft(
  pkg: ConstitutionalEvidencePackage,
  request: CommunicationsDraftRequest,
  proposal: TraceableDraftProposal,
): TraceableDraftGenerationResult {
  validateComposedDraftProposal(pkg, request, proposal);

  const draftId = draftFingerprint(pkg.retrieval_audit.package_fingerprint, request.request_id);
  const statements: CommunicationsDraftStatement[] = proposal.statements.map((s, index) => {
    const { profiles } = requiredEpistemicForCitationRefs(pkg, s.citation_refs);
    return {
      statement_id: `stmt-${String(index + 1).padStart(3, "0")}`,
      text: s.text.trim(),
      citation_refs: [...new Set(s.citation_refs)].sort((a, b) => a.localeCompare(b)),
      epistemic_level: s.epistemic_level,
      uncertainty_note:
        buildUncertaintyNote(profiles) ??
        (s.uncertainty_markers?.length ? s.uncertainty_markers.join(" · ") : undefined),
    };
  });

  const body_text = statements
    .filter((s) => s.text.length > 0)
    .map((s) => s.text)
    .join("\n\n");

  const draft: CommunicationsDraft = {
    draft_id: draftId,
    package_id: pkg.package_id,
    communications_request_id: request.request_id,
    intent_label: request.intent_label,
    draft_version: COMMUNICATIONS_DRAFT_VERSION,
    generated_at: new Date().toISOString(),
    source_package_fingerprint: pkg.retrieval_audit.package_fingerprint,
    source_package_status: pkg.status,
    advisory_notice: COMMUNICATIONS_DRAFT_ADVISORY_NOTICE,
    body_text,
    statements,
    withheld: [...proposal.withheld],
  };

  const citation_mapping = buildCitationMapping(draft, pkg, statements);
  validateCitationMappingUncertainty(pkg, citation_mapping.entries);

  return { draft, citation_mapping };
}

export function assembleWithheldCommunicationsDraft(
  pkg: ConstitutionalEvidencePackage,
  request: CommunicationsDraftRequest,
): TraceableDraftGenerationResult {
  const proposal: TraceableDraftProposal = {
    statements: [],
    withheld: [
      {
        kind: "insufficient_evidence",
        description:
          pkg.status_reason ??
          `Evidence package status ${pkg.status} — draft generation withheld`,
      },
    ],
  };
  return assembleTraceableCommunicationsDraft(pkg, request, proposal);
}
