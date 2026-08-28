import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import { getFoundryProposal } from "./persistence.js";

export type BuilderLevel = "L0" | "L1" | "L2" | "L3" | "L4" | "L5";
export type BuilderStatus = "candidate" | "apprentice" | "active" | "proof_period" | "alumni";

export function migrateFoundryEffectTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS foundry_builders (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      level TEXT NOT NULL,
      status TEXT NOT NULL,
      phase_value_points REAL NOT NULL DEFAULT 0,
      accepted_phases INTEGER NOT NULL DEFAULT 0,
      cohort_id TEXT,
      source_proposal_id TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS foundry_capability_events (
      id TEXT PRIMARY KEY,
      builder_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      phase_id TEXT,
      pvp_delta REAL NOT NULL DEFAULT 0,
      level_after TEXT,
      notes TEXT,
      source_proposal_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (builder_id) REFERENCES foundry_builders(id)
    );

    CREATE TABLE IF NOT EXISTS foundry_cohorts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      starts_on TEXT,
      ends_on TEXT,
      capacity INTEGER,
      training_product_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS foundry_master_plan_records (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      title TEXT NOT NULL,
      purpose TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'accepted',
      budget_usd REAL NOT NULL DEFAULT 0,
      capstone_eligible INTEGER NOT NULL DEFAULT 0,
      source_proposal_id TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS foundry_effect_applications (
      id TEXT PRIMARY KEY,
      proposal_id TEXT NOT NULL UNIQUE,
      effect_type TEXT NOT NULL,
      applied_by TEXT NOT NULL,
      result_subject_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_foundry_builders_cohort ON foundry_builders(cohort_id);
    CREATE INDEX IF NOT EXISTS idx_foundry_capability_builder ON foundry_capability_events(builder_id);
  `);
}

function auditEffect(eventType: string, subjectType: string, subjectId: string, actorId: string, details: unknown): void {
  getDatabase().prepare(`INSERT INTO foundry_audit_log (event_type, subject_type, subject_id, actor_id, details_json) VALUES (?, ?, ?, ?, ?)`)
    .run(eventType, subjectType, subjectId, actorId, JSON.stringify(details));
}

function parsePayload(payloadJson: string): Record<string, unknown> {
  try { return JSON.parse(payloadJson) as Record<string, unknown>; } catch { return {}; }
}

export function applyAcceptedProposalEffect(proposalId: string, actorId: string): { ok: boolean; effectType?: string; subjectId?: string; error?: string } {
  const proposal = getFoundryProposal(proposalId);
  if (!proposal) return { ok: false, error: "proposal_not_found" };
  if (proposal.status !== "accepted") return { ok: false, error: "proposal_not_accepted" };
  const db = getDatabase();
  const exists = db.prepare(`SELECT 1 FROM foundry_effect_applications WHERE proposal_id=?`).get(proposalId);
  if (exists) return { ok: false, error: "effect_already_applied" };
  const payload = parsePayload(proposal.payload_json);

  let effectType = "none";
  let subjectId: string | undefined;

  const tx = db.transaction(() => {
    if (proposal.kind === "builder_application") {
      effectType = "builder_admission";
      const id = String(payload.builderId ?? proposal.subject_id ?? randomUUID());
      const displayName = String(payload.displayName ?? proposal.title).trim();
      const cohortId = payload.cohortId ? String(payload.cohortId) : null;
      db.prepare(`INSERT INTO foundry_builders (id, display_name, level, status, cohort_id, source_proposal_id) VALUES (?, ?, 'L0', 'apprentice', ?, ?)`)
        .run(id, displayName, cohortId, proposalId);
      subjectId = id;
      auditEffect("builder_admitted", "builder", id, actorId, { proposalId, cohortId });
    } else if (proposal.kind === "master_plan_proposal") {
      effectType = "master_plan_admission";
      const id = String(payload.masterPlanId ?? proposal.subject_id ?? randomUUID());
      db.prepare(`INSERT INTO foundry_master_plan_records (id, product_id, title, purpose, status, budget_usd, capstone_eligible, source_proposal_id) VALUES (?, ?, ?, ?, 'accepted', ?, ?, ?)`)
        .run(
          id,
          payload.productId ? String(payload.productId) : null,
          String(payload.title ?? proposal.title),
          String(payload.purpose ?? proposal.summary),
          Number(payload.budgetUsd ?? 0),
          payload.capstoneEligible ? 1 : 0,
          proposalId,
        );
      subjectId = id;
      auditEffect("master_plan_admitted", "master_plan", id, actorId, { proposalId });
    } else if (proposal.kind === "phase_submission") {
      effectType = "capability_credit";
      const builderId = String(payload.builderId ?? proposal.submitted_by);
      const builder = db.prepare(`SELECT id FROM foundry_builders WHERE id=?`).get(builderId);
      if (!builder) throw new Error("builder_not_found");
      const phaseId = String(payload.phaseId ?? proposal.subject_id ?? "unknown-phase");
      const pvp = Number(payload.pvp ?? 0);
      const eventId = randomUUID();
      db.prepare(`INSERT INTO foundry_capability_events (id, builder_id, event_type, phase_id, pvp_delta, notes, source_proposal_id) VALUES (?, ?, 'phase_accepted', ?, ?, ?, ?)`)
        .run(eventId, builderId, phaseId, pvp, proposal.summary, proposalId);
      db.prepare(`UPDATE foundry_builders SET phase_value_points=phase_value_points+?, accepted_phases=accepted_phases+1, updated_at=datetime('now') WHERE id=?`)
        .run(pvp, builderId);
      subjectId = builderId;
      auditEffect("capability_credit_applied", "builder", builderId, actorId, { proposalId, phaseId, pvp });
    } else {
      throw new Error("proposal_kind_has_no_effect");
    }

    db.prepare(`INSERT INTO foundry_effect_applications (id, proposal_id, effect_type, applied_by, result_subject_id) VALUES (?, ?, ?, ?, ?)`)
      .run(randomUUID(), proposalId, effectType, actorId, subjectId ?? null);
  });

  try { tx(); } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "effect_failed" }; }
  return { ok: true, effectType, subjectId };
}

export function listFoundryBuilders(): unknown[] {
  return getDatabase().prepare(`SELECT * FROM foundry_builders ORDER BY created_at DESC`).all();
}

export function listFoundryCapabilityEvents(builderId?: string): unknown[] {
  return builderId
    ? getDatabase().prepare(`SELECT * FROM foundry_capability_events WHERE builder_id=? ORDER BY created_at DESC`).all(builderId)
    : getDatabase().prepare(`SELECT * FROM foundry_capability_events ORDER BY created_at DESC`).all();
}

export function listFoundryCohorts(): unknown[] {
  return getDatabase().prepare(`SELECT * FROM foundry_cohorts ORDER BY created_at DESC`).all();
}

export function listFoundryMasterPlanRecords(): unknown[] {
  return getDatabase().prepare(`SELECT * FROM foundry_master_plan_records ORDER BY created_at DESC`).all();
}
