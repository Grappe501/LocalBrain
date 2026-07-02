/**
 * ENG-EI-002.1 Executive Brief — deterministic renderer.
 * Evidence Package in. Doctrine-compliant Executive Brief out. Nothing else.
 */

import { createHash } from "node:crypto";
import type {
  ConstitutionalEvidencePackage,
  ExecutiveBrief,
  ExecutiveBriefOmissionNote,
  ExecutiveBriefSection,
  ExecutiveBriefSourceMapping,
  ExecutiveBriefStatement,
} from "@localbrain/shared";
import {
  EXECUTIVE_BRIEF_ENGINE_ID,
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
      summary: artifact.source_ref ?? artifact.content_ref,
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

  for (const excluded of pkg.coverage_report.records_excluded) {
    notes.push({
      kind: "excluded_record",
      description: excluded.rule_description,
      citation_ref: `${excluded.substrate}:${excluded.record_id}`,
      rule_id: excluded.rule_id,
    });
  }

  const cited = new Set(pkg.citations.map((c) => c.citation_ref));
  for (const mapping of buildSourceMapping(pkg)) {
    if (!cited.has(mapping.citation_ref)) {
      notes.push({
        kind: "substrate_gap",
        description: `Record present in package body but missing from citation set: ${mapping.citation_ref}`,
        citation_ref: mapping.citation_ref,
      });
    }
  }

  return notes;
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

  const sections: ExecutiveBriefSection[] = [];

  if (pkg.episodes.length > 0) {
    sections.push({
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
    sections.push({
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
    sections.push({
      section_id: "sec-artifacts",
      title: "Artifacts",
      statements: pkg.artifacts.map((artifact, index) => ({
        statement_id: statementId("sec-artifacts", index),
        text: `Artifact preserved: ${artifact.source_ref ?? artifact.content_ref}`,
        citation_refs: [`artifact:${artifact.artifact_id}`],
      })),
    });
  }

  if (pkg.conversations.length > 0) {
    sections.push({
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
    sections.push({
      section_id: "sec-decisions",
      title: "Decision citations",
      statements: pkg.decision_citations.map((citation, index) => ({
        statement_id: statementId("sec-decisions", index),
        text: `${citation.question} — ${citation.outcome_summary}`,
        citation_refs: [`decision_citation:${citation.citation_id}`],
      })),
    });
  }

  return sections;
}

/** Render a deterministic Executive Brief from a constitutional evidence package. */
export function renderExecutiveBriefFromPackage(
  pkg: ConstitutionalEvidencePackage,
): ExecutiveBrief {
  const source_package_fingerprint = pkg.retrieval_audit.package_fingerprint;
  const fingerprint = briefFingerprint(source_package_fingerprint);

  return {
    brief_id: `brief-${fingerprint.slice(0, 32)}`,
    package_id: pkg.package_id,
    request_id: pkg.request_id,
    scope_label: pkg.scope_label,
    brief_version: EXECUTIVE_BRIEF_VERSION,
    rendered_at: new Date().toISOString(),
    source_package_fingerprint,
    source_package_status: pkg.status,
    sections: buildSections(pkg),
    source_mapping: buildSourceMapping(pkg),
    omission_notes: buildOmissionNotes(pkg),
  };
}

export { EXECUTIVE_BRIEF_ENGINE_ID, EXECUTIVE_BRIEF_VERSION };
