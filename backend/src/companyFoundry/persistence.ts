import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";

export type FoundryProposalKind = "product_change" | "builder_application" | "phase_submission" | "capstone_application" | "registry_change";
export type FoundryProposalStatus = "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "withdrawn";

export type FoundryProposalRecord = {
  id: string;
  kind: FoundryProposalKind;
  subject_id: string | null;
  submitted_by: string;
  title: string;
  summary: string;
  payload_json: string;
  status: FoundryProposalStatus;
  created_at: string;
  updated_at: string;
};

export type FoundryEvidenceRecord = {
  id: string;
  proposal_id: string;
  evidence_type: string;
  label: string;
  uri: string | null;
  content_hash: string | null;
  notes: string | null;
  created_at: string;
};

export type FoundryAcceptanceRecord = {
  id: string;
  proposal_id: string;
  reviewer_id: string;
  decision: "accepted" | "rejected" | "rework";
  rationale: string;
  created_at: string;
};

export function migrateCompanyFoundryTables(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS foundry_proposals (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      subject_id TEXT,
      submitted_by TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS foundry_evidence (
      id TEXT PRIMARY KEY,
      proposal_id TEXT NOT NULL,
      evidence_type TEXT NOT NULL,
      label TEXT NOT NULL,
      uri TEXT,
      content_hash TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (proposal_id) REFERENCES foundry_proposals(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_acceptance_reviews (
      id TEXT PRIMARY KEY,
      proposal_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      decision TEXT NOT NULL,
      rationale TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (proposal_id) REFERENCES foundry_proposals(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foundry_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      subject_type TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      details_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_foundry_proposals_status ON foundry_proposals(status);
    CREATE INDEX IF NOT EXISTS idx_foundry_proposals_kind ON foundry_proposals(kind);
    CREATE INDEX IF NOT EXISTS idx_foundry_evidence_proposal ON foundry_evidence(proposal_id);
    CREATE INDEX IF NOT EXISTS idx_foundry_reviews_proposal ON foundry_acceptance_reviews(proposal_id);
  `);
}

function audit(eventType: string, subjectType: string, subjectId: string, actorId: string, details: unknown): void {
  getDatabase().prepare(`
    INSERT INTO foundry_audit_log (event_type, subject_type, subject_id, actor_id, details_json)
    VALUES (?, ?, ?, ?, ?)
  `).run(eventType, subjectType, subjectId, actorId, JSON.stringify(details));
}

export function createFoundryProposal(input: {
  kind: FoundryProposalKind;
  subjectId?: string;
  submittedBy: string;
  title: string;
  summary: string;
  payload?: unknown;
}): FoundryProposalRecord {
  const id = randomUUID();
  const payload = JSON.stringify(input.payload ?? {});
  getDatabase().prepare(`
    INSERT INTO foundry_proposals (id, kind, subject_id, submitted_by, title, summary, payload_json, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')
  `).run(id, input.kind, input.subjectId ?? null, input.submittedBy, input.title, input.summary, payload);
  audit("proposal_created", "proposal", id, input.submittedBy, { kind: input.kind, subjectId: input.subjectId ?? null });
  return getFoundryProposal(id)!;
}

export function submitFoundryProposal(id: string, actorId: string): FoundryProposalRecord | null {
  const proposal = getFoundryProposal(id);
  if (!proposal || proposal.status !== "draft") return null;
  getDatabase().prepare(`UPDATE foundry_proposals SET status='submitted', updated_at=datetime('now') WHERE id=?`).run(id);
  audit("proposal_submitted", "proposal", id, actorId, {});
  return getFoundryProposal(id);
}

export function addFoundryEvidence(input: {
  proposalId: string;
  actorId: string;
  evidenceType: string;
  label: string;
  uri?: string;
  contentHash?: string;
  notes?: string;
}): FoundryEvidenceRecord | null {
  if (!getFoundryProposal(input.proposalId)) return null;
  const id = randomUUID();
  getDatabase().prepare(`
    INSERT INTO foundry_evidence (id, proposal_id, evidence_type, label, uri, content_hash, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, input.proposalId, input.evidenceType, input.label, input.uri ?? null, input.contentHash ?? null, input.notes ?? null);
  audit("evidence_added", "proposal", input.proposalId, input.actorId, { evidenceId: id, evidenceType: input.evidenceType });
  return getDatabase().prepare(`SELECT * FROM foundry_evidence WHERE id=?`).get(id) as FoundryEvidenceRecord;
}

export function reviewFoundryProposal(input: {
  proposalId: string;
  reviewerId: string;
  decision: "accepted" | "rejected" | "rework";
  rationale: string;
}): FoundryAcceptanceRecord | null {
  const proposal = getFoundryProposal(input.proposalId);
  if (!proposal || !["submitted", "under_review"].includes(proposal.status)) return null;
  if (proposal.submitted_by === input.reviewerId) return null;

  const id = randomUUID();
  const nextStatus: FoundryProposalStatus = input.decision === "accepted" ? "accepted" : input.decision === "rejected" ? "rejected" : "under_review";
  const db = getDatabase();
  const tx = db.transaction(() => {
    db.prepare(`INSERT INTO foundry_acceptance_reviews (id, proposal_id, reviewer_id, decision, rationale) VALUES (?, ?, ?, ?, ?)`)
      .run(id, input.proposalId, input.reviewerId, input.decision, input.rationale);
    db.prepare(`UPDATE foundry_proposals SET status=?, updated_at=datetime('now') WHERE id=?`).run(nextStatus, input.proposalId);
    audit("proposal_reviewed", "proposal", input.proposalId, input.reviewerId, { decision: input.decision, reviewId: id });
  });
  tx();
  return db.prepare(`SELECT * FROM foundry_acceptance_reviews WHERE id=?`).get(id) as FoundryAcceptanceRecord;
}

export function getFoundryProposal(id: string): FoundryProposalRecord | null {
  return (getDatabase().prepare(`SELECT * FROM foundry_proposals WHERE id=?`).get(id) as FoundryProposalRecord | undefined) ?? null;
}

export function listFoundryProposals(): FoundryProposalRecord[] {
  return getDatabase().prepare(`SELECT * FROM foundry_proposals ORDER BY created_at DESC`).all() as FoundryProposalRecord[];
}

export function listFoundryEvidence(proposalId: string): FoundryEvidenceRecord[] {
  return getDatabase().prepare(`SELECT * FROM foundry_evidence WHERE proposal_id=? ORDER BY created_at`).all(proposalId) as FoundryEvidenceRecord[];
}

export function listFoundryReviews(proposalId: string): FoundryAcceptanceRecord[] {
  return getDatabase().prepare(`SELECT * FROM foundry_acceptance_reviews WHERE proposal_id=? ORDER BY created_at`).all(proposalId) as FoundryAcceptanceRecord[];
}

export function getFoundryAudit(limit = 100): unknown[] {
  return getDatabase().prepare(`SELECT * FROM foundry_audit_log ORDER BY id DESC LIMIT ?`).all(Math.max(1, Math.min(limit, 500)));
}
