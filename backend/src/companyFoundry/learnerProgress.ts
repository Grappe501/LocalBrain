import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import { academyModules, academyStages } from "./academyCurriculum.js";

export type AcademyEnrollmentStatus = "active" | "paused" | "remediation" | "graduation_ready" | "graduated" | "exited";
export type ModuleProgressStatus = "locked" | "available" | "in_progress" | "submitted" | "complete" | "remediation";
export type GateStatus = "not_ready" | "ready" | "passed" | "remediation";

export type AcademyEnrollment = {
  id: string;
  builder_id: string;
  cohort_id: string | null;
  status: AcademyEnrollmentStatus;
  current_stage_id: string;
  current_module_id: string;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
};

export type AcademyModuleProgress = {
  id: string;
  enrollment_id: string;
  module_id: string;
  status: ModuleProgressStatus;
  attempts: number;
  best_score: number | null;
  evidence_json: string;
  feedback_json: string;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
};

export type AcademyGateRecord = {
  id: string;
  enrollment_id: string;
  stage_id: string;
  status: GateStatus;
  evaluator_type: "system" | "human";
  evaluator_id: string | null;
  rationale: string | null;
  passed_at: string | null;
  updated_at: string;
};

export function migrateLearnerProgressTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS foundry_academy_enrollments (
      id TEXT PRIMARY KEY,
      builder_id TEXT NOT NULL,
      cohort_id TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      current_stage_id TEXT NOT NULL,
      current_module_id TEXT NOT NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(builder_id)
    );

    CREATE TABLE IF NOT EXISTS foundry_academy_module_progress (
      id TEXT PRIMARY KEY,
      enrollment_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'locked',
      attempts INTEGER NOT NULL DEFAULT 0,
      best_score REAL,
      evidence_json TEXT NOT NULL DEFAULT '[]',
      feedback_json TEXT NOT NULL DEFAULT '[]',
      started_at TEXT,
      completed_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(enrollment_id, module_id),
      FOREIGN KEY (enrollment_id) REFERENCES foundry_academy_enrollments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_academy_stage_gates (
      id TEXT PRIMARY KEY,
      enrollment_id TEXT NOT NULL,
      stage_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'not_ready',
      evaluator_type TEXT NOT NULL DEFAULT 'system',
      evaluator_id TEXT,
      rationale TEXT,
      passed_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(enrollment_id, stage_id),
      FOREIGN KEY (enrollment_id) REFERENCES foundry_academy_enrollments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_academy_attempts (
      id TEXT PRIMARY KEY,
      enrollment_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      attempt_number INTEGER NOT NULL,
      score REAL,
      passed INTEGER NOT NULL DEFAULT 0,
      evidence_json TEXT NOT NULL DEFAULT '[]',
      feedback_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (enrollment_id) REFERENCES foundry_academy_enrollments(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_academy_enrollment_builder ON foundry_academy_enrollments(builder_id);
    CREATE INDEX IF NOT EXISTS idx_academy_progress_enrollment ON foundry_academy_module_progress(enrollment_id);
    CREATE INDEX IF NOT EXISTS idx_academy_attempts_enrollment ON foundry_academy_attempts(enrollment_id);
  `);
}

function firstModuleId(): string {
  return academyStages[0]?.moduleIds[0] ?? "0.1";
}

function stageForModule(moduleId: string) {
  const module = academyModules.find((item) => item.id === moduleId);
  return module ? academyStages.find((stage) => stage.id === module.stageId) ?? null : null;
}

function seedProgress(enrollmentId: string): void {
  const db = getDatabase();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO foundry_academy_module_progress
      (id, enrollment_id, module_id, status)
    VALUES (?, ?, ?, ?)
  `);
  for (const module of academyModules) {
    insert.run(randomUUID(), enrollmentId, module.id, module.id === firstModuleId() ? "available" : "locked");
  }
  const gateInsert = db.prepare(`
    INSERT OR IGNORE INTO foundry_academy_stage_gates
      (id, enrollment_id, stage_id, status, evaluator_type)
    VALUES (?, ?, ?, 'not_ready', 'system')
  `);
  for (const stage of academyStages) gateInsert.run(randomUUID(), enrollmentId, stage.id);
}

export function enrollBuilder(input: { builderId: string; cohortId?: string | null }): AcademyEnrollment {
  const existing = getEnrollmentByBuilder(input.builderId);
  if (existing) return existing;
  const firstStage = academyStages[0];
  const id = randomUUID();
  getDatabase().prepare(`
    INSERT INTO foundry_academy_enrollments
      (id, builder_id, cohort_id, status, current_stage_id, current_module_id)
    VALUES (?, ?, ?, 'active', ?, ?)
  `).run(id, input.builderId, input.cohortId ?? null, firstStage.id, firstModuleId());
  seedProgress(id);
  return getEnrollment(id)!;
}

export function getEnrollment(id: string): AcademyEnrollment | null {
  return (getDatabase().prepare(`SELECT * FROM foundry_academy_enrollments WHERE id=?`).get(id) as AcademyEnrollment | undefined) ?? null;
}

export function getEnrollmentByBuilder(builderId: string): AcademyEnrollment | null {
  return (getDatabase().prepare(`SELECT * FROM foundry_academy_enrollments WHERE builder_id=?`).get(builderId) as AcademyEnrollment | undefined) ?? null;
}

export function listEnrollments(): AcademyEnrollment[] {
  return getDatabase().prepare(`SELECT * FROM foundry_academy_enrollments ORDER BY started_at`).all() as AcademyEnrollment[];
}

export function getModuleProgress(enrollmentId: string): AcademyModuleProgress[] {
  return getDatabase().prepare(`SELECT * FROM foundry_academy_module_progress WHERE enrollment_id=? ORDER BY rowid`).all(enrollmentId) as AcademyModuleProgress[];
}

export function getGateRecords(enrollmentId: string): AcademyGateRecord[] {
  return getDatabase().prepare(`SELECT * FROM foundry_academy_stage_gates WHERE enrollment_id=? ORDER BY rowid`).all(enrollmentId) as AcademyGateRecord[];
}

export function startModule(enrollmentId: string, moduleId: string): AcademyModuleProgress | null {
  const enrollment = getEnrollment(enrollmentId);
  if (!enrollment || enrollment.status !== "active") return null;
  const row = getDatabase().prepare(`SELECT * FROM foundry_academy_module_progress WHERE enrollment_id=? AND module_id=?`).get(enrollmentId, moduleId) as AcademyModuleProgress | undefined;
  if (!row || !["available", "remediation", "in_progress"].includes(row.status)) return null;
  getDatabase().prepare(`UPDATE foundry_academy_module_progress SET status='in_progress', started_at=COALESCE(started_at, datetime('now')), updated_at=datetime('now') WHERE enrollment_id=? AND module_id=?`).run(enrollmentId, moduleId);
  getDatabase().prepare(`UPDATE foundry_academy_enrollments SET current_stage_id=?, current_module_id=?, updated_at=datetime('now') WHERE id=?`).run(stageForModule(moduleId)?.id ?? enrollment.current_stage_id, moduleId, enrollmentId);
  return getDatabase().prepare(`SELECT * FROM foundry_academy_module_progress WHERE enrollment_id=? AND module_id=?`).get(enrollmentId, moduleId) as AcademyModuleProgress;
}

export function submitModuleAttempt(input: {
  enrollmentId: string;
  moduleId: string;
  score?: number;
  passed: boolean;
  evidence?: unknown[];
  feedback?: unknown[];
}): AcademyModuleProgress | null {
  const db = getDatabase();
  const row = db.prepare(`SELECT * FROM foundry_academy_module_progress WHERE enrollment_id=? AND module_id=?`).get(input.enrollmentId, input.moduleId) as AcademyModuleProgress | undefined;
  if (!row || !["in_progress", "submitted", "remediation", "available"].includes(row.status)) return null;
  const attemptNumber = row.attempts + 1;
  const score = Number.isFinite(input.score) ? Number(input.score) : null;
  db.transaction(() => {
    db.prepare(`INSERT INTO foundry_academy_attempts (id,enrollment_id,module_id,attempt_number,score,passed,evidence_json,feedback_json) VALUES (?,?,?,?,?,?,?,?)`).run(
      randomUUID(), input.enrollmentId, input.moduleId, attemptNumber, score, input.passed ? 1 : 0, JSON.stringify(input.evidence ?? []), JSON.stringify(input.feedback ?? []),
    );
    db.prepare(`
      UPDATE foundry_academy_module_progress
      SET status=?, attempts=?, best_score=CASE WHEN ? IS NULL THEN best_score WHEN best_score IS NULL OR ? > best_score THEN ? ELSE best_score END,
          evidence_json=?, feedback_json=?, completed_at=CASE WHEN ?=1 THEN datetime('now') ELSE NULL END, updated_at=datetime('now')
      WHERE enrollment_id=? AND module_id=?
    `).run(input.passed ? "complete" : "remediation", attemptNumber, score, score, score, JSON.stringify(input.evidence ?? []), JSON.stringify(input.feedback ?? []), input.passed ? 1 : 0, input.enrollmentId, input.moduleId);
  })();
  if (input.passed) recalculateProgress(input.enrollmentId);
  else getDatabase().prepare(`UPDATE foundry_academy_enrollments SET status='remediation', updated_at=datetime('now') WHERE id=?`).run(input.enrollmentId);
  return db.prepare(`SELECT * FROM foundry_academy_module_progress WHERE enrollment_id=? AND module_id=?`).get(input.enrollmentId, input.moduleId) as AcademyModuleProgress;
}

function recalculateProgress(enrollmentId: string): void {
  const db = getDatabase();
  const progress = getModuleProgress(enrollmentId);
  const completed = new Set(progress.filter((row) => row.status === "complete").map((row) => row.module_id));

  for (const stage of academyStages) {
    const allStageModulesComplete = stage.moduleIds.every((id) => completed.has(id));
    if (allStageModulesComplete) {
      db.prepare(`UPDATE foundry_academy_stage_gates SET status='ready', updated_at=datetime('now') WHERE enrollment_id=? AND stage_id=? AND status!='passed'`).run(enrollmentId, stage.id);
    }
  }

  const nextModule = academyModules.find((module) => !completed.has(module.id));
  if (nextModule) {
    const row = progress.find((item) => item.module_id === nextModule.id);
    if (row?.status === "locked") db.prepare(`UPDATE foundry_academy_module_progress SET status='available', updated_at=datetime('now') WHERE enrollment_id=? AND module_id=?`).run(enrollmentId, nextModule.id);
    db.prepare(`UPDATE foundry_academy_enrollments SET status='active', current_stage_id=?, current_module_id=?, updated_at=datetime('now') WHERE id=?`).run(nextModule.stageId, nextModule.id, enrollmentId);
  } else {
    db.prepare(`UPDATE foundry_academy_enrollments SET status='graduation_ready', updated_at=datetime('now') WHERE id=?`).run(enrollmentId);
  }
}

export function decideStageGate(input: { enrollmentId: string; stageId: string; evaluatorId: string; passed: boolean; rationale: string }): AcademyGateRecord | null {
  const gate = getDatabase().prepare(`SELECT * FROM foundry_academy_stage_gates WHERE enrollment_id=? AND stage_id=?`).get(input.enrollmentId, input.stageId) as AcademyGateRecord | undefined;
  if (!gate || gate.status === "not_ready") return null;
  const status: GateStatus = input.passed ? "passed" : "remediation";
  getDatabase().prepare(`UPDATE foundry_academy_stage_gates SET status=?, evaluator_type='human', evaluator_id=?, rationale=?, passed_at=CASE WHEN ?=1 THEN datetime('now') ELSE NULL END, updated_at=datetime('now') WHERE enrollment_id=? AND stage_id=?`).run(status, input.evaluatorId, input.rationale, input.passed ? 1 : 0, input.enrollmentId, input.stageId);
  if (!input.passed) getDatabase().prepare(`UPDATE foundry_academy_enrollments SET status='remediation', updated_at=datetime('now') WHERE id=?`).run(input.enrollmentId);
  else recalculateProgress(input.enrollmentId);
  return getDatabase().prepare(`SELECT * FROM foundry_academy_stage_gates WHERE enrollment_id=? AND stage_id=?`).get(input.enrollmentId, input.stageId) as AcademyGateRecord;
}

export function getLearnerDashboard(enrollmentId: string) {
  const enrollment = getEnrollment(enrollmentId);
  if (!enrollment) return null;
  const progress = getModuleProgress(enrollmentId);
  const gates = getGateRecords(enrollmentId);
  const completeCount = progress.filter((item) => item.status === "complete").length;
  const remediationCount = progress.filter((item) => item.status === "remediation").length;
  const currentModule = academyModules.find((item) => item.id === enrollment.current_module_id) ?? null;
  const currentStage = academyStages.find((item) => item.id === enrollment.current_stage_id) ?? null;
  return {
    enrollment,
    currentStage,
    currentModule,
    progress,
    gates,
    metrics: {
      modulesTotal: academyModules.length,
      modulesComplete: completeCount,
      percentComplete: academyModules.length ? Math.round((completeCount / academyModules.length) * 100) : 0,
      remediationModules: remediationCount,
      stagesPassed: gates.filter((gate) => gate.status === "passed").length,
      stagesTotal: academyStages.length,
      capstoneRequiredForGraduation: true,
    },
  };
}
