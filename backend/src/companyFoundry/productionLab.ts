import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import { phases } from "./companyFoundryRegistry.js";

export type ProductionAssignmentStatus = "assigned" | "in_progress" | "submitted" | "rework" | "accepted" | "blocked";
export type ProductionReviewDecision = "accepted" | "rework" | "rejected";

const levelRank: Record<string, number> = { L0: 0, L1: 1, L2: 2, L3: 3, L4: 4, L5: 5 };
const maxBandByLevel: Record<string, number> = { L0: 0, L1: 1, L2: 2, L3: 4, L4: 5, L5: 5 };

export function migrateProductionLabTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS foundry_production_assignments (
      id TEXT PRIMARY KEY,
      phase_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      master_plan_id TEXT,
      builder_id TEXT NOT NULL,
      assigned_by TEXT NOT NULL,
      phase_band INTEGER NOT NULL,
      pvs REAL NOT NULL,
      contribution_share REAL NOT NULL DEFAULT 1,
      budget_attribution_usd REAL NOT NULL DEFAULT 0,
      compensation_note TEXT,
      status TEXT NOT NULL DEFAULT 'assigned',
      packet_json TEXT NOT NULL,
      assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
      started_at TEXT,
      submitted_at TEXT,
      accepted_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(phase_id, builder_id)
    );

    CREATE TABLE IF NOT EXISTS foundry_production_submissions (
      id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      submitted_by TEXT NOT NULL,
      summary TEXT NOT NULL,
      evidence_json TEXT NOT NULL,
      validation_json TEXT NOT NULL,
      known_limits_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'submitted',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (assignment_id) REFERENCES foundry_production_assignments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_production_reviews (
      id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      submission_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      decision TEXT NOT NULL,
      quality_multiplier REAL NOT NULL DEFAULT 1,
      rationale TEXT NOT NULL,
      pvp_awarded REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (assignment_id) REFERENCES foundry_production_assignments(id) ON DELETE CASCADE,
      FOREIGN KEY (submission_id) REFERENCES foundry_production_submissions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_project_budget_attribution (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      master_plan_id TEXT,
      phase_id TEXT NOT NULL,
      assignment_id TEXT NOT NULL,
      builder_id TEXT NOT NULL,
      attributed_budget_usd REAL NOT NULL,
      attribution_type TEXT NOT NULL DEFAULT 'planned_phase_labor',
      financial_execution_enabled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(assignment_id)
    );

    CREATE INDEX IF NOT EXISTS idx_prod_assignment_builder ON foundry_production_assignments(builder_id);
    CREATE INDEX IF NOT EXISTS idx_prod_assignment_status ON foundry_production_assignments(status);
    CREATE INDEX IF NOT EXISTS idx_prod_submission_assignment ON foundry_production_submissions(assignment_id);
    CREATE INDEX IF NOT EXISTS idx_prod_review_assignment ON foundry_production_reviews(assignment_id);
  `);
}

function audit(eventType: string, subjectId: string, actorId: string, details: unknown): void {
  getDatabase().prepare(`INSERT INTO foundry_audit_log (event_type, subject_type, subject_id, actor_id, details_json) VALUES (?, 'production_assignment', ?, ?, ?)`)
    .run(eventType, subjectId, actorId, JSON.stringify(details));
}

function phaseBandFromClass(phaseClass: string): number {
  const match = /^P([0-5])/.exec(phaseClass.trim());
  return match ? Number(match[1]) : 0;
}

function getBuilder(builderId: string): any | null {
  return getDatabase().prepare(`SELECT * FROM foundry_builders WHERE id=?`).get(builderId) as any ?? null;
}

function getAssignment(id: string): any | null {
  return getDatabase().prepare(`SELECT * FROM foundry_production_assignments WHERE id=?`).get(id) as any ?? null;
}

function phaseDefinition(phaseId: string): any | null {
  return phases.find((phase: any) => phase.phaseId === phaseId || phase.id === phaseId) ?? null;
}

export function getEligibleProductionPhases(builderId: string) {
  const builder = getBuilder(builderId);
  if (!builder) return [];
  const maxBand = maxBandByLevel[builder.level] ?? 0;
  return phases.filter((phase: any) => phaseBandFromClass(phase.phaseClass) <= maxBand);
}

export function assignProductionPhase(input: {
  phaseId: string;
  builderId: string;
  assignedBy: string;
  pvs: number;
  contributionShare?: number;
  budgetAttributionUsd?: number;
  compensationNote?: string;
}): { ok: boolean; assignment?: any; error?: string } {
  const builder = getBuilder(input.builderId);
  if (!builder) return { ok: false, error: "builder_not_found" };
  const phase = phaseDefinition(input.phaseId);
  if (!phase) return { ok: false, error: "phase_not_found" };
  const band = phaseBandFromClass(phase.phaseClass);
  const maxBand = maxBandByLevel[builder.level] ?? 0;
  if (band > maxBand) return { ok: false, error: "builder_level_not_eligible" };
  if (!Number.isFinite(input.pvs) || input.pvs < 1) return { ok: false, error: "invalid_pvs" };
  const share = input.contributionShare ?? 1;
  if (!(share > 0 && share <= 1)) return { ok: false, error: "invalid_contribution_share" };
  const budget = Number(input.budgetAttributionUsd ?? phase.budgetUsd ?? phase.budget ?? 0);
  const packet = {
    phaseId: input.phaseId,
    productId: phase.productId,
    masterPlanId: phase.masterPlanId,
    title: phase.title,
    phaseClass: phase.phaseClass,
    acceptanceCriteria: phase.acceptanceCriteria ?? [],
    evidenceRequired: phase.evidenceRequired ?? [],
    instructions: [
      "Inspect the repository and existing implementation before editing.",
      "Stay within the phase boundary; report scope conflicts before expanding work.",
      "Use AI aggressively for assistance but verify the resulting diff and behavior.",
      "Run the validation required by the repository and this phase.",
      "Submit evidence, known limitations, and a concise implementation report."
    ]
  };
  const id = randomUUID();
  try {
    const db = getDatabase();
    db.transaction(() => {
      db.prepare(`INSERT INTO foundry_production_assignments (id,phase_id,product_id,master_plan_id,builder_id,assigned_by,phase_band,pvs,contribution_share,budget_attribution_usd,compensation_note,packet_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
        .run(id, input.phaseId, phase.productId, phase.masterPlanId ?? null, input.builderId, input.assignedBy, band, input.pvs, share, budget, input.compensationNote ?? null, JSON.stringify(packet));
      db.prepare(`INSERT INTO foundry_project_budget_attribution (id,product_id,master_plan_id,phase_id,assignment_id,builder_id,attributed_budget_usd,financial_execution_enabled) VALUES (?,?,?,?,?,?,?,0)`)
        .run(randomUUID(), phase.productId, phase.masterPlanId ?? null, input.phaseId, id, input.builderId, budget);
      audit("production_phase_assigned", id, input.assignedBy, { builderId: input.builderId, phaseId: input.phaseId, band, pvs: input.pvs, budget });
    })();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "assignment_failed" };
  }
  return { ok: true, assignment: getAssignment(id) };
}

export function startProductionAssignment(assignmentId: string, builderId: string): { ok: boolean; assignment?: any; error?: string } {
  const assignment = getAssignment(assignmentId);
  if (!assignment) return { ok: false, error: "assignment_not_found" };
  if (assignment.builder_id !== builderId) return { ok: false, error: "not_assigned_builder" };
  if (!["assigned", "rework", "in_progress"].includes(assignment.status)) return { ok: false, error: "assignment_not_startable" };
  getDatabase().prepare(`UPDATE foundry_production_assignments SET status='in_progress', started_at=COALESCE(started_at, datetime('now')), updated_at=datetime('now') WHERE id=?`).run(assignmentId);
  audit("production_phase_started", assignmentId, builderId, {});
  return { ok: true, assignment: getAssignment(assignmentId) };
}

export function submitProductionWork(input: {
  assignmentId: string;
  builderId: string;
  summary: string;
  evidence: unknown[];
  validation: unknown[];
  knownLimits?: unknown[];
}): { ok: boolean; submission?: any; error?: string } {
  const assignment = getAssignment(input.assignmentId);
  if (!assignment) return { ok: false, error: "assignment_not_found" };
  if (assignment.builder_id !== input.builderId) return { ok: false, error: "not_assigned_builder" };
  if (!["in_progress", "rework"].includes(assignment.status)) return { ok: false, error: "assignment_not_submittable" };
  if (!input.summary.trim() || input.evidence.length === 0 || input.validation.length === 0) return { ok: false, error: "submission_evidence_required" };
  const id = randomUUID();
  const db = getDatabase();
  db.transaction(() => {
    db.prepare(`INSERT INTO foundry_production_submissions (id,assignment_id,submitted_by,summary,evidence_json,validation_json,known_limits_json) VALUES (?,?,?,?,?,?,?)`)
      .run(id, input.assignmentId, input.builderId, input.summary.trim(), JSON.stringify(input.evidence), JSON.stringify(input.validation), JSON.stringify(input.knownLimits ?? []));
    db.prepare(`UPDATE foundry_production_assignments SET status='submitted', submitted_at=datetime('now'), updated_at=datetime('now') WHERE id=?`).run(input.assignmentId);
    audit("production_phase_submitted", input.assignmentId, input.builderId, { submissionId: id });
  })();
  return { ok: true, submission: db.prepare(`SELECT * FROM foundry_production_submissions WHERE id=?`).get(id) };
}

export function reviewProductionWork(input: {
  assignmentId: string;
  submissionId: string;
  reviewerId: string;
  decision: ProductionReviewDecision;
  rationale: string;
  qualityMultiplier?: number;
}): { ok: boolean; review?: any; pvpAwarded?: number; error?: string } {
  const assignment = getAssignment(input.assignmentId);
  if (!assignment) return { ok: false, error: "assignment_not_found" };
  if (assignment.builder_id === input.reviewerId) return { ok: false, error: "self_acceptance_forbidden" };
  if (assignment.status !== "submitted") return { ok: false, error: "assignment_not_reviewable" };
  const submission = getDatabase().prepare(`SELECT * FROM foundry_production_submissions WHERE id=? AND assignment_id=?`).get(input.submissionId, input.assignmentId) as any;
  if (!submission) return { ok: false, error: "submission_not_found" };
  if (!input.rationale.trim()) return { ok: false, error: "review_rationale_required" };
  const multiplier = Math.max(0.75, Math.min(1.25, Number(input.qualityMultiplier ?? 1)));
  const pvp = input.decision === "accepted" ? Number((assignment.pvs * assignment.contribution_share * multiplier).toFixed(2)) : 0;
  const reviewId = randomUUID();
  const db = getDatabase();
  db.transaction(() => {
    db.prepare(`INSERT INTO foundry_production_reviews (id,assignment_id,submission_id,reviewer_id,decision,quality_multiplier,rationale,pvp_awarded) VALUES (?,?,?,?,?,?,?,?)`)
      .run(reviewId, input.assignmentId, input.submissionId, input.reviewerId, input.decision, multiplier, input.rationale.trim(), pvp);
    if (input.decision === "accepted") {
      db.prepare(`UPDATE foundry_production_assignments SET status='accepted', accepted_at=datetime('now'), updated_at=datetime('now') WHERE id=?`).run(input.assignmentId);
      db.prepare(`INSERT INTO foundry_capability_events (id,builder_id,event_type,phase_id,pvp_delta,notes) VALUES (?,?,'production_lab_phase_accepted',?,?,?)`)
        .run(randomUUID(), assignment.builder_id, assignment.phase_id, pvp, input.rationale.trim());
      db.prepare(`UPDATE foundry_builders SET phase_value_points=phase_value_points+?, accepted_phases=accepted_phases+1, updated_at=datetime('now') WHERE id=?`)
        .run(pvp, assignment.builder_id);
    } else if (input.decision === "rework") {
      db.prepare(`UPDATE foundry_production_assignments SET status='rework', updated_at=datetime('now') WHERE id=?`).run(input.assignmentId);
    } else {
      db.prepare(`UPDATE foundry_production_assignments SET status='blocked', updated_at=datetime('now') WHERE id=?`).run(input.assignmentId);
    }
    audit("production_phase_reviewed", input.assignmentId, input.reviewerId, { submissionId: input.submissionId, decision: input.decision, qualityMultiplier: multiplier, pvp });
  })();
  return { ok: true, review: db.prepare(`SELECT * FROM foundry_production_reviews WHERE id=?`).get(reviewId), pvpAwarded: pvp };
}

export function listProductionAssignments(builderId?: string) {
  return builderId
    ? getDatabase().prepare(`SELECT * FROM foundry_production_assignments WHERE builder_id=? ORDER BY assigned_at DESC`).all(builderId)
    : getDatabase().prepare(`SELECT * FROM foundry_production_assignments ORDER BY assigned_at DESC`).all();
}

export function getProductionAssignmentDetail(assignmentId: string) {
  const assignment = getAssignment(assignmentId);
  if (!assignment) return null;
  return {
    assignment,
    packet: JSON.parse(assignment.packet_json),
    submissions: getDatabase().prepare(`SELECT * FROM foundry_production_submissions WHERE assignment_id=? ORDER BY created_at`).all(assignmentId),
    reviews: getDatabase().prepare(`SELECT * FROM foundry_production_reviews WHERE assignment_id=? ORDER BY created_at`).all(assignmentId),
    budgetAttribution: getDatabase().prepare(`SELECT * FROM foundry_project_budget_attribution WHERE assignment_id=?`).get(assignmentId) ?? null,
  };
}

export function getProductionLabMetrics() {
  const db = getDatabase();
  const assignments = db.prepare(`SELECT COUNT(*) AS count FROM foundry_production_assignments`).get() as any;
  const accepted = db.prepare(`SELECT COUNT(*) AS count FROM foundry_production_assignments WHERE status='accepted'`).get() as any;
  const rework = db.prepare(`SELECT COUNT(*) AS count FROM foundry_production_assignments WHERE status='rework'`).get() as any;
  const budget = db.prepare(`SELECT COALESCE(SUM(attributed_budget_usd),0) AS total FROM foundry_project_budget_attribution`).get() as any;
  const pvp = db.prepare(`SELECT COALESCE(SUM(pvp_awarded),0) AS total FROM foundry_production_reviews WHERE decision='accepted'`).get() as any;
  return {
    assignments: assignments.count,
    accepted: accepted.count,
    rework: rework.count,
    plannedBudgetAttributionUsd: budget.total,
    pvpAwarded: pvp.total,
    financialExecutionEnabled: false,
  };
}
