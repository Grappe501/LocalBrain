import type {
  ConsolidationScore,
  ConsolidationScoreBand,
  ConsolidationScoreComponents,
} from "@localbrain/shared";
import type { ConsolidationFinding } from "./types.js";
import { getDatabase } from "../db/database.js";

const WEIGHTS = {
  duplicate_density: 0.2,
  version_fragmentation: 0.15,
  workspace_fragmentation: 0.2,
  orphan_assets: 0.15,
  archive_opportunities: 0.1,
  naming_consistency: 0.1,
  storage_efficiency: 0.1,
};

export function migrateConsolidationTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS consolidation_score_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score REAL NOT NULL,
      components_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS consolidation_dismissed (
      card_id TEXT PRIMARY KEY,
      dismissed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function loadDismissedIds(): Set<string> {
  const rows = getDatabase()
    .prepare("SELECT card_id FROM consolidation_dismissed")
    .all() as { card_id: string }[];
  return new Set(rows.map((r) => r.card_id));
}

export function dismissCard(cardId: string): void {
  getDatabase()
    .prepare("INSERT OR IGNORE INTO consolidation_dismissed (card_id) VALUES (?)")
    .run(cardId);
}

export function computeConsolidationScore(
  findings: ConsolidationFinding[],
  totalIndexedBytes: number,
  orphanCount: number,
): ConsolidationScore {
  const dupFindings = findings.filter((f) => f.category === "duplicate_file");
  const verFindings = findings.filter((f) => f.category === "version_chain");
  const folderFindings = findings.filter((f) => f.category === "folder_consolidation" || f.category === "workspace_orphan");
  const archiveFindings = findings.filter((f) => f.category === "archive_opportunity");
  const reclaimable = findings.reduce((s, f) => s + f.reclaimable_bytes, 0);

  const components: ConsolidationScoreComponents = {
    duplicate_density: componentScore(Math.max(0, 100 - dupFindings.length * 4)),
    version_fragmentation: componentScore(Math.max(0, 100 - verFindings.length * 6)),
    workspace_fragmentation: componentScore(Math.max(0, 100 - folderFindings.length * 5)),
    orphan_assets: componentScore(Math.max(0, 100 - orphanCount * 8)),
    archive_opportunities: componentScore(Math.max(0, 100 - archiveFindings.length * 3)),
    naming_consistency: componentScore(88 - Math.min(40, verFindings.length * 3)),
    storage_efficiency: componentScore(
      totalIndexedBytes > 0 ? Math.max(0, 100 - (reclaimable / totalIndexedBytes) * 200) : 90,
    ),
  };

  let score = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    score += components[key as keyof ConsolidationScoreComponents] * weight;
  }
  score = Math.round(clamp(score));

  const band = scoreBand(score);
  const { trend_delta, trend_label } = loadTrend(score);

  persistSnapshot(score, components);

  return {
    score,
    band,
    band_label: bandLabel(band),
    trend_delta,
    trend_label,
    components,
    computed_at: new Date().toISOString(),
  };
}

function persistSnapshot(score: number, components: ConsolidationScoreComponents): void {
  getDatabase()
    .prepare("INSERT INTO consolidation_score_snapshots (score, components_json) VALUES (?, ?)")
    .run(score, JSON.stringify(components));
}

function loadTrend(current: number): { trend_delta: number | null; trend_label: string | null } {
  const row = getDatabase()
    .prepare(
      `SELECT score FROM consolidation_score_snapshots
       ORDER BY id DESC LIMIT 1 OFFSET 1`,
    )
    .get() as { score: number } | undefined;
  if (!row) return { trend_delta: null, trend_label: null };
  const delta = current - row.score;
  if (delta === 0) return { trend_delta: 0, trend_label: "Stable" };
  return {
    trend_delta: delta,
    trend_label: delta > 0 ? `↑ +${delta} since last run` : `↓ ${delta} since last run`,
  };
}

function componentScore(n: number): number {
  return clamp(Math.round(n));
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function scoreBand(score: number): ConsolidationScoreBand {
  if (score >= 90) return "excellent";
  if (score >= 75) return "healthy";
  if (score >= 55) return "fair";
  return "critical";
}

function bandLabel(band: ConsolidationScoreBand): string {
  switch (band) {
    case "excellent":
      return "Excellent";
    case "healthy":
      return "Healthy";
    case "fair":
      return "Fair";
    case "critical":
      return "Needs attention";
  }
}
