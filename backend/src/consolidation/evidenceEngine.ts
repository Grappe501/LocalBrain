import type { ConsolidationContext, ConsolidationFinding, EvidenceProvider } from "./types.js";
import { duplicateEvidenceProvider } from "./providers/duplicateEvidenceProvider.js";
import { folderEvidenceProvider } from "./providers/folderEvidenceProvider.js";
import { programEvidenceProvider, knowledgeEvidenceProvider } from "./providers/programKnowledgeStubs.js";
import { versionEvidenceProvider } from "./providers/versionEvidenceProvider.js";

const LIVE_PROVIDERS: EvidenceProvider[] = [
  duplicateEvidenceProvider,
  versionEvidenceProvider,
  folderEvidenceProvider,
];

/** Stub providers registered but return empty until future slices. */
const STUB_PROVIDERS: EvidenceProvider[] = [
  programEvidenceProvider,
  knowledgeEvidenceProvider,
];

export function collectAllFindings(ctx: ConsolidationContext): ConsolidationFinding[] {
  const findings: ConsolidationFinding[] = [];
  for (const provider of [...LIVE_PROVIDERS, ...STUB_PROVIDERS]) {
    findings.push(...provider.collect(ctx));
  }
  return dedupeFindings(findings);
}

function dedupeFindings(findings: ConsolidationFinding[]): ConsolidationFinding[] {
  const seen = new Set<string>();
  const out: ConsolidationFinding[] = [];
  for (const f of findings) {
    const key = `${f.category}::${f.title}::${f.related_paths[0] ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

export function listProviderIds(): { live: string[]; stub: string[] } {
  return {
    live: LIVE_PROVIDERS.map((p) => p.id),
    stub: STUB_PROVIDERS.map((p) => p.id),
  };
}
