import assert from "node:assert/strict";
import crypto from "node:crypto";
import { describe, test } from "node:test";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { getContactById } from "../contacts/contactRepository.js";
import { createContact } from "../contacts/contactRepository.js";
import { commitImportRow } from "./ucieCommitService.js";
import {
  approveSchemaForSession,
  intakeCsvToSession,
  intakeOcrArtifact,
  searchVoters,
  seedVoterRecord,
  startImportSession,
} from "./ucieIntakeService.js";
import { getMatchResult } from "./ucieIdentityResolutionService.js";
import { listProvenanceForContact } from "./ucieProvenanceService.js";
import { getImportRow, listImportRows } from "./ucieSessionRepository.js";
import { claimWorkItem, listOpenWorkItems } from "./ucieWorkService.js";
import { resolveUcieAccessContext, UcieValidationError } from "./ucieValidator.js";

const WORKSPACE = `ucie-test-${crypto.randomUUID().slice(0, 8)}`;
const ADMIN = resolveUcieAccessContext({ user_id: "admin-user", role: "admin" });
const VIEWER = resolveUcieAccessContext({ user_id: "viewer-user", role: "viewer" });

describe("CONTACT-V3-100 UCIE", { concurrency: 1 }, () => {
  test("stage csv, schema discovery, identity resolution, commit with provenance", () => {
    bootstrapApp();
    try {
      createContact({
        workspace_id: WORKSPACE,
        display_name: "Existing Person",
        emails: [{ email: "existing@example.com", primary: true }],
      });

      const session = startImportSession(
        { workspace_id: WORKSPACE, source_type: "csv", source_label: "Volunteer export" },
        ADMIN,
      );

      const csv = [
        "Full Name,Email,Phone",
        "New Person,newperson@example.com,555-0100",
        "Existing Person,existing@example.com,555-0200",
      ].join("\n");

      const intake = intakeCsvToSession({
        session_id: session.session_id,
        filename: "volunteers.csv",
        csv_text: csv,
        uploaded_by_user_id: ADMIN.user_id,
      });
      assert.equal(intake.row_count, 2);
      assert.ok(intake.schema.mappings.length >= 2);

      const approvedMappings = intake.schema.mappings.map((m) => ({ ...m, approved: true }));
      approveSchemaForSession({
        session_id: session.session_id,
        mappings: approvedMappings,
        approved_by_user_id: ADMIN.user_id,
        remember_for_future: true,
      });

      const sessionRows = listImportRows(session.session_id);
      const existingRow = sessionRows.find((r) => {
        const raw = JSON.parse(r.raw_json) as Record<string, string>;
        return raw.Email === "existing@example.com";
      });
      assert.ok(existingRow);
      const match = getMatchResult(existingRow!.row_id);
      assert.ok(match);
      assert.equal(match!.outcome, "exact_match");

      const newRow = sessionRows.find((r) => {
        const raw = JSON.parse(r.raw_json) as Record<string, string>;
        return raw.Email === "newperson@example.com";
      });
      assert.ok(newRow);
      const newMatch = getMatchResult(newRow!.row_id);
      assert.ok(newMatch);
      assert.equal(newMatch!.outcome, "new_identity");

      const commit = commitImportRow({
        row_id: newRow!.row_id,
        committed_by_user_id: ADMIN.user_id,
      });
      assert.ok(commit);
      assert.equal(commit!.action, "created");
      const contact = getContactById(commit!.contact_id);
      assert.ok(contact);
      const provenance = listProvenanceForContact(commit!.contact_id);
      assert.ok(provenance.length > 0);
    } finally {
      shutdownApp();
    }
  });

  test("ocr workspace, work marketplace, voter assistant, RBAC", () => {
    bootstrapApp();
    try {
      seedVoterRecord({
        workspace_id: WORKSPACE,
        county: "Benton",
        last_name: "Smith",
        first_name: "Jane",
        address_line1: "123 Main St",
      });

      const session = startImportSession(
        { workspace_id: WORKSPACE, source_type: "ocr_image" },
        ADMIN,
      );
      const row_id = intakeOcrArtifact({
        session_id: session.session_id,
        filename: "signup.jpg",
        storage_ref: "/uploads/signup.jpg",
        extracted_fields: { display_name: "Jane Smith", county: "Benton" },
        uploaded_by_user_id: ADMIN.user_id,
      });

      const workItems = listOpenWorkItems(WORKSPACE);
      assert.ok(workItems.some((w) => w.item_type === "ocr_review"));
      const ocrItem = workItems.find((w) => w.row_id === row_id)!;
      const claimed = claimWorkItem({ work_item_id: ocrItem.work_item_id, user_id: "volunteer-1" });
      assert.equal(claimed!.status, "claimed");

      const voters = searchVoters({ workspace_id: WORKSPACE, county: "Benton", last_name: "Smith" });
      assert.ok(voters.length >= 1);

      assert.throws(
        () =>
          startImportSession({ workspace_id: WORKSPACE, source_type: "csv" }, VIEWER),
        (error: unknown) => error instanceof UcieValidationError && error.code === "forbidden",
      );
    } finally {
      shutdownApp();
    }
  });
});
