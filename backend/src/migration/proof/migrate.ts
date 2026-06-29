import { getDatabase } from "../../db/database.js";

export function migrateProofTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS migration_proof_sequences (
      prefix TEXT PRIMARY KEY,
      next_value INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS migration_proof_simulations (
      simulation_id TEXT PRIMARY KEY,
      certificate_id TEXT,
      report_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS migration_proof_certificates (
      certificate_id TEXT PRIMARY KEY,
      simulation_id TEXT NOT NULL,
      proof_percent REAL NOT NULL,
      result TEXT NOT NULL,
      report_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_proof_certificates_created
      ON migration_proof_certificates(created_at DESC);
  `);
}

function nextSequenceId(prefix: "SIM" | "CERT"): string {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO migration_proof_sequences (prefix, next_value) VALUES (?, 1)
     ON CONFLICT(prefix) DO NOTHING`,
  ).run(prefix);

  const row = db
    .prepare(`SELECT next_value FROM migration_proof_sequences WHERE prefix = ?`)
    .get(prefix) as { next_value: number };

  const value = row.next_value;
  db.prepare(`UPDATE migration_proof_sequences SET next_value = next_value + 1 WHERE prefix = ?`).run(
    prefix,
  );

  return `${prefix}-${String(value).padStart(6, "0")}`;
}

export function allocateSimulationId(): string {
  return nextSequenceId("SIM");
}

export function allocateCertificateId(): string {
  return nextSequenceId("CERT");
}

export function saveSimulationRecord(simulationId: string, certificateId: string | null, json: string): void {
  getDatabase()
    .prepare(
      `INSERT INTO migration_proof_simulations (simulation_id, certificate_id, report_json)
       VALUES (?, ?, ?)`,
    )
    .run(simulationId, certificateId, json);
}

export function saveCertificateRecord(
  certificateId: string,
  simulationId: string,
  proofPercent: number,
  result: string,
  json: string,
): void {
  getDatabase()
    .prepare(
      `INSERT INTO migration_proof_certificates
       (certificate_id, simulation_id, proof_percent, result, report_json)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(certificateId, simulationId, proofPercent, result, json);

  getDatabase()
    .prepare(`UPDATE migration_proof_simulations SET certificate_id = ? WHERE simulation_id = ?`)
    .run(certificateId, simulationId);
}

export function listRecentCertificates(limit = 10): string[] {
  const rows = getDatabase()
    .prepare(
      `SELECT report_json FROM migration_proof_certificates
       ORDER BY created_at DESC LIMIT ?`,
    )
    .all(limit) as { report_json: string }[];

  return rows.map((r) => r.report_json);
}

export function getCertificateById(certificateId: string): string | null {
  const row = getDatabase()
    .prepare(`SELECT report_json FROM migration_proof_certificates WHERE certificate_id = ?`)
    .get(certificateId) as { report_json: string } | undefined;
  return row?.report_json ?? null;
}
