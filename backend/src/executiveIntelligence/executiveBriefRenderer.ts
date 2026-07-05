/**
 * ENG-EI-002.2 Executive Brief — deterministic renderer · behavioral fidelity.
 * Evidence Package in. Doctrine-compliant Executive Brief out. Nothing else.
 */

import { createHash } from "node:crypto";
import type {
  ConstitutionalEvidencePackage,
  ConstitutionalSubstrateKind,
  DecisionCitation,
  ExecutiveBrief,
  ExecutiveBriefCitationGroup,
  ExecutiveBriefEvidenceBoundary,
  ExecutiveBriefOmissionNote,
  ExecutiveBriefSection,
  ExecutiveBriefSourceMapping,
} from "@localbrain/shared";
import {
  EXECUTIVE_BRIEF_ENGINE_ID,
  EXECUTIVE_BRIEF_SECTION_ORDER,
  EXECUTIVE_BRIEF_VERSION,
} from "@localbrain/shared";

function briefFingerprint(packageFingerprint: string): string {
  return createHash("sha256")
    .update(`executive-brief\0${packageFingerprint}\0${EXECUTIVE_BRIEF_VERSION}`, "utf8")
    .digest("hex");
}

function statementId(sectionId: string, index: number): string {
  return `${sectionId}-stmt-${String(index + 1).padStart(3, "0")}`;
}

function trustUncertainty(confidenceLevel: string | undefined): string | undefined {
  if (!confidenceLevel || confidenceLevel === "user_confirmed") return undefined;
  return `Source confidence: ${confidenceLevel}`;
}

function packageCitationRefSet(pkg: ConstitutionalEvidencePackage): Set<string> {
  return new Set(pkg.citations.map((c) => c.citation_ref));
}

function decisionCitationRefs(
  citation: DecisionCitation,
  pkg: ConstitutionalEvidencePackage,
): string[] {
  const primary = `decision_citation:${citation.citation_id}`;
  const inPackage = packageCitationRefSet(pkg);
  const supporting = citation.supporting_memory_refs
    .filter((ref) => inPackage.has(ref))
    .sort((a, b) => a.localeCompare(b));
  const refs = [primary, ...supporting.filter((ref) => ref !== primary)];
  return [...new Set(refs)];
}

function buildSourceMapping(pkg: ConstitutionalEvidencePackage): ExecutiveBriefSourceMapping[] {
  const mappings: ExecutiveBriefSourceMapping[] = [];

  for (const episode of pkg.episodes) {
    const ref = `episode:${episode.episode_id}`;
    mappings.push({
      citation_ref: ref,
      substrate: "episode",
      record_id: episode.episode_id,
      summary: episode.title ?? episode.source_ref,
    });
  }
  for (const fact of pkg.facts) {
    const ref = `fact:${fact.fact_id}`;
    mappings.push({
      citation_ref: ref,
      substrate: "fact",
      record_id: fact.fact_id,
      summary: fact.statement,
    });
  }
  for (const artifact of pkg.artifacts) {
    const ref = `artifact:${artifact.artifact_id}`;
    mappings.push({
      citation_ref: ref,
      substrate: "artifact",
      record_id: artifact.artifact_id,
      summary: artifact.content_ref ?? artifact.uri ?? artifact.mime_type,
    });
  }
  for (const entry of pkg.conversations) {
    const ref = `conversation:${entry.conversation.conversation_id}`;
    const lastTurn = entry.turns.at(-1);
    mappings.push({
      citation_ref: ref,
      substrate: "conversation",
      record_id: entry.conversation.conversation_id,
      summary: lastTurn?.content ?? entry.conversation.channel,
    });
  }
  for (const citation of pkg.decision_citations) {
    const ref = `decision_citation:${citation.citation_id}`;
    mappings.push({
      citation_ref: ref,
      substrate: "decision_citation",
      record_id: citation.citation_id,
      summary: citation.question,
    });
  }

  return mappings.sort((a, b) => a.citation_ref.localeCompare(b.citation_ref));
}

function buildEvidenceBoundaries(
  pkg: ConstitutionalEvidencePackage,
): ExecutiveBriefEvidenceBoundary[] {
  const boundaries: ExecutiveBriefEvidenceBoundary[] = [];

  if (pkg.status === "withheld") {
    boundaries.push({
      kind: "withheld",
      description: pkg.status_reason ?? "Evidence package withheld.",
    });
  }
  if (pkg.status === "insufficient_evidence") {
    boundaries.push({
      kind: "withheld",
      description: pkg.status_reason ?? "Evidence package insufficient.",
    });
  }

  for (const citation of pkg.citations) {
    boundaries.push({
      kind: "reported",
      citation_ref: citation.citation_ref,
      substrate: citation.substrate,
      record_id: citation.record_id,
      description: `Reported in package: ${citation.citation_ref}`,
    });
  }

  for (const excluded of pkg.coverage_report.records_excluded) {
    const citationRef = `${excluded.substrate}:${excluded.record_id}`;
    const kind = excluded.reason === "not_found" ? "absent" : "excluded";
    boundaries.push({
      kind,
      citation_ref: citationRef,
      substrate: excluded.substrate,
      record_id: excluded.record_id,
      description: excluded.rule_description,
      rule_id: excluded.rule_id,
    });
  }

  return boundaries.sort((a, b) => {
    const kindOrder = ["reported", "excluded", "absent", "withheld"] as const;
    const kindDelta =
      kindOrder.indexOf(a.kind as (typeof kindOrder)[number]) -
      kindOrder.indexOf(b.kind as (typeof kindOrder)[number]);
    if (kindDelta !== 0) return kindDelta;
    return (a.citation_ref ?? a.description).localeCompare(b.citation_ref ?? b.description);
  });
}

function buildOmissionNotes(pkg: ConstitutionalEvidencePackage): ExecutiveBriefOmissionNote[] {
  const notes: ExecutiveBriefOmissionNote[] = [];

  if (pkg.status === "withheld" && pkg.status_reason) {
    notes.push({
      kind: "package_withheld",
      description: pkg.status_reason,
    });
  }
  if (pkg.status === "insufficient_evidence" && pkg.status_reason) {
    notes.push({
      kind: "insufficient_evidence",
      description: pkg.status_reason,
    });
  }

  const completeness = pkg.coverage_report.completeness;
  for (const substrate of completeness.substrates_required) {
    if (!completeness.substrates_with_results.includes(substrate)) {
      notes.push({
        kind: "completeness_gap",
        substrate: substrate as ConstitutionalSubstrateKind,
        description: `Required substrate ${substrate} returned no records for this request.`,
      });
    }
  }

  for (const substrate of completeness.substrates_required) {
    const requested = completeness.records_requested[substrate] ?? 0;
    const retrieved = pkg.coverage_report.records_retrieved[substrate] ?? 0;
    if (requested > retrieved) {
      notes.push({
        kind: "substrate_gap",
        substrate: substrate as ConstitutionalSubstrateKind,
        description: `Requested ${requested} ${substrate} record(s); retrieved ${retrieved}.`,
      });
    }
  }

  for (const excluded of pkg.coverage_report.records_excluded) {
    notes.push({
      kind: "excluded_record",
      description: excluded.rule_description,
      citation_ref: `${excluded.substrate}:${excluded.record_id}`,
      rule_id: excluded.rule_id,
      substrate: excluded.substrate,
    });
  }

  const cited = new Set(pkg.citations.map((c) => c.citation_ref));
  for (const mapping of buildSourceMapping(pkg)) {
    if (!cited.has(mapping.citation_ref)) {
      notes.push({
        kind: "substrate_gap",
        description: `Record present in package body but missing from citation set: ${mapping.citation_ref}`,
        citation_ref: mapping.citation_ref,
        substrate: mapping.substrate,
      });
    }
  }

  return notes.sort((a, b) => {
    const kindOrder = [
      "package_withheld",
      "insufficient_evidence",
      "completeness_gap",
      "substrate_gap",
      "excluded_record",
    ] as const;
    const kindDelta =
      kindOrder.indexOf(a.kind as (typeof kindOrder)[number]) -
      kindOrder.indexOf(b.kind as (typeof kindOrder)[number]);
    if (kindDelta !== 0) return kindDelta;
    return (a.citation_ref ?? a.description).localeCompare(b.citation_ref ?? b.description);
  });
}

function buildSectionBuilders(
  pkg: ConstitutionalEvidencePackage,
): Map<string, ExecutiveBriefSection> {
  const sections = new Map<string, ExecutiveBriefSection>();

  if (pkg.episodes.length > 0) {
    sections.set("sec-episodes", {
      section_id: "sec-episodes",
      title: "Episodes",
      statements: pkg.episodes.map((episode, index) => ({
        statement_id: statementId("sec-episodes", index),
        text: episode.title ?? `Episode ${episode.episode_id}`,
        citation_refs: [`episode:${episode.episode_id}`],
      })),
    });
  }

  if (pkg.facts.length > 0) {
    sections.set("sec-facts", {
      section_id: "sec-facts",
      title: "Facts",
      statements: pkg.facts.map((fact, index) => ({
        statement_id: statementId("sec-facts", index),
        text: fact.statement,
        citation_refs: [`fact:${fact.fact_id}`],
        uncertainty_note: trustUncertainty(fact.confidence?.level),
      })),
    });
  }

  if (pkg.artifacts.length > 0) {
    sections.set("sec-artifacts", {
      section_id: "sec-artifacts",
      title: "Artifacts",
      statements: pkg.artifacts.map((artifact, index) => ({
        statement_id: statementId("sec-artifacts", index),
        text: `Artifact preserved: ${artifact.content_ref ?? artifact.uri ?? artifact.mime_type}`,
        citation_refs: [`artifact:${artifact.artifact_id}`],
      })),
    });
  }

  if (pkg.conversations.length > 0) {
    sections.set("sec-conversations", {
      section_id: "sec-conversations",
      title: "Conversations",
      statements: pkg.conversations.map((entry, index) => {
        const lastTurn = entry.turns.at(-1);
        return {
          statement_id: statementId("sec-conversations", index),
          text: lastTurn?.content ?? `Conversation on ${entry.conversation.channel}`,
          citation_refs: [`conversation:${entry.conversation.conversation_id}`],
        };
      }),
    });
  }

  if (pkg.decision_citations.length > 0) {
    sections.set("sec-decisions", {
      section_id: "sec-decisions",
      title: "Decision citations",
      statements: pkg.decision_citations.map((citation, index) => ({
        statement_id: statementId("sec-decisions", index),
        text: `${citation.question} — ${citation.outcome_summary}`,
        citation_refs: decisionCitationRefs(citation, pkg),
      })),
    });
  }

  return sections;
}

function orderSections(sections: Map<string, ExecutiveBriefSection>): ExecutiveBriefSection[] {
  return EXECUTIVE_BRIEF_SECTION_ORDER.map((id) => sections.get(id)).filter(
    (section): section is ExecutiveBriefSection => section != null,
  );
}

function buildCitationGroups(sections: ExecutiveBriefSection[]): ExecutiveBriefCitationGroup[] {
  return sections.map((section) => ({
    group_id: `grp-${section.section_id}`,
    section_id: section.section_id,
    statement_ids: section.statements.map((s) => s.statement_id),
    citation_refs: [
      ...new Set(section.statements.flatMap((s) => s.citation_refs)),
    ].sort((a, b) => a.localeCompare(b)),
  }));
}

function buildSections(pkg: ConstitutionalEvidencePackage): ExecutiveBriefSection[] {
  if (pkg.status !== "complete" || pkg.citations.length === 0) {
    return [
      {
        section_id: "sec-status",
        title: "Package status",
        statements: [
          {
            statement_id: "sec-status-stmt-001",
            text: pkg.status_reason ?? `Evidence package status: ${pkg.status}.`,
            citation_refs: [],
            uncertainty_note: "No constitutional assertions emitted — package not complete.",
          },
        ],
      },
    ];
  }

  return orderSections(buildSectionBuilders(pkg));
}

/** Render a deterministic Executive Brief from a constitutional evidence package. */
export function renderExecutiveBriefFromPackage(
  pkg: ConstitutionalEvidencePackage,
): ExecutiveBrief {
  const source_package_fingerprint = pkg.retrieval_audit.package_fingerprint;
  const fingerprint = briefFingerprint(source_package_fingerprint);
  const sections = buildSections(pkg);

  return {
    brief_id: `brief-${fingerprint.slice(0, 32)}`,
    package_id: pkg.package_id,
    request_id: pkg.request_id,
    scope_label: pkg.scope_label,
    brief_version: EXECUTIVE_BRIEF_VERSION,
    rendered_at: new Date().toISOString(),
    source_package_fingerprint,
    source_package_status: pkg.status,
    sections,
    source_mapping: buildSourceMapping(pkg),
    citation_groups: buildCitationGroups(sections),
    evidence_boundaries: buildEvidenceBoundaries(pkg),
    omission_notes: buildOmissionNotes(pkg),
  };
}

export { EXECUTIVE_BRIEF_ENGINE_ID, EXECUTIVE_BRIEF_VERSION };
