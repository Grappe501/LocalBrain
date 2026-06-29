import type { ConsolidationContext, ConsolidationFinding } from "../types.js";

export const programEvidenceProvider = {
  id: "program-evidence",
  category: "folder_consolidation" as const,
  collect(_ctx: ConsolidationContext): ConsolidationFinding[] {
    return [];
  },
};

export const knowledgeEvidenceProvider = {
  id: "knowledge-evidence",
  category: "folder_consolidation" as const,
  collect(_ctx: ConsolidationContext): ConsolidationFinding[] {
    return [];
  },
};
