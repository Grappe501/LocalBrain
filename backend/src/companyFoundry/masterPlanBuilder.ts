import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import { getCapstoneNotebook, listCapstoneSections } from "./capstoneNotebook.js";

export type MasterPlanBuildStatus = "draft" | "assembling" | "red_team_ready" | "submitted" | "accepted" | "rework";

export type MasterPlanBuildRecord = {
  id: string;
  notebook_id: string;
  builder_id: string;
  title: string;
  status: MasterPlanBuildStatus;
  version: number;
  completeness_score: number;
  dependency_score: number;
  budget_total_usd: number;
  phase_count: number;
  red_team_score: number | null;
  created_at: string;
  updated_at: string;
};

const requiredSectionKeys = [
  "customer_problem","product_promise","v1_scope","user_journeys","architecture","foundry_reuse",
  "phase_plan","acceptance","market","advantages","pricing","revenue_model","budget","risk",
  "kill_criteria","pilot_economics","residual_proposal","master_plan"
] as const;

export function migrateMasterPlanBuilderTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS foundry_master_plan_builds (
      id TEXT PRIMARY KEY,
      notebook_id TEXT NOT NULL UNIQUE,
      builder_id TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      version INTEGER NOT NULL DEFAULT 1,
      completeness_score REAL NOT NULL DEFAULT 0,
      dependency_score REAL NOT NULL DEFAULT 0,
      budget_total_usd REAL NOT NULL DEFAULT 0,
      phase_count INTEGER NOT NULL DEFAULT 0,
      red_team_score REAL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS foundry_master_plan_sections (
      id TEXT PRIMARY KEY,
      build_id TEXT NOT NULL,
      section_key TEXT NOT NULL,
      title TEXT NOT NULL,
      content_json TEXT NOT NULL,
      source_revision_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(build_id, section_key),
      FOREIGN KEY (build_id) REFERENCES foundry_master_plan_builds(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_master_plan_phases (
      id TEXT PRIMARY KEY,
      build_id TEXT NOT NULL,
      phase_key TEXT NOT NULL,
      title TEXT NOT NULL,
      sequence_no INTEGER NOT NULL,
      dependencies_json TEXT NOT NULL DEFAULT '[]',
      acceptance_json TEXT NOT NULL DEFAULT '[]',
      pvs REAL NOT NULL DEFAULT 0,
      budget_usd REAL NOT NULL DEFAULT 0,
      staffing_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'draft',
      UNIQUE(build_id, phase_key),
      FOREIGN KEY (build_id) REFERENCES foundry_master_plan_builds(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_master_plan_red_team (
      id TEXT PRIMARY KEY,
      build_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      score REAL NOT NULL,
      findings_json TEXT NOT NULL DEFAULT '[]',
      decision TEXT NOT NULL,
      rationale TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (build_id) REFERENCES foundry_master_plan_builds(id) ON DELETE CASCADE
    );
  `);
}

function parseJson(value: string): unknown {
  try { return JSON.parse(value); } catch { return {}; }
}

export function ensureMasterPlanBuild(notebookId: string): MasterPlanBuildRecord | null {
  const notebook = getCapstoneNotebook(notebookId);
  if (!notebook) return null;
  const db = getDatabase();
  const existing = db.prepare(`SELECT * FROM foundry_master_plan_builds WHERE notebook_id=?`).get(notebookId) as MasterPlanBuildRecord | undefined;
  if (existing) return existing;
  const id = randomUUID();
  db.prepare(`INSERT INTO foundry_master_plan_builds (id,notebook_id,builder_id,title,status) VALUES (?,?,?,?, 'draft')`)
    .run(id, notebookId, notebook.builder_id, `${notebook.title} — Master Build Plan`);
  assembleMasterPlanBuild(id);
  return getMasterPlanBuild(id);
}

export function getMasterPlanBuild(buildId: string): MasterPlanBuildRecord | null {
  return (getDatabase().prepare(`SELECT * FROM foundry_master_plan_builds WHERE id=?`).get(buildId) as MasterPlanBuildRecord | undefined) ?? null;
}

export function getMasterPlanBuildByNotebook(notebookId: string): MasterPlanBuildRecord | null {
  return (getDatabase().prepare(`SELECT * FROM foundry_master_plan_builds WHERE notebook_id=?`).get(notebookId) as MasterPlanBuildRecord | undefined) ?? null;
}

export function assembleMasterPlanBuild(buildId: string): MasterPlanBuildRecord | null {
  const build = getMasterPlanBuild(buildId);
  if (!build) return null;
  const sections = listCapstoneSections(build.notebook_id);
  const db = getDatabase();
  const upsert = db.prepare(`
    INSERT INTO foundry_master_plan_sections (id,build_id,section_key,title,content_json,source_revision_count,status)
    VALUES (?,?,?,?,?,?,?)
    ON CONFLICT(build_id,section_key) DO UPDATE SET title=excluded.title,content_json=excluded.content_json,source_revision_count=excluded.source_revision_count,status=excluded.status,updated_at=datetime('now')
  `);
  for (const section of sections.filter((s) => requiredSectionKeys.includes(s.section_key as any))) {
    const revisions = db.prepare(`SELECT COUNT(*) as count FROM foundry_capstone_revisions WHERE notebook_id=? AND section_key=?`).get(build.notebook_id, section.section_key) as { count: number };
    upsert.run(randomUUID(), buildId, section.section_key, section.title, section.content_json, revisions.count, section.status);
  }
  recalculateMasterPlan(buildId);
  return getMasterPlanBuild(buildId);
}

function recalculateMasterPlan(buildId: string): void {
  const db = getDatabase();
  const rows = db.prepare(`SELECT * FROM foundry_master_plan_sections WHERE build_id=?`).all(buildId) as Array<{ section_key:string; content_json:string; status:string }>;
  const populated = rows.filter((row) => {
    const parsed = parseJson(row.content_json);
    return JSON.stringify(parsed) !== "{}" && JSON.stringify(parsed) !== "[]" && JSON.stringify(parsed) !== '""';
  }).length;
  const completeness = requiredSectionKeys.length ? Math.round((populated / requiredSectionKeys.length) * 100) : 0;
  const phases = db.prepare(`SELECT * FROM foundry_master_plan_phases WHERE build_id=? ORDER BY sequence_no`).all(buildId) as Array<{ dependencies_json:string; budget_usd:number }>;
  let validDeps = 0;
  const phaseKeys = new Set((db.prepare(`SELECT phase_key FROM foundry_master_plan_phases WHERE build_id=?`).all(buildId) as Array<{phase_key:string}>).map(p => p.phase_key));
  for (const phase of phases) {
    const deps = parseJson(phase.dependencies_json);
    if (Array.isArray(deps) && deps.every((d) => phaseKeys.has(String(d)))) validDeps += 1;
  }
  const dependencyScore = phases.length ? Math.round((validDeps / phases.length) * 100) : 0;
  const budget = phases.reduce((sum, p) => sum + Number(p.budget_usd || 0), 0);
  const status: MasterPlanBuildStatus = completeness === 100 && phases.length > 0 && dependencyScore === 100 ? "red_team_ready" : "assembling";
  db.prepare(`UPDATE foundry_master_plan_builds SET completeness_score=?,dependency_score=?,budget_total_usd=?,phase_count=?,status=?,updated_at=datetime('now') WHERE id=?`)
    .run(completeness, dependencyScore, budget, phases.length, status, buildId);
}

export function upsertMasterPlanPhase(input: {
  buildId: string;
  phaseKey: string;
  title: string;
  sequenceNo: number;
  dependencies?: string[];
  acceptance?: string[];
  pvs?: number;
  budgetUsd?: number;
  staffing?: unknown[];
}): { ok: boolean; error?: string } {
  const build = getMasterPlanBuild(input.buildId);
  if (!build) return { ok:false, error:"master_plan_not_found" };
  const db = getDatabase();
  db.prepare(`
    INSERT INTO foundry_master_plan_phases (id,build_id,phase_key,title,sequence_no,dependencies_json,acceptance_json,pvs,budget_usd,staffing_json)
    VALUES (?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(build_id,phase_key) DO UPDATE SET title=excluded.title,sequence_no=excluded.sequence_no,dependencies_json=excluded.dependencies_json,acceptance_json=excluded.acceptance_json,pvs=excluded.pvs,budget_usd=excluded.budget_usd,staffing_json=excluded.staffing_json
  `).run(randomUUID(), input.buildId, input.phaseKey, input.title, input.sequenceNo, JSON.stringify(input.dependencies ?? []), JSON.stringify(input.acceptance ?? []), Number(input.pvs ?? 0), Number(input.budgetUsd ?? 0), JSON.stringify(input.staffing ?? []));
  recalculateMasterPlan(input.buildId);
  return { ok:true };
}

export function listMasterPlanPhases(buildId: string): unknown[] {
  return getDatabase().prepare(`SELECT * FROM foundry_master_plan_phases WHERE build_id=? ORDER BY sequence_no`).all(buildId);
}

export function getMasterPlanDashboard(buildId: string) {
  const build = getMasterPlanBuild(buildId);
  if (!build) return null;
  const sections = getDatabase().prepare(`SELECT * FROM foundry_master_plan_sections WHERE build_id=? ORDER BY rowid`).all(buildId);
  const phases = listMasterPlanPhases(buildId);
  const blockers: string[] = [];
  if (build.completeness_score < 100) blockers.push("master_plan_sections_incomplete");
  if (build.phase_count < 1) blockers.push("no_build_phases");
  if (build.dependency_score < 100) blockers.push("phase_dependencies_invalid");
  if (build.budget_total_usd <= 0) blockers.push("build_budget_missing");
  return { build, sections, phases, blockers, redTeamReady: blockers.length === 0 };
}

export function redTeamMasterPlan(input: { buildId:string; reviewerId:string; score:number; findings?:unknown[]; decision:"pass"|"conditional"|"rework"; rationale:string }): { ok:boolean; error?:string } {
  const dashboard = getMasterPlanDashboard(input.buildId);
  if (!dashboard) return { ok:false, error:"master_plan_not_found" };
  if (!dashboard.redTeamReady) return { ok:false, error:`not_red_team_ready:${dashboard.blockers.join(",")}` };
  const score = Math.max(0, Math.min(100, Number(input.score)));
  const db = getDatabase();
  db.transaction(() => {
    db.prepare(`INSERT INTO foundry_master_plan_red_team (id,build_id,reviewer_id,score,findings_json,decision,rationale) VALUES (?,?,?,?,?,?,?)`)
      .run(randomUUID(), input.buildId, input.reviewerId, score, JSON.stringify(input.findings ?? []), input.decision, input.rationale);
    db.prepare(`UPDATE foundry_master_plan_builds SET red_team_score=?,status=?,updated_at=datetime('now') WHERE id=?`)
      .run(score, input.decision === "pass" ? "submitted" : "rework", input.buildId);
  })();
  return { ok:true };
}

export function exportMasterPlan(buildId: string) {
  const dashboard = getMasterPlanDashboard(buildId);
  if (!dashboard) return null;
  return {
    schemaVersion: "1.0",
    generatedAt: new Date().toISOString(),
    financialExecutionEnabled: false,
    ...dashboard,
  };
}
