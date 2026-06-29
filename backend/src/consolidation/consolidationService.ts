import type {
  ConsolidationCategory,
  ConsolidationCategoryResponse,
  ExecutiveConsolidationBriefing,
} from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import type { DigitalAssetRow } from "../digitalAssets/assetRegistry.js";
import { getLatestFilesystemAudit } from "../migration/fsAudit/auditService.js";
import { buildExecutiveConsolidationBriefing } from "./briefingComposer.js";
import { collectAllFindings } from "./evidenceEngine.js";
import { rankFindings } from "./consolidationEngine.js";
import { dismissCard, loadDismissedIds } from "./consolidationScore.js";
import { findingsToCards } from "../intelligence/cardComposer.js";
import type { ConsolidationContext, ConsolidationFinding } from "./types.js";

function loadHAssets(): DigitalAssetRow[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM digital_assets WHERE path LIKE 'H:%' OR path LIKE 'H:/%'`,
    )
    .all() as DigitalAssetRow[];
}

function buildContext(): ConsolidationContext {
  return {
    assets: loadHAssets(),
    audit: getLatestFilesystemAudit(),
    dismissed_ids: loadDismissedIds(),
    observed_at: new Date().toISOString(),
  };
}

export function getConsolidationBriefing(): ExecutiveConsolidationBriefing {
  return buildExecutiveConsolidationBriefing(buildContext());
}

const STUB_CATEGORIES: Record<string, string> = {
  programs: "Program consolidation (Node/Python/SDK sprawl) — planned in a future slice.",
  knowledge: "Knowledge consolidation (markdown/decision docs) — planned in a future slice.",
};

export function getConsolidationCategory(category: ConsolidationCategory): ConsolidationCategoryResponse {
  const ctx = buildContext();
  const findings = rankFindings(collectAllFindings(ctx));

  if (category === "ignored") {
    const dismissed = findings.filter((f) => ctx.dismissed_ids.has(f.finding_id));
    return {
      category,
      stub: false,
      stub_message: null,
      cards: findingsToCards(dismissed, ctx.dismissed_ids),
      observed_at: ctx.observed_at,
    };
  }

  if (category in STUB_CATEGORIES) {
    return {
      category,
      stub: true,
      stub_message: STUB_CATEGORIES[category],
      cards: [],
      observed_at: ctx.observed_at,
    };
  }

  const categoryMap: Record<string, ConsolidationFinding["category"][]> = {
    duplicates: ["duplicate_file"],
    versions: ["version_chain"],
    folders: ["folder_consolidation", "workspace_orphan", "archive_opportunity"],
  };

  const allowed = categoryMap[category] ?? [];
  const filtered = findings.filter(
    (f) => allowed.includes(f.category) && !ctx.dismissed_ids.has(f.finding_id),
  );

  return {
    category,
    stub: false,
    stub_message: null,
    cards: findingsToCards(filtered, ctx.dismissed_ids),
    observed_at: ctx.observed_at,
  };
}

export function dismissConsolidationCard(cardId: string): void {
  dismissCard(cardId);
}

export function getFindingsForSimulation(cardIds?: string[]) {
  const ctx = buildContext();
  const findings = rankFindings(collectAllFindings(ctx)).filter(
    (f) => !ctx.dismissed_ids.has(f.finding_id),
  );
  return { findings, cardIds };
}
