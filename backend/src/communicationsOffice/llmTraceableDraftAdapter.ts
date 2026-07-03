/**
 * ENG-COM-001.1 — LLM adapter · bounded probabilistic draft proposal with strict package citations.
 */

import type {
  CommunicationsDraftRequest,
  ConstitutionalEvidencePackage,
  TraceableDraftProposal,
} from "@localbrain/shared";
import { routeCompletion } from "../providers/router.js";

function buildAllowedCitationCatalog(pkg: ConstitutionalEvidencePackage): string {
  return pkg.citations
    .map((c) => `- ${c.citation_ref} (${c.substrate}:${c.record_id})`)
    .join("\n");
}

function buildPrompt(
  pkg: ConstitutionalEvidencePackage,
  request: CommunicationsDraftRequest,
): string {
  return [
    "You produce a traceable communications draft proposal as JSON only.",
    "Rules:",
    "- Every substantive statement MUST cite one or more citation_ref values from the allowed list only.",
    "- Do NOT invent facts not supported by cited records.",
    "- If the request asks for unsupported content, add a withheld entry instead of inventing statements.",
    "- Output remains advisory — no policy decisions or action directives.",
    "- Return JSON: { \"statements\": [{ \"text\": string, \"citation_refs\": string[], \"epistemic_level\": \"established\"|\"qualified\"|\"hypothesis\", \"uncertainty_markers\"?: string[] }], \"withheld\": [...] }",
    "- Preserve source uncertainty — never strengthen confidence beyond cited evidence.",
    "",
    `Communications intent: ${request.intent_label}`,
    request.audience_label ? `Audience: ${request.audience_label}` : "",
    `Evidence package status: ${pkg.status}`,
    "",
    "Allowed citation_ref values (ONLY these may appear in citation_refs):",
    buildAllowedCitationCatalog(pkg),
  ]
    .filter(Boolean)
    .join("\n");
}

function parseProposalJson(content: string): TraceableDraftProposal {
  const trimmed = content.trim();
  const jsonBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = jsonBlock ? jsonBlock[1]!.trim() : trimmed;
  const parsed = JSON.parse(raw) as {
    statements?: Array<{
      text?: string;
      citation_refs?: string[];
      epistemic_level?: "established" | "qualified" | "hypothesis";
      uncertainty_markers?: string[];
    }>;
    withheld?: TraceableDraftProposal["withheld"];
  };

  return {
    statements: (parsed.statements ?? []).map((s) => ({
      text: String(s.text ?? ""),
      citation_refs: [...(s.citation_refs ?? [])],
      epistemic_level: s.epistemic_level ?? "established",
      uncertainty_markers: s.uncertainty_markers ?? [],
    })),
    withheld: parsed.withheld ?? [],
  };
}

export async function proposeLlmTraceableDraft(
  pkg: ConstitutionalEvidencePackage,
  request: CommunicationsDraftRequest,
): Promise<TraceableDraftProposal> {
  if (pkg.status !== "complete") {
    return {
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
  }

  const result = await routeCompletion({
    capability: "writing",
    messages: [{ role: "user", content: buildPrompt(pkg, request) }],
  });

  return parseProposalJson(result.content);
}
