import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import { academyStages } from "./academyCurriculum.js";

export type CapstoneNotebookStatus = "active" | "submitted" | "graduation_ready" | "pilot_selected" | "phase_track" | "archived";
export type CapstoneSectionStatus = "empty" | "draft" | "checkpoint_ready" | "reviewed";

export type CapstoneNotebook = {
  id: string;
  enrollment_id: string;
  builder_id: string;
  title: string;
  working_thesis: string;
  status: CapstoneNotebookStatus;
  created_at: string;
  updated_at: string;
};

export type CapstoneSection = {
  id: string;
  notebook_id: string;
  section_key: string;
  section_order: number;
  title: string;
  stage_id: string;
  status: CapstoneSectionStatus;
  content_json: string;
  updated_at: string;
};

const sectionBlueprint = [
  ["problem_inventory", 1, "Problem Inventory", "stage_0"],
  ["problem_statements", 2, "Top Problem Statements", "stage_1"],
  ["provisional_product", 3, "Provisional Product + Technical Layers", "stage_2"],
  ["hosting_security_data", 4, "Hosting, Security, Secrets + Data Map", "stage_3"],
  ["customer_problem", 5, "Customer + Painful Job", "stage_4"],
  ["product_promise", 6, "Product Promise", "stage_4"],
  ["v1_scope", 7, "V1 Scope + Non-Goals", "stage_4"],
  ["user_journeys", 8, "User Journeys", "stage_4"],
  ["architecture", 9, "Product Architecture", "stage_4"],
  ["foundry_reuse", 10, "Foundry Reuse + Build/Buy/Integrate", "stage_5"],
  ["phase_plan", 11, "Build Phases + Dependencies", "stage_5"],
  ["acceptance", 12, "Acceptance Criteria + Evidence", "stage_5"],
  ["market", 13, "Market + Competitors", "stage_6"],
  ["advantages", 14, "Advantages + Disadvantages", "stage_6"],
  ["pricing", 15, "Pricing + Route to First Revenue", "stage_6"],
  ["revenue_model", 16, "Conservative Revenue Model", "stage_6"],
  ["budget", 17, "Build Budget + Staffing", "stage_6"],
  ["risk", 18, "Risk Register", "stage_6"],
  ["kill_criteria", 19, "Kill Criteria", "stage_6"],
  ["pilot_economics", 20, "Pilot Funding + Recovery Model", "stage_6"],
  ["residual_proposal", 21, "Post-Recovery Residual Proposal", "stage_6"],
  ["master_plan", 22, "Master Build Plan", "stage_6"],
  ["application", 23, "Capstone Application", "stage_7"],
  ["defense", 24, "Capstone Defense Notes", "stage_7"]
] as const;

export function migrateCapstoneNotebookTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS foundry_capstone_notebooks (
      id TEXT PRIMARY KEY,
      enrollment_id TEXT NOT NULL UNIQUE,
      builder_id TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT 'Untitled Capstone',
      working_thesis TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS foundry_capstone_sections (
      id TEXT PRIMARY KEY,
      notebook_id TEXT NOT NULL,
      section_key TEXT NOT NULL,
      section_order INTEGER NOT NULL,
      title TEXT NOT NULL,
      stage_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'empty',
      content_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(notebook_id, section_key),
      FOREIGN KEY (notebook_id) REFERENCES foundry_capstone_notebooks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_capstone_revisions (
      id TEXT PRIMARY KEY,
      notebook_id TEXT NOT NULL,
      section_key TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      previous_content_json TEXT NOT NULL,
      next_content_json TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (notebook_id) REFERENCES foundry_capstone_notebooks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_capstone_checkpoint_reviews (
      id TEXT PRIMARY KEY,
      notebook_id TEXT NOT NULL,
      stage_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      decision TEXT NOT NULL,
      rationale TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (notebook_id) REFERENCES foundry_capstone_notebooks(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_capstone_sections_notebook ON foundry_capstone_sections(notebook_id, section_order);
    CREATE INDEX IF NOT EXISTS idx_capstone_revisions_notebook ON foundry_capstone_revisions(notebook_id, created_at);
  `);
}

function seedSections(notebookId: string): void {
  const insert = getDatabase().prepare(`
    INSERT OR IGNORE INTO foundry_capstone_sections
      (id, notebook_id, section_key, section_order, title, stage_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const [key, order, title, stageId] of sectionBlueprint) {
    insert.run(randomUUID(), notebookId, key, order, title, stageId);
  }
}

export function ensureCapstoneNotebook(input: { enrollmentId: string; builderId: string }): CapstoneNotebook {
  const db = getDatabase();
  const existing = db.prepare(`SELECT * FROM foundry_capstone_notebooks WHERE enrollment_id=?`).get(input.enrollmentId) as CapstoneNotebook | undefined;
  if (existing) return existing;
  const id = randomUUID();
  db.prepare(`INSERT INTO foundry_capstone_notebooks (id,enrollment_id,builder_id) VALUES (?,?,?)`).run(id, input.enrollmentId, input.builderId);
  seedSections(id);
  return getCapstoneNotebook(id)!;
}

export function getCapstoneNotebook(notebookId: string): CapstoneNotebook | null {
  return (getDatabase().prepare(`SELECT * FROM foundry_capstone_notebooks WHERE id=?`).get(notebookId) as CapstoneNotebook | undefined) ?? null;
}

export function getCapstoneNotebookByEnrollment(enrollmentId: string): CapstoneNotebook | null {
  return (getDatabase().prepare(`SELECT * FROM foundry_capstone_notebooks WHERE enrollment_id=?`).get(enrollmentId) as CapstoneNotebook | undefined) ?? null;
}

export function listCapstoneSections(notebookId: string): CapstoneSection[] {
  return getDatabase().prepare(`SELECT * FROM foundry_capstone_sections WHERE notebook_id=? ORDER BY section_order`).all(notebookId) as CapstoneSection[];
}

export function updateCapstoneIdentity(input: { notebookId: string; actorId: string; title?: string; workingThesis?: string }): CapstoneNotebook | null {
  const notebook = getCapstoneNotebook(input.notebookId);
  if (!notebook) return null;
  getDatabase().prepare(`UPDATE foundry_capstone_notebooks SET title=?, working_thesis=?, updated_at=datetime('now') WHERE id=?`).run(
    input.title ?? notebook.title,
    input.workingThesis ?? notebook.working_thesis,
    notebook.id,
  );
  return getCapstoneNotebook(notebook.id);
}

export function updateCapstoneSection(input: { notebookId: string; sectionKey: string; actorId: string; content: unknown; note?: string }): CapstoneSection | null {
  const db = getDatabase();
  const section = db.prepare(`SELECT * FROM foundry_capstone_sections WHERE notebook_id=? AND section_key=?`).get(input.notebookId, input.sectionKey) as CapstoneSection | undefined;
  if (!section) return null;
  const nextContent = JSON.stringify(input.content ?? {});
  db.transaction(() => {
    db.prepare(`INSERT INTO foundry_capstone_revisions (id,notebook_id,section_key,actor_id,previous_content_json,next_content_json,note) VALUES (?,?,?,?,?,?,?)`).run(
      randomUUID(), input.notebookId, input.sectionKey, input.actorId, section.content_json, nextContent, input.note ?? null,
    );
    db.prepare(`UPDATE foundry_capstone_sections SET content_json=?, status='draft', updated_at=datetime('now') WHERE notebook_id=? AND section_key=?`).run(nextContent, input.notebookId, input.sectionKey);
    db.prepare(`UPDATE foundry_capstone_notebooks SET updated_at=datetime('now') WHERE id=?`).run(input.notebookId);
  })();
  return db.prepare(`SELECT * FROM foundry_capstone_sections WHERE notebook_id=? AND section_key=?`).get(input.notebookId, input.sectionKey) as CapstoneSection;
}

export function markStageCheckpointReady(input: { notebookId: string; stageId: string; actorId: string }): { ok: boolean; reason?: string } {
  const stage = academyStages.find((item) => item.id === input.stageId);
  if (!stage) return { ok: false, reason: "stage_not_found" };
  const sections = listCapstoneSections(input.notebookId).filter((section) => section.stage_id === input.stageId);
  if (!sections.length) return { ok: false, reason: "no_stage_sections" };
  const incomplete = sections.filter((section) => section.status === "empty");
  if (incomplete.length) return { ok: false, reason: `sections_empty:${incomplete.map((item) => item.section_key).join(",")}` };
  getDatabase().prepare(`UPDATE foundry_capstone_sections SET status='checkpoint_ready', updated_at=datetime('now') WHERE notebook_id=? AND stage_id=?`).run(input.notebookId, input.stageId);
  return { ok: true };
}

export function reviewStageCheckpoint(input: { notebookId: string; stageId: string; reviewerId: string; decision: "accepted" | "rework"; rationale: string }): { ok: boolean; reason?: string } {
  const sections = listCapstoneSections(input.notebookId).filter((section) => section.stage_id === input.stageId);
  if (!sections.length) return { ok: false, reason: "no_stage_sections" };
  if (sections.some((section) => section.status !== "checkpoint_ready" && section.status !== "reviewed")) return { ok: false, reason: "checkpoint_not_ready" };
  const db = getDatabase();
  db.transaction(() => {
    db.prepare(`INSERT INTO foundry_capstone_checkpoint_reviews (id,notebook_id,stage_id,reviewer_id,decision,rationale) VALUES (?,?,?,?,?,?)`).run(randomUUID(), input.notebookId, input.stageId, input.reviewerId, input.decision, input.rationale);
    db.prepare(`UPDATE foundry_capstone_sections SET status=?, updated_at=datetime('now') WHERE notebook_id=? AND stage_id=?`).run(input.decision === "accepted" ? "reviewed" : "draft", input.notebookId, input.stageId);
  })();
  return { ok: true };
}

export function getCapstoneNotebookDashboard(notebookId: string) {
  const notebook = getCapstoneNotebook(notebookId);
  if (!notebook) return null;
  const sections = listCapstoneSections(notebookId);
  const completed = sections.filter((section) => section.status === "reviewed").length;
  const drafted = sections.filter((section) => section.status !== "empty").length;
  const stageSummary = academyStages.map((stage) => {
    const stageSections = sections.filter((section) => section.stage_id === stage.id);
    return {
      stageId: stage.id,
      title: stage.title,
      checkpoint: stage.capstoneCheckpoint,
      sections: stageSections.length,
      drafted: stageSections.filter((section) => section.status !== "empty").length,
      reviewed: stageSections.filter((section) => section.status === "reviewed").length,
      checkpointReady: stageSections.length > 0 && stageSections.every((section) => ["checkpoint_ready", "reviewed"].includes(section.status)),
    };
  });
  return {
    notebook,
    sections,
    metrics: {
      sectionsTotal: sections.length,
      sectionsDrafted: drafted,
      sectionsReviewed: completed,
      percentDrafted: sections.length ? Math.round((drafted / sections.length) * 100) : 0,
      percentReviewed: sections.length ? Math.round((completed / sections.length) * 100) : 0,
      masterPlanDrafted: sections.find((section) => section.section_key === "master_plan")?.status !== "empty",
      applicationDrafted: sections.find((section) => section.section_key === "application")?.status !== "empty",
    },
    stageSummary,
  };
}

export function listCapstoneRevisions(notebookId: string, limit = 100): unknown[] {
  return getDatabase().prepare(`SELECT * FROM foundry_capstone_revisions WHERE notebook_id=? ORDER BY created_at DESC LIMIT ?`).all(notebookId, Math.max(1, Math.min(limit, 500)));
}
